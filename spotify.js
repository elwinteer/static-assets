'use strict';
/* WINTEER · Spotify (control remoto por la Web API, cada usuario con su propia app de Spotify).
   Login PKCE por loopback, sin secreto. La música la reproduce la app de Spotify de la PC;
   WINTEER la abre minimizada si hace falta, la baja de prioridad y le libera RAM. */
const http = require('http'), crypto = require('crypto'), fs = require('fs'), path = require('path');
const { spawn, execFile } = require('child_process');
const os = require('os');

const PORT = 48731, REDIR = 'http://127.0.0.1:' + PORT + '/callback';
const SCOPES = 'user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private playlist-read-collaborative';
const API = 'https://api.spotify.com/v1', ACC = 'https://accounts.spotify.com';
const b64u = (b) => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function create(ctx) {
  const { cfg, saveCfg, shell } = ctx;
  const S = () => { if (!cfg.sp || typeof cfg.sp !== 'object') cfg.sp = {}; return cfg.sp; };
  let refreshing = null, until = 0, srv = null, launching = null, lastPlay = Date.now(), tuneT = null, idleT = null;

  /* ---------- login ---------- */
  function setCid(c) {
    c = String(c || '').trim();
    if (!/^[a-f0-9]{32}$/i.test(c)) return { ok: false, e: 'El código tiene que ser el "Client ID" de 32 letras y números.' };
    const s = S(); if (s.cid !== c) { s.cid = c; s.a = ''; s.r = ''; s.x = 0; } saveCfg(); return { ok: true };
  }
  function login() {
    return new Promise((resolve) => {
      const s = S(); if (!s.cid) return resolve({ ok: false, e: 'Falta el Client ID.' });
      try { if (srv) { srv.close(); srv = null; } } catch (e) {}
      const ver = b64u(crypto.randomBytes(64)), st = b64u(crypto.randomBytes(12));
      const chal = b64u(crypto.createHash('sha256').update(ver).digest());
      let done = false;
      const fin = (r) => { if (done) return; done = true; try { srv && srv.close(); } catch (e) {} srv = null; resolve(r); };
      srv = http.createServer(async (rq, rs) => {
        try {
          const u = new URL(rq.url, 'http://127.0.0.1:' + PORT);
          if (u.pathname !== '/callback') { rs.writeHead(404); return rs.end(); }
          const code = u.searchParams.get('code'), err = u.searchParams.get('error');
          const page = (t) => { rs.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); rs.end('<!doctype html><meta charset="utf-8"><body style="margin:0;background:#0c0c0d;color:#f4f4f6;font:600 20px Segoe UI,system-ui,sans-serif;display:grid;place-items:center;height:100vh;text-align:center"><div>' + t + '<div style="font-weight:400;font-size:14px;color:#a9a9b3;margin-top:10px">Ya podés cerrar esta pestaña y volver a WINTEER.</div></div>'); };
          if (err || !code || u.searchParams.get('state') !== st) { page('No se pudo conectar'); return fin({ ok: false, e: err ? 'Spotify rechazó el permiso.' : 'Respuesta inválida.' }); }
          const r = await tokenReq({ grant_type: 'authorization_code', code, redirect_uri: REDIR, client_id: s.cid, code_verifier: ver });
          if (!r.ok) { page('No se pudo conectar'); return fin({ ok: false, e: r.e }); }
          page('✓ Spotify conectado'); fin({ ok: true });
        } catch (e) { fin({ ok: false, e: 'Error al conectar.' }); }
      });
      srv.on('error', () => fin({ ok: false, e: 'El puerto ' + PORT + ' está ocupado. Cerrá otros programas y probá de nuevo.' }));
      srv.listen(PORT, '127.0.0.1', () => {
        const q = new URLSearchParams({ client_id: s.cid, response_type: 'code', redirect_uri: REDIR, scope: SCOPES, state: st, code_challenge_method: 'S256', code_challenge: chal });
        try { shell.openExternal(ACC + '/authorize?' + q.toString()); } catch (e) { fin({ ok: false, e: 'No pude abrir el navegador.' }); }
      });
      setTimeout(() => fin({ ok: false, e: 'Se acabó el tiempo. Probá de nuevo.' }), 180000);
    });
  }
  async function tokenReq(body) {
    try {
      const r = await fetch(ACC + '/api/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(body).toString() });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.access_token) return { ok: false, st: r.status, e: j.error_description || j.error || ('Error ' + r.status), bad: j.error === 'invalid_grant' || j.error === 'invalid_client' };
      const s = S(); s.a = j.access_token; if (j.refresh_token) s.r = j.refresh_token; s.x = Date.now() + (j.expires_in || 3600) * 1000 - 30000; saveCfg();
      return { ok: true };
    } catch (e) { return { ok: false, e: 'Sin conexión.' }; }
  }
  async function token() {
    const s = S(); if (!s.cid || !s.r) return '';
    if (s.a && Date.now() < s.x) return s.a;
    if (!refreshing) refreshing = tokenReq({ grant_type: 'refresh_token', refresh_token: s.r, client_id: s.cid }).finally(() => { refreshing = null; });
    const r = await refreshing;
    if (!r.ok) { if (r.bad) { s.a = ''; s.r = ''; saveCfg(); } return ''; }
    return s.a;
  }
  function logout() { const s = S(); s.a = ''; s.r = ''; s.x = 0; saveCfg(); return { ok: true }; }
  const connected = () => !!(S().cid && S().r);

  /* ---------- API ---------- */
  async function api(method, p, body) {
    if (Date.now() < until) return { s: 429, d: null };
    const t = await token(); if (!t) return { s: 401, d: null };
    try {
      const r = await fetch(API + p, { method, headers: Object.assign({ Authorization: 'Bearer ' + t }, body ? { 'Content-Type': 'application/json' } : {}), body: body ? JSON.stringify(body) : undefined });
      if (r.status === 429) { until = Date.now() + (parseInt(r.headers.get('retry-after') || '3', 10) || 3) * 1000; return { s: 429, d: null }; }
      if (r.status === 401) { S().a = ''; return { s: 401, d: null }; }
      let d = null; if (r.status !== 204) { try { d = await r.json(); } catch (e) {} }
      return { s: r.status, d };
    } catch (e) { return { s: 0, d: null }; }
  }
  const img = (a) => { const l = (a || []).slice().sort((x, y) => (x.width || 0) - (y.width || 0)); const m = l.find((i) => (i.width || 0) >= 200) || l[l.length - 1]; return m ? m.url : ''; };
  const trk = (t) => t ? ({ n: t.name, a: (t.artists || []).map((x) => x.name).join(', '), cv: img((t.album || {}).images), uri: t.uri, d: t.duration_ms || 0 }) : null;

  async function now() {
    const r = await api('GET', '/me/player?additional_types=episode');
    if (r.s === 204 || (r.s === 200 && !r.d)) return { ok: true, idle: true };
    if (r.s !== 200) return { ok: false, s: r.s };
    const d = r.d, it = d.item || {};
    if (d.is_playing) lastPlay = Date.now();
    return { ok: true, idle: false, pl: !!d.is_playing, n: it.name || '', a: it.artists ? it.artists.map((x) => x.name).join(', ') : ((it.show || {}).name || ''), cv: img((it.album || it.show || {}).images), uri: it.uri || '', pos: d.progress_ms || 0, dur: it.duration_ms || 0, sh: !!d.shuffle_state, rp: d.repeat_state || 'off', vol: d.device ? d.device.volume_percent : null, dev: d.device ? d.device.name : '', ctx: d.context ? d.context.uri : '', ts: Date.now() };
  }
  async function devices() { const r = await api('GET', '/me/player/devices'); return r.s === 200 && r.d ? (r.d.devices || []) : null; }

  /* ---------- abrir Spotify en segundo plano ---------- */
  function procs() {
    return new Promise((res) => {
      if (process.platform !== 'win32') return res([]);
      execFile('tasklist', ['/FI', 'IMAGENAME eq Spotify.exe', '/FO', 'CSV', '/NH'], { windowsHide: true, timeout: 6000 }, (e, o) => {
        const ids = []; String(o || '').split(/\r?\n/).forEach((l) => { const m = /^"Spotify\.exe","(\d+)"/i.exec(l.trim()); if (m) ids.push(+m[1]); }); res(ids);
      });
    });
  }
  function launch() {
    try {
      if (process.platform !== 'win32') { shell.openExternal('spotify:'); return 'uri'; }
      const exe = path.join(process.env.APPDATA || '', 'Spotify', 'Spotify.exe');
      if (fs.existsSync(exe)) { spawn(exe, ['--minimized'], { detached: true, stdio: 'ignore', windowsHide: false }).unref(); return 'exe'; }
      try { spawn('explorer.exe', ['shell:AppsFolder\\SpotifyAB.SpotifyMusic_zpdnekdrzrea0!Spotify'], { detached: true, stdio: 'ignore' }).unref(); return 'store'; } catch (e) {}
      shell.openExternal('spotify:'); return 'uri';
    } catch (e) { return ''; }
  }
  /* Deja disponible un dispositivo: si Spotify no está abierto lo abre y le pasa la reproducción */
  function ensure() {
    if (launching) return launching;
    launching = (async () => {
      try {
        let d = await devices(); if (d === null) return { ok: false, e: 'auth' };
        if (!d.length) {
          const had = (await procs()).length > 0;
          if (!had) launch();
          for (let i = 0; i < 80 && !d.length; i++) {
            await sleep(500); d = (await devices()) || [];
            if (d.length) break;
            /* abierto pero sin aparecer como dispositivo: lo despierta con el enlace spotify: y, si sigue mudo, lo reinicia */
            if (had && i === 6) { try { shell.openExternal('spotify:'); } catch (e) {} }
            if (!had && i === 14) { try { launch(); } catch (e) {} }
            if (i === 30) { try { await new Promise((r) => execFile('taskkill', ['/IM', 'Spotify.exe', '/F'], { windowsHide: true }, () => r())); await sleep(1500); launch(); } catch (e) {} }
            if (i === 56) { try { shell.openExternal('spotify:'); } catch (e) {} }
          }
          if (!d.length) return { ok: false, e: 'nodev' };
          tune();
        }
        let t = d.find((x) => x.is_active);
        if (!t) { t = d.find((x) => !x.is_restricted) || d[0]; await api('PUT', '/me/player', { device_ids: [t.id], play: false }); await sleep(700); }
        return { ok: true, id: t.id };
      } finally { setTimeout(() => { launching = null; }, 800); }
    })();
    return launching;
  }
  /* Menos peso: prioridad baja y RAM liberada (el número del administrador de tareas baja) */
  async function tune() {
    try {
      const ids = await procs(); if (!ids.length) return;
      ids.forEach((p) => { try { os.setPriority(p, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) {} });
      const ps = "$s='[DllImport(\"psapi.dll\")]public static extern bool EmptyWorkingSet(IntPtr h);';Add-Type -MemberDefinition $s -Name W -Namespace N;Get-Process Spotify -ErrorAction SilentlyContinue|%{[void][N.W]::EmptyWorkingSet($_.Handle)}";
      execFile('powershell', ['-NoProfile', '-NonInteractive', '-WindowStyle', 'Hidden', '-Command', ps], { windowsHide: true, timeout: 20000 }, () => {});
    } catch (e) {}
  }
  function startTimers() {
    if (!tuneT) tuneT = setInterval(() => { if (connected()) tune(); }, 8 * 60 * 1000);
    if (!idleT) idleT = setInterval(async () => {
      try {
        const m = +S().idle || 0; if (!m || !connected()) return;
        if (!(await procs()).length) return;
        const n = await now(); if (!n.ok) return;
        if (n.idle || !n.pl) { if (Date.now() - lastPlay > m * 60000) { execFile('taskkill', ['/IM', 'Spotify.exe', '/F'], { windowsHide: true }, () => {}); lastPlay = Date.now(); } }
      } catch (e) {}
    }, 60000);
  }
  function stopTimers() { try { clearInterval(tuneT); clearInterval(idleT); } catch (e) {} tuneT = idleT = null; }

  /* ---------- operaciones permitidas ---------- */
  const URI = /^spotify:(track|album|playlist|artist|episode|show):[A-Za-z0-9]{10,30}$/;
  async function call(op, a) {
    a = a || {};
    switch (op) {
      case 'state': return { ok: true, cid: !!S().cid, on: connected(), redir: REDIR, idle: +S().idle || 0 };
      case 'cid': return setCid(a.v);
      case 'login': { const r = await login(); if (r.ok) startTimers(); return r; }
      case 'logout': stopTimers(); return logout();
      case 'idle': { const v = [0, 10, 30].includes(+a.v) ? +a.v : 0; S().idle = v; saveCfg(); return { ok: true, idle: v }; }
      case 'now': return now();
      case 'ensure': return ensure();
      case 'play': {
        const body = {}; if (a.uri && URI.test(a.uri)) { if (/:(track|episode)\:/.test(a.uri) && !a.ctx) body.uris = [a.uri]; else body.context_uri = a.uri; }
        if (a.ctx && URI.test(a.ctx)) { body.context_uri = a.ctx; if (a.uri && URI.test(a.uri)) body.offset = { uri: a.uri }; delete body.uris; }
        const bd = Object.keys(body).length ? body : undefined;
        let r = await api('PUT', '/me/player/play', bd);
        if (r.s === 404 || r.s === 502 || r.s === 503) {
          const e = await ensure(); if (!e.ok) return { ok: false, e: e.e || 'nodev', s: r.s };
          r = await api('PUT', '/me/player/play' + (e.id ? '?device_id=' + encodeURIComponent(e.id) : ''), bd);
          if (r.s === 404) { await sleep(1200); r = await api('PUT', '/me/player/play' + (e.id ? '?device_id=' + encodeURIComponent(e.id) : ''), bd); }
        }
        const rs = r.d && r.d.error && r.d.error.reason;
        return { ok: r.s < 300 && r.s > 0, s: r.s, e: r.s === 403 && /PREMIUM/i.test(rs || '') ? 'premium' : (r.s === 401 ? 'auth' : '') };
      }
      case 'pause': { const r = await api('PUT', '/me/player/pause'); return { ok: r.s < 300 }; }
      case 'next': { const r = await api('POST', '/me/player/next'); return { ok: r.s < 300 }; }
      case 'prev': { const r = await api('POST', '/me/player/previous'); return { ok: r.s < 300 }; }
      case 'seek': { const r = await api('PUT', '/me/player/seek?position_ms=' + Math.max(0, Math.round(+a.v || 0))); return { ok: r.s < 300 }; }
      case 'vol': { const r = await api('PUT', '/me/player/volume?volume_percent=' + Math.max(0, Math.min(100, Math.round(+a.v || 0)))); return { ok: r.s < 300 }; }
      case 'shuffle': { const r = await api('PUT', '/me/player/shuffle?state=' + (a.v ? 'true' : 'false')); return { ok: r.s < 300 }; }
      case 'repeat': { const v = ['off', 'context', 'track'].includes(a.v) ? a.v : 'off'; const r = await api('PUT', '/me/player/repeat?state=' + v); return { ok: r.s < 300 }; }
      case 'search': {
        const q = String(a.q || '').trim().slice(0, 100); if (!q) return { ok: true, t: [], p: [] };
        const r = await api('GET', '/search?type=track,playlist&limit=8&q=' + encodeURIComponent(q));
        if (r.s !== 200 || !r.d) return { ok: false, s: r.s };
        return { ok: true, t: ((r.d.tracks || {}).items || []).map(trk).filter(Boolean), p: ((r.d.playlists || {}).items || []).filter(Boolean).map((p) => ({ n: p.name, cv: img(p.images), uri: p.uri, o: (p.owner || {}).display_name || '' })) };
      }
      case 'playlists': {
        const r = await api('GET', '/me/playlists?limit=40');
        if (r.s !== 200 || !r.d) return { ok: false, s: r.s };
        return { ok: true, p: (r.d.items || []).filter(Boolean).map((p) => ({ n: p.name, cv: img(p.images), uri: p.uri, c: ((p.items || p.tracks || {}).total) || 0 })) };
      }
      case 'queue': {
        const r = await api('GET', '/me/player/queue');
        if (r.s !== 200 || !r.d) return { ok: false, s: r.s };
        return { ok: true, q: (r.d.queue || []).slice(0, 14).map(trk).filter(Boolean) };
      }
      case 'addq': { if (!URI.test(a.uri || '')) return { ok: false }; const r = await api('POST', '/me/player/queue?uri=' + encodeURIComponent(a.uri)); return { ok: r.s < 300 }; }
      case 'app': { try { shell.openExternal('https://www.spotify.com/download/windows/'); } catch (e) {} return { ok: true }; }
      case 'dash': { try { shell.openExternal('https://developer.spotify.com/dashboard'); } catch (e) {} return { ok: true }; }
    }
    return { ok: false };
  }
  if (connected()) setTimeout(startTimers, 3000);
  return { call, REDIR, connected, stopTimers };
}
module.exports = { create, REDIR, PORT };
