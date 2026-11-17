'use strict';
/*
 * WINTEER · motor de descargas e instalación (proceso principal, sin dependencias).
 *
 *  Etapa 1 · descargas  : cola, simultáneas, pausa/reanuda/cancela, límite de velocidad, reintentos,
 *                         reanudación por rangos HTTP, verificación SHA-256/SHA-1/MD5, persistencia.
 *  Etapa 2 · instalación: extracción (7-Zip inyectado), archivos temporales, espacio en disco,
 *                         detección de ejecutable, marcador de instalación y desinstalación.
 *  Etapa 3 · biblioteca : emite 'installed' / 'uninstalled'; la biblioteca (renderer) los adopta.
 *
 * Los "transportes" (HTTP hoy, BitTorrent/libtorrent en la etapa 6) se registran en `Dl.transports`.
 * Nada de esto toca la interfaz: el renderer solo recibe eventos y llama a la API.
 */
const fs = require('fs'), path = require('path'), http = require('http'), https = require('https'), crypto = require('crypto');
const { EventEmitter } = require('events');

const UA = 'WINTEER/1 (+download-manager)';
const MARK = '.winteer-install.json';
const S = { Q: 'queued', D: 'downloading', P: 'paused', V: 'verifying', X: 'extracting', I: 'installing', C: 'completed', E: 'error' };
const FINAL = new Set([S.C, S.E]);
const ARCH = /\.(zip|rar|7z|tar|gz|tgz|bz2|xz|cab)$/i;
const ARCH_PART2 = /(\.part0*([2-9]|[1-9]\d+)\.rar|\.r\d\d|\.(00[2-9]|0[1-9]\d|[1-9]\d\d)|\.z\d\d)$/i; // continuaciones de archivos partidos
const MAX_TRIES = 6;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const RESERVED = /^(con|prn|aux|nul|com\d|lpt\d)(\..*)?$/i;
function safeName(s, d) {
  let n = String(s == null ? '' : s).replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').replace(/\s+/g, ' ').replace(/^[.\s]+|[.\s]+$/g, '').slice(0, 120);
  if (!n || RESERVED.test(n)) n = (d || 'item') + (n ? '_' + n : '');
  return n;
}
const err = (code, msg, extra) => Object.assign(new Error(msg), { code, fatal: true }, extra || {});
const PAUSE = Object.assign(new Error('pause'), { pause: true }), CANCEL = Object.assign(new Error('cancel'), { cancel: true });
const mkid = () => crypto.randomBytes(8).toString('hex');
const exists = (p) => { try { fs.accessSync(p); return true; } catch (e) { return false; } };
const rm = (p) => { try { fs.rmSync(p, { recursive: true, force: true }); } catch (e) {} };

class Limiter {
  constructor() { this.rate = 0; this.next = 0; }
  delay(n) {
    if (!this.rate) return 0;
    const now = Date.now(), t = Math.max(now, this.next) + (n / this.rate) * 1000;
    this.next = t;
    return Math.max(0, t - now - 200);
  }
}

class Dl extends EventEmitter {
  /**
   * @param {object} o
   *  file         ruta del JSON de estado
   *  defaults     { dlDir, installDir }
   *  extract      async (archivo, carpetaDestino, onProgreso(0..1)) => { ok:1 } | { err:'texto' }
   *  archiveSize  async (archivo) => bytes descomprimidos (0 si no se sabe)
   *  findExes     (carpeta) => { exes:[{p,rel,size}], pick:'' }
   *  statfs       (ruta) => { free, total } (opcional, para pruebas)
   */
  constructor(o) {
    super();
    this.o = o;
    this.items = new Map();
    this.cfg = Object.assign({ dlDir: o.defaults.dlDir, installDir: o.defaults.installDir, maxActive: 3, speedLimit: 0, keepArchives: false }, {});
    this.lim = new Limiter();
    this._dl = new Set();
    this._dirty = new Set();
    this._timer = null; this._saveT = null; this._saving = false;
    this._instChain = Promise.resolve();
    this._stopped = false;
    this.transports = { http: { start: (it, f, part, ctl) => this._httpGet(it, f, part, ctl) } };
  }

  /* ---------- persistencia ---------- */
  load() {
    let j = null;
    try { j = JSON.parse(fs.readFileSync(this.o.file, 'utf8')); } catch (e) {}
    if (j && j.cfg) { for (const k of ['dlDir', 'installDir', 'maxActive', 'speedLimit', 'keepArchives']) if (j.cfg[k] !== undefined) this.cfg[k] = j.cfg[k]; }
    this.lim.rate = this.cfg.speedLimit || 0;
    if (j && Array.isArray(j.items)) {
      for (const it of j.items) {
        if (!it || !it.id || !Array.isArray(it.files)) continue;
        // Lo que estaba en curso cuando se cerró vuelve a la cola (se reanuda solo). Lo pausado por el usuario sigue pausado.
        if ([S.D, S.V, S.X, S.I].includes(it.status)) it.status = S.Q;
        it.p = it.p || {}; it.p.speed = 0; it.p.eta = 0;
        this.items.set(it.id, it);
      }
    }
    return this;
  }
  _persist(now) {
    if (this._saveT && !now) return;
    const w = () => {
      this._saveT = null;
      const data = JSON.stringify({ v: 1, cfg: this.cfg, items: [...this.items.values()].map((i) => this._clean(i, true)) });
      try { fs.mkdirSync(path.dirname(this.o.file), { recursive: true }); const t = this.o.file + '.tmp'; fs.writeFileSync(t, data); fs.renameSync(t, this.o.file); } catch (e) {}
    };
    if (now) { clearTimeout(this._saveT); w(); } else this._saveT = setTimeout(w, 1200);
  }
  _clean(it, keepFiles) {
    const c = JSON.parse(JSON.stringify(it, (k, v) => (k[0] === '_' ? undefined : v)));
    return c;
  }
  snapshot(it) { return this._clean(it); }
  list() { return [...this.items.values()].sort((a, b) => a.createdAt - b.createdAt).map((i) => this.snapshot(i)); }
  get(id) { const i = this.items.get(id); return i ? this.snapshot(i) : null; }
  _touch(it) { this._dirty.add(it.id); if (!this._timer) this._timer = setTimeout(() => { this._timer = null; const ids = [...this._dirty]; this._dirty.clear(); for (const id of ids) { const i = this.items.get(id); if (i) this.emit('update', this.snapshot(i)); } this._persist(); }, 250); }
  _set(it, st, extra) { it.status = st; if (extra) Object.assign(it, extra); this._touch(it); this._persist(true); }

  /* ---------- configuración y disco ---------- */
  getCfg() { return Object.assign({}, this.cfg); }
  setCfg(c) {
    c = c || {};
    if (typeof c.dlDir === 'string' && path.isAbsolute(c.dlDir)) this.cfg.dlDir = path.normalize(c.dlDir);
    if (typeof c.installDir === 'string' && path.isAbsolute(c.installDir)) this.cfg.installDir = path.normalize(c.installDir);
    if (c.maxActive !== undefined) this.cfg.maxActive = Math.max(1, Math.min(10, Math.round(+c.maxActive) || 1));
    if (c.speedLimit !== undefined) { this.cfg.speedLimit = Math.max(0, Math.round(+c.speedLimit) || 0); this.lim.rate = this.cfg.speedLimit; }
    if (c.keepArchives !== undefined) this.cfg.keepArchives = !!c.keepArchives;
    this._persist(true); this._pump();
    return this.getCfg();
  }
  disk(p) {
    let q = path.resolve(p || this.cfg.dlDir);
    while (!exists(q) && path.dirname(q) !== q) q = path.dirname(q);
    try {
      if (this.o.statfs) return this.o.statfs(q);
      const s = fs.statfsSync(q);
      return { free: s.bsize * s.bavail, total: s.bsize * s.blocks, path: q };
    } catch (e) { return { free: -1, total: -1, path: q }; }
  }

  /* ---------- API ---------- */
  /**
   * spec: { gid, name, cover?, version?, files:[{url,name?,size?,sha256?|sha1?|md5?}], installDir?, autoInstall?, keepArchives?, source?, meta? }
   * gid  = identificador único del juego (p. ej. "steam:730"): lo usa la biblioteca para evitar duplicados.
   */
  add(spec) {
    if (!spec || typeof spec !== 'object') throw err('spec', 'Pedido inválido');
    const name = String(spec.name || '').trim().slice(0, 160);
    if (!name) throw err('spec', 'Falta el nombre del juego');
    const gid = String(spec.gid || '').trim().slice(0, 120);
    if (!gid) throw err('spec', 'Falta el ID único del juego');
    if (!Array.isArray(spec.files) || !spec.files.length || spec.files.length > 200) throw err('spec', 'No hay archivos para descargar');
    const dup = [...this.items.values()].find((i) => i.gid === gid && i.status !== S.E && !(i.status === S.C && !(i.result && exists(i.result.dir))));
    if (dup) return Object.assign(this.snapshot(dup), { dup: true });
    const used = new Set(), files = spec.files.map((f, n) => {
      if (!f || typeof f.url !== 'string') throw err('spec', 'Archivo sin dirección');
      let u; try { u = new URL(f.url); } catch (e) { throw err('spec', 'Dirección inválida: ' + String(f.url).slice(0, 80)); }
      if (u.protocol === 'magnet:' || /\.torrent$/i.test(u.pathname)) throw err('transport', 'BitTorrent todavía no está disponible en esta versión');
      if (u.protocol !== 'http:' && u.protocol !== 'https:') throw err('spec', 'Solo se admiten enlaces http(s)');
      let nm = safeName(f.name || decodeURIComponent(path.basename(u.pathname)) || 'archivo' + n, 'archivo');
      while (used.has(nm.toLowerCase())) nm = n + '_' + nm;
      used.add(nm.toLowerCase());
      const o = { url: u.href, name: nm, size: Math.max(0, Math.round(+f.size) || 0), got: 0, done: false };
      for (const a of ['sha256', 'sha1', 'md5']) if (typeof f[a] === 'string' && /^[0-9a-f]{16,128}$/i.test(f[a])) o[a] = f[a].toLowerCase();
      return o;
    });
    if (spec.installDir && !path.isAbsolute(String(spec.installDir))) throw err('spec', 'La carpeta de instalación debe ser una ruta completa');
    const it = {
      id: mkid(), gid, name, cover: typeof spec.cover === 'string' ? spec.cover.slice(0, 600) : '', version: String(spec.version || '').slice(0, 60),
      source: spec.source && typeof spec.source === 'object' ? JSON.parse(JSON.stringify(spec.source)) : null,
      meta: spec.meta && typeof spec.meta === 'object' ? JSON.parse(JSON.stringify(spec.meta)) : null,
      transport: 'http', files, createdAt: Date.now(), status: S.Q,
      installDir: spec.installDir ? path.normalize(String(spec.installDir)) : '', autoInstall: spec.autoInstall !== false, keepArchives: spec.keepArchives === undefined ? null : !!spec.keepArchives,
      p: { done: 0, total: files.reduce((s, f) => s + f.size, 0), speed: 0, eta: 0, phase: 'queued', pct: 0 }, error: null, result: null, libSynced: false,
    };
    const total = it.p.total;
    if (total > 0) {
      const d = this.disk(this._itemDir(it)).free;
      if (d >= 0 && d < total + 5e7) throw err('space', 'No hay espacio en disco: hacen falta ' + fmt(total) + ' y quedan ' + fmt(d), { need: total, free: d });
    }
    this.items.set(it.id, it);
    this._set(it, S.Q);
    this._pump();
    return this.snapshot(it);
  }
  pause(id) {
    const it = this.items.get(id); if (!it) return false;
    if (it._run && [S.D, S.V].includes(it.status)) { it._run.pause = true; this._abort(it); return true; }
    if (it.status === S.Q) { this._set(it, S.P); return true; }
    return false;
  }
  resume(id) {
    const it = this.items.get(id); if (!it || it.status !== S.P) return false;
    if (it._run) { it._run.resumeAfter = true; return true; }
    this._set(it, S.Q); this._pump(); return true;
  }
  retry(id) {
    const it = this.items.get(id); if (!it || it.status !== S.E) return false;
    it.error = null; this._set(it, S.Q); this._pump(); return true;
  }
  async cancel(id) {
    const it = this.items.get(id); if (!it) return false;
    if (it._run) { it._run.cancel = true; this._abort(it); await it._run.done; }
    rm(this._itemDir(it)); rm(path.join(this._tmpParent(it), '.wt-inst-' + it.id));
    this.items.delete(id); this.emit('removed', { id }); this._persist(true);
    return true;
  }
  /** Quita un registro terminado (completado o con error) sin tocar el juego instalado. */
  forget(id) {
    const it = this.items.get(id); if (!it || (it._run && !FINAL.has(it.status))) return false;
    if (it.status === S.E) rm(this._itemDir(it));
    this.items.delete(id); this.emit('removed', { id }); this._persist(true); return true;
  }
  markSynced(id) { const it = this.items.get(id); if (it) { it.libSynced = true; this._persist(); } return !!it; }
  setDest(id, dir) { const it = this.items.get(id); if (!it || FINAL.has(it.status) || it.status === S.I || it.status === S.X) return false; if (!path.isAbsolute(dir)) return false; it.installDir = path.normalize(dir); this._persist(); return true; }

  /** Desinstala: borra la carpeta del juego solo si tiene nuestro marcador. */
  async uninstall(ref) {
    let dir = '', it = null;
    if (ref && ref.id) { it = this.items.get(ref.id); dir = it && it.result ? it.result.dir : ''; }
    if (!dir && ref && ref.dir) dir = String(ref.dir);
    if (!dir || !path.isAbsolute(dir)) throw err('uninstall', 'No sé qué carpeta desinstalar');
    dir = path.resolve(dir);
    if (path.dirname(dir) === dir || dir.split(path.sep).filter(Boolean).length < 2) throw err('uninstall', 'Carpeta no permitida');
    let mk; try { mk = JSON.parse(fs.readFileSync(path.join(dir, MARK), 'utf8')); } catch (e) { throw err('uninstall', 'Esa carpeta no fue instalada por WINTEER, no la toco'); }
    if (it && mk.id && mk.id !== it.id) throw err('uninstall', 'La carpeta no corresponde a este juego');
    try { fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 }); } catch (e) { throw err('uninstall', 'No pude borrar la carpeta: ' + String(e.message || e).slice(0, 100)); }
    if (exists(dir)) throw err('uninstall', 'Quedaron archivos en uso, cerrá el juego y probá de nuevo');
    const info = { id: mk.id || (it && it.id) || '', gid: mk.gid || (it && it.gid) || '', dir };
    if (it) { rm(this._itemDir(it)); this.items.delete(it.id); this.emit('removed', { id: it.id }); }
    this.emit('uninstalled', info); this._persist(true);
    return info;
  }
  /** Pausa todo para cerrar la app: lo activo vuelve a la cola y se reanuda al abrir. */
  async shutdown() {
    this._stopped = true;
    const w = [];
    for (const it of this.items.values()) if (it._run) { it._run.shutdown = true; this._abort(it); w.push(it._run.done); }
    await Promise.race([Promise.all(w), sleep(4000)]);
    for (const it of this.items.values()) if ([S.D, S.V].includes(it.status)) it.status = S.Q;
    this._persist(true);
  }

  /* ---------- planificador ---------- */
  _itemDir(it) { return path.join(this.cfg.dlDir, 'wt-' + it.id); }
  _tmpParent(it) { return it.installDir ? path.dirname(it.installDir) : this.cfg.installDir; }
  start() { this._stopped = false; this._pump(); return this; }
  _pump() {
    if (this._stopped) return;
    const q = [...this.items.values()].filter((i) => i.status === S.Q && !i._run).sort((a, b) => a.createdAt - b.createdAt);
    for (const it of q) {
      if (this._dl.size >= this.cfg.maxActive) break;
      this._launch(it);
    }
  }
  _abort(it) { try { it._run && it._run.abort && it._run.abort(); } catch (e) {} }
  _launch(it) {
    const ctl = { pause: false, cancel: false, shutdown: false, abort: null, resumeAfter: false };
    it._run = ctl; this._dl.add(it.id);
    ctl.done = (async () => {
      let release = true;
      try {
        await this._download(it, ctl);
        this._dl.delete(it.id); release = false; this._pump();
        if (it.autoInstall) await this._install(it, ctl);
        else { this._set(it, S.C, { p: Object.assign(it.p, { phase: 'done', speed: 0, eta: 0, pct: 1 }) }); this.emit('downloaded', this.snapshot(it)); }
      } catch (e) {
        if (e === PAUSE || e.pause) { this._set(it, ctl.shutdown ? S.Q : S.P, { p: Object.assign(it.p, { speed: 0, eta: 0 }) }); }
        else if (e === CANCEL || e.cancel) { /* lo limpia cancel() */ }
        else {
          it.error = { code: e.code || 'error', msg: String(e.message || e).slice(0, 220) };
          this._set(it, S.E, { p: Object.assign(it.p, { speed: 0, eta: 0 }) });
        }
      } finally {
        if (release) this._dl.delete(it.id);
        const again = ctl.resumeAfter && !ctl.shutdown && !ctl.cancel;
        it._run = null;
        if (again && it.status === S.P) it.status = S.Q;
        this._pump();
      }
    })();
  }

  /* ---------- descarga ---------- */
  _calc(it) {
    let done = 0, total = 0, unknown = false;
    for (const f of it.files) { const s = f.size || 0; if (!s) unknown = true; total += s; done += f.done ? (s || f.got) : f.got; }
    it.p.done = done; it.p.total = total;
    it.p.pct = total > 0 ? Math.min(1, done / total) : 0;
    return { done, total, unknown };
  }
  _speed(it, n) {
    const now = Date.now(), w = it._sp || (it._sp = []);
    w.push([now, n]); while (w.length && now - w[0][0] > 4000) w.shift();
    if (w.length > 1) { const b = w.reduce((s, x) => s + x[1], 0), dt = Math.max(500, now - w[0][0]); it.p.speed = Math.round((b * 1000) / dt); } else it.p.speed = 0;
    const left = Math.max(0, it.p.total - it.p.done);
    it.p.eta = it.p.speed > 0 && it.p.total > 0 ? Math.ceil(left / it.p.speed) : 0;
  }
  async _download(it, ctl) {
    it.p.phase = 'download'; this._set(it, S.D);
    const dir = this._itemDir(it); fs.mkdirSync(dir, { recursive: true });
    for (const f of it.files) {
      if (f.done && exists(path.join(dir, f.name))) continue;
      f.done = false;
      await this._file(it, f, dir, ctl);
    }
    it._sp = []; it.p.speed = 0; it.p.eta = 0;
  }
  async _file(it, f, dir, ctl) {
    const part = path.join(dir, f.name + '.part'), final = path.join(dir, f.name);
    let tries = 0;
    for (;;) {
      if (ctl.cancel) throw CANCEL; if (ctl.pause || ctl.shutdown) throw PAUSE;
      const before = f.got;
      try {
        await this.transports[it.transport].start(it, f, part, ctl);
        break;
      } catch (e) {
        if (e === PAUSE || e.pause) throw PAUSE; if (e === CANCEL || e.cancel) throw CANCEL;
        if (e.fatal) throw e;
        if (f.got > before) tries = 0;
        if (++tries > MAX_TRIES) throw err('network', 'Se cortó la conexión y no pude retomarla (' + String(e.message || e).slice(0, 80) + ')');
        it.p.phase = 'retry'; this._touch(it);
        const wait = Math.min(15000, 600 * 2 ** (tries - 1));
        for (let t = 0; t < wait; t += 100) { if (ctl.cancel || ctl.pause || ctl.shutdown) break; await sleep(100); }
        it.p.phase = 'download';
      }
    }
    let sz = 0; try { sz = fs.statSync(part).size; } catch (e) {}
    if (f.size && sz !== f.size) { rm(part); f.got = 0; throw err('integrity', 'El tamaño de "' + f.name + '" no coincide (' + sz + ' de ' + f.size + ' bytes)'); }
    if (!f.size) f.size = sz;
    fs.renameSync(part, final);
    const alg = f.sha256 ? 'sha256' : f.sha1 ? 'sha1' : f.md5 ? 'md5' : '';
    if (alg) {
      it.p.phase = 'verify'; this._set(it, S.V);
      const h = await this._hash(final, alg, (n) => { f.got = n; this._calc(it); this._touch(it); }, ctl);
      if (h !== f[alg]) { rm(final); f.got = 0; throw err('integrity', 'La verificación de "' + f.name + '" falló: el archivo está dañado o fue modificado'); }
      f.got = sz; it.p.phase = 'download'; this._set(it, S.D);
    }
    f.got = f.size; f.done = true; this._calc(it); this._set(it, it.status);
  }
  _hash(file, alg, onP, ctl) {
    return new Promise((res, rej) => {
      const h = crypto.createHash(alg), s = fs.createReadStream(file); let n = 0;
      s.on('data', (c) => { h.update(c); n += c.length; if (onP) onP(n); if (ctl && (ctl.cancel || ctl.pause || ctl.shutdown)) { s.destroy(); rej(ctl.cancel ? CANCEL : PAUSE); } });
      s.on('end', () => res(h.digest('hex'))); s.on('error', rej);
    });
  }
  _httpGet(it, f, part, ctl) {
    return new Promise((resolve, reject) => {
      let off = 0; try { off = fs.statSync(part).size; } catch (e) {}
      if (f.size && off > f.size) { rm(part); off = 0; }
      if (f.size && off === f.size) { f.got = off; return resolve(); }
      let ws = null, req = null, closed = false, n = 0;
      const finish = (e) => {
        if (closed) return; closed = true; ctl.abort = null;
        const end = () => { if (ctl.cancel) return reject(CANCEL); if (ctl.pause || ctl.shutdown) return reject(PAUSE); e ? reject(e) : resolve(); };
        if (ws) ws.end(end); else end();
      };
      ctl.abort = () => { try { req && req.destroy(); } catch (e) {} finish(null); };
      const go = (url, hops) => {
        let u; try { u = new URL(url); } catch (e) { return finish(err('url', 'Dirección inválida')); }
        const lib = u.protocol === 'https:' ? https : http;
        const headers = { 'user-agent': UA, accept: '*/*', 'accept-encoding': 'identity' };
        if (off > 0) { headers.range = 'bytes=' + off + '-'; if (f.etag) headers['if-range'] = f.etag; }
        req = lib.get(u, { headers }, (res) => {
          const sc = res.statusCode;
          if ([301, 302, 303, 307, 308].includes(sc) && res.headers.location) { res.resume(); if (hops >= 6) return finish(err('redirect', 'Demasiadas redirecciones')); return go(new URL(res.headers.location, u).href, hops + 1); }
          if (sc === 416) {
            res.resume(); const m = /\/(\d+)$/.exec(res.headers['content-range'] || '');
            if (m && +m[1] === off) { f.got = off; return finish(null); }
            rm(part); off = 0; f.got = 0; return finish(new Error('Rango inválido, reinicio la descarga'));
          }
          if (sc !== 200 && sc !== 206) { res.resume(); const e = new Error('El servidor respondió HTTP ' + sc); e.fatal = !(sc === 408 || sc === 429 || sc >= 500); if (e.fatal) e.code = 'http'; return finish(e); }
          let total = 0, append = false;
          if (sc === 206) {
            const m = /bytes (\d+)-(\d+)\/(\d+|\*)/.exec(res.headers['content-range'] || '');
            if (!m || +m[1] !== off) { res.resume(); rm(part); off = 0; f.got = 0; return finish(new Error('Respuesta parcial inesperada')); }
            total = m[3] === '*' ? 0 : +m[3]; append = true;
          } else { off = 0; total = +res.headers['content-length'] || 0; }
          if (total && f.size && total !== f.size) { res.resume(); return finish(err('integrity', 'El servidor informa un tamaño distinto al esperado (' + total + ' en vez de ' + f.size + ')')); }
          if (total && !f.size) f.size = total;
          if (res.headers.etag && !/^W\//.test(res.headers.etag)) f.etag = res.headers.etag;
          ws = fs.createWriteStream(part, { flags: append ? 'a' : 'w' });
          ws.on('error', (e) => { try { req.destroy(); } catch (x) {} finish(err('disk', 'No pude escribir en el disco: ' + String(e.message || e).slice(0, 80))); });
          f.got = append ? off : 0; n = f.got;
          let hold = 0;
          const upd = () => { if (hold > 0) res.pause(); else res.resume(); };
          res.setTimeout(30000, () => { try { req.destroy(); } catch (e) {} finish(new Error('El servidor dejó de enviar datos')); });
          res.on('data', (c) => {
            if (closed) return;
            if (!ws.write(c)) { hold++; upd(); ws.once('drain', () => { hold--; upd(); }); }
            f.got += c.length; n += c.length; this._calc(it); this._speed(it, c.length); this._touch(it);
            const w = this.lim.delay(c.length);
            if (w > 15) { hold++; upd(); setTimeout(() => { hold--; upd(); }, w); }
          });
          res.on('end', () => { if (total && f.got < total) return finish(new Error('La conexión se cortó antes de terminar')); finish(null); });
          res.on('error', (e) => finish(e));
          res.on('aborted', () => finish(new Error('La conexión se cortó')));
          res.on('close', () => { if (!res.complete) finish(new Error('La conexión se cortó')); });
        });
        req.on('error', (e) => finish(e));
        req.setTimeout(30000, () => { try { req.destroy(new Error('Tiempo de espera agotado')); } catch (e) {} });
      };
      go(f.url, 0);
    });
  }

  /* ---------- instalación ---------- */
  _install(it, ctl) {
    const run = this._instChain.then(() => this._doInstall(it, ctl));
    this._instChain = run.catch(() => {});
    return run;
  }
  async _doInstall(it, ctl) {
    const dir = this._itemDir(it);
    const parentBase = this._tmpParent(it);
    let dest = it.installDir;
    if (!dest) {
      const base = safeName(it.name, 'Juego'); dest = path.join(this.cfg.installDir, base);
      for (let n = 2; exists(dest) && fs.readdirSync(dest).length; n++) dest = path.join(this.cfg.installDir, base + ' (' + n + ')');
    } else if (exists(dest) && fs.readdirSync(dest).length) throw err('dest', 'La carpeta de destino no está vacía: ' + dest);
    const parent = path.dirname(dest), tmp = path.join(parent, '.wt-inst-' + it.id);
    it.p.phase = 'install'; it.p.speed = 0; it.p.eta = 0; it.p.pct = 0;
    try {
      if (ctl.cancel) throw CANCEL;
      fs.mkdirSync(parent, { recursive: true }); rm(tmp); fs.mkdirSync(tmp, { recursive: true });
      this._set(it, S.I);
      const main = [], loose = [];
      for (const f of it.files) {
        if (ARCH.test(f.name) || /\.(00[1-9])$/.test(f.name)) { if (ARCH_PART2.test(f.name)) continue; main.push(f); } else if (ARCH_PART2.test(f.name)) continue; else loose.push(f);
      }
      // espacio para lo que se va a descomprimir
      let need = 0; for (const f of main) need += await this.o.archiveSize(path.join(dir, f.name)).catch(() => 0);
      for (const f of loose) need += f.size || 0;
      const free = this.disk(parent).free;
      if (need > 0 && free >= 0 && free < need + 5e7) throw err('space', 'No hay espacio para instalar: necesita ' + fmt(need) + ' y quedan ' + fmt(free), { need, free });
      let idx = 0;
      for (const f of main) {
        if (ctl.cancel) throw CANCEL;
        this._set(it, S.X); it.p.phase = 'extract'; this._touch(it);
        const file = path.join(dir, f.name);
        let r = await this.o.extract(file, tmp, (v) => { it.p.pct = (idx + v) / main.length; this._touch(it); });
        if (!r || !r.ok) throw err('extract', (r && r.err) || 'No pude descomprimir "' + f.name + '"');
        let ents = fs.readdirSync(tmp);
        if (ents.length === 1 && /\.tar$/i.test(ents[0]) && !/\.tar$/i.test(f.name)) {
          const t2 = tmp + '-t'; rm(t2); fs.mkdirSync(t2, { recursive: true });
          r = await this.o.extract(path.join(tmp, ents[0]), t2, null); rm(tmp);
          if (!r || !r.ok) { rm(t2); throw err('extract', (r && r.err) || 'No pude descomprimir "' + f.name + '"'); }
          fs.renameSync(t2, tmp);
        }
        idx++;
      }
      for (const f of loose) fs.copyFileSync(path.join(dir, f.name), path.join(tmp, f.name));
      this._set(it, S.I); it.p.phase = 'install'; it.p.pct = 1;
      let ents = fs.readdirSync(tmp);
      if (!ents.length) throw err('extract', 'El contenido estaba vacío');
      let src = tmp;
      if (ents.length === 1 && fs.statSync(path.join(tmp, ents[0])).isDirectory()) src = path.join(tmp, ents[0]);
      if (exists(dest)) rm(dest);
      fs.renameSync(src, dest);
      rm(tmp);
      // verificación de lo instalado + ejecutables + marcador
      let count = 0, bytes = 0;
      const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else { count++; try { bytes += fs.statSync(p).size; } catch (x) {} } } };
      walk(dest);
      if (!count) throw err('extract', 'No quedó ningún archivo instalado');
      let fx = { exes: [], pick: '' }; try { fx = this.o.findExes ? this.o.findExes(dest) : fx; } catch (e) {}
      const mk = { v: 1, id: it.id, gid: it.gid, name: it.name, version: it.version, installedAt: Date.now(), exe: fx.pick || '', files: count, bytes };
      fs.writeFileSync(path.join(dest, MARK), JSON.stringify(mk, null, 1));
      it.result = { dir: dest, exe: fx.pick || '', exes: (fx.exes || []).map((x) => ({ p: x.p, rel: x.rel, size: x.size })), files: count, bytes, at: mk.installedAt };
      it.libSynced = false;
      if (!(it.keepArchives === null ? this.cfg.keepArchives : it.keepArchives)) rm(dir);
      this._set(it, S.C, { error: null, p: Object.assign(it.p, { phase: 'done', pct: 1, speed: 0, eta: 0 }) });
      this.emit('installed', this.snapshot(it));
    } catch (e) {
      rm(tmp); rm(tmp + '-t');
      throw e;
    }
  }
}

function fmt(n) { return n >= 1073741824 ? (n / 1073741824).toFixed(1) + ' GB' : Math.max(1, Math.round(n / 1048576)) + ' MB'; }

module.exports = { Dl, S, MARK, safeName, fmt };
