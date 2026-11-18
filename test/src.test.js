'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('fs'), path = require('path'), os = require('os'), http = require('http'), crypto = require('crypto'), cp = require('child_process');
const { Sources, normalize } = require('../src.js');
const { Dl } = require('../dl.js');
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'wsrc-'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function srv(routes) {
  const s = http.createServer((q, r) => { const x = routes[q.url.split('?')[0]]; if (x === undefined) { r.writeHead(404); return r.end(); } if (typeof x === 'function') return x(q, r); const b = Buffer.isBuffer(x) ? x : Buffer.from(typeof x === 'string' ? x : JSON.stringify(x)); r.writeHead(200, { etag: '"v1"' }); r.end(b); });
  return new Promise((ok) => s.listen(0, '127.0.0.1', () => ok({ s, url: 'http://127.0.0.1:' + s.address().port })));
}
const mk = () => { const d = tmp(); return new Sources({ file: path.join(d, 'sources.json'), dir: path.join(d, 'c') }).load(); };

test('normaliza: formas flexibles (ids, atajo files, mapa, relativas, hashes)', () => {
  const m = normalize({ name: 'X', games: { 'steam:730': { name: 'CS', files: ['/a.zip', { url: 'b.zip', size: 10, hash: 'sha256:' + 'a'.repeat(64) }] }, g2: { title: 'Dos', ids: ['gog:5', 'STEAM:9'], versions: [{ version: '2', url: 'z.zip', md5: 'b'.repeat(32) }] }, malo: { name: 'sin archivos' }, '': { name: 'sin id' } } }, 'http://h.test/dir/m.json');
  assert.equal(m.games.length, 2); assert.equal(m.skipped, 2);
  const cs = m.games[0]; assert.deepEqual(cs.ids, ['steam:730']); assert.equal(cs.versions[0].files[0].url, 'http://h.test/a.zip'); assert.equal(cs.versions[0].files[1].url, 'http://h.test/dir/b.zip'); assert.equal(cs.versions[0].files[1].sha256, 'a'.repeat(64)); assert.equal(cs.versions[0].size, 10);
  assert.deepEqual(m.games[1].ids.sort(), ['g2', 'gog:5', 'steam:9']); assert.equal(m.games[1].versions[0].files[0].md5, 'b'.repeat(32));
});
test('normaliza: rechaza basura y schema desconocido; marca torrents', () => {
  assert.throws(() => normalize('x', 'http://x/'), (e) => e.code === 'manifest'); assert.equal(normalize([{ id: 'a', name: 'A', files: ['/a.zip'] }], 'http://x/').games.length, 1); assert.throws(() => normalize({ schema: 2, games: [] }, 'http://x/'), (e) => e.code === 'schema'); assert.throws(() => normalize({ foo: 1 }, 'http://x/'));
  const m = normalize({ games: [{ id: 'a', name: 'A', versions: [{ files: ['magnet:?xt=urn:btih:abc'] }, { files: ['javascript:alert(1)', 'file:///etc/passwd'] }] }] }, 'http://x/');
  assert.equal(m.games[0].versions.length, 1); assert.equal(m.games[0].versions[0].transport, 'torrent');
});
test('agregar, listar, buscar por ID exacto, quitar, activar/desactivar y persistir', async () => {
  const a = await srv({ '/m.json': { name: 'Fuente A', games: [{ id: 'steam:730', name: 'CS', versions: [{ version: '1', files: ['/f.zip'] }] }, { id: 'otro', name: 'Counter Otro', files: ['/g.zip'] }] } });
  const S = mk(); const s = await S.add(a.url + '/m.json');
  assert.equal(s.name, 'Fuente A'); assert.equal(s.games, 2);
  assert.equal(S.lookup('STEAM:730').length, 1); assert.equal(S.lookup('steam:731').length, 0, 'sin coincidencia por nombre parecido');
  assert.equal(S.games('counter').length, 1);
  await assert.rejects(S.add(a.url + '/m.json'), (e) => e.code === 'dup');
  S.setEnabled(s.id, false); assert.equal(S.lookup('steam:730').length, 0); S.setEnabled(s.id, true);
  const S2 = new Sources(S.o).load(); assert.equal(S2.list().length, 1); assert.equal(S2.lookup('steam:730').length, 1, 'recarga desde caché sin red');
  assert.ok(S.remove(s.id)); assert.equal(S.list().length, 0); assert.equal(S.lookup('steam:730').length, 0); a.s.close();
});
test('errores: 404, JSON roto, vacío, protocolo, servidor caído', async () => {
  const a = await srv({ '/rota': '{no json', '/vacia': { games: [] }, '/x': { games: [{ name: 'sin id' }] } }); const S = mk();
  await assert.rejects(S.add(a.url + '/nada'), (e) => e.code === 'http'); await assert.rejects(S.add(a.url + '/rota'), (e) => e.code === 'json');
  await assert.rejects(S.add(a.url + '/vacia'), (e) => e.code === 'empty'); await assert.rejects(S.add(a.url + '/x'), (e) => e.code === 'empty');
  await assert.rejects(S.add('ftp://x/y'), (e) => e.code === 'url'); await assert.rejects(S.add('esto no es un enlace'), (e) => e.code === 'url');
  a.s.close(); await assert.rejects(S.add(a.url + '/m.json'), (e) => e.code === 'net'); assert.equal(S.list().length, 0);
});
test('actualizar: toma cambios, usa ETag y conserva copia si la fuente falla', async () => {
  let ver = 1, hits = 0;
  const a = await srv({ '/m.json': (q, r) => { hits++; if (q.headers['if-none-match'] === '"e' + ver + '"') { r.writeHead(304); return r.end(); } r.writeHead(200, { etag: '"e' + ver + '"' }); r.end(JSON.stringify({ games: [{ id: 'g', name: 'V' + ver, files: ['/f.zip'] }] })); } });
  const S = mk(); const s = await S.add(a.url + '/m.json'); assert.equal(S.lookup('g')[0].game.name, 'V1');
  await S.refresh(s.id); assert.equal(S.lookup('g')[0].game.name, 'V1'); ver = 2; await S.refresh(s.id); assert.equal(S.lookup('g')[0].game.name, 'V2');
  a.s.close(); const r = await S.refresh(s.id); assert.equal(r[0].ok, false); assert.equal(S.lookup('g')[0].game.name, 'V2', 'conserva lo último bueno'); assert.ok(S.list()[0].error);
});
test('include: junta manifiestos partidos', async () => {
  const a = await srv({ '/m.json': { name: 'Raíz', include: ['p1.json', 'p2.json'], games: [{ id: 'r', name: 'R', files: ['/r.zip'] }] }, '/p1.json': { games: [{ id: 'p1', name: 'P1', files: ['/1.zip'] }] }, '/p2.json': { games: [{ id: 'p2', name: 'P2', files: ['/2.zip'] }] } });
  const S = mk(); const s = await S.add(a.url + '/m.json'); assert.equal(s.games, 3); assert.equal(S.lookup('p2').length, 1); a.s.close();
});
test('dos fuentes con el mismo juego; spec() arma el pedido y rechaza torrents', async () => {
  const a = await srv({ '/m.json': { name: 'A', games: [{ id: 'steam:1', name: 'J', cover: '/c.jpg', versions: [{ version: '2', files: ['/n.zip'] }, { version: '1', files: ['/o.zip'] }, { version: 't', files: ['magnet:?xt=urn:btih:x'] }] }] } });
  const b = await srv({ '/m.json': { name: 'B', games: [{ id: 'steam:1', name: 'J', files: ['/b.zip'] }] } });
  const S = mk(); const sa = await S.add(a.url + '/m.json'); await S.add(b.url + '/m.json'); assert.equal(S.lookup('steam:1').length, 2);
  const sp = S.spec(sa.id, 'steam:1', 1); assert.equal(sp.version, '1'); assert.equal(sp.gid, 'steam:1'); assert.equal(sp.source.name, 'A'); assert.equal(sp.cover, a.url + '/c.jpg');
  assert.throws(() => S.spec(sa.id, 'steam:1', 2), (e) => e.code === 'transport'); assert.throws(() => S.spec('nope', 'steam:1', 0), (e) => e.code === 'nf'); a.s.close(); b.s.close();
});
test('extremo a extremo: fuente → spec → motor de descargas → instalado con hash', async () => {
  const d = tmp(), sd = path.join(d, 's'); fs.mkdirSync(sd); fs.writeFileSync(path.join(sd, 'g.exe'), 'MZ'); fs.writeFileSync(path.join(sd, 'd.dat'), 'x');
  const zp = path.join(d, 'g.zip'); cp.execFileSync('zip', ['-qr', zp, '.'], { cwd: sd }); const z = fs.readFileSync(zp);
  const a = await srv({ '/g.zip': z, '/m.json': { name: 'Dev', games: [{ id: 'steam:42', name: 'Juego 42', versions: [{ version: '1.0', files: [{ url: 'g.zip', size: z.length, sha256: crypto.createHash('sha256').update(z).digest('hex') }] }] }] } });
  const S = mk(); const s = await S.add(a.url + '/m.json');
  const ex = async (f, out) => { const r = cp.spawnSync('unzip', ['-q', f, '-d', out]); return r.status === 0 ? { ok: 1 } : { err: 'x' }; };
  const dl = new Dl({ file: path.join(d, 'dl.json'), defaults: { dlDir: path.join(d, 'dl'), installDir: path.join(d, 'games') }, extract: ex, archiveSize: async () => 0, findExes: (r) => ({ exes: [], pick: path.join(r, 'g.exe') }) }).load().start();
  const it = dl.add(S.spec(s.id, 'steam:42', 0));
  for (let i = 0; i < 200 && !['completed', 'error'].includes(dl.get(it.id).status); i++) await sleep(50);
  const f = dl.get(it.id); assert.equal(f.status, 'completed', JSON.stringify(f.error)); assert.equal(f.gid, 'steam:42'); assert.equal(f.source.name, 'Dev'); assert.ok(fs.existsSync(path.join(f.result.dir, 'g.exe'))); a.s.close();
});

test('archivo .json local: agrega, resuelve rutas relativas, instala desde disco y se puede actualizar', async () => {
  const d = tmp(), sd = path.join(d, 'src'); fs.mkdirSync(sd); fs.writeFileSync(path.join(sd, 'g.exe'), 'MZ');
  fs.mkdirSync(path.join(d, 'mi fuente')); const zp = path.join(d, 'mi fuente', 'juego.zip'); cp.execFileSync('zip', ['-qr', zp, '.'], { cwd: sd }); const z = fs.readFileSync(zp);
  const mf = path.join(d, 'mi fuente', 'manifest.json');
  fs.writeFileSync(mf, JSON.stringify({ name: 'Local', games: [{ id: 'steam:77', name: 'Local Game', versions: [{ version: '1', files: [{ url: 'juego.zip', size: z.length, sha256: crypto.createHash('sha256').update(z).digest('hex') }] }] }] }));
  const S = mk(); const s = await S.addFile(mf); assert.equal(s.name, 'Local'); assert.equal(s.games, 1); assert.equal(S.list()[0].kind, 'file');
  await assert.rejects(S.addFile(mf), (e) => e.code === 'dup'); await assert.rejects(S.addFile('relativa.json'), (e) => e.code === 'file'); await assert.rejects(S.addFile(path.join(d, 'no-existe.json')), (e) => e.code === 'file');
  fs.writeFileSync(path.join(d, 'roto.json'), '{x'); await assert.rejects(S.addFile(path.join(d, 'roto.json')), (e) => e.code === 'json');
  const sp = S.spec(s.id, 'steam:77', 0); assert.equal(sp.localOk, true); assert.match(sp.files[0].url, /^file:\/\/.*mi%20fuente\/juego\.zip$/);
  const ex = async (f, out) => { const r = cp.spawnSync('unzip', ['-q', f, '-d', out]); return r.status === 0 ? { ok: 1 } : { err: 'x' }; };
  const dl = new Dl({ file: path.join(d, 'dl.json'), defaults: { dlDir: path.join(d, 'dl'), installDir: path.join(d, 'games') }, extract: ex, archiveSize: async () => 0, findExes: (r) => ({ exes: [], pick: path.join(r, 'g.exe') }) }).load().start();
  const it = dl.add(sp); for (let i = 0; i < 200 && !['completed', 'error'].includes(dl.get(it.id).status); i++) await sleep(50);
  const f = dl.get(it.id); assert.equal(f.status, 'completed', JSON.stringify(f.error)); assert.ok(fs.existsSync(path.join(f.result.dir, 'g.exe')));
  fs.writeFileSync(mf, JSON.stringify({ name: 'Local', games: [{ id: 'steam:77', name: 'Local Game v2', files: ['juego.zip'] }] })); await S.refresh(s.id); assert.equal(S.lookup('steam:77')[0].game.name, 'Local Game v2');
});
test('seguridad: un manifiesto remoto NO puede apuntar a archivos locales, ni el motor aceptar file: sin permiso', async () => {
  const a = await srv({ '/m.json': { games: [{ id: 'x', name: 'X', versions: [{ files: ['file:///etc/passwd'] }, { files: ['http://127.0.0.1:1/a.zip'] }] }] } });
  const S = mk(); await S.add(a.url + '/m.json'); const g = S.lookup('x')[0].game; assert.equal(g.versions.length, 1); assert.ok(g.versions[0].files.every((f) => !/^file:/.test(f.url)));
  const dl = new Dl({ file: path.join(tmp(), 'd.json'), defaults: { dlDir: tmp(), installDir: tmp() }, extract: async () => ({ ok: 1 }), archiveSize: async () => 0, findExes: () => ({ exes: [], pick: '' }) }).load();
  assert.throws(() => dl.add({ gid: 'a', name: 'a', files: [{ url: 'file:///etc/passwd' }] })); a.s.close();
});
test('archivo local: pausa/reanuda y archivo faltante da error claro', async () => {
  const d = tmp(), big = path.join(d, 'big.bin'); fs.writeFileSync(big, crypto.randomBytes(3e6));
  const dl = new Dl({ file: path.join(d, 'dl.json'), defaults: { dlDir: path.join(d, 'dl'), installDir: path.join(d, 'g') }, extract: async () => ({ ok: 1 }), archiveSize: async () => 0, findExes: () => ({ exes: [], pick: '' }) }).load().start();
  dl.setCfg({ speedLimit: 1500000 });
  const it = dl.add({ gid: 'l:1', name: 'L', autoInstall: false, localOk: true, files: [{ url: require('url').pathToFileURL(big).href }] });
  await sleep(400); dl.pause(it.id); for (let i = 0; i < 100 && dl.get(it.id).status !== 'paused'; i++) await sleep(30); assert.equal(dl.get(it.id).status, 'paused');
  dl.resume(it.id); for (let i = 0; i < 300 && !['completed', 'error'].includes(dl.get(it.id).status); i++) await sleep(50);
  const f = dl.get(it.id); assert.equal(f.status, 'completed', JSON.stringify(f.error)); assert.equal(fs.statSync(path.join(dl.cfg.dlDir, 'wt-' + it.id, 'big.bin')).size, 3e6);
  const b = dl.add({ gid: 'l:2', name: 'M', autoInstall: false, localOk: true, files: [{ url: require('url').pathToFileURL(path.join(d, 'nada.bin')).href }] });
  for (let i = 0; i < 100 && dl.get(b.id).status !== 'error'; i++) await sleep(30); assert.equal(dl.get(b.id).error.code, 'file');
});

test('formato plano: id, name, link, magnet, date, tags, creator, original, packed, size, verified', () => {
  const m = normalize([
    { id: 'abc', name: 'Juego', link: 'https://h.test/j.zip', magnet: 'magnet:?xt=urn:btih:abc&dn=j', date: '2026-01-02', tags: 'rpg, coop;RPG', creator: 'Fulano', original: '30 GB', packed: '12 GB', size: '12 GB', verified: 'true' },
    { id: 7, name: 'Solo magnet', magnet: 'magnet:?xt=urn:btih:def' },
    { id: 't', name: 'Torrent por link', link: '/x.torrent', tags: ['a', 'b'], verified: false, size: 1000 },
    { id: 'sin', name: 'Sin enlaces', date: '2026' },
  ], 'http://h.test/dir/m.json');
  assert.equal(m.games.length, 3); assert.equal(m.skipped, 1);
  const [a, b, c] = m.games;
  assert.deepEqual(a.versions.map((v) => v.transport), ['http', 'torrent']); assert.equal(a.versions[0].files[0].url, 'https://h.test/j.zip');
  assert.equal(a.versions[0].size, 12 * 1024 ** 3); assert.equal(a.installSize, 30 * 1024 ** 3); assert.deepEqual(a.tags, ['rpg', 'coop']); assert.equal(a.creator, 'Fulano'); assert.equal(a.verified, true); assert.equal(a.date, '2026-01-02');
  assert.deepEqual(b.ids, ['7']); assert.equal(b.versions.length, 1); assert.equal(b.versions[0].transport, 'torrent'); assert.equal(b.cover, '');
  assert.equal(c.versions[0].transport, 'torrent'); assert.equal(c.verified, undefined); assert.equal(c.versions[0].size, 1000);
});
test('formato plano: se busca por etiqueta/creador y spec() lleva el tamaño instalado', async () => {
  const a = await srv({ '/m.json': [{ id: 'g1', name: 'Uno', link: '/u.zip', tags: 'terror', creator: 'Ana', original: 5000, packed: 2000 }] });
  const S = mk(); const s = await S.add(a.url + '/m.json');
  assert.equal(S.games('terror').length, 1); assert.equal(S.games('ana').length, 1); assert.equal(S.games('nada').length, 0);
  const sp = S.spec(s.id, 'g1', 0); assert.equal(sp.installSize, 5000); assert.equal(sp.files[0].size, 2000); a.s.close();
});
test('403 a programas: reintenta con identificador de navegador', async () => {
  const a = await srv({ '/m.json': (q, r) => { if (!/Mozilla/.test(q.headers['user-agent'] || '')) { r.writeHead(403); return r.end(); } r.writeHead(200); r.end(JSON.stringify([{ id: 'g', name: 'G', link: '/g.zip' }])); }, '/no.json': (q, r) => { r.writeHead(403); r.end(); } });
  const S = mk(); const s = await S.add(a.url + '/m.json'); assert.equal(s.games, 1);
  await assert.rejects(S.add(a.url + '/no.json'), (e) => e.code === 'http' && /403/.test(e.message)); a.s.close();
});
test('403 persistente: usa netFetch (red de Chromium) como último intento', async () => {
  const a = await srv({ '/m.json': (q, r) => { r.writeHead(403); r.end(); } }); let calls = 0;
  const d = tmp(); const S = new Sources({ file: path.join(d, 's.json'), dir: path.join(d, 'c'), netFetch: async (u) => { calls++; return { text: JSON.stringify([{ id: 'g', name: 'G', link: '/g.zip' }]), etag: 'x', url: u }; } }).load();
  const s = await S.add(a.url + '/m.json'); assert.equal(s.games, 1); assert.equal(calls, 1);
  const S2 = new Sources({ file: path.join(tmp(), 's.json'), dir: path.join(tmp(), 'c'), netFetch: async () => { const e = new Error('La fuente respondió HTTP 403'); e.code = 'http'; throw e; } }).load();
  await assert.rejects(S2.add(a.url + '/m.json'), (e) => e.code === 'http'); a.s.close();
});
test('lista con otro nombre (downloads) y alias uris/uploadDate/fileSize', () => {
  const m = normalize({ name: 'X', downloads: [{ id: 'a', title: 'A', uris: ['magnet:?xt=urn:btih:aa', 'https://h.test/a.zip'], uploadDate: '2026-02-03', fileSize: '4 GB', uploader: 'U' }, { id: 'b', name: 'B', magnet: 'magnet:?xt=urn:btih:bb' }] }, 'http://h.test/m.json');
  assert.equal(m.games.length, 2); const a = m.games[0];
  assert.deepEqual(a.versions.map((v) => v.transport), ['http', 'torrent']); assert.equal(a.date, '2026-02-03'); assert.equal(a.creator, 'U'); assert.equal(a.versions[0].size, 4 * 1024 ** 3);
  assert.equal(normalize({ items: { x: { name: 'X', link: '/x.zip' } } }, 'http://h/').games.length, 1);
});
test('JSON inválido: explica qué recibió; acepta una línea JSON por juego', async () => {
  const a = await srv({ '/h': '<!DOCTYPE html><html>Just a moment...</html>', '/n': '{"id":"a","name":"A","link":"/a.zip"}\n{"id":"b","name":"B","link":"/b.zip"}\n', '/v': '' });
  const S = mk();
  await assert.rejects(S.add(a.url + '/h'), (e) => e.code === 'json' && /HTML/.test(e.message) && /DOCTYPE/i.test(e.message));
  const s = await S.add(a.url + '/n'); assert.equal(s.games, 2);
  await assert.rejects(S.add(a.url + '/v'), (e) => e.code === 'json'); a.s.close();
});
test('sin id: se genera uno a partir del título (downloads + title + uris)', () => {
  const m = normalize({ downloads: [{ title: 'Ñandú: Edición Épica', uris: ['magnet:?xt=urn:btih:aa'] }, { title: 'Ñandú: Edición Épica', uris: ['https://h.test/b.zip'] }, { title: 'Otro', uris: ['https://h.test/o.zip'] }, { title: 'Sin enlaces' }] }, 'http://h.test/m.json');
  assert.equal(m.games.length, 3); assert.equal(m.skipped, 1);
  assert.equal(m.games[0].ids[0], 'src:nandu-edicion-epica'); assert.notEqual(m.games[1].ids[0], m.games[0].ids[0]); assert.equal(m.games[2].ids[0], 'src:otro');
  assert.equal(normalize({ downloads: [{ title: 'Otro', uris: ['https://h.test/o.zip'] }] }, 'http://h/').games[0].ids[0], 'src:otro', 'estable entre actualizaciones');
});
