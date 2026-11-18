'use strict';
// DOBLE DE PRUEBAS del protocolo del ayudante BitTorrent. Solo lo usan los tests para comprobar
// que dl.js y bt.js hablan bien el protocolo. NO descarga nada real ni forma parte del producto.
const fs = require('fs'), path = require('path'), rl = require('readline').createInterface({ input: process.stdin });
const out = (o) => process.stdout.write(JSON.stringify(o) + '\n');
const T = new Map(); const mode = process.env.FAKE_BT || '';
rl.on('line', (l) => {
  let m; try { m = JSON.parse(l); } catch (e) { return; }
  const ack = () => out({ ev: 'ack', rid: m.rid }), nack = (code, msg) => out({ ev: 'nack', rid: m.rid, code, msg });
  if (m.op === 'hello') return out({ ev: 'hello', version: 'fake', lt: 'test' });
  if (m.op === 'limits') return;
  if (m.op === 'shutdown') { process.exit(0); }
  if (m.op === 'add') {
    if (mode === 'nack') return nack('bad-uri', 'enlace no válido');
    if (mode === 'crash') { ack(); return setTimeout(() => process.exit(3), 50); }
    ack(); let t = T.get(m.id);
    if (t) { t.paused = false; return; }
    t = { paused: false, n: 0, dir: m.dir }; T.set(m.id, t);
    const total = 3000000;
    t.iv = setInterval(() => {
      if (t.paused) return; t.n++;
      if (mode === 'error' && t.n === 2) { clearInterval(t.iv); return out({ ev: 'error', id: m.id, code: 'disk', msg: 'sin permisos' }); }
      const done = Math.min(total, t.n * 600000);
      out({ ev: 'status', id: m.id, hash: 'abc123', state: done < total ? 'downloading' : 'finished', done, total, down: 600000 * 5, up: 1000, peers: 7, seeds: 3 });
      if (done >= total) {
        clearInterval(t.iv); const g = path.join(m.dir, 'Juego'); fs.mkdirSync(path.join(g, 'data'), { recursive: true });
        fs.writeFileSync(path.join(g, 'game.exe'), 'MZ'); fs.writeFileSync(path.join(g, 'data', 'a.dat'), 'x');
        out({ ev: 'finished', id: m.id, root: m.dir, files: [{ p: 'Juego/game.exe', s: 2 }, { p: 'Juego/data/a.dat', s: 1 }] });
      }
    }, 80);
    return;
  }
  if (m.op === 'pause') { const t = T.get(m.id); if (t) t.paused = true; return ack(); }
  if (m.op === 'resume') { const t = T.get(m.id); if (t) t.paused = false; return ack(); }
  if (m.op === 'remove') { const t = T.get(m.id); if (t) { clearInterval(t.iv); T.delete(m.id); } return ack(); }
  ack();
});
