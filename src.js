'use strict';
/*
 * WINTEER · fuentes de contenido por enlace (proceso principal, sin dependencias).
 *
 * Una "fuente" es un enlace a un manifiesto JSON que publica quien distribuye los juegos
 * (un desarrollador, un proyecto de código abierto, tu propio servidor, etc.).
 * WINTEER no trae ninguna fuente incluida: cada usuario agrega las suyas y es responsable de
 * usar solo fuentes con permiso para distribuir ese contenido.
 *
 * El formato del manifiesto está documentado en docs/manifiestos.md.
 * El emparejamiento con el catálogo y la biblioteca es SOLO por ID exacto (p. ej. "steam:730"),
 * nunca por parecido de nombres.
 */
const fs = require('fs'), path = require('path'), { pathToFileURL, fileURLToPath } = require('url'), http = require('http'), https = require('https'), crypto = require('crypto');
const { EventEmitter } = require('events');

const MAX_BYTES = 12 * 1024 * 1024, MAX_GAMES = 20000, MAX_VERS = 50, MAX_FILES = 200, MAX_INC = 20;
const UA = 'WINTEER/1 (+sources)';
const err = (code, msg) => Object.assign(new Error(msg), { code });
const str = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : typeof v === 'number' ? String(v).slice(0, n) : '');
const normId = (s) => str(s, 120).toLowerCase();

function fetchText(url, o) {
  o = o || {};
  return new Promise((resolve, reject) => {
    let u; try { u = new URL(url); } catch (e) { return reject(err('url', 'El enlace no es válido')); }
    if (u.protocol === 'file:' && o.allowFile) {
      try { const p = fileURLToPath(u), st = fs.statSync(p); if (st.size > MAX_BYTES) return reject(err('size', 'El manifiesto es demasiado grande')); return resolve({ text: fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''), etag: String(st.mtimeMs), url: u.href }); } catch (e) { return reject(err('file', 'No pude leer el archivo: ' + String(e.code || e.message).slice(0, 60))); }
    }
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return reject(err('url', 'El enlace tiene que empezar con http:// o https://'));
    const go = (url, hops) => {
      const lib = url.protocol === 'https:' ? https : http;
      const headers = { 'user-agent': UA, accept: 'application/json, */*', 'accept-encoding': 'identity' };
      if (o.etag) headers['if-none-match'] = o.etag;
      const req = lib.get(url, { headers }, (res) => {
        const sc = res.statusCode;
        if ([301, 302, 303, 307, 308].includes(sc) && res.headers.location) { res.resume(); if (hops >= 5) return reject(err('net', 'Demasiadas redirecciones')); let nx; try { nx = new URL(res.headers.location, url); } catch (e) { return reject(err('net', 'Redirección inválida')); } return go(nx, hops + 1); }
        if (sc === 304) { res.resume(); return resolve({ notModified: true, url: url.href }); }
        if (sc !== 200) { res.resume(); return reject(err('http', 'La fuente respondió HTTP ' + sc)); }
        const len = +res.headers['content-length'] || 0;
        if (len > MAX_BYTES) { res.destroy(); return reject(err('size', 'El manifiesto es demasiado grande')); }
        const ch = []; let n = 0;
        res.on('data', (c) => { n += c.length; if (n > MAX_BYTES) { res.destroy(); reject(err('size', 'El manifiesto es demasiado grande')); } else ch.push(c); });
        res.on('end', () => resolve({ text: Buffer.concat(ch).toString('utf8').replace(/^﻿/, ''), etag: res.headers.etag || '', url: url.href }));
        res.on('error', (e) => reject(err('net', 'Se cortó la conexión')));
      });
      req.setTimeout(o.timeout || 20000, () => req.destroy(err('net', 'La fuente tardó demasiado en responder')));
      req.on('error', (e) => reject(['net', 'url', 'http', 'size'].includes(e.code) ? e : err('net', 'No pude conectar con la fuente (' + (e.code || e.message) + ')')));
    };
    go(u, 0);
  });
}

function absUrl(v, base) { try { const u = new URL(String(v || '').trim(), base); const local = /^file:/i.test(String(base)); return u.protocol === 'http:' || u.protocol === 'https:' || u.protocol === 'magnet:' || (local && u.protocol === 'file:') ? u.href : ''; } catch (e) { return ''; } }
const isTorrent = (u) => /^magnet:/i.test(u) || /\.torrent(\?|#|$)/i.test(u);

function normFile(f, base) {
  if (typeof f === 'string') f = { url: f };
  if (!f || typeof f !== 'object') return null;
  const url = absUrl(f.url || f.href || f.link, base); if (!url) return null;
  const o = { url };
  const nm = str(f.name || f.filename, 160); if (nm) o.name = nm;
  const sz = Math.round(+f.size || 0); if (sz > 0) o.size = sz;
  const hs = Object.assign({}, typeof f.hash === 'object' && f.hash ? f.hash : {}, typeof f.checksums === 'object' && f.checksums ? f.checksums : {});
  for (const a of ['sha256', 'sha1', 'md5']) { const v = str(f[a] || hs[a], 128).toLowerCase(); if (/^[0-9a-f]{16,128}$/.test(v)) o[a] = v; }
  if (typeof f.hash === 'string') { const m = /^(sha256|sha1|md5):([0-9a-f]{16,128})$/i.exec(f.hash.trim()); if (m) o[m[1].toLowerCase()] = m[2].toLowerCase(); }
  return o;
}
function normVersion(v, base) {
  if (!v || typeof v !== 'object') return null;
  const raw = Array.isArray(v.files) ? v.files : v.url || v.link ? [v] : [];
  const files = raw.slice(0, MAX_FILES).map((f) => normFile(f, base)).filter(Boolean);
  if (!files.length) return null;
  const tor = files.some((f) => isTorrent(f.url));
  return { version: str(v.version || v.name, 60), date: str(v.date || v.released, 40), notes: str(v.notes || v.changelog, 600), size: files.reduce((s, f) => s + (f.size || 0), 0), transport: tor ? 'torrent' : 'http', files };
}
function normGame(g, base, key) {
  if (!g || typeof g !== 'object') return null;
  const ids = new Set(); for (const k of [g.id, key, g.gid, ...(Array.isArray(g.ids) ? g.ids : [])]) { const x = normId(k); if (x) ids.add(x); }
  if (g.steam || g.steamAppId || g.appid) { const n = parseInt(g.steam || g.steamAppId || g.appid, 10); if (n > 0) ids.add('steam:' + n); }
  const name = str(g.name || g.title, 160); if (!ids.size || !name) return null;
  let vers = Array.isArray(g.versions) ? g.versions : (g.files || g.url) ? [g] : [];
  const versions = vers.slice(0, MAX_VERS).map((v) => normVersion(v, base)).filter(Boolean);
  if (!versions.length) return null;
  const cover = absUrl(g.cover || g.image || g.icon, base);
  return { ids: [...ids], name, cover: /^magnet:/.test(cover) ? '' : cover, description: str(g.description || g.summary, 800), developer: str(g.developer || g.author, 120), versions };
}

/** Valida y normaliza un manifiesto ya leído (objeto). */
function normalize(m, baseUrl) {
  if (!m || typeof m !== 'object' || Array.isArray(m)) throw err('manifest', 'El manifiesto tiene que ser un objeto JSON');
  const sc = m.schema === undefined ? 1 : +m.schema;
  if (sc !== 1) throw err('schema', 'Versión de manifiesto no soportada (' + m.schema + '). Actualizá WINTEER.');
  let list = [];
  if (Array.isArray(m.games)) list = m.games.map((g) => [g, '']);
  else if (m.games && typeof m.games === 'object') list = Object.entries(m.games).map(([k, g]) => [g, k]);
  else if (!Array.isArray(m.include)) throw err('manifest', 'No encontré la lista "games" en el manifiesto');
  const games = [];
  let skipped = 0;
  for (const [g, k] of list.slice(0, MAX_GAMES)) { const n = normGame(g, baseUrl, k); if (n) games.push(n); else skipped++; }
  const inc = (Array.isArray(m.include) ? m.include : []).slice(0, MAX_INC).map((x) => absUrl(x, baseUrl)).filter((x) => x && !/^magnet:/.test(x));
  return { meta: { name: str(m.name, 80), description: str(m.description, 300), homepage: absUrl(m.homepage, baseUrl).replace(/^magnet:.*/, ''), updated: str(m.updated, 40) }, games, include: inc, skipped };
}

class Sources extends EventEmitter {
  /** @param {{file:string,dir:string}} o  file: sources.json · dir: carpeta para copias en caché */
  constructor(o) { super(); this.o = o; this.list_ = []; this.idx = new Map(); this.cache = new Map(); }
  load() {
    try { const j = JSON.parse(fs.readFileSync(this.o.file, 'utf8')); if (Array.isArray(j.sources)) this.list_ = j.sources.filter((s) => s && s.id && s.url); } catch (e) {}
    for (const s of this.list_) { try { this.cache.set(s.id, JSON.parse(fs.readFileSync(path.join(this.o.dir, s.id + '.json'), 'utf8'))); } catch (e) {} }
    this._index(); return this;
  }
  _save() { try { fs.mkdirSync(path.dirname(this.o.file), { recursive: true }); const t = this.o.file + '.tmp'; fs.writeFileSync(t, JSON.stringify({ v: 1, sources: this.list_ }, null, 1)); fs.renameSync(t, this.o.file); } catch (e) {} }
  _saveCache(id, c) { this.cache.set(id, c); try { fs.mkdirSync(this.o.dir, { recursive: true }); fs.writeFileSync(path.join(this.o.dir, id + '.json'), JSON.stringify(c)); } catch (e) {} }
  _index() {
    this.idx = new Map();
    for (const s of this.list_) {
      if (!s.enabled) continue; const c = this.cache.get(s.id); if (!c) continue;
      for (const g of c.games) for (const id of g.ids) { if (!this.idx.has(id)) this.idx.set(id, []); this.idx.get(id).push({ source: { id: s.id, name: s.name, url: s.url }, game: g }); }
    }
  }
  list() { return this.list_.map((s) => Object.assign({}, s, { games: (this.cache.get(s.id) || { games: [] }).games.length })); }

  /** Descarga el manifiesto (y sus "include") y lo deja listo para usar. */
  async _pull(url, etag) {
    const loc = /^file:/i.test(url);
    const r = await fetchText(url, { etag, allowFile: loc });
    if (r.notModified) return { notModified: true };
    let j; try { j = JSON.parse(r.text); } catch (e) { throw err('json', 'La fuente no devolvió un JSON válido'); }
    const top = normalize(j, r.url), games = top.games.slice(); let skipped = top.skipped;
    const seen = new Set([r.url]); let queue = top.include.slice(), n = 0;
    while (queue.length && n < MAX_INC) {
      const u = queue.shift(); if (seen.has(u)) continue; seen.add(u); n++;
      try { const x = await fetchText(u, { allowFile: loc }); const sub = normalize(JSON.parse(x.text), x.url); games.push(...sub.games); skipped += sub.skipped; if (sub.include.length && n < MAX_INC) queue.push(...sub.include.slice(0, 5)); } catch (e) { skipped++; }
      if (games.length > MAX_GAMES) break;
    }
    return { meta: top.meta, games: games.slice(0, MAX_GAMES), skipped, etag: r.etag };
  }
  async add(url, name) {
    url = String(url || '').trim();
    let u; try { u = new URL(url); } catch (e) { throw err('url', 'El enlace no es válido'); }
    if (u.protocol !== 'http:' && u.protocol !== 'https:') throw err('url', 'El enlace tiene que empezar con http:// o https://');
    const dup = this.list_.find((s) => s.url === u.href); if (dup) throw err('dup', 'Esa fuente ya está agregada: ' + dup.name);
    const c = await this._pull(u.href);
    if (!c.games.length) throw err('empty', 'La fuente no tiene ningún juego que WINTEER pueda usar (revisá el formato)');
    const s = { id: crypto.randomBytes(6).toString('hex'), url: u.href, name: str(name, 60) || c.meta.name || u.hostname, enabled: true, addedAt: Date.now(), updatedAt: Date.now(), etag: c.etag || '', error: '' };
    this.list_.push(s); this._saveCache(s.id, c); this._save(); this._index(); this.emit('change');
    return Object.assign({}, s, { games: c.games.length, skipped: c.skipped });
  }
  /** Agrega una fuente desde un archivo .json del disco. Los enlaces relativos se resuelven junto al archivo. */
  async addFile(file, name) {
    file = String(file || '').trim();
    if (!file || !path.isAbsolute(file)) throw err('file', 'Elegí un archivo .json');
    const url = pathToFileURL(path.resolve(file)).href;
    const dup = this.list_.find((s) => s.url === url); if (dup) throw err('dup', 'Ese archivo ya está agregado: ' + dup.name);
    const c = await this._pull(url);
    if (!c.games.length) throw err('empty', 'El archivo no tiene ningún juego que WINTEER pueda usar (revisá el formato)');
    const s = { id: crypto.randomBytes(6).toString('hex'), url, kind: 'file', path: path.resolve(file), name: str(name, 60) || c.meta.name || path.basename(file, path.extname(file)), enabled: true, addedAt: Date.now(), updatedAt: Date.now(), etag: c.etag || '', error: '' };
    this.list_.push(s); this._saveCache(s.id, c); this._save(); this._index(); this.emit('change');
    return Object.assign({}, s, { games: c.games.length, skipped: c.skipped });
  }
  remove(id) {
    const i = this.list_.findIndex((s) => s.id === id); if (i < 0) return false;
    this.list_.splice(i, 1); this.cache.delete(id); try { fs.rmSync(path.join(this.o.dir, id + '.json'), { force: true }); } catch (e) {}
    this._save(); this._index(); this.emit('change'); return true;
  }
  setEnabled(id, on) { const s = this.list_.find((x) => x.id === id); if (!s) return false; s.enabled = !!on; this._save(); this._index(); this.emit('change'); return true; }
  rename(id, name) { const s = this.list_.find((x) => x.id === id); const n = str(name, 60); if (!s || !n) return false; s.name = n; this._save(); this._index(); this.emit('change'); return true; }
  /** Actualiza una fuente (o todas). Si falla, conserva la copia anterior y anota el error. */
  async refresh(id) {
    const out = [];
    for (const s of this.list_.filter((x) => !id || x.id === id)) {
      try {
        const c = await this._pull(s.url, this.cache.has(s.id) ? s.etag : '');
        if (!c.notModified) { this._saveCache(s.id, c); s.etag = c.etag || ''; }
        s.updatedAt = Date.now(); s.error = '';
      } catch (e) { s.error = String(e.message || e).slice(0, 160); }
      out.push({ id: s.id, ok: !s.error, error: s.error });
    }
    this._save(); this._index(); this.emit('change'); return out;
  }
  /** Todas las fuentes activas que tienen ese juego (por ID exacto). */
  lookup(gid) { return (this.idx.get(normId(gid)) || []).map((x) => ({ source: x.source, game: x.game })); }
  /** Juegos de las fuentes activas, con filtro de texto opcional. */
  games(q, limit) {
    q = String(q || '').trim().toLowerCase(); const out = [];
    for (const s of this.list_) {
      if (!s.enabled) continue; const c = this.cache.get(s.id); if (!c) continue;
      for (const g of c.games) { if (q && !g.name.toLowerCase().includes(q) && !g.ids.some((i) => i.includes(q))) continue; out.push({ source: { id: s.id, name: s.name, url: s.url }, game: g }); if (out.length >= (limit || 200)) return out; }
    }
    return out;
  }
  /** Arma el pedido para el motor de descargas a partir de un juego y versión de una fuente. */
  spec(sourceId, gid, versionIdx, extra) {
    const hit = this.lookup(gid).find((x) => x.source.id === sourceId) || this.games('', 1e9).find((x) => x.source.id === sourceId && x.game.ids.includes(normId(gid)));
    if (!hit) throw err('nf', 'Esa fuente ya no tiene este juego');
    const v = hit.game.versions[Math.max(0, Math.min(hit.game.versions.length - 1, versionIdx | 0))];
    if (v.transport === 'torrent') throw err('transport', 'Esta versión se distribuye por BitTorrent, que todavía no está disponible en esta versión de WINTEER');
    const local = v.files.some((f) => /^file:/i.test(f.url));
    return Object.assign({ localOk: local, gid: normId(gid), name: hit.game.name, cover: hit.game.cover || '', version: v.version, files: v.files.map((f) => Object.assign({}, f)), source: { id: hit.source.id, name: hit.source.name, url: hit.source.url } }, extra || {});
  }
}

module.exports = { Sources, normalize, fetchText };
