const { app, BrowserWindow, ipcMain, shell, protocol, net, dialog, Menu, nativeImage, Tray, globalShortcut, desktopCapturer, screen } = require('electron');
const path = require('path'), fs = require('fs'), crypto = require('crypto');
app.commandLine.appendSwitch('autoplay-policy','no-user-gesture-required');
app.setAppUserModelId('com.winteer.launcher');
const { spawn, execFile } = require('child_process');
const { pathToFileURL, fileURLToPath } = require('url');

protocol.registerSchemesAsPrivileged([{ scheme: 'wimg', privileges: { standard: true, secure: true, supportFetchAPI: true, bypassCSP: true, stream: true } }]);
if (!app.requestSingleInstanceLock()) { app.quit(); process.exit(0); }

let win = null, tray = null, quitting = false, fromBg = false, padProc = null;
const CFGF = path.join(app.getPath('userData'), 'winteer-cfg.json');
let cfg = { bg: false, auto: false, pad: true, shots: true, shotKey: 'F12' };
try { cfg = Object.assign(cfg, JSON.parse(fs.readFileSync(CFGF, 'utf8'))); } catch (e) {}
const saveCfg = () => { try { fs.writeFileSync(CFGF, JSON.stringify(cfg)); } catch (e) {} };
const startHidden = process.argv.includes('--hidden');
function applyLogin() { try { app.setLoginItemSettings({ openAtLogin: !!cfg.auto, args: ['--hidden'] }); } catch (e) {} }
function hideWin() { if (!win) return; win.setFullScreen(false); win.hide(); try { win.webContents.setBackgroundThrottling(true); } catch (e) {} }
function showWin() { if (pendingInstall) { installNow(); return; } if (!win) createWindow(); if (!win.isMaximized() && !win.isFullScreen()) win.maximize(); try { win.webContents.setBackgroundThrottling(false); } catch (e) {} if (win.isMinimized()) win.restore(); win.show(); win.focus(); }
function bpFromBg() { const hidden = !win || !win.isVisible() || !win.isFocused(); if (!win) createWindow(); if (hidden) { fromBg = true; showWin(); win.webContents.send('bp', 'open'); } else win.webContents.send('bp', 'toggle'); }
function mkShortcut() {
  if (process.platform !== 'win32') return;
  try {
    const sm = path.join(app.getPath('appData'), 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'WINTEER.lnk');
    shell.writeShortcutLink(sm, 'replace', { target: process.execPath, cwd: path.dirname(process.execPath), description: 'WINTEER', icon: path.join(__dirname, 'icon.ico'), iconIndex: 0, appUserModelId: 'com.winteer.launcher' });
  } catch (e) {}
}
function fixShortcuts() {
  if (process.platform !== 'win32') return;
  const ico = path.join(__dirname, 'icon.ico'), me = String(process.execPath).toLowerCase();
  const dirs = [app.getPath('desktop'), path.join(process.env.PUBLIC || 'C:\\Users\\Public', 'Desktop'), path.join(app.getPath('appData'), 'Microsoft', 'Windows', 'Start Menu', 'Programs'), path.join(app.getPath('appData'), 'Microsoft', 'Internet Explorer', 'Quick Launch', 'User Pinned', 'TaskBar')];
  for (const d of dirs) {
    let list = []; try { list = fs.readdirSync(d); } catch (e) { continue; }
    for (const f of list) {
      if (!/\.lnk$/i.test(f)) continue;
      const lp = path.join(d, f);
      try {
        const o = shell.readShortcutLink(lp);
        if (String(o.target || '').toLowerCase() === me) shell.writeShortcutLink(lp, 'update', { icon: ico, iconIndex: 0, appUserModelId: 'com.winteer.launcher' });
      } catch (e) {}
    }
  }
}
function mkTray() {
  if (tray) return;
  try {
    const ic = nativeImage.createFromPath(path.join(__dirname, 'icon.png')).resize({ width: 32, height: 32 });
    tray = new Tray(ic); tray.setToolTip('WINTEER');
    tray.setContextMenu(Menu.buildFromTemplate([
      { label: 'Abrir WINTEER', click: () => showWin() },
      { label: 'Modo mando', click: () => { fromBg = true; showWin(); win.webContents.send('bp', 'open'); } },
      { type: 'separator' },
      { label: 'Salir', click: () => { quitting = true; app.quit(); } },
    ]));
    tray.on('click', () => showWin());
  } catch (e) {}
}
function rmTray() { if (tray) { try { tray.destroy(); } catch (e) {} tray = null; } }
const PADPS = `Add-Type @"
using System;using System.Runtime.InteropServices;
public class XI{[StructLayout(LayoutKind.Sequential)]public struct S{public uint P;public ushort B;public byte LT,RT;public short LX,LY,RX,RY;}
[DllImport("xinput1_4.dll",EntryPoint="#100")]public static extern int Ex(int i,out S s);}
"@
$held=0;$was=$false
while($true){$on=$false;$g=$false;$c=$false
for($i=0;$i -lt 4;$i++){$s=New-Object XI+S;if([XI]::Ex($i,[ref]$s) -eq 0){$on=$true;if(($s.B -band 0x400) -ne 0){$g=$true};if(($s.B -band 0x30) -eq 0x30){$c=$true}}}
if($g -and -not $was){Write-Output 'T'};$was=$g
if($c){$held++;if($held -eq 8){Write-Output 'T'}}else{$held=0}
if($on){Start-Sleep -Milliseconds 120}else{Start-Sleep -Milliseconds 1500}}`;
function startPad() {
  if (padProc || process.platform !== 'win32' || !cfg.bg || !cfg.pad) return;
  try {
    padProc = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-WindowStyle', 'Hidden', '-EncodedCommand', Buffer.from(PADPS, 'utf16le').toString('base64')], { windowsHide: true, stdio: ['ignore', 'pipe', 'ignore'] });
    padProc.stdout.on('data', (d) => { if (String(d).includes('T') && !(win && win.isVisible() && win.isFocused())) bpFromBg(); });
    padProc.on('exit', () => { padProc = null; });
  } catch (e) { padProc = null; }
}
function stopPad() { if (padProc) { try { padProc.kill(); } catch (e) {} padProc = null; } }
function applyBg() { mkShortcut(); fixShortcuts(); applyLogin(); if (cfg.bg) { mkTray(); startPad(); } else { rmTray(); stopPad(); } if (!cfg.bg) stopPad(); }
const send = (ev) => { if (win && !win.isDestroyed()) win.webContents.send('game', ev); };

/* ---------- caché de imágenes en disco ---------- */
let CACHE = '';
const idx = new Map(), bad = new Map();
const MIME = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' };
const sniff = (b) => b[0] === 0xff && b[1] === 0xd8 ? 'jpg' : b[0] === 0x89 && b[1] === 0x50 ? 'png' : b.slice(0, 4).toString() === 'RIFF' ? 'webp' : b.slice(0, 3).toString() === 'GIF' ? 'gif' : '';
function loadIdx() { idx.clear(); try { fs.mkdirSync(CACHE, { recursive: true }); for (const f of fs.readdirSync(CACHE)) { const m = f.match(/^([0-9a-f]{40})\.(\w+)$/); if (m) idx.set(m[1], m[2]); } } catch (e) {} }
const pend = new Map();
async function srcBuffer(u) {
  if (/^file:/i.test(u)) { return fs.promises.readFile(fileURLToPath(u)); }
  const h = crypto.createHash('sha1').update(u).digest('hex'), ext = idx.get(h);
  if (ext) { try { return await fs.promises.readFile(path.join(CACHE, h + '.' + ext)); } catch (e) { idx.delete(h); } }
  const r = await net.fetch(u, { headers: { 'user-agent': 'Mozilla/5.0 WINTEER' } });
  if (!r.ok) throw 0;
  const buf = Buffer.from(await r.arrayBuffer()), e = sniff(buf);
  if (!e || buf.length < 300) throw 0;
  await fs.promises.writeFile(path.join(CACHE, h + '.' + e), buf); idx.set(h, e);
  return buf;
}
let imgAct = 0; const imgQ = [];
const imgSlot = () => new Promise((r) => { const go = () => { imgAct++; r(); }; imgAct < 3 ? go() : imgQ.push(go); });
const imgFree = () => { imgAct--; const n = imgQ.shift(); if (n) n(); };
const tick = () => new Promise((r) => setImmediate(r));
async function imgHandler(req) {
  const sp = new URL(req.url).searchParams, u = sp.get('u') || '', w = parseInt(sp.get('w') || '0', 10) || 0;
  if (!/^(https?|file):/i.test(u)) return new Response('', { status: 400 });
  const key = crypto.createHash('sha1').update(w ? u + '|w' + w : u).digest('hex');
  const serve = (p) => net.fetch(pathToFileURL(p).toString());
  let ext = idx.get(key);
  if (ext) { try { return await serve(path.join(CACHE, key + '.' + ext)); } catch (e) { idx.delete(key); } }
  if (bad.has(u) && Date.now() - bad.get(u) < 10 * 60 * 1000) return new Response('', { status: 404 });
  try {
    let job = pend.get(key);
    if (!job) {
      job = (async () => {
        await imgSlot();
        try {
          const buf = await srcBuffer(u);
          await tick();
          if (w) {
            let out = buf, e = sniff(buf) || 'jpg';
            try { const ni = nativeImage.createFromBuffer(buf); if (!ni.isEmpty() && ni.getSize().width > w) { await tick(); out = ni.resize({ width: w, quality: 'good' }).toJPEG(86); e = 'jpg'; } } catch (x) {}
            await fs.promises.writeFile(path.join(CACHE, key + '.' + e), out); idx.set(key, e);
          } else if (!idx.has(key)) { const e = sniff(buf); if (e) { await fs.promises.writeFile(path.join(CACHE, key + '.' + e), buf); idx.set(key, e); } }
        } finally { imgFree(); }
      })().finally(() => pend.delete(key));
      pend.set(key, job);
    }
    await job;
    ext = idx.get(key);
    return await serve(path.join(CACHE, key + '.' + ext));
  } catch (e) { bad.set(u, Date.now()); return new Response('', { status: 404 }); }
}

/* ---------- seguimiento de procesos (detectar cuándo cerrás un juego) ---------- */
function listProcs() {
  return new Promise((res) => {
    if (process.platform === 'win32') {
      execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', 'Get-Process | Where-Object {$_.Path} | ForEach-Object {$_.Path}'], { windowsHide: true, maxBuffer: 8e6, timeout: 15000 }, (err, out) => res(err ? [] : out.split(/\r?\n/).map(s => s.trim().toLowerCase()).filter(Boolean)));
    } else {
      try { const o = []; for (const p of fs.readdirSync('/proc')) { if (!/^\d+$/.test(p)) continue; try { o.push(fs.readlinkSync('/proc/' + p + '/exe').toLowerCase()); } catch (e) {} } res(o); } catch (e) { res([]); }
    }
  });
}
function steamLibs(steamDir) {
  const libs = new Set(); const root = steamDir || (process.platform === 'win32' ? 'C:\\Program Files (x86)\\Steam' : '');
  if (!root) return [];
  libs.add(root);
  try { const t = fs.readFileSync(path.join(root, 'steamapps', 'libraryfolders.vdf'), 'utf8'); for (const m of t.matchAll(/"path"\s+"([^"]+)"/g)) libs.add(m[1].replace(/\\\\/g, '\\')); } catch (e) {}
  return [...libs];
}
function installDir(appid, steamDir) {
  for (const l of steamLibs(steamDir)) {
    try { const t = fs.readFileSync(path.join(l, 'steamapps', `appmanifest_${appid}.acf`), 'utf8'); const m = t.match(/"installdir"\s+"([^"]+)"/); if (m) return path.join(l, 'steamapps', 'common', m[1]); } catch (e) {}
  }
  return '';
}
function installedApps(steamDir) {
  const libs = steamLibs(steamDir), set = []; let ok = false;
  const list = [];
  for (const l of libs) { try { for (const f of fs.readdirSync(path.join(l, 'steamapps'))) { ok = true; const x = /^appmanifest_(\d+)\.acf$/.exec(f); if (x) { set.push(+x[1]); try { const t = fs.readFileSync(path.join(l, 'steamapps', f), 'utf8'), nm = /"name"\s+"([^"]+)"/.exec(t); if (nm) list.push({ app: +x[1], n: nm[1] }); } catch (e) {} } } } catch (e) {} }
  return { ok, apps: set, list };
}
let bgForGame = false;
function backFromGame() { if (bgForGame) { bgForGame = false; showWin(); } }

/* ---------- capturas de pantalla (solo juegos fuera de Steam, solo monitor principal) ---------- */
const SHOTS = path.join(app.getPath('userData'), 'shots');
let shotReg = '', shotBusy = false, toastWin = null;
function curNonSteam() {
  let best = null;
  for (const [id, t] of track) if (!t.app && t.started && (!best || t.started > best.t.started)) best = { id, t };
  return best;
}
function syncShot() {
  const want = cfg.shots && [...track.values()].some(t => !t.app);
  try {
    if (shotReg && (!want || shotReg !== cfg.shotKey)) { globalShortcut.unregister(shotReg); shotReg = ''; }
    if (want && !shotReg) { if (globalShortcut.register(cfg.shotKey || 'F12', takeShot)) shotReg = cfg.shotKey || 'F12'; }
  } catch (e) {}
}

let ftWin = null;
function friendToast(o) {
  try {
    o = o || {};
    const E = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const ac = /^(#[0-9a-f]{3,8}|rgb\([\d\s,.]+\))$/i.test(o.ac || '') ? o.ac : '#7c5cff';
    const pic = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(o.pic || '') && o.pic.length < 120000 ? o.pic : '';
    if (ftWin && !ftWin.isDestroyed()) ftWin.destroy();
    const d = screen.getPrimaryDisplay(), w = 372, h = 112, wa = d.workArea;
    ftWin = new BrowserWindow({ width: w, height: h, x: wa.x + wa.width - w - 6, y: wa.y + wa.height - h - 6, frame: false, transparent: true, resizable: false, movable: false, skipTaskbar: true, focusable: false, alwaysOnTop: true, show: false, hasShadow: false, webPreferences: { sandbox: true } });
    ftWin.setAlwaysOnTop(true, 'screen-saver');
    const ini = E(String(o.n || '?').trim().charAt(0).toUpperCase());
    const html = `<html><head><title>x</title></head><body style="margin:0;background:transparent;overflow:hidden;font-family:'Segoe UI',system-ui,sans-serif;-webkit-user-select:none"><style>
@keyframes i{from{opacity:0;transform:translateX(46px)}to{opacity:1;transform:none}}@keyframes o{to{opacity:0;transform:translateX(36px)}}@keyframes p{from{transform:scaleX(1)}to{transform:scaleX(0)}}
.t{position:absolute;left:10px;top:10px;right:10px;bottom:10px;display:flex;align-items:center;gap:13px;padding:0 16px 0 18px;border-radius:12px;background:rgba(19,16,32,.97);border:1px solid rgba(255,255,255,.09);box-shadow:0 12px 32px rgba(0,0,0,.6);color:#fff;overflow:hidden;cursor:pointer;animation:i .38s cubic-bezier(.2,.8,.2,1) both}
.t.o{animation:o .3s ease both}.t:hover{background:rgba(27,23,45,.98)}
.t:before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:${ac}}
.t:after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;background:${ac};opacity:.55;transform-origin:left;animation:p 5s linear forwards}
.a{width:46px;height:46px;border-radius:50%;flex:none;background:linear-gradient(135deg,${ac},#4b3fd1);display:grid;place-items:center;font-weight:700;font-size:19px;overflow:hidden}.a img{width:100%;height:100%;object-fit:cover}
.x{min-width:0;flex:1}.k{font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:${ac};filter:brightness(1.35)}
.n{font-size:14.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
.b{font-size:12.5px;color:#b6b2cc;margin-top:2px;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
</style><div class="t" id="t" onclick="document.title='click'"><div class="a">${pic ? `<img src="${pic}">` : ini}</div><div class="x"><div class="k">${E(o.k || 'Mensaje')}</div><div class="n">${E(o.n || 'Amigo')}</div><div class="b">${E(o.b || '')}</div></div></div><script>setTimeout(function(){document.getElementById('t').classList.add('o')},4700)</script></body></html>`;
    ftWin.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
    ftWin.webContents.on('page-title-updated', (_e, t) => {
      if (t === 'click') { try { showWin(); } catch (e) {} send({ type: 'friend-open', c: String(o.c || '') }); try { ftWin.destroy(); } catch (e) {} }
    });
    ftWin.once('ready-to-show', () => { try { ftWin.showInactive(); } catch (e) {} });
    setTimeout(() => { try { if (ftWin && !ftWin.isDestroyed()) ftWin.destroy(); } catch (e) {} }, 5200);
  } catch (e) {}
}
function shotToast(thumbPng, text) {
  try {
    if (toastWin && !toastWin.isDestroyed()) toastWin.destroy();
    const d = screen.getPrimaryDisplay(), w = 300, h = 96;
    toastWin = new BrowserWindow({ width: w, height: h, x: d.workArea.x + d.workArea.width - w - 18, y: d.workArea.y + 18, frame: false, transparent: true, resizable: false, movable: false, skipTaskbar: true, focusable: false, alwaysOnTop: true, show: false, hasShadow: false, webPreferences: { sandbox: true } });
    toastWin.setAlwaysOnTop(true, 'screen-saver'); toastWin.setIgnoreMouseEvents(true);
    const img = thumbPng ? `<img src="data:image/jpeg;base64,${thumbPng.toString('base64')}">` : '';
    toastWin.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`<html><body style="margin:0;font-family:Segoe UI,sans-serif;background:transparent;overflow:hidden"><div style="display:flex;align-items:center;gap:12px;margin:6px;padding:10px 14px;height:64px;border-radius:16px;background:rgba(14,11,26,.92);border:1px solid rgba(165,216,255,.35);box-shadow:0 8px 30px rgba(0,0,0,.5);color:#fff;animation:i .35s cubic-bezier(.2,1,.3,1)">${img.replace('<img','<img style="height:64px;border-radius:8px;box-shadow:0 0 0 1px rgba(255,255,255,.2)"')}<div><div style="font-size:11px;letter-spacing:.18em;color:#a5d8ff;font-weight:700">WINTEER</div><div style="font-size:14px;font-weight:600;margin-top:2px">${text}</div></div></div><style>@keyframes i{from{transform:translateX(40px);opacity:0}}</style></body></html>`));
    toastWin.once('ready-to-show', () => { try { toastWin.showInactive(); } catch (e) {} });
    setTimeout(() => { try { if (toastWin && !toastWin.isDestroyed()) toastWin.destroy(); } catch (e) {} }, 2600);
  } catch (e) {}
}
async function takeShot() {
  if (shotBusy) return; shotBusy = true;
  try {
    const cur = curNonSteam(); if (!cur) return;
    const d = screen.getPrimaryDisplay(), sf = d.scaleFactor || 1, size = { width: Math.round(d.size.width * sf), height: Math.round(d.size.height * sf) };
    if (size.width < 1920) { const k = 1920 / size.width; size.width = 1920; size.height = Math.round(size.height * k); }
    const srcs = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: size });
    const s = srcs.find(x => String(x.display_id) === String(d.id)) || srcs[0];
    if (!s || s.thumbnail.isEmpty()) { shotToast(null, 'No pude capturar la pantalla'); return; }
    const dir = path.join(SHOTS, String(cur.id).replace(/[^\w.-]/g, '_')); fs.mkdirSync(dir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19), file = path.join(dir, stamp + '.jpg'), tfile = path.join(dir, stamp + '.t.jpg');
    fs.writeFileSync(file, s.thumbnail.toJPEG(95));
    const th = s.thumbnail.resize({ width: 640 }).toJPEG(85); fs.writeFileSync(tfile, th);
    shotToast(th, 'Captura guardada');
    send({ type: 'shot', id: cur.id, file: pathToFileURL(file).href, thumb: pathToFileURL(tfile).href });
  } catch (e) { shotToast(null, 'No pude guardar la captura'); } finally { shotBusy = false; }
}
function listShots(id) {
  const dir = path.join(SHOTS, String(id).replace(/[^\w.-]/g, '_')), out = [];
  try { for (const f of fs.readdirSync(dir)) if (/^[\d-T]+\.jpg$/.test(f)) out.push({ n: f, file: pathToFileURL(path.join(dir, f)).href, thumb: pathToFileURL(path.join(dir, f.replace(/\.jpg$/, '.t.jpg'))).href, t: fs.statSync(path.join(dir, f)).mtimeMs }); } catch (e) {}
  return out.sort((a, b) => b.t - a.t);
}

const track = new Map();
let poller = null;
const norm = (p) => p.toLowerCase().replace(/\//g, path.sep === '\\' ? '\\' : '/');
function steamRun(app) {
  return new Promise((res) => {
    if (process.platform !== 'win32') return res(null);
    execFile('reg', ['query', 'HKCU\\Software\\Valve\\Steam\\Apps\\' + app, '/v', 'Running'], { windowsHide: true, timeout: 6000 }, (err, out) => {
      if (err) return res(null);
      const x = /Running\s+REG_DWORD\s+0x([0-9a-f]+)/i.exec(out || ''); res(x ? parseInt(x[1], 16) > 0 : null);
    });
  });
}
async function poll() {
  if (!track.size) { clearInterval(poller); poller = null; return; }
  const sr = new Map();
  for (const [id, t] of track) if (t.app) sr.set(id, await steamRun(t.app));
  const need = [...track].some(([id, t]) => !t.app || sr.get(id) === null);
  const procs = need ? await listProcs() : [];
  for (const [id, t] of [...track]) {
    const byProc = () => procs.some(p => t.exe ? p === t.exe : t.dirs.some(d => p.startsWith(d)));
    const run = t.app && sr.get(id) !== null ? sr.get(id) : byProc();
    if (run) { t.miss = 0; if (!t.started) { t.started = Date.now(); send({ type: 'started', id, t: t.started }); } }
    else if (t.started) { if (++t.miss >= 2) { send({ type: 'stopped', id, t: Date.now() - t.miss * 4000 }); track.delete(id); syncShot(); backFromGame(); } }
    else if (Date.now() - t.since > 5 * 60 * 1000) { send({ type: 'never', id }); track.delete(id); syncShot(); backFromGame(); }
  }
}
function watch(o) {
  const sep = path.sep, dirs = [];
  let exe = '';
  if (o.exe) { exe = norm(o.exe); }
  else if (o.app) { const d = installDir(o.app, o.steamDir); if (d) dirs.push(norm(d) + sep); }
  if (!exe && !dirs.length && !(o.app && process.platform === 'win32')) return false;
  track.set(o.id, { app: (!o.exe && o.app) ? o.app : 0, exe, dirs, since: Date.now(), started: 0, miss: 0 });
  if (!poller) poller = setInterval(poll, 4000);
  setTimeout(poll, 1500);
  syncShot();
  return true;
}

/* ---------- HowLongToBeat (best effort) ---------- */
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36';
async function hltb({ name, app }) {
  const H = { 'user-agent': UA, referer: 'https://howlongtobeat.com/', origin: 'https://howlongtobeat.com' };
  const ini = await (await net.fetch('https://howlongtobeat.com/api/search/site/init?t=' + Date.now(), { headers: H })).json();
  const inc = { mode: 'include', values: [] };
  const body = JSON.stringify({ searchType: 'games', searchTerms: name.replace(/[™®©:]/g, ' ').split(/\s+/).filter(Boolean), searchPage: 1, size: 20, searchOptions: { games: { userId: 0, platform: inc, sortCategory: 'popular', rangeCategory: 'main', rangeTime: { min: null, max: null }, gameplay: { perspective: inc, flow: inc, genre: inc }, year: inc, modifier: '' }, users: { sortCategory: 'postcount' }, lists: { sortCategory: 'follows' }, filter: '', sort: 0, randomizer: 0 }, useCache: true });
  const r = await net.fetch('https://howlongtobeat.com/api/search/site', { method: 'POST', headers: { ...H, 'content-type': 'application/json', 'x-auth-token': ini.token || '' }, body });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const j = await r.json(), list = j.data || [];
  const nrm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const n0 = nrm(name);
  const g = list.find(x => nrm(x.game_name) === n0) || list.find(x => (x.game_alias || '').split(',').some(a => nrm(a) === n0)) || list.find(x => nrm(x.game_name).startsWith(n0) || n0.startsWith(nrm(x.game_name)));
  if (!g) return null;
  const h = (s) => s ? Math.round(s / 3600 * 2) / 2 : 0;
  return { m: h(g.comp_main), e: h(g.comp_plus), c: h(g.comp_100), id: g.game_id };
}

/* ---------- datos de HowLongToBeat que ya tiene Playnite ---------- */
function playniteHltb() {
  const out = [], base = path.join(app.getPath('appData'), 'Playnite', 'ExtensionsData');
  let subs = []; try { subs = fs.readdirSync(base); } catch (e) { return { found: false, list: [] }; }
  let dirFound = false;
  for (const sd of subs) {
    const d = path.join(base, sd, 'HowLongToBeat');
    let files; try { files = fs.readdirSync(d); } catch (e) { continue; }
    dirFound = true;
    for (const f of files) {
      if (!f.endsWith('.json')) continue;
      try {
        const j = JSON.parse(fs.readFileSync(path.join(d, f), 'utf8').replace(/^\uFEFF/, ''));
        const it = (j.Items || [])[0], h = it && it.GameHltbData;
        if (!h || !j.Name) continue;
        const r = (x) => x ? Math.round(x / 3600 * 2) / 2 : 0;
        const m = r(h.MainStoryAverage || h.MainStoryMedian), e = r(h.MainExtraAverage || h.MainExtraMedian), c = r(h.CompletionistAverage || h.CompletionistMedian);
        if (m || e || c) out.push({ n: j.Name, m, e, c });
      } catch (e) {}
    }
  }
  for (const sd of subs) {
    const f = path.join(base, sd, 'HowLongToBeatPageCache.json');
    let raw; try { raw = fs.readFileSync(f, 'utf8').replace(/^\uFEFF/, ''); } catch (e) { continue; }
    dirFound = true;
    let d; try { d = JSON.parse(raw); } catch (e) { continue; }
    const r = (x) => x ? Math.round(x / 3600 * 2) / 2 : 0;
    for (const k in d) {
      try {
        const g = JSON.parse(d[k].Json).props.pageProps.game.data.game[0];
        const m = r(g.comp_main), e = r(g.comp_plus), c = r(g.comp_100);
        if (!g.game_name || !(m || e || c)) continue;
        out.push({ n: g.game_name, m, e, c });
        String(g.game_alias || '').split(',').map(x => x.trim()).filter(Boolean).forEach(al => out.push({ n: al, m, e, c }));
      } catch (e) {}
    }
  }
  return { found: dirFound, list: out };
}

/* ---------- Epic Games y Xbox ---------- */
/* ===== cuentas: Epic y Xbox (importar biblioteca completa) ===== */
const UA_CHROME = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const EPIC_UA = 'UELauncher/11.0.1-14907503+++Portal+Release-Live Windows/10.0.19041.1.256.64bit';
function loginWin(url, check, title) {
  return new Promise((resolve) => {
    let done = false;
    const w = new BrowserWindow({ width: 540, height: 780, autoHideMenuBar: true, title: title || 'Iniciar sesión', backgroundColor: '#111111', webPreferences: { partition: 'wt-login-' + Date.now(), contextIsolation: true, nodeIntegration: false } });
    w.webContents.setUserAgent(UA_CHROME);
    const fin = (v) => { if (done) return; done = true; try { if (!w.isDestroyed()) w.destroy(); } catch (e) {} resolve(v); };
    const probe = async (u) => { if (done) return; try { const r = await check(u, w); if (r) fin(r); } catch (e) {} };
    w.webContents.on('will-redirect', (_e, u) => probe(u));
    w.webContents.on('did-navigate', (_e, u) => probe(u));
    w.webContents.on('did-navigate-in-page', (_e, u) => probe(u));
    w.webContents.on('did-finish-load', () => probe(w.webContents.getURL()));
    w.on('closed', () => fin(null));
    w.webContents.setWindowOpenHandler(({ url: u }) => { w.loadURL(u).catch(() => {}); return { action: 'deny' }; });
    w.loadURL(url, { userAgent: UA_CHROME }).catch(() => {});
  });
}
async function jreq(u, o) {
  const r = await net.fetch(u, o); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {}
  return { status: r.status, ok: r.ok, json: j, text: t.slice(0, 300) };
}
const EP_ID = '34a02cf8f4414e29b15921876da36f9a', EP_SEC = 'daafbccc737745039dffe53d94fc76cf';
const EP_REDIR = 'https://www.epicgames.com/id/api/redirect?clientId=' + EP_ID + '&responseType=code';
const EP_LOGIN = 'https://www.epicgames.com/id/login?redirectUrl=' + encodeURIComponent(EP_REDIR);
async function epicImport(o) {
  const diag = [];
  let code = ((o && o.code) || '').trim();
  if (code) { try { const j = JSON.parse(code); code = j.authorizationCode || code; } catch (e) {} code = code.replace(/^["'\s]+|["'\s]+$/g, ''); }
  if (!code) {
    code = await loginWin(EP_LOGIN, async (u, w) => {
      if (!/epicgames\.com\/id\/api\/redirect/.test(u)) return null;
      const t = await w.webContents.executeJavaScript('document.body ? document.body.innerText : ""');
      try { const j = JSON.parse(t); return j.authorizationCode || null; } catch (e) { return null; }
    }, 'Epic Games · Iniciar sesión');
    if (!code) return { ok: false, cancel: true };
  }
  const tok = await jreq('https://account-public-service-prod03.ol.epicgames.com/account/api/oauth/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', authorization: 'basic ' + Buffer.from(EP_ID + ':' + EP_SEC).toString('base64'), 'user-agent': EPIC_UA }, body: 'grant_type=authorization_code&token_type=eg1&code=' + encodeURIComponent(code) });
  diag.push('token ' + tok.status);
  if (!tok.ok || !tok.json || !tok.json.access_token) return { ok: false, err: 'Epic no aceptó el inicio de sesión (el código vence rápido, probá de nuevo).', diag: diag.join(' | ') + ' ' + tok.text };
  const H = { authorization: 'bearer ' + tok.json.access_token, 'user-agent': EPIC_UA };
  const acc = tok.json.account_id, who = tok.json.displayName || '';
  const recs = new Map();
  const add = (r) => { if (r && r.namespace && r.catalogItemId) { const k = r.namespace + ':' + r.catalogItemId; if (!recs.has(k)) recs.set(k, r); else if (!recs.get(k).appName && r.appName) recs.get(k).appName = r.appName; } };
  try {
    let cursor = '';
    for (let i = 0; i < 40; i++) {
      const r = await jreq('https://library-service.live.use1a.on.epicgames.com/library/api/public/items?includeMetadata=true&platform=Windows' + (cursor ? '&cursor=' + encodeURIComponent(cursor) : ''), { headers: H });
      diag.push('library ' + r.status);
      if (!r.ok || !r.json) break;
      (r.json.records || []).forEach((x) => { if (!x.recordType || x.recordType === 'APPLICATION') add(x); });
      cursor = r.json.responseMetadata && r.json.responseMetadata.nextCursor; if (!cursor) break;
    }
  } catch (e) { diag.push('library err ' + e.message); }
  try {
    const r = await jreq('https://entitlement-public-service-prod08.ol.epicgames.com/entitlement/api/account/' + acc + '/entitlements?start=0&count=5000', { headers: H });
    diag.push('entitlements ' + r.status);
    if (r.ok && Array.isArray(r.json)) r.json.forEach((x) => { if (!x.entitlementType || /EXECUTABLE|GAME/i.test(x.entitlementType)) add({ namespace: x.namespace, catalogItemId: x.catalogItemId, appName: '' }); });
  } catch (e) { diag.push('ent err ' + e.message); }
  if (!recs.size) return { ok: false, err: 'Epic respondió pero no encontré juegos en la cuenta.', diag: diag.join(' | ') };
  const byNs = new Map(); for (const r of recs.values()) { if (!byNs.has(r.namespace)) byNs.set(r.namespace, []); byNs.get(r.namespace).push(r); }
  const jobs = []; for (const [ns, arr] of byNs) { for (let i = 0; i < arr.length; i += 20) jobs.push([ns, arr.slice(i, i + 20)]); }
  const out = []; let cat = 0, catFail = 0, idx = 0;
  const worker = async () => {
    while (idx < jobs.length) {
      const [ns, arr] = jobs[idx++];
      try {
        const r = await jreq('https://catalog-public-service-prod06.ol.epicgames.com/catalog/api/shared/namespace/' + encodeURIComponent(ns) + '/bulk/items?' + arr.map((x) => 'id=' + encodeURIComponent(x.catalogItemId)).join('&') + '&country=US&locale=en-US&includeMainGameDetails=true&includeDLCDetails=false', { headers: H });
        if (!r.ok || !r.json) { catFail++; continue; }
        cat++;
        for (const x of arr) {
          const it = r.json[x.catalogItemId]; if (!it || !it.title) continue;
          const paths = (it.categories || []).map((c) => String(c.path || '').toLowerCase());
          if (!paths.includes('games')) continue;
          if (paths.some((p) => /addon|digitalextra|editor|plugin|demo|soundtrack|dlc|bundles\/|applications\/asset/.test(p))) continue;
          if (it.mainGameItem) continue;
          const kind = (t) => { const k = (it.keyImages || []).find((i) => i.type === t); return k ? k.url : ''; };
          const appName = x.appName || ((it.releaseInfo || [])[0] || {}).appId || '';
          if (!appName) continue;
          out.push({ id: 'ep_' + appName, name: it.title.replace(/\s+/g, ' ').trim(), uri: 'com.epicgames.launcher://apps/' + encodeURIComponent(ns + ':' + x.catalogItemId + ':' + appName) + '?action=launch&silent=true', img: kind('DieselGameBoxTall') || kind('OfferImageTall') || kind('Thumbnail'), wide: kind('DieselGameBox') || kind('OfferImageWide') || kind('DieselStoreFrontWide') });
        }
      } catch (e) { catFail++; }
    }
  };
  await Promise.all([worker(), worker(), worker(), worker(), worker()]);
  diag.push('catalog ok ' + cat + ' fail ' + catFail + ' juegos ' + out.length);
  if (!out.length) return { ok: false, err: 'No pude leer los datos de los juegos de Epic.', diag: diag.join(' | ') };
  return { ok: true, who, list: out, diag: diag.join(' | ') };
}
const XB_ID = '000000004C12AE6F';
const XB_REDIR = 'https://login.live.com/oauth20_desktop.srf';
const XB_LOGIN = 'https://login.live.com/oauth20_authorize.srf?client_id=' + XB_ID + '&redirect_uri=' + encodeURIComponent(XB_REDIR) + '&response_type=token&display=touch&scope=' + encodeURIComponent('service::user.auth.xboxlive.com::MBI_SSL') + '&locale=es';
async function xboxImport() {
  const diag = [];
  const tokUrl = await loginWin(XB_LOGIN, async (u) => { if (u.indexOf(XB_REDIR) === 0 && /access_token=/.test(u)) return u; return null; }, 'Xbox · Iniciar sesión');
  if (!tokUrl) return { ok: false, cancel: true };
  const m = /access_token=([^&]+)/.exec(tokUrl); if (!m) return { ok: false, err: 'Microsoft no devolvió el acceso.', diag: tokUrl.slice(0, 120) };
  const access = decodeURIComponent(m[1]);
  const J = { 'content-type': 'application/json', accept: 'application/json' };
  let ut = null;
  for (const pre of ['t=', 'd=']) {
    const r = await jreq('https://user.auth.xboxlive.com/user/authenticate', { method: 'POST', headers: { ...J, 'x-xbl-contract-version': '1' }, body: JSON.stringify({ Properties: { AuthMethod: 'RPS', SiteName: 'user.auth.xboxlive.com', RpsTicket: pre + access }, RelyingParty: 'http://auth.xboxlive.com', TokenType: 'JWT' }) });
    diag.push('user ' + pre + ' ' + r.status);
    if (r.ok && r.json && r.json.Token) { ut = r.json.Token; break; }
  }
  if (!ut) return { ok: false, err: 'Xbox Live no aceptó el acceso de Microsoft.', diag: diag.join(' | ') };
  const xs = await jreq('https://xsts.auth.xboxlive.com/xsts/authorize', { method: 'POST', headers: { ...J, 'x-xbl-contract-version': '1' }, body: JSON.stringify({ Properties: { UserTokens: [ut], SandboxId: 'RETAIL' }, RelyingParty: 'http://xboxlive.com', TokenType: 'JWT' }) });
  diag.push('xsts ' + xs.status);
  const xui = xs.json && xs.json.DisplayClaims && xs.json.DisplayClaims.xui && xs.json.DisplayClaims.xui[0];
  if (!xs.ok || !xs.json || !xs.json.Token || !xui) return { ok: false, err: 'No pude autorizar tu cuenta de Xbox (puede que no tenga perfil de Xbox creado).', diag: diag.join(' | ') + ' ' + xs.text };
  const auth = 'XBL3.0 x=' + xui.uhs + ';' + xs.json.Token;
  const ident = xui.xid ? 'xuid(' + xui.xid + ')' : 'me';
  const th = await jreq('https://titlehub.xboxlive.com/users/' + ident + '/titles/titlehistory/decoration/detail,image,scid?maxItems=2000', { headers: { authorization: auth, 'x-xbl-contract-version': '2', 'accept-language': 'es-AR', accept: 'application/json' } });
  diag.push('titlehub ' + th.status);
  if (!th.ok || !th.json || !Array.isArray(th.json.titles)) return { ok: false, err: 'Xbox no devolvió tu lista de juegos.', diag: diag.join(' | ') + ' ' + th.text };
  const out = [];
  for (const t of th.json.titles) {
    if (!t || !t.name || !t.pfn) continue;
    if (t.type && !/game/i.test(t.type)) continue;
    const dev = (t.devices || []).map((d) => String(d).toLowerCase());
    if (!dev.some((d) => d === 'pc' || d === 'win32')) continue;
    const imgs = t.images || [];
    const img = (ty) => { const k = imgs.find((i) => String(i.type).toLowerCase() === ty); return k ? k.url : ''; };
    out.push({ id: 'xb_' + t.pfn, name: t.name.replace(/\s+/g, ' ').trim(), uri: 'ms-windows-store://pdp/?PFN=' + encodeURIComponent(t.pfn), img: img('poster') || img('boxart') || img('tile') || t.displayImage || '', wide: img('screenshot') || img('hero') || '' });
  }
  diag.push('juegos PC ' + out.length);
  if (!out.length) return { ok: false, err: 'Tu cuenta de Xbox no tiene juegos de PC en su historial.', diag: diag.join(' | ') };
  return { ok: true, list: out, diag: diag.join(' | ') };
}
function scanEpic() {
  const out = [], dir = path.join(process.env.ProgramData || 'C:\\ProgramData', 'Epic', 'EpicGamesLauncher', 'Data', 'Manifests');
  let files = []; try { files = fs.readdirSync(dir); } catch (e) { return { found: false, list: [] }; }
  for (const f of files) {
    if (!/\.item$/i.test(f)) continue;
    try {
      const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8').replace(/^\uFEFF/, ''));
      if (!j.DisplayName || !j.AppName) continue;
      if (j.MainGameAppName && j.MainGameAppName !== j.AppName) continue;
      if ((j.AppCategories || []).length && !(j.AppCategories || []).includes('games')) continue;
      const exe = j.LaunchExecutable ? path.join(j.InstallLocation || '', j.LaunchExecutable) : '';
      const uri = 'com.epicgames.launcher://apps/' + encodeURIComponent((j.CatalogNamespace || '') + ':' + (j.CatalogItemId || '') + ':' + j.AppName) + '?action=launch&silent=true';
      out.push({ id: 'ep_' + j.AppName, name: j.DisplayName, exe, uri, size: j.InstallSize ? (j.InstallSize / 1073741824).toFixed(1) + ' GB' : '' });
    } catch (e) {}
  }
  return { found: true, list: out };
}
function scanXbox() {
  return new Promise((res) => {
    const ps = "Get-AppxPackage | Where-Object { $_.InstallLocation -and ((Test-Path (Join-Path $_.InstallLocation 'MicrosoftGame.config')) -or $_.InstallLocation -like '*XboxGames*') } | ForEach-Object { [pscustomobject]@{N=$_.Name;F=$_.PackageFamilyName;L=$_.InstallLocation} } | ConvertTo-Json -Compress";
    execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', ps], { windowsHide: true, maxBuffer: 8e6, timeout: 30000 }, (err, outp) => {
      if (err) return res({ found: false, list: [] });
      let arr; try { arr = JSON.parse(outp.trim() || '[]'); } catch (e) { return res({ found: false, list: [] }); }
      if (!Array.isArray(arr)) arr = [arr];
      const list = [];
      for (const p of arr) {
        if (!p || !p.L) continue;
        let name = '', exe = '', appId = 'Game';
        const cfg = (() => { try { return fs.readFileSync(path.join(p.L, 'MicrosoftGame.config'), 'utf8'); } catch (e) { return ''; } })();
        const man = (() => { try { return fs.readFileSync(path.join(p.L, 'AppxManifest.xml'), 'utf8'); } catch (e) { return ''; } })();
        let m = /DefaultDisplayName="([^"]+)"/.exec(cfg); if (m && !/^ms-resource/i.test(m[1])) name = m[1];
        if (!name && /XboxGames/i.test(p.L)) { const parts = p.L.split(/[\\/]/); const i = parts.findIndex(x => /^XboxGames$/i.test(x)); if (i >= 0 && parts[i + 1]) name = parts[i + 1]; }
        if (!name) name = p.N.replace(/^[^.]+\./, '').replace(/([a-z])([A-Z])/g, '$1 $2');
        m = /<Executable[^>]*Name="([^"]+\.exe)"/i.exec(cfg); if (m) exe = path.join(p.L, m[1]);
        m = /<Application[^>]*Id="([^"]+)"/i.exec(man); if (m) appId = m[1];
        if (!cfg && !/XboxGames/i.test(p.L)) continue;
        list.push({ id: 'xb_' + p.F, name, exe, shellApp: 'shell:AppsFolder\\' + p.F + '!' + appId });
      }
      res({ found: true, list });
    });
  });
}

/* ---------- copias de seguridad ---------- */
function writeBackup({ dir, json }) {
  fs.mkdirSync(dir, { recursive: true });
  const f = path.join(dir, 'WINTEER-copia.json'), tmp = f + '.tmp';
  fs.writeFileSync(tmp, json, 'utf8');
  fs.renameSync(tmp, f);
  return f;
}

/* ---------- IGDB (Twitch) ---------- */
let igTok = { tok: '', exp: 0, key: '' }, igChain = Promise.resolve();
async function igToken(id, secret) {
  const key = id + ':' + secret;
  if (igTok.key === key && Date.now() < igTok.exp) return igTok.tok;
  const r = await net.fetch('https://id.twitch.tv/oauth2/token?client_id=' + encodeURIComponent(id) + '&client_secret=' + encodeURIComponent(secret) + '&grant_type=client_credentials', { method: 'POST' });
  if (!r.ok) throw new Error('auth');
  const j = await r.json();
  igTok = { tok: j.access_token, exp: Date.now() + Math.max(60, j.expires_in - 3600) * 1000, key };
  return igTok.tok;
}
function igq(id, secret, endpoint, body) {
  const run = async () => {
    const tok = await igToken(id, secret);
    const r = await net.fetch('https://api.igdb.com/v4/' + endpoint, { method: 'POST', headers: { 'Client-ID': id, Authorization: 'Bearer ' + tok, 'content-type': 'text/plain', accept: 'application/json' }, body });
    if (r.status === 401) { igTok.exp = 0; throw new Error('auth'); }
    if (!r.ok) throw new Error('igdb ' + r.status);
    return r.json();
  };
  const p = igChain.then(() => new Promise(r => setTimeout(r, 280))).then(run);
  igChain = p.catch(() => {});
  return p;
}
const siteLabel = (u) => {
  let h = ''; try { h = new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return null; }
  if (/(^|\.)(twitter|x)\.com$/.test(h)) return 'X';
  if (/instagram\.com$/.test(h)) return 'Instagram';
  if (/facebook\.com$/.test(h)) return 'Facebook';
  if (/youtube\.com$|youtu\.be$/.test(h)) return 'YouTube';
  if (/twitch\.tv$/.test(h)) return 'Twitch';
  if (/reddit\.com$/.test(h)) return 'Reddit';
  if (/discord\.(gg|com)$/.test(h)) return 'Discord';
  if (/linkedin\.com$/.test(h)) return 'LinkedIn';
  if (/wikipedia\.org$|wikia\.|fandom\.com$|steampowered\.com$|epicgames\.com$|gog\.com$|itch\.io$|apple\.com$|play\.google\.com$|igdb\.com$|bsky\.app$|tiktok\.com$/.test(h)) return null;
  return 'Web';
};
const links = (arr) => { const out = [], seen = new Set(); for (const w of (arr || [])) { const l = siteLabel(w.url || ''); if (l && !seen.has(l)) { seen.add(l); out.push([l, w.url]); } } return out; };
async function igdb({ id, secret, name, app }) {
  const F = 'platforms,category,parent_game,version_parent,name,slug,summary,storyline,first_release_date,total_rating,url,genres.name,themes.name,cover.image_id,artworks.image_id,screenshots.image_id,websites.url,involved_companies.developer,involved_companies.publisher,involved_companies.company.name,involved_companies.company.websites.url';
  let g = null;
  const nrm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (app) {
    for (const cond of ['external_game_source = 1', 'category = 1']) {
      try {
        const ex = await igq(id, secret, 'external_games', `fields game; where uid = "${app}" & ${cond}; limit 1;`);
        if (ex[0] && ex[0].game) { const r = await igq(id, secret, 'games', `fields ${F}; where id = ${ex[0].game}; limit 1;`); g = r[0]; }
        break;
      } catch (e) { if (String(e.message) === 'auth') throw e; }
    }
  }
  if (!g) {
    const n = name.replace(/[™®©]/g, '').replace(/"/g, '').trim();
    const r = await igq(id, secret, 'games', `search "${n}"; fields ${F}; limit 8;`);
    const n0 = nrm(n);
    g = r.find(x => nrm(x.name) === n0) || r.find(x => nrm(x.name).startsWith(n0) || n0.startsWith(nrm(x.name))) || null;
  }
  /* preferir la version de PC: si lo hallado no es de PC (port/consola), buscar la de PC */
  const hasPC = (x) => x && (x.platforms || []).some(pl => (pl && pl.id !== undefined ? pl.id : pl) === 6);
  if (g && !hasPC(g)) {
    try {
      const n = name.replace(/[™®©]/g, '').replace(/"/g, '').trim(), n0 = nrm(n);
      const pool = [];
      const par = g.version_parent || g.parent_game;
      if (par) { const r0 = await igq(id, secret, 'games', `fields ${F}; where id = ${par}; limit 1;`); if (r0[0]) pool.push(r0[0]); }
      const r1 = await igq(id, secret, 'games', `search "${n}"; fields ${F}; where platforms = (6); limit 10;`);
      pool.push(...r1);
      const best = pool.find(x => hasPC(x) && nrm(x.name) === n0 && (x.category === 0 || x.category === undefined)) || pool.find(x => hasPC(x) && nrm(x.name) === n0) || pool.find(x => hasPC(x) && (nrm(x.name).startsWith(n0) || n0.startsWith(nrm(x.name))));
      if (best && (best.summary || !g.summary)) g = best;
    } catch (e) { if (String(e.message) === 'auth') throw e; }
  }
  if (!g) return { none: true };
  const comps = (g.involved_companies || []);
  const co = (flag) => comps.filter(c => c[flag] && c.company).slice(0, 3).map(c => ({ n: c.company.name, s: links(c.company.websites) }));
  const txt = [g.summary, g.storyline].filter(Boolean).map(t => t.trim()).join('\n\n');
  const im = (x) => x && x[0] ? x[0].image_id : '';
  return { d: txt, u: g.url || '', dev: co('developer'), pub: co('publisher'), gl: links(g.websites), gen: [...(g.genres || []), ...(g.themes || [])].map(x => x.name).slice(0, 5), pcv: 1, rt: g.total_rating || 0, rel: g.first_release_date || 0, ig: { cover: g.cover ? g.cover.image_id : '', art: im(g.artworks), shot: im(g.screenshots) } };
}


/* ---------- versión de prueba (beta): solo se usa si fue armada sobre esta misma versión ---------- */
function betaPage() {
  try {
    const dir = path.join(app.getPath('userData'), 'beta'), src = path.join(dir, 'index.html');
    if (!fs.existsSync(src)) return null;
    let base = ''; try { base = fs.readFileSync(path.join(dir, 'base.txt'), 'utf8').trim(); } catch (e) {}
    if (base !== app.getVersion()) return null;
    let h = fs.readFileSync(src, 'utf8');
    const b = pathToFileURL(__dirname).href.replace(/\/?$/, '/');
    h = h.replace(/<head[^>]*>/i, (x) => x + '<base href="' + b + '">');
    const out = path.join(dir, '_run.html'); fs.writeFileSync(out, h); return out;
  } catch (e) { return null; }
}

/* ---------- ventana ---------- */
function createWindow() {
  win = new BrowserWindow({
    width: 1600, height: 940, minWidth: 1100, minHeight: 700, backgroundColor: '#07060f', show: false, autoHideMenuBar: true, frame: false, title: 'WINTEER',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, spellcheck: false, backgroundThrottling: false },
  });
  Menu.setApplicationMenu(null);
  const wst = () => send({ type: 'wst', max: win.isMaximized(), fs: win.isFullScreen() });
  ['maximize', 'unmaximize', 'enter-full-screen', 'leave-full-screen', 'restore'].forEach(e => win.on(e, wst));
  win.webContents.on('did-finish-load', wst);
  try { win.setIcon(path.join(__dirname, process.platform === 'win32' ? 'icon.ico' : 'icon.png')); } catch (e) {}
  win.loadFile(betaPage() || path.join(__dirname, 'index.html'));
  win.once('ready-to-show', () => { if (!(startHidden && cfg.bg && !win.__shown)) { win.maximize(); win.show(); } win.__shown = true; if (process.env.WINTEER_TEST) win.webContents.openDevTools({ mode: 'detach' }); });
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^(https?|steam|com\.epicgames\.launcher|ms-windows-store):/i.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('file:')) { e.preventDefault(); if (/^(https?|steam|com\.epicgames\.launcher|ms-windows-store):/i.test(url)) shell.openExternal(url); } });
  win.webContents.on('before-input-event', (e, i) => {
    if (i.type !== 'keyDown') return;
    if (i.key === 'F11') { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
    else if (i.key === 'F5' || (i.control && i.key.toLowerCase() === 'r')) { win.webContents.reload(); e.preventDefault(); }
    else if (i.control && i.shift && i.key.toLowerCase() === 'i') { win.webContents.toggleDevTools(); e.preventDefault(); }
  });
  win.on('close', (e) => { if (cfg.bg && !quitting) { e.preventDefault(); win.setFullScreen(false); hideWin(); } });
  win.on('closed', () => { win = null; });
}


/* ---------- actualizaciones automáticas (GitHub Releases) ---------- */
let autoUpdater = null, updState = { s: 'idle', v: '', p: 0, e: '' };
const updSend = (o) => { updState = Object.assign(updState, o); send(Object.assign({ type: 'upd' }, updState)); };
function updCheck() { try { if (autoUpdater) autoUpdater.checkForUpdates().catch(() => {}); } catch (e) {} }
function setupUpdater() {
  if (!app.isPackaged) return;
  try { autoUpdater = require('electron-updater').autoUpdater; } catch (e) { return; }
  autoUpdater.autoDownload = true; autoUpdater.autoInstallOnAppQuit = true; autoUpdater.logger = null;
  autoUpdater.on('checking-for-update', () => updSend({ s: 'checking', e: '' }));
  autoUpdater.on('update-available', (i) => updSend({ s: 'downloading', v: i.version, p: 0 }));
  autoUpdater.on('update-not-available', () => updSend({ s: 'none' }));
  autoUpdater.on('download-progress', (p) => updSend({ s: 'downloading', p: Math.round(p.percent || 0) }));
  autoUpdater.on('update-downloaded', (i) => updSend({ s: 'ready', v: i.version }));
  autoUpdater.on('error', (e) => updSend({ s: 'error', e: String((e && e.message) || e).slice(0, 140) }));
  setInterval(updCheck, 4 * 3600e3);
}
ipcMain.handle('updInfo', () => Object.assign({ ver: app.getVersion(), packaged: app.isPackaged }, updState));
ipcMain.handle('updCheck', () => { updCheck(); return true; });
ipcMain.handle('updInstall', () => { installNow(); });


/* ---------- arranque con actualización (estilo Discord) ---------- */
let splashWin = null, pendingInstall = false;
function splashHtml() {
  let logo = ''; try { logo = nativeImage.createFromPath(path.join(__dirname, 'icon.png')).resize({ width: 96, height: 96 }).toDataURL(); } catch (e) {}
  return `<html><head><meta charset="utf-8"><style>
*{box-sizing:border-box}html,body{margin:0;height:100%;overflow:hidden;background:transparent;font-family:'Segoe UI',system-ui,sans-serif;-webkit-user-select:none;-webkit-app-region:drag}
.c{position:absolute;inset:8px;border-radius:26px;background:radial-gradient(420px 260px at 20% -10%,rgba(139,92,246,.45),transparent 70%),radial-gradient(360px 240px at 100% 110%,rgba(56,189,248,.25),transparent 70%),#0a0814;border:1px solid rgba(255,255,255,.12);box-shadow:0 18px 50px rgba(0,0,0,.6);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:#fff;animation:in .5s cubic-bezier(.2,1,.3,1)}
@keyframes in{from{opacity:0;transform:scale(.96)}}
img{width:92px;height:92px;filter:drop-shadow(0 8px 26px rgba(139,92,246,.7));animation:fl 3s ease-in-out infinite alternate}@keyframes fl{to{transform:translateY(-5px)}}
h1{margin:6px 0 0;font-size:20px;letter-spacing:.42em;font-weight:700;padding-left:.42em}
p{margin:0;font-size:13px;color:#a9a3c4;height:18px}
.b{width:230px;height:5px;border-radius:9px;background:rgba(255,255,255,.1);overflow:hidden;margin-top:6px}
.b i{display:block;height:100%;width:30%;border-radius:9px;background:linear-gradient(90deg,#8b5cf6,#38bdf8);animation:ind 1.3s ease-in-out infinite}
.b.d i{animation:none;width:var(--w,0%);transition:width .3s}
@keyframes ind{0%{margin-left:-30%}100%{margin-left:100%}}
</style></head><body><div class="c"><img src="${logo}"><h1>WINTEER</h1><p id="t">Buscando actualizaciones…</p><div class="b" id="b"><i id="i"></i></div></div></body></html>`;
}
function splashSet(txt, pct) {
  if (!splashWin || splashWin.isDestroyed()) return;
  const js = `document.getElementById('t').textContent=${JSON.stringify(txt)};` + (pct == null ? '' : `var b=document.getElementById('b');b.className='b d';b.style.setProperty('--w','${pct}%');`);
  splashWin.webContents.executeJavaScript(js).catch(() => {});
}
function splashClose() { try { if (splashWin && !splashWin.isDestroyed()) splashWin.destroy(); } catch (e) {} splashWin = null; }
function installNow() { quitting = true; try { autoUpdater.quitAndInstall(true, true); } catch (e) { quitting = false; } }
function splashUpdate() {
  return new Promise((resolve) => {
    let done = false, gotUpdate = false;
    const finish = (restart) => { if (done) return; done = true; clearTimeout(t0); autoUpdater.removeListener('update-available', onAvail); autoUpdater.removeListener('update-not-available', onNone); autoUpdater.removeListener('download-progress', onProg); autoUpdater.removeListener('update-downloaded', onDown); autoUpdater.removeListener('error', onErr); if (!restart) setTimeout(splashClose, 250); resolve(restart); };
    const onAvail = () => { gotUpdate = true; clearTimeout(t0); splashSet('Descargando actualización…', 0); };
    const onNone = () => { splashSet('Todo al día', 100); setTimeout(() => finish(false), 700); };
    const onProg = (p) => splashSet('Descargando actualización · ' + Math.round(p.percent || 0) + '%', Math.round(p.percent || 0));
    const onDown = () => { splashSet('Instalando…', 100); setTimeout(() => { finish(true); installNow(); }, 900); };
    const onErr = () => finish(false);
    const t0 = setTimeout(() => { if (!gotUpdate) finish(false); }, 15000);
    try {
      splashWin = new BrowserWindow({ width: 440, height: 330, frame: false, transparent: true, resizable: false, show: false, skipTaskbar: false, hasShadow: false, alwaysOnTop: true, center: true, title: 'WINTEER', webPreferences: { sandbox: true } });
      splashWin.once('ready-to-show', () => { try { splashWin.show(); } catch (e) {} });
      splashWin.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(splashHtml()));
    } catch (e) { return finish(false); }
    autoUpdater.on('update-available', onAvail); autoUpdater.on('update-not-available', onNone); autoUpdater.on('download-progress', onProg); autoUpdater.on('update-downloaded', onDown); autoUpdater.on('error', onErr);
    setTimeout(() => { try { autoUpdater.checkForUpdates().catch(() => finish(false)); } catch (e) { finish(false); } }, 600);
  });
}
async function startApp() {
  if (!autoUpdater) { createWindow(); applyBg(); return; }
  if (startHidden && cfg.bg) {
    createWindow(); applyBg();
    autoUpdater.once('update-downloaded', () => { pendingInstall = true; });
    setTimeout(updCheck, 15000);
    return;
  }
  const restarting = await splashUpdate();
  if (restarting) return;
  createWindow(); applyBg();
}

app.whenReady().then(() => {
  setupUpdater();
  CACHE = path.join(app.getPath('userData'), 'imgcache'); loadIdx();
  protocol.handle('wimg', imgHandler);
  ipcMain.handle('launch', async (_e, o) => {
    const tracking = watch(o);
    try {
      if (o.uri) await shell.openExternal(o.uri);
      else if (o.shellApp) { const c = spawn('explorer.exe', [o.shellApp], { detached: true, stdio: 'ignore' }); c.unref(); }
      else if (o.exe) { const c = spawn(o.exe, [], { cwd: path.dirname(o.exe), detached: true, stdio: 'ignore' }); c.on('error', () => send({ type: 'never', id: o.id, err: 'No pude abrir el .exe' })); c.unref(); }
      else if (o.app) await shell.openExternal('steam://rungameid/' + o.app);
    } catch (e) { return { ok: false, err: String(e) }; }
    return { ok: true, tracking };
  });
  ipcMain.handle('exportFile', async (_e, o) => {
    try { const f = path.join(app.getPath('desktop'), String(o.name).replace(/[^\w.-]/g, '_')); fs.writeFileSync(f, o.json, 'utf8'); return { ok: true, file: f }; }
    catch (e) { return { ok: false, err: String(e) }; }
  });
  ipcMain.handle('httpImg', async (_e, u0) => {
    try {
      const u = new URL(u0);
      if (!/(^|\.)steamgriddb\.com$/.test(u.hostname)) return null;
      const r = await net.fetch(u0, { headers: { 'user-agent': UA } });
      if (!r.ok) return null;
      const buf = Buffer.from(await r.arrayBuffer());
      return { mime: r.headers.get('content-type') || 'image/png', b64: buf.toString('base64') };
    } catch (e) { return null; }
  });
  ipcMain.handle('http', async (_e, o) => {
    try {
      const u = new URL(o.url);
      if (!/(^|\.)(steamgriddb\.com|howlongtobeat\.com|translate\.googleapis\.com|firestore\.googleapis\.com|api\.steampowered\.com|store\.steampowered\.com|www\.reddit\.com|www\.eurogamer\.net|www\.pcgamer\.com|www\.rockpapershotgun\.com|www\.gamespot\.com)$/.test(u.hostname)) return { status: 0, text: '' };
      const r = await net.fetch(o.url, { method: o.method || 'GET', headers: { 'user-agent': UA, ...(o.headers || {}) }, body: o.body });
      return { status: r.status, text: await r.text() };
    } catch (e) { return { status: 0, text: '' }; }
  });
  ipcMain.handle('playniteHltb', async () => { try { return playniteHltb(); } catch (e) { return { found: false, list: [] }; } });
  ipcMain.handle('igdbMonth', async (_e, o) => { try {
    const from = Math.floor(o.from / 1000), to = Math.floor(o.to / 1000);
    const rows = await igq(o.id, o.secret, 'games', 'fields name,slug,url,first_release_date,hypes,platforms.abbreviation,artworks.image_id,screenshots.image_id,cover.image_id; where first_release_date >= ' + from + ' & first_release_date < ' + to + ' & hypes != null & parent_game = null & version_parent = null; sort hypes desc; limit 30;');
    return { items: (rows || []).map(g => ({ id: g.id, n: g.name, ts: g.first_release_date * 1000, hy: g.hypes || 0, u: g.url || ('https://www.igdb.com/games/' + g.slug), pl: ((g.platforms || []).map(p => p.abbreviation).filter(Boolean)).slice(0, 5).join(' · '), img: (g.artworks && g.artworks[0] && g.artworks[0].image_id) || (g.screenshots && g.screenshots[0] && g.screenshots[0].image_id) || '', cv: (g.cover && g.cover.image_id) || '' })) };
  } catch (e) { return { error: String(e.message || e) }; } });
  ipcMain.handle('igdbSagas', async (_e, o) => { try {
    const { id, secret } = o, out = { apps: {}, names: {} };
    const F = 'name,first_release_date,collection.id,collection.name,collections.id,collections.name';
    const pick = (g) => { const c = g.collection || (g.collections && g.collections[0]); const ts = g.first_release_date ? g.first_release_date * 1000 : 0; return c ? { gi: g.id, cid: c.id, cn: c.name, ts } : { gi: g.id, x: 1 }; };
    const nrm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const apps = o.apps || [];
    for (let i = 0; i < apps.length; i += 100) {
      const ch = apps.slice(i, i + 100).filter((x) => /^\d+$/.test(x)), list = ch.map((x) => '"' + x + '"').join(',');
      if (!ch.length) continue;
      let ex;
      try { ex = await igq(id, secret, 'external_games', `fields game,uid; where uid = (${list}) & external_game_source = 1; limit 500;`); }
      catch (e) { if (String(e.message) === 'auth') throw e; ex = await igq(id, secret, 'external_games', `fields game,uid; where uid = (${list}) & category = 1; limit 500;`); }
      const ids = [...new Set((ex || []).filter((x) => x.game).map((x) => x.game))];
      for (let j = 0; j < ids.length; j += 100) {
        const gs = await igq(id, secret, 'games', `fields ${F}; where id = (${ids.slice(j, j + 100).join(',')}); limit 100;`), by = {};
        (gs || []).forEach((g) => { by[g.id] = g; });
        (ex || []).forEach((x) => { if (by[x.game]) { const p = pick(by[x.game]); if (!out.apps[x.uid] || p.cid) out.apps[x.uid] = p; } });
      }
    }
    for (const it of (o.names || []).slice(0, 60)) {
      const n = String(it.n || '').replace(/[™®©]/g, '').replace(/"/g, '').trim(); if (!n) continue;
      try {
        const r = await igq(id, secret, 'games', `search "${n}"; fields ${F}; limit 6;`), n0 = nrm(n);
        const g = (r || []).find((x) => nrm(x.name) === n0) || (r || []).find((x) => nrm(x.name).startsWith(n0) || n0.startsWith(nrm(x.name)));
        out.names[it.k] = g ? pick(g) : { x: 1 };
      } catch (e) { if (String(e.message) === 'auth') throw e; }
    }
    return out;
  } catch (e) { return { error: String(e.message || e) }; } });
  ipcMain.handle('igdbSagaGames', async (_e, o) => { try {
    const out = {};
    for (const cid of (o.cids || []).slice(0, 12)) {
      if (!/^\d+$/.test(String(cid))) continue;
      const rows = await igq(o.id, o.secret, 'games', `fields name,first_release_date,cover.image_id,platforms; where collections = (${cid}) & parent_game = null & version_parent = null; sort first_release_date asc; limit 60;`);
      out[cid] = (rows || []).map((g) => ({ id: g.id, n: g.name, ts: g.first_release_date ? g.first_release_date * 1000 : 0, cv: (g.cover && g.cover.image_id) || '', pc: !(g.platforms && g.platforms.length) || g.platforms.some((p) => [6, 14, 3].includes(p)) }));
    }
    return { sagas: out };
  } catch (e) { return { error: String(e.message || e) }; } });
  ipcMain.handle('igdb', async (_e, o) => { try { return await igdb(o); } catch (e) { return { error: String(e.message || e) }; } });
  ipcMain.handle('hltb', async (_e, o) => { try { return await hltb(o); } catch (e) { return { error: String(e.message || e) }; } });
  ipcMain.handle('trailer', async (_e, appid) => {
    try {
      const r = await net.fetch('https://store.steampowered.com/api/appdetails?appids=' + encodeURIComponent(appid) + '&filters=movies,basic&l=spanish');
      const j = await r.json(), d = j && j[appid] && j[appid].data;
      const mv = d && d.movies && d.movies[0];
      const u = mv ? ((mv.mp4 && (mv.mp4.max || mv.mp4['480'])) || (mv.webm && (mv.webm.max || mv.webm['480'])) || '') : '';
      return { url: u || '', thumb: mv ? (mv.thumbnail || '') : '' };
    } catch (e) { return { url: '', err: String(e.message || e) }; }
  });
  ipcMain.handle('pickVideo', async () => {
    const r = await dialog.showOpenDialog(win, { title: 'Elegí el tráiler', properties: ['openFile'], filters: [{ name: 'Video', extensions: ['mp4', 'webm', 'mkv', 'mov'] }] });
    return r.canceled ? '' : pathToFileURL(r.filePaths[0]).href;
  });
  ipcMain.handle('pickExe', async () => {
    const r = await dialog.showOpenDialog(win, { title: 'Elegí el juego', properties: ['openFile'], filters: [{ name: 'Programas', extensions: ['exe'] }] });
    return r.canceled ? '' : r.filePaths[0];
  });
  ipcMain.handle('cacheInfo', () => { let n = 0, b = 0; try { for (const f of fs.readdirSync(CACHE)) { n++; b += fs.statSync(path.join(CACHE, f)).size; } } catch (e) {} return { n, mb: Math.round(b / 1048576), dir: CACHE }; });
  ipcMain.handle('clearCache', () => { try { for (const f of fs.readdirSync(CACHE)) fs.unlinkSync(path.join(CACHE, f)); } catch (e) {} loadIdx(); bad.clear(); return true; });
  ipcMain.handle('scanEpic', async () => { try { return scanEpic(); } catch (e) { return { found: false, list: [] }; } });
  ipcMain.handle('epicImport', async (_e, o) => { try { return await epicImport(o); } catch (e) { return { ok: false, err: 'Error inesperado con Epic', diag: String(e && e.message || e) }; } });
  ipcMain.handle('xboxImport', async () => { try { return await xboxImport(); } catch (e) { return { ok: false, err: 'Error inesperado con Xbox', diag: String(e && e.message || e) }; } });
  ipcMain.handle('scanXbox', async () => { try { return await scanXbox(); } catch (e) { return { found: false, list: [] }; } });
  ipcMain.handle('pickDir', async () => { const r = await dialog.showOpenDialog(win, { title: 'Elegí la carpeta para las copias', properties: ['openDirectory', 'createDirectory'] }); return r.canceled ? '' : r.filePaths[0]; });
  ipcMain.handle('writeBackup', async (_e, o) => { try { return { ok: true, file: writeBackup(o) }; } catch (e) { return { ok: false, err: String(e.message || e) }; } });
  ipcMain.handle('fullscreen', (_e, on) => { if (win) win.setFullScreen(!!on); return win ? win.isFullScreen() : false; });
  ipcMain.handle('installed', (_e, d) => { try { return installedApps(d); } catch (e) { return { ok: false, apps: [] }; } });
  ipcMain.handle('shots', (_e, id) => listShots(id));
  ipcMain.handle('shotDel', (_e, id, n) => { try { const dir = path.join(SHOTS, String(id).replace(/[^\w.-]/g, '_')); if (!/^[\d-T]+\.jpg$/.test(n)) return false; fs.unlinkSync(path.join(dir, n)); try { fs.unlinkSync(path.join(dir, n.replace(/\.jpg$/, '.t.jpg'))); } catch (e) {} return true; } catch (e) { return false; } });
  ipcMain.handle('shotFolder', (_e, id) => { const dir = id ? path.join(SHOTS, String(id).replace(/[^\w.-]/g, '_')) : SHOTS; try { fs.mkdirSync(dir, { recursive: true }); } catch (e) {} shell.openPath(dir); return dir; });
  ipcMain.handle('shotCfg', (_e, o) => { if (o && typeof o.shots === 'boolean') cfg.shots = o.shots; if (o && typeof o.key === 'string' && /^[\w+]+$/.test(o.key)) cfg.shotKey = o.key; saveCfg(); syncShot(); return { shots: cfg.shots, shotKey: cfg.shotKey }; });
  ipcMain.handle('friendToast', (_e, o) => { friendToast(o); return true; });
  ipcMain.handle('winCtl', (_e, a) => { if (!win) return; if (a === 'min') win.minimize(); else if (a === 'max') { if (win.isMaximized()) win.unmaximize(); else win.maximize(); } else if (a === 'close') win.close(); });
  ipcMain.handle('quit', () => { quitting = true; app.quit(); });
  ipcMain.handle('cfgGet', () => Object.assign({ win: process.platform === 'win32' }, cfg));
  ipcMain.handle('cfgSet', (_e, o) => { if (o && ['bg', 'auto', 'pad'].includes(o.k)) { cfg[o.k] = !!o.v; if (o.k === 'bg' && !cfg.bg) cfg.auto = false; saveCfg(); applyBg(); } return cfg; });
  ipcMain.handle('toBg', () => { if (!win) return; fromBg = false; bgForGame = true; win.setFullScreen(false); if (cfg.bg) hideWin(); else win.minimize(); });
  ipcMain.handle('bpClosed', () => { if (fromBg && cfg.bg && win) { fromBg = false; win.setFullScreen(false); hideWin(); } fromBg = false; });
  startApp();
});
app.on('second-instance', () => { showWin(); });
app.on('before-quit', () => { quitting = true; stopPad(); try { globalShortcut.unregisterAll(); } catch (e) {} });
app.on('window-all-closed', () => { if (!cfg.bg || quitting) app.quit(); });
