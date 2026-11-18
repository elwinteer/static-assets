'use strict';
// Pruebas del lado JavaScript (bt.js + transporte torrent de dl.js) contra un doble de pruebas del protocolo.
// El ayudante real (libtorrent) se prueba en Windows: ver docs/bittorrent.md.
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('fs'), path = require('path'), os = require('os'), http = require('http');
const { Bt } = require('../bt.js'), { Dl } = require('../dl.js');
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'wbt-'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const FAKE = path.join(__dirname, 'fake-bt.js');
const mkBt = (mode) => new Bt({ exe: process.execPath, args: [FAKE], stateDir: tmp(), spawn: (exe, args, o) => require('child_process').spawn(exe, args, Object.assign({}, o, { env: Object.assign({}, process.env, { FAKE_BT: mode || '' }) })) });
function mkDl(bt) { const d = tmp(); return new Dl({ file: path.join(d, 'dl.json'), defaults: { dlDir: path.join(d, 'dl'), installDir: path.join(d, 'games') }, extract: async () => ({ ok: 1 }), archiveSize: async () => 0, findExes: (r) => ({ exes: [], pick: path.join(r, 'game.exe') }), bt }).load().start(); }
const wait = async (dl, id, st, ms = 8000) => { const t = Date.now(); for (;;) { const i = dl.get(id); if (i && st.includes(i.status)) return i; if (Date.now() - t > ms) throw new Error('timeout: ' + (i && i.status) + JSON.stringify(i && i.error)); await sleep(30); } };
const MAG = 'magnet:?xt=urn:btih:0123456789abcdef0123456789abcdef01234567&dn=Mi+Juego';

test('sin ayudante: BitTorrent no se ofrece y los torrents se rechazan', () => {
  const bt = new Bt({ exe: path.join(os.tmpdir(), 'no-existe-winteer-bt.exe'), stateDir: tmp() }); assert.equal(bt.available(), false);
  for (const dl of [mkDl(null), mkDl(bt)]) { assert.equal(dl.btAvailable(), false); assert.throws(() => dl.add({ gid: 'a', name: 'a', files: [{ url: MAG }] }), (e) => e.code === 'transport'); }
});
test('cliente: arranca el ayudante, saluda y confirma órdenes', async () => {
  const bt = mkBt(); const r = await bt.send({ op: 'pause', id: 'x' }); assert.equal(r.ev, 'ack'); assert.equal(bt.info.version, 'fake'); await bt.shutdown();
});
test('cliente: rechazo del ayudante llega como error con su código', async () => {
  const bt = mkBt('nack'); await assert.rejects(bt.send({ op: 'add', id: 'x', uri: 'x', dir: tmp() }), (e) => e.code === 'bad-uri'); await bt.shutdown();
});
test('magnet: descarga, instala copiando el contenido y registra el resultado', async () => {
  const bt = mkBt(), dl = mkDl(bt); const it = dl.add({ gid: 'x:bt1', name: 'Mi Juego', files: [{ url: MAG }] });
  assert.equal(it.transport, 'torrent'); assert.equal(it.files[0].name, 'Mi_Juego'.replace('_', ' '));
  const f = await wait(dl, it.id, ['completed', 'error']); assert.equal(f.status, 'completed', JSON.stringify(f.error));
  assert.ok(fs.existsSync(path.join(f.result.dir, 'Juego', 'data', 'a.dat')) || fs.existsSync(path.join(f.result.dir, 'data', 'a.dat')));
  assert.equal(f.btHash, 'abc123'); assert.equal(f.p.pct, 1); assert.ok(!fs.existsSync(path.join(dl.cfg.dlDir, 'wt-' + it.id)), 'limpia lo descargado'); await bt.shutdown();
});
test('magnet: progreso (pares, velocidad) y pausa/reanudar', async () => {
  const bt = mkBt(), dl = mkDl(bt); const it = dl.add({ gid: 'x:bt2', name: 'P', autoInstall: false, files: [{ url: MAG }] });
  for (let i = 0; i < 100 && !(dl.get(it.id).p.peers > 0); i++) await sleep(30); const s = dl.get(it.id); assert.equal(s.p.peers, 7); assert.ok(s.p.speed > 0);
  assert.ok(dl.pause(it.id)); const p = await wait(dl, it.id, ['paused']); assert.ok(p.p.done > 0 && p.p.done < 3000000);
  assert.ok(dl.resume(it.id)); const f = await wait(dl, it.id, ['completed', 'error']); assert.equal(f.status, 'completed', JSON.stringify(f.error)); await bt.shutdown();
});
test('cancelar un torrent quita el registro y los archivos', async () => {
  const bt = mkBt(), dl = mkDl(bt); const it = dl.add({ gid: 'x:bt3', name: 'C', files: [{ url: MAG }] }); await sleep(200); await dl.cancel(it.id);
  assert.equal(dl.get(it.id), null); assert.ok(!fs.existsSync(path.join(dl.cfg.dlDir, 'wt-' + it.id))); await bt.shutdown();
});
test('error informado por el ayudante, y caída del ayudante, dejan la descarga en error reintentable', async () => {
  for (const [mode, code] of [['error', 'disk'], ['crash', 'bt-exit'], ['nack', 'bad-uri']]) {
    const bt = mkBt(mode), dl = mkDl(bt); const it = dl.add({ gid: 'x:e' + mode, name: 'E', files: [{ url: MAG }] });
    const f = await wait(dl, it.id, ['error']); assert.equal(f.error.code, code, mode); await bt.shutdown();
  }
});
test('.torrent por http: se baja el archivo y se le pasa al ayudante', async () => {
  const seen = []; const bt = mkBt(); const orig = bt.send.bind(bt); bt.send = (c) => { seen.push(c); return orig(c); };
  const s = http.createServer((q, r) => { r.writeHead(200); r.end(Buffer.from('d4:infod4:name1:xee')); }); await new Promise((r) => s.listen(0, '127.0.0.1', r));
  const dl = mkDl(bt); const it = dl.add({ gid: 'x:bt5', name: 'T', files: [{ url: 'http://127.0.0.1:' + s.address().port + '/a.torrent' }] }); await wait(dl, it.id, ['completed', 'error']);
  const add = seen.find((c) => c.op === 'add'); assert.match(add.uri, /meta\.torrent$/); s.close(); await bt.shutdown();
});
test('reglas: un torrent no se mezcla con otros archivos; fuentes con torrent exigen ayudante', async () => {
  const bt0 = mkBt(), dl = mkDl(bt0); assert.throws(() => dl.add({ gid: 'z', name: 'z', files: [{ url: MAG }, { url: 'http://x/a.zip' }] }), (e) => e.code === 'spec');
  const { Sources } = require('../src.js'); const S = new Sources({ file: path.join(tmp(), 's.json'), dir: tmp() }); 
  S.list_ = [{ id: 's1', url: 'http://x/', name: 'S', enabled: true }]; S.cache.set('s1', { games: [{ ids: ['g'], name: 'G', versions: [{ version: '1', transport: 'torrent', files: [{ url: MAG }] }] }] }); S._index();
  assert.throws(() => S.spec('s1', 'g', 0), (e) => e.code === 'transport'); const sp = S.spec('s1', 'g', 0, { torrentOk: true, cover: 'c' }); assert.equal(sp.torrentOk, undefined); assert.equal(sp.cover, 'c');
  const it = dl.add(sp); assert.equal(it.transport, 'torrent'); await sleep(150); await dl.cancel(it.id); await bt0.shutdown();
});
