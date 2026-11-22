'use strict';
// Descarga en partes: se prueba el motor (main.js) con un servidor HTTP local que acepta rangos, cortes al azar, pausa y cancelación.
const test = require('node:test'), assert = require('node:assert');
const fs = require('fs'), http = require('http'), path = require('path'), os = require('os'), crypto = require('crypto');
const src = fs.readFileSync(path.join(__dirname, '..', 'main.js'), 'utf8');
const code = src.slice(src.indexOf('const WDL_CONN'), src.indexOf('function wdlMove(d) {'));
const net = { request(o) { const u = new URL(o.url), h = {}; let req = null; const ev = {}; const api = { setHeader: (k, v) => { h[k] = v; }, on: (e, f) => { ev[e] = f; return api; }, abort: () => { try { req && req.destroy(); } catch (e) {} ev.abort && ev.abort(); }, end: () => { req = http.get({ host: u.hostname, port: u.port, path: u.pathname, headers: h }, (r) => { ev.response && ev.response({ statusCode: r.statusCode, headers: r.headers, on: (e, f) => { r.on(e, f); return r; } }); }); req.on('error', (e) => ev.error && ev.error(e)); } }; return api; } };
const { wdlProbe, wdlSegRun } = new Function('fs', 'net', 'session', code + ';return {wdlProbe,wdlSegRun}')(fs, net, {});
const data = crypto.randomBytes(18 * 1024 * 1024 + 777);
const srv = http.createServer((q, r) => { const m = /bytes=(\d+)-(\d+)?/.exec(q.headers.range || ''); if (!m) { r.writeHead(200); return r.end(data); } const s = +m[1], e = m[2] ? +m[2] : data.length - 1;
  if (s > 5e6 && q.headers['x-cut'] !== '1' && Math.random() < .2) { r.writeHead(206, { 'content-range': `bytes ${s}-${e}/${data.length}` }); r.write(data.subarray(s, s + 500)); return setTimeout(() => r.destroy(), 10); }
  r.writeHead(206, { 'content-range': `bytes ${s}-${e}/${data.length}`, 'content-length': e - s + 1 }); setTimeout(() => r.end(data.subarray(s, e + 1)), 20); });
let url; test.before(() => new Promise((r) => srv.listen(0, () => { url = 'http://127.0.0.1:' + srv.address().port + '/f.bin'; r(); })));
test.after(() => srv.close());
const tmp = (n) => path.join(os.tmpdir(), 'wt-seg-' + process.pid + n);
test('el sondeo detecta rangos y tamaño', async () => { const p = await wdlProbe({}, url, ''); assert.equal(p.total, data.length); });
test('baja completo y bit a bit igual, aun con cortes', async () => { const d = { id: 1, tmp: tmp('a') }; const st = await new Promise((res) => { d.fin = res; wdlSegRun(d, {}, url, data.length, '', () => {}); }); assert.equal(st, 'completed'); assert.ok(fs.readFileSync(d.tmp).equals(data)); fs.unlinkSync(d.tmp); });
test('cancelar corta y avisa', async () => { const d = { id: 2, tmp: tmp('b') }; const st = await new Promise((res) => { d.fin = res; wdlSegRun(d, {}, url, data.length, '', () => {}); setTimeout(() => d.stop(true), 30); }); assert.equal(st, 'cancelled'); try { fs.unlinkSync(d.tmp); } catch (e) {} });
test('pausa y reanuda sin perder datos', async () => { const d = { id: 3, tmp: tmp('c') }; const st = await new Promise((res) => { d.fin = res; wdlSegRun(d, {}, url, data.length, '', () => {}); setTimeout(() => d.stop(false), 50); setTimeout(() => { d.paused = false; }, 600); }); assert.equal(st, 'completed'); assert.ok(fs.readFileSync(d.tmp).equals(data)); fs.unlinkSync(d.tmp); });

// Servidor que acepta la conexión pero no manda nada (como el caso del 0 B): la prueba debe poder abortarse sin avisar de «cancelado».
test('abortar la prueba sin datos es silencioso y no deja nada colgado', async () => {
  const tar = http.createServer((q, r) => { r.writeHead(206, { 'content-range': 'bytes 0-1/' + 40 * 1024 * 1024 }); /* nunca responde el cuerpo */ });
  await new Promise((r) => tar.listen(0, r)); const u = 'http://127.0.0.1:' + tar.address().port + '/x.bin';
  let fin = 0; const d = { id: 9, tmp: tmp('tar'), fin: () => { fin++; } };
  wdlSegRun(d, {}, u, 40 * 1024 * 1024, '', () => {});
  await new Promise((r) => setTimeout(r, 600));
  assert.equal(d.got, 0);
  d.noFin = 1; d.cancelled = true; d.reqs.forEach((q) => { try { q.abort(); } catch (e) {} });
  await new Promise((r) => setTimeout(r, 800));
  assert.equal(fin, 0); tar.close(); try { fs.unlinkSync(d.tmp); } catch (e) {}
});

// Servidor que limita cada conexión (como BuzzHeavier): con varias conexiones tiene que ir bastante más rápido que con una.
test('con un servidor que limita cada conexión, varias conexiones son mucho más rápidas', async () => {
  const body = crypto.randomBytes(16 * 1024 * 1024), RATE = 2 * 1024 * 1024; /* ~2 MB/s por conexión */
  const srv2 = http.createServer((q, r) => { const m = /bytes=(\d+)-(\d+)?/.exec(q.headers.range || ''); const s = m ? +m[1] : 0, e = m && m[2] ? +m[2] : body.length - 1;
    r.writeHead(m ? 206 : 200, { 'content-range': `bytes ${s}-${e}/${body.length}`, 'content-length': e - s + 1 }); let p = s; const step = () => { if (p > e) return r.end(); const n = Math.min(Math.floor(RATE / 10), e + 1 - p); r.write(body.subarray(p, p + n)); p += n; setTimeout(step, 100); }; step(); });
  await new Promise((r) => srv2.listen(0, r)); const u = 'http://127.0.0.1:' + srv2.address().port + '/y.bin';
  const d = { id: 10, tmp: tmp('rate') }; const t0 = Date.now();
  const st = await new Promise((res) => { d.fin = res; wdlSegRun(d, {}, u, body.length, '', () => {}); });
  const secs = (Date.now() - t0) / 1000; srv2.close();
  assert.equal(st, 'completed'); assert.ok(fs.readFileSync(d.tmp).equals(body)); fs.unlinkSync(d.tmp);
  console.log('16 MB con varias conexiones: ' + secs.toFixed(1) + ' s (una sola conexión tardaría ~8 s)');
  assert.ok(secs < 6);
});
