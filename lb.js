'use strict';
// Base de datos publica de LaunchBox: arma un indice chico (nombre+plataforma -> imagenes de caja, lateral y disco)
const fs = require('fs');
const PLAT = { pc: 'Windows', ps1: 'Sony Playstation', ps2: 'Sony Playstation 2', psp: 'Sony PSP', gc: 'Nintendo GameCube', wii: 'Nintendo Wii', n64: 'Nintendo 64', snes: 'Super Nintendo Entertainment System', nes: 'Nintendo Entertainment System', gb: 'Nintendo Game Boy', gbc: 'Nintendo Game Boy Color', gba: 'Nintendo Game Boy Advance', nds: 'Nintendo DS', genesis: 'Sega Genesis', sms: 'Sega Master System', gg: 'Sega Game Gear', pce: 'NEC TurboGrafx-16', a26: 'Atari 2600', x360: 'Microsoft Xbox 360', ps3: 'Sony Playstation 3', ps4: 'Sony Playstation 4', switch: 'Nintendo Switch', wiiu: 'Nintendo Wii U', '3ds': 'Nintendo 3DS' };
const WANT = new Set(Object.values(PLAT));
const norm = (s) => String(s || '').toLowerCase().replace(/&/g, 'and').replace(/^the\s+/, '').replace(/[^a-z0-9]+/g, '');
const unx = (s) => String(s || '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const tag = (b, t) => { const m = b.match(new RegExp('<' + t + '>([^<]*)</' + t + '>')); return m ? unx(m[1]).trim() : ''; };
const kind = (t) => /^Box - Front/i.test(t) ? 'f' : /^Box - Back/i.test(t) ? 'b' : /spine|side/i.test(t) ? 's' : /^(Disc|Cart - Front)$/i.test(t) ? 'd' : '';
const rank = (r) => /world/i.test(r) ? 0 : /north america|united states/i.test(r) ? 1 : /europe|united kingdom/i.test(r) ? 2 : /japan/i.test(r) ? 4 : 3;

function parse(file, onProg) {
  return new Promise((res, rej) => {
    const n = {}, want = new Set(), im = {};
    let buf = '', got = 0, lt = 0; const tot = fs.statSync(file).size || 1;
    const eat = () => {
      for (;;) {
        const a = buf.indexOf('<Game>'), c = buf.indexOf('<GameImage>');
        let s = -1, close = '';
        if (a >= 0 && (c < 0 || a < c)) { s = a; close = '</Game>'; } else if (c >= 0) { s = c; close = '</GameImage>'; }
        if (s < 0) { buf = buf.length > 20 ? buf.slice(-20) : buf; return; }
        const e = buf.indexOf(close, s);
        if (e < 0) { buf = buf.slice(s); return; }
        const b = buf.slice(s, e + close.length); buf = buf.slice(e + close.length);
        if (close === '</Game>') {
          const name = tag(b, 'Name'), plat = tag(b, 'Platform'), id = tag(b, 'DatabaseID');
          if (name && id && WANT.has(plat)) { const k = norm(name) + '|' + plat; const l = n[k] || (n[k] = []); if (l.length < 4 && !l.includes(id)) l.push(id); want.add(id); }
        } else {
          const id = tag(b, 'DatabaseID');
          if (!want.has(id)) continue;
          const t = kind(tag(b, 'Type')), fn = tag(b, 'FileName'); if (!t || !fn) continue;
          const o = im[id] || (im[id] = {}), l = o[t] || (o[t] = []);
          if (l.length < 10) l.push([fn, tag(b, 'Region')]);
        }
      }
    };
    const rs = fs.createReadStream(file, { encoding: 'utf8', highWaterMark: 1 << 20 });
    rs.on('data', (ch) => { try { got += Buffer.byteLength(ch); buf += ch; eat(); const t = Date.now(); if (onProg && t - lt > 400) { lt = t; onProg(got / tot); } } catch (e) { rs.destroy(); rej(e); } });
    rs.on('error', rej);
    rs.on('end', () => { for (const id in im) for (const t in im[id]) im[id][t].sort((x, y) => rank(x[1]) - rank(y[1])); res({ v: 1, t: Date.now(), n, i: im }); });
  });
}

function find(I, o) {
  if (!I) return null;
  const plat = PLAT[o.pl]; if (!plat) return null;
  const nm = String(o.name || '');
  let ids = null;
  for (const c of [nm, nm.split(/\s*[-–:]\s+/)[0], nm.replace(/\(.*?\)/g, '')]) { const k = norm(c) + '|' + plat; if (I.n[k]) { ids = I.n[k]; break; } }
  if (!ids) return null;
  const M = { f: 'front', b: 'back', s: 'side', d: 'disc' }, out = { front: [], back: [], side: [], disc: [] };
  for (const id of ids) { const e = I.i[id]; if (!e) continue; for (const t in e) for (const [fn, rg] of e[t]) out[M[t]].push({ u: 'https://images.launchbox-app.com/' + fn, r: rg }); }
  return out;
}
module.exports = { parse, find, PLAT };
