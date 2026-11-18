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
// Algunos servidores devuelven 403 a programas; si pasa, se reintenta una vez con un identificador de navegador común.
const UA_BROWSER = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const err = (code, msg) => Object.assign(new Error(msg), { code });
const str = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : typeof v === 'number' ? String(v).slice(0, n) : '');
const normId = (s) => str(s, 120).toLowerCase();
/** Tamaño en bytes: acepta número (bytes) o texto tipo "12.5 GB", "700 MB", "1,5GiB". 0 si no es un tamaño. */
function parseSize(v) {
  if (typeof v === 'number') return v > 0 && isFinite(v) ? Math.round(v) : 0;
  if (typeof v !== 'string') return 0;
  const m = /^\s*([0-9]+(?:[.,][0-9]+)?)\s*(b|kb|mb|gb|tb|kib|mib|gib|tib|k|m|g|t)?\s*$/i.exec(v.replace(/(\d)[\s_](\d{3})\b/g, '$1$2'));
  if (!m) return 0;
  const n = parseFloat(m[1].replace(',', '.')), u = (m[2] || 'b').toLowerCase().replace('ib', 'b');
  const pow = { b: 0, k: 1, kb: 1, m: 2, mb: 2, g: 3, gb: 3, t: 4, tb: 4 }[u] || 0;
  return Math.round(n * Math.pow(1024, pow));
}
/** Etiquetas: lista o texto separado por coma, punto y coma o barra. */
function parseTags(v) {
  const a = Array.isArray(v) ? v : typeof v === 'string' ? v.split(/[,;|]/) : [];
  const out = []; for (const t of a) { const x = str(t, 30); if (x && !out.some((y) => y.toLowerCase() === x.toLowerCase())) out.push(x); if (out.length >= 12) break; }
  return out;
}
const parseBool = (v) => v === true || v === 1 || (typeof v === 'string' && /^(true|1|yes|si|sí|ok|verified|verificado)$/i.test(v.trim()));

async function fetchText(url, o) {
  o = o || {};
  // En Electron: primero la red de Chromium (net.fetch con User-Agent de Chrome); si falla por bloqueo o red, sigue el camino con Node.
  if (o.netFetch && /^https?:/i.test(String(url))) {
    try {
      const r = await o.netFetch(String(url), { etag: o.etag, maxBytes: MAX_BYTES });
      return r.notModified ? { notModified: true, url: String(url) } : { text: String(r.text || '').replace(/^\uFEFF/, ''), etag: r.etag || '', url: r.url || String(url) };
    } catch (e) { if (e && ['size', 'url'].includes(e.code)) throw e; if (e && e.code === 'http' && !/HTTP (403|406|429|503)\b/.test(String(e.message))) throw e; }
  }
  return fetchNode(url, o);
}
function fetchNode(url, o) {
  o = o || {};
  return new Promise((resolve, reject) => {
    let u; try { u = new URL(url); } catch (e) { return reject(err('url', 'El enlace no es válido')); }
    if (u.protocol === 'file:' && o.allowFile) {
      try { const p = fileURLToPath(u), st = fs.statSync(p); if (st.size > MAX_BYTES) return reject(err('size', 'El manifiesto es demasiado grande')); return resolve({ text: fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''), etag: String(st.mtimeMs), url: u.href }); } catch (e) { return reject(err('file', 'No pude leer el archivo: ' + String(e.code || e.message).slice(0, 60))); }
    }
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return reject(err('url', 'El enlace tiene que empezar con http:// o https://'));
    let bro = false, viaNet = false;
    const go = (url, hops) => {
      const lib = url.protocol === 'https:' ? https : http;
      const headers = bro ? { 'user-agent': UA_BROWSER, accept: 'application/json,text/plain,*/*', 'accept-language': 'es-AR,es;q=0.9,en;q=0.8', 'accept-encoding': 'identity', referer: url.origin + '/', 'sec-fetch-dest': 'empty', 'sec-fetch-mode': 'cors', 'sec-fetch-site': 'same-origin' } : { 'user-agent': UA, accept: 'application/json, */*', 'accept-encoding': 'identity' };
      if (o.etag) headers['if-none-match'] = o.etag;
      const req = lib.get(url, { headers }, (res) => {
        const sc = res.statusCode;
        if ([301, 302, 303, 307, 308].includes(sc) && res.headers.location) { res.resume(); if (hops >= 5) return reject(err('net', 'Demasiadas redirecciones')); let nx; try { nx = new URL(res.headers.location, url); } catch (e) { return reject(err('net', 'Redirección inválida')); } return go(nx, hops + 1); }
        if (sc === 304) { res.resume(); return resolve({ notModified: true, url: url.href }); }
        if ((sc === 403 || sc === 406) && !bro) { res.resume(); bro = true; return go(url, hops); }
        if ((sc === 403 || sc === 406 || sc === 429 || sc === 503) && o.netFetch && !viaNet) { // último intento: la red de Chromium (la misma de un navegador), que pasa filtros que rechazan a Node
          res.resume(); viaNet = true;
          return o.netFetch(url.href, { etag: o.etag, maxBytes: MAX_BYTES }).then((r) => resolve(r.notModified ? { notModified: true, url: url.href } : { text: String(r.text || '').replace(/^\uFEFF/, ''), etag: r.etag || '', url: r.url || url.href }), (e) => reject(e && e.code ? e : err('http', 'La fuente respondió HTTP ' + sc + (sc === 403 ? ' (acceso denegado: puede requerir permiso, o el enlace venció)' : ''))));
        }
        if (sc !== 200) { res.resume(); return reject(err('http', 'La fuente respondió HTTP ' + sc + (sc === 403 ? ' (acceso denegado: puede requerir permiso, o el enlace venció)' : ''))); }
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
/**
 * Formato plano (una fila por juego), pensado para listas que publican otros sitios:
 *   id, name, link, magnet, date, tags, creator, original, packed, size, verified
 * - link: archivo por http/https (o un .torrent / magnet:). magnet: enlace magnet aparte.
 *   Si vienen los dos, el juego queda con dos versiones: la directa y la de BitTorrent.
 * - size / packed / original: bytes o texto ("12.5 GB"). Lo que se baja es "packed" (o "size" si falta);
 *   "original" es el tamaño ya instalado y se usa para revisar el espacio en disco.
 * - verified: solo se muestra como etiqueta; NO reemplaza la verificación por hash (sha256/sha1/md5).
 */
function flatVersions(g, base) {
  const out = [], seen = new Set();
  const uris = [].concat(g.uris || []).filter((x) => typeof x === 'string');
  const dl = parseSize(g.packed) || parseSize(g.size) || parseSize(g.fileSize) || parseSize(g.download);
  const inst = parseSize(g.original) || parseSize(g.installed);
  const date = str(g.date || g.uploadDate || g.released || g.updated, 40);
  const push = (u, label) => {
    const url = absUrl(u, base); if (!url || seen.has(url)) return; seen.add(url);
    const f = { url }; if (dl) f.size = dl;
    for (const a of ['sha256', 'sha1', 'md5']) { const v = str(g[a], 128).toLowerCase(); if (/^[0-9a-f]{16,128}$/.test(v)) f[a] = v; }
    const tor = isTorrent(url);
    out.push({ version: str(g.version, 60) || label, date, notes: str(g.notes, 600), size: dl, installSize: inst, transport: tor ? 'torrent' : 'http', files: [f] });
  };
  const link = g.link || g.url || g.href || uris.find((x) => !/^magnet:/i.test(x));
  const magnets = [].concat(g.magnet || [], uris.filter((x) => /^magnet:/i.test(x))).filter(Boolean);
  if (link && !isTorrent(absUrl(link, base))) push(link, 'Directa');
  for (const m of magnets) push(m, 'Torrent');
  if (link && isTorrent(absUrl(link, base))) push(link, 'Torrent');
  return out;
}
function normGame(g, base, key) {
  if (!g || typeof g !== 'object') return null;
  const ids = new Set(); for (const k of [g.id, key, g.gid, ...(Array.isArray(g.ids) ? g.ids : [])]) { const x = normId(k); if (x) ids.add(x); }
  if (g.steam || g.steamAppId || g.appid) { const n = parseInt(g.steam || g.steamAppId || g.appid, 10); if (n > 0) ids.add('steam:' + n); }
  const name = str(g.name || g.title, 160); if (!ids.size || !name) return null;
  let versions;
  if (Array.isArray(g.versions)) versions = g.versions.slice(0, MAX_VERS).map((v) => normVersion(v, base)).filter(Boolean);
  else if (g.files) versions = [normVersion(g, base)].filter(Boolean);
  else versions = flatVersions(g, base);
  if (!versions.length) return null;
  const cr = g.cover || g.image || g.icon, cover = cr ? absUrl(cr, base) : '';
  const o = { ids: [...ids], name, cover: /^magnet:/.test(cover) ? '' : cover, description: str(g.description || g.summary, 800), developer: str(g.developer || g.author, 120), versions };
  const creator = str(g.creator || g.uploader || g.repacker, 80); if (creator) o.creator = creator;
  const tags = parseTags(g.tags); if (tags.length) o.tags = tags;
  const date = str(g.date || g.uploadDate, 40); if (date) o.date = date;
  if (parseBool(g.verified)) o.verified = true;
  const inst = parseSize(g.original); if (inst) o.installSize = inst;
  return o;
}

/** Lee el texto de un manifiesto: JSON normal, o una línea JSON por juego (NDJSON). Si no se puede, explica qué recibió. */
function parseManifest(text) {
  const t = String(text || '').replace(/^\uFEFF/, '').trim();
  try { return JSON.parse(t); } catch (e) {}
  if (/^<(!doctype|html|head|body|\?xml)/i.test(t)) throw err('json', 'La fuente devolvió una página web (HTML), no un JSON: seguramente el sitio pide verificación o iniciar sesión. Empieza con: ' + t.slice(0, 60).replace(/\s+/g, ' '));
  const lines = t.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
  if (lines.length > 1) { try { return lines.map((x) => JSON.parse(x)); } catch (e) {} }
  throw err('json', t ? 'La fuente no devolvió un JSON válido. Empieza con: ' + t.slice(0, 60).replace(/\s+/g, ' ') : 'La fuente devolvió un archivo vacío');
}

/** Valida y normaliza un manifiesto ya leído (objeto). */
function normalize(m, baseUrl) {
  if (Array.isArray(m)) m = { games: m }; // también se acepta una lista de juegos suelta
  if (!m || typeof m !== 'object') throw err('manifest', 'El archivo no tiene el formato esperado: tiene que ser un objeto { "games": [...] } o una lista de juegos');
  const sc = m.schema === undefined ? 1 : +m.schema;
  if (sc !== 1) throw err('schema', 'Versión de manifiesto no soportada (' + m.schema + '). Actualizá WINTEER.');
  let list = [];
  const L = ['games', 'downloads', 'items', 'list', 'entries', 'repacks'].find((k) => m[k] && typeof m[k] === 'object');
  if (L && Array.isArray(m[L])) list = m[L].map((g) => [g, '']);
  else if (L) list = Object.entries(m[L]).map(([k, g]) => [g, k]);
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
    const r = await fetchText(url, { etag, allowFile: loc, netFetch: this.o.netFetch });
    if (r.notModified) return { notModified: true };
    const j = parseManifest(r.text);
    const top = normalize(j, r.url), games = top.games.slice(); let skipped = top.skipped;
    const seen = new Set([r.url]); let queue = top.include.slice(), n = 0;
    while (queue.length && n < MAX_INC) {
      const u = queue.shift(); if (seen.has(u)) continue; seen.add(u); n++;
      try { const x = await fetchText(u, { allowFile: loc, netFetch: this.o.netFetch }); const sub = normalize(parseManifest(x.text), x.url); games.push(...sub.games); skipped += sub.skipped; if (sub.include.length && n < MAX_INC) queue.push(...sub.include.slice(0, 5)); } catch (e) { skipped++; }
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
    if (!c.games.length) throw err('empty', 'La fuente no tiene ningún juego que WINTEER pueda usar: cada juego necesita "name", un "id" y "files" (o "versions") con enlaces');
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
    if (!c.games.length) throw err('empty', 'El archivo no tiene ningún juego que WINTEER pueda usar: cada juego necesita "name", un "id" y "files" (o "versions") con enlaces');
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
      for (const g of c.games) { if (q && !g.name.toLowerCase().includes(q) && !g.ids.some((i) => i.includes(q)) && !(g.creator || '').toLowerCase().includes(q) && !(g.tags || []).some((t) => t.toLowerCase().includes(q))) continue; out.push({ source: { id: s.id, name: s.name, url: s.url }, game: g }); if (out.length >= (limit || 200)) return out; }
    }
    return out;
  }
  /** Arma el pedido para el motor de descargas a partir de un juego y versión de una fuente. */
  spec(sourceId, gid, versionIdx, extra) {
    const hit = this.lookup(gid).find((x) => x.source.id === sourceId) || this.games('', 1e9).find((x) => x.source.id === sourceId && x.game.ids.includes(normId(gid)));
    if (!hit) throw err('nf', 'Esa fuente ya no tiene este juego');
    const v = hit.game.versions[Math.max(0, Math.min(hit.game.versions.length - 1, versionIdx | 0))];
    const { torrentOk, ...rest } = extra || {};
    if (v.transport === 'torrent' && !torrentOk) throw err('transport', 'Esta versión se distribuye por BitTorrent y falta el ayudante winteer-bt en esta instalación de WINTEER');
    extra = rest;
    const local = v.files.some((f) => /^file:/i.test(f.url));
    return Object.assign({ localOk: local, installSize: v.installSize || hit.game.installSize || 0, gid: normId(gid), name: hit.game.name, cover: hit.game.cover || '', version: v.version, files: v.files.map((f) => Object.assign({}, f)), source: { id: hit.source.id, name: hit.source.name, url: hit.source.url } }, extra || {});
  }
}

module.exports = { Sources, normalize, fetchText, parseSize };
