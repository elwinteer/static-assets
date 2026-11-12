const os = require('os');
const { app, BrowserWindow, ipcMain, shell, protocol, net, dialog, Menu, nativeImage, Tray, globalShortcut, desktopCapturer, screen, session } = require('electron');
const path = require('path'), fs = require('fs'), crypto = require('crypto');
app.commandLine.appendSwitch('autoplay-policy','no-user-gesture-required');
app.commandLine.appendSwitch('disable-features','CalculateNativeWinOcclusion');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows','true');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.setAppUserModelId('com.winteer.launcher');
const { spawn, execFile } = require('child_process');
const { pathToFileURL, fileURLToPath } = require('url');

protocol.registerSchemesAsPrivileged([{ scheme: 'wimg', privileges: { standard: true, secure: true, supportFetchAPI: true, bypassCSP: true, stream: true } }]);
if (!app.requestSingleInstanceLock()) { app.quit(); process.exit(0); }

let win = null, tray = null, quitting = false, fromBg = false, padProc = null;
const CFGF = path.join(app.getPath('userData'), 'winteer-cfg.json');
let cfg = { bg: false, auto: false, pad: true, shots: true, shotKey: 'F12', clipKey: 'F9', ovKey: 'Shift+Tab' };
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
    if (ovReg && (!want || ovReg !== (cfg.ovKey || 'Shift+Tab'))) { globalShortcut.unregister(ovReg); ovReg = ''; if (!want) ovClose(); }
    if (want && !ovReg) { if (globalShortcut.register(cfg.ovKey || 'Shift+Tab', ovToggle)) ovReg = cfg.ovKey || 'Shift+Tab'; }
    if (clipReg && (!want || clipReg !== cfg.clipKey)) { globalShortcut.unregister(clipReg); clipReg = ''; }
    if (want && !clipReg) { if (globalShortcut.register(cfg.clipKey || 'F9', takeClip)) clipReg = cfg.clipKey || 'F9'; }
  } catch (e) {}
}
let clipReg = '', clipBusy = false;
let recWin = null, recTimer = null;
/* aviso mínimo mientras graba un clip: solo un puntito rojo en la esquina, sin texto, hasta que termina */
function recIcon(on) {
  try {
    clearTimeout(recTimer); recTimer = null;
    if (recWin && !recWin.isDestroyed()) { recWin.destroy(); } recWin = null;
    if (!on) return;
    const d = screen.getPrimaryDisplay(), s = 30;
    recWin = new BrowserWindow({ width: s, height: s, x: d.workArea.x + d.workArea.width - s - 10, y: d.workArea.y + 8, frame: false, transparent: true, resizable: false, movable: false, skipTaskbar: true, focusable: false, alwaysOnTop: true, show: false, hasShadow: false, webPreferences: { sandbox: true } });
    recWin.setAlwaysOnTop(true, 'screen-saver'); try { recWin.setContentProtection(true); } catch (e) {} recWin.setIgnoreMouseEvents(true);
    const html = '<html><body style="margin:0;background:transparent;overflow:hidden"><style>@keyframes p{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(.82)}}.d{position:absolute;left:8px;top:8px;width:14px;height:14px;border-radius:50%;background:#ff3b4e;box-shadow:0 0 0 2px rgba(0,0,0,.45),0 0 10px #ff3b4e;animation:p 1s ease-in-out infinite}</style><div class="d"></div></body></html>';
    recWin.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
    recWin.once('ready-to-show', () => { try { recWin.showInactive(); } catch (e) {} });
    recTimer = setTimeout(() => recIcon(false), 20000);
  } catch (e) {}
}
function takeClip() {
  if (clipBusy) return;
  const cur = curNonSteam(); if (!cur) return;
  clipBusy = true; setTimeout(() => { clipBusy = false; }, 25000);
  recIcon(true);
  send({ type: 'clipreq', id: cur.id });
}
let achWin = null;

/* ---------- overlay en juego (Shift+Tab) ---------- */
let ovWin = null, ovReg = '', ovPend = null, ovPerfT = null, ovTp = null, ovGpu = 0, ovCpuPrev = null, ovTemps = { cpu: null, gpu: null, ok: false }, ovTempT = 0;
const OVP = () => path.join(app.getPath('userData'), 'ov');
const OVD = { ach: true, shots: true, chat: true, perf: true };
const ovPanes = () => Object.assign({}, OVD, cfg.ovPanes || {});
function ovStopPerf() { try { clearInterval(ovPerfT); } catch (e) {} ovPerfT = null; try { if (ovTp) ovTp.kill(); } catch (e) {} ovTp = null; ovGpu = 0; }
function ovClose() { ovStopPerf(); try { if (ovWin && !ovWin.isDestroyed()) ovWin.destroy(); } catch (e) {} ovWin = null; send({ type: 'ovfr', op: 'off' }); }
function ovToggle() {
  if (ovWin && !ovWin.isDestroyed()) { ovClose(); return; }
  const cur = curNonSteam(); if (!cur) return;
  if (ovPend) return;
  ovPend = setTimeout(() => { ovPend = null; ovOpen({ id: cur.id, name: String(cur.id), items: [], t: cur.t.started }); }, 900);
  send({ type: 'ovreq', id: cur.id });
}
function ovTempFetch() {
  try {
    const http = require('http');
    const rq = http.get({ host: '127.0.0.1', port: 8085, path: '/data.json', timeout: 900 }, (r) => {
      let b = ''; r.on('data', (c) => { b += c; if (b.length > 4e6) rq.destroy(); });
      r.on('end', () => {
        try {
          const j = JSON.parse(b), found = { cpu: [], gpu: [] };
          const walk = (n, ctx) => {
            const img = String(n.ImageURL || '').toLowerCase();
            let c = ctx; if (/cpu/.test(img)) c = 'cpu'; else if (/nvidia|ati|amd|gpu|intel/.test(img) && !/cpu/.test(img) && !ctx) c = 'gpu'; else if (/nvidia|ati|gpu/.test(img)) c = 'gpu';
            const v = String(n.Value || '');
            if (c && /°C/.test(v)) { const t = parseFloat(v.replace(',', '.')); if (!isNaN(t)) found[c].push({ n: String(n.Text || ''), t }); }
            (n.Children || []).forEach((k) => walk(k, c));
          };
          walk(j, '');
          const pick = (arr, re) => { const m = arr.find((x) => re.test(x.n)) || arr[0]; return m ? Math.round(m.t) : null; };
          ovTemps = { cpu: pick(found.cpu, /package|tctl|tdie|cpu/i), gpu: pick(found.gpu, /core|gpu/i), ok: true };
        } catch (e) { ovTemps.ok = false; }
      });
    });
    rq.on('error', () => { ovTemps = { cpu: null, gpu: null, ok: false }; }); rq.on('timeout', () => rq.destroy());
  } catch (e) {}
}
function ovStartPerf() {
  ovStopPerf();
  ovCpuPrev = os.cpus().map((c) => Object.assign({}, c.times));
  try {
    if (process.platform === 'win32') {
      const { spawn } = require('child_process');
      ovTp = spawn('typeperf', ['\\GPU Engine(*)\\Utilization Percentage', '-si', '1'], { windowsHide: true });
      let cols = null, buf = '';
      ovTp.stdout.on('data', (d) => {
        buf += d.toString(); let i;
        while ((i = buf.indexOf('\n')) >= 0) {
          const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
          if (!line.startsWith('"')) continue;
          const f = line.replace(/^"|"$/g, '').split('","');
          if (!cols) { cols = f; continue; }
          const g = {};
          for (let k = 1; k < f.length && k < cols.length; k++) {
            const m = /luid_(0x[0-9a-f]+_0x[0-9a-f]+)_phys_(\d+)_eng_\d+_engtype_(\w+)/i.exec(cols[k]); if (!m) continue;
            const key = m[1] + m[2] + m[3]; g[key] = (g[key] || 0) + (parseFloat(f[k]) || 0);
          }
          const v = Object.values(g); ovGpu = v.length ? Math.min(100, Math.round(Math.max.apply(null, v))) : 0;
        }
      });
      ovTp.on('error', () => { ovTp = null; }); ovTp.on('exit', () => { ovTp = null; });
    }
  } catch (e) {}
  const tick = () => {
    try {
      if (!ovWin || ovWin.isDestroyed()) return ovStopPerf();
      const now = os.cpus().map((c) => Object.assign({}, c.times)); let idle = 0, tot = 0;
      now.forEach((c, i) => { const p = ovCpuPrev[i] || c; let t = 0; for (const k in c) t += c[k] - (p[k] || 0); idle += c.idle - (p.idle || 0); tot += t; });
      ovCpuPrev = now;
      const mem = process.getSystemMemoryInfo ? process.getSystemMemoryInfo() : null, total = os.totalmem(), used = mem ? (mem.total - mem.free) * 1024 : total - os.freemem();
      if (Date.now() - ovTempT > 2500) { ovTempT = Date.now(); ovTempFetch(); }
      ovWin.webContents.send('ov', 'perf', { cpu: tot ? Math.round((1 - idle / tot) * 100) : 0, gpu: ovGpu, ram: used / 1073741824, ramT: total / 1073741824, tc: ovTemps.cpu, tg: ovTemps.gpu, th: ovTemps.ok });
    } catch (e) {}
  };
  ovPerfT = setInterval(tick, 1000); setTimeout(tick, 300);
}
function ovOpen(data) {
  try {
    if (ovPend) { clearTimeout(ovPend); ovPend = null; }
    if (ovWin && !ovWin.isDestroyed()) { ovStopPerf(); try { ovWin.destroy(); } catch (e) {} ovWin = null; }
    const dir = OVP(); fs.mkdirSync(dir, { recursive: true });
    const cur = curNonSteam(); if (!cur) return;
    const shots = listShots(cur.id).slice(0, 9).map(x => ({ n: x.n, clip: !!x.clip, thumb: x.thumb }));
    fs.writeFileSync(path.join(dir, 'pre.js'), `const{ipcRenderer:r,contextBridge:c}=require('electron');c.exposeInMainWorld('ov',{act:a=>r.invoke('ovAct',a),open:n=>r.invoke('ovOpen',n),on:f=>r.on('ov',(e,t,d)=>{try{f(t,d)}catch(x){}})});`);
    fs.writeFileSync(path.join(dir, 'ov.html'), ovHTML(data, shots, cur.t.started, ovPanes(), { k1: cfg.shotKey || 'F12', k2: cfg.clipKey || 'F9' }));
    const d = screen.getPrimaryDisplay(), b = d.bounds;
    ovWin = new BrowserWindow({ x: b.x, y: b.y, width: b.width, height: b.height, frame: false, transparent: true, resizable: false, movable: false, skipTaskbar: true, alwaysOnTop: true, show: false, hasShadow: false, fullscreenable: false, webPreferences: { sandbox: true, contextIsolation: true, preload: path.join(dir, 'pre.js') } });
    ovWin.setAlwaysOnTop(true, 'screen-saver');
    ovWin.loadFile(path.join(dir, 'ov.html'));
    ovWin.once('ready-to-show', () => { try { ovWin.show(); ovWin.focus(); } catch (e) {} });
    ovWin.on('closed', () => { ovWin = null; });
    ovStartPerf();
  } catch (e) {}
}
function ovHTML(o, shots, started, P, K) {
  const th = o.th || {};
  const SAFE = (s) => String(s || '').replace(/[^#\w\s,.()%-]/g, '').slice(0, 60);
  const T = { a: SAFE(th.a) || '#f2f2f5', a2: SAFE(th.a2) || '#ffffff', rgb: SAFE(th.rgb) || '242,242,245', on: SAFE(th.on) || '#0c0c0e' };
  const data = { name: o.name, items: Array.isArray(o.items) ? o.items.slice(0, 40) : [], shots, started: +started || 0, P, K };
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
:root{--a:${T.a};--a2:${T.a2};--rgb:${T.rgb};--on:${T.on};--mut:#a9a9b3;--line:rgba(255,255,255,.1)}
*{box-sizing:border-box}html,body{margin:0;height:100%;overflow:hidden;background:transparent;font-family:'Segoe UI Variable','Segoe UI',system-ui,sans-serif;color:#f4f4f7;user-select:none}
@keyframes bi{from{opacity:0}to{opacity:1}}@keyframes pi{from{opacity:0;transform:translateX(-34px) scale(.98)}to{opacity:1;transform:none}}@keyframes pr{from{opacity:0;transform:translateX(34px) scale(.98)}to{opacity:1;transform:none}}@keyframes pt{from{opacity:0;transform:translateY(-18px)}to{opacity:1;transform:none}}@keyframes up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.bd{position:fixed;inset:0;background:radial-gradient(120% 90% at 20% 50%,rgba(6,6,8,.82),rgba(6,6,8,.55) 55%,rgba(6,6,8,.4));animation:bi .25s both}
.gl{background:linear-gradient(160deg,rgba(34,34,38,.9),rgba(14,14,17,.94));border:1px solid rgba(255,255,255,.14);box-shadow:0 30px 90px rgba(0,0,0,.65),inset 0 1.5px 0 rgba(255,255,255,.22),inset 0 -1px 0 rgba(255,255,255,.05);border-radius:30px;position:relative;overflow:hidden}
.gl:before{content:"";position:absolute;inset:0;background:radial-gradient(70% 40% at 15% -5%,rgba(255,255,255,.14),transparent 70%);pointer-events:none}
#L{position:fixed;left:26px;top:26px;bottom:26px;width:470px;display:flex;flex-direction:column;animation:pi .38s cubic-bezier(.2,.9,.25,1.05) both}
.h{padding:24px 26px 16px;display:flex;gap:14px;align-items:center;position:relative}
.lg{width:46px;height:46px;border-radius:15px;flex:none;display:grid;place-items:center;background:linear-gradient(145deg,rgba(255,255,255,.2),rgba(255,255,255,.05));box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 6px 18px rgba(0,0,0,.4);color:#fff}
.ht{flex:1;min-width:0}.k{font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--mut)}.t{font-size:23px;font-weight:700;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-.01em}.m{font-size:12.5px;color:var(--mut);margin-top:3px}
.ib{width:38px;height:38px;border-radius:50%;border:0;display:grid;place-items:center;color:#fff;background:rgba(255,255,255,.09);cursor:pointer;box-shadow:inset 0 1px 0 rgba(255,255,255,.18);transition:transform .2s,background .2s}.ib:hover{background:rgba(255,255,255,.18);transform:rotate(30deg)}
.sc{flex:1;overflow-y:auto;padding:0 26px 10px;position:relative}.sc::-webkit-scrollbar,.ms::-webkit-scrollbar,.fl::-webkit-scrollbar{width:6px}.sc::-webkit-scrollbar-thumb,.ms::-webkit-scrollbar-thumb,.fl::-webkit-scrollbar-thumb{background:rgba(255,255,255,.2);border-radius:9px}
.sec{display:flex;justify-content:space-between;align-items:center;margin:14px 0 10px;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--mut)}.sec span{font-size:12px;letter-spacing:0;color:#fff;background:rgba(255,255,255,.1);padding:2px 11px;border-radius:12px}
.pb{height:5px;border-radius:9px;background:rgba(255,255,255,.1);overflow:hidden;margin-bottom:12px}.pb i{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,var(--a),var(--a2));box-shadow:0 0 12px rgba(var(--rgb),.5)}
.a{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:17px;background:rgba(255,255,255,.045);margin-bottom:8px;opacity:.62;animation:up .4s both;border:1px solid transparent}
.a.on{opacity:1;background:linear-gradient(135deg,color-mix(in srgb,var(--c) 18%,transparent),rgba(255,255,255,.03));border-color:color-mix(in srgb,var(--c) 42%,transparent)}
.ai{width:38px;height:38px;border-radius:50%;flex:none;display:grid;place-items:center;background:rgba(255,255,255,.08);color:#8d8d97}.a.on .ai{background:radial-gradient(circle at 30% 25%,color-mix(in srgb,var(--c) 75%,#fff),var(--c));color:#fff;box-shadow:0 0 14px color-mix(in srgb,var(--c) 55%,transparent)}
.ab{flex:1;min-width:0}.ab b{display:block;font-size:13.5px}.ab span{display:block;font-size:11.5px;color:var(--mut);margin-top:2px}.ap{height:4px;border-radius:9px;background:rgba(255,255,255,.1);margin-top:6px;overflow:hidden}.ap i{display:block;height:100%;background:var(--c);border-radius:9px}
.a em{font-style:normal;font-size:10px;text-align:right;color:var(--c);letter-spacing:.08em;text-transform:uppercase;line-height:1.5}.a em small{display:block;color:#8d8d97;letter-spacing:0;text-transform:none;font-size:10.5px}
.g{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.s{position:relative;aspect-ratio:16/9;border-radius:13px;overflow:hidden;background:#000;cursor:pointer;transition:transform .2s,box-shadow .2s;box-shadow:0 0 0 1px rgba(255,255,255,.14)}.s:hover{transform:scale(1.05);box-shadow:0 8px 22px rgba(0,0,0,.6),0 0 0 2px #fff}.s img{width:100%;height:100%;object-fit:cover;display:block}
.pl{position:absolute;inset:0;margin:auto;width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.55);border:2px solid #fff}.pl:before{content:"";position:absolute;left:12px;top:8px;border-left:10px solid #fff;border-top:6px solid transparent;border-bottom:6px solid transparent}
.empty{grid-column:1/-1;font-size:12.5px;color:var(--mut);padding:10px 4px}
.f{padding:14px 26px 22px;display:flex;gap:10px;position:relative;border-top:1px solid var(--line);background:rgba(0,0,0,.2)}
.bt{flex:1;border:0;border-radius:17px;padding:12px 8px;font:600 13px 'Segoe UI Variable','Segoe UI',system-ui,sans-serif;color:#fff;cursor:pointer;background:rgba(255,255,255,.09);box-shadow:inset 0 1px 0 rgba(255,255,255,.16);transition:transform .15s,background .2s;display:flex;flex-direction:column;align-items:center;gap:3px}.bt:hover{transform:translateY(-2px);background:rgba(255,255,255,.17)}.bt small{font-weight:500;font-size:10.5px;opacity:.7}
.bt.pr{background:linear-gradient(180deg,var(--a2),var(--a));color:var(--on);box-shadow:0 10px 26px rgba(var(--rgb),.25),inset 0 1px 0 rgba(255,255,255,.7)}
#C{position:fixed;right:26px;top:116px;bottom:26px;width:400px;display:flex;flex-direction:column;animation:pr .38s .05s cubic-bezier(.2,.9,.25,1.05) both}
.ch{padding:18px 20px 12px;display:flex;align-items:center;gap:10px;font-weight:700;font-size:15px;position:relative}.ch small{color:var(--mut);font-weight:500;font-size:12px;margin-left:auto}
.fl{display:flex;gap:10px;padding:2px 20px 12px;overflow-x:auto;position:relative}.fl::-webkit-scrollbar{height:0}
.fr{flex:none;width:58px;text-align:center;cursor:pointer;opacity:.7;transition:.2s}.fr:hover,.fr.on{opacity:1}.fr .av{width:46px;height:46px;border-radius:50%;margin:0 auto;display:grid;place-items:center;font-weight:700;font-size:17px;background:linear-gradient(145deg,rgba(255,255,255,.22),rgba(255,255,255,.06));position:relative;box-shadow:inset 0 1px 0 rgba(255,255,255,.3)}.fr.on .av{box-shadow:0 0 0 2px #fff,0 0 16px rgba(var(--rgb),.5)}
.fr .av i{position:absolute;right:0;bottom:0;width:12px;height:12px;border-radius:50%;background:#5b5b66;border:2px solid #141417}.fr .av i.o{background:#3ddc84}.fr .av b{position:absolute;right:-4px;top:-4px;min-width:18px;height:18px;border-radius:9px;background:#ff5d6c;color:#fff;font-size:10.5px;display:grid;place-items:center;padding:0 4px}
.fr span{display:block;font-size:10.5px;margin-top:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#d8d8de}
.ms{flex:1;overflow-y:auto;padding:6px 20px;display:flex;flex-direction:column;gap:6px;position:relative;border-top:1px solid var(--line)}
.mg{max-width:80%;padding:8px 13px;border-radius:17px;font-size:13.5px;line-height:1.35;word-break:break-word;animation:up .25s both;user-select:text}.mg.me{align-self:flex-end;background:linear-gradient(180deg,var(--a2),var(--a));color:var(--on);border-bottom-right-radius:6px}.mg.th{align-self:flex-start;background:rgba(255,255,255,.1);border-bottom-left-radius:6px}
.cf{display:flex;gap:8px;padding:12px 16px 18px;position:relative;border-top:1px solid var(--line);background:rgba(0,0,0,.2)}
.cf input{flex:1;border:0;outline:0;border-radius:16px;padding:11px 15px;background:rgba(255,255,255,.09);color:#fff;font:13.5px 'Segoe UI Variable','Segoe UI',system-ui,sans-serif;box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);user-select:text}.cf input:focus{box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.55)}
.cf button{border:0;border-radius:16px;width:46px;cursor:pointer;background:linear-gradient(180deg,var(--a2),var(--a));color:var(--on);display:grid;place-items:center;font-weight:700}
#P{position:fixed;left:50%;top:22px;transform:translateX(-50%);display:flex;gap:10px;padding:8px;border-radius:22px;animation:pt .35s .1s both;z-index:3}
.pp{min-width:150px;padding:8px 14px;border-radius:15px;background:rgba(255,255,255,.06)}.pp .pn{font-size:10px;letter-spacing:.18em;color:var(--mut);display:flex;justify-content:space-between}.pp .pv{font-size:19px;font-weight:700;margin-top:2px;display:flex;justify-content:space-between;align-items:baseline}.pp .pv small{font-size:12px;font-weight:600;color:var(--mut)}
.pp .bar{height:4px;border-radius:9px;background:rgba(255,255,255,.1);margin-top:6px;overflow:hidden}.pp .bar i{display:block;height:100%;width:0;border-radius:9px;background:linear-gradient(90deg,var(--a),var(--a2));transition:width .6s,background .3s}
#S{position:fixed;left:288px;top:80px;width:300px;padding:16px;border-radius:22px;display:none;z-index:5;animation:up .22s both}#S.on{display:block}
#S h4{margin:0 0 10px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--mut)}.so{display:flex;align-items:center;justify-content:space-between;padding:9px 4px;font-size:13.5px;cursor:pointer}
.sw{width:40px;height:23px;border-radius:12px;background:rgba(255,255,255,.14);position:relative;transition:.25s;flex:none}.sw:after{content:"";position:absolute;left:3px;top:3px;width:17px;height:17px;border-radius:50%;background:#fff;transition:.25s}.so.on .sw{background:linear-gradient(90deg,var(--a),var(--a2))}.so.on .sw:after{left:20px;background:var(--on)}
#S p{margin:10px 0 0;font-size:11px;color:var(--mut);line-height:1.45}
.hint{position:fixed;right:26px;bottom:6px;font-size:11.5px;color:#c9c9d2;display:none}kbd{background:rgba(255,255,255,.14);border-radius:6px;padding:1px 7px;font:600 11px 'Segoe UI';margin:0 2px}
.hid{display:none!important}
</style></head><body><div class="bd" onclick="ov.act({a:'close'})"></div>
<div id="P" class="gl"></div>
<div id="L" class="gl"><div class="h"><div class="lg"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M12 2v20M3.3 7l17.4 10M20.7 7 3.3 17M9 3.8l3 2.4 3-2.4M9 20.2l3-2.4 3 2.4"/></svg></div><div class="ht"><div class="k">WINTEER · En juego</div><div class="t" id="nm"></div><div class="m" id="tm"></div></div><button class="ib" id="gear" title="Opciones del overlay"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></button></div>
<div class="sc" id="sc"><div id="sa"></div><div id="ss"></div></div>
<div class="f"><button class="bt pr" onclick="ov.act({a:'shot'})">Capturar<small id="k1"></small></button><button class="bt pr" onclick="ov.act({a:'clip'})">Clip 10 s<small id="k2"></small></button><button class="bt" onclick="ov.act({a:'close'})">Cerrar<small>Esc</small></button></div></div>
<div id="S" class="gl"><h4>Qué mostrar</h4><div id="so"></div><p id="sn"></p></div>
<div id="C" class="gl"><div class="ch">Amigos<small id="cn"></small></div><div class="fl" id="fl"></div><div class="ms" id="ms"><div class="empty" style="padding:14px 0">Elegí un amigo para chatear sin salir del juego.</div></div><div class="cf"><input id="ci" maxlength="500" placeholder="Escribí un mensaje…" autocomplete="off"><button id="cs" title="Enviar"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg></button></div></div>
<script>
var D=${json},cur='',FRS=[],MS=[];
function E(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var RC={c:'#9aa0b8',r:'#60a5fa',e:'#c084fc',l:'#fbbf24'},RN={c:'Común',r:'Raro',e:'Épico',l:'Legendario'};
var IC='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">';
var LOCK=IC+'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',CUP=IC+'<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 20h8"/></svg>';
document.getElementById('nm').textContent=D.name;document.getElementById('k1').textContent=D.K.k1;document.getElementById('k2').textContent=D.K.k2;
var items=D.items,n=items.filter(function(x){return x.on}).length;
document.getElementById('sa').innerHTML='<div class="sec">Logros del juego<span>'+n+'/'+items.length+'</span></div><div class="pb"><i style="width:'+(items.length?n/items.length*100:0)+'%"></i></div>'+(items.length?items.map(function(x,i){return '<div class="a '+(x.on?'on':'')+'" style="--c:'+(RC[x.r]||RC.c)+';animation-delay:'+(i*35)+'ms"><div class="ai">'+(x.on?CUP:LOCK)+'</div><div class="ab"><b>'+E(x.n)+'</b><span>'+E(x.d)+'</span>'+(x.on?'':'<div class="ap"><i style="width:'+Math.max(0,Math.min(100,+x.p||0))+'%"></i></div>')+'</div><em>'+(RN[x.r]||'')+'<small>'+(+x.x?(+x.x)+' XP':'')+'</small></em></div>'}).join(''):'<div class="empty">Abrí este juego desde WINTEER para ver sus logros acá.</div>');
document.getElementById('ss').innerHTML='<div class="sec" style="margin-top:20px">Capturas y clips</div><div class="g">'+(D.shots.length?D.shots.map(function(x){return '<div class="s" onclick="ov.open(\\''+E(x.n)+'\\')"><img src="'+E(x.thumb)+'">'+(x.clip?'<i class="pl"></i>':'')+'</div>'}).join(''):'<div class="empty">Todavía no hay capturas ni clips de este juego.</div>')+'</div><div style="height:8px"></div>';
function tk(){var m=Math.max(0,Math.floor((Date.now()-D.started)/60000));document.getElementById('tm').textContent=D.started?('Jugando hace '+(m>=60?Math.floor(m/60)+' h '+(m%60)+' min':m+' min')):''}tk();setInterval(tk,15000);
var OPT=[['ach','Logros'],['shots','Capturas y clips'],['chat','Chat con amigos'],['perf','Rendimiento (CPU, GPU, RAM)']];
function applyP(){var P=D.P;document.getElementById('sa').classList.toggle('hid',!P.ach);document.getElementById('ss').classList.toggle('hid',!P.shots);document.getElementById('C').classList.toggle('hid',!P.chat);document.getElementById('P').classList.toggle('hid',!P.perf);document.getElementById('sc').classList.toggle('hid',!P.ach&&!P.shots);
 document.getElementById('so').innerHTML=OPT.map(function(o){return '<div class="so '+(P[o[0]]?'on':'')+'" data-k="'+o[0]+'"><span>'+o[1]+'</span><i class="sw"></i></div>'}).join('');
 Array.prototype.forEach.call(document.querySelectorAll('.so'),function(e){e.onclick=function(){var k=e.dataset.k;D.P[k]=!D.P[k];ov.act({a:'set',k:k,v:D.P[k]});applyP()}})}
document.getElementById('sn').textContent='Las temperaturas se muestran si tenés LibreHardwareMonitor abierto con el servidor web activado. El FPS del juego no se puede medir desde WINTEER.';
applyP();
document.getElementById('gear').onclick=function(ev){ev.stopPropagation();document.getElementById('S').classList.toggle('on')};
document.getElementById('L').onclick=function(ev){if(ev.target.closest&&!ev.target.closest('#S')&&!ev.target.closest('#gear'))document.getElementById('S').classList.remove('on')};
function pill(nm,v,sub,extra){return '<div class="pp"><div class="pn"><span>'+nm+'</span></div><div class="pv"><span>'+v+'</span><small>'+sub+'</small></div><div class="bar"><i style="width:'+Math.max(0,Math.min(100,extra))+'%"></i></div></div>'}
function tc(t,h){return t!=null?t+' °C':'— °C'}
function perf(d){document.getElementById('P').innerHTML=pill('CPU',d.cpu+'%',tc(d.tc),d.cpu)+pill('GPU',d.gpu+'%',tc(d.tg),d.gpu)+pill('RAM',d.ram.toFixed(1)+' GB','de '+Math.round(d.ramT)+' GB',d.ram/d.ramT*100)}
function drawF(){var h='';FRS.forEach(function(f){h+='<div class="fr '+(f.c===cur?'on':'')+'" data-c="'+E(f.c)+'"><div class="av">'+E((f.n||'?').charAt(0).toUpperCase())+'<i class="'+(f.o?'o':'')+'"></i>'+(f.u?'<b>'+f.u+'</b>':'')+'</div><span>'+E(f.n)+'</span></div>'});document.getElementById('fl').innerHTML=h||'<div class="empty">Todavía no agregaste amigos en WINTEER.</div>';
 Array.prototype.forEach.call(document.querySelectorAll('.fr'),function(e){e.onclick=function(){cur=e.dataset.c;MS=[];drawF();drawM(true);ov.act({a:'sel',c:cur});document.getElementById('ci').focus()}});var f=FRS.filter(function(x){return x.o}).length;document.getElementById('cn').textContent=FRS.length?f+' en línea':''}
var lastSig='';function drawM(force){var el=document.getElementById('ms'),sig=MS.map(function(m){return m.t+(m.x||'')}).join('|');if(!force&&sig===lastSig)return;lastSig=sig;var nb=el.scrollTop+el.clientHeight>=el.scrollHeight-40;el.innerHTML=MS.length?MS.map(function(m){return '<div class="mg '+(m.me?'me':'th')+'">'+E(m.x)+'</div>'}).join(''):(cur?'<div class="empty" style="padding:14px 0">No hay mensajes todavía. ¡Saludalo!</div>':'<div class="empty" style="padding:14px 0">Elegí un amigo para chatear sin salir del juego.</div>');if(nb||force)el.scrollTop=el.scrollHeight}
function send(){var i=document.getElementById('ci'),x=i.value.trim();if(!x||!cur)return;i.value='';MS.push({me:1,x:x,t:Date.now()});drawM();ov.act({a:'send',c:cur,x:x})}
document.getElementById('ci').addEventListener('keydown',function(e){e.stopPropagation();if(e.key==='Enter')send();if(e.key==='Escape')ov.act({a:'close'})});document.getElementById('cs').onclick=send;
ov.on(function(t,d){if(t==='perf')perf(d);else if(t==='st'){FRS=d.fr||[];if(d.c===cur&&d.ms){var keep=MS.filter(function(m){return m.me&&m.t>Date.now()-4000&&!d.ms.some(function(z){return z.me&&z.x===m.x})});MS=d.ms.concat(keep)}drawF();drawM()}});
document.addEventListener('keydown',function(e){if(e.key==='Escape')ov.act({a:'close'})});
</script></body></html>`;
}
function achToast(o) {
  try {
    o = o || {};
    const E = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const R = { c: ['Común', '#9aa0b8'], r: ['Raro', '#60a5fa'], e: ['Épico', '#c084fc'], l: ['Legendario', '#fbbf24'] }[o.r] || ['Común', '#9aa0b8'];
    if (achWin && !achWin.isDestroyed()) achWin.destroy();
    const d = screen.getPrimaryDisplay(), w = 460, h = 178, wa = d.workArea;
    achWin = new BrowserWindow({ width: w, height: h, x: wa.x + Math.round((wa.width - w) / 2), y: wa.y - 16, frame: false, transparent: true, resizable: false, movable: false, skipTaskbar: true, focusable: false, alwaysOnTop: true, show: false, hasShadow: false, webPreferences: { sandbox: true, autoplayPolicy: 'no-user-gesture-required' } });
    achWin.setAlwaysOnTop(true, 'screen-saver'); try { achWin.setContentProtection(true); } catch (e) {} achWin.setIgnoreMouseEvents(true);
    const c = R[1];
    const snd = { c: [660, 990], r: [660, 880, 1175], e: [523, 784, 1047, 1319], l: [523, 659, 784, 1047, 1319] }[o.r] || [660, 990];
    const html = `<html><body style="margin:0;background:transparent;overflow:hidden;font-family:'Segoe UI',system-ui,sans-serif"><style>
@keyframes i{0%{opacity:0;transform:translateY(-34px) scale(.92)}60%{opacity:1;transform:translateY(4px) scale(1.01)}100%{opacity:1;transform:none}}@keyframes o{to{opacity:0;transform:translateY(-26px)}}
@keyframes sh{from{transform:translateX(-120%) skewX(-18deg)}to{transform:translateX(420%) skewX(-18deg)}}@keyframes pu{0%,100%{box-shadow:0 0 0 0 ${c}66,0 0 14px ${c}55}50%{box-shadow:0 0 0 6px ${c}00,0 0 20px ${c}88}}@keyframes pr{from{transform:scaleX(1)}to{transform:scaleX(0)}}
.t{position:absolute;left:30px;top:30px;right:30px;bottom:30px;display:flex;align-items:center;gap:14px;padding:0 18px 0 14px;border-radius:18px;background:linear-gradient(135deg,rgba(24,20,40,.97),rgba(12,10,22,.97));border:1px solid ${c}88;box-shadow:0 8px 18px rgba(0,0,0,.55),0 0 18px ${c}33;color:#fff;overflow:hidden;animation:i .55s cubic-bezier(.2,.9,.25,1.1) both}
.t.o{animation:o .35s ease both}.t:before{content:"";position:absolute;top:0;bottom:0;width:36%;left:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.16),transparent);animation:sh 1.5s .5s ease-out both}
.t:after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:${c};opacity:.7;transform-origin:left;animation:pr 5.2s linear forwards}
.b{width:58px;height:58px;border-radius:50%;flex:none;display:grid;place-items:center;background:radial-gradient(circle at 30% 25%,${c},${c}99 70%);animation:pu 1.8s ease-in-out infinite}
.x{min-width:0;flex:1}.k{font-size:10px;letter-spacing:.17em;text-transform:uppercase;color:${c};filter:brightness(1.25);display:flex;gap:8px;align-items:center}.k em{font-style:normal;padding:1px 7px;border-radius:9px;background:${c}2e;border:1px solid ${c}66;letter-spacing:.08em}
.n{font-size:16px;font-weight:700;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.d{font-size:12.5px;color:#b9b5d0;margin-top:2px;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.p{text-align:right;flex:none}.p b{display:block;font-size:20px;color:${c};filter:brightness(1.2)}.p small{font-size:10px;color:#9a96b3;letter-spacing:.1em}
</style><div class="t" id="t"><div class="b"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 20h8"/></svg></div><div class="x"><div class="k">Logro desbloqueado <em>${R[0]}</em></div><div class="n">${E(o.n)}</div><div class="d">${E(o.d)}</div></div>${+o.x > 0 ? `<div class="p"><b>+${Math.max(0, +o.x || 0)}</b><small>XP</small></div>` : ''}</div>
<script>setTimeout(function(){document.getElementById('t').classList.add('o')},4900);
try{var A=new (window.AudioContext||window.webkitAudioContext)(),t=A.currentTime+.05;${JSON.stringify(snd)}.forEach(function(f,i){var o=A.createOscillator(),g=A.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(0,t+i*.11);g.gain.linearRampToValueAtTime(.16,t+i*.11+.02);g.gain.exponentialRampToValueAtTime(.0008,t+i*.11+.7);o.connect(g);g.connect(A.destination);o.start(t+i*.11);o.stop(t+i*.11+.75)})}catch(e){}</script></body></html>`;
    achWin.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
    achWin.once('ready-to-show', () => { try { achWin.showInactive(); } catch (e) {} });
    setTimeout(() => { try { if (achWin && !achWin.isDestroyed()) achWin.destroy(); } catch (e) {} }, 5600);
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
    const d = screen.getPrimaryDisplay(), w = 412, h = 152, wa = d.workArea;
    ftWin = new BrowserWindow({ width: w, height: h, x: wa.x + wa.width - w + 14, y: wa.y + wa.height - h + 14, frame: false, transparent: true, resizable: false, movable: false, skipTaskbar: true, focusable: false, alwaysOnTop: true, show: false, hasShadow: false, webPreferences: { sandbox: true } });
    ftWin.setAlwaysOnTop(true, 'screen-saver'); try { ftWin.setContentProtection(true); } catch (e) {}
    const ini = E(String(o.n || '?').trim().charAt(0).toUpperCase());
    const html = `<html><head><title>x</title></head><body style="margin:0;background:transparent;overflow:hidden;font-family:'Segoe UI',system-ui,sans-serif;-webkit-user-select:none"><style>
@keyframes i{from{opacity:0;transform:translateX(46px)}to{opacity:1;transform:none}}@keyframes o{to{opacity:0;transform:translateX(36px)}}@keyframes p{from{transform:scaleX(1)}to{transform:scaleX(0)}}
.t{position:absolute;left:30px;top:30px;right:30px;bottom:30px;display:flex;align-items:center;gap:13px;padding:0 16px 0 18px;border-radius:12px;background:rgba(19,16,32,.97);border:1px solid rgba(255,255,255,.09);box-shadow:0 8px 18px rgba(0,0,0,.55);color:#fff;overflow:hidden;cursor:pointer;animation:i .38s cubic-bezier(.2,.8,.2,1) both}
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
function shotToast(thumbPng, text, kind, sub2) {
  try {
    if (toastWin && !toastWin.isDestroyed()) toastWin.destroy();
    kind = kind || 'shot';
    const E = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const d = screen.getPrimaryDisplay(), w = 410, h = 160, dur = kind === 'rec' ? 3200 : 3600;
    toastWin = new BrowserWindow({ width: w, height: h, x: d.workArea.x + d.workArea.width - w + 16, y: d.workArea.y - 16, frame: false, transparent: true, resizable: false, movable: false, skipTaskbar: true, focusable: false, alwaysOnTop: true, show: false, hasShadow: false, webPreferences: { sandbox: true } });
    toastWin.setAlwaysOnTop(true, 'screen-saver'); try { toastWin.setContentProtection(true); } catch (e) {} toastWin.setIgnoreMouseEvents(true);
    const C = { shot: '#8ec5ff', clip: '#c4a4ff', rec: '#ff5d6c', err: '#ffb454' }[kind] || '#8ec5ff';
    const T = { shot: 'Captura', clip: 'Clip', rec: 'Grabando', err: 'Aviso' }[kind] || 'Captura';
    const I = {
      shot: '<path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
      clip: '<rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="m16 10.5 5-3v9l-5-3z"/>',
      rec: '<circle cx="12" cy="12" r="5" fill="currentColor"/><circle cx="12" cy="12" r="9"/>',
      err: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17.5v.01"/>'
    }[kind] || '';
    const img = thumbPng ? `<div class="th"><img src="data:image/jpeg;base64,${thumbPng.toString('base64')}">${kind === 'clip' ? '<i></i>' : ''}</div>` : '';
    const sub = { shot: 'En la carpeta de este juego', clip: 'Listo en tu launcher', rec: 'Los próximos 10 segundos', err: 'Probá de nuevo' }[kind] || '';
    const html = `<html><body style="margin:0;background:transparent;overflow:hidden;font-family:'Segoe UI Variable','Segoe UI',system-ui,sans-serif"><style>
@keyframes i{0%{opacity:0;transform:translateX(40px) scale(.94)}60%{opacity:1;transform:translateX(-4px) scale(1.01)}100%{opacity:1;transform:none}}@keyframes o{to{opacity:0;transform:translateX(50px)}}@keyframes sh{from{transform:translateX(-130%) skewX(-18deg)}to{transform:translateX(480%) skewX(-18deg)}}@keyframes pr{from{transform:scaleX(1)}to{transform:scaleX(0)}}@keyframes pu{0%,100%{box-shadow:0 0 0 0 ${C}88}50%{box-shadow:0 0 0 6px ${C}00}}
.t{position:absolute;left:30px;top:30px;right:30px;bottom:30px;display:flex;align-items:center;gap:13px;padding:0 16px 0 12px;border-radius:22px;background:linear-gradient(160deg,rgba(34,34,40,.97),rgba(13,13,17,.97));border:1px solid rgba(255,255,255,.16);box-shadow:0 8px 18px rgba(0,0,0,.5),0 0 18px ${C}30,inset 0 1.5px 0 rgba(255,255,255,.2);color:#fff;overflow:hidden;animation:i .5s cubic-bezier(.2,.9,.25,1.1) both}
.t.o{animation:o .32s ease both}.t:before{content:"";position:absolute;top:0;bottom:0;width:30%;left:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.14),transparent);animation:sh 1.3s .45s ease-out both}
.t:after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:linear-gradient(90deg,${C},#fff8);transform-origin:left;animation:pr ${dur / 1000}s linear forwards}
.b{width:46px;height:46px;border-radius:15px;flex:none;display:grid;place-items:center;color:${C};background:linear-gradient(145deg,${C}33,${C}0d);border:1px solid ${C}55;${kind === 'rec' ? 'border-radius:50%;animation:pu 1.2s ease-in-out infinite;' : ''}}
.th{position:relative;flex:none}.th img{height:60px;border-radius:12px;display:block;box-shadow:0 0 0 1px rgba(255,255,255,.2),0 6px 16px rgba(0,0,0,.5)}.th i{position:absolute;inset:0;margin:auto;width:26px;height:26px;border-radius:50%;background:rgba(0,0,0,.55);border:2px solid #fff}.th i:before{content:"";position:absolute;left:9px;top:5px;border-left:8px solid #fff;border-top:5px solid transparent;border-bottom:5px solid transparent}
.x{min-width:0;flex:1}.k{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:${C}}.n{font-size:15.5px;font-weight:700;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.s{font-size:11.5px;color:#a9a9b3;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
</style><div class="t" id="t"><div class="b"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${I}</svg></div>${img}<div class="x"><div class="k">WINTEER · ${T}</div><div class="n">${E(text)}</div><div class="s">${E(sub2 || sub)}</div></div></div>
<script>setTimeout(function(){document.getElementById('t').classList.add('o')},${dur - 350});</script></body></html>`;
    toastWin.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
    toastWin.once('ready-to-show', () => { try { toastWin.showInactive(); } catch (e) {} });
    setTimeout(() => { try { if (toastWin && !toastWin.isDestroyed()) toastWin.destroy(); } catch (e) {} }, dur);
  } catch (e) {}
}
let scrPickId = null, scrPickAudio = false;
async function takeShot() {
  if (shotBusy) return; shotBusy = true;
  try {
    const cur = curNonSteam(); if (!cur) return;
    const d = screen.getPrimaryDisplay(), sf = d.scaleFactor || 1, size = { width: Math.round(d.size.width * sf), height: Math.round(d.size.height * sf) };
    if (size.width < 1920) { const k = 1920 / size.width; size.width = 1920; size.height = Math.round(size.height * k); }
    const srcs = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: size });
    const s = srcs.find(x => String(x.display_id) === String(d.id)) || srcs[0];
    if (!s || s.thumbnail.isEmpty()) { shotToast(null, 'No pude capturar la pantalla', 'err'); return; }
    const dir = path.join(SHOTS, String(cur.id).replace(/[^\w.-]/g, '_')); fs.mkdirSync(dir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19), file = path.join(dir, stamp + '.png'), tfile = path.join(dir, stamp + '.t.jpg');
    fs.writeFileSync(file, s.thumbnail.toPNG());
    const th = s.thumbnail.resize({ width: 640 }).toJPEG(85); fs.writeFileSync(tfile, th);
    shotToast(th, 'Captura guardada', 'shot');
    send({ type: 'shot', id: cur.id, file: pathToFileURL(file).href, thumb: pathToFileURL(tfile).href });
  } catch (e) { shotToast(null, 'No pude guardar la captura', 'err'); } finally { shotBusy = false; }
}
function listShots(id) {
  const dir = path.join(SHOTS, String(id).replace(/[^\w.-]/g, '_')), out = [];
  try { for (const f of fs.readdirSync(dir)) if (/^c[\d-T]+\.webm$/.test(f)) out.push({ n: f, clip: true, file: pathToFileURL(path.join(dir, f)).href, thumb: pathToFileURL(path.join(dir, f.replace(/\.webm$/, '.t.jpg'))).href, t: fs.statSync(path.join(dir, f)).mtimeMs }); } catch (e) {}
  try { for (const f of fs.readdirSync(dir)) if (/^[\d-T]+\.(jpg|png)$/.test(f)) out.push({ n: f, file: pathToFileURL(path.join(dir, f)).href, thumb: pathToFileURL(path.join(dir, f.replace(/\.(jpg|png)$/, '.t.jpg'))).href, t: fs.statSync(path.join(dir, f)).mtimeMs }); } catch (e) {}
  return out.sort((a, b) => b.t - a.t);
}

/* puntaje visual de capturas y clips (para sugerir las mejores): contraste, detalle, color y exposicion */
const SHSC = new Map();
function shotScores(id) {
  const dir = path.join(SHOTS, String(id).replace(/[^\w.-]/g, '_')), out = {};
  let files = [];
  try { files = fs.readdirSync(dir).filter(f => /^c?[\d-T]+\.(jpg|png|webm)$/.test(f)); } catch (e) { return out; }
  for (const f of files) {
    const tp = path.join(dir, f.replace(/\.(jpg|png|webm)$/, '.t.jpg'));
    let mt = 0; try { mt = fs.statSync(tp).mtimeMs; } catch (e) { continue; }
    const ck = tp + '|' + mt;
    if (SHSC.has(ck)) { out[f] = SHSC.get(ck); continue; }
    let sc = -1;
    try {
      const img = nativeImage.createFromPath(tp);
      if (!img.isEmpty()) {
        const r = img.resize({ width: 48, quality: 'good' }), sz = r.getSize(), bm = r.toBitmap(), w = sz.width, h = sz.height;
        const L = new Float32Array(w * h); let sum = 0, col = 0;
        for (let i = 0; i < w * h; i++) {
          const b = bm[i * 4], g = bm[i * 4 + 1], rr = bm[i * 4 + 2];
          L[i] = 0.299 * rr + 0.587 * g + 0.114 * b; sum += L[i]; col += Math.abs(rr - g) + Math.abs(g - b);
        }
        const n = w * h, mean = sum / n; let v = 0, ed = 0;
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
          const i = y * w + x; v += (L[i] - mean) * (L[i] - mean);
          if (x + 1 < w) ed += Math.abs(L[i] - L[i + 1]);
          if (y + 1 < h) ed += Math.abs(L[i] - L[i + w]);
        }
        const sd = Math.sqrt(v / n), edge = ed / (2 * n), colr = col / n;
        let s = 100 * (0.35 * Math.min(1, edge / 14) + 0.25 * Math.min(1, sd / 55) + 0.2 * Math.min(1, colr / 40) + 0.2 * (1 - Math.min(1, Math.abs(mean - 105) / 105)));
        if (mean < 22 || sd < 9) s *= 0.3;
        sc = Math.round(s);
      }
    } catch (e) {}
    SHSC.set(ck, sc); out[f] = sc;
  }
  return out;
}

/* pasa las capturas y clips de una entrada a otra (vincular con la tienda) */
function shotsMerge(from, to) {
  const dir = id => path.join(SHOTS, String(id).replace(/[^\w.-]/g, '_'));
  const a = dir(from), b = dir(to);
  if (a === b || !fs.existsSync(a)) return { ok: true, n: 0 };
  fs.mkdirSync(b, { recursive: true });
  let n = 0;
  for (const f of fs.readdirSync(a)) {
    const t = path.join(b, f);
    if (fs.existsSync(t)) continue;
    try { fs.renameSync(path.join(a, f), t); n++; } catch (e) { try { fs.copyFileSync(path.join(a, f), t); fs.unlinkSync(path.join(a, f)); n++; } catch (e2) {} }
  }
  try { fs.rmdirSync(a); } catch (e) {}
  return { ok: true, n };
}

const track = new Map();

/* ---------- gestor de mods: Project Zomboid ---------- */
const PZ_HOME = () => path.join(app.getPath('home'), 'Zomboid');
function pzInfo(txt) { const o = {}; for (const l of String(txt).split(/\r?\n/)) { const x = /^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/.exec(l); if (x) { const k = x[1].toLowerCase(); if (!(k in o)) o[k] = x[2].trim(); } } return o; }
function pzModAt(dir, wid, local) {
  const cands = [path.join(dir, 'common')];
  try { for (const e of fs.readdirSync(dir, { withFileTypes: true })) if (e.isDirectory() && /^\d/.test(e.name)) cands.push(path.join(dir, e.name)); } catch (e) {}
  cands.sort((a, b) => (b.endsWith('common') ? 1 : 0) - (a.endsWith('common') ? 1 : 0)); cands.push(dir);
  for (const d of cands) {
    const f = path.join(d, 'mod.info'); if (!fs.existsSync(f)) continue;
    try {
      const o = pzInfo(fs.readFileSync(f, 'utf8')); if (!o.id) continue;
      let poster = ''; const pn = o.poster || 'poster.png';
      for (const b of [d, dir]) { const pp = path.join(b, pn); if (fs.existsSync(pp)) { poster = pathToFileURL(pp).href; break; } }
      return { id: o.id, name: o.name || o.id, author: o.author || '', ver: o.modversion || '', wid: wid || '', local: !!local, poster, desc: String(o.description || '').slice(0, 240), req: String(o.require || '').split(',').map((s) => s.trim().replace(/^\\/, '')).filter(Boolean) };
    } catch (e) {}
  }
  return null;
}
function pzActive() {
  try {
    const t = fs.readFileSync(path.join(PZ_HOME(), 'mods', 'default.txt'), 'utf8');
    const b = /mods\s*\{([\s\S]*?)\}/.exec(t); if (!b) return [];
    return [...b[1].matchAll(/^\s*mod\s*=\s*([^,\r\n]+?)\s*,?\s*$/gm)].map((x) => x[1].trim());
  } catch (e) { return null; }
}
function pzScan(steamDir) {
  const mods = [], seen = new Set();
  const push = (x) => { if (x && !seen.has(x.id)) { seen.add(x.id); mods.push(x); } };
  for (const lib of steamLibs(steamDir)) {
    const base = path.join(lib, 'steamapps', 'workshop', 'content', '108600');
    let ws = []; try { ws = fs.readdirSync(base); } catch (e) { continue; }
    for (const w of ws) { const md = path.join(base, w, 'mods'); let ns = []; try { ns = fs.readdirSync(md); } catch (e) { continue; } for (const n of ns) push(pzModAt(path.join(md, n), w, false)); }
  }
  const lm = path.join(PZ_HOME(), 'mods'); let ln = []; try { ln = fs.readdirSync(lm); } catch (e) {}
  for (const n of ln) { if (n.toLowerCase() === 'examplemod') continue; try { if (fs.statSync(path.join(lm, n)).isDirectory()) push(pzModAt(path.join(lm, n), '', true)); } catch (e) {} }
  mods.sort((a, b) => a.name.localeCompare(b.name));
  return { ok: true, mods, active: pzActive(), home: fs.existsSync(PZ_HOME()) };
}
async function pzApply(ids, steamDir) {
  try {
    const procs = await listProcs(); if (procs.some((p) => /projectzomboid/.test(p))) return { ok: false, err: 'run' };
    ids = [...new Set((ids || []).map((s) => String(s).trim()).filter((s) => /^[\w.\-]+$/.test(s)))];
    const f = path.join(PZ_HOME(), 'mods', 'default.txt'); fs.mkdirSync(path.dirname(f), { recursive: true });
    let old = ''; try { old = fs.readFileSync(f, 'utf8'); } catch (e) {}
    const cur = pzActive() || [], idx = new Map(cur.map((x, i) => [x, i]));
    const info = new Map(pzScan(steamDir).mods.map((x) => [x.id, x]));
    const sel = new Set(ids);
    let ord = ids.slice().sort((a, b) => (idx.has(a) ? idx.get(a) : 1e6 + ids.indexOf(a)) - (idx.has(b) ? idx.get(b) : 1e6 + ids.indexOf(b)));
    const out = [], st = new Set(), visit = (id) => { if (st.has(id)) return; st.add(id); const x = info.get(id); if (x) for (const r of x.req) if (sel.has(r)) visit(r); out.push(id); };
    ord.forEach(visit);
    const body = '\r\n' + out.map((i) => '    mod = ' + i + ',').join('\r\n') + '\r\n';
    let text;
    if (/mods\s*\{[\s\S]*?\}/.test(old)) text = old.replace(/(mods\s*\{)[\s\S]*?(\})/, (_m, a, b) => a + body + b);
    else text = 'VERSION = 1,\r\n\r\nmods\r\n{' + body + '}\r\n\r\nmaps\r\n{\r\n}\r\n';
    if (old) { try { fs.writeFileSync(f + '.bak-' + new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19), old); } catch (e) {} }
    const tmp = f + '.wt-tmp'; fs.writeFileSync(tmp, text); fs.renameSync(tmp, f);
    return { ok: true, count: out.length, active: out };
  } catch (e) { return { ok: false, err: String(e && e.message || e) }; }
}
function pzSearch(q, page, sort, tag, app) {
  app = /^\d{2,9}$/.test(String(app || '')) ? String(app) : '108600';
  return new Promise((res) => {
    let w = null, done = false;
    const fin = (r) => { if (done) return; done = true; try { if (w && !w.isDestroyed()) w.destroy(); } catch (e) {} res(r); };
    try {
      w = new BrowserWindow({ show: false, width: 1200, height: 900, webPreferences: { partition: 'wt-pzsearch', sandbox: true, backgroundThrottling: false } });
      const so = q ? 'textsearch' : (['trend', 'mostrecent', 'totaluniquesubscribers'].includes(sort) ? sort : 'trend');
      const u = 'https://steamcommunity.com/workshop/browse/?appid=' + app + '&searchtext=' + encodeURIComponent(String(q || '').slice(0, 80)) + '&browsesort=' + so + '&section=readytouseitems&actualsort=' + so + '&p=' + (Math.max(1, Math.min(20, +page || 1))) + '&days=' + (so === 'trend' ? 7 : -1) + (tag ? '&requiredtags%5B0%5D=' + encodeURIComponent('Build 42') : '');
      setTimeout(() => fin({ ok: false, err: 'timeout' }), 20000);
      w.webContents.on('did-fail-load', (_e, c) => { if (c !== -3) fin({ ok: false, err: 'net' }); });
      w.webContents.on('did-finish-load', async () => {
        try {
          const items = await w.webContents.executeJavaScript(`(async function(){var get=function(){var by={};document.querySelectorAll('a[href*="filedetails/?id="]').forEach(function(a){var x=/[?&]id=(\\d+)/.exec(a.href);if(!x)return;var id=x[1],o=by[id]||(by[id]={wid:id,t:'',img:'',a:''});var im=a.querySelector('img');if(im){if(!o.img)o.img=im.getAttribute('src')||'';if(!o.t)o.t=(im.getAttribute('alt')||'').trim()}var tx=(a.textContent||'').trim();if(tx&&!im&&tx.length>1&&!/^(M\\u00e1s informaci\\u00f3n|Learn More)$/i.test(tx))o.t=tx;var c=a.closest('.workshopItem');if(c){var t=c.querySelector('.workshopItemTitle');if(t&&!o.t)o.t=t.textContent.trim();var au=c.querySelector('.workshopItemAuthorName');if(au)o.a=au.textContent.replace(/^\\s*(por|by)\\s*/i,'').trim()}});return Object.keys(by).map(function(k){return by[k]}).filter(function(o){return o.img&&o.t})};var t0=Date.now(),r=get();while(r.length<4&&Date.now()-t0<11000){await new Promise(function(z){setTimeout(z,500)});r=get()}return r})()`);
          fin({ ok: true, items: (items || []).slice(0, 40).map((x) => ({ wid: String(x.wid).replace(/\D/g, ''), t: String(x.t).slice(0, 120), img: /^https:\/\//.test(x.img) ? x.img : '', a: String(x.a || '').slice(0, 60) })) });
        } catch (e) { fin({ ok: false, err: 'parse' }); }
      });
      w.loadURL(u);
    } catch (e) { fin({ ok: false, err: 'err' }); }
  });
}

/* ---------- suscribirse a mods del Workshop con la cuenta de Steam ---------- */
const PZ_PART = 'persist:wt-steamweb';
async function swCookie(name) { try { const c = await session.fromPartition(PZ_PART).cookies.get({ url: 'https://steamcommunity.com', name }); return c && c.length ? c[0] : null; } catch (e) { return null; } }
function swLogin() {
  return new Promise((res) => {
    let done = false, t = null, w = null;
    const fin = (ok) => { if (done) return; done = true; clearInterval(t); try { if (w && !w.isDestroyed()) w.destroy(); } catch (e) {} res(ok); };
    try {
      w = new BrowserWindow({ width: 520, height: 780, autoHideMenuBar: true, title: 'Iniciar sesión en Steam', backgroundColor: '#111111', webPreferences: { partition: PZ_PART, contextIsolation: true, nodeIntegration: false, sandbox: true } });
      t = setInterval(async () => { if (await swCookie('steamLoginSecure')) fin(true); }, 1200);
      w.on('closed', () => fin(false));
      w.loadURL('https://steamcommunity.com/login/home/?goto=' + encodeURIComponent('https://steamcommunity.com/app/108600/workshop/'));
      setTimeout(() => fin(false), 5 * 60 * 1000);
    } catch (e) { fin(false); }
  });
}
async function pzSub(wid, retry, app) {
  try {
    app = /^\d{2,9}$/.test(String(app || '')) ? String(app) : '108600';
    wid = String(wid || ''); if (!/^\d{5,12}$/.test(wid)) return { ok: false, err: 'id' };
    if (!(await swCookie('steamLoginSecure'))) { if (!(await swLogin())) return { ok: false, err: 'login' }; }
    const ses = session.fromPartition(PZ_PART);
    let sid = await swCookie('sessionid');
    if (!sid) { try { await ses.fetch('https://steamcommunity.com/app/108600/workshop/'); } catch (e) {} sid = await swCookie('sessionid'); }
    if (!sid) return { ok: false, err: 'sid' };
    const r = await ses.fetch('https://steamcommunity.com/sharedfiles/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', Origin: 'https://steamcommunity.com', Referer: 'https://steamcommunity.com/sharedfiles/filedetails/?id=' + wid, 'X-Requested-With': 'XMLHttpRequest' }, body: new URLSearchParams({ id: wid, appid: app, sessionid: sid.value }).toString() });
    let j = null; try { j = await r.json(); } catch (e) {}
    if (j && (j.success === 1 || j.success === true)) return { ok: true };
    if (!retry) { try { await ses.clearStorageData({ storages: ['cookies'] }); } catch (e) {} return pzSub(wid, true, app); }
    return { ok: false, err: 'api', st: r.status };
  } catch (e) { return { ok: false, err: 'net' }; }
}

/* ---------- Workshop de Steam para cualquier juego: quitar suscripción y ver lo instalado ---------- */
async function wsUnsub(wid, app, retry) {
  try {
    wid = String(wid || ''); app = String(app || ''); if (!/^\d{5,12}$/.test(wid) || !/^\d{2,9}$/.test(app)) return { ok: false, err: 'id' };
    if (!(await swCookie('steamLoginSecure'))) { if (!(await swLogin())) return { ok: false, err: 'login' }; }
    const ses = session.fromPartition(PZ_PART);
    let sid = await swCookie('sessionid');
    if (!sid) { try { await ses.fetch('https://steamcommunity.com/app/' + app + '/workshop/'); } catch (e) {} sid = await swCookie('sessionid'); }
    if (!sid) return { ok: false, err: 'sid' };
    const r = await ses.fetch('https://steamcommunity.com/sharedfiles/unsubscribe', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', Origin: 'https://steamcommunity.com', Referer: 'https://steamcommunity.com/sharedfiles/filedetails/?id=' + wid, 'X-Requested-With': 'XMLHttpRequest' }, body: new URLSearchParams({ id: wid, appid: app, sessionid: sid.value }).toString() });
    let j = null; try { j = await r.json(); } catch (e) {}
    if (j && (j.success === 1 || j.success === true)) return { ok: true };
    if (!retry) { try { await ses.clearStorageData({ storages: ['cookies'] }); } catch (e) {} return wsUnsub(wid, app, true); }
    return { ok: false, err: 'api' };
  } catch (e) { return { ok: false, err: 'net' }; }
}
function dirSize(d, depth) {
  let n = 0; if ((depth || 0) > 6) return 0;
  try { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) n += dirSize(p, (depth || 0) + 1); else { try { n += fs.statSync(p).size; } catch (x) {} } } } catch (e) {}
  return n;
}
async function wsList(app, steamDir) {
  try {
    app = String(app || ''); if (!/^\d{2,9}$/.test(app)) return { ok: false, items: [] };
    const items = [], seen = new Set();
    for (const lib of steamLibs(steamDir)) {
      const base = path.join(lib, 'steamapps', 'workshop', 'content', app);
      let ws = []; try { ws = fs.readdirSync(base); } catch (e) { continue; }
      for (const w of ws) if (/^\d{5,12}$/.test(w) && !seen.has(w)) { seen.add(w); items.push({ wid: w, size: dirSize(path.join(base, w)), t: '', img: '' }); }
    }
    items.sort((a, b) => b.size - a.size);
    const top = items.slice(0, 100);
    if (top.length) {
      try {
        const body = new URLSearchParams({ itemcount: String(top.length) }); top.forEach((x, i) => body.set('publishedfileids[' + i + ']', x.wid));
        const r = await net.fetch('https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
        const j = await r.json().catch(() => null), det = (j && j.response && j.response.publishedfiledetails) || [];
        const by = new Map(det.map((x) => [String(x.publishedfileid), x]));
        for (const x of top) { const d = by.get(x.wid); if (d) { x.t = String(d.title || '').slice(0, 120); x.img = /^https:\/\//.test(d.preview_url || '') ? d.preview_url : ''; } }
      } catch (e) {}
    }
    return { ok: true, items: top, total: items.length };
  } catch (e) { return { ok: false, items: [] }; }
}

async function pzDeps(wid) {
  try {
    const seen = new Set([String(wid)]), out = []; let level = [String(wid)];
    for (let d = 0; d < 3 && level.length; d++) {
      const body = new URLSearchParams({ itemcount: String(level.length) }); level.forEach((id, i) => body.set('publishedfileids[' + i + ']', id));
      const r = await net.fetch('https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
      const j = await r.json().catch(() => null); const det = (j && j.response && j.response.publishedfiledetails) || [];
      const next = [];
      for (const x of det) for (const c of (x.children || [])) { const id = String(c.publishedfileid || ''); if (/^\d{5,12}$/.test(id) && !seen.has(id)) { seen.add(id); out.push(id); next.push(id); } }
      level = next;
    }
    return { ok: true, ids: out.slice(0, 30) };
  } catch (e) { return { ok: false, ids: [] }; }
}

/* ---------- mods de otros juegos: mod.io ---------- */
async function mioReq(o) {
  try {
    o = o || {}; const p = String(o.p || ''); if (!/^\/(games|me|oauth)(\/|$)/.test(p) || p.includes('..')) return { ok: false, err: 'path' };
    if (!cfg.mioKey) return { ok: false, err: 'key' };
    const q = new URLSearchParams(o.q || {}); const h = { Accept: 'application/json' };
    if (o.auth) { if (!cfg.mioTok) return { ok: false, err: 'auth' }; h.Authorization = 'Bearer ' + cfg.mioTok; } else q.set('api_key', cfg.mioKey);
    let body; if (o.f) { h['Content-Type'] = 'application/x-www-form-urlencoded'; body = new URLSearchParams(o.f).toString(); }
    const r = await net.fetch('https://api.mod.io/v1' + p + (q.toString() ? '?' + q : ''), { method: o.m || 'GET', headers: h, body });
    let j = null; try { j = await r.json(); } catch (e) {}
    if (r.status === 401 && o.auth) { cfg.mioTok = ''; saveCfg(); return { ok: false, st: 401, err: 'auth' }; }
    return { ok: r.ok, st: r.status, d: j };
  } catch (e) { return { ok: false, err: 'net' }; }
}

/* ---------- Minecraft: Modrinth + CurseForge ---------- */
const MC_SUB = { mod: 'mods', resourcepack: 'resourcepacks', shader: 'shaderpacks' };
function mcRoot(r) {
  r = String(r || '').trim();
  if (r && path.isAbsolute(r)) return r;
  return path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), '.minecraft');
}
function mcInfo(r) {
  const root = mcRoot(r); const out = { root, exists: false, versions: [] };
  try { out.exists = fs.statSync(root).isDirectory(); } catch (e) {}
  const seen = new Set();
  const add = (v, l) => { const k = v + '|' + l; if (!seen.has(k)) { seen.add(k); out.versions.push({ v, l }); } };
  try {
    for (const d of fs.readdirSync(path.join(root, 'versions'))) {
      let m;
      if ((m = /^fabric-loader-[\d.]+(?:-beta\.?\d+)?-(\d+\.\d+(?:\.\d+)?)$/.exec(d))) add(m[1], 'fabric');
      else if ((m = /^quilt-loader-[\d.]+-(\d+\.\d+(?:\.\d+)?)$/.exec(d))) add(m[1], 'quilt');
      else if ((m = /^(\d+\.\d+(?:\.\d+)?)-forge-/i.exec(d))) add(m[1], 'forge');
      else if ((m = /^neoforge-(\d+)\.(\d+)/i.exec(d))) add('1.' + m[1] + (+m[2] > 0 ? '.' + m[2] : ''), 'neoforge');
      else if ((m = /^(\d+\.\d+(?:\.\d+)?)$/.exec(d))) add(m[1], '');
    }
  } catch (e) {}
  return out;
}
const MC_HOSTS = /^(cdn\.modrinth\.com|edge\.forgecdn\.net|mediafilez\.forgecdn\.net|media\.forgecdn\.net)$/;
async function mcReq(o) {
  try {
    o = o || {}; const p = String(o.p || ''); if (!p.startsWith('/') || p.includes('..')) return { ok: false, err: 'path' };
    const q = new URLSearchParams(o.q || {}); let base, h = { Accept: 'application/json', 'User-Agent': 'WINTEER/' + app.getVersion() };
    if (o.src === 'cf') { if (!cfg.cfKey) return { ok: false, err: 'key' }; base = 'https://api.curseforge.com/v1'; h['x-api-key'] = cfg.cfKey; }
    else base = 'https://api.modrinth.com/v2';
    const r = await net.fetch(base + p + (q.toString() ? '?' + q : ''), { headers: h });
    let j = null; try { j = await r.json(); } catch (e) {}
    if (r.status === 403 && o.src === 'cf') return { ok: false, st: 403, err: 'key' };
    return { ok: r.ok, st: r.status, d: j };
  } catch (e) { return { ok: false, err: 'net' }; }
}
function mcDirOf(root, kind) { const sub = MC_SUB[kind]; if (!sub) return null; return path.join(mcRoot(root), sub); }
async function mcGet(o) {
  try {
    o = o || {}; const dir = mcDirOf(o.root, o.kind); if (!dir) return { ok: false, err: 'kind' };
    const u = new URL(String(o.url || '')); if (u.protocol !== 'https:' || !MC_HOSTS.test(u.hostname)) return { ok: false, err: 'host' };
    const name = path.basename(String(o.name || '')).replace(/[<>:"/\\|?*\x00-\x1f]/g, '_'); if (!/\.(jar|zip)$/i.test(name)) return { ok: false, err: 'name' };
    const r = await net.fetch(u.href, { headers: { 'User-Agent': 'WINTEER/' + app.getVersion() }, redirect: 'follow' });
    if (!r.ok) return { ok: false, err: 'http', st: r.status };
    const buf = Buffer.from(await r.arrayBuffer()); if (!buf.length || buf.length > 400 * 1024 * 1024) return { ok: false, err: 'size' };
    if (o.sha1 && crypto.createHash('sha1').update(buf).digest('hex') !== String(o.sha1).toLowerCase()) return { ok: false, err: 'hash' };
    if (o.sha512 && crypto.createHash('sha512').update(buf).digest('hex') !== String(o.sha512).toLowerCase()) return { ok: false, err: 'hash' };
    fs.mkdirSync(dir, { recursive: true });
    const tmp = path.join(dir, name + '.wtpart'); fs.writeFileSync(tmp, buf); fs.renameSync(tmp, path.join(dir, name));
    return { ok: true, file: name, size: buf.length };
  } catch (e) { return { ok: false, err: 'net' }; }
}
function mcList(root, kind) {
  const dir = mcDirOf(root, kind); if (!dir) return [];
  try {
    return fs.readdirSync(dir).filter(f => /\.(jar|zip)(\.disabled)?$/i.test(f)).map(f => {
      let st = null; try { st = fs.statSync(path.join(dir, f)); } catch (e) {}
      return { f, size: st ? st.size : 0, t: st ? st.mtimeMs : 0, off: /\.disabled$/i.test(f) };
    }).sort((a, b) => a.f.localeCompare(b.f));
  } catch (e) { return []; }
}
function mcFileOp(o) {
  try {
    const dir = mcDirOf(o.root, o.kind); if (!dir) return { ok: false };
    const f = path.basename(String(o.file || '')); if (!/\.(jar|zip)(\.disabled)?$/i.test(f)) return { ok: false };
    const p = path.join(dir, f); if (!fs.existsSync(p)) return { ok: true, file: f };
    if (o.op === 'del') { fs.unlinkSync(p); return { ok: true }; }
    if (o.op === 'toggle') { const nf = /\.disabled$/i.test(f) ? f.replace(/\.disabled$/i, '') : f + '.disabled'; fs.renameSync(p, path.join(dir, nf)); return { ok: true, file: nf }; }
    return { ok: false };
  } catch (e) { return { ok: false }; }
}

/* ---------- Nexus Mods ---------- */
async function nxReq(o) {
  try {
    o = o || {}; if (!cfg.nxKey) return { ok: false, err: 'key' };
    const p = String(o.p || ''); const h = { Accept: 'application/json', apikey: cfg.nxKey, 'Application-Name': 'WINTEER', 'Application-Version': app.getVersion(), 'User-Agent': 'WINTEER/' + app.getVersion() };
    let r;
    if (o.gql) { h['Content-Type'] = 'application/json'; r = await net.fetch('https://api.nexusmods.com/v2/graphql', { method: 'POST', headers: h, body: JSON.stringify({ query: String(o.gql), variables: o.vars || {} }) }); }
    else { if (!/^\/(games|users)(\/|\.|$)/.test(p) || p.includes('..')) return { ok: false, err: 'path' }; r = await net.fetch('https://api.nexusmods.com/v1' + p, { headers: h }); }
    let j = null; try { j = await r.json(); } catch (e) {}
    if (r.status === 401 || r.status === 403) return { ok: false, st: r.status, err: 'key' };
    return { ok: r.ok, st: r.status, d: j };
  } catch (e) { return { ok: false, err: 'net' }; }
}
async function nxGet(o) {
  try {
    o = o || {}; const kx = o.key && o.expires && /^[A-Za-z0-9_-]{4,200}$/.test(String(o.key)) && /^\d{6,14}$/.test(String(o.expires)); if (!cfg.nxKey || (!cfg.nxPrem && !kx)) return { ok: false, err: 'prem' };
    const dom = String(o.domain || ''), mid = +o.mod, fid = +o.file; if (!/^[a-z0-9_]+$/i.test(dom) || !mid || !fid) return { ok: false, err: 'args' };
    const lk = await nxReq({ p: `/games/${dom}/mods/${mid}/files/${fid}/download_link.json` + (kx ? `?key=${o.key}&expires=${o.expires}` : '') });
    const u0 = lk.ok && Array.isArray(lk.d) && lk.d[0] && lk.d[0].URI; if (!u0) return { ok: false, err: 'link' };
    const u = new URL(u0); if (u.protocol !== 'https:' || !/(^|\.)nexusmods\.com$/i.test(u.hostname)) return { ok: false, err: 'host' };
    const base = o.dest && path.isAbsolute(String(o.dest)) ? String(o.dest) : path.join(app.getPath('downloads'), 'WINTEER Mods', dom);
    fs.mkdirSync(base, { recursive: true });
    const name = path.basename(String(o.name || '')).replace(/[<>:"/\\|?*\x00-\x1f]/g, '_') || ('mod-' + mid + '.zip');
    const r = await net.fetch(u.href, { headers: { 'User-Agent': 'WINTEER/' + app.getVersion() } }); if (!r.ok) return { ok: false, err: 'http', st: r.status };
    const buf = Buffer.from(await r.arrayBuffer()); if (!buf.length || buf.length > 3 * 1024 * 1024 * 1024) return { ok: false, err: 'size' };
    const fp = path.join(base, name); fs.writeFileSync(fp, buf);
    let ext = '';
    if (o.extract && process.platform === 'win32' && /\.zip$/i.test(name)) {
      ext = path.join(base, name.replace(/\.zip$/i, ''));
      await new Promise(res => execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', 'Expand-Archive -LiteralPath $env:WT_Z -DestinationPath $env:WT_D -Force'], { windowsHide: true, timeout: 120000, env: Object.assign({}, process.env, { WT_Z: fp, WT_D: ext }) }, () => res()));
      if (!fs.existsSync(ext)) ext = '';
    }
    return { ok: true, dir: base, file: name, ext };
  } catch (e) { return { ok: false, err: 'net' }; }
}

/* ---------- lector mínimo de zip/jar (sin dependencias) ---------- */
const zlib = require('zlib');
function zipOpen(fp) {
  const fd = fs.openSync(fp, 'r'); const size = fs.fstatSync(fd).size;
  const tl = Math.min(size, 65557 + 22), tb = Buffer.alloc(tl); fs.readSync(fd, tb, 0, tl, size - tl);
  let e = -1; for (let i = tl - 22; i >= 0; i--) if (tb.readUInt32LE(i) === 0x06054b50) { e = i; break; }
  if (e < 0) { fs.closeSync(fd); throw new Error('zip'); }
  const n = tb.readUInt16LE(e + 10), csz = tb.readUInt32LE(e + 12), coff = tb.readUInt32LE(e + 16);
  const cb = Buffer.alloc(csz); fs.readSync(fd, cb, 0, csz, coff);
  const ents = new Map(); let p = 0;
  for (let i = 0; i < n && p + 46 <= csz; i++) {
    if (cb.readUInt32LE(p) !== 0x02014b50) break;
    const meth = cb.readUInt16LE(p + 10), cs = cb.readUInt32LE(p + 20), us = cb.readUInt32LE(p + 24), nl = cb.readUInt16LE(p + 28), xl = cb.readUInt16LE(p + 30), cl = cb.readUInt16LE(p + 32), off = cb.readUInt32LE(p + 42);
    const name = cb.toString('utf8', p + 46, p + 46 + nl); ents.set(name, { name, meth, cs, us, off }); p += 46 + nl + xl + cl;
  }
  const read = (name) => {
    const en = ents.get(name); if (!en || en.us > 200 * 1024 * 1024) return null;
    const lh = Buffer.alloc(30); fs.readSync(fd, lh, 0, 30, en.off); if (lh.readUInt32LE(0) !== 0x04034b50) return null;
    const ds = en.off + 30 + lh.readUInt16LE(26) + lh.readUInt16LE(28); const raw = Buffer.alloc(en.cs); fs.readSync(fd, raw, 0, en.cs, ds);
    return en.meth === 0 ? raw : en.meth === 8 ? zlib.inflateRawSync(raw) : null;
  };
  return { ents, read, close: () => { try { fs.closeSync(fd); } catch (x) {} } };
}
/* qué mods hay en la carpeta y qué necesita cada uno (para detectar conflictos) */
function mcScan(root) {
  const dir = mcDirOf(root, 'mod'), out = [];
  let L = []; try { L = fs.readdirSync(dir).filter(f => /\.jar$/i.test(f)); } catch (e) {}
  for (const f of L) {
    const it = { f, loaders: [], ids: [], deps: [], mc: '' }; let z = null;
    try {
      z = zipOpen(path.join(dir, f));
      let b;
      if ((b = z.read('fabric.mod.json'))) {
        const j = JSON.parse(b.toString('utf8').replace(/^﻿/, '')); it.loaders.push('fabric', 'quilt'); if (j.id) it.ids.push(j.id); (Array.isArray(j.provides) ? j.provides : []).forEach(x => it.ids.push(String(x)));
        const d = j.depends || {}; for (const k of Object.keys(d)) { if (k === 'minecraft') it.mc = Array.isArray(d[k]) ? d[k].join(' || ') : String(d[k]); else if (!['fabricloader', 'java', 'fabric-loader'].includes(k)) it.deps.push(k); }
      }
      if ((b = z.read('quilt.mod.json'))) { it.loaders.push('quilt'); try { const j = JSON.parse(b.toString('utf8')); const id = j.quilt_loader && j.quilt_loader.id; if (id) it.ids.push(id); } catch (x) {} }
      for (const tn of ['META-INF/mods.toml', 'META-INF/neoforge.mods.toml']) {
        if ((b = z.read(tn))) {
          const t = b.toString('utf8'); it.loaders.push(tn.includes('neoforge') ? 'neoforge' : 'forge'); if (tn.includes('mods.toml') && !tn.includes('neoforge')) it.loaders.push('neoforge');
          const m = /\[\[mods\]\][\s\S]*?modId\s*=\s*"([^"]+)"/.exec(t); if (m) it.ids.push(m[1]);
          const re = /\[\[dependencies\.[^\]]+\]\]([\s\S]*?)(?=\n\s*\[\[|$)/g; let x;
          while ((x = re.exec(t))) { const blk = x[1], id = /modId\s*=\s*"([^"]+)"/.exec(blk), req = /mandatory\s*=\s*true/i.test(blk) || /type\s*=\s*"required"/i.test(blk); if (!id || !req) continue; if (id[1] === 'minecraft') { const vr = /versionRange\s*=\s*"([^"]*)"/.exec(blk); if (vr) it.mc = vr[1]; } else if (!['forge', 'neoforge'].includes(id[1])) it.deps.push(id[1]); }
        }
      }
      if (!it.loaders.length && z.ents.has('mcmod.info')) it.loaders.push('forge');
    } catch (e) { it.bad = 1; }
    if (z) z.close(); it.loaders = [...new Set(it.loaders)]; it.ids = [...new Set(it.ids)]; out.push(it);
  }
  return out;
}
const MP_HOSTS = /^(cdn\.modrinth\.com|github\.com|raw\.githubusercontent\.com|gitlab\.com)$/;
const mcSend = (c, d) => { if (win && !win.isDestroyed()) win.webContents.send('mcprog', { c, d }); };
async function mcPackInstall(o) {
  const root = mcRoot(o.root); const tmp = path.join(app.getPath('temp'), 'wt-pack-' + Date.now() + '.mrpack');
  try {
    const u = new URL(String(o.url || '')); if (u.protocol !== 'https:' || u.hostname !== 'cdn.modrinth.com') return { ok: false, err: 'host' };
    mcSend('Bajando el pack…');
    const r = await net.fetch(u.href, { headers: { 'User-Agent': 'WINTEER/' + app.getVersion() } }); if (!r.ok) return { ok: false, err: 'http' };
    const buf = Buffer.from(await r.arrayBuffer());
    if (o.sha512 && crypto.createHash('sha512').update(buf).digest('hex') !== String(o.sha512).toLowerCase()) return { ok: false, err: 'hash' };
    fs.writeFileSync(tmp, buf);
    const z = zipOpen(tmp); const ib = z.read('modrinth.index.json'); if (!ib) { z.close(); return { ok: false, err: 'pack' }; }
    const idx = JSON.parse(ib.toString('utf8')); const files = (idx.files || []).filter(f => !(f.env && f.env.client === 'unsupported'));
    const safe = (rel) => { rel = String(rel || '').replace(/\\/g, '/'); if (!rel || rel.startsWith('/') || rel.split('/').includes('..') || /^[a-z]:/i.test(rel)) return null; const p = path.join(root, rel); return p.startsWith(root + path.sep) ? p : null; };
    // overrides primero
    for (const pre of ['overrides/', 'client-overrides/']) for (const [name] of z.ents) {
      if (!name.startsWith(pre) || name.endsWith('/')) continue; const dest = safe(name.slice(pre.length)); if (!dest) continue;
      const d = z.read(name); if (!d) continue; fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, d);
    }
    z.close();
    let done = 0; const failed = []; let i = 0;
    const work = async () => {
      while (i < files.length) {
        const f = files[i++], dest = safe(f.path); let ok = false;
        if (dest) for (const url of (f.downloads || [])) {
          try {
            const uu = new URL(url); if (uu.protocol !== 'https:' || !MP_HOSTS.test(uu.hostname)) continue;
            const rr = await net.fetch(uu.href, { headers: { 'User-Agent': 'WINTEER/' + app.getVersion() } }); if (!rr.ok) continue;
            const b = Buffer.from(await rr.arrayBuffer());
            if (f.hashes && f.hashes.sha512 && crypto.createHash('sha512').update(b).digest('hex') !== f.hashes.sha512.toLowerCase()) continue;
            fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, b); ok = true; break;
          } catch (e) {}
        }
        if (!ok) failed.push(path.basename(String(f.path || '?')));
        done++; mcSend('Bajando mods… ' + done + '/' + files.length);
      }
    };
    await Promise.all([work(), work(), work(), work()]);
    const dep = idx.dependencies || {}; const ld = dep['fabric-loader'] ? 'fabric' : dep['quilt-loader'] ? 'quilt' : dep.neoforge ? 'neoforge' : dep.forge ? 'forge' : '';
    return { ok: true, name: idx.name || 'Modpack', mc: dep.minecraft || '', ld, count: files.length, failed: failed.slice(0, 20) };
  } catch (e) { return { ok: false, err: 'net' }; }
  finally { try { fs.unlinkSync(tmp); } catch (e) {} }
}
function mcNewRoot(name) {
  const n = String(name || 'Instancia').replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').trim().slice(0, 60) || 'Instancia';
  let base = path.join(app.getPath('documents'), 'WINTEER Minecraft', n), p = base, k = 2;
  while (fs.existsSync(p)) p = base + ' ' + (k++);
  fs.mkdirSync(p, { recursive: true }); return p;
}
/* ---------- nxm:// (botón «Descarga con gestor» de Nexus) ---------- */
let nxmPending = [];
function parseNxm(u) {
  const m = /^nxm:\/\/([a-z0-9_]+)\/mods\/(\d+)\/files\/(\d+)\?(.*)$/i.exec(String(u || '').trim()); if (!m) return null;
  const q = new URLSearchParams(m[4]); const key = q.get('key') || '', ex = q.get('expires') || '';
  if (!/^[A-Za-z0-9_-]{4,200}$/.test(key) || !/^\d{6,14}$/.test(ex)) return null;
  return { domain: m[1].toLowerCase(), mod: +m[2], file: +m[3], key, expires: ex };
}
function nxmArgv(argv) { for (const a of (argv || [])) if (/^nxm:\/\//i.test(a)) { const r = parseNxm(a); if (r) { nxmPending.push(r); nxmFlush(); } } }
function nxmFlush() { if (win && !win.isDestroyed() && nxmPending.length && win.webContents && !win.webContents.isLoading()) { for (const r of nxmPending.splice(0)) win.webContents.send('nxm', r); showWin(); } }

/* ---------- ventana sin bordes para juegos que no la tienen ---------- */
const BL_PS = 'JABFAHIAcgBvAHIAQQBjAHQAaQBvAG4AUAByAGUAZgBlAHIAZQBuAGMAZQA9ACcAUwBpAGwAZQBuAHQAbAB5AEMAbwBuAHQAaQBuAHUAZQAnAAoAQQBkAGQALQBUAHkAcABlACAALQBBAHMAcwBlAG0AYgBsAHkATgBhAG0AZQAgAFMAeQBzAHQAZQBtAC4AVwBpAG4AZABvAHcAcwAuAEYAbwByAG0AcwAKAEEAZABkAC0AVAB5AHAAZQAgAEAAIgAKAHUAcwBpAG4AZwAgAFMAeQBzAHQAZQBtADsAdQBzAGkAbgBnACAAUwB5AHMAdABlAG0ALgBSAHUAbgB0AGkAbQBlAC4ASQBuAHQAZQByAG8AcABTAGUAcgB2AGkAYwBlAHMAOwAKAHAAdQBiAGwAaQBjACAAYwBsAGEAcwBzACAAVwBUAHsACgBbAEQAbABsAEkAbQBwAG8AcgB0ACgAIgB1AHMAZQByADMAMgAuAGQAbABsACIAKQBdAHAAdQBiAGwAaQBjACAAcwB0AGEAdABpAGMAIABlAHgAdABlAHIAbgAgAGkAbgB0ACAARwBlAHQAVwBpAG4AZABvAHcATABvAG4AZwAoAEkAbgB0AFAAdAByACAAaAAsAGkAbgB0ACAAaQApADsACgBbAEQAbABsAEkAbQBwAG8AcgB0ACgAIgB1AHMAZQByADMAMgAuAGQAbABsACIAKQBdAHAAdQBiAGwAaQBjACAAcwB0AGEAdABpAGMAIABlAHgAdABlAHIAbgAgAGkAbgB0ACAAUwBlAHQAVwBpAG4AZABvAHcATABvAG4AZwAoAEkAbgB0AFAAdAByACAAaAAsAGkAbgB0ACAAaQAsAGkAbgB0ACAAdgApADsACgBbAEQAbABsAEkAbQBwAG8AcgB0ACgAIgB1AHMAZQByADMAMgAuAGQAbABsACIAKQBdAHAAdQBiAGwAaQBjACAAcwB0AGEAdABpAGMAIABlAHgAdABlAHIAbgAgAGIAbwBvAGwAIABTAGUAdABXAGkAbgBkAG8AdwBQAG8AcwAoAEkAbgB0AFAAdAByACAAaAAsAEkAbgB0AFAAdAByACAAYQAsAGkAbgB0ACAAeAAsAGkAbgB0ACAAeQAsAGkAbgB0ACAAdwAsAGkAbgB0ACAAYwAsAHUAaQBuAHQAIABmACkAOwAKAFsARABsAGwASQBtAHAAbwByAHQAKAAiAHUAcwBlAHIAMwAyAC4AZABsAGwAIgApAF0AcAB1AGIAbABpAGMAIABzAHQAYQB0AGkAYwAgAGUAeAB0AGUAcgBuACAAYgBvAG8AbAAgAFMAaABvAHcAVwBpAG4AZABvAHcAKABJAG4AdABQAHQAcgAgAGgALABpAG4AdAAgAGMAKQA7AAoAWwBEAGwAbABJAG0AcABvAHIAdAAoACIAdQBzAGUAcgAzADIALgBkAGwAbAAiACkAXQBwAHUAYgBsAGkAYwAgAHMAdABhAHQAaQBjACAAZQB4AHQAZQByAG4AIABiAG8AbwBsACAAUwBlAHQAUAByAG8AYwBlAHMAcwBEAFAASQBBAHcAYQByAGUAKAApADsACgB9AAoAIgBAAAoAWwB2AG8AaQBkAF0AWwBXAFQAXQA6ADoAUwBlAHQAUAByAG8AYwBlAHMAcwBEAFAASQBBAHcAYQByAGUAKAApAAoAJABlAHgAPQAkAGUAbgB2ADoAVwBUAF8ARQBYAEUAOwAkAGQAaQByAHMAPQBAACgAKQA7AGkAZgAoACQAZQBuAHYAOgBXAFQAXwBEAEkAUgApAHsAJABkAGkAcgBzAD0AJABlAG4AdgA6AFcAVABfAEQASQBSAC4AUwBwAGwAaQB0ACgAJwB8ACcAKQB9AAoAJABuAD0AMAAKAGYAbwByAGUAYQBjAGgAKAAkAHAAIABpAG4AIAAoAEcAZQB0AC0AUAByAG8AYwBlAHMAcwAgAHwAIABXAGgAZQByAGUALQBPAGIAagBlAGMAdAAgAHsAIAAkAF8ALgBNAGEAaQBuAFcAaQBuAGQAbwB3AEgAYQBuAGQAbABlACAALQBuAGUAIAAwACAAfQApACkAewAKACAAIAAkAHAAYQA9ACQAbgB1AGwAbAA7AHQAcgB5AHsAJABwAGEAPQAkAHAALgBQAGEAdABoAC4AVABvAEwAbwB3AGUAcgAoACkAfQBjAGEAdABjAGgAewB9AAoAIAAgAGkAZgAoAC0AbgBvAHQAIAAkAHAAYQApAHsAYwBvAG4AdABpAG4AdQBlAH0ACgAgACAAJABoAGkAdAA9ACQAZgBhAGwAcwBlADsAaQBmACgAJABlAHgAIAAtAGEAbgBkACAAJABwAGEAIAAtAGUAcQAgACQAZQB4ACkAewAkAGgAaQB0AD0AJAB0AHIAdQBlAH0AOwBmAG8AcgBlAGEAYwBoACgAJABkACAAaQBuACAAJABkAGkAcgBzACkAewBpAGYAKAAkAGQAIAAtAGEAbgBkACAAJABwAGEALgBTAHQAYQByAHQAcwBXAGkAdABoACgAJABkACkAKQB7ACQAaABpAHQAPQAkAHQAcgB1AGUAfQB9AAoAIAAgAGkAZgAoAC0AbgBvAHQAIAAkAGgAaQB0ACkAewBjAG8AbgB0AGkAbgB1AGUAfQAKACAAIAAkAGgAPQAkAHAALgBNAGEAaQBuAFcAaQBuAGQAbwB3AEgAYQBuAGQAbABlAAoAIAAgAFsAdgBvAGkAZABdAFsAVwBUAF0AOgA6AFMAaABvAHcAVwBpAG4AZABvAHcAKAAkAGgALAA5ACkACgAgACAAJABzAD0AWwBXAFQAXQA6ADoARwBlAHQAVwBpAG4AZABvAHcATABvAG4AZwAoACQAaAAsAC0AMQA2ACkAOwAkAHMAPQAkAHMAIAAtAGIAYQBuAGQAIAAoAC0AYgBuAG8AdAAgADAAeABDAEYAMAAwADAAMAApADsAWwB2AG8AaQBkAF0AWwBXAFQAXQA6ADoAUwBlAHQAVwBpAG4AZABvAHcATABvAG4AZwAoACQAaAAsAC0AMQA2ACwAJABzACkACgAgACAAJAB4AD0AWwBXAFQAXQA6ADoARwBlAHQAVwBpAG4AZABvAHcATABvAG4AZwAoACQAaAAsAC0AMgAwACkAOwAkAHgAPQAkAHgAIAAtAGIAYQBuAGQAIAAoAC0AYgBuAG8AdAAgADAAeAAyADAAMwAwADEAKQA7AFsAdgBvAGkAZABdAFsAVwBUAF0AOgA6AFMAZQB0AFcAaQBuAGQAbwB3AEwAbwBuAGcAKAAkAGgALAAtADIAMAAsACQAeAApAAoAIAAgACQAYgA9AFsAUwB5AHMAdABlAG0ALgBXAGkAbgBkAG8AdwBzAC4ARgBvAHIAbQBzAC4AUwBjAHIAZQBlAG4AXQA6ADoARgByAG8AbQBIAGEAbgBkAGwAZQAoACQAaAApAC4AQgBvAHUAbgBkAHMACgAgACAAWwB2AG8AaQBkAF0AWwBXAFQAXQA6ADoAUwBlAHQAVwBpAG4AZABvAHcAUABvAHMAKAAkAGgALABbAEkAbgB0AFAAdAByAF0AOgA6AFoAZQByAG8ALAAkAGIALgBYACwAJABiAC4AWQAsACQAYgAuAFcAaQBkAHQAaAAsACQAYgAuAEgAZQBpAGcAaAB0ACwAMAB4ADAAMAA2ADAAKQAKACAAIAAkAG4AKwArAAoAfQAKAFcAcgBpAHQAZQAtAE8AdQB0AHAAdQB0ACAAKAAiAGQAbwBuAGUAIAAiACsAJABuACkA';
function applyBl(t) {
  return new Promise((res) => {
    if (process.platform !== 'win32') return res(false);
    try {
      execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', BL_PS], { windowsHide: true, timeout: 20000, env: Object.assign({}, process.env, { WT_EXE: t.exe || '', WT_DIR: (t.dirs || []).join('|') }) }, (err, out) => {
        const m = /done (\d+)/.exec(out || ''); res(!!(m && +m[1] > 0));
      });
    } catch (e) { res(false); }
  });
}
function blStep(t) {
  if (!t.bl || !t.started || t.blRun || (t.blS || 0) >= 3) return;
  const el = Date.now() - t.started, due = [0, 8000, 25000], i = t.blS || 0;
  if (el < due[i]) return;
  t.blRun = 1;
  applyBl(t).then((ok) => { t.blRun = 0; if (ok) t.blS = i + 1; else if (el > 90000) t.blS = 3; });
}
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
    if (run) { t.miss = 0; if (!t.started) { t.started = Date.now(); send({ type: 'started', id, t: t.started }); } blStep(t); }
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
  track.set(o.id, { app: (!o.exe && o.app) ? o.app : 0, exe, dirs, since: Date.now(), started: 0, miss: 0, bl: !!o.borderless, vault: !!o.vault });
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

/* ===== Steam: biblioteca de la cuenta + juegos del grupo familiar ===== */
const STEAM_CFG_JS = "fetch('/pointssummary/ajaxgetasyncconfig',{credentials:'include'}).then(function(r){return r.text()}).catch(function(){return ''})";
function steamCfgParse(t) {
  t = String(t || ''); const i = t.indexOf('{'), k = t.lastIndexOf('}'); if (i < 0 || k < i) return null; t = t.slice(i, k + 1);
  let tok = '', id = '';
  try { const j = JSON.parse(t); const d = j.data || j; tok = String((d && d.webapi_token) || ''); id = String((d && d.steamid) || ''); } catch (e) { const m = /"webapi_token"\s*:\s*"([^"]+)"/.exec(t); if (m) tok = m[1]; }
  if (!tok) return null;
  if (!/^\d{15,20}$/.test(id)) { try { const pl = JSON.parse(Buffer.from(tok.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')); id = String(pl.sub || ''); } catch (e) { id = ''; } }
  return /^\d{15,20}$/.test(id) ? { tok, id } : null;
}
async function steamImport() {
  const diag = [];
  const cfg = await loginWin('https://store.steampowered.com/login/?redir=' + encodeURIComponent('pointssummary/ajaxgetasyncconfig') + '&redir_ssl=1', async (u, w) => {
    if (!/^https:\/\/store\.steampowered\.com\//.test(u) || /\/login/.test(u)) return null;
    const t = await w.webContents.executeJavaScript(STEAM_CFG_JS);
    return steamCfgParse(t);
  }, 'Steam · Iniciar sesión');
  if (!cfg) return { ok: false, cancel: true };
  const A = 'https://api.steampowered.com/', T = 'access_token=' + encodeURIComponent(cfg.tok);
  const map = new Map();
  const own = await jreq(A + 'IPlayerService/GetOwnedGames/v1/?' + T + '&steamid=' + cfg.id + '&include_appinfo=1&include_played_free_games=1&language=spanish');
  const og = own.json && own.json.response && own.json.response.games;
  diag.push('propios ' + own.status + ' ' + (og ? og.length : 0));
  (og || []).forEach((x) => map.set(+x.appid, { appid: +x.appid, name: x.name, min: x.playtime_forever || 0, last: x.rtime_last_played || 0, own: true }));
  let fam = 0;
  try {
    const fg = await jreq(A + 'IFamilyGroupsService/GetFamilyGroupForUser/v1/?' + T + '&steamid=' + cfg.id);
    const gid = fg.json && fg.json.response && fg.json.response.family_groupid;
    diag.push('grupo ' + fg.status + ' ' + (gid || 'no'));
    if (gid) {
      const sh = await jreq(A + 'IFamilyGroupsService/GetSharedLibraryApps/v1/?' + T + '&family_groupid=' + gid + '&steamid=' + cfg.id + '&include_own=true&include_excluded=true&include_free=true&include_non_games=false&language=spanish');
      const ap = sh.json && sh.json.response && sh.json.response.apps;
      diag.push('compartidos ' + sh.status + ' ' + (ap ? ap.length : 0));
      (ap || []).forEach((x) => { const id = +x.appid; if (!id) return; if (!map.has(id)) { map.set(id, { appid: id, name: x.name || ('Juego ' + id), min: 0, last: 0, own: false }); fam++; } });
    }
  } catch (e) { diag.push('familia error ' + e); }
  if (!map.size) return { ok: false, err: 'Steam no devolvió ningún juego (si el perfil tiene los detalles de juego privados puede pasar).', diag: diag.join(' | ') };
  return { ok: true, list: [...map.values()], fam, diag: diag.join(' | ') };
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
  /* prueba de vida: se vuelve a leer lo que quedó en el disco y tiene que coincidir con lo que se mandó */
  const back = fs.readFileSync(f, 'utf8');
  if (back.length !== json.length) throw new Error('La copia quedó incompleta (se escribió ' + back.length + ' de ' + json.length + ' caracteres)');
  JSON.parse(back);
  return f;
}
/* estado de la carpeta y del archivo de copias (sin escribir nada importante) */

function bkRead(dir) {
  const f = path.join(String(dir || ''), 'WINTEER-copia.json'); let st; try { st = fs.statSync(f); } catch (e) { return { ok: false, err: 'nofile' }; }
  if (!st.size) return { ok: false, err: 'empty' };
  let t; try { t = fs.readFileSync(f, 'utf8'); const j = JSON.parse(t); if (!j || !j.winteer2) return { ok: false, err: 'bad' }; } catch (e) { return { ok: false, err: 'bad' }; }
  let games = 0; try { games = fs.readdirSync(path.join(dir, 'Partidas'), { withFileTypes: true }).filter(d => d.isDirectory()).length; } catch (e) {}
  return { ok: true, json: t, mtime: st.mtimeMs, games };
}
function bkCheck({ dir, deep }) {
  const out = { ok: false, err: '', exists: false, bytes: 0, mtime: 0, free: -1, games: 0 };
  try {
    if (!dir) { out.err = 'No hay una carpeta de copias elegida'; return out; }
    if (!fs.existsSync(dir)) { out.err = 'La carpeta de copias no existe (¿se desconectó el disco o el pendrive?)'; return out; }
    try { const t = path.join(dir, '.wt-prueba'); fs.writeFileSync(t, 'x'); fs.unlinkSync(t); } catch (e) { out.err = 'No se puede escribir en la carpeta de copias'; return out; }
    try { const s = fs.statfsSync(dir); out.free = Number(s.bavail) * Number(s.bsize); } catch (e) {}
    const f = path.join(dir, 'WINTEER-copia.json');
    if (!fs.existsSync(f)) { out.err = 'Todavía no hay ningún archivo de copia'; return out; }
    const st = fs.statSync(f); out.exists = true; out.bytes = st.size; out.mtime = st.mtimeMs;
    if (!st.size) { out.err = 'El archivo de copia está vacío'; return out; }
    if (deep) {
      let j; try { j = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { out.err = 'El archivo de copia está dañado y no se puede abrir'; return out; }
      if (!j || typeof j !== 'object' || !j.winteer2) { out.err = 'El archivo de copia no tiene tus datos adentro'; return out; }
      try { const s = JSON.parse(j.winteer2); out.games = Array.isArray(s.G) ? s.G.length : (Array.isArray(s.games) ? s.games.length : 0); } catch (e) { out.err = 'Los datos de la copia están dañados'; return out; }
    }
    if (out.free >= 0 && out.free < st.size * 3 + 50 * 1024 * 1024) { out.err = 'Queda poco lugar libre en el disco de las copias'; return out; }
    out.ok = true; return out;
  } catch (e) { out.err = String((e && e.message) || e).slice(0, 120); return out; }
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
async function igdbVid({ id, secret, name, app }) {
  const nrm = (x) => (x || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  let gid = 0;
  if (app) {
    for (const cond of ['external_game_source = 1', 'category = 1']) {
      try { const ex = await igq(id, secret, 'external_games', `fields game; where uid = "${app}" & ${cond}; limit 1;`); if (ex[0] && ex[0].game) gid = ex[0].game; break; }
      catch (e) { if (String(e.message) === 'auth') throw e; }
    }
  }
  if (!gid) {
    const n = (name || '').replace(/[™®©]/g, '').replace(/"/g, '').trim(), n0 = nrm(n);
    const r = await igq(id, secret, 'games', `search "${n}"; fields name; limit 8;`);
    const g = r.find(x => nrm(x.name) === n0) || r.find(x => nrm(x.name).startsWith(n0) || n0.startsWith(nrm(x.name)));
    if (g) gid = g.id;
  }
  if (!gid) return { v: '' };
  const r = await igq(id, secret, 'games', `fields videos.video_id,videos.name; where id = ${gid}; limit 1;`);
  const vs = (r[0] && r[0].videos) || [];
  const pick = vs.find(v => /trailer|launch|release/i.test(v.name || '')) || vs[0];
  return { v: pick ? pick.video_id : '' };
}
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
  try {
    win.webContents.session.setDisplayMediaRequestHandler((_req, cb) => {
      desktopCapturer.getSources({ types: ['screen', 'window'] }).then(srcs => {
        const s = srcs.find(x => x.id === scrPickId) || srcs.find(x => /^screen/.test(x.id)) || srcs[0];
        const au = scrPickAudio; scrPickId = null; scrPickAudio = false;
        if (!s) { cb({}); return; }
        cb(au && process.platform === 'win32' ? { video: s, audio: 'loopback' } : { video: s });
      }).catch(() => cb({}));
    });
  } catch (e) {}
  Menu.setApplicationMenu(null);
  const wst = () => send({ type: 'wst', max: win.isMaximized(), fs: win.isFullScreen() });
  ['maximize', 'unmaximize', 'enter-full-screen', 'leave-full-screen', 'restore'].forEach(e => win.on(e, wst));
  win.webContents.on('did-finish-load', wst);
  try { win.setIcon(path.join(__dirname, process.platform === 'win32' ? 'icon.ico' : 'icon.png')); } catch (e) {}
  win.loadFile(betaPage() || path.join(__dirname, 'index.html'));
  win.once('ready-to-show', () => { if (!(startHidden && cfg.bg && !win.__shown)) { win.maximize(); win.show(); } win.__shown = true; if (process.env.WINTEER_TEST) win.webContents.openDevTools({ mode: 'detach' }); });
  for (const ev of ['show', 'restore', 'focus', 'maximize', 'unmaximize']) win.on(ev, () => { try { win.webContents.setBackgroundThrottling(false); win.webContents.invalidate(); } catch (x) {} });
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
/* canal Beta: solo si el usuario lo activa (se desbloquea tocando 5 veces la versión en Ajustes). Las betas se publican en un release fijo "beta" que la versión normal nunca mira. */
const BETA_URL = 'https://github.com/elwinteer/static-assets/releases/download/beta';
function updFeed(on) { try { if (!autoUpdater) return; autoUpdater.setFeedURL(on ? { provider: 'generic', url: BETA_URL, channel: 'latest' } : { provider: 'github', owner: 'elwinteer', repo: 'static-assets', releaseType: 'release' }); } catch (e) {} }
const updSend = (o) => { updState = Object.assign(updState, o); send(Object.assign({ type: 'upd' }, updState)); };
function updCheck() { try { if (autoUpdater) autoUpdater.checkForUpdates().catch(() => {}); } catch (e) {} }
function setupUpdater() {
  if (!app.isPackaged) return;
  try { autoUpdater = require('electron-updater').autoUpdater; } catch (e) { return; }
  autoUpdater.autoDownload = true; autoUpdater.autoInstallOnAppQuit = true; autoUpdater.logger = null;
  autoUpdater.channel = 'latest'; autoUpdater.allowPrerelease = false; autoUpdater.allowDowngrade = false;
  if (cfg.beta) updFeed(true);
  autoUpdater.on('checking-for-update', () => updSend({ s: 'checking', e: '' }));
  autoUpdater.on('update-available', (i) => updSend({ s: 'downloading', v: i.version, p: 0 }));
  autoUpdater.on('update-not-available', () => updSend({ s: 'none' }));
  autoUpdater.on('download-progress', (p) => updSend({ s: 'downloading', p: Math.round(p.percent || 0) }));
  autoUpdater.on('update-downloaded', (i) => updSend({ s: 'ready', v: i.version }));
  autoUpdater.on('error', (e) => updSend({ s: 'error', e: String((e && e.message) || e).slice(0, 140) }));
  setInterval(updCheck, 4 * 3600e3);
}
ipcMain.handle('updInfo', () => Object.assign({ ver: app.getVersion(), packaged: app.isPackaged, beta: !!cfg.beta }, updState));
ipcMain.handle('betaSet', (_e, on) => { cfg.beta = !!on; saveCfg(); updFeed(cfg.beta); updSend({ s: 'idle', e: '' }); updCheck(); return cfg.beta; });
ipcMain.handle('updCheck', () => { updCheck(); return true; });
ipcMain.handle('updInstall', () => { installNow(); });


/* ---------- arranque con actualización (estilo Discord) ---------- */
let splashWin = null, pendingInstall = false;
function splashHtml() {
  const arms = [0, 60, 120, 180, 240, 300].map((d) => `<g transform="rotate(${d})"><path d="M0 -7V-30M0 -17L-7.5 -24.5M0 -17L7.5 -24.5M0 -23.5L-4.5 -28M0 -23.5L4.5 -28"/></g>`).join('');
  const flake = `<svg viewBox="-34 -34 68 68" class="fk"><defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="-26" y1="-30" x2="26" y2="30"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#d6d6dc"/><stop offset="1" stop-color="#8f8f9b"/></linearGradient></defs><g fill="none" stroke="url(#g)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${arms}<path d="M0 -7L6 -3.5V3.5L0 7L-6 3.5V-3.5Z" stroke-width="1.8"/></g></svg>`;
  const dots = Array.from({ length: 22 }, (_, i) => `<u style="left:${(i * 47 + 9) % 100}%;--d:${6 + (i * 7) % 9}s;--s:${(i * 13) % 7 - 3}s;--z:${1 + (i % 3)}px"></u>`).join('');
  return `<html><head><meta charset="utf-8"><style>
*{box-sizing:border-box}html,body{margin:0;height:100%;overflow:hidden;background:transparent;font-family:'Segoe UI',system-ui,sans-serif;-webkit-user-select:none}
.c{position:absolute;inset:6px;border-radius:28px;overflow:hidden;-webkit-app-region:drag;background:radial-gradient(380px 240px at 50% 0%,rgba(255,255,255,.09),transparent 70%),linear-gradient(180deg,#121214,#08080a);box-shadow:0 0 0 1px rgba(255,255,255,.1),inset 0 1px 0 rgba(255,255,255,.2);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;animation:in .7s cubic-bezier(.2,1,.3,1)}
@keyframes in{from{opacity:0;transform:scale(.96)}}
u{position:absolute;top:-6px;width:var(--z);height:var(--z);border-radius:50%;background:rgba(255,255,255,.55);animation:sn var(--d) linear infinite;animation-delay:var(--s);opacity:.0}
@keyframes sn{0%{transform:translateY(0);opacity:0}10%{opacity:.7}100%{transform:translateY(340px);opacity:0}}
.mk{position:relative;width:104px;height:104px;display:grid;place-items:center;margin-bottom:14px}
.mk::before{content:"";position:absolute;inset:-14px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.2),transparent 68%);animation:pu 3.2s ease-in-out infinite alternate}
@keyframes pu{from{opacity:.45;transform:scale(.92)}to{opacity:1;transform:scale(1.06)}}
.rg{position:absolute;inset:0;width:100%;height:100%;animation:sp 9s linear infinite}@keyframes sp{to{transform:rotate(360deg)}}
.rg circle{fill:none;stroke:rgba(255,255,255,.14);stroke-width:1;stroke-dasharray:2 5}
.fk{position:relative;width:70px;height:70px;filter:drop-shadow(0 0 10px rgba(255,255,255,.35));animation:fl 3.4s ease-in-out infinite alternate}@keyframes fl{to{transform:translateY(-4px) rotate(8deg)}}
h1{margin:0;font-size:19px;letter-spacing:.5em;font-weight:300;padding-left:.5em;background:linear-gradient(180deg,#fff,#b4b4bc);-webkit-background-clip:text;color:transparent}
.ln{width:120px;height:1px;margin:14px 0 12px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent)}
p{margin:0;font-size:12.5px;color:#9a9aa3;height:18px;letter-spacing:.02em}
.b{width:220px;height:3px;border-radius:9px;background:rgba(255,255,255,.1);overflow:hidden;margin-top:14px}
.b i{display:block;height:100%;width:34%;border-radius:9px;background:linear-gradient(90deg,rgba(255,255,255,.2),#fff);animation:ind 1.5s ease-in-out infinite}
.b.d i{animation:none;width:var(--w,0%);transition:width .35s cubic-bezier(.2,.8,.2,1);background:linear-gradient(90deg,#8f8f9b,#fff)}
@keyframes ind{0%{margin-left:-34%}100%{margin-left:100%}}
</style></head><body><div class="c">${dots}<div class="mk"><svg viewBox="0 0 100 100" class="rg"><circle cx="50" cy="50" r="48"/></svg>${flake}</div><h1>WINTEER</h1><div class="ln"></div><p id="t">Buscando actualizaciones…</p><div class="b" id="b"><i id="i"></i></div></div></body></html>`;
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

/* ===== Maquina del tiempo de partidas: copias con versiones de los saves (no Steam) ===== */
const tmSan = id => String(id).replace(/[^\w.-]/g, '_');
const tmRoot = d => (d && String(d).trim()) ? String(d) : path.join(app.getPath('userData'), 'partidas');
const tmStamp = (d) => { const p = n => String(n).padStart(2, '0'); d = d || new Date(); return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + 'T' + p(d.getHours()) + '-' + p(d.getMinutes()) + '-' + p(d.getSeconds()); };
function tmWalk(p, base, out, lim) {
  let st; try { st = fs.lstatSync(p); } catch (e) { return out; }
  if (st.isSymbolicLink()) return out;
  if (st.isFile()) { out.push({ rel: base || path.basename(p), size: st.size, m: st.mtimeMs }); return out; }
  if (!st.isDirectory()) return out;
  let ls = []; try { ls = fs.readdirSync(p); } catch (e) { return out; }
  for (const f of ls) { if (out.length > lim) break; tmWalk(path.join(p, f), (base ? base + '/' : '') + f, out, lim); }
  return out;
}
function tmEnv(o) {
  const e = process.env, home = e.USERPROFILE || os.homedir();
  return Object.assign({ appdata: e.APPDATA || path.join(home, 'AppData', 'Roaming'), local: e.LOCALAPPDATA || path.join(home, 'AppData', 'Local'), docs: (() => { try { return app.getPath('documents'); } catch (x) { return path.join(home, 'Documents'); } })(), home, user: e.USERNAME || os.userInfo().username, pub: e.PUBLIC || 'C:\\Users\\Public', pdata: e.ProgramData || 'C:\\ProgramData' }, o || {});
}
const tmNorm = s => String(s || '').toLowerCase().replace(/\(.*?\)|\[.*?\]/g, ' ').replace(/[^a-z0-9]/g, '');
function tmGlob(p) {
  const parts = p.replace(/\\/g, '/').split('/'); let cur = [parts[0] === '' ? '/' : parts[0]];
  if (/^[A-Za-z]:$/.test(parts[0])) cur = [parts[0] + '/'];
  for (let i = 1; i < parts.length; i++) {
    const seg = parts[i]; if (seg === '') continue; const next = [];
    if (/[*?]/.test(seg)) {
      const re = new RegExp('^' + seg.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$', 'i');
      for (const b of cur) { let ls = []; try { ls = fs.readdirSync(b); } catch (e) {} for (const f of ls) if (re.test(f)) next.push(path.join(b, f)); }
    } else for (const b of cur) { const q = path.join(b, seg); if (fs.existsSync(q)) next.push(q); }
    cur = next.slice(0, 40); if (!cur.length) break;
  }
  return cur;
}
/* lector minimo del manifiesto de Ludusavi (YAML): solo toma lo de los juegos pedidos */
function lsParse(text, wanted, stores) {
  const out = []; let cur = null, sec = '', ent = null, wb = null;
  const unq = s => { s = s.trim(); if (s[0] === '"') { const m = s.match(/^"((?:[^"\\]|\\.)*)"/); return m ? m[1].replace(/\\(.)/g, '$1') : s; } if (s[0] === "'") { const m = s.match(/^'([^']*)'/); return m ? m[1] : s; } return s.replace(/:\s*(\{\}|)$/, '').trim(); };
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i].replace(/\r$/, ''); if (!ln || ln[0] === '#') continue;
    const ind = ln.length - ln.trimStart().length, t = ln.trim();
    if (ind === 0) { const k = unq(t.replace(/:\s*$/, '')); const nk = tmNorm(k); cur = wanted.has(nk) ? { name: k, files: [], install: [] } : null; if (cur) out.push(cur); sec = ''; ent = null; continue; }
    if (!cur) continue;
    if (ind === 2) { sec = t.startsWith('files:') ? 'files' : t.startsWith('installDir:') ? 'install' : ''; ent = null; continue; }
    if (sec === 'install' && ind === 4) { cur.install.push(unq(t)); continue; }
    if (sec !== 'files') continue;
    if (ind === 4) { ent = { p: unq(t.replace(/:\s*$/, '')), tags: [], when: [] }; cur.files.push(ent); wb = null; continue; }
    if (!ent) continue;
    if (ind === 6) { wb = t.startsWith('tags:') ? 'tags' : t.startsWith('when:') ? 'when' : ''; continue; }
    if (wb === 'tags' && t.startsWith('- ')) ent.tags.push(t.slice(2).trim());
    else if (wb === 'when') { if (t.startsWith('- ')) { ent.when.push({}); const kv = t.slice(2).match(/^(\w+):\s*(.*)$/); if (kv) ent.when[ent.when.length - 1][kv[1]] = kv[2].trim(); } else { const kv = t.match(/^(\w+):\s*(.*)$/); if (kv && ent.when.length) ent.when[ent.when.length - 1][kv[1]] = kv[2].trim(); } }
  }
  return out.map(g => { g.files = g.files.filter(f => (!f.tags.length || f.tags.includes('save')) && (!f.when.length || f.when.some(w => (!w.os || w.os === 'windows') && (!w.store || stores.includes(w.store))))); return g; });
}
function lsExpand(pat, env, base, game) {
  let p = pat; const map = { '<winAppData>': env.appdata, '<winLocalAppData>': env.local, '<winDocuments>': env.docs, '<winPublic>': env.pub, '<winProgramData>': env.pdata, '<home>': env.home, '<osUserName>': env.user, '<storeUserId>': '*', '<storeGameId>': '*', '<winLocalAppDataLow>': path.join(env.local, '..', 'LocalLow') };
  if (base) { map['<base>'] = base; map['<root>'] = path.dirname(base); }
  if (game) map['<game>'] = game;
  for (const k of Object.keys(map)) p = p.split(k).join(map[k]);
  return /<\w+>/.test(p) ? '' : p;
}
const tmDirSize = (p) => tmWalk(p, '', [], 60000).reduce((a, f) => a + f.size, 0);
function tmFindHeur(o, env) {
  const nm = String(o.name || ''), exe = String(o.exe || ''), base = exe ? path.dirname(exe) : '';
  const names = [...new Set([nm, nm.replace(/[:™®©]/g, ''), nm.replace(/[^\w ]/g, '').trim(), exe ? path.basename(exe, path.extname(exe)).replace(/[-_ ]?(Win64|Win32|Shipping|x64|x86)/gi, '') : ''].filter(x => x && x.length > 2))];
  const roots = [[path.join(env.docs, 'My Games'), 'Documentos/My Games'], [env.docs, 'Documentos'], [path.join(env.home, 'Saved Games'), 'Saved Games'], [env.local, 'AppData Local'], [env.appdata, 'AppData Roaming'], [path.join(env.local, '..', 'LocalLow'), 'AppData LocalLow']];
  const out = [], seen = new Set(), add = (p, why) => { const k = p.toLowerCase(); if (seen.has(k)) return; try { if (!fs.existsSync(p)) return; } catch (e) { return; } seen.add(k); out.push({ p, why }); };
  for (const [r, w] of roots) for (const n of names) {
    add(path.join(r, n), w);
    add(path.join(r, n, 'Saved', 'SaveGames'), w + ' (Unreal)'); add(path.join(r, n, 'Saved'), w + ' (Unreal)');
  }
  if (base) for (const s of ['Saves', 'Save', 'SaveGames', 'savegames', 'savedata', 'saves', 'Savegame']) add(path.join(base, s), 'Carpeta del juego');
  return out;
}
async function tmFind(o) {
  const env = tmEnv(), out = tmFindHeur(o, env);
  const base = o.exe ? path.dirname(o.exe) : '';
  try {
    const mf = path.join(app.getPath('userData'), 'ludusavi.yaml'); let st = null; try { st = fs.statSync(mf); } catch (e) {}
    if (o.online && (!st || Date.now() - st.mtimeMs > 30 * 864e5)) {
      try { const r = await net.fetch('https://raw.githubusercontent.com/mtkennerly/ludusavi-manifest/master/data/manifest.yaml', { headers: { 'user-agent': UA } }); if (r.ok) { fs.writeFileSync(mf, await r.text()); st = fs.statSync(mf); } } catch (e) {}
    }
    if (st) {
      const g = lsParse(fs.readFileSync(mf, 'utf8'), new Set([tmNorm(o.name)]), ['epic', 'microsoft', 'other']);
      const seen = new Set(out.map(x => x.p.toLowerCase()));
      for (const e of g) for (const f of e.files) for (const gm of (e.install.length ? e.install : [''])) {
        const ex = lsExpand(f.p, env, base, gm); if (!ex) continue;
        for (const q of tmGlob(ex)) { if (!seen.has(q.toLowerCase())) { seen.add(q.toLowerCase()); out.push({ p: q, why: 'Base de datos de partidas' }); } }
      }
    }
  } catch (e) {}
  return out.slice(0, 12).map(x => { const w = tmWalk(x.p, '', [], 5000); return Object.assign(x, { size: w.reduce((a, f) => a + f.size, 0), files: w.length, m: w.reduce((a, f) => Math.max(a, f.m), 0) }); }).filter(x => x.files > 0);
}
function tmVers(id, dir) {
  const gd = path.join(tmRoot(dir), tmSan(id)), out = [];
  let ls = []; try { ls = fs.readdirSync(gd); } catch (e) { return out; }
  for (const v of ls) { if (!/^\d{4}-\d\d-\d\dT\d\d-\d\d-\d\d/.test(v)) continue; try { const m = JSON.parse(fs.readFileSync(path.join(gd, v, 'meta.json'), 'utf8')); out.push(Object.assign({ v }, m)); } catch (e) {} }
  return out.sort((a, b) => b.t - a.t);
}
function tmSnap(o) {
  const id = o.id, paths = (o.paths || []).map(String).filter(Boolean).slice(0, 8);
  if (!id || !paths.length) return { ok: false, err: 'No hay carpetas de partidas elegidas' };
  const lists = paths.map(p => tmWalk(p, '', [], 50000));
  const tot = lists.flat(); if (!tot.length) return { ok: false, err: 'No encuentro archivos en la carpeta de partidas' };
  const size = tot.reduce((a, f) => a + f.size, 0); if (size > 2e9 || tot.length > 50000) return { ok: false, err: 'La carpeta es demasiado grande para copiarla (más de 2 GB)' };
  const sig = crypto.createHash('sha1').update(lists.map((l, i) => l.map(f => i + '|' + f.rel + '|' + f.size + '|' + Math.floor(f.m / 1000)).sort().join('\n')).join('##')).digest('hex');
  const vers = tmVers(id, o.dir);
  if (!o.force && vers[0] && vers[0].sig === sig) return { ok: true, skipped: true };
  const root = tmRoot(o.dir), gd = path.join(root, tmSan(id)); let v = tmStamp(), n = 1; while (fs.existsSync(path.join(gd, v))) v = tmStamp() + '-' + (n++);
  const vd = path.join(gd, v);
  try {
    fs.mkdirSync(vd, { recursive: true });
    paths.forEach((p, i) => { let st; try { st = fs.statSync(p); } catch (e) { return; } if (st.isDirectory()) fs.cpSync(p, path.join(vd, 'p' + i), { recursive: true }); else { fs.mkdirSync(path.join(vd, 'p' + i), { recursive: true }); fs.copyFileSync(p, path.join(vd, 'p' + i, path.basename(p))); } });
    fs.writeFileSync(path.join(vd, 'meta.json'), JSON.stringify({ t: Date.now(), label: String(o.label || 'Manual').slice(0, 40), paths, sig, size, files: tot.length, pin: false, kinds: paths.map(p => { try { return fs.statSync(p).isDirectory() ? 'd' : 'f'; } catch (e) { return 'd'; } }), name: String(o.name || '').slice(0, 80) }));
  } catch (e) { try { fs.rmSync(vd, { recursive: true, force: true }); } catch (x) {} return { ok: false, err: /ENOSPC/.test(String(e.message)) ? 'El disco de destino está lleno' : /EPERM|EACCES/.test(String(e.message)) ? 'No hay permiso para escribir en la carpeta de destino' : String(e.message || e) }; }
  const keep = Math.max(3, Math.min(100, +o.keep || 15)), all = tmVers(id, o.dir).filter(x => !x.pin);
  all.slice(keep).forEach(x => { try { fs.rmSync(path.join(gd, x.v), { recursive: true, force: true }); } catch (e) {} });
  return { ok: true, v };
}
function tmRestore(o) {
  if (track.has(o.id)) return { ok: false, err: 'Cerrá el juego antes de restaurar' };
  const vd = path.join(tmRoot(o.dir), tmSan(o.id), String(o.v || '').replace(/[^\w.-]/g, '_'));
  let meta; try { meta = JSON.parse(fs.readFileSync(path.join(vd, 'meta.json'), 'utf8')); } catch (e) { return { ok: false, err: 'No encuentro esa versión' }; }
  const safe = tmSnap({ id: o.id, paths: meta.paths, dir: o.dir, label: 'Antes de restaurar', force: true, keep: o.keep, name: meta.name });
  if (!safe.ok && !/No encuentro archivos|No hay carpetas/.test(safe.err || '')) return { ok: false, err: 'No pude guardar una copia de seguridad antes: ' + safe.err };
  try {
    meta.paths.forEach((p, i) => {
      const src = path.join(vd, 'p' + i); if (!fs.existsSync(src)) return;
      const isDir = (meta.kinds || [])[i] !== 'f';
      if (isDir) { fs.mkdirSync(p, { recursive: true }); for (const f of fs.readdirSync(p)) fs.rmSync(path.join(p, f), { recursive: true, force: true }); fs.cpSync(src, p, { recursive: true }); }
      else { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.copyFileSync(path.join(src, fs.readdirSync(src)[0]), p); }
    });
  } catch (e) { return { ok: false, err: 'No pude restaurar: ' + String(e.message || e) + '. Tu copia de seguridad previa quedó guardada.' }; }
  return { ok: true };
}
function tmDel(o) { const vd = path.join(tmRoot(o.dir), tmSan(o.id), String(o.v || '').replace(/[^\w.-]/g, '_')); if (!/\d{4}-\d\d-\d\dT/.test(path.basename(vd))) return { ok: false }; try { fs.rmSync(vd, { recursive: true, force: true }); return { ok: true }; } catch (e) { return { ok: false }; } }
function tmPin(o) { const f = path.join(tmRoot(o.dir), tmSan(o.id), String(o.v || '').replace(/[^\w.-]/g, '_'), 'meta.json'); try { const m = JSON.parse(fs.readFileSync(f, 'utf8')); m.pin = !!o.pin; fs.writeFileSync(f, JSON.stringify(m)); return { ok: true }; } catch (e) { return { ok: false }; } }

/* ===== Pasarle el mundo: empaqueta una carpeta de partida, la recibe del otro lado y la desempaqueta ===== */
const WTX = new Map(), WTR = new Map();
const wtSan = s => String(s || '').replace(/[\\/:*?"<>|\x00-\x1f]/g, '_').replace(/^\.+/, '').trim().slice(0, 80) || 'mundo';
function wtRoots() { const e = tmEnv(); return { pz: path.join(e.home, 'Zomboid', 'Saves'), mc: path.join(e.appdata, '.minecraft', 'saves') }; }
function worldList() {
  const R = wtRoots(), out = [], dirs = p => { try { return fs.readdirSync(p, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name); } catch (e) { return []; } };
  const add = (o) => { const w = tmWalk(o.dir, '', [], 4000); if (!w.length) return; out.push(Object.assign(o, { size: w.reduce((a, f) => a + f.size, 0), m: w.reduce((a, f) => Math.max(a, f.m), 0) })); };
  for (const mode of dirs(R.pz)) for (const w of dirs(path.join(R.pz, mode))) add({ game: 'Project Zomboid', kind: 'pz', mode, name: w, dir: path.join(R.pz, mode, w) });
  for (const w of dirs(R.mc)) add({ game: 'Minecraft', kind: 'mc', mode: '', name: w, dir: path.join(R.mc, w) });
  return out.sort((a, b) => b.m - a.m).slice(0, 60);
}
async function worldPack(o) {
  if (track.size > 0) return { ok: false, err: 'Cerrá el juego antes de empaquetar el mundo' };
  const dir = String(o.dir || ''); let st; try { st = fs.statSync(dir); } catch (e) { return { ok: false, err: 'No encuentro esa carpeta' }; }
  if (!st.isDirectory()) return { ok: false, err: 'Elegí una carpeta' };
  const files = tmWalk(dir, '', [], 100000); if (!files.length) return { ok: false, err: 'La carpeta está vacía' };
  const raw = files.reduce((a, f) => a + f.size, 0); if (raw > 1.5e9) return { ok: false, err: 'El mundo pesa más de 1,5 GB: es demasiado para mandarlo así' };
  const id = crypto.randomBytes(6).toString('hex'), tmp = path.join(app.getPath('temp'), 'wt-' + id + '.gz');
  const hdr = Buffer.from(JSON.stringify({ v: 1, name: wtSan(o.name || path.basename(dir)), kind: ['pz', 'mc'].includes(o.kind) ? o.kind : '', mode: wtSan(o.mode || ''), files: files.map(f => ({ p: f.rel, s: f.size })) })), len = Buffer.alloc(4); len.writeUInt32BE(hdr.length);
  const gz = zlib.createGzip({ level: 3 }), out = fs.createWriteStream(tmp), hash = crypto.createHash('sha1');
  gz.on('data', d => hash.update(d)); gz.pipe(out);
  const done = new Promise((res, rej) => { out.on('finish', res); out.on('error', rej); gz.on('error', rej); });
  try {
    gz.write(len); gz.write(hdr);
    for (const f of files) {
      let n = 0; const fp = path.join(dir, ...f.rel.split('/'));
      if (f.size > 0) await new Promise((res, rej) => { const rs = fs.createReadStream(fp, { start: 0, end: f.size - 1 }); rs.on('data', d => { n += d.length; }); rs.on('error', rej); rs.on('end', res); rs.pipe(gz, { end: false }); });
      if (n !== f.size) throw new Error('El mundo cambió mientras lo empaquetaba. Cerrá el juego y probá de nuevo');
    }
    gz.end(); await done;
  } catch (e) { try { gz.destroy(); out.destroy(); fs.unlinkSync(tmp); } catch (x) {} return { ok: false, err: String(e.message || e) }; }
  const size = fs.statSync(tmp).size, sha = hash.digest('hex');
  WTX.set(id, { file: tmp, size }); return { ok: true, id, size, raw, files: files.length, sha, name: wtSan(o.name || path.basename(dir)) };
}
function worldRead(o) { const x = WTX.get(o.id); if (!x) return null; const fd = fs.openSync(x.file, 'r'); try { const b = Buffer.alloc(Math.min(1 << 20, Math.max(0, +o.len || 0))); const n = fs.readSync(fd, b, 0, b.length, +o.off || 0); return b.subarray(0, n); } finally { fs.closeSync(fd); } }
function worldDrop(id) { const x = WTX.get(id); if (x) { try { fs.unlinkSync(x.file); } catch (e) {} WTX.delete(id); } const r = WTR.get(id); if (r) { try { fs.closeSync(r.fd); } catch (e) {} try { fs.unlinkSync(r.file); } catch (e) {} WTR.delete(id); } return true; }
function worldRecvOpen(o) { const id = String(o.id || '').replace(/[^\w]/g, ''); if (!id) return false; const file = path.join(app.getPath('temp'), 'wtr-' + id + '.gz'); WTR.set(id, { file, fd: fs.openSync(file, 'w'), n: 0 }); return true; }
function worldRecvChunk(o) { const r = WTR.get(String(o.id)); if (!r) return false; const b = Buffer.from(o.buf); fs.writeSync(r.fd, b, 0, b.length); r.n += b.length; return true; }
function worldUnpack(file, root) {
  return new Promise((resolve) => {
    let buf = Buffer.alloc(0), st = 0, hdr = null, fi = 0, left = 0, ws = null, dest = null, fail = '', total = 0;
    const gu = zlib.createGunzip(), rs = fs.createReadStream(file);
    const bail = (m) => { if (fail) return; fail = m; try { rs.destroy(); gu.destroy(); if (ws) ws.destroy(); } catch (e) {} resolve({ ok: false, err: m }); };
    const next = () => { // abre el archivo siguiente (los vacios se crean aca)
      while (hdr && fi < hdr.files.length) {
        const f = hdr.files[fi], parts = String(f.p).split('/'); if (parts.some(p => !p || p === '..' || /[:\\]/.test(p) || path.isAbsolute(p))) { bail('Archivo con ruta inválida'); return false; }
        const t = path.join(dest, ...parts); if (!t.startsWith(dest + path.sep)) { bail('Archivo con ruta inválida'); return false; }
        fs.mkdirSync(path.dirname(t), { recursive: true });
        if (f.s === 0) { fs.writeFileSync(t, ''); fi++; continue; }
        ws = fs.createWriteStream(t); left = f.s; return true;
      }
      return false;
    };
    gu.on('data', chunk => {
      if (fail) return; buf = buf.length ? Buffer.concat([buf, chunk]) : chunk;
      for (;;) {
        if (st === 0) { if (buf.length < 4) return; const n = buf.readUInt32BE(0); if (n > 8e6) return bail('Archivo dañado'); st = 1; hdr = { n }; buf = buf.subarray(4); }
        if (st === 1) {
          if (buf.length < hdr.n) return; let h; try { h = JSON.parse(buf.subarray(0, hdr.n).toString('utf8')); } catch (e) { return bail('Archivo dañado'); }
          buf = buf.subarray(hdr.n); hdr = h; if (!Array.isArray(hdr.files) || hdr.files.length > 200000) return bail('Archivo dañado');
          const R = wtRoots(), base = hdr.kind === 'pz' ? path.join(R.pz, wtSan(hdr.mode || 'Sandbox')) : hdr.kind === 'mc' ? R.mc : path.join(tmEnv().docs, 'WINTEER mundos');
          fs.mkdirSync(base, { recursive: true }); let d = path.join(base, wtSan(hdr.name)), k = 0; while (fs.existsSync(d)) d = path.join(base, wtSan(hdr.name) + (k++ ? ' (recibido ' + k + ')' : ' (recibido)'));
          fs.mkdirSync(d, { recursive: true }); dest = d; st = 2; if (!next()) { st = 3; }
        }
        if (st === 2) {
          while (buf.length && ws) {
            const take = Math.min(left, buf.length); ws.write(buf.subarray(0, take)); buf = buf.subarray(take); left -= take; total += take;
            if (left === 0) { ws.end(); ws = null; fi++; if (!next()) { st = 3; } }
          }
          if (st === 2) return;
        }
        if (st === 3) return;
      }
    });
    gu.on('end', () => { if (fail) return; const fin = () => resolve(hdr && fi >= hdr.files.length ? { ok: true, dest, files: hdr.files.length, kind: hdr.kind, name: hdr.name } : { ok: false, err: 'El archivo llegó incompleto' }); if (ws) { ws.on('finish', fin); } else fin(); });
    gu.on('error', () => bail('Archivo dañado')); rs.on('error', () => bail('No pude leer lo recibido')); rs.pipe(gu);
  });
}
async function worldRecvClose(o) {
  const id = String(o.id || '').replace(/[^\w]/g, ''), r = WTR.get(id); if (!r) return { ok: false, err: 'No hay nada recibido' };
  try { fs.closeSync(r.fd); } catch (e) {}
  const finish = (x) => { try { fs.unlinkSync(r.file); } catch (e) {} WTR.delete(id); return x; };
  if (r.n !== +o.size) return finish({ ok: false, err: 'Llegó incompleto (' + r.n + ' de ' + (+o.size) + ' bytes)' });
  const h = crypto.createHash('sha1'); await new Promise((res) => fs.createReadStream(r.file).on('data', d => h.update(d)).on('end', res).on('error', res));
  if (h.digest('hex') !== o.sha) return finish({ ok: false, err: 'Llegó dañado (no coincide la verificación)' });
  return finish(await worldUnpack(r.file, null));
}

/* ===== Estacion de emulacion: detectar emuladores, escanear ROMs, estados guardados y RetroAchievements ===== */
const EMROM = new Set(['nes', 'sfc', 'smc', 'gb', 'gbc', 'gba', 'n64', 'z64', 'v64', 'nds', 'gcm', 'gcz', 'rvz', 'wbfs', 'wad', 'md', 'gen', 'smd', 'sms', 'gg', 'pce', 'cso', 'iso', 'cue', 'chd', 'pbp', 'zip', 'a26', '32x']);
function emScan(o) {
  const out = [], seen = new Set(); let n = 0;
  const walk = (d, rel, depth) => {
    if (depth > 6 || n > 30000) return; let ls = []; try { ls = fs.readdirSync(d, { withFileTypes: true }); } catch (e) { return; }
    for (const e of ls) {
      if (++n > 30000) return; const p = path.join(d, e.name);
      if (e.isDirectory()) { if (!/^(\$|\.|System Volume)/.test(e.name)) walk(p, rel + '/' + e.name, depth + 1); continue; }
      const ext = path.extname(e.name).slice(1).toLowerCase(); if (!EMROM.has(ext)) continue;
      let st; try { st = fs.statSync(p); } catch (x) { continue; }
      if (st.size < 8 * 1024 && ext !== 'cue') continue;
      const k = p.toLowerCase(); if (seen.has(k)) continue; seen.add(k); out.push({ p, ext, size: st.size, hint: rel });
    }
  };
  for (const d of (o.dirs || []).slice(0, 8)) { try { if (fs.statSync(d).isDirectory()) walk(d, path.basename(d), 0); } catch (e) {} }
  const cues = new Set(out.filter(x => x.ext === 'cue').map(x => x.p.slice(0, -4).toLowerCase()));
  return out.filter(x => !(x.ext === 'bin' && cues.has(x.p.slice(0, -4).toLowerCase()))).slice(0, 5000);
}

/* instalación de emuladores desde su página oficial */
const EMSRC = {
  dolphin: { page: 'https://dolphin-emu.org/download/', re: /https:\/\/dl\.dolphin-emu\.org\/(?:releases|builds)\/[^"'\s<>]+?x64\.7z/g, exe: /^dolphin\.exe$/i },
  pcsx2: { gh: 'PCSX2/pcsx2', a: /windows-x64-Qt.*\.7z$/i, bad: /symbols|arm/i, exe: /^pcsx2.*\.exe$/i },
  duck: { gh: 'stenzek/duckstation', a: /windows-x64.*\.zip$/i, bad: /symbols|arm|debug/i, exe: /^duckstation.*\.exe$/i },
  ppsspp: { page: 'https://www.ppsspp.org/download/', re: /(?:https?:\/\/[^"'\s<>]*)?\/files\/[^"'\s<>]*ppsspp_win\.zip/g, exe: /^ppsspp.*\.exe$/i },
  melon: { gh: 'melonDS-emu/melonDS', a: /windows-(x86_64|x64)\.zip$/i, bad: /arm/i, exe: /^melonds\.exe$/i },
  mgba: { gh: 'mgba-emu/mgba', a: /win64\.(zip|7z)$/i, bad: /arm|psp|wii/i, exe: /^mgba(-qt)?\.exe$/i },
  mesen: { gh: 'SourMesen/Mesen2', a: /windows\.zip$/i, bad: /aot|linux|mac/i, exe: /^mesen2?\.exe$/i },
  ludusavi: { gh: 'mtkennerly/ludusavi', a: /win64\.zip$/i, bad: /portable|arm/i, exe: /^ludusavi\.exe$/i },
  snes9x: { gh: 'snes9x/snes9x', a: /win32-x64\.zip$/i, bad: /arm|debug/i, exe: /^snes9x.*\.exe$/i },
};
const EM_HOSTS = /^(github\.com|api\.github\.com|objects\.githubusercontent\.com|release-assets\.githubusercontent\.com|dolphin-emu\.org|dl\.dolphin-emu\.org|www\.ppsspp\.org|ppsspp\.org)$/i;
function emOk(u) { try { const x = new URL(u); return x.protocol === 'https:' && EM_HOSTS.test(x.hostname); } catch (e) { return false; } }
function emFindExe(dir, re) {
  let hit = ''; const walk = (d, depth) => {
    if (hit || depth > 3) return; let ls = []; try { ls = fs.readdirSync(d, { withFileTypes: true }); } catch (x) { return; }
    for (const f of ls) if (!f.isDirectory() && re.test(f.name)) { hit = path.join(d, f.name); return; }
    for (const f of ls) if (f.isDirectory()) walk(path.join(d, f.name), depth + 1);
  }; walk(dir, 0); return hit;
}
let emBusy = false;
async function emInstall(id) {
  const S = EMSRC[id]; if (!S) return { ok: false, err: 'src' };
  if (process.platform !== 'win32') return { ok: false, err: 'os' };
  if (emBusy) return { ok: false, err: 'busy' }; emBusy = true;
  const prog = (p, t) => { try { if (win && !win.isDestroyed()) win.webContents.send('emprog', { id, p, t }); } catch (e) {} };
  const H = { 'User-Agent': 'WINTEER/' + app.getVersion(), Accept: 'application/vnd.github+json' };
  try {
    prog(0, 'Buscando la última versión');
    let url = '';
    if (S.gh) {
      const r = await net.fetch('https://api.github.com/repos/' + S.gh + '/releases/latest', { headers: H }); if (!r.ok) return { ok: false, err: 'net' };
      const j = await r.json(); const as = (j.assets || []).filter(a => S.a.test(a.name) && !(S.bad && S.bad.test(a.name)));
      as.sort((a, b) => (/\.zip$/i.test(a.name) ? 0 : 1) - (/\.zip$/i.test(b.name) ? 0 : 1));
      url = as[0] && as[0].browser_download_url;
    } else {
      const r = await net.fetch(S.page, { headers: { 'User-Agent': 'Mozilla/5.0 WINTEER' } }); if (!r.ok) return { ok: false, err: 'net' };
      const t = await r.text(); const ms = t.match(S.re) || []; let u = ms.find(x => /releases/.test(x)) || ms[0];
      if (u && u.startsWith('/')) u = new URL(S.page).origin + u; url = u;
    }
    if (!url || !emOk(url)) return { ok: false, err: 'src' };
    const ext = /\.7z($|\?)/i.test(url) ? '7z' : 'zip';
    const base = path.join(app.getPath('userData'), 'emulators'), dir = path.join(base, id), tmpf = path.join(base, id + '.' + ext);
    fs.mkdirSync(base, { recursive: true });
    const r = await net.fetch(url, { headers: { 'User-Agent': 'WINTEER/' + app.getVersion() }, redirect: 'follow' });
    if (!r.ok || !r.body) return { ok: false, err: 'net' };
    const tot = Number(r.headers.get('content-length')) || 0; if (tot > 700 * 1024 * 1024) return { ok: false, err: 'big' };
    const ws = fs.createWriteStream(tmpf); let got = 0, last = 0; const rd = r.body.getReader();
    for (;;) {
      const { done, value } = await rd.read(); if (done) break; got += value.length; if (got > 700 * 1024 * 1024) { ws.destroy(); return { ok: false, err: 'big' }; }
      if (!ws.write(Buffer.from(value))) await new Promise(res => ws.once('drain', res));
      const now = Date.now(); if (now - last > 400) { last = now; prog(tot ? Math.round(got / tot * 90) : 50, 'Descargando'); }
    }
    await new Promise(res => ws.end(res));
    prog(92, 'Descomprimiendo'); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) {} fs.mkdirSync(dir, { recursive: true });
    const run = (cmd, args, env) => new Promise(res => execFile(cmd, args, { windowsHide: true, timeout: 300000, env: Object.assign({}, process.env, env || {}) }, err => res(!err)));
    if (ext === 'zip') await run('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', 'Expand-Archive -LiteralPath $env:WT_Z -DestinationPath $env:WT_D -Force'], { WT_Z: tmpf, WT_D: dir });
    else {
      await run(path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe'), ['-xf', tmpf, '-C', dir]);
      if (!emFindExe(dir, S.exe)) for (const z of [path.join(process.env.ProgramFiles || '', '7-Zip', '7z.exe'), path.join(process.env['ProgramFiles(x86)'] || '', '7-Zip', '7z.exe')]) { if (fs.existsSync(z) && await run(z, ['x', '-y', '-o' + dir, tmpf])) break; }
    }
    try { fs.unlinkSync(tmpf); } catch (e) {}
    const exe = emFindExe(dir, S.exe); if (!exe) return { ok: false, err: ext === '7z' ? 'x7z' : 'unzip', url };
    prog(100, 'Listo'); return { ok: true, exe };
  } catch (e) { return { ok: false, err: 'net' }; }
  finally { emBusy = false; }
}


/* Ludusavi: detecta dónde guarda cada juego instalado (se baja solo, en silencio) */
let lsvCache = { t: 0, v: null };
function lsvPaths(files) {
  const GEN = /^(documents|my games|mis documentos|saved games|appdata|roaming|local|locallow|users|desktop|downloads|onedrive|program files|program files \(x86\)|steam|steamapps|common)$/i, out = [];
  for (const f0 of files) {
    const f = String(f0).replace(/\//g, path.sep), dir = path.dirname(f), parts = dir.split(path.sep).filter(Boolean);
    out.push((parts.length < 4 || GEN.test(path.basename(dir))) ? f : dir);
  }
  const u = [...new Set(out)].sort((a, b) => a.length - b.length), keep = [];
  for (const p of u) if (!keep.some(k => p === k || p.startsWith(k + path.sep))) keep.push(p);
  return keep.slice(0, 40);
}
async function lsvScan(o) {
  if (process.platform !== 'win32') return { ok: false, err: 'os' };
  if (lsvCache.v && !(o && o.force) && Date.now() - lsvCache.t < 10 * 60000) return lsvCache.v;
  const dir = path.join(app.getPath('userData'), 'emulators', 'ludusavi');
  let exe = emFindExe(dir, /^ludusavi\.exe$/i);
  if (!exe) { const r = await emInstall('ludusavi'); if (!r || !r.ok) return { ok: false, err: (r && r.err) || 'net' }; exe = r.exe; }
  const cd = path.join(app.getPath('userData'), 'ludusavi-cfg'); fs.mkdirSync(cd, { recursive: true });
  const cf = path.join(cd, 'config.yaml');
  try {
    const roots = steamLibs('').filter(l => { try { return fs.statSync(path.join(l, 'steamapps')).isDirectory(); } catch (e) { return false; } });
    const y = ['manifest:', '  enable: true'].concat(roots.length ? ['roots:'].concat(roots.flatMap(l => ['  - path: "' + l.replace(/\\/g, '/') + '"', '    store: steam'])) : ['roots: []']);
    fs.writeFileSync(cf, y.join('\n') + '\n', 'utf8');
  } catch (e) {}
  const out = await new Promise(res => execFile(exe, ['--config', cd, 'backup', '--preview', '--api', '--try-update'], { windowsHide: true, timeout: 180000, maxBuffer: 64 * 1024 * 1024 }, (err, so) => res(so ? String(so) : '')));
  let j; try { j = JSON.parse(out); } catch (e) { return { ok: false, err: 'parse' }; }
  const games = []; for (const k of Object.keys(j.games || {})) {
    const g = j.games[k], fl = Object.keys((g && g.files) || {}); if (!fl.length) continue;
    games.push({ name: k, paths: lsvPaths(fl) });
  }
  lsvCache = { t: Date.now(), v: { ok: true, games } }; return lsvCache.v;
}
function driveFind() {
  const home = os.homedir(), c = [path.join(home, 'Google Drive'), path.join(home, 'Google Drive', 'Mi unidad'), path.join(home, 'Google Drive', 'My Drive')];
  for (let i = 71; i <= 90; i++) { const L = String.fromCharCode(i) + ':\\'; for (const n of ['Mi unidad', 'My Drive']) c.push(L + n); }
  for (const d of c) { try { if (fs.statSync(d).isDirectory()) return d; } catch (e) {} }
  return '';
}
function emDetect(cat) {
  const e = tmEnv(), pf = [process.env.ProgramFiles, process.env['ProgramFiles(x86)'], path.join(e.local, 'Programs'), path.join(e.home, 'Desktop'), path.join(e.home, 'Downloads'), e.docs, path.join(e.home, 'scoop', 'apps'), 'C:\\Emulators', 'D:\\Emulators', 'C:\\Emuladores', 'D:\\Emuladores', 'C:\\Games', 'D:\\Games', 'C:\\RetroArch', 'D:\\RetroArch'].filter(Boolean);
  const res = {}, rx = (cat || []).map(c => ({ id: c.id, re: new RegExp(c.re, 'i') })); let budget = 9000;
  const walk = (d, depth) => {
    if (depth > 3 || budget <= 0) return; let ls = []; try { ls = fs.readdirSync(d, { withFileTypes: true }); } catch (x) { return; }
    for (const f of ls) {
      if (--budget <= 0) return; const p = path.join(d, f.name);
      if (f.isDirectory()) { if (!/^(\.|node_modules|Windows|\$)/.test(f.name)) walk(p, depth + 1); }
      else if (/\.exe$/i.test(f.name)) for (const r of rx) if (!res[r.id] && r.re.test(f.name)) res[r.id] = p;
    }
  };
  for (const d of pf) walk(d, 0);
  return res;
}
function emStates(o) {
  const exe = String(o.exe || ''), rom = String(o.rom || ''), base = tmNorm(path.basename(rom, path.extname(rom)));
  if (!base) return [];
  const e = tmEnv(), roots = new Set([path.dirname(rom)]);
  if (exe) { roots.add(path.dirname(exe)); const nm = path.basename(path.dirname(exe)); roots.add(path.join(e.appdata, nm)); roots.add(path.join(e.docs, nm)); roots.add(path.join(e.local, nm)); }
  for (const x of ['Dolphin Emulator', 'PCSX2', 'DuckStation', 'PPSSPP', 'mGBA', 'Snes9x', 'melonDS', 'Mesen2', 'Mesen', 'RetroArch']) { roots.add(path.join(e.appdata, x)); roots.add(path.join(e.docs, x)); roots.add(path.join(e.docs, x, 'PSP')); }
  const ST_RE = /^(state\d*|ss\d|mss|ml\d|\d{3}|p2s|ppst|s\d\d|savestate|sst|zst|st\d)$/i, SV_RE = /^(sav|srm|dsv|sa1|eep|fla|mcr|mc)$/i;
  const out = [], seen = new Set(); let n = 0;
  const walk = (d, depth) => {
    if (depth > 3 || n > 8000) return; let ls = []; try { ls = fs.readdirSync(d, { withFileTypes: true }); } catch (x) { return; }
    for (const f of ls) {
      if (++n > 8000) return; const p = path.join(d, f.name);
      if (f.isDirectory()) { walk(p, depth + 1); continue; }
      const ext = path.extname(f.name).slice(1), nb = tmNorm(f.name.slice(0, f.name.length - ext.length - 1));
      if (!nb.includes(base) && !tmNorm(f.name).includes(base)) continue;
      const kind = ST_RE.test(ext) ? 'state' : SV_RE.test(ext) ? 'save' : ''; if (!kind) continue;
      const k = p.toLowerCase(); if (seen.has(k)) continue; seen.add(k);
      let st; try { st = fs.statSync(p); } catch (x) { continue; }
      let thumb = ''; for (const t of [p + '.png', p.slice(0, p.length - ext.length - 1) + '.png']) { try { if (fs.existsSync(t)) { thumb = pathToFileURL(t).href; break; } } catch (x) {} }
      out.push({ p, n: f.name, kind, size: st.size, m: st.mtimeMs, thumb });
    }
  };
  for (const r of roots) walk(r, 0);
  return out.sort((a, b) => b.m - a.m).slice(0, 60);
}
/* RetroAchievements: usuario y clave quedan solo en main */
const RAC = { list: {}, game: {} };
async function raApi(ep, q) {
  const u = cfg.raUser, k = cfg.raKey; if (!u || !k) return { err: 'nocred' };
  const url = 'https://retroachievements.org/API/' + ep + '.php?' + new URLSearchParams(Object.assign({ z: u, y: k }, q)).toString();
  try { const r = await net.fetch(url, { headers: { 'user-agent': UA } }); if (r.status === 401 || r.status === 403) return { err: 'auth' }; if (!r.ok) return { err: 'http' }; return { data: await r.json() }; } catch (e) { return { err: 'net' }; }
}
const raNorm = s => String(s || '').toLowerCase().replace(/\(.*?\)|\[.*?\]/g, ' ').replace(/~.*?~/g, ' ').replace(/\b(the|a|an)\b/g, ' ').replace(/[^a-z0-9]/g, '');
async function raGame(o) {
  const con = +o.console; if (!con) return { ok: false, err: 'nosys' };
  if (!cfg.raUser || !cfg.raKey) return { ok: false, err: 'nocred' };
  const ck = con + ':' + raNorm(o.name), hit = RAC.game[ck]; if (hit && Date.now() - hit.t < 10 * 6e4) return hit.r;
  let L = RAC.list[con]; const lf = path.join(app.getPath('userData'), 'ra-list-' + con + '.json');
  if (!L) { try { const st = fs.statSync(lf); if (Date.now() - st.mtimeMs < 7 * 864e5) L = JSON.parse(fs.readFileSync(lf, 'utf8')); } catch (e) {} }
  if (!L) { const r = await raApi('API_GetGameList', { i: con, f: 1, h: 0 }); if (r.err) return { ok: false, err: r.err }; L = (Array.isArray(r.data) ? r.data : []).map(x => ({ id: x.ID, t: x.Title, n: x.NumAchievements || 0 })); try { fs.writeFileSync(lf, JSON.stringify(L)); } catch (e) {} }
  RAC.list[con] = L;
  const nm = raNorm(o.name); let g = L.find(x => raNorm(x.t) === nm && x.n > 0) || L.find(x => raNorm(x.t) === nm);
  if (!g) { const c = L.filter(x => x.n > 0 && raNorm(x.t).startsWith(nm) && nm.length > 6); if (c.length === 1) g = c[0]; }
  if (!g) return { ok: false, err: 'nomatch' };
  const r = await raApi('API_GetGameInfoAndUserProgress', { g: g.id, u: cfg.raUser }); if (r.err) return { ok: false, err: r.err };
  const d = r.data || {}, A = Object.values(d.Achievements || {}), list = A.map(a => ({ t: a.Title, d: a.Description, p: +a.Points || 0, e: a.DateEarnedHardcore || a.DateEarned || '', b: a.BadgeName })).sort((a, b) => (b.e ? 1 : 0) - (a.e ? 1 : 0) || String(b.e).localeCompare(String(a.e)));
  const res = { ok: true, gid: g.id, title: d.Title || g.t, total: list.length, earned: list.filter(x => x.e).length, pts: list.filter(x => x.e).reduce((s, x) => s + x.p, 0), list: list.slice(0, 200) };
  RAC.game[ck] = { t: Date.now(), r: res }; return res;
}

/* ===== IA local con Ollama: usa lo que ya esta instalado, placa de video por defecto, se descarga de memoria al terminar y se bloquea con un juego abierto ===== */
function ollamaReq(method, p, body, ms, ctl) {
  return new Promise((resolve) => {
    const http = require('http'); let done = false;
    const fin = (r) => { if (!done) { done = true; resolve(r); } };
    const data = body ? Buffer.from(JSON.stringify(body)) : null;
    const req = http.request({ host: '127.0.0.1', port: 11434, path: p, method, headers: data ? { 'Content-Type': 'application/json', 'Content-Length': data.length } : {} }, (res) => {
      let t = ''; res.setEncoding('utf8'); res.on('data', d => { t += d; if (t.length > 2e6) req.destroy(); }); res.on('end', () => fin({ status: res.statusCode, text: t }));
    });
    req.setTimeout(ms || 4000, () => { req.destroy(); fin({ status: 0, text: '', timeout: true }); });
    req.on('error', () => fin({ status: 0, text: '' }));
    if (ctl) ctl.kill = () => { try { req.destroy(); } catch (e) {} fin({ status: 0, text: '', aborted: true }); };
    if (data) req.write(data); req.end();
  });
}
async function aiStatus() {
  const busy = track.size > 0;
  const r = await ollamaReq('GET', '/api/tags', null, 2500);
  if (r.status !== 200) return { ok: false, busy, models: [] };
  let m = []; try { m = (JSON.parse(r.text).models || []).map(x => x.name).filter(Boolean); } catch (e) {}
  return { ok: true, busy, models: m };
}
async function aiAsk(o) {
  if (track.size > 0) return { ok: false, busy: true };
  const model = String(o && o.model || '').slice(0, 80); if (!model) return { ok: false, err: 'Sin modelo' };
  const ctl = {}, watch = setInterval(() => { if (track.size > 0 && ctl.kill) ctl.kill(); }, 1200);
  const threads = Math.max(2, Math.floor(os.cpus().length / 2));
  const opts = (cpu) => Object.assign({ num_thread: threads, num_ctx: 8192, temperature: 0.7, top_p: 0.9, top_k: 40, repeat_penalty: 1.18, repeat_last_n: 256, presence_penalty: 0.4, frequency_penalty: 0.4, num_predict: 220 }, cpu ? { num_gpu: 0 } : {});
  const msgs = Array.isArray(o.messages) ? o.messages.slice(-30).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '').slice(0, 1500) })) : null;
  const go = (cpu) => msgs
    ? ollamaReq('POST', '/api/chat', { model, messages: [{ role: 'system', content: String(o.system || '').slice(0, 4000) }].concat(msgs), stream: false, keep_alive: 0, options: opts(cpu) }, 180000, ctl)
    : ollamaReq('POST', '/api/generate', { model, prompt: String(o.prompt || '').slice(0, 8000), system: String(o.system || '').slice(0, 2000), stream: false, keep_alive: 0, options: opts(cpu) }, 180000, ctl);
  /* por defecto usa la placa de video (no hay juego abierto, asi que no compite); si falla (poca memoria de video) reintenta con el procesador */
  let r = await go(!!o.cpu);
  if (!o.cpu && !r.aborted && r.status === 500 && track.size === 0) r = await go(true);
  clearInterval(watch);
  if (r.aborted || track.size > 0) return { ok: false, busy: true };
  if (r.status !== 200) return { ok: false, err: r.timeout ? 'Tardó demasiado. Probá con un modelo más chico' : 'Ollama no respondió' };
  try { const j = JSON.parse(r.text); return { ok: true, text: String(j.response || (j.message && j.message.content) || '').trim() }; } catch (e) { return { ok: false, err: 'Respuesta inválida' }; }
}

/* ===== reconocimiento de voz de Windows (sin internet) para hablarle a la mascota ===== */
let aiLis = false;
function aiListen() {
  if (process.platform !== 'win32') return Promise.resolve({ ok: false, err: 'os' });
  if (aiLis) return Promise.resolve({ ok: false, err: 'busy' }); aiLis = true;
  const ps = `
[Console]::OutputEncoding=[Text.Encoding]::UTF8
try{Add-Type -AssemblyName System.Speech}catch{Write-Output 'ERR:norec';exit}
$rec=$null
foreach($r in [System.Speech.Recognition.SpeechRecognitionEngine]::InstalledRecognizers()){if($r.Culture.TwoLetterISOLanguageName -eq 'es'){$rec=$r;break}}
if($rec -eq $null){Write-Output 'ERR:norec';exit}
try{
  $e=New-Object System.Speech.Recognition.SpeechRecognitionEngine($rec)
  $e.SetInputToDefaultAudioDevice()
  $e.LoadGrammar((New-Object System.Speech.Recognition.DictationGrammar))
  $e.InitialSilenceTimeout=[TimeSpan]::FromSeconds(6)
  $e.EndSilenceTimeout=[TimeSpan]::FromSeconds(1)
  $e.EndSilenceTimeoutAmbiguous=[TimeSpan]::FromSeconds(1.5)
  $res=$e.Recognize([TimeSpan]::FromSeconds(14))
  if($res -ne $null){Write-Output ('OK:'+$res.Text)}else{Write-Output 'OK:'}
}catch{Write-Output 'ERR:mic'}`;
  return new Promise((resolve) => {
    try { execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-EncodedCommand', Buffer.from(ps, 'utf16le').toString('base64')], { windowsHide: true, timeout: 25000 }, (err, out) => {
      aiLis = false; const t = String(out || '').trim().split(/\r?\n/).pop() || '';
      if (/^OK:/.test(t)) resolve({ ok: true, text: t.slice(3).trim() }); else if (/^ERR:/.test(t)) resolve({ ok: false, err: t.slice(4) }); else resolve({ ok: false, err: 'x' });
    }); } catch (e) { aiLis = false; resolve({ ok: false, err: 'x' }); }
  });
}

/* ===== IA local: instalacion automatica de Ollama + modelo (solo desde la pagina oficial) ===== */
const OLL_HOSTS = /^(ollama\.com|www\.ollama\.com|github\.com|objects\.githubusercontent\.com|release-assets\.githubusercontent\.com)$/i;
let aiBusy = false;
function ollamaExe() { const c = path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Ollama', 'ollama.exe'); return fs.existsSync(c) ? c : ''; }
function ollamaPull(model, prog) {
  return new Promise((resolve) => {
    const http = require('http'); let done = false, buf = '';
    const fin = (r) => { if (!done) { done = true; resolve(r); } };
    const data = Buffer.from(JSON.stringify({ name: model, stream: true }));
    const req = http.request({ host: '127.0.0.1', port: 11434, path: '/api/pull', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': data.length } }, (res) => {
      if (res.statusCode !== 200) { fin({ ok: false }); return; }
      res.setEncoding('utf8');
      res.on('data', (d) => { buf += d; let i; while ((i = buf.indexOf('\n')) >= 0) { const l = buf.slice(0, i); buf = buf.slice(i + 1); try { const j = JSON.parse(l); if (j.error) { fin({ ok: false }); } else if (j.total && j.completed) prog(Math.round(j.completed / j.total * 100)); } catch (e) {} } });
      res.on('end', () => fin({ ok: true }));
    });
    req.setTimeout(120000, () => { req.destroy(); fin({ ok: false }); });
    req.on('error', () => fin({ ok: false }));
    req.write(data); req.end();
  });
}
async function aiSetup(model) {
  if (process.platform !== 'win32') return { ok: false, err: 'os' };
  if (aiBusy) return { ok: false, err: 'busy' }; aiBusy = true;
  const send = (p, t) => { try { if (win && !win.isDestroyed()) win.webContents.send('aiprog', { p, t }); } catch (e) {} };
  try {
    let st = await aiStatus();
    if (!st.ok) {
      let exe = ollamaExe();
      if (!exe) {
        send(0, 'Descargando Ollama');
        const dir = path.join(app.getPath('userData'), 'ollama'), setup = path.join(dir, 'OllamaSetup.exe'); fs.mkdirSync(dir, { recursive: true });
        let r = null, why = '';
        for (const u of ['https://ollama.com/download/OllamaSetup.exe', 'https://github.com/ollama/ollama/releases/latest/download/OllamaSetup.exe']) {
          try {
            const x = await net.fetch(u, { headers: { 'User-Agent': 'WINTEER/' + app.getVersion() }, redirect: 'follow' });
            let host = ''; try { host = new URL(x.url || u).hostname; } catch (e) {}
            if (x.ok && x.body && OLL_HOSTS.test(host)) { r = x; break; }
            why = 'http ' + x.status + ' ' + host;
          } catch (e) { why = String(e && e.message || e).slice(0, 80); }
        }
        if (!r) return { ok: false, err: 'net', d: why };
        const tot = Number(r.headers.get('content-length')) || 0; if (tot > 3 * 1024 * 1024 * 1024) return { ok: false, err: 'big' };
        const ws = fs.createWriteStream(setup); let got = 0, last = 0; const rd = r.body.getReader();
        for (;;) {
          const { done, value } = await rd.read(); if (done) break; got += value.length; if (got > 3 * 1024 * 1024 * 1024) { ws.destroy(); return { ok: false, err: 'big' }; }
          if (!ws.write(Buffer.from(value))) await new Promise(res => ws.once('drain', res));
          const now = Date.now(); if (now - last > 500) { last = now; send(tot ? Math.round(got / tot * 40) : 20, 'Descargando Ollama'); }
        }
        await new Promise(res => ws.end(res));
        if (got < 20 * 1024 * 1024) return { ok: false, err: 'net' };
        send(41, 'Revisando que sea el instalador oficial');
        const sig = await new Promise((res) => { try { execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', '$s=Get-AuthenticodeSignature -LiteralPath $env:WT_F;Write-Output ($s.Status.ToString()+"|"+$s.SignerCertificate.Subject)'], { windowsHide: true, timeout: 30000, env: Object.assign({}, process.env, { WT_F: setup }) }, (e, o) => res(String(o || ''))); } catch (e) { res(''); } });
        if (/^HashMismatch|^NotTrusted/i.test(sig) || (/^Valid/i.test(sig) && !/ollama/i.test(sig))) { try { fs.unlinkSync(setup); } catch (e) {} return { ok: false, err: 'sig' }; }
        send(45, 'Instalando Ollama');
        await new Promise((res) => { try { execFile(setup, ['/VERYSILENT', '/SUPPRESSMSGBOXES', '/NORESTART', '/SP-'], { windowsHide: true, timeout: 15 * 60000 }, () => res()); } catch (e) { res(); } });
        try { fs.unlinkSync(setup); } catch (e) {}
        exe = ollamaExe(); if (!exe) return { ok: false, err: 'inst' };
      }
      send(70, 'Iniciando Ollama');
      for (let i = 0; i < 20 && !(st = await aiStatus()).ok; i++) await new Promise(r => setTimeout(r, 1500));
      if (!st.ok) { try { spawn(exe, ['serve'], { detached: true, stdio: 'ignore', windowsHide: true }).unref(); } catch (e) {} for (let i = 0; i < 25 && !(st = await aiStatus()).ok; i++) await new Promise(r => setTimeout(r, 1500)); }
      if (!st.ok) return { ok: false, err: 'start' };
    }
    if (!st.models.length) {
      const m = String(model || (os.totalmem() < 12 * 1024 * 1024 * 1024 ? 'dolphin-phi' : 'dolphin-mistral')).slice(0, 60);
      send(75, 'Bajando el modelo ' + m);
      const r = await ollamaPull(m, (p) => send(75 + Math.round(p * 0.24), 'Bajando el modelo ' + m));
      if (!r.ok) return { ok: false, err: 'pull' };
    }
    send(100, 'Listo');
    return { ok: true };
  } catch (e) { return { ok: false, err: 'x', d: String(e && e.message || e).slice(0, 80) }; }
  finally { aiBusy = false; }
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
      else if (o.exe) { const c = spawn(o.exe, Array.isArray(o.args) ? o.args.map(String).slice(0, 12) : [], { cwd: path.dirname(o.exe), detached: true, stdio: 'ignore' }); c.on('error', () => send({ type: 'never', id: o.id, err: 'No pude abrir el .exe' })); c.unref(); }
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
      if (!/(^|\.)(steamgriddb\.com|howlongtobeat\.com|translate\.googleapis\.com|firestore\.googleapis\.com|api\.steampowered\.com|store\.steampowered\.com|www\.reddit\.com|www\.eurogamer\.net|www\.pcgamer\.com|www\.rockpapershotgun\.com|www\.gamespot\.com|store-site-backend-static\.ak\.epicgames\.com|catalog\.gog\.com)$/.test(u.hostname)) return { status: 0, text: '' };
      const r = await net.fetch(o.url, { method: o.method || 'GET', headers: { 'user-agent': UA, ...(o.headers || {}) }, body: o.body });
      return { status: r.status, text: await r.text() };
    } catch (e) { return { status: 0, text: '' }; }
  });
  ipcMain.handle('docScan', async (_e, o) => {
    if (process.platform !== 'win32') return { ok: true, list: [] };
    const since = Math.max(Date.now() - 14 * 864e5, +o.since || 0) - 5000;
    const ps = "$ErrorActionPreference='SilentlyContinue';$s=[DateTimeOffset]::FromUnixTimeMilliseconds([int64]$env:WT_S).LocalDateTime;$ev=Get-WinEvent -FilterHashtable @{LogName='Application';Id=1000,1002,1026;StartTime=$s} -MaxEvents 120;$ev | ForEach-Object { [pscustomobject]@{t=[int64]([DateTimeOffset]$_.TimeCreated).ToUnixTimeMilliseconds();id=$_.Id;m=$_.Message} } | ConvertTo-Json -Compress";
    const out = await new Promise((res) => { try { execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-EncodedCommand', Buffer.from(ps, 'utf16le').toString('base64')], { windowsHide: true, maxBuffer: 8e6, timeout: 25000, env: Object.assign({}, process.env, { WT_S: String(since) }) }, (err, so) => res(err ? '' : String(so))); } catch (e) { res(''); } });
    let arr = []; try { const j = JSON.parse(out || '[]'); arr = Array.isArray(j) ? j : [j]; } catch (e) {}
    const g1 = (re, s) => { const x = re.exec(s); return x ? x[1].trim() : ''; };
    const exe = String(o.exe || '').split(/[\\/]/).pop().toLowerCase(), list = [];
    for (const ev of arr) {
      const msg = String(ev.m || '');
      let app = g1(/(?:Faulting application name|Nombre de la aplicaci[oó]n con errores):\s*([^,\r\n]+)/i, msg), pth = g1(/(?:Faulting application path|Ruta de acceso de la aplicaci[oó]n con errores):\s*([^\r\n]+)/i, msg);
      const mod = g1(/(?:Faulting module name|Nombre del m[oó]dulo con errores):\s*([^,\r\n]+)/i, msg), code = g1(/(?:Exception code|C[oó]digo de excepci[oó]n):\s*(0x[0-9a-f]+)/i, msg);
      let net = '';
      if (ev.id === 1026) { app = g1(/(?:Application|Aplicaci[oó]n):\s*([^\r\n]+)/i, msg); net = g1(/Exception Info:\s*([^\r\n]+)/i, msg); }
      if (!app || /winteer|electron/i.test(app + pth)) continue;
      const hit = (exe && app.toLowerCase() === exe) || (o.steam && /steamapps[\\/]common/i.test(pth)) || (!exe && !o.steam && ev.t >= (+o.since || 0) - 5000);
      if (!hit) continue;
      list.push({ t: ev.t, id: ev.id, app, mod, code: code.toLowerCase(), net: net.slice(0, 160), path: pth });
      if (list.length >= 5) break;
    }
    return { ok: true, list };
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
  ipcMain.handle('igdbVid', async (_e, o) => { try { return await igdbVid(o); } catch (e) { return { error: String(e.message || e) }; } });
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
  const TRL = path.join(app.getPath('userData'), 'trailers'), YTX = path.join(TRL, 'yt-dlp.exe'), YLOG = path.join(TRL, '_log.txt');
  const tlog = (m) => { try { fs.appendFileSync(YLOG, new Date().toISOString() + ' ' + m + '\n'); } catch (e) {} };
  ipcMain.handle('trlList', () => { try { fs.mkdirSync(TRL, { recursive: true }); const o = {}; const QF = path.join(TRL, '_q1080'); if (!fs.existsSync(QF)) { for (const f of fs.readdirSync(TRL)) { const mm = f.match(/^(\w+)\.(mp4|webm|nx)$/); if (mm && !fs.existsSync(path.join(TRL, mm[1] + '.cu'))) { try { fs.unlinkSync(path.join(TRL, f)); } catch (e) {} } } fs.writeFileSync(QF, '1'); } for (const f of fs.readdirSync(TRL)) { if (/\.none$/.test(f)) { try { fs.unlinkSync(path.join(TRL, f)); } catch (e) {} continue; } const m = f.match(/^(\w+)\.(mp4|webm|nx)$/); if (m) o[m[1]] = m[2] === 'nx' ? '' : pathToFileURL(path.join(TRL, f)).href; if (/^\w+\.(m4a|na)$/.test(f)) { try { fs.unlinkSync(path.join(TRL, f)); } catch (e) {} continue; } const ma = f.match(/^(\w+)\.mu\.(m4a|mp3|ogg|wav|opus|aac)$/); if (ma) o['a:' + ma[1]] = pathToFileURL(path.join(TRL, f)).href; const mk = f.match(/^(\w+)\.nm$/); if (mk) o['s:' + mk[1]] = ''; } return o; } catch (e) { return {}; } });
  let ytReady = null;
  const ytEnsure = () => ytReady || (ytReady = (async () => {
    if (process.platform !== 'win32') throw new Error('solo Windows');
    fs.mkdirSync(TRL, { recursive: true });
    let age = Infinity; try { age = Date.now() - fs.statSync(YTX).mtimeMs; } catch (e) {}
    if (age < 7 * 864e5) return;
    if (age !== Infinity) { try { await new Promise((res) => require('child_process').execFile(YTX, ['-U'], { timeout: 60000, windowsHide: true }, () => res())); const t = new Date(); fs.utimesSync(YTX, t, t); if (Date.now() - fs.statSync(YTX).mtimeMs < 7 * 864e5) return; } catch (e) {} }
    const r = await net.fetch('https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe'); if (!r.ok) throw new Error('descarga yt-dlp http' + r.status);
    const buf = Buffer.from(await r.arrayBuffer()); if (buf.length < 5e6) throw new Error('yt-dlp incompleto');
    fs.writeFileSync(YTX + '.part', buf); fs.renameSync(YTX + '.part', YTX);
  })().catch((e) => { ytReady = null; throw e; }));
  ipcMain.handle('trlGet', async (_e, o) => {
    try {
      const key = String((o && o.key) || '').replace(/\W/g, ''), name = String((o && o.name) || '').replace(/[™®©"]/g, '').trim(), appid = String((o && o.app) || '').replace(/\D/g, '');
      if (!key || !name) return { none: true };
      fs.mkdirSync(TRL, { recursive: true });
      if (o && o.aud) {
        /* música del Modo mando: la canción más conocida del juego (tema principal), se guarda aparte de los trailers */
        await ytEnsure();
        const tmpA = path.join(TRL, key + '.dl.m4a'), finA = path.join(TRL, key + '.mu.m4a');
        try { fs.unlinkSync(tmpA); } catch (e) {}
        const argsA = ['ytsearch5:' + name + ' main theme soundtrack', '--max-downloads', '1', '--no-playlist', '--no-warnings', '--match-filter', 'duration>60 & duration<480', '-f', 'ba[ext=m4a]/ba[acodec^=mp4a]', '--max-filesize', '25M', '--socket-timeout', '20', '-o', tmpA];
        const resA = await new Promise((resolve) => require('child_process').execFile(YTX, argsA, { timeout: 120000, windowsHide: true, maxBuffer: 4e6 }, (err, so, se) => resolve({ err, so: String(so || ''), se: String(se || '') })));
        if (fs.existsSync(tmpA)) { fs.renameSync(tmpA, finA); return { aurl: pathToFileURL(finA).href }; }
        tlog('sin musica ' + name + ' :: ' + resA.se.slice(-200).replace(/\s+/g, ' '));
        try { fs.writeFileSync(path.join(TRL, key + '.nm'), ''); } catch (e) {}
        return { noaud: true };
      }
      /* 1) Steam: mp4/webm directo si lo ofrece */
      if (appid) {
        try {
          const r = await net.fetch('https://store.steampowered.com/api/appdetails?appids=' + appid + '&filters=movies&l=english');
          const j = await r.json(), d = j && j[appid] && j[appid].data, mv = d && d.movies;
          if (mv && mv[0] && !o.probed) { o.probed = 1; tlog('steam movie keys ' + Object.keys(mv[0]).join(',')); }
          const pick = (mv || []).map(m => ({ u: (m.mp4 && (m.mp4.max || m.mp4['480'])) || (m.webm && (m.webm.max || m.webm['480'])) || '' })).find(x => x.u);
          if (pick) {
            const u = new URL(pick.u);
            if (/(^|\.)steamstatic\.com$|(^|\.)akamaihd\.net$|(^|\.)steamcontent\.com$/.test(u.hostname)) {
              const ext = /\.webm/i.test(u.pathname) ? 'webm' : 'mp4', fin = path.join(TRL, key + '.' + ext), tmp = fin + '.part';
              const rr = await net.fetch(pick.u);
              if (rr.ok) { fs.writeFileSync(tmp, Buffer.from(await rr.arrayBuffer())); fs.renameSync(tmp, fin); return { url: pathToFileURL(fin).href }; }
            }
          }
        } catch (e) {}
      }
      /* 2) yt-dlp: busca el trailer oficial y baja solo el video (sin audio) */
      await ytEnsure();
      const fin = path.join(TRL, key + '.mp4'), tmp = path.join(TRL, key + '.dl.mp4');
      try { fs.unlinkSync(tmp); } catch (e) {}
      const args = ['ytsearch3:' + name + ' official game trailer', '--max-downloads', '1', '--no-playlist', '--no-warnings', '--match-filter', 'duration<420', '-f', 'bv[height<=1080][vcodec^=avc1][filesize<160M]/bv[height<=1080][vcodec^=avc1][filesize_approx<160M]/bv[height<=720][vcodec^=avc1]/bv[height<=720][ext=mp4]', '--max-filesize', '200M', '--socket-timeout', '20', '-o', tmp];
      const res = await new Promise((resolve) => require('child_process').execFile(YTX, args, { timeout: 120000, windowsHide: true, maxBuffer: 4e6 }, (err, so, se) => resolve({ err, so: String(so || ''), se: String(se || '') })));
      if (fs.existsSync(tmp)) { fs.renameSync(tmp, fin); return { url: pathToFileURL(fin).href }; }
      for (const f of fs.readdirSync(TRL)) if (f.startsWith(key + '.dl.')) { try { fs.unlinkSync(path.join(TRL, f)); } catch (e) {} }
      tlog('sin archivo ' + name + ' :: ' + (res.err ? String(res.err.message).slice(0, 160) : 'ok') + ' :: ' + res.se.slice(-300).replace(/\s+/g, ' '));
      if (!res.err && /does not pass filter|no video/i.test(res.so + res.se)) { fs.writeFileSync(path.join(TRL, key + '.nx'), ''); return { none: true }; }
      return { err: res.se.slice(-120) || 'sin resultado' };
    } catch (e) { tlog('error ' + String(e.message || e)); return { err: String(e.message || e) }; }
  });
  /* canción propia del Modo mando */
  const musClean = (key) => { try { for (const f of fs.readdirSync(TRL)) if (f.startsWith(key + '.mu.') || f === key + '.nm') { try { fs.unlinkSync(path.join(TRL, f)); } catch (e) {} } } catch (e) {} };
  ipcMain.handle('musPick', async (_e, key) => {
    try {
      key = String(key || '').replace(/\W/g, ''); if (!key) return { err: 'sin clave' };
      const r = await dialog.showOpenDialog(win, { title: 'Elegí la canción', properties: ['openFile'], filters: [{ name: 'Audio', extensions: ['mp3', 'm4a', 'aac', 'ogg', 'wav', 'opus'] }] });
      if (r.canceled || !r.filePaths[0]) return { cancel: true };
      fs.mkdirSync(TRL, { recursive: true }); musClean(key);
      const ext = path.extname(r.filePaths[0]).slice(1).toLowerCase(), fin = path.join(TRL, key + '.mu.' + ext);
      fs.copyFileSync(r.filePaths[0], fin);
      return { url: pathToFileURL(fin).href };
    } catch (e) { return { err: String(e.message || e) }; }
  });
  ipcMain.handle('musUrl', async (_e, key, url) => {
    try {
      key = String(key || '').replace(/\W/g, ''); url = String(url || '').trim();
      if (!key || !/^https?:\/\/(www\.|m\.|music\.)?(youtube\.com|youtu\.be)\//i.test(url)) return { err: 'Pegá un link de YouTube' };
      fs.mkdirSync(TRL, { recursive: true }); await ytEnsure();
      const tmpA = path.join(TRL, key + '.dl.m4a'); try { fs.unlinkSync(tmpA); } catch (e) {}
      await new Promise((resolve) => require('child_process').execFile(YTX, [url, '--no-playlist', '--no-warnings', '-f', 'ba[ext=m4a]/ba[acodec^=mp4a]', '--max-filesize', '40M', '--socket-timeout', '20', '-o', tmpA], { timeout: 150000, windowsHide: true, maxBuffer: 4e6 }, () => resolve()));
      if (!fs.existsSync(tmpA)) return { err: 'No pude bajar ese link' };
      musClean(key);
      const fin = path.join(TRL, key + '.mu.m4a'); fs.renameSync(tmpA, fin);
      return { url: pathToFileURL(fin).href };
    } catch (e) { return { err: String(e.message || e) }; }
  });
  ipcMain.handle('musDel', (_e, key) => { try { key = String(key || '').replace(/\W/g, ''); musClean(key); fs.writeFileSync(path.join(TRL, key + '.nm'), ''); return true; } catch (e) { return false; } });
  /* mantenimiento: mover un juego a otro disco (copia, verifica y recién después ofrece borrar el original) */
  const dirBytes = (d, lim) => { let n = 0, t = Date.now(); const st = [d]; while (st.length) { const x = st.pop(); let es; try { es = fs.readdirSync(x, { withFileTypes: true }); } catch (e) { continue; } for (const e of es) { const p = path.join(x, e.name); if (e.isDirectory()) st.push(p); else { try { n += fs.statSync(p).size; } catch (e2) {} } } if (Date.now() - t > (lim || 20000)) return -1; } return n; };
  ipcMain.handle('gmInfo', (_e, exe) => { try { const dir = path.dirname(String(exe || '')); if (!exe || !fs.existsSync(dir) || dir.length < 6 || /^[a-z]:\\?$/i.test(dir) || /windowsapps/i.test(dir)) return { none: true }; return { dir, bytes: dirBytes(dir, 25000) }; } catch (e) { return { none: true }; } });
  ipcMain.handle('gmMove', async (_e, o) => {
    try {
      const from = String((o && o.from) || ''); if (!from || !fs.existsSync(from)) return { err: 'No encuentro la carpeta del juego' };
      const r = await dialog.showOpenDialog(win, { title: 'Elegí el disco o carpeta de destino', properties: ['openDirectory', 'createDirectory'] });
      if (r.canceled || !r.filePaths[0]) return { cancel: true };
      const to = path.join(r.filePaths[0], path.basename(from));
      if (path.resolve(to).toLowerCase().startsWith(path.resolve(from).toLowerCase())) return { err: 'El destino no puede estar dentro del juego' };
      if (fs.existsSync(to)) return { err: 'Ya existe una carpeta con ese nombre en el destino' };
      const need = dirBytes(from, 25000); try { const fsx = fs.statfsSync(r.filePaths[0]); if (need > 0 && fsx.bavail * fsx.bsize < need * 1.05) return { err: 'No hay espacio suficiente en ese disco' }; } catch (e) {}
      await fs.promises.cp(from, to, { recursive: true });
      const a = dirBytes(from, 60000), b = dirBytes(to, 60000);
      if (a >= 0 && b >= 0 && a !== b) { try { await fs.promises.rm(to, { recursive: true, force: true }); } catch (e) {} return { err: 'La copia no quedó igual al original; no se cambió nada' }; }
      return { from, to };
    } catch (e) { return { err: String(e.message || e) }; }
  });
  ipcMain.handle('gmRm', async (_e, dir) => { try { dir = String(dir || ''); if (dir.length < 8 || /^[a-z]:\\?$/i.test(dir) || /windows|program files$|system32/i.test(dir)) return false; await fs.promises.rm(dir, { recursive: true, force: true }); return true; } catch (e) { return false; } });
  ipcMain.handle('gmOpen', (_e, p) => { try { shell.showItemInFolder(String(p || '')); return true; } catch (e) { return false; } });
  ipcMain.handle('trlPick', async (_e, key) => {
    try {
      key = String(key || '').replace(/\W/g, ''); if (!key) return { err: 'sin clave' };
      const r = await dialog.showOpenDialog(win, { title: 'Elegí el trailer', properties: ['openFile'], filters: [{ name: 'Video', extensions: ['mp4', 'webm', 'mov', 'm4v'] }] });
      if (r.canceled || !r.filePaths[0]) return { cancel: true };
      fs.mkdirSync(TRL, { recursive: true });
      for (const f of fs.readdirSync(TRL)) if (f.startsWith(key + '.') && !/\.(mu\.\w+|nm)$/.test(f)) { try { fs.unlinkSync(path.join(TRL, f)); } catch (e) {} }
      const ext = (path.extname(r.filePaths[0]).slice(1).toLowerCase() === 'webm') ? 'webm' : 'mp4', fin = path.join(TRL, key + '.' + ext);
      fs.copyFileSync(r.filePaths[0], fin); fs.writeFileSync(path.join(TRL, key + '.cu'), '');
      return { url: pathToFileURL(fin).href };
    } catch (e) { return { err: String(e.message || e) }; }
  });
  ipcMain.handle('trlDel', (_e, key) => { try { key = String(key || '').replace(/\W/g, ''); for (const f of fs.readdirSync(TRL)) if (f.startsWith(key + '.') && !/\.(mu\.\w+|nm)$/.test(f)) fs.unlinkSync(path.join(TRL, f)); fs.writeFileSync(path.join(TRL, key + '.nx'), ''); return true; } catch (e) { return false; } });
  ipcMain.handle('trlClear', () => { try { for (const f of fs.readdirSync(TRL)) if (f !== 'yt-dlp.exe') fs.unlinkSync(path.join(TRL, f)); } catch (e) {} return true; });
  ipcMain.handle('pickVideo', async () => {
    const r = await dialog.showOpenDialog(win, { title: 'Elegí el tráiler', properties: ['openFile'], filters: [{ name: 'Video', extensions: ['mp4', 'webm', 'mkv', 'mov'] }] });
    return r.canceled ? '' : pathToFileURL(r.filePaths[0]).href;
  });
  ipcMain.handle('pickExe', async () => {
    const r = await dialog.showOpenDialog(win, { title: 'Elegí el juego', properties: ['openFile'], filters: [{ name: 'Programas', extensions: ['exe'] }] });
    return r.canceled ? '' : r.filePaths[0];
  });
  ipcMain.handle('cacheInfo', () => { let n = 0, b = 0; try { for (const f of fs.readdirSync(CACHE)) { n++; b += fs.statSync(path.join(CACHE, f)).size; } } catch (e) {} let tn = 0, tb = 0; try { const td = path.join(app.getPath('userData'), 'trailers'); for (const f of fs.readdirSync(td)) { if (!/\.(mp4|webm)$/.test(f)) continue; tn++; tb += fs.statSync(path.join(td, f)).size; } } catch (e) {} let mn = 0, mb = 0; try { const td = path.join(app.getPath('userData'), 'trailers'); for (const f of fs.readdirSync(td)) { if (!/\.mu\.(m4a|mp3|ogg|wav|opus|aac)$/.test(f)) continue; mn++; mb += fs.statSync(path.join(td, f)).size; } } catch (e) {} return { n, mb: Math.round(b / 1048576), dir: CACHE, tn, tmb: Math.round(tb / 1048576), mn, mmb: Math.round(mb / 1048576) }; });
  ipcMain.handle('clearCache', () => { try { for (const f of fs.readdirSync(CACHE)) fs.unlinkSync(path.join(CACHE, f)); } catch (e) {} loadIdx(); bad.clear(); return true; });
  ipcMain.handle('scanEpic', async () => { try { return scanEpic(); } catch (e) { return { found: false, list: [] }; } });
  ipcMain.handle('epicImport', async (_e, o) => { try { return await epicImport(o); } catch (e) { return { ok: false, err: 'Error inesperado con Epic', diag: String(e && e.message || e) }; } });
  ipcMain.handle('steamImport', async () => { try { return await steamImport(); } catch (e) { return { ok: false, err: 'Error inesperado con Steam', diag: String(e && e.message || e) }; } });
  ipcMain.handle('xboxImport', async () => { try { return await xboxImport(); } catch (e) { return { ok: false, err: 'Error inesperado con Xbox', diag: String(e && e.message || e) }; } });
  ipcMain.handle('scanXbox', async () => { try { return await scanXbox(); } catch (e) { return { found: false, list: [] }; } });
  ipcMain.handle('pickDir', async () => { const r = await dialog.showOpenDialog(win, { title: 'Elegí la carpeta para las copias', properties: ['openDirectory', 'createDirectory'] }); return r.canceled ? '' : r.filePaths[0]; });
  ipcMain.handle('bkCheck', async (_e, o) => bkCheck(o || {}));
  ipcMain.handle('writeBackup', async (_e, o) => { try { return { ok: true, file: writeBackup(o) }; } catch (e) { return { ok: false, err: String(e.message || e) }; } });
  ipcMain.handle('fullscreen', (_e, on) => { if (win) win.setFullScreen(!!on); return win ? win.isFullScreen() : false; });
  ipcMain.handle('installed', (_e, d) => { try { return installedApps(d); } catch (e) { return { ok: false, apps: [] }; } });
  ipcMain.handle('shots', (_e, id) => listShots(id));
  ipcMain.handle('tmFind', (_e, o) => tmFind({ name: String(o.name || ''), exe: String(o.exe || ''), online: !!o.online }));
  ipcMain.handle('tmSnap', (_e, o) => { try { return tmSnap(o || {}); } catch (e) { return { ok: false, err: String(e.message || e) }; } });
  ipcMain.handle('tmList', (_e, o) => { try { return tmVers(o.id, o.dir); } catch (e) { return []; } });
  ipcMain.handle('tmRestore', (_e, o) => { try { return tmRestore(o || {}); } catch (e) { return { ok: false, err: String(e.message || e) }; } });
  ipcMain.handle('tmDel', (_e, o) => tmDel(o || {}));
  ipcMain.handle('tmPin', (_e, o) => tmPin(o || {}));
  ipcMain.handle('tmOpen', (_e, o) => { const d = path.join(tmRoot(o.dir), o.id ? tmSan(o.id) : ''); try { fs.mkdirSync(d, { recursive: true }); } catch (e) {} shell.openPath(d); return d; });
  ipcMain.handle('tmPick', async (_e, t) => { const r = await dialog.showOpenDialog(win, { title: String(t || 'Elegí la carpeta'), properties: ['openDirectory', 'createDirectory'] }); return r.canceled ? '' : r.filePaths[0]; });
  ipcMain.handle('worldList', () => { try { return worldList(); } catch (e) { return []; } });
  ipcMain.handle('worldPack', (_e, o) => worldPack(o || {}));
  ipcMain.handle('worldRead', (_e, o) => worldRead(o || {}));
  ipcMain.handle('worldDrop', (_e, id) => worldDrop(String(id)));
  ipcMain.handle('worldRecvOpen', (_e, o) => { try { return worldRecvOpen(o || {}); } catch (e) { return false; } });
  ipcMain.handle('worldRecvChunk', (_e, o) => { try { return worldRecvChunk(o || {}); } catch (e) { return false; } });
  ipcMain.handle('worldRecvClose', (_e, o) => worldRecvClose(o || {}));
  ipcMain.handle('worldOpen', (_e, p) => { try { if (fs.existsSync(p)) shell.showItemInFolder(path.join(p, '..', path.basename(p))); } catch (e) {} return true; });
  ipcMain.handle('emScan', (_e, o) => { try { return emScan(o || {}); } catch (e) { return []; } });
  ipcMain.handle('emInstall', async (_e, id) => { try { return await emInstall(String(id)); } catch (e) { return { ok: false, err: 'net' }; } });
  ipcMain.handle('bkRead', (_e, d) => { try { return bkRead(d); } catch (e) { return { ok: false, err: 'bad' }; } });
  ipcMain.handle('lsvScan', async (_e, o) => { try { return await lsvScan(o || {}); } catch (e) { return { ok: false, err: 'net' }; } });
  ipcMain.handle('driveFind', () => { try { return driveFind(); } catch (e) { return ''; } });
  ipcMain.handle('emDetect', (_e, c) => { try { return emDetect(Array.isArray(c) ? c.slice(0, 30) : []); } catch (e) { return {}; } });
  ipcMain.handle('emStates', (_e, o) => { try { return emStates(o || {}); } catch (e) { return []; } });
  ipcMain.handle('emPick', async (_e, t) => { const r = await dialog.showOpenDialog(win, { title: String(t || 'Elegí el emulador'), properties: ['openFile'], filters: [{ name: 'Programa', extensions: ['exe'] }] }); return r.canceled ? '' : r.filePaths[0]; });
  ipcMain.handle('raSet', (_e, o) => { if (o && typeof o.u === 'string') { cfg.raUser = o.u.trim().slice(0, 40); if (o.k) cfg.raKey = String(o.k).trim().slice(0, 80); if (!cfg.raUser) { delete cfg.raKey; } saveCfg(); RAC.game = {}; } return { u: cfg.raUser || '', has: !!cfg.raKey }; });
  ipcMain.handle('raGame', (_e, o) => raGame(o || {}));
  ipcMain.handle('aiStatus', () => aiStatus());
  ipcMain.handle('aiListen', () => aiListen());
  ipcMain.handle('aiSetup', (_e, m) => aiSetup(m));
  ipcMain.handle('aiAsk', (_e, o) => aiAsk(o));
  ipcMain.handle('shotScores', (_e, id) => { try { return shotScores(id); } catch (e) { return {}; } });
  ipcMain.handle('shotsMerge', (_e, o) => { try { return shotsMerge(o.from, o.to); } catch (e) { return { ok: false, err: String(e.message || e) }; } });
  ipcMain.handle('achToast', (_e, o) => { achToast(o); return true; });
  ipcMain.handle('clipSrc', async () => { try { const srcs = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 1, height: 1 } }); const d = screen.getPrimaryDisplay(); const x = srcs.find((q) => String(q.display_id) === String(d.id)) || srcs[0]; return x ? x.id : ''; } catch (e) { return ''; } });
  ipcMain.handle('ovData', (_e, o) => { try { o = o || {}; ovOpen({ id: String(o.id || ''), name: String(o.name || ''), items: Array.isArray(o.items) ? o.items : [], t: +o.t || 0, th: o.th || {} }); } catch (e) {} return true; });
  ipcMain.handle('ovState', (_e, o) => { try { if (ovWin && !ovWin.isDestroyed()) ovWin.webContents.send('ov', 'st', o); } catch (e) {} return true; });
  ipcMain.handle('ovAct', (_e, a) => { try {
    a = typeof a === 'string' ? { a } : (a || {});
    if (a.a === 'close') { ovClose(); return; }
    if (a.a === 'shot') { ovClose(); setTimeout(takeShot, 350); }
    if (a.a === 'clip') { ovClose(); setTimeout(takeClip, 350); }
    if (a.a === 'set' && ['ach', 'shots', 'chat', 'perf'].includes(a.k)) { cfg.ovPanes = Object.assign({}, cfg.ovPanes || {}, { [a.k]: !!a.v }); saveCfg(); }
    if (a.a === 'sel') send({ type: 'ovfr', op: 'sel', c: String(a.c || '').slice(0, 40) });
    if (a.a === 'send') send({ type: 'ovfr', op: 'send', c: String(a.c || '').slice(0, 40), x: String(a.x || '').slice(0, 500) });
  } catch (e) {} });
  ipcMain.handle('ovOpen', (_e, n) => { try { const cur = curNonSteam(); if (!cur || !/^c?[\d-T]+\.(jpg|png|webm)$/.test(String(n))) return; shell.openPath(path.join(SHOTS, String(cur.id).replace(/[^\w.-]/g, '_'), String(n))); } catch (e) {} });
  ipcMain.handle('pzScan', (_e, sd) => { try { return pzScan(String(sd || '')); } catch (e) { return { ok: false, mods: [], active: [] }; } });
  ipcMain.handle('pzApply', (_e, ids, sd) => pzApply(Array.isArray(ids) ? ids.slice(0, 600) : [], String(sd || '')));
  ipcMain.handle('pzSearch', (_e, q, p, so, tg, app) => pzSearch(q, p, String(so || ''), !!tg, app));
  ipcMain.handle('mcInfo', (_e, r) => mcInfo(r));
  ipcMain.handle('mcState', () => ({ cf: !!cfg.cfKey }));
  ipcMain.handle('mcKeySet', (_e, k) => { k = String(k || '').trim(); if (k && !/^\S{20,120}$/.test(k)) return { ok: false }; cfg.cfKey = k; saveCfg(); return { ok: true, key: !!k }; });
  ipcMain.handle('mcReq', (_e, o) => mcReq(o));
  ipcMain.handle('mcGet', (_e, o) => mcGet(o));
  ipcMain.handle('mcList', (_e, r, k) => mcList(r, String(k || 'mod')));
  ipcMain.handle('mcFile', (_e, o) => mcFileOp(o || {}));
  ipcMain.handle('mcPick', async () => { const r = await dialog.showOpenDialog(win, { title: 'Elegí la carpeta de Minecraft (la que tiene «mods»)', properties: ['openDirectory'] }); return r.canceled || !r.filePaths[0] ? '' : r.filePaths[0]; });
  ipcMain.handle('mcOpen', (_e, r, k) => { const d = mcDirOf(r, String(k || 'mod')); if (d) { try { fs.mkdirSync(d, { recursive: true }); } catch (e) {} shell.openPath(d); } });
  ipcMain.handle('nxState', () => ({ key: !!cfg.nxKey, prem: !!cfg.nxPrem, user: cfg.nxUser || '' }));
  ipcMain.handle('nxKeySet', async (_e, k) => {
    k = String(k || '').trim(); if (!k) { cfg.nxKey = ''; cfg.nxPrem = false; cfg.nxUser = ''; saveCfg(); return { ok: true, key: false }; }
    if (!/^[A-Za-z0-9+/=_-]{20,200}$/.test(k)) return { ok: false };
    cfg.nxKey = k; const r = await nxReq({ p: '/users/validate.json' });
    if (!r.ok || !r.d || !r.d.name) { cfg.nxKey = ''; saveCfg(); return { ok: false, err: r.err || 'bad' }; }
    cfg.nxPrem = !!r.d.is_premium; cfg.nxUser = String(r.d.name); saveCfg(); return { ok: true, key: true, prem: cfg.nxPrem, user: cfg.nxUser };
  });
  ipcMain.handle('nxReq', (_e, o) => nxReq(o));
  ipcMain.handle('nxGet', (_e, o) => nxGet(o));
  ipcMain.handle('nxOpenDir', (_e, d) => { d = String(d || ''); if (d && path.isAbsolute(d)) shell.openPath(d); });
  ipcMain.handle('mcScan', (_e, r) => { try { return mcScan(r); } catch (e) { return []; } });
  ipcMain.handle('mcPack', (_e, o) => mcPackInstall(o || {}));
  ipcMain.handle('mcNewRoot', (_e, n) => mcNewRoot(n));
  ipcMain.handle('nxmSet', (_e, on) => { on = !!on; cfg.nxm = on; saveCfg(); try { if (on) app.setAsDefaultProtocolClient('nxm'); else app.removeAsDefaultProtocolClient('nxm'); } catch (e) {} return { ok: true, on }; });
  ipcMain.handle('nxmState', () => !!cfg.nxm);
  ipcMain.handle('nxmReady', () => { setTimeout(nxmFlush, 200); return true; });
  ipcMain.handle('mioState', () => ({ key: !!cfg.mioKey, tok: !!cfg.mioTok }));
  ipcMain.handle('mioKeySet', (_e, k) => { k = String(k || '').trim(); if (k && !/^[a-f0-9]{32}$/i.test(k)) return { ok: false }; cfg.mioKey = k; if (!k) cfg.mioTok = ''; saveCfg(); return { ok: true, key: !!k }; });
  ipcMain.handle('mioReq', (_e, o) => mioReq(o));
  ipcMain.handle('mioLogin', async (_e, o) => {
    try {
      o = o || {}; if (!cfg.mioKey) return { ok: false, err: 'key' };
      if (o.step === 1) { const r = await net.fetch('https://api.mod.io/v1/oauth/emailrequest?api_key=' + cfg.mioKey, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' }, body: new URLSearchParams({ email: String(o.email || '').slice(0, 120) }).toString() }); return { ok: r.ok }; }
      if (o.step === 2) { const r = await net.fetch('https://api.mod.io/v1/oauth/emailexchange?api_key=' + cfg.mioKey, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' }, body: new URLSearchParams({ security_code: String(o.code || '').trim().slice(0, 10) }).toString() }); const j = await r.json().catch(() => null); if (r.ok && j && j.access_token) { cfg.mioTok = String(j.access_token); saveCfg(); return { ok: true }; } return { ok: false }; }
    } catch (e) {}
    return { ok: false };
  });
  ipcMain.handle('mioLogout', () => { cfg.mioTok = ''; saveCfg(); return true; });
  ipcMain.handle('pzDeps', (_e, w) => pzDeps(w));
  ipcMain.handle('wsList', (_e, app, sd) => wsList(app, String(sd || '')));
  ipcMain.handle('wsUnsub', (_e, wid, app) => wsUnsub(wid, app));
  ipcMain.handle('pzSub', (_e, wid, app) => pzSub(wid, false, app));
  ipcMain.handle('pzOpen', (_e, wid) => { try { if (/^\d{5,12}$/.test(String(wid))) shell.openExternal('steam://url/CommunityFilePage/' + wid); } catch (e) {} return true; });
  ipcMain.handle('clipDone', () => { clipBusy = false; recIcon(false); return true; });
  /* salida rápida de la Bóveda: minimiza todo, baja el volumen y abre YouTube */
  let panicVol = 0;
  const volKeys = (vk, n) => { if (process.platform !== 'win32') return; try { require('child_process').execFile('powershell.exe', ['-NoProfile', '-WindowStyle', 'Hidden', '-Command', "Add-Type -TypeDefinition 'using System;using System.Runtime.InteropServices;public class WK{[DllImport(\"user32.dll\")]public static extern void keybd_event(byte b,byte s,uint f,UIntPtr e);}'; 1.." + n + " | ForEach-Object { [WK]::keybd_event(" + vk + ",0,0,[UIntPtr]::Zero); [WK]::keybd_event(" + vk + ",0,2,[UIntPtr]::Zero) }"], { windowsHide: true, timeout: 15000 }, () => {}); } catch (e) {} };
  const panicDo = () => {
    try {
      if (process.platform === 'win32') {
        require('child_process').execFile('powershell.exe', ['-NoProfile', '-WindowStyle', 'Hidden', '-Command', '(New-Object -ComObject Shell.Application).MinimizeAll()'], { windowsHide: true, timeout: 10000 }, () => {});
        if (!panicVol) { panicVol = 20; volKeys(174, 20); }
      }
      setTimeout(() => { try { shell.openExternal('https://www.youtube.com'); } catch (e) {} }, 450);
    } catch (e) {}
  };
  const panicBack = () => { if (panicVol) { const n = panicVol; panicVol = 0; volKeys(175, n); } };
  /* doble toque de Ctrl (solo mientras corre un juego de la Bóveda): un proceso mínimo lee el estado de la tecla */
  let panicProc = null, panicLast = 0;
  const panicStop = () => { if (panicProc) { try { panicProc.kill(); } catch (e) {} panicProc = null; } };
  const panicStart = () => {
    if (panicProc || process.platform !== 'win32') return;
    const script = "Add-Type -TypeDefinition 'using System;using System.Runtime.InteropServices;public class WG{[DllImport(\"user32.dll\")]public static extern short GetAsyncKeyState(int k);}'; $p=$false; while($true){ $d=([WG]::GetAsyncKeyState(0x11) -band 0x8000) -ne 0; if($d -and -not $p){ [Console]::Out.WriteLine('C'); [Console]::Out.Flush() }; $p=$d; Start-Sleep -Milliseconds 25 }";
    try {
      panicProc = require('child_process').spawn('powershell.exe', ['-NoProfile', '-WindowStyle', 'Hidden', '-Command', script], { windowsHide: true, stdio: ['ignore', 'pipe', 'ignore'] });
      panicProc.stdout.on('data', (d) => { const n = String(d).split('C').length - 1; for (let i = 0; i < n; i++) { const t = Date.now(); if (t - panicLast < 450) { panicLast = 0; panicDo(); } else panicLast = t; } });
      panicProc.on('exit', () => { panicProc = null; });
    } catch (e) { panicProc = null; }
  };
  app.on('will-quit', panicStop);
  ipcMain.handle('vpanicArm', (_e, on) => { try { if (on) panicStart(); else { panicStop(); panicBack(); } } catch (e) {} return { on: !!panicProc }; });
  ipcMain.handle('vpanicNow', () => { panicDo(); return true; });
  ipcMain.handle('clipRec', (_e, on) => { recIcon(!!on); return true; });
  ipcMain.handle('clipSave', (_e, o) => {
    try {
      o = o || {}; const dir = path.join(SHOTS, String(o.id).replace(/[^\w.-]/g, '_')); fs.mkdirSync(dir, { recursive: true });
      const buf = Buffer.from(o.data); if (!buf.length || buf.length > 200 * 1024 * 1024) { clipBusy = false; return { ok: false }; }
      const stamp = 'c' + new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19), file = path.join(dir, stamp + '.webm');
      fs.writeFileSync(file, buf);
      let th = null; try { const m = /^data:image\/jpeg;base64,(.+)$/.exec(o.thumb || ''); if (m) { th = Buffer.from(m[1], 'base64'); fs.writeFileSync(path.join(dir, stamp + '.t.jpg'), th); } } catch (e) {}
      clipBusy = false; shotToast(th, 'Clip guardado', 'clip', String(o.info || '').slice(0, 60));
      return { ok: true, file: pathToFileURL(file).href };
    } catch (e) { clipBusy = false; return { ok: false }; }
  });
  ipcMain.handle('shotDel', (_e, id, n) => { try { const dir = path.join(SHOTS, String(id).replace(/[^\w.-]/g, '_')); if (!/^c?[\d-T]+\.(jpg|png|webm)$/.test(n)) return false; fs.unlinkSync(path.join(dir, n)); try { fs.unlinkSync(path.join(dir, n.replace(/\.(jpg|png|webm)$/, '.t.jpg'))); } catch (e) {} return true; } catch (e) { return false; } });
  ipcMain.handle('shotFolder', (_e, id) => { const dir = id ? path.join(SHOTS, String(id).replace(/[^\w.-]/g, '_')) : SHOTS; try { fs.mkdirSync(dir, { recursive: true }); } catch (e) {} shell.openPath(dir); return dir; });
  ipcMain.handle('shotCfg', (_e, o) => { if (o && typeof o.shots === 'boolean') cfg.shots = o.shots; if (o && typeof o.key === 'string' && /^[\w+]+$/.test(o.key)) cfg.shotKey = o.key; if (o && typeof o.clipKey === 'string' && /^[\w+]+$/.test(o.clipKey)) cfg.clipKey = o.clipKey; saveCfg(); syncShot(); return { shots: cfg.shots, shotKey: cfg.shotKey, clipKey: cfg.clipKey }; });
  ipcMain.handle('friendToast', (_e, o) => { friendToast(o); return true; })
  ipcMain.handle('scrSources', async () => {
    const srcs = await desktopCapturer.getSources({ types: ['screen', 'window'], thumbnailSize: { width: 320, height: 180 }, fetchWindowIcons: false });
    return srcs.filter(s => !s.thumbnail.isEmpty() && s.name !== 'WINTEER').map(s => ({ id: s.id, name: s.name, th: s.thumbnail.toDataURL() }));
  });
  ipcMain.handle('scrPick', (_e, id, audio) => { scrPickId = String(id || ''); scrPickAudio = !!audio; return true; });;
  ipcMain.handle('winCtl', (_e, a) => { if (!win) return; if (a === 'min') win.minimize(); else if (a === 'max') { if (win.isMaximized()) win.unmaximize(); else win.maximize(); } else if (a === 'close') win.close(); });
  ipcMain.handle('quit', () => { quitting = true; app.quit(); });
  ipcMain.handle('cfgGet', () => { const c = Object.assign({ win: process.platform === 'win32' }, cfg); delete c.mioKey; delete c.mioTok; delete c.cfKey; delete c.nxKey; delete c.raKey; return c; });
  ipcMain.handle('cfgSet', (_e, o) => { if (o && ['bg', 'auto', 'pad'].includes(o.k)) { cfg[o.k] = !!o.v; if (o.k === 'bg' && !cfg.bg) cfg.auto = false; saveCfg(); applyBg(); } return cfg; });
  ipcMain.handle('toBg', () => { if (!win) return; fromBg = false; bgForGame = true; win.setFullScreen(false); if (cfg.bg) hideWin(); else win.minimize(); });
  ipcMain.handle('bpClosed', () => { if (fromBg && cfg.bg && win) { fromBg = false; win.setFullScreen(false); hideWin(); } fromBg = false; });
  startApp();
  try { if (cfg.nxm) app.setAsDefaultProtocolClient('nxm'); } catch (e) {}
  nxmArgv(process.argv);
});
app.on('second-instance', (_e, argv) => { showWin(); nxmArgv(argv); });
app.on('before-quit', () => { quitting = true; stopPad(); try { globalShortcut.unregisterAll(); } catch (e) {} });
app.on('window-all-closed', () => { if (!cfg.bg || quitting) app.quit(); });
