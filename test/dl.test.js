'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('fs'), path = require('path'), os = require('os'), http = require('http'), crypto = require('crypto'), cp = require('child_process');
const { Dl, MARK } = require('../dl.js');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sha = (b, a = 'sha256') => crypto.createHash(a).update(b).digest('hex');
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'wdl-'));

// servidor local con soporte de Range, caídas simuladas y redirecciones
function server(files, opt = {}) {
  const hits = { n: 0, ranges: [] };
  const srv = http.createServer((req, res) => {
    hits.n++;
    const u = req.url.split('?')[0];
    if (u === '/redir') { res.writeHead(302, { location: '/a.bin' }); return res.end(); }
    if (u === '/404') { res.writeHead(404); return res.end(); }
    const b = files[u]; if (!b) { res.writeHead(404); return res.end(); }
    const r = req.headers.range;
    const slow = opt.chunk || 0;
    let start = 0, end = b.length - 1, code = 200;
    const h = { 'content-type': 'application/octet-stream', etag: '"x' + b.length + '"', 'accept-ranges': 'bytes' };
    if (r && !opt.noRange) {
      const m = /bytes=(\d+)-/.exec(r); hits.ranges.push(r); start = +m[1];
      if (start >= b.length) { res.writeHead(416, { 'content-range': 'bytes */' + b.length }); return res.end(); }
      code = 206; h['content-range'] = `bytes ${start}-${end}/${b.length}`;
    }
    h['content-length'] = end - start + 1;
    res.writeHead(code, h);
    let pos = start; const cut = opt.dropAt && hits.n === 1 ? opt.dropAt : -1;
    const step = () => {
      if (res.destroyed) return;
      if (cut >= 0 && pos >= cut) return res.destroy();
      if (pos > end) return res.end();
      const n = Math.min(slow || 65536, end - pos + 1, cut >= 0 ? cut - pos || 1 : 1e9);
      res.write(b.subarray(pos, pos + n)); pos += n; setTimeout(step, opt.delay || 0);
    };
    step();
  });
  return new Promise((ok) => srv.listen(0, '127.0.0.1', () => ok({ srv, hits, url: 'http://127.0.0.1:' + srv.address().port })));
}
const rnd = (n) => crypto.randomBytes(n);

// extractor de prueba: unzip/tar del sistema (en Windows se usa 7-Zip real)
const extract = async (f, out) => {
  const r = /\.zip$/i.test(f) ? cp.spawnSync('unzip', ['-q', '-o', f, '-d', out]) : cp.spawnSync('tar', ['-xf', f, '-C', out]);
  return r.status === 0 ? { ok: 1 } : { err: String(r.stderr) };
};
const archiveSize = async () => 0;
const findExes = (root) => {
  const ex = []; const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.exe$/i.test(e.name)) ex.push({ p, rel: path.relative(root, p), size: fs.statSync(p).size }); } };
  walk(root); return { exes: ex, pick: ex[0] ? ex[0].p : '' };
};
function mk(extra) {
  const base = tmp();
  const dl = new Dl(Object.assign({ file: path.join(base, 'ud', 'downloads.json'), defaults: { dlDir: path.join(base, 'dl'), installDir: path.join(base, 'games') }, extract, archiveSize, findExes }, extra || {}));
  dl.load(); dl.base = base; return dl;
}
const waitFor = async (dl, id, st, ms = 15000) => {
  const t = Date.now();
  for (;;) { const i = dl.get(id); if (i && (Array.isArray(st) ? st : [st]).includes(i.status)) return i; if (Date.now() - t > ms) throw new Error('timeout esperando ' + st + ' (está en ' + (i && i.status) + ' ' + JSON.stringify(i && i.error) + ')'); await sleep(30); }
};
function zipOf(entries) {
  const d = tmp(), src = path.join(d, 'src'); fs.mkdirSync(src);
  for (const [k, v] of Object.entries(entries)) { const p = path.join(src, k); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, v); }
  const out = path.join(d, 'x.zip'); cp.execFileSync('zip', ['-qr', out, '.'], { cwd: src });
  return fs.readFileSync(out);
}

test('descarga completa con verificación sha256 y sin instalar', async () => {
  const data = rnd(3e6), s = await server({ '/a.bin': data }); const dl = mk().start();
  const it = dl.add({ gid: 'x:1', name: 'Juego', autoInstall: false, files: [{ url: s.url + '/a.bin', sha256: sha(data), size: data.length }] });
  const f = await waitFor(dl, it.id, ['completed', 'error']);
  assert.equal(f.status, 'completed', JSON.stringify(f.error));
  assert.equal(sha(fs.readFileSync(path.join(dl.cfg.dlDir, 'wt-' + it.id, 'a.bin'))), sha(data));
  assert.equal(f.p.pct, 1); s.srv.close();
});

test('redirecciones y tamaño desconocido', async () => {
  const data = rnd(500000), s = await server({ '/a.bin': data }); const dl = mk().start();
  const it = dl.add({ gid: 'x:2', name: 'R', autoInstall: false, files: [{ url: s.url + '/redir' }] });
  const f = await waitFor(dl, it.id, ['completed', 'error']);
  assert.equal(f.status, 'completed'); assert.equal(f.files[0].size, data.length); s.srv.close();
});

test('pausa y reanudación usan Range y el archivo final queda idéntico', async () => {
  const data = rnd(4e6), s = await server({ '/a.bin': data }, { chunk: 65536, delay: 5 }); const dl = mk().start();
  const it = dl.add({ gid: 'x:3', name: 'P', autoInstall: false, files: [{ url: s.url + '/a.bin', sha256: sha(data) }] });
  await sleep(300); assert.ok(dl.pause(it.id));
  const p = await waitFor(dl, it.id, 'paused'); assert.ok(p.files[0].got > 0 && p.files[0].got < data.length);
  assert.ok(fs.existsSync(path.join(dl.cfg.dlDir, 'wt-' + it.id, 'a.bin.part')));
  assert.ok(dl.resume(it.id));
  const f = await waitFor(dl, it.id, ['completed', 'error']);
  assert.equal(f.status, 'completed', JSON.stringify(f.error));
  assert.ok(s.hits.ranges.length >= 1, 'debió pedir Range'); s.srv.close();
});

test('servidor sin soporte de Range: reinicia y completa bien', async () => {
  const data = rnd(1e6), s = await server({ '/a.bin': data }, { noRange: true, chunk: 32768, delay: 20 }); const dl = mk().start();
  const it = dl.add({ gid: 'x:4', name: 'NR', autoInstall: false, files: [{ url: s.url + '/a.bin', sha256: sha(data) }] });
  await sleep(120); dl.pause(it.id); await waitFor(dl, it.id, 'paused'); dl.resume(it.id);
  const f = await waitFor(dl, it.id, ['completed', 'error']); assert.equal(f.status, 'completed', JSON.stringify(f.error)); s.srv.close();
});

test('corte de conexión a mitad: reintenta y retoma', async () => {
  const data = rnd(2e6), s = await server({ '/a.bin': data }, { dropAt: 700000 }); const dl = mk().start();
  const it = dl.add({ gid: 'x:5', name: 'Drop', autoInstall: false, files: [{ url: s.url + '/a.bin', sha256: sha(data) }] });
  const f = await waitFor(dl, it.id, ['completed', 'error']);
  assert.equal(f.status, 'completed', JSON.stringify(f.error)); assert.ok(s.hits.n >= 2); s.srv.close();
});

test('límite de velocidad', async () => {
  const data = rnd(1.5e6), s = await server({ '/a.bin': data }); const dl = mk().start();
  dl.setCfg({ speedLimit: 500000 });
  const t = Date.now();
  const it = dl.add({ gid: 'x:6', name: 'Lim', autoInstall: false, files: [{ url: s.url + '/a.bin' }] });
  const f = await waitFor(dl, it.id, ['completed', 'error']);
  const el = Date.now() - t; assert.equal(f.status, 'completed'); assert.ok(el > 2000, 'tardó ' + el + ' ms, debió ser ≥2 s'); assert.ok(el < 6500, 'tardó demasiado: ' + el); s.srv.close();
});

test('máximo de descargas simultáneas', async () => {
  const data = rnd(1e6), s = await server({ '/a.bin': data }, { chunk: 65536, delay: 15 }); const dl = mk().start();
  dl.setCfg({ maxActive: 2 });
  const ids = [1, 2, 3, 4].map((n) => dl.add({ gid: 'x:c' + n, name: 'C' + n, autoInstall: false, files: [{ url: s.url + '/a.bin?' + n, name: 'a.bin' }] }).id);
  let max = 0;
  for (let k = 0; k < 400; k++) { const a = dl.list().filter((i) => i.status === 'downloading').length; max = Math.max(max, a); if (dl.list().every((i) => i.status === 'completed')) break; await sleep(25); }
  assert.ok(max <= 2 && max >= 1, 'simultáneas=' + max);
  for (const id of ids) assert.equal((await waitFor(dl, id, ['completed', 'error'])).status, 'completed'); s.srv.close();
});

test('cancelar borra archivos y registro', async () => {
  const data = rnd(4e6), s = await server({ '/a.bin': data }, { chunk: 65536, delay: 10 }); const dl = mk().start();
  const it = dl.add({ gid: 'x:7', name: 'Can', autoInstall: false, files: [{ url: s.url + '/a.bin' }] });
  await sleep(250); await dl.cancel(it.id);
  assert.equal(dl.get(it.id), null); assert.ok(!fs.existsSync(path.join(dl.cfg.dlDir, 'wt-' + it.id))); s.srv.close();
});

test('integridad: hash incorrecto → error y archivo descartado', async () => {
  const data = rnd(300000), s = await server({ '/a.bin': data }); const dl = mk().start();
  const it = dl.add({ gid: 'x:8', name: 'Bad', autoInstall: false, files: [{ url: s.url + '/a.bin', sha256: sha(Buffer.from('otro')) }] });
  const f = await waitFor(dl, it.id, ['completed', 'error']);
  assert.equal(f.status, 'error'); assert.equal(f.error.code, 'integrity');
  assert.ok(!fs.existsSync(path.join(dl.cfg.dlDir, 'wt-' + it.id, 'a.bin'))); s.srv.close();
});

test('integridad: tamaño distinto al declarado', async () => {
  const data = rnd(300000), s = await server({ '/a.bin': data }); const dl = mk().start();
  const it = dl.add({ gid: 'x:9', name: 'Sz', autoInstall: false, files: [{ url: s.url + '/a.bin', size: 12345 }] });
  const f = await waitFor(dl, it.id, ['error']); assert.equal(f.error.code, 'integrity'); s.srv.close();
});

test('404 es error definitivo, y retry lo reintenta', async () => {
  const s = await server({}); const dl = mk().start();
  const it = dl.add({ gid: 'x:10', name: '404', autoInstall: false, files: [{ url: s.url + '/404' }] });
  const f = await waitFor(dl, it.id, 'error'); assert.equal(f.error.code, 'http');
  assert.ok(dl.retry(it.id)); await waitFor(dl, it.id, 'error'); s.srv.close();
});

test('persistencia: lo que estaba bajando se reanuda al reiniciar', async () => {
  const data = rnd(4e6), s = await server({ '/a.bin': data }, { chunk: 65536, delay: 8 }); const dl = mk().start();
  const it = dl.add({ gid: 'x:11', name: 'Pers', autoInstall: false, files: [{ url: s.url + '/a.bin', sha256: sha(data) }] });
  await sleep(300); await dl.shutdown();
  const saved = JSON.parse(fs.readFileSync(dl.o.file, 'utf8')); assert.equal(saved.items[0].status, 'queued');
  const dl2 = new Dl(dl.o); dl2.load(); assert.equal(dl2.list().length, 1); dl2.start();
  const f = await waitFor(dl2, it.id, ['completed', 'error']); assert.equal(f.status, 'completed', JSON.stringify(f.error));
  assert.ok(s.hits.ranges.length >= 1); s.srv.close();
});

test('persistencia: lo pausado sigue pausado y la configuración se conserva', async () => {
  const data = rnd(4e6), s = await server({ '/a.bin': data }, { chunk: 65536, delay: 8 }); const dl = mk().start();
  dl.setCfg({ maxActive: 5, speedLimit: 0, keepArchives: true });
  const it = dl.add({ gid: 'x:12', name: 'Pz', autoInstall: false, files: [{ url: s.url + '/a.bin' }] });
  await sleep(150); dl.pause(it.id); await waitFor(dl, it.id, 'paused'); dl._persist(true);
  const dl2 = new Dl(dl.o); dl2.load(); assert.equal(dl2.get(it.id).status, 'paused'); assert.equal(dl2.cfg.maxActive, 5); assert.equal(dl2.cfg.keepArchives, true);
  s.srv.close();
});

test('espacio en disco insuficiente se rechaza antes de descargar', async () => {
  const dl = mk({ statfs: () => ({ free: 1e6, total: 1e9 }) });
  assert.throws(() => dl.add({ gid: 'x:13', name: 'Big', files: [{ url: 'http://127.0.0.1:1/a.bin', size: 5e9 }] }), (e) => e.code === 'space');
});

test('validaciones: sin nombre, sin gid, torrent/magnet, protocolo raro', () => {
  const dl = mk();
  assert.throws(() => dl.add({ gid: 'a', files: [{ url: 'http://x/a' }] }));
  assert.throws(() => dl.add({ name: 'a', files: [{ url: 'http://x/a' }] }));
  assert.throws(() => dl.add({ gid: 'a', name: 'a', files: [{ url: 'magnet:?xt=urn:btih:abc' }] }), (e) => e.code === 'transport');
  assert.throws(() => dl.add({ gid: 'a', name: 'a', files: [{ url: 'http://x/a.torrent' }] }), (e) => e.code === 'transport');
  assert.throws(() => dl.add({ gid: 'a', name: 'a', files: [{ url: 'file:///etc/passwd' }] }));
});

test('no duplica un juego que ya se está descargando', async () => {
  const dl = mk(); const s = await server({ '/a.bin': rnd(1000) });
  const a = dl.add({ gid: 'x:14', name: 'D', autoInstall: false, files: [{ url: s.url + '/a.bin' }] });
  const b = dl.add({ gid: 'x:14', name: 'D', autoInstall: false, files: [{ url: s.url + '/a.bin' }] });
  assert.equal(a.id, b.id); assert.equal(b.dup, true); await dl.shutdown(); s.srv.close();
});

/* ---------- etapa 2: instalación ---------- */
test('instala un zip: extrae, aplana carpeta envoltorio, detecta exe, marcador, limpia descargas', async () => {
  const z = zipOf({ 'MiJuego/game.exe': 'MZ', 'MiJuego/data/a.dat': 'xx', 'MiJuego/readme.txt': 'hi' });
  const s = await server({ '/g.zip': z }); const dl = mk().start(); const ev = [];
  dl.on('installed', (i) => ev.push(i));
  const it = dl.add({ gid: 'steam:99', name: 'Mi Juego: Edición', files: [{ url: s.url + '/g.zip', sha256: sha(z) }] });
  const f = await waitFor(dl, it.id, ['completed', 'error']);
  assert.equal(f.status, 'completed', JSON.stringify(f.error));
  assert.equal(path.basename(f.result.dir), 'Mi Juego_ Edición');
  assert.ok(fs.existsSync(path.join(f.result.dir, 'game.exe')), 'aplanado');
  assert.equal(f.result.exe, path.join(f.result.dir, 'game.exe'));
  const mkr = JSON.parse(fs.readFileSync(path.join(f.result.dir, MARK), 'utf8')); assert.equal(mkr.gid, 'steam:99');
  assert.equal(f.result.files, 3);
  assert.ok(!fs.existsSync(path.join(dl.cfg.dlDir, 'wt-' + it.id)), 'descargas limpiadas');
  assert.ok(!fs.readdirSync(path.dirname(f.result.dir)).some((n) => n.startsWith('.wt-inst')), 'sin temporales');
  assert.equal(ev.length, 1); s.srv.close();
});

test('keepArchives conserva los archivos descargados', async () => {
  const z = zipOf({ 'a.exe': 'MZ' }); const s = await server({ '/g.zip': z }); const dl = mk().start();
  const it = dl.add({ gid: 'x:k', name: 'K', keepArchives: true, files: [{ url: s.url + '/g.zip' }] });
  await waitFor(dl, it.id, ['completed', 'error']); assert.ok(fs.existsSync(path.join(dl.cfg.dlDir, 'wt-' + it.id, 'g.zip'))); s.srv.close();
});

test('carpeta de instalación elegida y nombres repetidos se numeran', async () => {
  const z = zipOf({ 'a.exe': 'MZ' }); const s = await server({ '/g.zip': z }); const dl = mk().start();
  const i1 = dl.add({ gid: 'x:i1', name: 'Igual', files: [{ url: s.url + '/g.zip' }] }); await waitFor(dl, i1.id, 'completed');
  const i2 = dl.add({ gid: 'x:i2', name: 'Igual', files: [{ url: s.url + '/g.zip' }] }); const f2 = await waitFor(dl, i2.id, 'completed');
  assert.equal(path.basename(f2.result.dir), 'Igual (2)');
  const want = path.join(dl.base, 'elegida', 'Mio');
  const i3 = dl.add({ gid: 'x:i3', name: 'X', installDir: want, files: [{ url: s.url + '/g.zip' }] }); const f3 = await waitFor(dl, i3.id, 'completed');
  assert.equal(f3.result.dir, want);
  const i4 = dl.add({ gid: 'x:i4', name: 'Y', installDir: want, files: [{ url: s.url + '/g.zip' }] }); const f4 = await waitFor(dl, i4.id, 'error');
  assert.equal(f4.error.code, 'dest'); assert.ok(fs.existsSync(path.join(want, 'a.exe')), 'no pisó lo existente'); s.srv.close();
});

test('archivo corrupto: error de extracción, sin restos, y se puede reintentar sin re-descargar', async () => {
  const bad = Buffer.from('esto no es un zip'.repeat(50)); const s = await server({ '/g.zip': bad }); const dl = mk().start();
  const it = dl.add({ gid: 'x:bad', name: 'Roto', files: [{ url: s.url + '/g.zip' }] });
  const f = await waitFor(dl, it.id, 'error'); assert.equal(f.error.code, 'extract');
  assert.ok(!fs.existsSync(path.join(dl.cfg.installDir, 'Roto')));
  assert.ok(!fs.readdirSync(dl.cfg.installDir).some((n) => n.startsWith('.wt-inst')));
  assert.ok(fs.existsSync(path.join(dl.cfg.dlDir, 'wt-' + it.id, 'g.zip')), 'conserva lo descargado para reintentar');
  const hits = s.hits.n; dl.retry(it.id); await waitFor(dl, it.id, 'error'); assert.equal(s.hits.n, hits, 'no volvió a descargar'); s.srv.close();
});

test('archivos sueltos (sin comprimir) se instalan tal cual', async () => {
  const s = await server({ '/g.exe': Buffer.from('MZ12345'), '/d.pak': rnd(1000) }); const dl = mk().start();
  const it = dl.add({ gid: 'x:loose', name: 'Suelto', files: [{ url: s.url + '/g.exe' }, { url: s.url + '/d.pak' }] });
  const f = await waitFor(dl, it.id, ['completed', 'error']); assert.equal(f.status, 'completed', JSON.stringify(f.error));
  assert.deepEqual(fs.readdirSync(f.result.dir).sort(), ['.winteer-install.json', 'd.pak', 'g.exe']); s.srv.close();
});

test('sin espacio para descomprimir', async () => {
  const z = zipOf({ 'a.exe': 'MZ' }); const s = await server({ '/g.zip': z });
  let first = true;
  const dl = mk({ archiveSize: async () => 8e9, statfs: () => (first ? { free: 1e11, total: 2e11 } : { free: 1e9, total: 2e11 }) }).start();
  const it = dl.add({ gid: 'x:sp', name: 'Sp', files: [{ url: s.url + '/g.zip' }] }); first = false;
  const f = await waitFor(dl, it.id, 'error'); assert.equal(f.error.code, 'space'); s.srv.close();
});

test('desinstalar: borra solo carpetas con marcador', async () => {
  const z = zipOf({ 'a.exe': 'MZ' }); const s = await server({ '/g.zip': z }); const dl = mk().start(); const ev = [];
  dl.on('uninstalled', (i) => ev.push(i));
  const it = dl.add({ gid: 'steam:5', name: 'Un', files: [{ url: s.url + '/g.zip' }] }); const f = await waitFor(dl, it.id, 'completed');
  const ajena = path.join(dl.base, 'ajena'); fs.mkdirSync(ajena); fs.writeFileSync(path.join(ajena, 'x'), '1');
  await assert.rejects(dl.uninstall({ dir: ajena })); assert.ok(fs.existsSync(ajena));
  await assert.rejects(dl.uninstall({ dir: '/' })); await assert.rejects(dl.uninstall({ dir: 'relativa' }));
  const r = await dl.uninstall({ id: it.id }); assert.equal(r.gid, 'steam:5');
  assert.ok(!fs.existsSync(f.result.dir)); assert.equal(dl.get(it.id), null); assert.equal(ev.length, 1); s.srv.close();
});

test('markSynced y reinstalar tras desinstalar', async () => {
  const z = zipOf({ 'a.exe': 'MZ' }); const s = await server({ '/g.zip': z }); const dl = mk().start();
  const it = dl.add({ gid: 'x:re', name: 'Re', files: [{ url: s.url + '/g.zip' }] }); const f = await waitFor(dl, it.id, 'completed');
  assert.equal(f.libSynced, false); dl.markSynced(it.id); assert.equal(dl.get(it.id).libSynced, true);
  await dl.uninstall({ id: it.id });
  const again = dl.add({ gid: 'x:re', name: 'Re', files: [{ url: s.url + '/g.zip' }] }); assert.notEqual(again.id, it.id);
  await waitFor(dl, again.id, 'completed'); s.srv.close();
});

/* ---------- contraseña y archivos anidados ---------- */
const exPw = async (f, out, _p, o) => {
  const a = ['-q', '-o']; if (o && o.password) a.push('-P', o.password); a.push(f, '-d', out);
  const r = cp.spawnSync('unzip', a); if (r.status === 0) return { ok: 1 };
  return { err: r.status === 82 || /password|incorrect/i.test(String(r.stderr) + String(r.stdout)) ? 'El archivo tiene contraseña' : 'dañado' };
};
function zipPw(entries, pw) {
  const d = tmp(), src = path.join(d, 'src'); fs.mkdirSync(src);
  for (const [k, v] of Object.entries(entries)) { const p = path.join(src, k); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, v); }
  const out = path.join(d, 'x.zip'); cp.execFileSync('zip', ['-qr', ...(pw ? ['-P', pw] : []), out, '.'], { cwd: src }); return fs.readFileSync(out);
}
const mkx = () => mk({ extract: exPw });
test('archivo con contraseña: pide contraseña (código password) y con la correcta instala', async () => {
  const z = zipPw({ 'g.exe': 'MZ', 'a.dat': 'x' }, 'secreta'); const s = await server({ '/g.zip': z }); const dl = mkx().start();
  const it = dl.add({ gid: 'x:pw', name: 'Pw', files: [{ url: s.url + '/g.zip' }] });
  const e = await waitFor(dl, it.id, 'error'); assert.equal(e.error.code, 'password');
  dl.setPassword(it.id, 'mala'); assert.equal((await waitFor(dl, it.id, ['error', 'completed'])).error.code, 'password');
  dl.setPassword(it.id, 'secreta'); const f = await waitFor(dl, it.id, ['completed', 'error']); assert.equal(f.status, 'completed', JSON.stringify(f.error));
  assert.ok(fs.existsSync(path.join(f.result.dir, 'g.exe'))); assert.equal(dl.items.get(it.id).pw, '', 'no guarda la contraseña tras instalar'); s.srv.close();
});
test('contraseña indicada al agregar', async () => {
  const z = zipPw({ 'g.exe': 'MZ' }, 'abc'); const s = await server({ '/g.zip': z }); const dl = mkx().start();
  const it = dl.add({ gid: 'x:pw2', name: 'Pw2', password: 'abc', files: [{ url: s.url + '/g.zip' }] }); assert.equal((await waitFor(dl, it.id, ['completed', 'error'])).status, 'completed'); s.srv.close();
});
test('archivo dentro de archivo: se descomprime en cadena', async () => {
  const inner = zipPw({ 'g.exe': 'MZ', 'data/a.dat': 'x' }), outer = (() => { const d = tmp(), src = path.join(d, 's'); fs.mkdirSync(src); fs.writeFileSync(path.join(src, 'inner.zip'), inner); fs.writeFileSync(path.join(src, 'LEEME.txt'), 'hola'); const o = path.join(d, 'o.zip'); cp.execFileSync('zip', ['-qr', o, '.'], { cwd: src }); return fs.readFileSync(o); })();
  const s = await server({ '/o.zip': outer }); const dl = mkx().start();
  const it = dl.add({ gid: 'x:nest', name: 'Nest', files: [{ url: s.url + '/o.zip' }] }); const f = await waitFor(dl, it.id, ['completed', 'error']); assert.equal(f.status, 'completed', JSON.stringify(f.error));
  assert.ok(fs.existsSync(path.join(f.result.dir, 'g.exe'))); assert.ok(fs.existsSync(path.join(f.result.dir, 'data', 'a.dat'))); assert.ok(!fs.existsSync(path.join(f.result.dir, 'inner.zip'))); s.srv.close();
});
test('un juego con su propio .zip de recursos NO se toca', async () => {
  const z = zipPw({ 'g.exe': 'MZ', 'recursos.zip': 'PK-no-tocar', 'data/b.dat': 'x' }); const s = await server({ '/g.zip': z }); const dl = mkx().start();
  const it = dl.add({ gid: 'x:keep', name: 'Keep', files: [{ url: s.url + '/g.zip' }] }); const f = await waitFor(dl, it.id, ['completed', 'error']); assert.equal(f.status, 'completed', JSON.stringify(f.error));
  assert.equal(fs.readFileSync(path.join(f.result.dir, 'recursos.zip'), 'utf8'), 'PK-no-tocar'); s.srv.close();
});
test('solo archivos comprimidos y nada más (sin carpetas ni exe) se anidan; con exe suelto no', async () => {
  const inner = zipPw({ 'g.exe': 'MZ' }); const d = tmp(), src = path.join(d, 's'); fs.mkdirSync(src); fs.writeFileSync(path.join(src, 'a.zip'), inner); fs.writeFileSync(path.join(src, 'setup.exe'), 'MZ');
  const o = path.join(d, 'o.zip'); cp.execFileSync('zip', ['-qr', o, '.'], { cwd: src }); const s = await server({ '/o.zip': fs.readFileSync(o) }); const dl = mkx().start();
  const it = dl.add({ gid: 'x:n2', name: 'N2', files: [{ url: s.url + '/o.zip' }] }); const f = await waitFor(dl, it.id, ['completed', 'error']); assert.equal(f.status, 'completed', JSON.stringify(f.error));
  assert.ok(fs.existsSync(path.join(f.result.dir, 'a.zip')), 'con setup.exe al lado no se extrae a.zip'); s.srv.close();
});

test('host que da 403 a Node: reintenta con la red de Chromium (referer + identidad) y completa', async () => {
  const data = rnd(1e6), seen = [];
  const srv = http.createServer((req, res) => {
    seen.push({ ua: req.headers['user-agent'], ref: req.headers.referer || '' });
    if (!/Chrome\//.test(req.headers['user-agent'] || '') || !req.headers.referer) { res.writeHead(403); return res.end('blocked'); }
    res.writeHead(200, { 'content-length': data.length }); res.end(data);
  });
  await new Promise((ok) => srv.listen(0, '127.0.0.1', ok)); const url = 'http://127.0.0.1:' + srv.address().port + '/a.bin';
  let chromiumCalls = 0;
  const dl = mk({
    httpIdentity: async () => ({ ua: 'Mozilla/5.0 Chrome/140.0.0.0 Safari/537.36', cookie: '' }),
    chromiumGet: (u, headers, cb) => { chromiumCalls++; const EE = require('events'), out = new EE(); out.setTimeout = () => {}; out.destroy = () => {};
      http.get(u, { headers }, (r) => { r.setTimeout = r.setTimeout || (() => {}); cb(r); }).on('error', (e) => out.emit('error', e)); return out; },
  }).start();
  const it = dl.add({ gid: 'x:403', name: 'Juego', autoInstall: false, files: [{ url, size: data.length }] });
  const f = await waitFor(dl, it.id, ['completed', 'error']);
  assert.equal(f.status, 'completed', JSON.stringify(f.error)); assert.ok(chromiumCalls >= 1);
  srv.close();
});

test('host que bloquea siempre: error 403 con explicación clara', async () => {
  const srv = http.createServer((q, r) => { r.writeHead(403); r.end(); });
  await new Promise((ok) => srv.listen(0, '127.0.0.1', ok));
  const dl = mk().start(); const it = dl.add({ gid: 'x:403b', name: 'J', autoInstall: false, files: [{ url: 'http://127.0.0.1:' + srv.address().port + '/a.bin', size: 10 }] });
  const f = await waitFor(dl, it.id, ['error', 'completed']); assert.equal(f.status, 'error'); assert.match(JSON.stringify(f.error), /rechaz|protege/i); srv.close();
});
