'use strict';
/*
 * WINTEER · cliente del ayudante BitTorrent (proceso principal, sin dependencias).
 *
 * El motor BitTorrent real es libtorrent-rasterbar, dentro de un programa aparte (bt/winteer-bt.exe).
 * Este módulo lo lanza y habla con él por stdin/stdout con un JSON por línea.
 * Si el ayudante no está instalado, available() da false y WINTEER no ofrece BitTorrent
 * (no se simula nada). Protocolo completo en docs/bittorrent.md.
 */
const fs = require('fs'), path = require('path'), cp = require('child_process');
const { EventEmitter } = require('events');

const err = (code, msg) => Object.assign(new Error(msg), { code });

class Bt extends EventEmitter {
  /** @param {{exe:string,args?:string[],stateDir:string,spawn?:Function}} o */
  constructor(o) { super(); this.o = o; this.p = null; this.rid = 0; this.pend = new Map(); this.buf = ''; this.lim = { down: 0, up: 0 }; this.ready = null; this.closing = false; }
  available() { try { return !!this.o.exe && fs.statSync(this.o.exe).isFile(); } catch (e) { return false; } }

  _spawn() {
    if (this.ready) return this.ready;
    if (!this.available()) return Promise.reject(err('bt-missing', 'El ayudante BitTorrent no está instalado'));
    this.ready = new Promise((resolve, reject) => {
      let p;
      try { fs.mkdirSync(this.o.stateDir, { recursive: true }); p = (this.o.spawn || cp.spawn)(this.o.exe, [...(this.o.args || []), '--state', this.o.stateDir], { windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] }); }
      catch (e) { this.ready = null; return reject(err('bt-spawn', 'No pude abrir el ayudante BitTorrent')); }
      this.p = p; this.buf = ''; this.closing = false; let up = false, errTxt = '';
      p.stdout.setEncoding('utf8');
      p.stdout.on('data', (c) => { this.buf += c; let i; while ((i = this.buf.indexOf('\n')) >= 0) { const l = this.buf.slice(0, i).trim(); this.buf = this.buf.slice(i + 1); if (l) this._line(l); } });
      p.stderr.on('data', (c) => { errTxt = (errTxt + c).slice(-400); });
      p.stdin.on('error', () => {});
      p.on('error', (e) => { this.ready = null; this.p = null; if (!up) reject(err('bt-spawn', 'No pude abrir el ayudante BitTorrent (' + (e.code || e.message) + ')')); this._dead('error'); });
      p.on('exit', (code) => { this.ready = null; this.p = null; if (!up) reject(err('bt-spawn', 'El ayudante BitTorrent se cerró al iniciar' + (errTxt ? ': ' + errTxt.trim().slice(-120) : ''))); this._dead(this.closing ? 'closed' : 'exit', code); });
      this.once('hello', (m) => { up = true; this.info = m; resolve(m); this._raw({ op: 'limits', down: this.lim.down, up: this.lim.up }); });
      const ht = setTimeout(() => { if (!up) { try { p.kill(); } catch (e) {} reject(err('bt-spawn', 'El ayudante BitTorrent no respondió')); } }, 15000); ht.unref(); p.once('exit', () => clearTimeout(ht));
      this._raw({ op: 'hello' });
    });
    this.ready.catch(() => { this.ready = null; });
    return this.ready;
  }
  _dead(why, code) {
    for (const [, r] of this.pend) r.rej(err('bt-exit', 'El ayudante BitTorrent se cerró'));
    this.pend.clear(); this.emit('exit', { why, code });
  }
  _raw(o) { try { this.p && this.p.stdin.write(JSON.stringify(o) + '\n'); } catch (e) {} }
  _line(l) {
    let m; try { m = JSON.parse(l); } catch (e) { return; }
    if (!m || typeof m.ev !== 'string') return;
    if (m.ev === 'ack' || m.ev === 'nack') { const r = this.pend.get(m.rid); if (r) { this.pend.delete(m.rid); m.ev === 'ack' ? r.res(m) : r.rej(err(m.code || 'bt', m.msg || 'Error de BitTorrent')); } return; }
    this.emit(m.ev, m);
  }
  /** Manda una orden y espera la confirmación del ayudante. */
  async send(cmd) {
    await this._spawn();
    return new Promise((res, rej) => { const rid = ++this.rid; const t = setTimeout(() => { if (this.pend.has(rid)) { this.pend.delete(rid); rej(err('bt-timeout', 'El ayudante BitTorrent no respondió')); } }, 30000); t.unref(); this.pend.set(rid, { res: (x) => { clearTimeout(t); res(x); }, rej: (x) => { clearTimeout(t); rej(x); } }); this._raw(Object.assign({}, cmd, { rid })); });
  }
  setLimits(down, up) { this.lim = { down: Math.max(0, down | 0), up: Math.max(0, up | 0) }; if (this.p && this.ready) this._raw({ op: 'limits', down: this.lim.down, up: this.lim.up }); }
  async shutdown() {
    if (!this.p) return; this.closing = true;
    const p = this.p; this._raw({ op: 'shutdown' });
    await new Promise((r) => { const t = setTimeout(() => { try { p.kill(); } catch (e) {} r(); }, 3500); p.once('exit', () => { clearTimeout(t); r(); }); });
  }
}

module.exports = { Bt };
