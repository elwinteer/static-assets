// winteer-bt · ayudante BitTorrent de WINTEER (libtorrent-rasterbar 2.x)
// Habla con WINTEER por stdin/stdout: un JSON por línea. Protocolo en docs/bittorrent.md.
// No siembra: al terminar una descarga saca el torrent de la sesión y deja los archivos en disco.
#include <libtorrent/session.hpp>
#include <libtorrent/settings_pack.hpp>
#include <libtorrent/add_torrent_params.hpp>
#include <libtorrent/magnet_uri.hpp>
#include <libtorrent/torrent_handle.hpp>
#include <libtorrent/torrent_status.hpp>
#include <libtorrent/torrent_info.hpp>
#include <libtorrent/torrent_flags.hpp>
#include <libtorrent/alert_types.hpp>
#include <libtorrent/read_resume_data.hpp>
#include <libtorrent/write_resume_data.hpp>
#include <libtorrent/version.hpp>
#include <nlohmann/json.hpp>

#include <atomic>
#include <chrono>
#include <condition_variable>
#include <deque>
#include <fstream>
#include <iostream>
#include <iterator>
#include <mutex>
#include <sstream>
#include <string>
#include <thread>
#include <vector>
#include <filesystem>

using json = nlohmann::json;
namespace fs = std::filesystem;

static std::mutex g_out;
static void emit(const json& j) {
  std::lock_guard<std::mutex> lk(g_out);
  std::cout << j.dump() << "\n" << std::flush;
}

struct Item {
  std::string id;
  lt::torrent_handle h;
  bool finished = false;
  bool announcedMeta = false;
};

static std::mutex g_inMx;
static std::condition_variable g_inCv;
static std::deque<std::string> g_in;
static std::atomic<bool> g_eof{false};

static std::string statDir;

static std::string state_name(const lt::torrent_status& st) {
  if (st.flags & lt::torrent_flags::paused) return "paused";
  switch (st.state) {
    case lt::torrent_status::checking_files:
    case lt::torrent_status::checking_resume_data: return "checking";
    case lt::torrent_status::downloading_metadata: return "metadata";
    case lt::torrent_status::downloading: return "downloading";
    case lt::torrent_status::finished:
    case lt::torrent_status::seeding: return "finished";
    default: return "downloading";
  }
}

int main(int argc, char** argv) {
  std::ios::sync_with_stdio(false);
  for (int i = 1; i + 1 < argc; i++) if (std::string(argv[i]) == "--state") statDir = argv[i + 1];
  if (statDir.empty()) statDir = (fs::temp_directory_path() / "winteer-bt").string();
  std::error_code fec; fs::create_directories(statDir, fec);

  lt::settings_pack sp;
  sp.set_str(lt::settings_pack::user_agent, std::string("WINTEER/1 libtorrent/") + lt::version());
  sp.set_int(lt::settings_pack::alert_mask,
             lt::alert_category::error | lt::alert_category::status | lt::alert_category::storage);
  sp.set_bool(lt::settings_pack::enable_dht, true);
  sp.set_bool(lt::settings_pack::enable_lsd, true);
  lt::session ses(sp);

  std::vector<Item> items;
  auto find = [&](const std::string& id) -> Item* {
    for (auto& it : items) if (it.id == id) return &it;
    return nullptr;
  };
  auto findH = [&](const lt::torrent_handle& h) -> Item* {
    for (auto& it : items) if (it.h == h) return &it;
    return nullptr;
  };
  auto resumeFile = [&](const std::string& id) { return (fs::path(statDir) / (id + ".fastresume")).string(); };

  std::thread reader([] {
    std::string l;
    while (std::getline(std::cin, l)) { { std::lock_guard<std::mutex> lk(g_inMx); g_in.push_back(l); } g_inCv.notify_one(); }
    g_eof = true; g_inCv.notify_one();
  });

  bool quit = false;
  auto lastStatus = std::chrono::steady_clock::now();

  auto reply = [&](const json& m, bool ok, const std::string& code = "", const std::string& msg = "") {
    json r = {{"ev", ok ? "ack" : "nack"}, {"rid", m.value("rid", 0)}};
    if (!ok) { r["code"] = code; r["msg"] = msg; }
    emit(r);
  };

  auto handle = [&](const json& m) {
    const std::string op = m.value("op", "");
    if (op == "hello") { emit({{"ev", "hello"}, {"version", "1"}, {"lt", lt::version()}}); return; }
    if (op == "limits") {
      lt::settings_pack p;
      p.set_int(lt::settings_pack::download_rate_limit, m.value("down", 0));
      p.set_int(lt::settings_pack::upload_rate_limit, m.value("up", 0));
      ses.apply_settings(p); return;
    }
    if (op == "shutdown") { quit = true; return; }
    const std::string id = m.value("id", "");
    if (id.empty()) { reply(m, false, "bad-request", "falta id"); return; }
    if (op == "add") {
      if (Item* ex = find(id)) { ex->h.resume(); reply(m, true); return; }
      const std::string uri = m.value("uri", ""), dir = m.value("dir", "");
      if (uri.empty() || dir.empty()) { reply(m, false, "bad-request", "faltan uri o dir"); return; }
      std::error_code fe; fs::create_directories(dir, fe);
      lt::add_torrent_params p;
      lt::error_code ec;
      if (uri.rfind("magnet:", 0) == 0) {
        p = lt::parse_magnet_uri(uri, ec);
        if (ec) { reply(m, false, "bad-uri", ec.message()); return; }
      } else {
        p.ti = std::make_shared<lt::torrent_info>(uri, ec);
        if (ec) { reply(m, false, "bad-torrent", ec.message()); return; }
      }
      // retomar con los datos guardados, si existen
      std::ifstream rf(resumeFile(id), std::ios::binary);
      if (rf) {
        std::vector<char> buf((std::istreambuf_iterator<char>(rf)), std::istreambuf_iterator<char>());
        lt::error_code rec;
        lt::add_torrent_params rp = lt::read_resume_data(buf, rec);
        if (!rec) { if (!rp.ti && p.ti) rp.ti = p.ti; if (rp.info_hashes == lt::info_hash_t() ) rp.info_hashes = p.info_hashes; p = std::move(rp); }
      }
      p.save_path = dir;
      p.flags &= ~lt::torrent_flags::auto_managed;   // el control de cola lo hace WINTEER
      p.flags &= ~lt::torrent_flags::paused;
      lt::torrent_handle h = ses.add_torrent(std::move(p), ec);
      if (ec) { reply(m, false, "add-failed", ec.message()); return; }
      Item it; it.id = id; it.h = h; items.push_back(it);
      reply(m, true); return;
    }
    Item* it = find(id);
    if (op == "pause") { if (it) { it->h.pause(); it->h.save_resume_data(lt::torrent_handle::save_info_dict); } reply(m, true); return; }
    if (op == "resume") { if (it) it->h.resume(); reply(m, true); return; }
    if (op == "remove") {
      if (it) {
        ses.remove_torrent(it->h, m.value("deleteFiles", false) ? lt::session::delete_files : lt::remove_flags_t{});
        for (size_t i = 0; i < items.size(); i++) if (items[i].id == id) { items.erase(items.begin() + i); break; }
      }
      std::error_code fe; fs::remove(resumeFile(id), fe);
      reply(m, true); return;
    }
    reply(m, false, "bad-op", "orden desconocida: " + op);
  };

  while (!quit) {
    {
      std::unique_lock<std::mutex> lk(g_inMx);
      g_inCv.wait_for(lk, std::chrono::milliseconds(250), [] { return !g_in.empty() || g_eof; });
      std::deque<std::string> batch; batch.swap(g_in);
      lk.unlock();
      for (auto& l : batch) {
        json m = json::parse(l, nullptr, false);
        if (m.is_discarded() || !m.is_object()) continue;
        try { handle(m); } catch (const std::exception& e) { reply(m, false, "internal", e.what()); }
      }
    }
    if (g_eof) quit = true;

    std::vector<lt::alert*> alerts; ses.pop_alerts(&alerts);
    for (lt::alert* a : alerts) {
      if (auto* s = lt::alert_cast<lt::save_resume_data_alert>(a)) {
        if (Item* it = findH(s->handle)) {
          auto buf = lt::write_resume_data_buf(s->params);
          std::ofstream of(resumeFile(it->id), std::ios::binary | std::ios::trunc);
          of.write(buf.data(), (std::streamsize)buf.size());
        }
      } else if (auto* e = lt::alert_cast<lt::torrent_error_alert>(a)) {
        if (Item* it = findH(e->handle)) emit({{"ev", "error"}, {"id", it->id}, {"code", "torrent"}, {"msg", e->error.message()}});
      } else if (auto* fe = lt::alert_cast<lt::file_error_alert>(a)) {
        if (Item* it = findH(fe->handle)) emit({{"ev", "error"}, {"id", it->id}, {"code", "disk"}, {"msg", fe->error.message()}});
      }
    }

    auto now = std::chrono::steady_clock::now();
    if (now - lastStatus >= std::chrono::milliseconds(1000)) {
      lastStatus = now;
      std::vector<std::string> done;
      for (auto& it : items) {
        if (!it.h.is_valid()) continue;
        lt::torrent_status st = it.h.status();
        json s = {{"ev", "status"}, {"id", it.id}, {"state", state_name(st)},
                  {"done", (long long)st.total_wanted_done}, {"total", (long long)st.total_wanted},
                  {"down", st.download_payload_rate}, {"up", st.upload_payload_rate},
                  {"peers", st.num_peers}, {"seeds", st.num_seeds}, {"name", st.name}};
        std::string hs; { std::ostringstream o; o << st.info_hashes.get_best(); hs = o.str(); }
        s["hash"] = hs;
        emit(s);
        if (st.errc) { emit({{"ev", "error"}, {"id", it.id}, {"code", "torrent"}, {"msg", st.errc.message()}}); }
        if (!it.finished && (st.state == lt::torrent_status::finished || st.state == lt::torrent_status::seeding) && st.has_metadata) {
          it.finished = true;
          // Lista de archivos: se recorre lo descargado en disco (así no depende de la API de torrent_info, que cambió entre versiones)
          json files = json::array();
          {
            std::error_code fe2;
            fs::path base = fs::path(st.save_path), top = base / st.name;
            auto addFile = [&](const fs::path& p) {
              std::error_code e3; auto sz = fs::file_size(p, e3);
              files.push_back({{"p", fs::relative(p, base, e3).generic_string()}, {"s", (long long)(e3 ? 0 : sz)}});
            };
            if (fs::is_directory(top, fe2)) {
              for (auto& ent : fs::recursive_directory_iterator(top, fe2)) if (ent.is_regular_file(fe2)) addFile(ent.path());
            } else if (fs::is_regular_file(top, fe2)) addFile(top);
          }
          emit({{"ev", "finished"}, {"id", it.id}, {"root", st.save_path}, {"files", files}});
          done.push_back(it.id);
        }
      }
      // no se siembra: se saca de la sesión y los archivos quedan en disco
      for (auto& id : done) {
        if (Item* it = find(id)) {
          ses.remove_torrent(it->h);
          for (size_t i = 0; i < items.size(); i++) if (items[i].id == id) { items.erase(items.begin() + i); break; }
        }
      }
    }
  }

  for (auto& it : items) if (it.h.is_valid()) { it.h.pause(); it.h.save_resume_data(lt::torrent_handle::save_info_dict); }
  std::this_thread::sleep_for(std::chrono::milliseconds(700));
  std::vector<lt::alert*> al; ses.pop_alerts(&al);
  for (lt::alert* a : al) if (auto* s = lt::alert_cast<lt::save_resume_data_alert>(a)) {
    if (Item* it = findH(s->handle)) { auto buf = lt::write_resume_data_buf(s->params); std::ofstream of(resumeFile(it->id), std::ios::binary | std::ios::trunc); of.write(buf.data(), (std::streamsize)buf.size()); }
  }
  if (reader.joinable()) reader.detach();
  return 0;
}
