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
