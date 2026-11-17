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
  assert.throws(() => normalize([], 'http://x/'), (e) => e.code === 'manifest'); assert.throws(() => normalize({ schema: 2, games: [] }, 'http://x/'), (e) => e.code === 'schema'); assert.throws(() => normalize({ foo: 1 }, 'http://x/'));
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
