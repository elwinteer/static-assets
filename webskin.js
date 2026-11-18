/* Estilos de WINTEER para sitios web del navegador integrado: fondo oscuro neutro y colores en escala de grises (sin tintes de marca).
   Se aplica por sitio (ver SKINS); no toca imágenes ni videos. */
'use strict';
const SKINS = [
  { name: 'steamrip', test: /(^|\.)steamrip\.com$/i, css: `
    html{background:radial-gradient(60% 45% at 18% 0%,rgba(255,255,255,.07),transparent 70%),radial-gradient(50% 40% at 88% 8%,rgba(255,255,255,.045),transparent 70%),radial-gradient(70% 50% at 50% 100%,rgba(255,255,255,.03),transparent 70%),#07060f fixed!important;background-image:none}
    html{background:radial-gradient(60% 45% at 18% 0%,rgba(255,255,255,.07),transparent 70%),radial-gradient(50% 40% at 88% 8%,rgba(255,255,255,.045),transparent 70%),radial-gradient(70% 50% at 50% 100%,rgba(255,255,255,.03),transparent 70%),#07060f!important;background-attachment:fixed!important;scroll-behavior:smooth}
    body{background:transparent!important;background-image:none!important}
    body:before,body:after,html:before,html:after{background-image:none!important}
    html{animation:wtIn .6s cubic-bezier(.22,1,.36,1) backwards}
    @keyframes wtIn{from{opacity:0}}
    @keyframes wtUp{from{opacity:0;transform:translateY(14px)}}
    .wt-frame{border:1px solid rgba(255,255,255,.09)!important;box-shadow:0 30px 80px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.02)!important;margin-top:18px!important;margin-bottom:24px!important;border-radius:22px;animation:wtUp .7s .05s cubic-bezier(.22,1,.36,1) backwards}
    a,button,input,select,textarea,[role=button]{transition:background-color .25s,color .25s,border-color .25s,opacity .25s,box-shadow .35s,transform .35s cubic-bezier(.22,1,.36,1),filter .3s}
    button:active,[role=button]:active{transform:scale(.97)}
    a:hover>img,a:hover img{transform:scale(1.035);filter:brightness(1.08)}
    a img{transition:transform .5s cubic-bezier(.22,1,.36,1),filter .3s}
    #wt-console>[slot=c]{display:block!important;position:static!important;width:100%!important;max-width:none!important;margin:0!important;padding:0!important;float:none!important;background:transparent!important;color:#d6d7e2!important;border:0!important;box-shadow:none!important;font-family:"Segoe UI",system-ui,sans-serif!important}
    #wt-console>[slot=c] *{background-color:transparent!important;border-color:rgba(255,255,255,.1)!important;box-shadow:none!important;max-width:100%!important;font-family:inherit!important}
    #wt-console>[slot=c] :is(p,span,div,li,small,time,cite,label,h1,h2,h3,h4,h5){color:#d6d7e2!important}
    #wt-console>[slot=c] :is(h1,h2,h3,h4,h5,.comments-title,.comment-author,.fn,b,strong){color:#fff!important}
    #wt-console>[slot=c] a{color:#fff!important;text-decoration-color:rgba(255,255,255,.3)!important;transition:opacity .25s}
    #wt-console>[slot=c] a:hover{opacity:.75}
    #wt-console>[slot=c] :is(ol,ul){list-style:none!important;margin:0!important;padding:0!important}
    #wt-console>[slot=c] :is(.comment,.wpd-comment,li.comment,.comment-body){background-color:rgba(255,255,255,.035)!important;border:1px solid rgba(255,255,255,.07)!important;border-radius:16px!important;padding:14px 18px!important;margin:10px 0!important;animation:wtUp .5s cubic-bezier(.22,1,.36,1) backwards}
    #wt-console>[slot=c] :is(.children,.wpd-reply){margin-left:22px!important;border-left:2px solid rgba(255,255,255,.08)!important;padding-left:8px!important}
    #wt-console>[slot=c] img.avatar,#wt-console>[slot=c] .avatar{border-radius:50%!important}
    #wt-console>[slot=c] :is(input:not([type=submit]):not([type=checkbox]),textarea,select){background-color:rgba(255,255,255,.06)!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:12px!important;padding:10px 14px!important;color:#fff!important;outline:none!important;transition:border-color .3s,background-color .3s!important}
    #wt-console>[slot=c] :is(input,textarea):focus{border-color:rgba(255,255,255,.4)!important;background-color:rgba(255,255,255,.09)!important}
    #wt-console>[slot=c] :is(button,input[type=submit],.submit,.wpd-submit){background-color:#f4f4f8!important;color:#0b0b13!important;border:0!important;border-radius:12px!important;font-weight:700!important;padding:10px 20px!important;cursor:pointer!important;transition:transform .35s cubic-bezier(.22,1,.36,1)!important}
    #wt-console>[slot=c] :is(button,input[type=submit]):hover{transform:translateY(-2px)}
    ::selection{background:rgba(255,255,255,.25)!important;color:#fff!important}
    ::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-track{background:#08080d}::-webkit-scrollbar-thumb{background:#2a2a34;border-radius:10px}::-webkit-scrollbar-thumb:hover{background:#3b3b48}
    html.wt-console-on{overflow:hidden!important}html.wt-console-on body>*:not(#wt-console):not([slot]){visibility:hidden!important}
    @media (prefers-reduced-motion:reduce){html,.wt-frame{animation:none!important}*{transition:none!important}}
  `, mono: true },
  { name: 'fitgirl', test: /(^|\.)fitgirl-repacks\.site$/i, css: `
    html,body{background:#07060f!important;color:#d6d7e2!important}
    a{color:#fff}
  `, mono: true },
];
// Recolorea tonos violetas/azulados de marca a grises neutros (fondos oscuros, bordes sutiles, texto claro). Corre dentro de la página.
const MONO_JS = `(() => {
  if (window.__wtMono) return; window.__wtMono = 1;
  const seen = new WeakSet(), RGB = /rgba?\\(\\s*(\\d+)[ ,]+(\\d+)[ ,]+(\\d+)(?:[ ,\\/]+([\\d.]+%?))?\\s*\\)/g;
  const hsl = (r, g, b) => { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn; let h = 0, s = 0;
    if (d) { s = d / (1 - Math.abs(2 * l - 1)); h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; } return [h, s, l]; };
  const brand = (r, g, b) => { const [h, s, l] = hsl(r, g, b); return s > 0.12 && h >= 215 && h <= 335 && l > 0.02 && l < 0.97; };
  const gray = (v, a) => 'rgba(' + v + ',' + v + ',' + v + ',' + (a == null ? 1 : a) + ')';
  const mapBg = (r, g, b, a) => { const [, , l] = hsl(r, g, b); const v = Math.round(255 * (l < 0.2 ? l * 0.45 + 0.012 : Math.min(l, 0.2) * 0.6 + 0.02)); return gray(v, a); };
  const mapFg = (r, g, b, a) => { const [, , l] = hsl(r, g, b); return gray(l > 0.35 ? 240 : 150, a); };
  const mapBd = (r, g, b, a) => 'rgba(255,255,255,' + (a == null ? 0.14 : Math.min(0.2, a)) + ')';
  const alpha = (t) => t == null ? 1 : String(t).endsWith('%') ? parseFloat(t) / 100 : parseFloat(t);
  const swap = (s, fn) => s.replace(RGB, (m, r, g, b, a) => brand(+r, +g, +b) ? fn(+r, +g, +b, alpha(a)) : m);
  const PROPS = [['backgroundColor', 'background-color', mapBg], ['color', 'color', mapFg], ['borderTopColor', 'border-top-color', mapBd], ['borderRightColor', 'border-right-color', mapBd], ['borderBottomColor', 'border-bottom-color', mapBd], ['borderLeftColor', 'border-left-color', mapBd], ['outlineColor', 'outline-color', mapBd]];
  const fix = (el) => {
    if (seen.has(el) || el.nodeType !== 1) return; seen.add(el);
    const tg = el.tagName; if (tg === 'IMG' || tg === 'VIDEO' || tg === 'CANVAS' || tg === 'SCRIPT' || tg === 'STYLE' || tg === 'SVG' || tg === 'PATH') return;
    const cs = getComputedStyle(el);
    for (const [js, css, fn] of PROPS) { const v = cs[js]; if (!v || v.indexOf('rgb') < 0) continue; const n = swap(v, fn); if (n !== v) el.style.setProperty(css, n, 'important'); }
    const bi = cs.backgroundImage; if (bi && bi.indexOf('gradient') >= 0 && bi.indexOf('rgb') >= 0) { const n = swap(bi, mapBg); if (n !== bi) el.style.setProperty('background-image', n, 'important'); }
    const sh = cs.boxShadow; if (sh && sh !== 'none' && sh.indexOf('rgb') >= 0) { const n = swap(sh, (r, g, b, a) => gray(0, Math.min(a, 0.5))); if (n !== sh) el.style.setProperty('box-shadow', n, 'important'); }
  };
  const run = (root) => { const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT); let n = w.currentNode, i = 0; const batch = () => { let k = 0; while (n && k++ < 400) { fix(n); n = w.nextNode(); } if (n) setTimeout(batch, 16); }; batch(); };
  run(document.documentElement);
  let pend = [], t = 0;
  new MutationObserver((ms) => { for (const m of ms) for (const a of m.addedNodes) if (a.nodeType === 1) pend.push(a); if (!t) t = setTimeout(() => { t = 0; const l = pend; pend = []; for (const a of l) { fix(a); a.querySelectorAll && a.querySelectorAll('*').forEach(fix); } }, 50); }).observe(document.documentElement, { childList: true, subtree: true });
  // Marco: el contenedor central de la página, igual que un panel del launcher.
  const frame = () => { try { const W = innerWidth; let best = null, ba = 0;
    for (const el of document.body.querySelectorAll('body > *, body > * > *, body > * > * > *')) { const r = el.getBoundingClientRect(); if (r.width < 500 || r.width > W - 40 || r.height < 400) continue; if (Math.abs(r.left - (W - r.right)) > 24) continue; const a = r.width * Math.min(r.height, 4000); if (a > ba) { ba = a; best = el; } }
    if (best) best.classList.add('wt-frame'); } catch (e) {} };
  setTimeout(frame, 700); setTimeout(frame, 2500);
})();`;

// Página de juego de SteamRIP convertida en un menú tipo consola: portada, datos (tamaño, versión), requisitos, enlaces de descarga y comentarios en pestañas.
// Se ejecuta dentro de la página. Si no encuentra título + portada + enlaces, deja la página original intacta.
function steamripConsole() {
  if (window.__wtConsole) return; window.__wtConsole = 1;
  const HOSTS = { 'megadb.net': 'MegaDB', 'gofile.io': 'Gofile', '1fichier.com': '1Fichier', 'buzzheavier.com': 'BuzzHeavier', 'bzzhr.co': 'BuzzHeavier', 'bzzhr.to': 'BuzzHeavier', 'bzzheavier.com': 'BuzzHeavier', 'flashbang.sh': 'BuzzHeavier', 'vikingfile.com': 'VikingFile', 'pixeldrain.com': 'Pixeldrain', 'mediafire.com': 'MediaFire', 'filecrypt.cc': 'FileCrypt', 'filecrypt.co': 'FileCrypt', 'datanodes.to': 'DataNodes', 'ddownload.com': 'DDownload', 'rapidgator.net': 'Rapidgator', 'drive.google.com': 'Google Drive', 'mega.nz': 'MEGA', 'qiwi.gg': 'Qiwi', 'workupload.com': 'Workupload', 'send.cm': 'Send.cm', 'uploadhaven.com': 'UploadHaven', 'turbobit.net': 'Turbobit' };
  const BAD = /(discord|facebook|twitter|x\.com|instagram|youtube|youtu\.be|t\.me|telegram|reddit|steampowered|patreon|ko-fi|paypal|store\.epicgames|gog\.com)/i;
  const clean = (t) => String(t || '').replace(/\s+/g, ' ').replace(/\s*[-–—|:]?\s*(?:free\s*)?download(?:ed)?(?:\s*(?:free|game|pc|full|now))*\s*$/i, '').replace(/\s*[-–—|:(\[]?\s*free\s*download\w*\)?\]?/ig, ' ').replace(/\s*[-–—|(\[]?\s*\bbuild\s*\d+[^)\]]*[)\]]?/ig, ' ').replace(/\s+[-–—|]\s*v?\d+(\.\d+)+\S*\s*$/i, '').replace(/\s+/g, ' ').replace(/[\s\-–—|:]+$/, '').trim();
  const T = (n) => (n && n.textContent || '').replace(/\s+/g, ' ').trim();
  const host = (u) => { try { return new URL(u, location.href).hostname.replace(/^www\./, ''); } catch (e) { return ''; } };
  // requisitos: "OS: …  Processor: …" (mínimos / recomendados)
  const KEYS = [[/^(os|operating system|sistema operativo)$/i, 'Sistema'], [/^(processor|cpu)$/i, 'Procesador'], [/^(memory|ram)$/i, 'Memoria'], [/^(graphics|video card|gpu|graphics card)$/i, 'Gráficos'], [/^directx$/i, 'DirectX'], [/^(storage|hard drive|hdd|disk space|available space|hard disk space)$/i, 'Espacio'], [/^(network)$/i, 'Red'], [/^(sound card)$/i, 'Sonido']];
  const SPLIT = /(?=\b(?:OS|Operating System|Processor|CPU|Memory|RAM|Graphics Card|Graphics|Video Card|GPU|DirectX|Storage|Hard Drive|Hard Disk Space|Disk Space|Available Space|Network|Sound Card)\s*:)/i;
  const parseReq = (lines) => {
    const out = { min: {}, rec: {} }; let mode = 'min';
    for (const ln of lines) {
      if (/^recommended\b/i.test(ln)) mode = 'rec'; else if (/^minimum\b/i.test(ln)) mode = 'min';
      for (const part of ln.split(SPLIT)) {
        const m = /^([A-Za-z ]{2,24}?)\s*:\s*(.+)$/.exec(part.trim()); if (!m) continue;
        const k = KEYS.find(([re]) => re.test(m[1].trim())); if (k && !out[mode][k[1]]) out[mode][k[1]] = m[2].replace(/\s+/g, ' ').trim().slice(0, 140);
      }
    }
    return out;
  };
  const AMBCSS = `.base{position:fixed;inset:0;background:radial-gradient(60% 45% at 18% 0%,rgba(255,255,255,.07),transparent 70%),radial-gradient(50% 40% at 88% 8%,rgba(255,255,255,.045),transparent 70%),#07060f}
      .amb{position:fixed;inset:0;overflow:hidden;pointer-events:none}
      .orb{position:absolute;border-radius:50%;filter:blur(80px);background:radial-gradient(circle,rgba(255,255,255,.2),transparent 65%);opacity:.55;animation:orb var(--d) ease-in-out infinite alternate}
      @keyframes orb{from{transform:translate(0,0) scale(1)}to{transform:translate(var(--x),var(--y)) scale(1.3)}}
      .pt{position:absolute;bottom:-12px;left:var(--l);width:var(--s);height:var(--s);border-radius:50%;background:rgba(255,255,255,var(--a));filter:blur(var(--b));animation:fup var(--t) linear var(--dl) infinite}
      @keyframes fup{0%{transform:translate(0,0);opacity:0}12%{opacity:1}88%{opacity:1}100%{transform:translate(var(--dx),-108vh);opacity:0}}
      .beam{position:absolute;top:-25%;left:-40%;width:55%;height:150%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.04),transparent);transform:rotate(12deg);animation:bm 22s ease-in-out infinite alternate}
      @keyframes bm{from{transform:translateX(0) rotate(12deg)}to{transform:translateX(230%) rotate(12deg)}}
      .vig{position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 38%,transparent 55%,rgba(0,0,0,.5))}
      @keyframes br{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:.7;transform:scale(1.08)}}`;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const AMB = '<div class="amb"><div class="beam"></div>' + [0, 1, 2].map((i) => '<div class="orb" style="left:' + [8, 62, 34][i] + '%;top:' + [12, 55, 78][i] + '%;width:' + [420, 520, 380][i] + 'px;height:' + [420, 520, 380][i] + 'px;--x:' + [120, -160, 90][i] + 'px;--y:' + [90, -70, -110][i] + 'px;--d:' + [19, 26, 22][i] + 's"></div>').join('') + Array.from({ length: 30 }, () => { const sz = rnd(1.5, 4.5); return '<i class="pt" style="--l:' + rnd(0, 100).toFixed(1) + '%;--s:' + sz.toFixed(1) + 'px;--a:' + rnd(.25, .8).toFixed(2) + ';--b:' + (sz > 3.4 ? 1.2 : 0) + 'px;--t:' + rnd(14, 30).toFixed(1) + 's;--dl:-' + rnd(0, 30).toFixed(1) + 's;--dx:' + rnd(-90, 90).toFixed(0) + 'px"></i>'; }).join('') + '<div class="vig"></div></div>';
  const build = () => {
    const h1 = document.querySelector('h1.entry-title, .entry-header h1, article h1, h1'); if (!h1) return 0;
    const raw = T(h1), title = clean(raw); if (!title) return 0;
    const root = document.querySelector('.entry-content, .post-content, .post-entry, article .content, article') || document.body;
    let cover = (document.querySelector('meta[property="og:image"]') || {}).content || '';
    const imgs = [...root.querySelectorAll('img')].filter((i) => (i.naturalWidth || i.width) >= 200 && !/logo|avatar|emoji|icon/i.test(i.src + i.className));
    if (!cover && imgs[0]) cover = imgs[0].currentSrc || imgs[0].src;
    if (!cover) return 0;
    const seen = new Set(), links = [];
    for (const a of root.querySelectorAll('a[href]')) {
      const href = a.href; if (!href || seen.has(href) || /^javascript:|^#/.test(href) || href === location.href) continue;
      const hn = host(href), tx = T(a), mg = /^magnet:/i.test(href), tor = /\.torrent(\?|$)/i.test(href);
      if (BAD.test(hn)) continue;
      const known = Object.keys(HOSTS).find((k) => hn === k || hn.endsWith('.' + k));
      if (!(known || mg || tor || (/^(download|mirror|direct|link|torrent|magnet|click|here)/i.test(tx) && hn))) continue;
      seen.add(href);
      links.push({ href, name: mg || tor ? 'Torrent' : known ? HOSTS[known] : /steamrip/i.test(hn) ? (tx || 'Descarga') : hn.split('.').slice(-2, -1)[0].replace(/^./, (c) => c.toUpperCase()), sub: mg ? 'Enlace magnet' : tor ? 'Archivo .torrent' : (tx && tx.length < 40 ? tx : hn) });
    }
    const pri = (l) => /bzzhr|bzzheavier|buzzheavier/i.test(l.href) ? 0 : 1; links.sort((x, y) => pri(x) - pri(y));
    if (!links.length) return 0;
    const cats = [...document.querySelectorAll('a[rel~=tag], a[rel~=category], .post-cat a, .meta-category a, .post-categories a')].map(T).filter((x, i, a) => x && a.indexOf(x) === i).slice(0, 6);
    const tm = document.querySelector('time'), date = tm ? T(tm) : '';
    const blocks = []; let sec = null;
    for (const n of root.querySelectorAll('h2,h3,h4,p,li,div.wp-block-group p')) {
      if (n.closest('a') || n.closest('.wt-skip')) continue; const tx = T(n); if (!tx || tx.length < 2) continue;
      if (/^(h2|h3|h4)$/i.test(n.tagName)) { sec = { h: clean(tx), p: [] }; blocks.push(sec); continue; }
      if (/^(download|mirror|link|click|password|how to install|join discord)/i.test(tx) && tx.length < 90) continue;
      if (n.querySelector('a[href]') && tx.length < 60) continue;
      if (/^(game\s+)?(download\s+)?size\b/i.test(tx) && tx.length < 90) continue;
      if (!sec) { sec = { h: 'Acerca del juego', p: [] }; blocks.push(sec); } if (sec.p.length < 40) sec.p.push(tx);
    }
    const reqB = blocks.filter((b) => /requirement/i.test(b.h)), req = parseReq(reqB.flatMap((b) => b.p));
    // si no hay bloque propio, se buscan las líneas sueltas
    if (!Object.keys(req.min).length && !Object.keys(req.rec).length) { const all = parseReq(blocks.flatMap((b) => b.p)); if (Object.keys(all.min).length) Object.assign(req, all); }
    const full = T(root);
    const szm = /(?:game\s+)?(?:download\s+)?size\s*[:\-]?\s*(?:~|approx\.?\s*)?([\d.,]+\s*(?:GB|MB|TB))/i.exec(full), size = szm ? szm[1].replace(/\s+/g, ' ').toUpperCase() : '';
    const vm = /build\s*(\d{4,8})|\bv\s*(\d+(?:\.\d+)+)/i.exec(raw + ' ' + full.slice(0, 2500)), ver = vm && !vm[1] ? 'v' + vm[2] : '';
    const sp0 = req.min['Espacio'] || req.rec['Espacio'] || '', spm = /([\d.,]+\s*(?:GB|MB|TB))/i.exec(sp0), space = spm ? spm[1].toUpperCase() : sp0;
    const info = blocks.filter((b) => b.p.length && !/requirement/i.test(b.h) && !/^(download|how to|installation|steps)/i.test(b.h)).slice(0, 8);
    const shots = imgs.map((i) => i.currentSrc || i.src).filter((u, i, a) => u && !/^data:/.test(u) && u !== cover && a.indexOf(u) === i).slice(0, 8);
    return { title, cover, links, cats, date, info, shots, req, size, ver, space };
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reqCard = (t, o) => { const ks = Object.keys(o); return ks.length ? '<div class="rq"><h4>' + t + '</h4>' + ks.map((k) => '<div class="rw"><span>' + k + '</span><b>' + esc(o[k]) + '</b></div>').join('') + '</div>' : ''; };
  // pestañas compartidas (portada y página de juego)
  const TABS = () => [{ k: 'new', t: 'Lanzamientos', sub: 'Agregados recientemente', url: '' }, { k: 'top', t: 'Más populares', sub: 'Los más descargados', url: navLink(/top\s*games/i) }, { k: 'upd', t: 'Actualizados', sub: 'Con versión nueva', url: navLink(/recent\s*updates|updated/i) }, { k: 'all', t: 'Todos los juegos', sub: 'Lista completa', url: navLink(/games?\s*list|all\s*games|a\s*-?\s*z\b/i) || location.origin + '/games-list-page/' }].filter((x) => x.k === 'new' || x.url);
  const BARCSS = `@keyframes swp{0%,100%{background-position:0 0;opacity:.35}50%{background-position:100% 0;opacity:1}}@keyframes lgp{0%,100%{opacity:.55;transform:scale(.85)}50%{opacity:1;transform:scale(1.15)}}@keyframes xl{from{opacity:0;transform:translateX(46px);filter:blur(7px)}}@keyframes xr{from{opacity:0;transform:translateX(-46px);filter:blur(7px)}}@keyframes ol{to{opacity:0;transform:translateX(-46px);filter:blur(7px)}}@keyframes or{to{opacity:0;transform:translateX(46px);filter:blur(7px)}}
      .pn.on.fr{animation:xl .55s cubic-bezier(.22,1,.36,1)!important}.pn.on.fl{animation:xr .55s cubic-bezier(.22,1,.36,1)!important}
      @keyframes brt{0%,100%{box-shadow:0 14px 40px rgba(255,255,255,.12)}50%{box-shadow:0 14px 56px rgba(255,255,255,.3)}}
      .bar{position:relative;z-index:8;flex:none;display:flex;align-items:center;justify-content:space-between;gap:18px;margin:12px 28px 0;padding:10px 14px 10px 20px;border-radius:22px;background:linear-gradient(180deg,rgba(22,22,32,.78),rgba(12,12,20,.7));border:1px solid rgba(255,255,255,.09);box-shadow:0 18px 50px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.06);backdrop-filter:blur(18px)}
      .bar:after{content:'';position:absolute;left:14%;right:14%;bottom:-1px;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);background-size:200% 100%;animation:swp 7s ease-in-out infinite;pointer-events:none}
      .lg:before{content:'';display:inline-block;width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 14px #fff;margin-right:12px;vertical-align:1px;animation:lgp 2.6s ease-in-out infinite}
      .lg{font:800 15px "Segoe UI",system-ui;letter-spacing:.28em;color:#fff;cursor:pointer;animation:up .7s backwards}
      .tbw{position:relative;display:flex;gap:4px;padding:5px;border-radius:99px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.09);animation:up .7s .08s backwards}
      .tbw button{position:relative;z-index:1;font:600 13.5px "Segoe UI",system-ui;color:#a6a7b8;background:none;border:0;border-radius:99px;padding:9px 18px;cursor:pointer;transition:color .3s,background .3s}.tbw button:hover{color:#fff}.tbw button:active,.ob:active,.tb:active{transform:scale(.94)}.tbw .hv{position:absolute;top:5px;bottom:5px;left:0;width:0;border-radius:99px;background:rgba(255,255,255,.1);opacity:0;transition:left .45s cubic-bezier(.22,1,.36,1),width .45s cubic-bezier(.22,1,.36,1),opacity .3s}.tbw button.on{color:#0b0b13;background:#f4f4f8;box-shadow:0 6px 24px rgba(255,255,255,.2)}
      .ob{font:600 12.5px "Segoe UI",system-ui;color:#c9cad6;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:99px;padding:8px 15px;cursor:pointer;transition:background .3s,color .3s,transform .4s cubic-bezier(.22,1,.36,1)}.ob:hover{background:rgba(255,255,255,.16);color:#fff;transform:translateY(-1px)}`;
  const leave = (cb) => { const h = document.getElementById('wt-console'); if (!h) return cb(); const sr = h.shadowRoot, a = sr && (sr.querySelector('.app') || sr.querySelector('.w')); if (sr) { const l = document.createElement('div'); l.style.cssText = 'position:fixed;left:0;top:0;height:3px;width:0;z-index:99;background:linear-gradient(90deg,#fff,#9a9ab0);box-shadow:0 0 14px rgba(255,255,255,.7);transition:width .9s cubic-bezier(.22,1,.36,1)'; sr.appendChild(l); requestAnimationFrame(() => { l.style.width = '78%'; }); } if (a) { a.style.transition = 'opacity .32s ease,transform .4s cubic-bezier(.4,0,.2,1),filter .32s ease'; a.style.opacity = '0'; a.style.transform = 'scale(.975) translateY(8px)'; a.style.filter = 'blur(6px)'; } setTimeout(cb, 300); };
  const IC = { new: '<path d="M12 3l2.2 6.3L21 11l-6.8 1.7L12 19l-2.2-6.3L3 11l6.8-1.7z"/>', top: '<path d="M6 20v-9M12 20V4M18 20v-6"/>', upd: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>', all: '<rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/>', ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>', back: '<path d="M15 5l-7 7 7 7"/>' };
  const ic = (k) => '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + IC[k] + '</svg>';
  const tabBtns = (tabs) => tabs.map((x) => '<button data-k="' + x.k + '">' + ic(x.k) + '<span>' + x.t + '</span></button>').join('');
  const BAR2 = `.bar{display:grid!important;grid-template-columns:1fr auto 1fr;align-items:center;gap:16px;margin:14px auto 0!important;max-width:1240px;padding:0 6px!important;background:none!important;border:0!important;box-shadow:none!important;backdrop-filter:none!important;border-radius:0!important}.bar:after{display:none!important}
      .bar:before{content:'';position:absolute;inset:-16px calc(50% - 50vw) -14px;background:linear-gradient(180deg,rgba(7,6,15,.92) 30%,rgba(7,6,15,0));z-index:-1;pointer-events:none}
      .app .bar{width:100%;max-width:1320px;padding:0 36px!important;position:relative}.app .bar:before{display:none}
      .bar>:first-child{justify-self:start}.bar>:last-child{justify-self:end}
      .bar .tb,.bar .tbw{justify-self:center;padding:6px!important;gap:4px!important;border-radius:99px;background:rgba(16,16,26,.74)!important;border:1px solid rgba(255,255,255,.11)!important;backdrop-filter:blur(22px);box-shadow:0 20px 50px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.08)!important}
      .bar .tb button,.bar .tbw button{display:inline-flex;align-items:center;gap:9px;height:42px;padding:0 20px 0 16px!important;font:600 14px "Segoe UI",system-ui!important;white-space:nowrap}
      .bar .tb button svg,.bar .tbw button svg{flex:none;opacity:.85;transition:transform .5s cubic-bezier(.34,1.5,.64,1)}.bar .tb button:hover svg,.bar .tbw button:hover svg{transform:scale(1.18) rotate(-6deg)}.bar .tb button.on svg{opacity:1}
      .bar .pill{top:6px!important;bottom:6px!important}
      .bar .ob{display:inline-flex;align-items:center;gap:9px;height:42px;padding:0 18px!important;font-size:13.5px!important;background:rgba(16,16,26,.74)!important;border:1px solid rgba(255,255,255,.11)!important;backdrop-filter:blur(22px);box-shadow:0 14px 36px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.07)}
      @media (max-width:980px){.bar .tb button span,.bar .tbw button span{display:none}.bar .tb button,.bar .tbw button{padding:0 14px!important}}`;
  const goTab = (k) => leave(() => { location.href = location.origin + '/' + (k === 'new' ? '' : '#wt=' + k); });
  const hoverPill = (sh) => { const g = sh.querySelector('.tbw'); if (!g) return; const p = document.createElement('span'); p.className = 'hv'; g.insertBefore(p, g.firstChild); const mv = (b) => { p.style.opacity = '1'; p.style.left = b.offsetLeft + 'px'; p.style.width = b.offsetWidth + 'px'; }; g.querySelectorAll('button').forEach((b) => b.addEventListener('mouseenter', () => mv(b))); g.addEventListener('mouseleave', () => { p.style.opacity = '0'; }); };
  const mount = (d) => {
    const hostEl = document.createElement('div'); hostEl.id = 'wt-console';
    hostEl.style.cssText = 'position:fixed;inset:0;z-index:2147483000;display:block';
    const sh = hostEl.attachShadow({ mode: 'open' }), main = d.links[0], rest = d.links.slice(1), tabs = TABS();
    const stats = [['Tamaño', d.size], ['Espacio en disco', d.space], ['Versión', d.ver], ['Publicado', d.date]].filter((x) => x[1]);
    const reqHTML = reqCard('Mínimos', d.req.min) + reqCard('Recomendados', d.req.rec);
    const panes = [];
    { const shots = d.shots.length ? '<div class="lab rv">Capturas</div><div class="gal rv">' + d.shots.slice(0, 6).map((u) => '<img loading="lazy" src="' + esc(u) + '" alt="">').join('') + '</div>' : '';
      const info = d.info.map((b) => '<div class="sec rv"><h3>' + esc(b.h) + '</h3>' + b.p.map((x) => '<p>' + esc(x) + '</p>').join('') + '</div>').join('');
      const rq = reqHTML ? '<div class="rqs rv">' + reqHTML + '</div>' : '';
      const body = shots + (info || rq ? '<div class="mix' + (info && rq ? '' : ' one') + '"><div>' + info + '</div>' + (rq ? '<div>' + rq + '</div>' : '') + '</div>' : '');
      panes.push(['i', 'Juego', body || '<div class="empty">Sin información</div>']); }
    panes.push(['c', 'Comentarios', '<div class="cm"><slot name="c"><div class="empty">Cargando comentarios…</div></slot></div>']);
    sh.innerHTML = `<style>
      :host{all:initial}*{box-sizing:border-box}
      ${AMBCSS}
      @keyframes fi{from{opacity:0}}@keyframes up{from{opacity:0;transform:translateY(20px)}}@keyframes pop{from{opacity:0;transform:translateY(26px) scale(.93) rotate(-2deg)}}@keyframes sl{from{opacity:0;transform:translateX(-16px)}}@keyframes dr{0%,100%{transform:scale(1.12) translate(0,0)}50%{transform:scale(1.18) translate(-1.5%,1%)}}@keyframes dn{from{opacity:0;transform:translateY(-120%) scale(.9)}}@keyframes wd{from{opacity:0;transform:translateY(.7em) rotate(2deg);filter:blur(10px)}}@keyframes rev{from{clip-path:inset(100% 0 0 0 round 22px);opacity:.2;transform:scale(1.08) translateY(30px)}}@keyframes tr{from{opacity:0;transform:translateX(34px)}}@keyframes tl{from{opacity:0;transform:translateX(-34px)}}@keyframes rp{from{transform:scale(0);opacity:.5}to{transform:scale(1);opacity:0}}@keyframes sh{from{transform:translateX(-120%) skewX(-18deg)}to{transform:translateX(260%) skewX(-18deg)}}@keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
      ${BARCSS}
      ${BAR2}
      .app{position:absolute;inset:0;z-index:1;display:flex;flex-direction:column;color:#ececf3;font:15px/1.55 "Segoe UI",system-ui,sans-serif;animation:enter .95s cubic-bezier(.22,1,.36,1) backwards}@keyframes enter{from{opacity:0;transform:scale(1.025) translateY(-6px);filter:blur(8px)}}
      .bg{position:fixed;inset:-70px;background:center/cover;filter:blur(64px) brightness(.34) saturate(1.3);opacity:.9;animation:fi 1.4s ease backwards,dr 28s ease-in-out infinite;pointer-events:none}
      .bar{animation:dn .8s .05s cubic-bezier(.22,1,.36,1) backwards}.side{animation:sl .9s .15s cubic-bezier(.22,1,.36,1) backwards}
      .main{flex:1;min-height:0;display:grid;grid-template-columns:minmax(300px,370px) minmax(0,1fr);gap:26px;width:100%;max-width:1320px;margin:0 auto;padding:12px 36px 38px}
      ::-webkit-scrollbar{width:8px}::-webkit-scrollbar-thumb{background:#2a2a34;border-radius:10px}
      .side{min-height:0;overflow:auto;display:flex;flex-direction:column;gap:14px;padding:4px 8px 24px 4px;-webkit-mask-image:linear-gradient(180deg,#000 calc(100% - 28px),transparent);mask-image:linear-gradient(180deg,#000 calc(100% - 28px),transparent)}
      .cvw{position:relative;flex:none;animation:pop .9s .1s cubic-bezier(.22,1,.36,1) backwards,flt2 9s ease-in-out 1.2s infinite}@keyframes flt2{50%{transform:translateY(-6px)}}.cvw:before{content:'';position:absolute;inset:6% 4%;background:var(--cvimg) center/cover;filter:blur(40px) saturate(1.4);opacity:.55;border-radius:30px;animation:br 6s ease-in-out infinite}
      .cv{position:relative;border-radius:20px;overflow:hidden;background:#0d0d14;box-shadow:0 30px 70px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.1);transition:transform .7s cubic-bezier(.22,1,.36,1),box-shadow .5s;transform-style:preserve-3d}
      .cv:before{content:'';position:absolute;inset:-20px;background:var(--cvimg) center/cover;filter:blur(26px) brightness(.65) saturate(1.3)}.cv{margin:0 auto}.cv img{position:relative;display:block;width:100%;height:100%;object-fit:cover}.cv i{position:absolute;inset:0;background:radial-gradient(60% 60% at var(--mx,50%) var(--my,30%),rgba(255,255,255,.2),transparent 65%);opacity:0;transition:opacity .4s;pointer-events:none}.cv:hover i{opacity:1}
      h1{margin:2px 0 0;font-size:27px;line-height:1.15;letter-spacing:-.6px;text-shadow:0 4px 30px rgba(0,0,0,.6)}
      .wd{display:inline-block;animation:wd 1s calc(.2s + var(--i) * .05s) cubic-bezier(.22,1,.36,1) backwards;margin-right:.26em}
      .ch{display:flex;flex-wrap:wrap;gap:7px}.ch span{animation:up .7s calc(.3s + var(--j,0) * .06s) cubic-bezier(.34,1.4,.64,1) backwards;font-size:12px;padding:4px 12px;border-radius:99px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.08);color:#d4d5e0}
      .st{display:grid;grid-template-columns:1fr 1fr;gap:8px}.st div{animation:up .8s calc(.4s + var(--j,0) * .07s) cubic-bezier(.34,1.3,.64,1) backwards;padding:9px 13px;border-radius:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);transition:transform .45s cubic-bezier(.22,1,.36,1),background .3s}.st div:hover{transform:translateY(-3px);background:rgba(255,255,255,.1)}.st small{display:block;font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:#8e90a0;font-weight:700}.st b{font-size:15px}
      .big{position:relative;overflow:hidden;flex:none;display:flex;align-items:center;justify-content:space-between;gap:16px;height:54px;padding:0 20px;border-radius:16px;background:#f4f4f8;color:#0b0b13;font:700 16px "Segoe UI",system-ui;text-decoration:none;box-shadow:0 14px 40px rgba(255,255,255,.12);transition:transform .45s cubic-bezier(.22,1,.36,1),box-shadow .45s,background .3s;animation:up .8s .45s cubic-bezier(.22,1,.36,1) backwards}
      .big:after{content:'';position:absolute;top:0;bottom:0;width:38%;left:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.75),transparent);transform:translateX(-120%) skewX(-18deg);pointer-events:none}.big:hover:after{animation:sh .9s cubic-bezier(.22,1,.36,1)}.rp{position:absolute;border-radius:50%;background:rgba(0,0,0,.18);pointer-events:none;animation:rp .7s cubic-bezier(.22,1,.36,1) forwards}
      .big{animation:up .8s .45s cubic-bezier(.22,1,.36,1) backwards,brt 3.6s 1.4s ease-in-out infinite}.big:hover{transform:translateY(-3px);box-shadow:0 22px 50px rgba(255,255,255,.2);background:#fff}.big:active{transform:scale(.98)}.big small{font-weight:600;opacity:.6;font-size:12.5px}
      .lbl{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#8e90a0;font-weight:700;margin:2px 2px -4px}
      .alt{display:grid;gap:7px}.alt a{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:10px 16px;border-radius:13px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);color:#e8e8f0;text-decoration:none;font-weight:600;font-size:14px;transition:background .3s,transform .5s cubic-bezier(.34,1.4,.64,1),border-color .3s;animation:sl .8s cubic-bezier(.34,1.3,.64,1) backwards}
      .alt a:hover{background:rgba(255,255,255,.13);transform:translateX(6px);border-color:rgba(255,255,255,.2)}.alt a:active{transform:translateX(6px) scale(.97)}.alt small{color:#9a9bad;font-weight:500;font-size:12px}
      .panel{min-height:0;display:flex;flex-direction:column;border-radius:24px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);box-shadow:0 30px 80px rgba(0,0,0,.35);overflow:hidden;animation:up .9s .15s cubic-bezier(.22,1,.36,1) backwards}
      .panel:before{content:'';position:absolute;left:18%;right:18%;top:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent);z-index:2;animation:swp 7s ease-in-out infinite;background-size:200% 100%}
      .cv:after{content:'';position:absolute;top:-20%;bottom:-20%;width:30%;left:-60%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.22),transparent);transform:skewX(-16deg);animation:cs 6s 1.6s ease-in-out infinite;pointer-events:none}@keyframes cs{0%,60%{left:-60%}100%{left:140%}}
      h1:after{content:'';display:block;margin-top:10px;height:2px;width:56px;border-radius:2px;background:#fff;box-shadow:0 0 14px rgba(255,255,255,.6);transform-origin:left;animation:ul .9s .6s cubic-bezier(.22,1,.36,1) backwards}@keyframes ul{from{transform:scaleX(0)}}
      .ch span:hover{background:rgba(255,255,255,.16);transform:translateY(-2px);transition:background .3s,transform .4s cubic-bezier(.34,1.4,.64,1)}
      .rw{transition:background .3s,padding .4s cubic-bezier(.22,1,.36,1)}.rw:hover{background:rgba(255,255,255,.04);padding-left:8px}
      .ptb{position:relative;flex:none;display:flex;gap:4px;padding:10px 14px 0;border-bottom:1px solid rgba(255,255,255,.08)}.tb{position:relative;font:600 14px "Segoe UI",system-ui;color:#9d9eb0;background:none;border:0;padding:12px 18px;cursor:pointer;border-radius:12px 12px 0 0;transition:color .3s,background .3s}.tb:hover{color:#fff;background:rgba(255,255,255,.05)}.tb.on{color:#fff}
      .ind{position:absolute;bottom:-1px;height:2px;background:#fff;border-radius:2px;box-shadow:0 0 12px rgba(255,255,255,.7);transition:left .6s cubic-bezier(.34,1.4,.64,1),width .6s cubic-bezier(.34,1.4,.64,1)}
      .pw{position:relative;flex:1;min-height:0}.pn{position:absolute;inset:0;overflow:auto;padding:26px 30px 48px;display:none}.pn.on{display:block;animation:up .6s cubic-bezier(.22,1,.36,1)}.pn::-webkit-scrollbar{width:8px}.pn.on.fr{animation:tr .55s cubic-bezier(.22,1,.36,1)}.pn.on.fl{animation:tl .55s cubic-bezier(.22,1,.36,1)}
      .rv{opacity:0;transform:translateY(22px) scale(.985);filter:blur(5px);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .9s cubic-bezier(.22,1,.36,1),filter .8s cubic-bezier(.22,1,.36,1)}.rv.in{opacity:1;transform:none;filter:none}
      .sec:nth-child(2){--d:.08s}.sec{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:16px 20px;margin-bottom:12px;transition:border-color .4s,background .4s}.sec:hover{border-color:rgba(255,255,255,.16);background:rgba(255,255,255,.055)}.sec h3{margin:0 0 8px;font-size:15.5px;color:#fff}.sec p{margin:0 0 7px;color:#c4c5d2;font-size:14.5px}
      .rqs{display:grid;grid-template-columns:1fr;gap:16px}
      .mix{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:20px;align-items:stretch}.mix.one{grid-template-columns:1fr}.mix>div{display:flex;flex-direction:column;gap:16px}.mix .sec,.mix .rq{margin:0}.mix>div>.rqs{display:contents}.mix>div:only-child{grid-column:1/-1}
      .mix .sec h3,.mix .rq h4{margin:0 0 12px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#9a9bad;display:flex;align-items:center;gap:10px}.mix .sec h3:before,.mix .rq h4:before{content:'';width:18px;height:2px;border-radius:2px;background:#fff;box-shadow:0 0 10px rgba(255,255,255,.6)}
      .lab{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#9a9bad;font-weight:700;margin:0 2px 12px;display:flex;align-items:center;gap:10px}.lab:before{content:'';width:18px;height:2px;border-radius:2px;background:#fff;box-shadow:0 0 10px rgba(255,255,255,.6)}
      .gal{margin:0 0 26px!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:20px!important}.gal img{aspect-ratio:16/9;object-fit:cover;border-radius:16px!important;box-shadow:0 14px 36px rgba(0,0,0,.45)}.gal img:first-child:nth-last-child(odd){grid-column:1/-1;aspect-ratio:21/9}
      @media (max-width:1150px){.mix{grid-template-columns:1fr}}.rq{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:16px 20px}.rq h4{margin:0 0 10px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#8e90a0}.rw{display:grid;grid-template-columns:110px 1fr;gap:12px;padding:7px 0;border-top:1px solid rgba(255,255,255,.06);font-size:14px}.rw:first-of-type{border-top:0}.rw span{color:#8e90a0}.rw b{font-weight:600;color:#fff}
      .gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px;margin-top:6px}.gal img{width:100%;border-radius:14px;display:block;cursor:zoom-in;transition:transform .55s cubic-bezier(.22,1,.36,1),box-shadow .45s}.gal img:hover{transform:translateY(-4px) scale(1.025);box-shadow:0 22px 44px rgba(0,0,0,.55)}
      .lb{position:fixed;inset:0;z-index:20;display:grid;place-items:center;background:rgba(4,4,8,.88);animation:fi .35s;cursor:zoom-out}.lb img{max-width:92vw;max-height:90vh;border-radius:14px;box-shadow:0 40px 100px rgba(0,0,0,.7);animation:pop .5s cubic-bezier(.22,1,.36,1)}
      .cm{color:#d6d7e2;min-height:120px}.empty{color:#8e90a0;padding:30px;text-align:center}.fb{display:grid;gap:12px;justify-items:center;padding:30px;color:#9d9eb0;text-align:center}.fb button{font:700 14px "Segoe UI",system-ui;background:#f4f4f8;color:#0b0b13;border:0;border-radius:12px;padding:12px 22px;cursor:pointer}
      @media (max-width:980px){.main{grid-template-columns:1fr;overflow:auto}.side{overflow:visible}.panel{min-height:70vh}.tbw{display:none}}
      @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.rv{opacity:1;transform:none;filter:none}}
    </style>
    <div class="base"></div><div class="bg" style="background-image:url('${esc(d.cover)}')"></div>${AMB}
    <div class="app"><div class="bar"><button class="ob" id="back">${ic('back')}Volver</button><div class="tbw" id="nv">${tabBtns(tabs)}</div><span></span></div>
      <div class="main"><div class="side"><div class="cvw" style="--cvimg:url('${esc(d.cover)}')"><div class="cv" id="cv"><img src="${esc(d.cover)}" alt=""><i></i></div></div>
          <div class="ch">${d.cats.map((c, i) => '<span style="--j:' + i + '">' + esc(c) + '</span>').join('')}</div>
          <h1>${d.title.split(' ').map((x, i) => '<span class="wd" style="--i:' + i + '">' + esc(x) + '</span>').join('')}</h1>
          <a class="big" href="${esc(main.href)}" target="_blank" rel="noopener"><span>Descargar</span><small>${esc(main.name)}</small></a>
          ${stats.length ? '<div class="st">' + stats.map((x, i) => '<div style="--j:' + i + '"><small>' + x[0] + '</small><b>' + esc(x[1]) + '</b></div>').join('') + '</div>' : ''}
          ${rest.length ? '<div class="lbl">Más enlaces</div><div class="alt">' + rest.map((l, i) => '<a href="' + esc(l.href) + '" target="_blank" rel="noopener" style="animation-delay:' + (0.5 + i * 0.06) + 's"><span>' + esc(l.name) + '</span><small>' + (l.sub.toLowerCase() === l.name.toLowerCase() ? '' : esc(l.sub)) + '</small></a>').join('') + '</div>' : ''}</div>
        <div class="panel"><div class="ptb" id="tabs">${panes.map((p, i) => '<button class="tb' + (i ? '' : ' on') + '" data-t="' + p[0] + '">' + p[1] + '</button>').join('')}<span class="ind" id="ind"></span></div>
          <div class="pw">${panes.map((p, i) => '<div class="pn' + (i ? '' : ' on') + '" id="p-' + p[0] + '">' + p[2] + '</div>').join('')}</div></div></div></div>`;
    const $ = (q) => sh.querySelector(q), ind = $('#ind');
    const place = (b) => { if (b) { ind.style.left = b.offsetLeft + 'px'; ind.style.width = b.offsetWidth + 'px'; } };
    const reveal = () => { const pn = sh.querySelector('.pn.on'); const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { root: pn, threshold: 0.05 }) : null; sh.querySelectorAll('.pn.on .rv:not(.in)').forEach((e, i) => { e.style.transitionDelay = Math.min(i, 5) * 70 + 'ms'; io ? io.observe(e) : e.classList.add('in'); }); };
    const order = panes.map((p) => p[0]); let curT = order[0];
    sh.querySelectorAll('.tb').forEach((b) => b.addEventListener('click', () => {
      const dirR = order.indexOf(b.dataset.t) > order.indexOf(curT); curT = b.dataset.t; sh.querySelectorAll('.tb').forEach((x) => x.classList.toggle('on', x === b)); sh.querySelectorAll('.pn').forEach((p) => { p.classList.remove('fr', 'fl'); const on = p.id === 'p-' + b.dataset.t; p.classList.toggle('on', on); if (on) { void p.offsetWidth; p.classList.add(dirR ? 'fr' : 'fl'); } }); place(b); reveal(); if (curT === 'c') wake();
    }));
    sh.querySelectorAll('#nv button').forEach((b) => { b.onclick = () => goTab(b.dataset.k); });
    hoverPill(sh);
    { const chk = () => { const g = $('.gal'); if (g && !g.querySelector('img')) { const l = g.previousElementSibling; if (l && l.classList.contains('lab')) l.remove(); g.remove(); } };
      sh.querySelectorAll('.gal img').forEach((im) => { const bad = () => { im.remove(); chk(); }; im.addEventListener('error', bad); im.addEventListener('load', () => { if (im.naturalWidth < 240) bad(); }); if (im.complete && im.naturalWidth && im.naturalWidth < 240) bad(); });
      setTimeout(() => { sh.querySelectorAll('.gal img').forEach((im) => { if (!im.naturalWidth) im.remove(); }); chk(); }, 7000); }
    const cv = $('#cv'), cim = cv.querySelector('img');
    const fit = () => { const r = Math.min(1.9, Math.max(.62, (cim.naturalWidth || 2) / (cim.naturalHeight || 3))); cv.style.aspectRatio = String(r); cv.style.width = 'min(100%, ' + (38 * r).toFixed(1) + 'vh)'; }; cim.complete ? fit() : cim.addEventListener('load', fit); fit();
    cv.addEventListener('mousemove', (e) => { const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; cv.style.transition = 'transform .08s linear,box-shadow .5s'; cv.style.transform = 'perspective(900px) rotateY(' + ((x - .5) * 10) + 'deg) rotateX(' + ((.5 - y) * 10) + 'deg) scale(1.02)'; cv.style.setProperty('--mx', x * 100 + '%'); cv.style.setProperty('--my', y * 100 + '%'); });
    cv.addEventListener('mouseleave', () => { cv.style.transition = 'transform .7s cubic-bezier(.22,1,.36,1),box-shadow .5s'; cv.style.transform = ''; });
    const big = $('.big');
    big.addEventListener('mousemove', (e) => { const r = big.getBoundingClientRect(); big.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .04) + 'px,' + (-3 + (e.clientY - r.top - r.height / 2) * .12) + 'px)'; });
    big.addEventListener('mouseleave', () => { big.style.transform = ''; });
    big.addEventListener('mousedown', (e) => { const r = big.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2, sp = document.createElement('span'); sp.className = 'rp'; sp.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px'; big.appendChild(sp); setTimeout(() => sp.remove(), 800); });
    sh.addEventListener('click', (e) => { const im = e.target; if (im.matches && im.matches('.gal img')) { const lb = document.createElement('div'); lb.className = 'lb'; lb.innerHTML = '<img src="' + im.src + '" alt="">'; sh.appendChild(lb); const big2 = lb.firstChild, a = im.getBoundingClientRect(); requestAnimationFrame(() => { const b2 = big2.getBoundingClientRect(); if (big2.animate && b2.width) big2.animate([{ transform: 'translate(' + (a.left - b2.left) + 'px,' + (a.top - b2.top) + 'px) scale(' + (a.width / b2.width) + ')', borderRadius: '8px' }, { transform: 'none' }], { duration: 550, easing: 'cubic-bezier(.22,1,.36,1)' }); }); big2.style.animation = 'none'; lb.onclick = () => { lb.style.transition = 'opacity .25s'; lb.style.opacity = 0; setTimeout(() => lb.remove(), 260); }; } });
    document.documentElement.classList.add('wt-console-on'); document.body.appendChild(hostEl);
    requestAnimationFrame(() => { place($('.tb.on')); reveal(); });
    $('#back').onclick = () => leave(() => history.length > 1 ? history.back() : (location.href = '/'));
    // comentarios: se usa el bloque real de la página; si el sitio los carga recién al verlos, se lo "despierta" y, si sigue vacío, se ofrece abrirlos en la página original
    let cmNode = null;
    const grab = () => { const c = document.querySelector('#comments, .comments-area, #disqus_thread, .wpd-comm, #wpdcom, [id*=comment]:not(script)'); if (c && !hostEl.contains(c)) { cmNode = c; c.setAttribute('slot', 'c'); hostEl.appendChild(c); return true; } return !!cmNode; };
    const count = () => { if (!cmNode) return 0; const n = cmNode.querySelectorAll('.comment, .wpd-comment, li.comment, article').length; const t = sh.querySelector('.tb[data-t=c]'); if (n) t.textContent = 'Comentarios (' + n + ')'; place(sh.querySelector('.tb.on')); return n || (cmNode.textContent || '').trim().length > 60 || cmNode.querySelector('iframe'); };
    let wk = 0;
    const wake = () => {
      if (wk > 2) return; wk++;
      try { window.dispatchEvent(new Event('scroll')); window.dispatchEvent(new Event('resize')); const btn = document.querySelector('.wpd-load-more-submit, #load-comments, .dsq-load-btn, [class*=load-comments], [id*=load-comments]'); if (btn) btn.click(); } catch (e) {}
      setTimeout(() => { if (count()) return; const box = $('.cm'); if (!box || box.querySelector('.fb')) return; const f = document.createElement('div'); f.className = 'fb'; f.innerHTML = '<div>' + (cmNode ? 'Los comentarios no se pudieron cargar.' : 'Este juego todavía no tiene comentarios.') + '</div>'; box.appendChild(f); }, 2800);
    };
    let tries = 0; const iv = setInterval(() => { grab(); count(); if (++tries > 30) clearInterval(iv); }, 600); grab();
    return hostEl;
  };

  // ---------- portada de SteamRIP: biblioteca con destacados, pestañas (lanzamientos / populares / actualizados / lista), búsqueda y vista cuadrícula o lista ----------
  const cardsFrom = (doc, base, mode) => {
    const abs = (u) => { try { return new URL(u, base).href; } catch (e) { return ''; } };
    const all = [...doc.querySelectorAll('a[href*="free-download"]')].filter((a) => !a.closest('nav, header, footer'));
    let scope = doc.body, found = false;
    if (mode === 'new') { const hd = [...doc.querySelectorAll('h1,h2,h3,h4,span,div,p')].find((e) => !e.children.length && /^\s*recently added\s*$/i.test(e.textContent)); if (hd) { let c = hd, n = 0; while (c.parentElement && n++ < 7 && c.querySelectorAll('a[href*="free-download"]').length < 6) c = c.parentElement; if (c.querySelectorAll('a[href*="free-download"]').length >= 6) { scope = c; found = true; } } }
    if (!found) { const cnt = new Map(); for (const a of all) { let p = a.parentElement, d = 0; while (p && p !== doc.body && d++ < 6) { cnt.set(p, (cnt.get(p) || 0) + 1); p = p.parentElement; } } let best = null, bc = 0; for (const [el, c] of cnt) if (c > bc || (c === bc && best && best.contains(el))) { best = el; bc = c; } if (best && bc >= 4) scope = best; }
    const out = [], seen = new Set();
    for (const a of scope.querySelectorAll('a[href*="free-download"]')) {
      const href = abs(a.getAttribute('href')); if (!href || seen.has(href) || a.closest('nav, header, footer')) continue;
      const box = a.closest('article, li, [class*=post], [class*=card], [class*=item]') || a.parentElement || a;
      const img = a.querySelector('img') || (box && box.querySelector('img'));
      let src = ''; if (img) src = img.getAttribute('data-lazy-src') || img.getAttribute('data-src') || (img.getAttribute('data-lazy-srcset') || img.getAttribute('srcset') || '').split(/\s+/)[0] || img.getAttribute('src') || '';
      if (/^data:image\/(gif|svg)/.test(src)) src = img.getAttribute('data-lazy-src') || img.getAttribute('data-src') || '';
      const raw = (a.getAttribute('title') || (img && img.getAttribute('alt')) || T(a) || T(box.querySelector && box.querySelector('h1,h2,h3,h4,h5')) || '').trim();
      const title = clean(raw); if (!title || title.length < 2) continue;
      const bm = /build\s*(\d{4,8})/i.exec(T(box) + ' ' + raw);
      seen.add(href); out.push({ href, title, img: src ? abs(src) : '', build: bm ? 'Build ' + bm[1] : '' });
    }
    return out;
  };
  const navLink = (re) => { const a = [...document.querySelectorAll('nav a[href], header a[href]')].find((x) => re.test(T(x)) && !/#$/.test(x.getAttribute('href') || '')); return a ? a.href : ''; };
  const nextOf = (doc, base) => { const na = doc.querySelector('a.next.page-numbers, a[rel=next], .pagination a.next, .nav-links a.next'); try { return na ? new URL(na.getAttribute('href'), base).href : ''; } catch (e) { return ''; } };
  const mountHome = (firstCards) => {
    const hostEl = document.createElement('div'); hostEl.id = 'wt-console'; hostEl.style.cssText = 'position:fixed;inset:0;z-index:2147483000;display:block';
    const sh = hostEl.attachShadow({ mode: 'open' });
    const tabs = TABS();
    const ST = {}, nxt = (k, doc, url, pg) => { const n = nextOf(doc, url); if (n) return n; if (k === 'new') return location.origin + '/page/' + (pg + 1) + '/'; try { const u = new URL(url); u.hash = ''; u.search = ''; u.pathname = u.pathname.replace(/\/page\/\d+\/?$/, '/').replace(/\/?$/, '/') + 'page/' + (pg + 1) + '/'; return u.href; } catch (e) { return ''; } }; tabs.forEach((x) => { ST[x.k] = { items: x.k === 'new' ? firstCards : null, pg: x.k === 'new' ? 1 : 0, pages: {}, cur: 1, total: 0, psize: 0, next: x.k === 'new' ? nxt('new', document, location.href, (/\/page\/(\d+)/.exec(location.pathname) || [0, 1])[1] * 1) : '', busy: 0 }; });
    const PAGED = (k) => k === 'new' || k === 'top';
    const phOf = (doc, base) => { const m = {}; doc.querySelectorAll('a.page-numbers, .pagination a, .nav-links a, .wp-pagenavi a, [class*=pagina] a').forEach((a) => { const t = (a.textContent || '').trim(), n = /^\d{1,4}$/.test(t) ? +t : 0, h = a.getAttribute('href'); if (n && h && !m[n]) { try { m[n] = new URL(h, base).href; } catch (e) {} } }); return m; };
    const totalOf = (doc) => { let m = 0; doc.querySelectorAll('a.page-numbers, .pagination a, .nav-links a, .wp-pagenavi a').forEach((a) => { const t = parseInt((a.textContent || '').replace(/[^\d]/g, ''), 10); if (t > m && t < 5000) m = t; const h = /\/page\/(\d+)/.exec(a.getAttribute('href') || ''); if (h && +h[1] > m && +h[1] < 5000) m = +h[1]; }); return m; };
    let cur = 'new', view = 'grid', q = '', shown = 0, pgN = 1; const PER = 14; const PAGE = 36;
    const row = (c, i) => { const m = c.m, ch = m ? [m.ver ? '<span class="v">' + esc(m.ver) + '</span>' : '', m.size ? '<span>' + esc(m.size) + '</span>' : '', ...(m.cats || []).map((x) => '<span>' + esc(x) + '</span>')].join('') : '<span class="uw" style="width:70px"></span><span class="uw" style="width:56px"></span>';
      return '<a class="up2 rv" data-i="' + i + '" href="' + esc(c.href) + '" style="--i:' + (i % 10) + '">' + (c.img ? '<span class="ubg" style="background-image:url(\'' + esc(c.img) + '\')"></span>' : '') + '<span class="un">' + String(i + 1).padStart(2, '0') + '</span><span class="ucv">' + (c.img ? '<img loading="lazy" src="' + esc(c.img) + '" alt="">' : '<b class="ph">' + esc(c.title.charAt(0)) + '</b>') + '</span><span class="ub"><span class="uk"><i class="dot"></i>Actualizado' + (m && m.date ? '<em>· ' + esc(m.date) + '</em>' : '') + '</span><b class="ut">' + esc(c.title) + '</b><span class="uc">' + ch + '</span>' + (m ? (m.desc ? '<span class="ud2">' + esc(m.desc) + '</span>' : '') : '<span class="uw" style="width:92%"></span><span class="uw" style="width:68%"></span>') + '<span class="uf"><small>' + (m && m.ver ? 'Nueva versión disponible' : 'Versión más reciente') + '</small><span class="ugo">Ver juego<i>›</i></span></span></span></a>'; };
    const lrow = (c, i) => { const m = c.m, ch = m ? [m.ver ? '<span class="v">' + esc(m.ver) + '</span>' : '', m.size ? '<span>' + esc(m.size) + '</span>' : '', ...(m.cats || []).map((x) => '<span>' + esc(x) + '</span>')].join('') : '<span class="uw" style="width:64px"></span><span class="uw" style="width:50px"></span>';
      return '<a class="alr rv" data-i="' + i + '" href="' + esc(c.href) + '" style="--i:' + (i % 14) + '">' + (c.img ? '<span class="abg" style="background-image:url(\'' + esc(c.img) + '\')"></span>' : '') + '<span class="aw">' + esc(c.title.trim().charAt(0).toUpperCase()) + '</span><span class="an">' + String(i + 1).padStart(3, '0') + '</span><span class="acv">' + (c.img ? '<img loading="lazy" src="' + esc(c.img) + '" alt="">' : '<b class="ph">' + esc(c.title.charAt(0)) + '</b>') + '</span><span class="ab"><b class="at">' + esc(c.title) + '</b><span class="ac">' + ch + (m && m.date ? '<em>' + esc(m.date) + '</em>' : '') + '</span>' + (m && m.desc ? '<span class="ax"><span>' + esc(m.desc) + '</span></span>' : '') + '</span><span class="ago">Ver juego<i>›</i></span></a>'; };
    const pager = (pages, pg) => { if (pages < 2) return ''; const set = new Set([1, pages, pg, pg - 1, pg + 1, pg - 2, pg + 2]); const arr = [...set].filter((x) => x >= 1 && x <= pages).sort((a, b) => a - b); let h = '<button class="pb nv2" data-p="' + (pg - 1) + '"' + (pg < 2 ? ' disabled' : '') + '>‹</button>', last = 0; for (const x of arr) { if (x - last > 1) h += '<span class="pe">…</span>'; h += '<button class="pb' + (x === pg ? ' on' : '') + '" data-p="' + x + '">' + x + '</button>'; last = x; } return '<div class="pgs">' + h + '<button class="pb nv2" data-p="' + (pg + 1) + '"' + (pg >= pages ? ' disabled' : '') + '>›</button></div>'; };
    const card = (c, i) => '<a class="cd rv" href="' + esc(c.href) + '" style="--i:' + (i % 12) + '"><span class="cx">' + (cur === 'new' && (ST.new.cur || 1) === 1 && i < 6 ? '<span class="nb"><svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"/></svg>NUEVO</span>' : '') + '<span class="dlb"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></svg></span></span><span class="im">' + (c.img ? '<img loading="lazy" src="' + esc(c.img) + '" alt="">' : '<b class="ph">' + esc(c.title.charAt(0)) + '</b>') + '<i class="gl"></i></span>' + (cur === 'top' ? (() => { const rk = (ST.top.items || []).indexOf(c) + 1 + (ST.top.cur - 1) * (ST.top.psize || (ST.top.items || []).length); return rk ? '<em class="rk r' + Math.min(rk, 4) + '">' + rk + '</em>' : ''; })() : '') + '<span class="nm"><b>' + esc(c.title) + '</b><span class="mi"><svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M3 5.5l7-1v7H3zM11 4.4l10-1.4v8.500H11zM3 12.500h7v7l-7-1zM11 12.500h10V21l-10-1.400z"/></svg>PC<i></i><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.600" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 11l5 5 5-5"/></svg>Descarga directa</span></span></a>';
    sh.innerHTML = `<style>
      :host{all:initial}*{box-sizing:border-box}
      ${AMBCSS}
      @keyframes fi{from{opacity:0}}@keyframes up{from{opacity:0;transform:translateY(22px)}}@keyframes wd{from{opacity:0;transform:translateY(.7em);filter:blur(10px)}}@keyframes shm{from{background-position:200% 0}to{background-position:-200% 0}}@keyframes kb{from{transform:scale(1.04)}to{transform:scale(1.16) translate(-1.5%,-1%)}}@keyframes pg{from{width:0}to{width:100%}}@keyframes swp{0%,100%{background-position:0 0;opacity:.35}50%{background-position:100% 0;opacity:1}}@keyframes lgp{0%,100%{opacity:.55;transform:scale(.85)}50%{opacity:1;transform:scale(1.15)}}@keyframes xl{from{opacity:0;transform:translateX(46px);filter:blur(7px)}}@keyframes xr{from{opacity:0;transform:translateX(-46px);filter:blur(7px)}}@keyframes ol{to{opacity:0;transform:translateX(-46px);filter:blur(7px)}}@keyframes or{to{opacity:0;transform:translateX(46px);filter:blur(7px)}}
      .gr.ol{animation:ol .22s cubic-bezier(.4,0,1,1) forwards}.gr.or{animation:or .22s cubic-bezier(.4,0,1,1) forwards}.gr.xl{animation:xl .6s cubic-bezier(.22,1,.36,1)}.gr.xr{animation:xr .6s cubic-bezier(.22,1,.36,1)}#hero{transition:opacity .25s,transform .45s cubic-bezier(.22,1,.36,1)}#hero.o{opacity:0;transform:translateY(10px) scale(.985)}
      @keyframes bdr{to{transform:rotate(360deg)}}@keyframes flt{50%{transform:translateY(-10px) rotate(3deg)}}@keyframes pop{from{opacity:0;transform:translateY(14px) scale(.9)}}
      .w{position:absolute;inset:0;overflow:auto;z-index:1;color:#ececf3;font:15px/1.55 "Segoe UI",system-ui,sans-serif;scroll-behavior:smooth;animation:fi .7s cubic-bezier(.22,1,.36,1) backwards}
      .w::-webkit-scrollbar{width:10px}.w::-webkit-scrollbar-thumb{background:#2a2a34;border-radius:10px}
      .bar{position:sticky;top:10px;z-index:8;display:flex;align-items:center;justify-content:space-between;gap:18px;margin:12px auto 0;max-width:1240px;padding:10px 14px 10px 20px;border-radius:22px;background:linear-gradient(180deg,rgba(22,22,32,.78),rgba(12,12,20,.7));border:1px solid rgba(255,255,255,.09);box-shadow:0 18px 50px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.06);backdrop-filter:blur(18px)}
      .bar:after{content:'';position:absolute;left:14%;right:14%;bottom:-1px;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);background-size:200% 100%;animation:swp 7s ease-in-out infinite;pointer-events:none}
      .lg:before{content:'';display:inline-block;width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 14px #fff;margin-right:12px;vertical-align:1px;animation:lgp 2.6s ease-in-out infinite}
      .lg{font:800 15px "Segoe UI",system-ui;letter-spacing:.28em;color:#fff;animation:up .7s backwards}
      .tb{position:relative;display:flex;gap:4px;padding:5px;border-radius:99px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.09);animation:up .7s .08s backwards}
      .tb button{position:relative;z-index:1;font:600 13.5px "Segoe UI",system-ui;color:#a6a7b8;background:none;border:0;border-radius:99px;padding:9px 18px;cursor:pointer;transition:color .3s}.tb button:hover{color:#fff}.tb button.on{color:#0b0b13}
      .pill{position:absolute;top:5px;bottom:5px;left:0;width:0;border-radius:99px;background:#f4f4f8;box-shadow:0 6px 24px rgba(255,255,255,.22);transition:left .6s cubic-bezier(.34,1.35,.64,1),width .6s cubic-bezier(.34,1.35,.64,1)}
      .ob{font:600 12.5px "Segoe UI",system-ui;color:#c9cad6;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:99px;padding:8px 15px;cursor:pointer;transition:background .3s,color .3s,transform .4s cubic-bezier(.22,1,.36,1)}.ob:hover{background:rgba(255,255,255,.16);color:#fff;transform:translateY(-1px)}
      .sp{position:fixed;left:0;top:0;height:3px;width:0;z-index:20;background:linear-gradient(90deg,#fff,#9a9ab0);box-shadow:0 0 12px rgba(255,255,255,.6);transition:width .15s}
      .hero:before{content:'';position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(420px 260px at var(--hx,70%) var(--hy,30%),rgba(255,255,255,.12),transparent 70%);opacity:0;transition:opacity .5s}.hero:hover:before{opacity:1}
      .sl.on .ps{animation:psf 7s ease-in-out 1.4s infinite}@keyframes psf{0%,100%{transform:translateY(-50%) rotate(3deg)}50%{transform:translateY(calc(-50% - 10px)) rotate(2deg)}}
      .cd .im{isolation:isolate;will-change:transform}.cd:active .im{transform:scale(.97)!important}
      .cd .im:before{content:'';position:absolute;inset:-60%;z-index:1;background:conic-gradient(from 0deg,transparent 0 70%,rgba(255,255,255,.55) 85%,transparent 100%);opacity:0;transition:opacity .4s;animation:bdr 3.2s linear infinite}.cd:hover .im:before{opacity:1}.cd .im img{position:relative;z-index:1;clip-path:inset(1.5px round 17px)}
      .gr.list .cd .im:before{display:none}
      .up{position:fixed;right:30px;bottom:30px;z-index:9;width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,255,255,.2);background:rgba(20,20,28,.85);backdrop-filter:blur(10px);color:#fff;font-size:18px;cursor:pointer;opacity:0;transform:translateY(20px) scale(.8);pointer-events:none;transition:opacity .4s,transform .5s cubic-bezier(.34,1.4,.64,1),background .3s,color .3s}.up.on{opacity:1;transform:none;pointer-events:auto}.up:hover{background:#f4f4f8;color:#0b0b13}
      .sr{display:block}.kb{position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:11px;color:#8e90a0;border:1px solid rgba(255,255,255,.15);border-radius:6px;padding:1px 7px;pointer-events:none}.sr input:focus~.kb{opacity:0}
      .sl h2 span{display:inline-block;opacity:0;transform:translateY(.5em);filter:blur(8px);transition:opacity .7s,transform .8s cubic-bezier(.22,1,.36,1),filter .7s;transition-delay:calc(var(--c)*28ms + .25s)}.sl.on h2 span{opacity:1;transform:none;filter:none}
      .w{overflow-x:hidden!important}
      ${BAR2}
      .tb:active,.ob:active,.vw button:active{transform:scale(.94)}
      .gr.al{grid-template-columns:1fr;gap:12px;max-width:1000px}
      .azb{display:none;flex-wrap:nowrap;justify-content:space-between;gap:2px;max-width:1000px;margin:18px auto 0;padding:8px;border-radius:20px;background:rgba(16,16,26,.7);border:1px solid rgba(255,255,255,.09);backdrop-filter:blur(16px);position:sticky;top:78px;z-index:6;box-shadow:0 16px 40px rgba(0,0,0,.4)}
      .azb button{min-width:0;flex:1;height:32px;padding:0;border-radius:10px;border:0;background:none;color:#aeb0c0;font:700 13px "Segoe UI",system-ui;cursor:pointer;transition:background .3s,color .3s,transform .4s cubic-bezier(.34,1.5,.64,1)}.azb button:hover:not(:disabled){background:rgba(255,255,255,.14);color:#fff;transform:translateY(-2px) scale(1.12)}.azb button.on{background:#f4f4f8;color:#0b0b13;box-shadow:0 6px 18px rgba(255,255,255,.25)}.azb button:disabled{opacity:.22;cursor:default}
      .alr .abg{position:absolute;inset:-40px;background:center/cover;filter:blur(46px) saturate(1.6) brightness(.5);opacity:.18;transition:opacity .6s,transform 1.2s cubic-bezier(.22,1,.36,1)}.alr:hover .abg{opacity:.55;transform:scale(1.12)}
      .alr .aw{position:absolute;right:190px;top:50%;transform:translateY(-50%);font:900 96px/1 "Segoe UI",system-ui;color:transparent;-webkit-text-stroke:1.5px rgba(255,255,255,.07);pointer-events:none;transition:-webkit-text-stroke-color .4s,transform .7s cubic-bezier(.22,1,.36,1)}.alr:hover .aw{-webkit-text-stroke-color:rgba(255,255,255,.22);transform:translateY(-50%) scale(1.08)}
      .alr>*{z-index:1}.alr .aw,.alr .abg{z-index:0}
      .ax{display:grid;grid-template-rows:0fr;transition:grid-template-rows .5s cubic-bezier(.22,1,.36,1)}.ax>span{overflow:hidden;min-height:0;font-size:13px;line-height:1.5;color:#aeb0c0;opacity:0;transition:opacity .5s}.alr:hover .ax{grid-template-rows:1fr}.alr:hover .ax>span{opacity:1}
      .gr.al{perspective:1200px}
      .alr{position:relative;overflow:hidden;display:grid;grid-template-columns:54px 72px minmax(0,1fr) auto;align-items:center;gap:20px;padding:12px 24px 12px 8px;border-radius:22px;text-decoration:none;color:#ececf3;background:#11111a;border:1px solid rgba(255,255,255,.08);transition:transform .55s cubic-bezier(.34,1.3,.64,1),background .35s,border-color .35s,box-shadow .45s}
      .alr:hover{transform:translateX(8px);background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.22);box-shadow:0 18px 44px rgba(0,0,0,.45)}.alr:active{transform:translateX(8px) scale(.985)}
      .alr:before{content:'';position:absolute;left:0;top:18%;bottom:18%;width:3px;border-radius:3px;background:#fff;box-shadow:0 0 14px rgba(255,255,255,.7);transform:scaleY(0);transition:transform .5s cubic-bezier(.34,1.4,.64,1)}.alr:hover:before{transform:none}
      .alr .an{justify-self:center;font:800 13px "Segoe UI",system-ui;letter-spacing:.08em;color:#6f7183;transition:color .3s}.alr:hover .an{color:#fff}
      .acv{position:relative;display:block;width:72px;aspect-ratio:2/3;border-radius:11px;overflow:hidden;background:#14141c;box-shadow:0 10px 24px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.12);transition:transform .55s cubic-bezier(.34,1.3,.64,1)}.alr:hover .acv{transform:rotate(-3deg) scale(1.07)}.acv img{width:100%;height:100%;object-fit:cover;display:block}.acv .ph{font-size:24px}
      .ab{display:grid;gap:7px;min-width:0}.at{font-size:17px;line-height:1.2;letter-spacing:-.2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      .ac{display:flex;flex-wrap:wrap;align-items:center;gap:6px}.ac span{font-size:11.5px;font-weight:600;padding:3px 10px;border-radius:99px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08);color:#d2d3df}.ac span.v{background:#f4f4f8;color:#0b0b13;border-color:transparent}.ac em{font-style:normal;font-size:11.5px;color:#8e90a0;margin-left:4px}
      .ago{display:flex;align-items:center;gap:10px;font:700 13px "Segoe UI",system-ui;color:#c9cad6;opacity:.55;transform:translateX(-6px);transition:opacity .4s,transform .5s cubic-bezier(.22,1,.36,1)}.alr:hover .ago{opacity:1;transform:none}.ago i{display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.1);font-style:normal;font-size:18px;line-height:1;transition:background .3s,color .3s,transform .5s cubic-bezier(.34,1.5,.64,1)}.alr:hover .ago i{background:#f4f4f8;color:#0b0b13;transform:translateX(3px)}
      .pgs{display:flex;align-items:center;gap:6px;padding:6px;border-radius:99px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09)}
      .ft .pgs .pb{min-width:40px;height:40px;padding:0 12px;border-radius:99px;background:none;color:#b6b8c8;font:700 14px "Segoe UI",system-ui;border:0;box-shadow:none;cursor:pointer;transition:background .3s,color .3s,transform .4s cubic-bezier(.34,1.4,.64,1)}.ft .pgs .pb:after{display:none}.ft .pgs .pb:hover:not(:disabled){background:rgba(255,255,255,.12);color:#fff;transform:translateY(-2px)}.ft .pgs .pb.on{background:#f4f4f8;color:#0b0b13;box-shadow:0 6px 20px rgba(255,255,255,.22)}.ft .pgs .pb:disabled{opacity:.3;cursor:default}.pe{color:#6f7183;padding:0 4px}
      .gr.ud{grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;max-width:1240px}
      .up2{position:relative;overflow:hidden;display:grid;grid-template-columns:118px minmax(0,1fr);gap:22px;padding:18px;border-radius:26px;text-decoration:none;color:#ececf3;background:#10101a;border:1px solid rgba(255,255,255,.09);box-shadow:0 20px 50px rgba(0,0,0,.4);transition:transform .6s cubic-bezier(.34,1.3,.64,1),border-color .4s,box-shadow .5s;min-height:210px}
      .up2 .ubg{position:absolute;inset:-50px;background:center/cover;filter:blur(50px) saturate(1.6) brightness(.5);opacity:.42;transition:opacity .6s,transform 1.4s cubic-bezier(.22,1,.36,1)}.up2:hover .ubg{opacity:.7;transform:scale(1.15)}
      .up2:after{content:'';position:absolute;inset:0;background:linear-gradient(100deg,rgba(10,10,16,.55),rgba(10,10,16,.1) 60%,transparent);pointer-events:none}
      .up2:hover{transform:translateY(-6px);border-color:rgba(255,255,255,.24);box-shadow:0 30px 70px rgba(0,0,0,.55)}.up2:active{transform:translateY(-3px) scale(.99)}
      .up2>*{position:relative;z-index:1}
      .up2 .un{position:absolute;right:16px;top:-10px;z-index:1;font:900 92px/1 "Segoe UI",system-ui;letter-spacing:-4px;color:transparent;-webkit-text-stroke:1.5px rgba(255,255,255,.12);pointer-events:none;transition:-webkit-text-stroke-color .4s,transform .7s cubic-bezier(.22,1,.36,1)}.up2:hover .un{-webkit-text-stroke-color:rgba(255,255,255,.3);transform:translateY(6px) scale(1.04)}
      .ucv{align-self:start;display:block;width:118px;aspect-ratio:2/3;border-radius:16px;overflow:hidden;background:#14141c;box-shadow:0 18px 40px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.14);transition:transform .7s cubic-bezier(.34,1.3,.64,1)}.up2:hover .ucv{transform:rotate(-3deg) scale(1.05)}.ucv img{width:100%;height:100%;object-fit:cover;display:block}
      .ub{display:flex;flex-direction:column;gap:9px;min-width:0}
      .uk{display:flex;align-items:center;gap:8px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;font-weight:700;color:#b6b8c8}.uk .dot{width:7px;height:7px;border-radius:50%;background:#fff;box-shadow:0 0 10px #fff;animation:lgp 2.6s ease-in-out infinite}.uk em{font-style:normal;letter-spacing:.04em;text-transform:none;font-weight:600;color:#8e90a0;margin-left:2px}
      .ut{margin:0;font-size:21px;line-height:1.2;letter-spacing:-.4px;font-weight:700;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-shadow:0 2px 18px rgba(0,0,0,.6);padding-right:60px}
      .uc{display:flex;flex-wrap:wrap;gap:7px}.uc span{font-size:12px;font-weight:600;padding:4px 11px;border-radius:99px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.09);color:#dcdde8}.uc span.v{background:#f4f4f8;color:#0b0b13;border-color:transparent}
      .ud2{margin:0;color:#aeb0c0;font-size:13.5px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
      .uf{margin-top:auto;display:flex;justify-content:space-between;align-items:center;padding-top:4px}.uf small{color:#8e90a0;font-size:12px}
      .ugo{display:inline-flex;align-items:center;gap:10px;height:38px;padding:0 8px 0 16px;border-radius:99px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.14);font:700 13px "Segoe UI",system-ui;transition:background .35s,color .35s}.ugo i{display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,.14);font-style:normal;font-size:16px;line-height:1;transition:background .35s,transform .5s cubic-bezier(.34,1.5,.64,1)}.up2:hover .ugo{background:#f4f4f8;color:#0b0b13}.up2:hover .ugo i{background:#0b0b13;color:#fff;transform:translateX(3px)}
      .sk2{height:210px;border-radius:26px;background:linear-gradient(100deg,#12121a 30%,#1c1c27 50%,#12121a 70%) 0 0/250% 100%;animation:shm 1.5s linear infinite}
      .uw{display:inline-block;height:11px;border-radius:6px;background:linear-gradient(100deg,rgba(255,255,255,.06) 30%,rgba(255,255,255,.14) 50%,rgba(255,255,255,.06) 70%) 0 0/250% 100%;animation:shm 1.4s linear infinite}
      .up2:before{content:'';position:absolute;top:0;bottom:0;width:26%;left:-40%;z-index:2;background:linear-gradient(100deg,transparent,rgba(255,255,255,.09),transparent);transform:skewX(-16deg);transition:left 1.1s cubic-bezier(.22,1,.36,1);pointer-events:none}.up2:hover:before{left:130%}
      @media (max-width:1100px){.gr.ud{grid-template-columns:1fr}}
      .rk{position:absolute;z-index:4;left:10px;top:10px;min-width:34px;height:34px;padding:0 9px;display:grid;place-items:center;border-radius:12px;font:800 15px "Segoe UI",system-ui;font-style:normal;background:rgba(8,8,14,.8);border:1px solid rgba(255,255,255,.16);backdrop-filter:blur(8px);box-shadow:0 6px 18px rgba(0,0,0,.5)}
      .rk.r1{background:linear-gradient(135deg,#fff3c4,#e0a93b);color:#2a1d00;border-color:rgba(255,230,150,.9);box-shadow:0 0 22px rgba(255,200,80,.55)}.rk.r2{background:linear-gradient(135deg,#f4f6fa,#a9b0bd);color:#16181d;border-color:rgba(255,255,255,.8);box-shadow:0 0 18px rgba(200,210,230,.4)}.rk.r3{background:linear-gradient(135deg,#f0c9a4,#b0703a);color:#2a1604;border-color:rgba(240,190,140,.8);box-shadow:0 0 18px rgba(200,130,70,.4)}
      .gr.list .cd .rk{position:static;grid-column:2;grid-row:1;justify-self:start;margin-bottom:2px;height:26px;min-width:30px;font-size:13px;border-radius:9px}
      .cd:hover .rk{transform:translateY(-2px) scale(1.06)}.rk{transition:transform .4s cubic-bezier(.34,1.4,.64,1)}
      .hero:after{content:'';position:absolute;inset:-50%;z-index:1;pointer-events:none;background:radial-gradient(circle,rgba(255,255,255,.35) 0 1px,transparent 1.5px) 0 0/46px 46px,radial-gradient(circle,rgba(255,255,255,.2) 0 1px,transparent 1.5px) 23px 23px/46px 46px;opacity:.35;-webkit-mask-image:radial-gradient(60% 60% at 70% 40%,#000,transparent);mask-image:radial-gradient(60% 60% at 70% 40%,#000,transparent);animation:dots 40s linear infinite}@keyframes dots{to{transform:translate(46px,46px)}}
      .sl .tx:before{content:'';display:block;width:46px;height:3px;border-radius:3px;background:#fff;box-shadow:0 0 16px rgba(255,255,255,.7);transform:scaleX(0);transform-origin:left;transition:transform .9s .1s cubic-bezier(.22,1,.36,1)}.sl.on .tx:before{transform:none}
      .tl h1{position:relative;width:fit-content;margin-bottom:10px!important}.tl h1:after{content:'';position:absolute;left:0;bottom:-6px;height:2px;width:100%;border-radius:2px;background:linear-gradient(90deg,#fff,transparent);transform-origin:left;animation:ul .9s .25s cubic-bezier(.22,1,.36,1) backwards}@keyframes ul{from{transform:scaleX(0)}}
      .cd .nm b{background:linear-gradient(#fff,#fff) 0 100%/0 2px no-repeat;transition:background-size .5s cubic-bezier(.22,1,.36,1);padding-bottom:2px}.cd:hover .nm b{background-size:100% 2px}
      .cd .im .gl:after{content:'';position:absolute;top:-20%;bottom:-20%;width:34%;left:-50%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.28),transparent);transform:skewX(-16deg);transition:left .9s cubic-bezier(.22,1,.36,1)}.cd:hover .im .gl:after{left:130%}
      .vw button.on{box-shadow:0 4px 16px rgba(255,255,255,.2)}
      .sr input{box-shadow:inset 0 1px 0 rgba(255,255,255,.05)}.sr input:focus{box-shadow:0 0 0 4px rgba(255,255,255,.07)}
      .ft button{position:relative;overflow:hidden}.ft button:after{content:'';position:absolute;top:0;bottom:0;width:40%;left:-60%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.7),transparent);transform:skewX(-18deg)}.ft button:hover:after{left:130%;transition:left .8s cubic-bezier(.22,1,.36,1)}
      .hero{position:relative;max-width:1240px;margin:16px auto 0;height:330px;border-radius:28px;overflow:hidden;background:#0f0f16;box-shadow:0 30px 70px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.08);animation:up .9s .1s cubic-bezier(.22,1,.36,1) backwards}
      .sl{position:absolute;inset:0;opacity:0;visibility:hidden;transition:opacity 1s cubic-bezier(.22,1,.36,1),visibility 0s 1s}.sl.on{opacity:1;visibility:visible;transition:opacity 1s cubic-bezier(.22,1,.36,1)}
      .sl .bgi{position:absolute;inset:-30px;background:center/cover;filter:blur(30px) brightness(.5) saturate(1.5);transform:scale(1.1)}.sl.on .bgi{animation:kb 9s linear forwards}
      .sl .sh{position:absolute;inset:0;background:linear-gradient(90deg,rgba(6,6,10,.94),rgba(6,6,10,.55) 55%,rgba(6,6,10,.1)),linear-gradient(0deg,rgba(6,6,10,.65),transparent 50%)}
      .sl .tx{position:absolute;left:44px;top:50%;transform:translateY(-50%);width:min(560px,56%);display:grid;gap:13px}
      .sl .tx>*{opacity:0;transform:translateY(18px);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .9s cubic-bezier(.22,1,.36,1)}.sl.on .tx>*{opacity:1;transform:none}.sl.on .tx>:nth-child(1){transition-delay:.15s}.sl.on .tx>:nth-child(2){transition-delay:.25s}.sl.on .tx>:nth-child(3){transition-delay:.35s}.sl.on .tx>:nth-child(4){transition-delay:.45s}
      .sl small.k{font-size:11.5px;letter-spacing:.22em;text-transform:uppercase;color:#b4b6c4;font-weight:700}.sl h2{margin:0;font-size:40px;line-height:1.14;padding-bottom:.1em;letter-spacing:-1px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-shadow:0 4px 30px rgba(0,0,0,.6)}
      .sl .chp em{font-style:normal;font-size:12.5px;padding:5px 13px;border-radius:99px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.08);margin-right:8px}
      .sl .go{width:fit-content;display:inline-flex;align-items:center;gap:10px;height:46px;padding:0 24px;border-radius:14px;background:#f4f4f8;color:#0b0b13;font:700 14.5px "Segoe UI",system-ui;text-decoration:none;box-shadow:0 12px 34px rgba(255,255,255,.14);transition:transform .45s cubic-bezier(.34,1.4,.64,1),box-shadow .4s}.sl .go:hover{transform:translateY(-3px);box-shadow:0 18px 44px rgba(255,255,255,.22)}
      .sl .ps{position:absolute;right:60px;top:50%;width:190px;aspect-ratio:2/3;border-radius:18px;overflow:hidden;transform:translateY(-50%) rotate(3deg) scale(.92);opacity:0;box-shadow:0 30px 60px rgba(0,0,0,.65),0 0 0 1px rgba(255,255,255,.14);transition:opacity .9s .2s,transform 1.1s .2s cubic-bezier(.34,1.3,.64,1)}.sl.on .ps{opacity:1;transform:translateY(-50%) rotate(3deg)}.ps img{width:100%;height:100%;object-fit:cover;display:block}
      .dots{position:absolute;left:44px;bottom:20px;display:flex;gap:8px;z-index:2}.dots button{position:relative;width:9px;height:9px;padding:0;border:0;border-radius:99px;background:rgba(255,255,255,.28);cursor:pointer;overflow:hidden;transition:width .55s cubic-bezier(.22,1,.36,1),background .3s}.dots button.on{width:38px;background:rgba(255,255,255,.3)}.dots button.on:after{content:'';position:absolute;inset:0;background:#fff;border-radius:99px;animation:pg 6.5s linear forwards}
      .tl{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;max-width:1240px;margin:26px auto 0;padding:0 6px}.tl h1{margin:0;font-size:30px;letter-spacing:-.8px;line-height:1.1}.tl p{margin:4px 0 0;color:#8e90a0;font-size:13.5px}
      .ct{display:flex;gap:10px;align-items:center}
      .sr{position:relative}.sr input{width:260px;height:42px;border-radius:99px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.06);color:#fff;font:500 14px "Segoe UI",system-ui;padding:0 16px 0 40px;outline:none;transition:width .5s cubic-bezier(.22,1,.36,1),border-color .3s,background .3s}.sr input:focus{width:340px;border-color:rgba(255,255,255,.35);background:rgba(255,255,255,.09)}.sr:before{content:'⌕';position:absolute;left:15px;top:50%;transform:translateY(-52%);font-size:19px;color:#8e90a0}
      .vw{display:flex;padding:4px;border-radius:99px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.09)}.vw button{font:600 12.5px "Segoe UI",system-ui;color:#9d9eb0;background:none;border:0;border-radius:99px;padding:8px 14px;cursor:pointer;transition:background .3s,color .3s}.vw button.on{background:#f4f4f8;color:#0b0b13}
      .gr{max-width:1240px;margin:16px auto 0;padding:0 6px 100px;display:grid;grid-template-columns:repeat(auto-fill,minmax(176px,1fr));gap:20px}
      .gr.list{grid-template-columns:1fr;gap:10px;max-width:980px}
      .rv{opacity:0;transform:translateY(26px) scale(.97);filter:blur(5px);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .9s cubic-bezier(.22,1,.36,1),filter .8s cubic-bezier(.22,1,.36,1)}.rv.in{opacity:1;transform:none;filter:none}
      .cd{position:relative;display:block;color:#ececf3;text-decoration:none;perspective:700px}
      .cd .cx{position:absolute;z-index:5;top:10px;right:10px;display:flex;gap:6px;align-items:center;pointer-events:none}
      .cd .nb{display:inline-flex;align-items:center;gap:5px;font:800 9.5px "Segoe UI",system-ui;letter-spacing:.1em;padding:5px 9px;border-radius:99px;color:#0b0b13;background:linear-gradient(135deg,#fff,#d9dbe8);box-shadow:0 6px 20px rgba(255,255,255,.3);animation:nbp 2.6s ease-in-out infinite}@keyframes nbp{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
      .cd .dlb{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;color:#fff;background:rgba(10,10,18,.72);border:1px solid rgba(255,255,255,.22);backdrop-filter:blur(8px);opacity:0;transform:translateY(-8px) scale(.7);transition:opacity .35s,transform .5s cubic-bezier(.34,1.6,.64,1)}.cd:hover .dlb{opacity:1;transform:none}.cd:hover .dlb svg{animation:dlb 1.1s ease-in-out infinite}@keyframes dlb{0%,100%{transform:translateY(-1px)}50%{transform:translateY(2px)}}
      .cd .mi{display:flex;align-items:center;gap:6px;font:600 10.5px "Segoe UI",system-ui;color:#c4c5d4;opacity:.85;margin-top:3px}.cd .mi i{width:3px;height:3px;border-radius:50%;background:#7d7e92}.cd .mi svg{flex:none;opacity:.9}
      .cd .im{position:relative;display:block;aspect-ratio:2/3;border-radius:18px;overflow:hidden;background:#14141c;box-shadow:0 14px 34px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.08);transition:transform .5s cubic-bezier(.22,1,.36,1),box-shadow .5s;transform-style:preserve-3d}
      .cd .im img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .8s cubic-bezier(.22,1,.36,1)}.cd .im:after{content:'';position:absolute;inset:0;z-index:2;background:linear-gradient(0deg,rgba(5,5,9,.9) 0%,rgba(5,5,9,.2) 38%,transparent 60%)}
      .cd .gl{position:absolute;inset:0;z-index:2;background:radial-gradient(55% 55% at var(--mx,50%) var(--my,30%),rgba(255,255,255,.26),transparent 65%);opacity:0;transition:opacity .35s;pointer-events:none}.cd:hover .gl{opacity:1}
      .cd:hover .im{box-shadow:0 26px 54px rgba(0,0,0,.65),0 0 0 1px rgba(255,255,255,.22)}.cd:hover .im img{transform:scale(1.07)}
      .cd .bd{position:absolute;z-index:3;left:10px;top:10px;font-style:normal;font-size:11px;font-weight:700;padding:4px 10px;border-radius:99px;background:rgba(8,8,14,.78);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(6px)}
      .cd .nm{position:absolute;z-index:3;left:12px;right:12px;bottom:12px;display:grid;gap:2px;transition:transform .5s cubic-bezier(.22,1,.36,1)}.cd:hover .nm{transform:translateY(-4px)}.cd .nm b{font-size:14.5px;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-shadow:0 2px 14px rgba(0,0,0,.8)}.cd .nm small{font-size:11.5px;color:#aeb0c0;max-height:0;overflow:hidden;opacity:0;transition:max-height .45s,opacity .45s}.cd:hover .nm small{max-height:20px;opacity:1}
      .gr.list .cd{display:grid;grid-template-columns:64px minmax(0,1fr);gap:16px;align-items:center;padding:8px 16px 8px 8px;border-radius:18px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.07);transition:background .3s,transform .5s cubic-bezier(.34,1.3,.64,1),border-color .3s}.gr.list .cd:hover{background:rgba(255,255,255,.085);border-color:rgba(255,255,255,.18);transform:translateX(6px)}
      .gr.list .cd .im{width:64px;aspect-ratio:2/3;border-radius:12px}.gr.list .cd .im:after{display:none}.gr.list .cd .bd{position:static;justify-self:start;grid-column:2;grid-row:1}.gr.list .cd .nm{position:static;grid-column:2}.gr.list .cd .nm small{max-height:none;opacity:1}.gr.list .cd .nm b{font-size:17px;text-shadow:none}.gr.list .cd .im{grid-row:1 / span 2;grid-column:1}.gr.list .cd .gl{display:none}
      .ph{position:absolute;inset:0;display:grid;place-items:center;font:800 46px "Segoe UI",system-ui;color:rgba(255,255,255,.22);background:linear-gradient(135deg,#1d1d29,#0f0f16)}
      .bgi.shot{inset:0;filter:brightness(.7) saturate(1.1);transform:scale(1.02);animation:fi 1.2s backwards}.sl.on .bgi.shot{animation:kb 11s linear forwards}
      .sk{aspect-ratio:2/3;border-radius:18px;background:linear-gradient(100deg,#12121a 30%,#1c1c27 50%,#12121a 70%) 0 0/250% 100%;animation:shm 1.5s linear infinite}
      .ft{display:grid;place-items:center;padding:0 0 90px}.ft button{font:700 14px "Segoe UI",system-ui;color:#0b0b13;background:#f4f4f8;border:0;border-radius:14px;padding:14px 30px;cursor:pointer;transition:transform .4s cubic-bezier(.34,1.4,.64,1),box-shadow .4s}.ft button:hover{transform:translateY(-3px);box-shadow:0 18px 40px rgba(255,255,255,.18)}.ft .er{color:#9d9eb0}
      .em{grid-column:1/-1;text-align:center;color:#8e90a0;padding:60px 0}
      @media (max-width:900px){.sl .ps{display:none}.sl .tx{width:80%}.bar{flex-wrap:wrap}}
      @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.rv{opacity:1;transform:none;filter:none}}
    </style>
    <div class="base"></div>${AMB}
    <div class="sp" id="sp"></div><button class="up" id="up">↑</button><div class="w" id="w"><div class="bar"><span></span><div class="tb" id="tb"><span class="pill" id="pill"></span>${tabBtns(tabs)}</div><span></span></div>
      <div id="hero"></div>
      <div class="tl"><div><h1 id="tt"></h1><p id="ts"></p></div><div class="ct"><div class="sr"><input id="q" placeholder="Buscar en la lista…"><span class="kb">/</span></div></div></div>
      <div class="azb" id="az"></div><div class="gr" id="gr"></div><div class="ft" id="ft"></div></div>`;
    const $ = (x) => sh.querySelector(x), w = $('#w'), gr = $('#gr'), ft = $('#ft'), hero = $('#hero');
    const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { root: w, threshold: 0.04, rootMargin: '0px 0px 120px 0px' }) : null;
    const arm = () => gr.querySelectorAll('.rv:not(.in):not([data-a])').forEach((e, i) => { e.dataset.a = 1; e.style.transitionDelay = (i % 9) * 50 + 'ms'; io ? io.observe(e) : e.classList.add('in'); });
    const filt = () => { const it = (ST[cur].items || []), qq = q.trim().toLowerCase(); return qq ? it.filter((c) => c.title.toLowerCase().includes(qq)) : it; };
    const pill = () => { const b = sh.querySelector('#tb button.on'), p = $('#pill'); if (b) { p.style.left = b.offsetLeft + 'px'; p.style.width = b.offsetWidth + 'px'; } };
    const shotCache = {};
    const shotOf = (href) => shotCache[href] || (shotCache[href] = fetch(href, { credentials: 'include' }).then((r) => r.ok ? r.text() : '').then((t) => { if (!t) return ''; const doc = new DOMParser().parseFromString(t, 'text/html'), og = (doc.querySelector('meta[property="og:image"]') || {}).content || '', root = doc.querySelector('.entry-content, .post-content, article') || doc.body; const us = [...root.querySelectorAll('img')].map((i) => i.getAttribute('data-lazy-src') || i.getAttribute('data-src') || i.getAttribute('src') || '').filter((u) => u && !/^data:/.test(u) && !/logo|avatar|emoji|icon|gravatar|banner|button|badge/i.test(u)).map((u) => { try { return new URL(u, href).href; } catch (e) { return ''; } }).filter((u, i, a) => u && u !== og && a.indexOf(u) === i); return us[1] || us[0] || ''; }).catch(() => ''));
    const covC = {};
    const metaOf = (href) => covC[href] || (covC[href] = fetch(href, { credentials: 'include' }).then((r) => r.ok ? r.text() : '').then((t) => {
      if (!t) return {}; const doc = new DOMParser().parseFromString(t, 'text/html'), ab = (u) => { try { return u ? new URL(u, href).href : ''; } catch (e) { return ''; } };
      let u = (doc.querySelector('meta[property="og:image"]') || {}).content || ''; if (!u) { const im = doc.querySelector('.entry-content img, article img'); u = im ? (im.getAttribute('data-lazy-src') || im.getAttribute('data-src') || im.getAttribute('src') || '') : ''; }
      const root = doc.querySelector('.entry-content, .post-content, article') || doc.body, h1 = doc.querySelector('h1'), full = T(root), head = T(h1) + ' ' + full.slice(0, 3000);
      const vm = /\bv\s*(\d+(?:\.\d+)+)/i.exec(head), szm = /(?:game\s+)?(?:download\s+)?size\s*[:\-]?\s*(?:~|approx\.?\s*)?([\d.,]+\s*(?:GB|MB|TB))/i.exec(full), tm = doc.querySelector('time');
      const cats = [...doc.querySelectorAll('a[rel~=tag], a[rel~=category], .post-cat a, .meta-category a, .post-categories a')].map(T).filter((x, i, a) => x && a.indexOf(x) === i).slice(0, 2);
      let desc = ''; for (const p of root.querySelectorAll('p')) { const x = T(p); if (x.length > 70 && !/download|size|requirement|install|password|discord|mirror|^(os|cpu|ram)/i.test(x.slice(0, 80))) { desc = x.length > 190 ? x.slice(0, 187).replace(/\s+\S*$/, '') + '…' : x; break; } }
      return { img: ab(u), ver: vm ? 'v' + vm[1] : '', size: szm ? szm[1].replace(/\s+/g, ' ').toUpperCase() : '', date: tm ? T(tm) : '', cats, desc };
    }).catch(() => ({})));
    const coverOf = (href) => metaOf(href).then((m) => m.img || '');
    const allItems = () => Object.values(ST).flatMap((x) => (x.pages && Object.keys(x.pages).length ? Object.values(x.pages).flat() : (x.items || [])));
    const covQ = []; let covBusy = 0;
    const covPump = () => { while (covBusy < 4 && covQ.length) { const cd = covQ.shift(); covBusy++; metaOf(cd.href).then((m) => { const it = allItems().find((c) => c.href === cd.href); if (it) { it.m = m; if (m.img) it.img = m.img; }
      if (cd.classList.contains('up2') || cd.classList.contains('alr')) { if (it) { const t = document.createElement('div'); t.innerHTML = (cd.classList.contains('alr') ? lrow : row)(it, +cd.dataset.i); const n = t.firstChild; n.classList.add('in'); n.dataset.cv = 1; n.style.opacity = '0'; cd.replaceWith(n); requestAnimationFrame(() => { n.style.transition = 'opacity .7s'; n.style.opacity = '1'; }); } return; }
      const ph = cd.querySelector('.ph'); if (m.img && ph) { const im = new Image(); im.onload = () => { const t = document.createElement('img'); t.src = m.img; t.alt = ''; t.style.cssText = 'opacity:0;transition:opacity .8s'; ph.replaceWith(t); requestAnimationFrame(() => { t.style.opacity = '1'; }); }; im.src = m.img; } }).finally(() => { covBusy--; covPump(); }); } };
    const ioC = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { ioC.unobserve(e.target); covQ.push(e.target); covPump(); } }), { root: w, rootMargin: '400px' }) : null;
    let heroT = 0, heroTok = 0;
    const drawHero = () => {
      clearInterval(heroT); const it = (ST[cur].items || []).filter((c) => c.img).slice(0, 5);
      if (!it.length || q || cur === 'all' || (ST[cur].cur || 1) > 1) { hero.innerHTML = ''; return; }
      hero.innerHTML = '<div class="hero">' + it.map((c, i) => '<div class="sl' + (i ? '' : ' on') + '"><div class="bgi" style="background-image:url(\'' + esc(c.img) + '\')"></div><div class="sh"></div><div class="tx"><small class="k">' + (cur === 'top' ? 'Top ' + (i + 1) + ' · ' : '') + esc(tabs.find((x) => x.k === cur).sub) + '</small><h2>' + [...c.title].map((ch, n) => '<span style="--c:' + n + '">' + (ch === ' ' ? '&nbsp;' : esc(ch)) + '</span>').join('') + '</h2><a class="go" href="' + esc(c.href) + '">Ver juego  ›</a></div><div class="ps"><img src="' + esc(c.img) + '" alt=""></div></div>').join('') + '<div class="dots">' + it.map((c, i) => '<button data-i="' + i + '" class="' + (i ? '' : 'on') + '"></button>').join('') + '</div></div>';
      const tok = ++heroTok; it.forEach((c, i) => shotOf(c.href).then((u) => { if (!u || tok !== heroTok) return; const im = new Image(); im.onload = () => { const sl = hero.querySelectorAll('.sl')[i]; if (!sl || tok !== heroTok) return; const b = sl.querySelector('.bgi'); b.style.backgroundImage = 'url(\'' + u + '\')'; b.classList.add('shot'); }; im.src = u; }));
      let i0 = 0; const go = (i) => { i0 = (i + it.length) % it.length; hero.querySelectorAll('.sl').forEach((e, k) => e.classList.toggle('on', k === i0)); hero.querySelectorAll('.dots button').forEach((e, k) => { e.classList.remove('on'); if (k === i0) { void e.offsetWidth; e.classList.add('on'); } }); };
      hero.querySelectorAll('.dots button').forEach((b) => { b.onclick = () => { go(+b.dataset.i); restart(); }; });
      const restart = () => { clearInterval(heroT); if (it.length > 1) heroT = setInterval(() => { if (!hero.querySelector('.hero:hover') && !document.hidden) go(i0 + 1); }, 6500); }; restart();
    };
    const draw = () => {
      const t = tabs.find((x) => x.k === cur), st = ST[cur], list = filt();
      $('#tt').textContent = q ? 'Resultados para “' + q + '”' : t.t; $('#ts').textContent = st.items ? list.length + ' juegos' + (st.next && !q ? ' · hay más para cargar' : '') : 'Cargando…';
      gr.className = 'gr' + (cur === 'upd' ? ' ud' : cur === 'all' ? ' al' : '');
      if (!st.items) { gr.innerHTML = Array.from({ length: 14 }, () => '<div class="' + (cur === 'upd' ? 'sk2' : 'sk') + '"></div>').join(''); ft.innerHTML = ''; hero.innerHTML = ''; return; }
      const az = $('#az'); az.style.display = cur === 'all' && st.items ? 'flex' : 'none';
      if (cur === 'all') {
        const lt = (c) => { const x = c.title.trim().charAt(0).toUpperCase(); return /[A-Z]/.test(x) ? x : '#'; }; const first = {}; list.forEach((c, ix) => { const l = lt(c); if (first[l] === undefined) first[l] = ix; });
        const pgs0 = Math.max(1, Math.ceil(list.length / PER)), p0 = Math.min(Math.max(1, pgN), pgs0), curL = list[(p0 - 1) * PER] ? lt(list[(p0 - 1) * PER]) : '';
        az.innerHTML = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map((l) => '<button data-l="' + l + '"' + (first[l] === undefined ? ' disabled' : '') + (l === curL ? ' class="on"' : '') + '>' + l + '</button>').join('');
        az.querySelectorAll('button:not(:disabled)').forEach((b) => { b.onclick = () => { pgN = Math.floor(first[b.dataset.l] / PER) + 1; w.scrollTo({ top: Math.max(0, gr.offsetTop - 150), behavior: 'smooth' }); draw(); }; });
      }
      if (cur === 'all') {
        const pages = Math.max(1, Math.ceil(list.length / PER)); pgN = Math.min(Math.max(1, pgN), pages); const base = (pgN - 1) * PER, vis2 = list.slice(base, base + PER);
        $('#ts').textContent = list.length + ' juegos · página ' + pgN + ' de ' + pages;
        gr.innerHTML = vis2.length ? vis2.map((c, j) => lrow(c, base + j)).join('') : '<div class="em">No hay juegos que coincidan</div>'; arm();
        if (ioC) gr.querySelectorAll('.alr').forEach((cd) => { const it = allItems().find((c) => c.href === cd.href); if (!cd.dataset.cv && !(it && it.m)) { cd.dataset.cv = 1; ioC.observe(cd); } });
        ft.innerHTML = pager(pages, pgN) || (st.err ? '<span class="er">' + esc(st.err) + '</span>' : ''); ft.querySelectorAll('[data-p]').forEach((b) => { b.onclick = () => { pgN = +b.dataset.p; w.scrollTo({ top: Math.max(0, gr.offsetTop - 120), behavior: 'smooth' }); draw(); }; }); return;
      }
      if (PAGED(cur)) {
        const loaded = Object.keys(st.pages).map(Number), pages = st.total || (Math.max(1, ...loaded) + 1);
        $('#ts').textContent = list.length + ' juegos · página ' + st.cur + (st.total ? ' de ' + st.total : '');
        gr.innerHTML = list.length ? list.map(card).join('') : '<div class="em">No hay juegos que coincidan</div>'; arm();
        ft.innerHTML = pager(pages, st.cur) + (st.busy ? '<div class="er" style="margin-top:12px">Cargando…</div>' : '') + (st.err ? '<div class="er" style="margin-top:12px">' + esc(st.err) + '</div>' : '');
        ft.style.display = 'grid'; ft.querySelectorAll('[data-p]').forEach((b) => { b.onclick = () => goPage(cur, +b.dataset.p); }); return;
      }
      const vis = list.slice(0, q ? 400 : Math.max(shown, PAGE));
      gr.innerHTML = vis.length ? vis.map(cur === 'upd' ? row : card).join('') : '<div class="em">No hay juegos que coincidan</div>'; arm(); if (ioC) (cur === 'upd' ? gr.querySelectorAll('.up2') : [...gr.querySelectorAll('.ph')].map((p) => p.closest('.cd'))).forEach((cd) => { const it = cur === 'upd' ? allItems().find((c) => c.href === cd.href) : null; if (cd && !cd.dataset.cv && !(it && it.m)) { cd.dataset.cv = 1; ioC.observe(cd); } });
      const more = list.length > vis.length;
      ft.innerHTML = more || (st.next && !q) ? '<button id="mr">' + (st.busy ? 'Cargando…' : 'Cargar más') + '</button>' : (st.err ? '<span class="er">' + esc(st.err) + '</span>' : '');
      const mr = $('#mr'); if (mr) mr.onclick = loadMore;
    };
    const fetchTab = async (k, url) => {
      const st = ST[k]; if (st.busy) return; st.busy = 1;
      try { const r = await fetch(url, { credentials: 'include' }); if (r.status === 404 && (ST[k].items || []).length) { st.next = ''; st.busy = 0; if (k === cur) draw(); return; } if (!r.ok) throw new Error('HTTP ' + r.status); const doc = new DOMParser().parseFromString(await r.text(), 'text/html'); const have = new Set((st.items || []).map((c) => c.href)); const add = cardsFrom(doc, url, k === 'new' ? 'new' : 'x').filter((c) => !have.has(c.href)); await Promise.all(add.filter((c) => k !== 'all' && (!c.img || k === 'upd')).slice(0, 10).map((c) => metaOf(c.href).then((m) => { c.m = m; if (m.img) c.img = m.img; }))); st.items = (st.items || []).concat(add); if (k === 'all') st.items.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })); st.pg++; st.next = add.length && k !== 'all' ? nxt(k, doc, url, st.pg) : ''; st.err = add.length || st.items.length ? '' : 'No encontré juegos en esta sección'; }
      catch (e) { st.next = ''; st.items = st.items || []; st.err = 'No se pudo cargar: ' + String(e.message || e).slice(0, 110); }
      st.busy = 0; if (k === cur) { draw(); if (k !== 'new' || true) drawHero(); }
    };
    const loadMore = () => { const st = ST[cur], list = filt(); if (list.length > shown && !q) { shown += PAGE; draw(); return; } if (st.next) fetchTab(cur, st.next).then(() => { shown += PAGE; draw(); }); };
    { const sn = ST.new, pn = +((/\/page\/(\d+)/.exec(location.pathname) || [0, 1])[1]); sn.pages[pn] = firstCards; sn.cur = pn; sn.psize = firstCards.length; sn.total = totalOf(document); sn.ph = phOf(document, location.href); }
    const pageUrl = (k, n) => { if (k === 'new') return n < 2 ? location.origin + '/' : location.origin + '/page/' + n + '/'; const b = new URL(tabs.find((x) => x.k === k).url); b.hash = ''; b.search = ''; b.pathname = b.pathname.replace(/\/page\/\d+\/?$/, '/').replace(/\/?$/, '/'); return n < 2 ? b.href : b.href + 'page/' + n + '/'; };
    const showPage = (k, n) => {
      const st = ST[k], fw = n > st.cur; st.cur = n;
      if (k !== cur) { st.items = st.pages[n]; return; }
      clearTimeout(swT); gr.classList.remove('xl', 'xr', 'ol', 'or'); void gr.offsetWidth; gr.classList.add(fw ? 'ol' : 'or'); hero.classList.add('o');
      swT = setTimeout(() => { st.items = st.pages[n]; gr.classList.remove('ol', 'or'); draw(); gr.classList.add(fw ? 'xl' : 'xr'); hero.classList.remove('o'); drawHero(); w.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => gr.classList.remove('xl', 'xr'), 700); }, 230);
    };
    const decH = (h) => { const d = document.createElement('textarea'); d.innerHTML = String(h || ''); return d.value; };
    const wpPage = async (n, per) => {
      const u = location.origin + '/wp-json/wp/v2/posts?per_page=' + per + '&page=' + n + '&_embed=wp:featuredmedia&_fields=link,title,_links,_embedded';
      const r = await fetch(u, { credentials: 'include', headers: { Accept: 'application/json' } }); if (!r.ok) return null;
      const j = await r.json().catch(() => null); if (!Array.isArray(j) || !j.length) return null;
      const tp = +r.headers.get('X-WP-TotalPages') || 0;
      const items = j.map((p) => { const m = p._embedded && p._embedded['wp:featuredmedia'] && p._embedded['wp:featuredmedia'][0], sz = m && m.media_details && m.media_details.sizes; const img = (sz && ((sz.medium_large || sz.large || sz.full || {}).source_url)) || (m && m.source_url) || ''; return { href: p.link, title: clean(decH(p.title && p.title.rendered)), img, build: '' }; }).filter((x) => x.href && x.title);
      return items.length ? { items, tp } : null;
    };
    let wpOk = null;
    const goPage = async (k, n) => {
      const st = ST[k]; if (st.busy || n < 1) return;
      if (st.pages[n]) { showPage(k, n); return; }
      st.busy = 1; st.err = ''; if (k === cur && st.items) draw();
      if (k === 'new' && wpOk !== false) {
        try { const per = st.psize || 12, w0 = await wpPage(n, per);
          if (w0) { wpOk = true; if (w0.tp) st.total = w0.tp; st.pages[n] = w0.items; st.busy = 0; showPage(k, n); return; }
          wpOk = false; } catch (e) { wpOk = false; }
      }
      try { const url = (st.ph && st.ph[n]) || pageUrl(k, n), r = await fetch(url, { credentials: 'include' });
        if (r.status === 404) { st.total = Math.max(1, n - 1); st.busy = 0; if (k === cur) draw(); return; }
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const doc = new DOMParser().parseFromString(await r.text(), 'text/html'), items = cardsFrom(doc, url, k === 'new' ? 'new' : 'x');
        if (!items.length) { st.total = Math.max(1, n - 1); st.busy = 0; if (k === cur) draw(); return; }
        { const first = (st.pages[1] || []).map((x) => x.href), same = items.filter((x) => first.includes(x.href)).length; if (n > 1 && first.length && same >= Math.ceil(items.length * 0.6)) throw new Error('esa página repite la 1 · ' + url.replace(location.origin, '')); }
        st.ph = Object.assign(st.ph || {}, phOf(doc, url));
        const t = totalOf(doc); if (t > (st.total || 0)) st.total = t; st.pages[n] = items; if (n === 1 || !st.psize) st.psize = items.length; st.busy = 0; showPage(k, n);
      } catch (e) { st.busy = 0; st.err = 'No se pudo cargar: ' + String(e.message || e).slice(0, 110); if (k === cur) draw(); }
    };
    let swT = 0;
    setTimeout(() => { if (wpOk === null) wpPage(1, ST.new.psize || 12).then((w0) => { if (!w0) { wpOk = false; return; } wpOk = true; if (w0.tp) { ST.new.total = w0.tp; if (cur === 'new') draw(); } }).catch(() => { wpOk = false; }); }, 400);
    const sw = (k) => {
      const di = tabs.findIndex((x) => x.k === k) - tabs.findIndex((x) => x.k === cur), fw = di > 0; clearTimeout(swT);
      sh.querySelectorAll('#tb button').forEach((b) => b.classList.toggle('on', b.dataset.k === k)); pill(); w.scrollTo({ top: 0, behavior: 'smooth' });
      gr.classList.remove('xl', 'xr', 'ol', 'or'); void gr.offsetWidth; gr.classList.add(fw ? 'ol' : 'or'); hero.classList.add('o');
      swT = setTimeout(() => {
        cur = k; shown = PAGE; pgN = 1; q = ''; $('#q').value = ''; gr.classList.remove('ol', 'or'); draw(); gr.classList.add(fw ? 'xl' : 'xr'); hero.classList.remove('o');
        if (ST[k].items) drawHero(); else if (PAGED(k)) goPage(k, 1); else fetchTab(k, tabs.find((x) => x.k === k).url);
        setTimeout(() => gr.classList.remove('xl', 'xr'), 700);
      }, 230);
    };
    sh.querySelectorAll('#tb button').forEach((b) => { b.onclick = () => b.dataset.k !== cur && sw(b.dataset.k); });
    let qt = 0; $('#q').oninput = (e) => { const val = e.target.value; clearTimeout(qt); qt = setTimeout(() => { q = val; shown = PAGE; pgN = 1; draw(); drawHero(); }, 120); };
    // inclinación 3D con brillo en cada tarjeta
    gr.addEventListener('mousemove', (e) => { const im = e.target.closest && e.target.closest('.cd .im'); if (!im || cur === 'upd') return; const r = im.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; im.style.transition = 'transform .08s linear,box-shadow .5s'; im.style.transform = 'rotateY(' + ((x - .5) * 10) + 'deg) rotateX(' + ((.5 - y) * 10) + 'deg) translateY(-6px)'; im.querySelector('.gl').style.setProperty('--mx', x * 100 + '%'); im.querySelector('.gl').style.setProperty('--my', y * 100 + '%'); }, { passive: true });
    gr.addEventListener('mouseout', (e) => { const im = e.target.closest && e.target.closest('.cd .im'); if (im && !im.contains(e.relatedTarget)) { im.style.transition = 'transform .7s cubic-bezier(.22,1,.36,1),box-shadow .5s'; im.style.transform = ''; } });
    w.addEventListener('scroll', () => { const m = w.scrollHeight - w.clientHeight; $('#sp').style.width = (m > 0 ? w.scrollTop / m * 100 : 0) + '%'; $('#up').classList.toggle('on', w.scrollTop > 500); }, { passive: true });
    $('#up').onclick = () => w.scrollTo({ top: 0, behavior: 'smooth' });
    hero.addEventListener('mousemove', (e) => { const h = hero.firstChild; if (!h || !h.getBoundingClientRect) return; const r = h.getBoundingClientRect(); h.style.setProperty('--hx', (e.clientX - r.left) + 'px'); h.style.setProperty('--hy', (e.clientY - r.top) + 'px'); const p = h.querySelector('.sl.on .ps'); if (p) { p.style.translate = ((e.clientX - r.left) / r.width - .5) * -14 + 'px ' + ((e.clientY - r.top) / r.height - .5) * -10 + 'px'; } }, { passive: true });
    hostEl.addEventListener('keydown', (e) => { if (e.key === '/' && sh.activeElement !== $('#q')) { e.preventDefault(); $('#q').focus(); } });
    document.addEventListener('keydown', (e) => { if (hostEl.style.display === 'none') return; if (e.key === '/' && !/INPUT|TEXTAREA/.test((document.activeElement || {}).tagName || '')) { e.preventDefault(); $('#q').focus(); } if (e.key === 'Escape') { $('#q').blur(); } if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const d = hero.querySelectorAll('.dots button'), on = [...d].findIndex((x) => x.classList.contains('on')); if (d.length && sh.activeElement !== $('#q')) d[(on + (e.key === 'ArrowRight' ? 1 : d.length - 1)) % d.length].click(); } });
    sh.addEventListener('click', (e) => { const a = e.target.closest && e.target.closest('a.cd, a.go, a.up2, a.alr'); if (!a || e.ctrlKey || e.metaKey) return; e.preventDefault(); const u = a.href; leave(() => { location.href = u; }); });
    // carga automática al llegar al final
    const snt = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && !q && !ST[cur].busy && ST[cur].items) { const mr = $('#mr'); if (mr) mr.click(); } }), { root: w, rootMargin: '0px 0px 500px 0px' }); snt.observe(ft);
    document.documentElement.classList.add('wt-console-on'); document.body.appendChild(hostEl); hoverPill(sh);
    shown = PAGE; sh.querySelector('#tb button[data-k=new]').classList.add('on'); requestAnimationFrame(() => { pill(); }); draw(); drawHero();
    { const hm = /wt=(\w+)/.exec(location.hash); if (hm && hm[1] !== 'new' && ST[hm[1]]) sw(hm[1]); }
  };
  let htries = 0; const goHome = () => { try { const c = cardsFrom(document, location.href, 'new'); if (c.length >= 4) { mountHome(c); return; } } catch (e) {} if (++htries < 8) setTimeout(goHome, 900); };
  let tries = 0; const go = () => { try { const d = build(); if (d) { mount(d); return; } } catch (e) {} if (++tries < 6) setTimeout(go, 1000); };
  if (/free-download/i.test(location.pathname)) go(); else if (/^\/(page\/\d+\/?)?$/.test(location.pathname)) goHome();
}
// FitGirl Repacks: portada con pestañas y páginas numeradas, y página de repack estilo consola (tamaño, idiomas, descargas).
function fitgirlConsole() {
  if (window.__wtF) return; window.__wtF = 1;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const T = (n) => (n && n.textContent || '').replace(/\s+/g, ' ').trim();
  const FONT = '"Segoe UI",system-ui,sans-serif';
  const BASE = `*{box-sizing:border-box}:host{all:initial}
    .base{position:fixed;inset:0;background:radial-gradient(60% 45% at 18% 0%,rgba(255,255,255,.07),transparent 70%),radial-gradient(50% 40% at 88% 8%,rgba(255,255,255,.045),transparent 70%),#07060f}
    .amb{position:fixed;inset:0;overflow:hidden;pointer-events:none}
    .orb{position:absolute;border-radius:50%;filter:blur(80px);background:radial-gradient(circle,rgba(255,255,255,.18),transparent 65%);opacity:.5;animation:orb var(--d) ease-in-out infinite alternate}
    @keyframes orb{from{transform:translate(0,0) scale(1)}to{transform:translate(var(--x),var(--y)) scale(1.3)}}
    .dot{position:absolute;bottom:-12px;left:var(--l);width:var(--s);height:var(--s);border-radius:50%;background:rgba(255,255,255,var(--a));filter:blur(var(--b));animation:fup var(--t) linear var(--dl) infinite}
    @keyframes fup{0%{transform:translate(0,0);opacity:0}12%{opacity:1}88%{opacity:1}100%{transform:translate(var(--dx),-108vh);opacity:0}}
    .vig{position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 38%,transparent 55%,rgba(0,0,0,.5))}
    .f{fill:currentColor;fill-opacity:.12}.a{fill:var(--ac,#fff);stroke:none}svg [stroke="var(--ac)"]{stroke:var(--ac,#fff)}
    .cur{position:fixed;left:0;top:0;width:560px;height:560px;margin:-280px 0 0 -280px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.075),transparent 65%);pointer-events:none;z-index:0;opacity:0;transition:opacity .5s;will-change:transform}
    .rp{position:absolute;border-radius:50%;background:rgba(255,255,255,.3);width:18px;height:18px;margin:-9px;pointer-events:none;animation:rp .65s cubic-bezier(.22,1,.36,1) forwards;z-index:4}@keyframes rp{to{transform:scale(22);opacity:0}}
    @keyframes lt{from{opacity:0;transform:translateY(16px) rotate(5deg);filter:blur(6px)}}@keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}@keyframes tin{from{opacity:0;transform:translateY(-16px) scale(.9)}}
    .hd h2 span{display:inline-block;animation:lt .65s calc(var(--k)*30ms) cubic-bezier(.34,1.5,.64,1) backwards}
    .bar.hb{grid-template-columns:auto minmax(0,1fr) auto}.bar.hb{padding-left:28px;padding-right:28px}.bar.hb .sr{width:210px}.bar.hb .sr:focus-within{width:250px}.bar.hb .tbw{justify-self:center}.hubtb button{padding:0 13px!important;gap:7px!important}@media (max-width:1280px){.bar.hb .lg{display:none}.bar.hb{grid-template-columns:minmax(0,1fr) auto}.bar.hb .sr{width:200px}}
    .hubtb button.on{background:none!important;box-shadow:none!important}.hubtb button{animation:tin .6s calc(var(--j)*65ms + .15s) cubic-bezier(.34,1.5,.64,1) backwards}
    .tbw .ac{position:absolute;top:6px;bottom:6px;left:0;width:0;border-radius:99px;background:#f4f4f8;box-shadow:0 6px 26px rgba(255,255,255,.28);transition:left .55s cubic-bezier(.34,1.35,.64,1),width .55s cubic-bezier(.34,1.35,.64,1)}
    .tbw button svg{flex:none;transition:transform .5s cubic-bezier(.34,1.6,.64,1)}.tbw button:hover svg{transform:scale(1.2) rotate(-8deg)}.tbw button.on svg{transform:scale(1.08)}
    .tbw button i{transition:transform .4s cubic-bezier(.34,1.6,.64,1),opacity .3s}.tbw button.on i{opacity:.8;transform:scale(1.1)}
    .w{animation:wi .9s cubic-bezier(.22,1,.36,1) backwards}@keyframes wi{from{opacity:0;transform:scale(1.025) translateY(12px);filter:blur(10px)}}
    @keyframes cin{from{opacity:0;transform:translateX(var(--dx,40px)) scale(.93);filter:blur(6px)}}@keyframes cout{to{opacity:0;transform:translateX(calc(var(--dx,40px)*-.7)) scale(.94);filter:blur(6px)}}
    .gr.ent .cs,.gr.ent .rw{animation:cin .62s calc(var(--i)*36ms) cubic-bezier(.22,1,.36,1) backwards!important}
    .bar{transition:padding .45s cubic-bezier(.22,1,.36,1)}.bar.sc{padding-top:9px;padding-bottom:9px}.bar:before{transition:background .4s}.bar.sc:before{background:linear-gradient(180deg,rgba(7,6,15,.98) 60%,rgba(7,6,15,0))}
    .bar.sc .tbw,.bar.sc .back,.bar.sc .sr{box-shadow:0 12px 32px rgba(0,0,0,.65),inset 0 1px 0 rgba(255,255,255,.08)}
    .rt{display:flex;justify-content:flex-end;animation:up .7s .14s backwards}
    .tg{display:inline-flex;align-items:center;gap:11px;height:42px;padding:0 18px 0 8px;border-radius:99px;font:600 13.5px ${FONT};color:#a6a7b8;background:rgba(16,16,26,.74);border:1px solid rgba(255,255,255,.11);backdrop-filter:blur(22px);cursor:pointer;transition:color .3s,border-color .3s,box-shadow .4s}.tg em{font-style:normal}
    .tg .kn{position:relative;width:38px;height:24px;border-radius:99px;background:rgba(255,255,255,.12);transition:background .4s}.tg .kn:after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.4);transition:transform .5s cubic-bezier(.34,1.7,.64,1)}
    .tg.on{color:#fff;border-color:rgba(61,220,151,.45);box-shadow:0 0 30px rgba(61,220,151,.14)}.tg.on .kn{background:#2fbf84}.tg.on .kn:after{transform:translateX(14px)}.tg:active .kn:after{width:23px}
    .sw svg:last-child{transition:transform .45s cubic-bezier(.34,1.6,.64,1)}.sw.open svg:last-child{transform:rotate(180deg)}
    .dd{position:fixed;z-index:20;top:74px;left:50%;width:min(720px,calc(100% - 40px));margin-left:calc(min(720px,100% - 40px)/-2);padding:16px;border-radius:26px;background:rgba(14,14,24,.98);border:1px solid rgba(255,255,255,.13);box-shadow:0 40px 90px rgba(0,0,0,.65),inset 0 1px 0 rgba(255,255,255,.08);display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:8px;opacity:0;transform:translateY(-14px) scale(.96);transform-origin:50% 0;pointer-events:none;transition:opacity .3s,transform .5s cubic-bezier(.34,1.4,.64,1)}
    .w.dop .bar *{backdrop-filter:none!important}.w.dop .bar:before{display:none}
    .dd.open{opacity:1;transform:none;pointer-events:auto}
    .di{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px 11px;border-radius:16px;cursor:pointer;color:#c9cad6;font:700 12.5px ${FONT};background:rgba(255,255,255,.035);border:1px solid transparent;opacity:0;transform:translateY(8px);transition:background .3s,color .3s,transform .4s cubic-bezier(.34,1.6,.64,1),border-color .3s}
    .dd.open .di{opacity:1;transform:none;transition-delay:calc(var(--i)*18ms),calc(var(--i)*18ms),calc(var(--i)*18ms),0s,0s}.di:hover{background:rgba(255,255,255,.1);color:#fff;transform:translateY(-3px) scale(1.04)!important;border-color:rgba(255,255,255,.2)}.di.cur{border-color:rgba(255,255,255,.35);background:rgba(255,255,255,.09);color:#fff}
    .w{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;font-family:${FONT};color:#e8e8f0;transition:opacity .32s ease,transform .4s cubic-bezier(.4,0,.2,1),filter .32s ease;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.18) transparent}
    .w.out{opacity:0;transform:scale(.975) translateY(8px);filter:blur(6px)}
    @keyframes up{from{opacity:0;transform:translateY(18px)}}@keyframes pop{from{opacity:0;transform:translateY(22px) scale(.94)}}
    @keyframes swp{0%,100%{background-position:0 0;opacity:.35}50%{background-position:100% 0;opacity:1}}@keyframes lgp{0%,100%{opacity:.55;transform:scale(.85)}50%{opacity:1;transform:scale(1.15)}}
    @keyframes xl{from{opacity:0;transform:translateX(46px);filter:blur(7px)}}@keyframes xr{from{opacity:0;transform:translateX(-46px);filter:blur(7px)}}@keyframes ol{to{opacity:0;transform:translateX(-46px);filter:blur(7px)}}@keyframes or{to{opacity:0;transform:translateX(46px);filter:blur(7px)}}
    .bar{position:sticky;top:0;z-index:8;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:16px;padding:16px max(28px,calc(50% - 620px)) 14px}
    .bar:before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,6,15,.94) 40%,rgba(7,6,15,0));z-index:-1;pointer-events:none}
    .bar>:first-child{justify-self:start}.bar>:last-child{justify-self:end}
    .lg{font:800 14px ${FONT};letter-spacing:.3em;color:#fff;display:flex;align-items:center;gap:12px;animation:up .7s backwards}
    .lg:before{content:'';width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 14px #fff;animation:lgp 2.6s ease-in-out infinite}
    .back{display:inline-flex;align-items:center;gap:9px;height:42px;padding:0 18px 0 14px;font:600 13.5px ${FONT};color:#c9cad6;background:rgba(16,16,26,.74);border:1px solid rgba(255,255,255,.11);border-radius:99px;cursor:pointer;backdrop-filter:blur(22px);box-shadow:0 14px 36px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.07);transition:color .3s,background .3s,transform .4s cubic-bezier(.22,1,.36,1);animation:up .7s backwards}
    .back:hover{color:#fff;background:rgba(40,40,58,.8);transform:translateX(-3px)}.back svg{transition:transform .4s cubic-bezier(.34,1.5,.64,1)}.back:hover svg{transform:translateX(-3px)}
    .tbw{position:relative;display:flex;gap:4px;padding:6px;border-radius:99px;background:rgba(16,16,26,.74);border:1px solid rgba(255,255,255,.11);backdrop-filter:blur(22px);box-shadow:0 20px 50px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.08);animation:up .7s .08s backwards;max-width:100%;overflow-x:auto;scrollbar-width:none}
    .tbw button{position:relative;z-index:1;display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 17px;font:600 13.5px ${FONT};white-space:nowrap;color:#a6a7b8;background:none;border:0;border-radius:99px;cursor:pointer;transition:color .3s,background .3s,box-shadow .3s}
    .tbw button:hover{color:#fff}.tbw button.on{color:#0b0b13;background:#f4f4f8;box-shadow:0 6px 24px rgba(255,255,255,.2)}.tbw button i{font:700 10.5px ${FONT};font-style:normal;opacity:.55}
    .tbw .hv{position:absolute;top:6px;bottom:6px;left:0;width:0;border-radius:99px;background:rgba(255,255,255,.1);opacity:0;transition:left .45s cubic-bezier(.22,1,.36,1),width .45s cubic-bezier(.22,1,.36,1),opacity .3s}
    .sr{display:flex;align-items:center;gap:10px;height:42px;width:min(260px,100%);padding:0 14px;border-radius:99px;background:rgba(16,16,26,.74);border:1px solid rgba(255,255,255,.11);backdrop-filter:blur(22px);box-shadow:0 14px 36px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.07);transition:border-color .3s,width .4s cubic-bezier(.22,1,.36,1);animation:up .7s .14s backwards;color:#8e8fa3}
    .sr:focus-within{border-color:rgba(255,255,255,.4);width:min(320px,100%);color:#fff}.sr input{flex:1;min-width:0;background:none;border:0;outline:0;color:#fff;font:500 13.5px ${FONT}}.sr input::placeholder{color:#7d7e92}
    .ct{max-width:1240px;margin:0 auto;padding:6px 28px 70px}
    .hd{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin:18px 0 22px;animation:up .7s .1s backwards}
    .hd h2{margin:0;font:800 34px ${FONT};letter-spacing:-.02em;color:#fff;position:relative;display:inline-block}.hd h2:after{content:'';position:absolute;left:0;right:0;bottom:-8px;height:2px;border-radius:2px;background:linear-gradient(90deg,#fff,transparent);transform-origin:left;animation:ln .9s .3s cubic-bezier(.22,1,.36,1) backwards}
    @keyframes ln{from{transform:scaleX(0)}}.hd p{margin:16px 0 0;font:500 13.5px ${FONT};color:#8e8fa3}
    .gr.ol{animation:ol .23s cubic-bezier(.4,0,1,1) forwards}.gr.or{animation:or .23s cubic-bezier(.4,0,1,1) forwards}.gr.xl{animation:xl .55s cubic-bezier(.22,1,.36,1)}.gr.xr{animation:xr .55s cubic-bezier(.22,1,.36,1)}
    .em{padding:80px 0;text-align:center;color:#8e8fa3;font:500 15px ${FONT}}
    @media (max-width:980px){.bar{grid-template-columns:1fr auto}.bar .sr{display:none}.lg{display:none}}`;
  const DRAW_AMB = () => {
    const r = (a, b) => a + Math.random() * (b - a);
    return '<div class="amb">' + [0, 1, 2].map((i) => '<div class="orb" style="left:' + [8, 62, 34][i] + '%;top:' + [12, 55, 78][i] + '%;width:' + [420, 520, 380][i] + 'px;height:' + [420, 520, 380][i] + 'px;--x:' + [120, -160, 90][i] + 'px;--y:' + [80, -60, -110][i] + 'px;--d:' + (16 + i * 5) + 's"></div>').join('') +
      Array.from({ length: 16 }, () => '<i class="dot" style="--l:' + r(0, 100).toFixed(1) + '%;--s:' + r(2, 5).toFixed(1) + 'px;--a:' + r(.15, .5).toFixed(2) + ';--b:' + r(0, 1.5).toFixed(1) + 'px;--t:' + r(14, 30).toFixed(1) + 's;--dl:-' + r(0, 25).toFixed(1) + 's;--dx:' + r(-60, 60).toFixed(0) + 'px"></i>').join('') + '<div class="vig"></div></div>';
  };
  const mount = (css, html) => {
    const h = document.createElement('div'); h.id = 'wt-console'; h.style.cssText = 'position:fixed;inset:0;z-index:2147483000;display:block';
    const sh = h.attachShadow({ mode: 'open' });
    sh.innerHTML = '<style>' + BASE + css + '</style><div class="base"></div>' + DRAW_AMB() + '<div class="cur"></div><div class="w">' + html + '</div>';
    { const cu = sh.querySelector('.cur'); window.addEventListener('pointermove', (e) => { cu.style.opacity = '1'; cu.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)'; }, { passive: true }); document.addEventListener('pointerleave', () => { cu.style.opacity = '0'; }); }
    { const w = sh.querySelector('.w'), bar = () => sh.querySelector('.bar'); w.addEventListener('scroll', () => { const b = bar(); if (b) b.classList.toggle('sc', w.scrollTop > 24); }, { passive: true }); }
    document.documentElement.appendChild(h);
    const st = document.createElement('style'); st.textContent = 'html.wt-console-on body{visibility:hidden!important}html.wt-console-on{overflow:hidden!important;background:#07060f!important}'; document.head.appendChild(st);
    document.documentElement.classList.add('wt-console-on'); return sh;
  };
  const swapGrid = (gr, fw, apply, after) => {
    const kids = [...gr.children]; gr.style.setProperty('--dx', (fw ? 44 : -44) + 'px'); gr.classList.remove('ent');
    kids.forEach((k, i) => { k.style.animation = 'cout .3s cubic-bezier(.4,0,1,1) ' + Math.min(i, 12) * 16 + 'ms forwards'; });
    setTimeout(() => { apply(); gr.classList.add('ent'); if (after) after(); setTimeout(() => gr.classList.remove('ent'), 1300); }, 290 + Math.min(kids.length, 12) * 16);
  };
  const setTitle = (el, t) => { el.innerHTML = [...t].map((c, i) => '<span style="--k:' + i + '">' + (c === ' ' ? '&nbsp;' : esc(c)) + '</span>').join(''); };
  const countTo = (el, n, suf) => { const t0 = performance.now(), D = 520; cancelAnimationFrame(el._r); const f = (t) => { const p = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(n * e) + suf; if (p < 1) el._r = requestAnimationFrame(f); }; el._r = requestAnimationFrame(f); };
  const ripple = (el, e) => { const r = el.getBoundingClientRect(), d = document.createElement('span'); d.className = 'rp'; d.style.left = (e.clientX - r.left) + 'px'; d.style.top = (e.clientY - r.top) + 'px'; el.appendChild(d); setTimeout(() => d.remove(), 700); };
  const leave = (sh, cb) => {
    const w = sh.querySelector('.w'); const l = document.createElement('div');
    l.style.cssText = 'position:fixed;left:0;top:0;height:3px;width:0;z-index:99;background:linear-gradient(90deg,#fff,#9a9ab0);box-shadow:0 0 14px rgba(255,255,255,.7);transition:width .9s cubic-bezier(.22,1,.36,1)'; sh.appendChild(l);
    requestAnimationFrame(() => { l.style.width = '78%'; }); if (w) w.classList.add('out'); setTimeout(cb, 300);
  };
  const hoverPill = (sh) => { const g = sh.querySelector('.tbw'); if (!g) return; const p = document.createElement('span'); p.className = 'hv'; g.insertBefore(p, g.firstChild); const mv = (b) => { p.style.opacity = '1'; p.style.left = b.offsetLeft + 'px'; p.style.width = b.offsetWidth + 'px'; }; g.querySelectorAll('button').forEach((b) => b.addEventListener('mouseenter', () => mv(b))); g.addEventListener('mouseleave', () => { p.style.opacity = '0'; }); };
  const SRCH = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
  const BACK = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
  const P = location.pathname.replace(/\/+$/, '') || '/', Q = new URLSearchParams(location.search), O = location.origin;
  const TABS = [['new', 'Lanzamientos', '/'], ['pop', 'Populares', '/popular-repacks/'], ['up', 'Próximamente', '/upcoming-repacks/'], ['all', 'Todos A–Z', '/all-my-repacks-a-z/'], ['upd', 'Actualizaciones', '/updates-list/']];
  const TIC = { new: '<path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"/>', pop: '<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 .5 1.500 1.500 2 2 1 .5-2-.5-4 1-7z"/>', up: '<circle cx="12" cy="12" r="8.500"/><path d="M12 7v5l3 2"/>', all: '<path d="M4 6h16M4 12h16M4 18h10"/>', upd: '<path d="M20 12a8 8 0 1 1-2.500-5.800M20 4v5h-5"/>' };
  const TI = (k) => '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (TIC[k] || '') + '</svg>';
  const fx = (sh) => {
    sh.querySelectorAll('.pg button,.pn.on>*,.pn.on li,.pn.on .dl,.pn.on .gp,.chips span').forEach((e, i) => { if (!e.style.getPropertyValue('--k')) e.style.setProperty('--k', Math.min(i, 14)); });
    if (sh.__fx) return; sh.__fx = 1;
    { const w = sh.querySelector('.w'), bar = sh.querySelector('.bar.fg'); if (w && bar) { let ly = 0; w.addEventListener('scroll', () => { const y = w.scrollTop; bar.style.setProperty('--sp', (y / Math.max(1, w.scrollHeight - w.clientHeight)).toFixed(3)); bar.classList.toggle('gone', y > ly && y > 160 && !bar.matches(':focus-within')); ly = y; }, { passive: true }); } }
    sh.addEventListener('pointermove', (e) => {
      const m = e.target.closest && e.target.closest('.big,.pg button,.back,.ptb button'); if (m && !m.disabled) { const r = m.getBoundingClientRect(); m.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .22).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * .3).toFixed(1) + 'px)'; }
      const c = e.target.closest && e.target.closest('.cv'); if (c) { const r = c.getBoundingClientRect(); c.style.setProperty('--ry', (((e.clientX - r.left) / r.width - .5) * 14).toFixed(1) + 'deg'); c.style.setProperty('--rx', ((.5 - (e.clientY - r.top) / r.height) * 12).toFixed(1) + 'deg'); }
    });
    sh.addEventListener('pointerout', (e) => { const m = e.target.closest && e.target.closest('.big,.pg button,.back,.ptb button'); if (m) m.style.transform = ''; const c = e.target.closest && e.target.closest('.cv'); if (c) { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); } });
  };
  const abs = (u, b) => { try { return new URL(u, b || location.href).href; } catch (e) { return ''; } };
  const tidy = (t) => { const raw = String(t || '').replace(/\u00a0/g, ' '); let v = ''; const m = /\b(v\s?\d[\w.\-]*|build\s*\d+)/i.exec(raw); if (m) v = m[1].replace(/^v\s+/i, 'v'); let n = raw.replace(/\s+/g, ' ').replace(/^#\d+\s*(updated\s*)?/i, '').replace(/\s*\(\s*HV\s*\)/ig, '').replace(/\s+[–—-]+\s+.*$/, '').replace(/\s*[–—].*$/, '').replace(/\s*,\s*(v\s?\d|build|\d).*$/i, '').replace(/\s+(v\s?\d[\w.]*|build\s*\d+).*$/i, '').replace(/\s*\(\+.*$/, '').replace(/\s*\+\s*\d*\s*(DLCs?|bonus|update|soundtrack|OST).*$/i, '').replace(/\s*Free\s*Download.*/i, '').replace(/[\s,:;\-–—]+$/, '').trim(); if (n.length < 2) n = raw.trim(); return { name: n, ver: v, hv: /\(\s*HV\s*\)|\bHV\b|hypervisor/i.test(raw) }; };
  const imgOf = (root, base) => { const im = root.querySelector('img'); if (!im) return ''; const s = im.getAttribute('data-lazy-src') || im.getAttribute('data-src') || (im.getAttribute('data-lazy-srcset') || im.getAttribute('srcset') || '').split(/\s+/)[0] || im.getAttribute('src') || ''; return /^data:/.test(s) ? '' : abs(s, base); };
  const hueOf = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360; return h; };
  const rx = (t, re) => { const m = re.exec(t); return m ? m[1].replace(/\s+/g, ' ').trim() : ''; };
  const infoOf = (txt) => ({
    rep: rx(txt, /Repack Size:\s*(?:from\s*)?~?\s*([\d.,]+\s*[KMGT]?B(?:\s*\/\s*[\d.,]+\s*[KMGT]?B)?)/i), org: rx(txt, /Original Size:\s*~?\s*([\d.,]+\s*[KMGT]?B)/i),
    lang: rx(txt, /Languages?:\s*(.{1,80}?)(?=\s*(?:Original Size|Repack Size|Download|Companies|Genres|Screenshots|$))/i), gen: rx(txt, /Genres\/Tags:\s*(.{1,90}?)(?=\s*(?:Companies|Languages|Original Size|Repack Size|$))/i), co: rx(txt, /Companies?:\s*(.{1,70}?)(?=\s*(?:Languages|Original Size|Repack Size|Genres|$))/i),
  });
  // ---------- lectura de listados ----------
  const readArticles = (doc, base) => {
    const out = [], seen = new Set();
    doc.querySelectorAll('article').forEach((ar) => {
      const a = ar.querySelector('.entry-title a, h1 a, h2 a, h3 a'); if (!a) return; const href = abs(a.getAttribute('href'), base); if (!href || seen.has(href) || /upcoming/i.test(T(a))) return; seen.add(href);
      const raw = T(a), t = tidy(raw), tx = ar.textContent.replace(/\s+/g, ' '), inf = infoOf(tx), tm = ar.querySelector('time'), d = tm ? (tm.getAttribute('datetime') || T(tm)) : '';
      out.push({ href, title: t.name, ver: t.ver, hv: t.hv, img: imgOf(ar, base), rep: inf.rep, org: inf.org, lang: inf.lang, gen: inf.gen, date: d ? d.slice(0, 10) : '' });
    });
    return out;
  };
  const readPopular = (doc, base) => {
    const out = [], seen = new Set(), root = doc.querySelector('.entry-content') || doc.body;
    root.querySelectorAll('a[href]').forEach((a) => { const im = a.querySelector('img'); if (!im) return; const href = abs(a.getAttribute('href'), base); if (!href || seen.has(href) || href.replace(/\/$/, '') === O || /\/(category|tag|page)\//.test(href)) return; seen.add(href); const raw = a.getAttribute('title') || im.getAttribute('alt') || T(a) || decodeURIComponent((href.split('/').filter(Boolean).pop() || '').replace(/-/g, ' ')); const t = tidy(raw); out.push({ href, title: t.name, ver: t.ver, hv: t.hv, img: imgOf(a, base), rep: '', org: '', lang: '', gen: '', date: '' }); });
    return out;
  };
  const readUpd = (doc, base) => {
    const out = [], sp = doc.querySelectorAll('.su-spoiler');
    sp.forEach((e) => { const t = T(e.querySelector('.su-spoiler-title')), c = e.querySelector('.su-spoiler-content'); if (!t) return; const ls = c ? [...c.querySelectorAll('a[href]')].map((a) => ({ t: T(a) || 'Enlace', h: abs(a.getAttribute('href'), base) })) : []; const tt = tidy(t); out.push({ href: '', title: tt.name, ver: tt.ver, ls, img: '', rep: '', org: '', lang: '', gen: '', date: '' }); });
    return out;
  };
  const readUp = (doc, base) => {
    const out = [], seen = new Set(), root = doc.querySelector('.entry-content') || doc.body;
    root.querySelectorAll('a[href]').forEach((a) => { const href = abs(a.getAttribute('href'), base), raw = T(a).replace(/^[→\-–\s]+/, ''); if (!href || !raw || seen.has(href) || raw.length < 3 || href.indexOf(location.host) < 0 || /^https?:\/\/[^/]+\/?(#.*)?$/.test(href)) return; seen.add(href); const t = tidy(raw); out.push({ href, title: t.name, ver: t.ver, hv: t.hv, img: '', rep: '', org: '', lang: '', gen: '', date: '' }); });
    return out;
  };
  const readList = (doc, base) => {
    const out = [], seen = new Set();
    (doc.querySelector('.lcp_catlist') ? doc.querySelectorAll('.lcp_catlist a') : doc.querySelectorAll('.entry-content li a')).forEach((a) => { const href = abs(a.getAttribute('href'), base), raw = T(a); if (!href || !raw || seen.has(href)) return; seen.add(href); const t = tidy(raw); out.push({ href, title: t.name, ver: t.ver, hv: t.hv, img: '', rep: '', org: '', lang: '', gen: '', date: '' }); });
    return out;
  };
  const totalOf = (doc) => { let m = 0; doc.querySelectorAll('.page-numbers, .pagination a, .nav-links a, .lcp_paginator a, .lcp_paginator li').forEach((a) => { const n = parseInt(T(a).replace(/[^\d]/g, ''), 10); if (n > m && n < 5000) m = n; const h = /(?:\/page\/|lcp_page0=)(\d+)/.exec(a.getAttribute && a.getAttribute('href') || ''); if (h && +h[1] > m && +h[1] < 5000) m = +h[1]; }); return m; };
  const urlFor = (k, n, q) => {
    if (k === 'search') return n < 2 ? O + '/?s=' + encodeURIComponent(q) : O + '/page/' + n + '/?s=' + encodeURIComponent(q);
    if (NAV[k]) return NAV[k]; const b = TABS.find((t) => t[0] === k)[2]; return n < 2 ? O + b : O + b + 'page/' + n + '/';
  };
  const NAV = {}; let HOME = null;
  const navInit = async () => { if (HOME) return; try { HOME = await fetchDoc(O + '/'); if (!HOME) return; const want = { pop: /popular repacks/i, all: /all my repacks/i, upd: /updates list/i }; HOME.querySelectorAll('a[href]').forEach((a) => { const t = T(a); Object.keys(want).forEach((k) => { if (!NAV[k] && want[k].test(t) && a.getAttribute('href') && !/#/.test(a.getAttribute('href'))) NAV[k] = abs(a.getAttribute('href'), O + '/'); }); }); } catch (e) { HOME = null; } };
  const fetchDoc = async (u) => { const r = await fetch(u, { credentials: 'include' }); if (r.status === 404) return null; if (!r.ok) throw new Error('HTTP ' + r.status); return new DOMParser().parseFromString(await r.text(), 'text/html'); };

  // ---------- portada ----------
  const home = () => {
    const css = `.cg{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:18px}
      .fc{--i:0;position:relative;display:block;aspect-ratio:3/4.2;border-radius:22px;overflow:hidden;cursor:pointer;color:#fff;background:#12121c;border:1px solid rgba(255,255,255,.08);box-shadow:0 18px 44px rgba(0,0,0,.4);animation:pop .6s calc(var(--i)*34ms) cubic-bezier(.22,1,.36,1) backwards;transform:perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .28s cubic-bezier(.22,1,.36,1),border-color .35s,box-shadow .45s}
      .fc .im{position:absolute;inset:0}.fc .im img{width:100%;height:100%;object-fit:cover;transition:transform .9s cubic-bezier(.22,1,.36,1)}.fc .im b{position:absolute;inset:0;display:grid;place-items:center;font:800 54px ${FONT};color:rgba(255,255,255,.85);background:linear-gradient(135deg,hsl(var(--h) 55% 34%),hsl(calc(var(--h) + 40) 60% 18%))}
      .fc:before{content:'';position:absolute;inset:0;z-index:2;background:radial-gradient(260px circle at var(--mx,50%) var(--my,0%),rgba(255,255,255,.2),transparent 70%);opacity:0;transition:opacity .45s;pointer-events:none}
      .fc:after{content:'';position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,transparent 45%,rgba(7,6,15,.94))}
      .fc:hover{transform:perspective(900px) translateY(-7px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));border-color:rgba(255,255,255,.24);box-shadow:0 30px 64px rgba(0,0,0,.55)}.fc:hover:before{opacity:1}.fc:hover .im img{transform:scale(1.08)}.fc:active{transform:perspective(900px) translateY(-3px) scale(.985)}
      .fc .nm{position:absolute;z-index:3;left:14px;right:14px;bottom:13px;display:grid;gap:7px}.fc .nm b{font:700 14.5px/1.25 ${FONT};display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-shadow:0 2px 12px rgba(0,0,0,.7)}
      .fc .mi{display:flex;flex-wrap:wrap;gap:6px}.fc .mi span{display:inline-flex;align-items:center;gap:5px;font:700 10.5px ${FONT};color:#e8e8f2;padding:4px 9px;border-radius:99px;background:rgba(10,10,18,.62);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(8px)}
      .fc .cx{position:absolute;z-index:4;top:10px;right:10px;display:flex;gap:6px}.fc .nb{display:inline-flex;align-items:center;gap:5px;font:800 9.5px ${FONT};letter-spacing:.1em;padding:5px 9px;border-radius:99px;color:#0b0b13;background:linear-gradient(135deg,#fff,#d9dbe8);animation:nbp 2.6s ease-in-out infinite}@keyframes nbp{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
      .fc .rk{position:absolute;z-index:4;top:10px;left:10px;min-width:34px;height:34px;padding:0 9px;border-radius:12px;display:grid;place-items:center;font:800 15px ${FONT};color:#0b0b13;background:linear-gradient(135deg,#fff,#b9bacb)}.fc .rk.r1{background:linear-gradient(135deg,#ffe08a,#f5a524)}.fc .rk.r2{background:linear-gradient(135deg,#f3f4f8,#a7a9bd)}.fc .rk.r3{background:linear-gradient(135deg,#f0b48a,#b0693a)}
      .lr{display:flex;flex-direction:column;gap:10px}.rw{position:relative;overflow:hidden;display:flex;align-items:center;gap:16px;padding:12px 20px 12px 12px;border-radius:18px;background:linear-gradient(90deg,rgba(26,26,40,.72),rgba(14,14,22,.62));border:1px solid rgba(255,255,255,.07);cursor:pointer;color:#fff;animation:up .5s calc(var(--i)*22ms) cubic-bezier(.22,1,.36,1) backwards;transition:transform .45s cubic-bezier(.22,1,.36,1),border-color .3s,background .3s}
      .rw:hover{transform:translateX(7px);border-color:rgba(255,255,255,.24);background:linear-gradient(90deg,rgba(42,42,60,.88),rgba(20,20,30,.72))}.rw .tl{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;font:800 19px ${FONT};background:linear-gradient(135deg,hsl(var(--h) 60% 42%),hsl(calc(var(--h) + 40) 65% 26%))}.rw b{flex:1;min-width:0;font:600 15px ${FONT};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rw i{font:700 11px ${FONT};font-style:normal;color:#b4b5c6;padding:4px 10px;border-radius:99px;background:rgba(255,255,255,.07)}
      .bar.fg.fg{display:grid;grid-template-columns:1fr auto 1fr;padding-top:14px;transition:transform .8s cubic-bezier(.16,1,.3,1),padding .45s}.bar.fg.gone{transform:translateY(-135%)}
      .bar.fg .tbw{position:relative;overflow:visible;max-width:none;padding:7px;gap:2px;background:linear-gradient(135deg,rgba(32,30,52,.8),rgba(14,14,24,.82));border:0;box-shadow:0 24px 60px rgba(0,0,0,.55),0 0 40px rgba(130,100,255,.12),inset 0 1px 0 rgba(255,255,255,.1)}
      .bar.fg .tbw:before{content:'';position:absolute;inset:0;border-radius:99px;padding:1.5px;background:linear-gradient(100deg,rgba(255,255,255,.06),rgba(170,150,255,.85),rgba(255,110,170,.6),rgba(255,255,255,.06),rgba(47,212,255,.5),rgba(255,255,255,.06));background-size:320% 100%;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:bsl 7s linear infinite;pointer-events:none}@keyframes bsl{to{background-position:-320% 0}}
      .bar.fg .tbw .ac{background:linear-gradient(135deg,#fff,#d8d0ff);box-shadow:0 8px 30px rgba(170,150,255,.5),0 0 0 1px rgba(255,255,255,.3);top:7px;bottom:7px}
      .bar.fg .tbw button{height:42px;border-radius:99px;transition:color .35s,transform .45s cubic-bezier(.34,1.56,.64,1)}.bar.fg .tbw button:active{transform:scale(.93)}.bar.fg .tbw button.on svg{animation:wig .7s cubic-bezier(.34,1.56,.64,1)}@keyframes wig{0%{transform:scale(.6) rotate(-30deg)}100%{transform:scale(1.08)}}
      .bar.fg.fg .sr{justify-self:end;width:46px;padding:0 14px;gap:0;cursor:text;overflow:hidden;background:linear-gradient(135deg,rgba(32,30,52,.8),rgba(14,14,24,.82));transition:width .65s cubic-bezier(.16,1,.3,1),gap .4s,border-color .35s,box-shadow .5s}.bar.fg.fg .sr input{flex:0 0 0;width:0;opacity:0;transition:opacity .4s .1s}
      .bar.fg.fg .sr:hover,.bar.fg.fg .sr:focus-within{width:min(300px,100%);gap:10px;border-color:rgba(190,170,255,.65);box-shadow:0 18px 50px rgba(0,0,0,.5),0 0 0 4px rgba(150,120,255,.14)}.bar.fg.fg .sr:hover input,.bar.fg.fg .sr:focus-within input{flex:1;width:auto;opacity:1}.bar.fg .sr svg{flex:none}
      .bar.fg:after{content:'';position:absolute;left:0;bottom:0;height:2px;width:calc(var(--sp,0)*100%);background:linear-gradient(90deg,#7a5cff,#ff5c9a,#2fd4ff);border-radius:2px;opacity:0;transition:width .12s linear,opacity .4s}.bar.fg.sc:after{opacity:.9}
      .ur .sb{display:none;flex-wrap:wrap;gap:8px;padding:10px 6px 4px 66px}.ur.open .sb{display:flex;animation:up .4s backwards}.ur .sb a{font:700 12px ${FONT};color:#fff;padding:7px 13px;border-radius:99px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.12);text-decoration:none;transition:all .25s}.ur .sb a:hover{background:#fff;color:#0b0b13;transform:translateY(-2px)}
      .pg{display:flex;flex-wrap:wrap;gap:7px;justify-content:center;margin-top:30px}.pg button{min-width:40px;height:40px;padding:0 13px;border-radius:13px;font:700 13.5px ${FONT};color:#a6a7b8;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);cursor:pointer;transition:all .3s cubic-bezier(.22,1,.36,1)}.pg button:hover{color:#fff;background:rgba(255,255,255,.12);transform:translateY(-3px)}.pg button.on{color:#0b0b13;background:#f4f4f8}.pg button:disabled{opacity:.35;pointer-events:none}.pg span{align-self:center;color:#6f7085}
      .er{padding:14px 18px;margin:0 0 16px;border-radius:16px;font:600 13.5px ${FONT};color:#ffd58a;background:rgba(245,165,36,.1);border:1px solid rgba(245,165,36,.3)}
      .fc{will-change:transform,opacity;animation:fin .95s calc(var(--i)*42ms) cubic-bezier(.16,1,.3,1) backwards}@keyframes fin{0%{opacity:0;transform:perspective(900px) translateY(38px) rotateX(10deg) scale(.94)}100%{opacity:1}}.fc.done{animation:none}
      .fc.rv{animation:none;opacity:0;transform:translateY(46px) scale(.95)}.fc.rv.in{opacity:1;transform:none;transition:opacity .9s cubic-bezier(.16,1,.3,1),transform 1s cubic-bezier(.16,1,.3,1)}
      .fc .im:after{content:'';position:absolute;top:-20%;bottom:-20%;left:-70%;width:45%;z-index:2;background:linear-gradient(100deg,transparent,rgba(255,255,255,.28),transparent);transform:skewX(-20deg);transition:left .9s cubic-bezier(.22,1,.36,1)}.fc:hover .im:after{left:130%}
      .fc:hover{box-shadow:0 34px 70px rgba(0,0,0,.6),0 0 46px hsla(var(--h),75%,55%,.28)}
      .fc .nm{transition:transform .5s cubic-bezier(.22,1,.36,1)}.fc:hover .nm{transform:translateY(-4px)}.fc .mi span{transition:transform .4s cubic-bezier(.34,1.5,.64,1),background .3s}.fc:hover .mi span{transform:translateY(-2px)}.fc:hover .mi span:nth-child(2){transition-delay:.05s}.fc:hover .mi span:nth-child(3){transition-delay:.1s}
      .fc .rk{transition:transform .5s cubic-bezier(.34,1.6,.64,1)}.fc:hover .rk{transform:scale(1.18) rotate(-6deg)}
      .hvt{display:inline-flex;align-items:center;gap:4px;font:800 9.5px ${FONT};letter-spacing:.08em;padding:5px 9px;border-radius:99px;color:#fff;background:linear-gradient(135deg,#ff4d4d,#b3121f);box-shadow:0 0 0 1px rgba(255,255,255,.25),0 8px 22px rgba(255,40,40,.45);animation:hvp 2s ease-in-out infinite}@keyframes hvp{0%,100%{box-shadow:0 0 0 1px rgba(255,255,255,.25),0 8px 22px rgba(255,40,40,.4)}50%{box-shadow:0 0 0 1px rgba(255,255,255,.35),0 8px 30px rgba(255,40,40,.85)}}.rw .hvt{margin-left:6px}
      .chips span.hvt,.hero .mi span.hvt{color:#fff;background:linear-gradient(135deg,#ff4d4d,#b3121f);border-color:rgba(255,255,255,.3)}
      .aq{position:relative;display:flex;align-items:center;gap:14px;height:68px;padding:0 24px;margin:2px 0 18px;border-radius:24px;color:#cfd0de;background:linear-gradient(135deg,rgba(32,32,50,.82),rgba(16,16,26,.8));border:1px solid rgba(255,255,255,.14);box-shadow:0 24px 60px rgba(0,0,0,.4);backdrop-filter:blur(14px);animation:up .7s cubic-bezier(.16,1,.3,1) backwards;transition:border-color .35s,box-shadow .5s}.aq:focus-within{border-color:rgba(190,170,255,.7);box-shadow:0 24px 70px rgba(0,0,0,.5),0 0 0 5px rgba(150,120,255,.16)}.aq svg{flex:none;opacity:.7}.aq input{flex:1;min-width:0;height:100%;background:none;border:0;outline:0;color:#fff;font:600 19px ${FONT}}.aq input::placeholder{color:#7d7e93}.aq kbd{font:700 12px ${FONT};color:#a99dff;white-space:nowrap}
      .ax{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 22px;animation:up .7s .1s cubic-bezier(.16,1,.3,1) backwards}.ax button{display:inline-flex;align-items:baseline;gap:6px;height:38px;padding:0 14px;border-radius:12px;font:800 14px ${FONT};color:#d6d7e2;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);cursor:pointer;transition:all .35s cubic-bezier(.34,1.56,.64,1)}.ax button small{font:600 10px ${FONT};color:#7d7e93}.ax button:hover{background:#fff;color:#0b0b13;transform:translateY(-4px) scale(1.06)}.ax button:hover small{color:#555}
      .ac2{margin-bottom:10px;border-radius:20px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07);animation:up .55s calc(var(--i)*35ms) cubic-bezier(.16,1,.3,1) backwards;transition:border-color .35s,background .35s}.ac2.open{background:rgba(255,255,255,.055);border-color:rgba(190,170,255,.35)}.ah{width:100%;display:flex;align-items:center;gap:16px;height:60px;padding:0 20px 0 14px;background:none;border:0;color:#fff;cursor:pointer}.al{display:grid;place-items:center;width:38px;height:38px;border-radius:12px;font:800 18px ${FONT};color:#0b0b13;background:linear-gradient(135deg,#fff,#c9c2ff);transition:transform .4s cubic-bezier(.34,1.56,.64,1)}.ah b{flex:1;text-align:left;font:700 14.5px ${FONT};color:#b4b5c6}.chv{transition:transform .55s cubic-bezier(.34,1.56,.64,1);color:#9a9bb0}.ac2.open .chv{transform:rotate(180deg)}.ah:hover .al{transform:rotate(-6deg) scale(1.08)}
      .ab{display:grid;grid-template-rows:0fr;transition:grid-template-rows .6s cubic-bezier(.16,1,.3,1)}.ac2.open .ab{grid-template-rows:1fr}.ab>div{overflow:hidden;min-height:0;display:flex;flex-direction:column;gap:8px;padding:0 14px}.ac2.open .ab>div{padding:4px 14px 16px}.ab .rw{content-visibility:auto;contain-intrinsic-size:auto 70px}.mr,.em{margin:18px 0;text-align:center;color:#8e8fa3;font:500 13.5px ${FONT}}
      .rw:before{content:'';position:absolute;left:0;top:14%;bottom:14%;width:3px;border-radius:3px;background:linear-gradient(#fff,hsl(var(--h,260) 80% 65%));transform:scaleY(0);transition:transform .45s cubic-bezier(.34,1.5,.64,1)}.rw:hover:before{transform:scaleY(1)}.rw .tl{transition:transform .5s cubic-bezier(.34,1.6,.64,1)}.rw:hover .tl{transform:scale(1.14) rotate(-8deg)}.rw i{transition:background .3s,color .3s}.rw:hover i{background:#fff;color:#0b0b13}
      .pg button{animation:up .5s calc(var(--k,0)*40ms) cubic-bezier(.22,1,.36,1) backwards}.pg button.on{box-shadow:0 0 0 4px rgba(255,255,255,.12),0 10px 26px rgba(255,255,255,.25);animation:nbp 2.8s ease-in-out infinite}
      .hd h2{animation:up .7s cubic-bezier(.22,1,.36,1) backwards}.ct:before{content:'';position:absolute;left:50%;top:-80px;width:520px;height:520px;margin-left:-260px;border-radius:50%;background:radial-gradient(circle,rgba(150,120,255,.14),transparent 65%);pointer-events:none;animation:orb 9s ease-in-out infinite alternate}@keyframes orb{to{transform:translate(120px,40px) scale(1.2)}}
      .fc{border-radius:26px}.fc .go{position:absolute;z-index:5;left:50%;top:50%;display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:99px;font:800 12.5px ${FONT};letter-spacing:.04em;color:#0b0b13;background:#fff;box-shadow:0 14px 34px rgba(0,0,0,.45);opacity:0;transform:translate(-50%,-30%) scale(.8);transition:opacity .45s,transform .6s cubic-bezier(.34,1.56,.64,1);pointer-events:none;white-space:nowrap}.fc:hover .go{opacity:1;transform:translate(-50%,-50%) scale(1)}.fc .im img{transition:transform 1.2s cubic-bezier(.16,1,.3,1),filter .6s}.fc:hover .im img{filter:brightness(.72) saturate(1.15)}
      .au{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}.au i{position:absolute;width:56vmax;height:56vmax;border-radius:50%;filter:blur(90px);opacity:.16;animation:aur 22s ease-in-out infinite alternate}.au i:nth-child(1){left:-18vmax;top:-22vmax;background:#7a5cff}.au i:nth-child(2){right:-20vmax;top:10vmax;background:#ff5c9a;animation-delay:-8s;animation-duration:28s}.au i:nth-child(3){left:20vmax;bottom:-34vmax;background:#2fd4ff;animation-delay:-14s;opacity:.1}@keyframes aur{to{transform:translate(9vmax,6vmax) scale(1.18)}}
      .bar{transition:background .5s,box-shadow .5s,backdrop-filter .5s}.bar.sc{box-shadow:0 14px 40px rgba(0,0,0,.45)}
      .hd h2{background:linear-gradient(100deg,#fff 20%,#b9a8ff 50%,#fff 80%);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:up .8s cubic-bezier(.16,1,.3,1) backwards,gl 7s linear infinite}@keyframes gl{to{background-position:-220% 0}}
      .hero{position:relative;display:flex;align-items:flex-end;gap:30px;min-height:310px;margin:4px 0 26px;padding:30px 34px;border-radius:32px;overflow:hidden;cursor:pointer;color:#fff;border:1px solid rgba(255,255,255,.12);box-shadow:0 30px 80px rgba(0,0,0,.5);animation:hin 1s cubic-bezier(.16,1,.3,1) backwards;transition:transform .6s cubic-bezier(.16,1,.3,1),box-shadow .6s}.hero:hover{transform:translateY(-4px);box-shadow:0 40px 100px rgba(0,0,0,.6)}@keyframes hin{from{opacity:0;transform:translateY(34px) scale(.97)}}
      .hero .bk{position:absolute;inset:-12%;background-size:cover;background-position:center;filter:blur(34px) saturate(1.5) brightness(.6);animation:kb 18s ease-in-out infinite alternate}@keyframes kb{to{transform:scale(1.14) translate(-2%,1%)}}.hero:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(7,6,15,.86),rgba(7,6,15,.25) 70%)}
      .hero .cvr{position:relative;z-index:2;flex:none;width:170px;aspect-ratio:3/4.2;border-radius:20px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.18);animation:up .9s .25s cubic-bezier(.16,1,.3,1) backwards;transition:transform .7s cubic-bezier(.16,1,.3,1)}.hero:hover .cvr{transform:rotate(-3deg) scale(1.05)}.hero .cvr img{width:100%;height:100%;object-fit:cover;display:block}
      .hero .tx{position:relative;z-index:2;display:grid;gap:14px;min-width:0}.hero .tx>*{animation:up .8s calc(var(--q)*100ms + .3s) cubic-bezier(.16,1,.3,1) backwards}.hero small{font:800 11px ${FONT};letter-spacing:.2em;color:#cdbfff}.hero h3{margin:0;font:800 clamp(24px,3.4vw,40px)/1.08 ${FONT};letter-spacing:-.02em;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.hero .mi{display:flex;flex-wrap:wrap;gap:8px}.hero .mi span{font:700 12px ${FONT};padding:6px 12px;border-radius:99px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.16);backdrop-filter:blur(8px)}
      .hero .cta{justify-self:start;display:inline-flex;align-items:center;gap:9px;height:46px;padding:0 24px;border-radius:99px;font:800 14px ${FONT};color:#0b0b13;background:#fff;box-shadow:0 14px 36px rgba(255,255,255,.2);transition:transform .5s cubic-bezier(.34,1.56,.64,1)}.hero:hover .cta{transform:translateX(6px) scale(1.04)}
      .tp{position:fixed;right:26px;bottom:26px;z-index:20;width:50px;height:50px;border-radius:50%;display:grid;place-items:center;color:#fff;background:rgba(30,30,46,.8);border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(12px);cursor:pointer;opacity:0;transform:translateY(20px) scale(.8);pointer-events:none;transition:opacity .4s,transform .6s cubic-bezier(.34,1.56,.64,1),background .3s}.tp.on{opacity:1;transform:none;pointer-events:auto}.tp:hover{background:#fff;color:#0b0b13;transform:translateY(-4px)}
      .sk{aspect-ratio:3/4.2;border-radius:22px;background:linear-gradient(110deg,rgba(255,255,255,.04) 30%,rgba(255,255,255,.1) 50%,rgba(255,255,255,.04) 70%);background-size:200% 100%;animation:swp 1.4s linear infinite}`;
    const sh = mount(css, '<div class="au"><i></i><i></i><i></i></div><div class="bar hb fg"><span></span><div class="tbw hubtb" id="tb"><span class="ac"></span>' + TABS.map((t, j) => '<button style="--j:' + j + '" data-k="' + t[0] + '">' + TI(t[0]) + '<span>' + t[1] + '</span></button>').join('') + '</div><label class="sr">' + SRCH + '<input id="q" placeholder="Buscar repack…" spellcheck="false" autocomplete="off"></label></div><div class="ct"><div class="hd"><div><h2 id="ti"></h2><p id="ts"></p></div></div><div id="er"></div><div id="hr"></div><div class="gr" id="gr"></div><div class="pg" id="pg"></div></div><button class="tp" id="tp" aria-label="Subir"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>');
    const $ = (s) => sh.querySelector(s), gr = $('#gr');
    const ST = {}; TABS.forEach((t) => { ST[t[0]] = { pages: {}, cur: 1, total: 0, busy: 0, err: '' }; }); ST.search = { pages: {}, cur: 1, total: 0, busy: 0, err: '', q: '' };
    let cur = 'new', tk = 0;
    const hashK = (/wt=(\w+)/.exec(location.hash) || [])[1];
    const dt = document.title; if (/popular|pop repacks/i.test(dt) && !document.querySelector('body.single')) cur = 'pop'; else if (/^all my repacks/i.test(dt)) cur = 'all'; else if (/^updates list/i.test(dt)) cur = 'upd'; else if (/^upcoming repacks/i.test(dt)) cur = 'up'; else if (/^\/popular-repacks/.test(P)) cur = 'pop'; else if (/^\/(upcoming-repacks|category\/upcoming)/.test(P)) cur = 'up'; else if (/^\/all-my-repacks/.test(P)) cur = 'all'; else if (/^\/updates-list/.test(P)) cur = 'upd'; else if (TABS.some((t) => t[0] === hashK)) cur = hashK;
    const pn = +((/\/page\/(\d+)/.exec(P) || [0, 1])[1]); if (cur === 'new' && pn > 1) ST.new.cur = pn;
    const moveAc = () => { const b = sh.querySelector('#tb button.on'), a = sh.querySelector('#tb .ac'); if (b && a) { a.style.left = b.offsetLeft + 'px'; a.style.width = b.offsetWidth + 'px'; } };
    window.addEventListener('resize', moveAc);
    const title = () => cur === 'search' ? 'Resultados para «' + ST.search.q + '»' : TABS.find((t) => t[0] === cur)[1];
    const draw = () => {
      const st = ST[cur], L = st.pages[st.cur] || []; $('#bg') && 0;
      setTitle($('#ti'), title()); const pages = st.total || (st.pages[st.cur] ? st.cur : 1);
      countTo($('#ts'), L.length, ' repacks' + (pages > 1 ? ' · página ' + st.cur + ' de ' + pages : ''));
      $('#er').innerHTML = st.err ? '<div class="er">' + esc(st.err) + '</div>' : '';
      if (!st.pages[st.cur]) { gr.className = 'gr cg'; gr.innerHTML = st.err ? '' : Array.from({ length: 12 }, () => '<div class="sk"></div>').join(''); $('#pg').innerHTML = ''; return; }
      gr.onclick = null;
      if (cur === 'all') {
        const hr0 = $('#hr'); hr0.innerHTML = ''; gr.className = 'gr az'; $('#pg').innerHTML = '';
        const by = {}; L.forEach((x) => { const c = (x.title.replace(/^[^A-Za-z0-9]+/, '')[0] || '#').toUpperCase(), k = /[A-Z]/.test(c) ? c : '#'; (by[k] = by[k] || []).push(x); });
        const keys = Object.keys(by).sort((a, b) => a === '#' ? -1 : b === '#' ? 1 : a < b ? -1 : 1); keys.forEach((k) => by[k].sort((a, b) => a.title.localeCompare(b.title, 'en', { numeric: true })));
        const rowH = (x, i) => '<a class="rw" style="--i:' + Math.min(i, 12) + '" data-h="' + esc(x.href) + '"><span class="tl" style="--h:' + hueOf(x.title) + '">' + esc((x.title.replace(/^[^A-Za-z0-9]+/, '')[0] || '#').toUpperCase()) + '</span><b>' + esc(x.title) + '</b>' + (x.hv ? '<span class="hvt">⚠ HV</span>' : '') + (x.ver ? '<i>' + esc(x.ver) + '</i>' : '') + '</a>';
        gr.innerHTML = '<div class="aq"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input id="aq" placeholder="Buscá entre ' + L.length + ' repacks…" spellcheck="false" autocomplete="off"><kbd id="ak"></kbd></div><div class="ax" id="ax">' + keys.map((k) => '<button data-l="' + k + '">' + k + '<small>' + by[k].length + '</small></button>').join('') + '</div><div id="ar"></div>';
        const ar = gr.querySelector('#ar'), aq = gr.querySelector('#aq'), ak = gr.querySelector('#ak');
        const fill = (sec) => { const b = sec.querySelector('.ab > div'); if (!b.dataset.f) { b.dataset.f = 1; b.innerHTML = by[sec.dataset.l].map(rowH).join(''); } };
        const acc = () => { ar.innerHTML = keys.map((k, i) => '<section class="ac2" data-l="' + k + '" style="--i:' + Math.min(i, 14) + '"><button class="ah"><span class="al">' + k + '</span><b>' + by[k].length + ' juegos</b><svg class="chv" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button><div class="ab"><div></div></div></section>').join(''); ar.querySelectorAll('.ac2 .ah').forEach((h) => h.addEventListener('click', () => { const sec = h.parentNode; fill(sec); sec.classList.toggle('open'); })); };
        const norm = (t) => t.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
        const idx = L.map((x) => ({ x, n: norm(x.title) }));
        let tmr = 0;
        const find = () => { const q = norm(aq.value); ak.textContent = ''; if (!q) { acc(); gr.querySelector('#ax').style.display = ''; return; } gr.querySelector('#ax').style.display = 'none'; const ws = q.split(' '), m = idx.filter((o) => ws.every((w) => o.n.indexOf(w) >= 0)).sort((a, b) => (a.n.indexOf(q) === 0 ? 0 : 1) - (b.n.indexOf(q) === 0 ? 0 : 1) || a.n.length - b.n.length); ak.textContent = m.length + ' resultados'; ar.innerHTML = m.length ? '<div class="lr">' + m.slice(0, 120).map((o, i) => rowH(o.x, i)).join('') + '</div>' + (m.length > 120 ? '<p class="mr">Mostrando 120 de ' + m.length + ': escribí más para afinar.</p>' : '') : '<div class="em">Nada con «' + esc(aq.value) + '». Probá con otra palabra.</div>'; };
        aq.addEventListener('input', () => { clearTimeout(tmr); tmr = setTimeout(find, 90); });
        gr.querySelector('#ax').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; const sec = ar.querySelector('.ac2[data-l="' + b.dataset.l + '"]'); if (!sec) return; fill(sec); sec.classList.add('open'); setTimeout(() => sec.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60); });
        gr.onclick = (e) => { const c = e.target.closest && e.target.closest('.rw[data-h]'); if (!c) return; e.preventDefault(); ripple(c, e); leave(sh, () => { location.href = c.dataset.h; }); };
        acc(); setTimeout(() => aq.focus(), 450);
        return;
      }
      const hr = $('#hr'), hx = cur === 'new' && st.cur === 1 && L.length > 3 && L[0].img ? L[0] : null;
      hr.innerHTML = hx ? '<a class="hero" data-h="' + esc(hx.href) + '"><span class="bk" style="background-image:url(' + esc(hx.img) + ')"></span><span class="cvr"><img src="' + esc(hx.img) + '" alt=""></span><span class="tx"><small style="--q:0">ÚLTIMO LANZAMIENTO</small><h3 style="--q:1">' + esc(hx.title) + '</h3><span class="mi" style="--q:2">' + (hx.rep ? '<span>💾 ' + esc(hx.rep) + '</span>' : '') + (hx.hv ? '<span class="hvt">⚠ HV · Hipervisor</span>' : '') + (hx.ver ? '<span>' + esc(hx.ver) + '</span>' : '') + (hx.lang ? '<span>🌐 ' + esc(hx.lang.slice(0, 30)) + '</span>' : '') + '</span><span class="cta" style="--q:3">Ver repack →</span></span></a>' : '';
      const hh = hr.querySelector('.hero'); if (hh) hh.addEventListener('click', (e) => { e.preventDefault(); leave(sh, () => { location.href = hh.dataset.h; }); });
      const LL = hx ? L.slice(1) : L;
      if (cur === 'upd') { gr.className = 'gr lr'; gr.innerHTML = L.map((x, i) => '<div class="ur" style="--i:' + Math.min(i, 20) + '"><a class="rw" data-t="1"><span class="tl" style="--h:' + hueOf(x.title) + '">' + esc((x.title.replace(/^[^A-Za-z0-9]+/, '')[0] || '#').toUpperCase()) + '</span><b>' + esc(x.title) + '</b><i>' + (x.ls.length ? x.ls.length + ' enlaces ＋' : 'sin enlaces') + '</i></a><div class="sb">' + x.ls.map((l) => '<a href="' + esc(l.h) + '">' + esc(l.t.slice(0, 40)) + '</a>').join('') + '</div></div>').join(''); }
      else if (cur === 'all' || cur === 'up') { gr.className = 'gr lr'; gr.innerHTML = L.map((x, i) => '<a class="rw" style="--i:' + Math.min(i, 20) + '" data-h="' + esc(x.href) + '"><span class="tl" style="--h:' + hueOf(x.title) + '">' + esc((x.title.replace(/^[^A-Za-z0-9]+/, '')[0] || '?').toUpperCase()) + '</span><b>' + esc(x.title) + '</b>' + (x.hv ? '<span class="hvt">⚠ HV</span>' : '') + (x.ver ? '<i>' + esc(x.ver) + '</i>' : '') + '</a>').join(''); }
      else {
        gr.className = 'gr cg';
        gr.innerHTML = LL.length ? LL.map((x, i) => '<a class="fc" style="--i:' + Math.min(i, 24) + ';--h:' + hueOf(x.title) + '" data-h="' + esc(x.href) + '"><span class="cx">' + (x.hv ? '<span class="hvt">⚠ HV</span>' : '') + (cur === 'new' && st.cur === 1 && i < 5 ? '<span class="nb">NUEVO</span>' : '') + '</span>' + (cur === 'pop' ? '<span class="rk r' + Math.min(i + 1, 4) + '">' + (i + 1) + '</span>' : '') + '<span class="im">' + (x.img ? '<img loading="lazy" src="' + esc(x.img) + '" alt="">' : '<b>' + esc(x.title.charAt(0)) + '</b>') + '</span><span class="go">Ver repack →</span><span class="nm"><b>' + esc(x.title) + '</b><span class="mi">' + (x.rep ? '<span>💾 ' + esc(x.rep) + '</span>' : '') + (x.ver ? '<span>' + esc(x.ver) + '</span>' : '') + (x.date ? '<span>' + esc(x.date) + '</span>' : '') + '</span></span></a>').join('') : '<div class="em">No encontré repacks</div>';
      }
      if (window.IntersectionObserver) { const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { const c = en.target; io.unobserve(c); setTimeout(() => { c.classList.add('in'); setTimeout(() => { c.classList.remove('rv', 'in'); c.classList.add('done'); }, 1100); }, 60); } }), { threshold: .08 }); gr.querySelectorAll('.fc').forEach((c) => { if (c.getBoundingClientRect().top > innerHeight - 40) { c.classList.add('rv'); io.observe(c); } else setTimeout(() => c.classList.add('done'), 1500); }); }
      gr.querySelectorAll('.fc,.rw').forEach((c) => {
        c.addEventListener('pointermove', (e) => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; c.style.setProperty('--ry', ((x - .5) * 12).toFixed(1) + 'deg'); c.style.setProperty('--rx', ((.5 - y) * 10).toFixed(1) + 'deg'); c.style.setProperty('--mx', (x * 100).toFixed(0) + '%'); c.style.setProperty('--my', (y * 100).toFixed(0) + '%'); });
        c.addEventListener('pointerleave', () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
        c.addEventListener('click', (e) => { e.preventDefault(); if (c.dataset.t) { c.parentNode.classList.toggle('open'); return; } ripple(c, e); leave(sh, () => { location.href = c.dataset.h; }); });
      });
      const pgs = []; for (let i = 1; i <= pages; i++) if (i === 1 || i === pages || Math.abs(i - st.cur) <= 2) pgs.push(i); const out = []; pgs.forEach((n, i) => { if (i && n - pgs[i - 1] > 1) out.push('<span>…</span>'); out.push('<button data-p="' + n + '" class="' + (n === st.cur ? 'on' : '') + '">' + n + '</button>'); });
      $('#pg').innerHTML = pages > 1 ? '<button data-p="' + (st.cur - 1) + '"' + (st.cur < 2 ? ' disabled' : '') + '>‹</button>' + out.join('') + '<button data-p="' + (st.cur + 1) + '"' + (st.cur >= pages ? ' disabled' : '') + '>›</button>' : '';
      $('#pg').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => goPage(+b.dataset.p))); fx(sh);
    };
    const PER = 60;
    const load = async (k, n) => {
      const st = ST[k]; if (st.pages[n] || st.busy) return; st.busy = 1; st.err = '';
      try {
        if (k === 'up' || k === 'all' || k === 'upd') {
          if (!st.full) {
            await navInit(); let items = [];
            if (k === 'up') {
              let a = null; if (HOME) a = [...HOME.querySelectorAll('article .entry-title a')].find((x) => /upcoming/i.test(T(x)));
              if (a) { const ar = a.closest('article'); items = readUp(ar, O + '/'); if (items.length < 3) { const d = await fetchDoc(abs(a.getAttribute('href'), O + '/')); if (d) items = readUp(d, O + '/'); } }
              if (items.length < 3) { const d = await fetchDoc(O + '/upcoming-repacks/'); if (d) items = readUp(d, O + '/'); }
            } else { const u = urlFor(k, 1, ''), doc = await fetchDoc(u); if (doc) items = k === 'upd' ? readUpd(doc, u) : readList(doc, u); if (k === 'upd' && !items.length && doc) items = readList(doc, u); }
            st.full = items;
          }
          const f = st.full; if (k === 'all') { st.total = 1; st.pages[1] = f; return; } st.total = Math.max(1, Math.ceil(f.length / PER)); const sl = f.slice((n - 1) * PER, n * PER);
          if (!sl.length) { st.err = f.length ? 'Esa página no existe' : 'No pude leer esta sección'; return; } st.pages[n] = sl; return;
        }
        const u = urlFor(k, n, st.q), doc = await fetchDoc(u);
        if (!doc) { st.total = Math.max(1, n - 1); st.err = 'Esa página no existe'; return; }
        let items = k === 'pop' ? readPopular(doc, u) : readArticles(doc, u);
        if (!items.length && k !== 'pop') items = readPopular(doc, u);
        if (!items.length) { st.total = Math.max(1, n - 1); st.err = n > 1 ? 'No hay más páginas' : 'No pude leer los repacks de esta página'; return; }
        const t = totalOf(doc); if (t > st.total) st.total = t; st.pages[n] = items;
      } catch (e) { st.err = 'No se pudo cargar: ' + String(e.message || e).slice(0, 100); } finally { st.busy = 0; }
    };
    const goPage = async (n) => {
      const st = ST[cur]; if (n < 1 || n === st.cur && st.pages[n]) return; const fw = n > st.cur, my = ++tk, k = cur;
      swapGrid(gr, fw, () => {}, null);
      await Promise.all([load(k, n), new Promise((r) => setTimeout(r, 330))]);
      if (my !== tk || k !== cur) return; if (st.pages[n]) st.cur = n; gr.classList.add('ent'); draw(); sh.querySelector('.w').scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => gr.classList.remove('ent'), 1300);
    };
    const setTab = async (k, anim) => {
      const old = TABS.findIndex((t) => t[0] === cur), nw = TABS.findIndex((t) => t[0] === k), fw = nw > old; cur = k; const my = ++tk;
      sh.querySelectorAll('#tb button').forEach((b) => b.classList.toggle('on', b.dataset.k === k)); moveAc();
      if (anim) { swapGrid(gr, fw, () => {}, null); await new Promise((r) => setTimeout(r, 330)); }
      draw(); await load(k, ST[k].cur); if (my !== tk) return; gr.classList.add('ent'); draw(); setTimeout(() => gr.classList.remove('ent'), 1300);
    };
    sh.querySelectorAll('#tb button').forEach((b) => b.addEventListener('click', () => { if (b.dataset.k !== cur) setTab(b.dataset.k, 1); }));
    $('#q').addEventListener('keydown', async (e) => { if (e.key !== 'Enter') return; const v = $('#q').value.trim(); if (!v) return; ST.search = { pages: {}, cur: 1, total: 0, busy: 0, err: '', q: v }; sh.querySelectorAll('#tb button').forEach((b) => b.classList.remove('on')); cur = 'search'; const my = ++tk; swapGrid(gr, true, () => {}, null); await new Promise((r) => setTimeout(r, 330)); draw(); await load('search', 1); if (my !== tk) return; gr.classList.add('ent'); draw(); setTimeout(() => gr.classList.remove('ent'), 1300); });
    { const w = sh.querySelector('.w'), tp = $('#tp'); if (w && tp) { w.addEventListener('scroll', () => tp.classList.toggle('on', w.scrollTop > 500), { passive: true }); tp.addEventListener('click', () => w.scrollTo({ top: 0, behavior: 'smooth' })); } }
    window.addEventListener('keydown', (e) => { if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && sh.activeElement !== $('#q') && cur !== 'search') { const st = ST[cur], pgs = st.total || 1, n = st.cur + (e.key === 'ArrowRight' ? 1 : -1); if (n >= 1 && n <= pgs) goPage(n); } });
    window.addEventListener('keydown', (e) => { if (e.key === '/' && sh.activeElement !== $('#q')) { e.preventDefault(); $('#q').focus(); } });
    { const w = sh.querySelector('.w'), bar = sh.querySelector('.bar'); if (w && bar) w.addEventListener('scroll', () => bar.classList.toggle('sc', w.scrollTop > 12), { passive: true }); }
    hoverPill(sh); const s0 = Q.get('s'); if (s0) { $('#q').value = s0; }
    setTab(cur, 0); setTimeout(moveAc, 60); setTimeout(moveAc, 700);
  };

  // ---------- página de un repack ----------
  const DL = [[/magnet:/i, 'Torrent (magnet)', 'tor'], [/\.torrent(\?|$)/i, 'Archivo .torrent', 'tor'], [/1337x|rutor|tapochek|nyaa|rarbg/i, 'Torrent (web)', 'tor'], [/fuckingfast/i, 'FuckingFast', 'ddl'], [/datanodes/i, 'DataNodes', 'ddl'], [/gofile/i, 'GoFile', 'ddl'], [/buzzheavier/i, 'BuzzHeavier', 'ddl'], [/pixeldrain/i, 'PixelDrain', 'ddl'], [/vikingfile/i, 'VikingFile', 'ddl'], [/multiup/i, 'MultiUp', 'ddl'], [/1fichier/i, '1fichier', 'ddl'], [/mega\.nz/i, 'MEGA', 'ddl'], [/mediafire/i, 'MediaFire', 'ddl'], [/filecrypt/i, 'FileCrypt', 'ddl'], [/filekeeper/i, 'FileKeeper', 'ddl']];
  const game = () => {
    const ar = document.querySelector('article'), en = ar && (ar.querySelector('.entry-content') || ar); if (!en) return false;
    const rawT = T(ar.querySelector('.entry-title, h1')) || document.title.replace(/\s*[–-]\s*FitGirl.*$/i, ''), t = tidy(rawT), tx = en.innerText.replace(/[ \t]+/g, ' ');
    const inf = infoOf(tx.replace(/\n+/g, '  ')); let cover = ''; const og = document.querySelector('meta[property="og:image"]'); const im0 = en.querySelector('img'); cover = im0 ? imgOf(en, location.href) : (og ? og.content : '');
    const mag = []; { const sm = new Set(); en.querySelectorAll('a[href]').forEach((a) => { const h = a.getAttribute('href') || ''; if (!/^magnet:/i.test(h) && !/\.torrent(\?|$)/i.test(h)) return; const hh = /^magnet:/i.test(h) ? h : abs(h); if (sm.has(hh)) return; sm.add(hh); mag.push({ h: hh, lb: /^magnet:/i.test(h) ? 'Magnet' : 'Archivo .torrent', ctx: (a.closest('li,p') ? T(a.closest('li,p')) : '').slice(0, 50) }); }); mag.sort((a, b) => (a.lb === 'Magnet' ? 0 : 1) - (b.lb === 'Magnet' ? 0 : 1)); }
    const grp = [];
    en.querySelectorAll('li').forEach((li) => { const a0 = li.querySelector('a[href]'); if (!a0) return; const t0 = T(li).slice(0, 80); const sp = li.querySelector('.su-spoiler'); if (!(sp || /filehoster|torrent|magnet|mirror/i.test(t0) || DL.some((d) => d[0].test(a0.getAttribute('href') || '')))) return; const parts = sp ? [...sp.querySelectorAll('a[href]')].map((a) => ({ t: T(a), h: abs(a.getAttribute('href')) })).filter((x) => x.h) : []; const name = T(a0).replace(/^Filehoster:\s*/i, '') || 'Descarga'; const h = /^magnet:/i.test(a0.getAttribute('href')) ? a0.getAttribute('href') : abs(a0.getAttribute('href')); if (!grp.some((g) => g.h === h)) grp.push({ name, h, parts, tor: /magnet:|\.torrent|torrent/i.test(a0.getAttribute('href') + t0) }); });
    for (let gi = grp.length - 1; gi >= 0; gi--) if (grp[gi].tor && /^magnet:|\.torrent/i.test(grp[gi].h)) grp.splice(gi, 1);
    const dls = [], seen = new Set();
    en.querySelectorAll('a[href]').forEach((a) => { const h = a.getAttribute('href') || ''; const d = DL.find((x) => x[0].test(h)); if (!d || seen.has(h)) return; seen.add(h); const li = a.closest('li, p'), ctx = li ? T(li).slice(0, 60) : ''; dls.push({ h: /^magnet:/i.test(h) ? h : abs(h), lb: d[1], kind: d[2], ctx, tx: T(a) }); });
    dls.sort((a, b) => (a.kind === 'tor' ? 0 : 1) - (b.kind === 'tor' ? 0 : 1) || DL.findIndex((x) => x[1] === a.lb) - DL.findIndex((x) => x[1] === b.lb));
    const hv = t.hv || /hypervisor|\(HV\)/i.test(tx); let hvn = ''; if (hv) { const ps = [...en.querySelectorAll('p,li,div')].map((e) => T(e)).filter((x) => /hypervisor|\bHV\b/i.test(x) && x.length > 25 && x.length < 420); hvn = ps.length ? ps.sort((a, b) => a.length - b.length)[0] : ''; }
    const prim = mag[0] ? { h: mag[0].h, lb: mag[0].lb } : grp[0] ? { h: grp[0].tor || !grp[0].parts.length ? grp[0].h : grp[0].parts[0].h, lb: grp[0].name } : dls[0];
    let feats = []; { const h = [...en.querySelectorAll('h3,h2,strong,b')].find((e) => /repack features/i.test(T(e))); if (h) { let n = h.closest('h3,h2,p') || h; for (let i = 0; i < 4 && n && !feats.length; i++) { n = n.nextElementSibling; if (n && n.matches('ul,ol')) feats = [...n.querySelectorAll('li')].map(T).filter(Boolean).slice(0, 10); } } }
    let desc = ''; { const sp = [...en.querySelectorAll('.su-spoiler-content, .spoiler')].find((e) => T(e).length > 120 && !/repack features/i.test(T(e).slice(0, 60))); if (sp) desc = T(sp).slice(0, 700); }
    const shots = [...en.querySelectorAll('img')].map((i) => abs(i.getAttribute('data-lazy-src') || i.getAttribute('data-src') || i.getAttribute('src') || '')).filter((u, i, a) => u && !/^data:/.test(u) && u !== cover && a.indexOf(u) === i).slice(0, 12);
    const cm = [...document.querySelectorAll('#comments .comment-body, .comment-list .comment-body')].slice(0, 30).map((c) => ({ a: T(c.querySelector('.fn, .comment-author')), t: T(c.querySelector('.comment-content, p')) })).filter((c) => c.t);
    const ico = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></svg>';
    const css = `.app{max-width:1320px;margin:0 auto;padding-bottom:70px}.main{display:grid;grid-template-columns:340px minmax(0,1fr);gap:30px;padding:8px 36px 0;align-items:start}@media (max-width:980px){.main{grid-template-columns:1fr}}
      .side{position:sticky;top:84px;display:flex;flex-direction:column;gap:16px;animation:up .8s .1s backwards}.cv{position:relative;border-radius:26px;overflow:hidden;border:1px solid rgba(255,255,255,.12);box-shadow:0 30px 70px rgba(0,0,0,.6);background:#12121c;min-height:260px}.cv img{display:block;width:100%;height:auto;transition:transform 1.2s cubic-bezier(.22,1,.36,1)}.cv:hover img{transform:scale(1.04)}.cv:after{content:'';position:absolute;top:0;bottom:0;left:-60%;width:40%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.14),transparent);transform:skewX(-18deg);animation:sh 5s 1.2s infinite}@keyframes sh{0%,60%{left:-60%}100%{left:140%}}
      h1.gt{margin:0;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;font:800 27px/1.15 ${FONT};letter-spacing:-.02em;color:#fff}.chips{display:flex;flex-wrap:wrap;gap:7px}.chips span{font:600 11.5px ${FONT};color:#c9cad6;padding:5px 11px;border-radius:99px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.08)}
      .big{display:flex;align-items:center;justify-content:center;gap:11px;height:56px;border-radius:18px;font:800 16px ${FONT};color:#0b0b13;background:linear-gradient(135deg,#fff,#d7d9e6);text-decoration:none;box-shadow:0 18px 44px rgba(255,255,255,.18);cursor:pointer;transition:transform .45s cubic-bezier(.34,1.5,.64,1),box-shadow .4s;position:relative;overflow:hidden}.big:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 24px 60px rgba(255,255,255,.3)}.big:active{transform:scale(.98)}.big svg{animation:dlb 1.6s ease-in-out infinite}@keyframes dlb{0%,100%{transform:translateY(-1px)}50%{transform:translateY(2px)}}
      .big.off{opacity:.45;pointer-events:none}.st{display:grid;grid-template-columns:1fr 1fr;gap:10px}.st div{padding:13px 14px;border-radius:16px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.07)}.st small{display:block;font:600 10.5px ${FONT};letter-spacing:.1em;text-transform:uppercase;color:#8e8fa3;margin-bottom:5px}.st b{font:800 17px ${FONT};color:#fff}
      .panel{border-radius:28px;background:linear-gradient(170deg,rgba(26,26,40,.74),rgba(12,12,20,.7));border:1px solid rgba(255,255,255,.09);box-shadow:0 24px 60px rgba(0,0,0,.45);animation:up .8s .2s backwards;overflow:hidden}
      .ptb{display:flex;gap:6px;padding:14px 16px 0;border-bottom:1px solid rgba(255,255,255,.07)}.ptb button{position:relative;height:44px;padding:0 20px;font:700 14px ${FONT};color:#8e8fa3;background:none;border:0;cursor:pointer;transition:color .3s}.ptb button:hover{color:#fff}.ptb button.on{color:#fff}.ptb button:after{content:'';position:absolute;left:14px;right:14px;bottom:-1px;height:3px;border-radius:3px;background:#fff;transform:scaleX(0);transition:transform .45s cubic-bezier(.34,1.5,.64,1)}.ptb button.on:after{transform:scaleX(1)}
      .pn{padding:24px 26px 28px;display:none}.pn.on{display:block;animation:up .5s backwards}.lab{font:800 12px ${FONT};letter-spacing:.14em;text-transform:uppercase;color:#9899ad;margin:0 0 14px}.pn p{margin:0 0 20px;font:500 14.5px/1.65 ${FONT};color:#cfd0de}.pn ul{margin:0 0 22px;padding:0;list-style:none;display:grid;gap:8px}.pn li{position:relative;padding-left:22px;font:500 14px/1.5 ${FONT};color:#cfd0de}.pn li:before{content:'';position:absolute;left:4px;top:9px;width:7px;height:7px;border-radius:50%;background:#fff;box-shadow:0 0 10px #fff}
      .gal{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:6px}.gal img{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:16px;border:1px solid rgba(255,255,255,.1);transition:transform .6s cubic-bezier(.22,1,.36,1)}.gal img:hover{transform:scale(1.03)}.gal img:first-child:nth-last-child(odd){grid-column:1/-1;aspect-ratio:21/9}
      .dl{display:flex;align-items:center;gap:14px;padding:14px 18px;margin-bottom:10px;border-radius:16px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:#fff;text-decoration:none;cursor:pointer;transition:transform .4s cubic-bezier(.22,1,.36,1),background .3s,border-color .3s}.dl:hover{transform:translateX(6px);background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.25)}.dl b{font:700 14.5px ${FONT}}.dl small{flex:1;font:500 12px ${FONT};color:#8e8fa3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dl i{font:800 10px ${FONT};font-style:normal;letter-spacing:.1em;padding:4px 9px;border-radius:99px;background:rgba(255,255,255,.1)}
      .pts{display:flex;flex-wrap:wrap;gap:7px;margin:-2px 0 16px 14px}.pts a{font:600 11.5px ${FONT};color:#d6d7e2;padding:6px 11px;border-radius:99px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.09);text-decoration:none;transition:all .25s}.pts a:hover{background:#fff;color:#0b0b13;transform:translateY(-2px)}
      .bgc{position:fixed;inset:-8%;z-index:0;background-size:cover;background-position:center;filter:blur(80px) saturate(1.4);opacity:0;transform:scale(1.15);animation:bgi 1.6s .1s cubic-bezier(.16,1,.3,1) forwards;pointer-events:none}@keyframes bgi{to{opacity:.28;transform:scale(1)}}
      .au{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}.au i{position:absolute;width:56vmax;height:56vmax;border-radius:50%;filter:blur(90px);opacity:.14;animation:aur 22s ease-in-out infinite alternate}.au i:nth-child(1){left:-18vmax;top:-22vmax;background:#7a5cff}.au i:nth-child(2){right:-20vmax;top:10vmax;background:#ff5c9a;animation-delay:-8s}.au i:nth-child(3){left:20vmax;bottom:-34vmax;background:#2fd4ff;animation-delay:-14s;opacity:.08}@keyframes aur{to{transform:translate(9vmax,6vmax) scale(1.18)}}
      .app{position:relative;z-index:1}      .bar.fg.fg{display:grid;grid-template-columns:1fr auto 1fr;padding-top:14px;transition:transform .8s cubic-bezier(.16,1,.3,1),padding .45s}.bar.fg.gone{transform:translateY(-135%)}
      .bar.fg .tbw{position:relative;overflow:visible;max-width:none;padding:7px;gap:2px;background:linear-gradient(135deg,rgba(32,30,52,.8),rgba(14,14,24,.82));border:0;box-shadow:0 24px 60px rgba(0,0,0,.55),0 0 40px rgba(130,100,255,.12),inset 0 1px 0 rgba(255,255,255,.1)}
      .bar.fg .tbw:before{content:'';position:absolute;inset:0;border-radius:99px;padding:1.5px;background:linear-gradient(100deg,rgba(255,255,255,.06),rgba(170,150,255,.85),rgba(255,110,170,.6),rgba(255,255,255,.06),rgba(47,212,255,.5),rgba(255,255,255,.06));background-size:320% 100%;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:bsl 7s linear infinite;pointer-events:none}@keyframes bsl{to{background-position:-320% 0}}
      .bar.fg .tbw .ac{background:linear-gradient(135deg,#fff,#d8d0ff);box-shadow:0 8px 30px rgba(170,150,255,.5),0 0 0 1px rgba(255,255,255,.3);top:7px;bottom:7px}
      .bar.fg .tbw button{height:42px;border-radius:99px;transition:color .35s,transform .45s cubic-bezier(.34,1.56,.64,1)}.bar.fg .tbw button:active{transform:scale(.93)}.bar.fg .tbw button.on svg{animation:wig .7s cubic-bezier(.34,1.56,.64,1)}@keyframes wig{0%{transform:scale(.6) rotate(-30deg)}100%{transform:scale(1.08)}}
      .bar.fg.fg .sr{justify-self:end;width:46px;padding:0 14px;gap:0;cursor:text;overflow:hidden;background:linear-gradient(135deg,rgba(32,30,52,.8),rgba(14,14,24,.82));transition:width .65s cubic-bezier(.16,1,.3,1),gap .4s,border-color .35s,box-shadow .5s}.bar.fg.fg .sr input{flex:0 0 0;width:0;opacity:0;transition:opacity .4s .1s}
      .bar.fg.fg .sr:hover,.bar.fg.fg .sr:focus-within{width:min(300px,100%);gap:10px;border-color:rgba(190,170,255,.65);box-shadow:0 18px 50px rgba(0,0,0,.5),0 0 0 4px rgba(150,120,255,.14)}.bar.fg.fg .sr:hover input,.bar.fg.fg .sr:focus-within input{flex:1;width:auto;opacity:1}.bar.fg .sr svg{flex:none}
      .bar.fg:after{content:'';position:absolute;left:0;bottom:0;height:2px;width:calc(var(--sp,0)*100%);background:linear-gradient(90deg,#7a5cff,#ff5c9a,#2fd4ff);border-radius:2px;opacity:0;transition:width .12s linear,opacity .4s}.bar.fg.sc:after{opacity:.9}
.main>*{animation:up .8s cubic-bezier(.22,1,.36,1) backwards}.side>*{animation:up .7s calc(var(--s,0)*90ms + .15s) cubic-bezier(.22,1,.36,1) backwards}.side>:nth-child(1){--s:0}.side>:nth-child(2){--s:1}.side>:nth-child(3){--s:2}.side>:nth-child(4){--s:3}.side>:nth-child(5){--s:4}
      .cv{transform:perspective(1000px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .5s}.cv:hover{box-shadow:0 40px 90px rgba(0,0,0,.7),0 0 60px rgba(150,120,255,.2)}
      .pn.on>*{animation:up .55s calc(var(--k,0)*55ms) cubic-bezier(.22,1,.36,1) backwards}.pn.on .dl,.pn.on .gp{animation:up .5s calc(var(--k,0)*60ms) cubic-bezier(.22,1,.36,1) backwards}.pn li{animation:up .5s calc(var(--k,0)*50ms) backwards}
      .big:before{content:'';position:absolute;top:0;bottom:0;left:-60%;width:40%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.7),transparent);transform:skewX(-20deg);animation:sh 3.6s 1s infinite}
      .chips span{animation:pop .5s calc(var(--k,0)*60ms + .3s) cubic-bezier(.34,1.5,.64,1) backwards}.st div{transition:transform .4s cubic-bezier(.34,1.5,.64,1),border-color .3s}.st div:hover{transform:translateY(-4px);border-color:rgba(255,255,255,.25)}
      .lb{position:fixed;inset:0;z-index:60;display:grid;place-items:center;background:rgba(5,4,12,.86);backdrop-filter:blur(14px);opacity:0;pointer-events:none;transition:opacity .45s}.lb.on{opacity:1;pointer-events:auto}.lb img{max-width:90vw;max-height:88vh;border-radius:20px;box-shadow:0 40px 120px rgba(0,0,0,.7);transform:scale(.88);transition:transform .6s cubic-bezier(.34,1.4,.64,1)}.lb.on img{transform:scale(1)}.gal img{cursor:zoom-in}
      .hva{margin:0 0 24px;padding:18px 20px;border-radius:20px;background:linear-gradient(135deg,rgba(255,60,60,.16),rgba(150,10,25,.12));border:1px solid rgba(255,90,90,.45);box-shadow:0 0 40px rgba(255,50,50,.15);animation:hvb 2.6s ease-in-out infinite}@keyframes hvb{50%{box-shadow:0 0 60px rgba(255,50,50,.32)}}.hvh{display:flex;align-items:center;gap:10px;margin-bottom:8px}.hvh span{display:grid;place-items:center;width:30px;height:30px;border-radius:10px;background:#e3202f;color:#fff;font-size:16px}.hvh b{font:800 15px ${FONT};color:#ffb3b8}.hva p{margin:0 0 8px!important;color:#ffd9dc!important;font-size:13.5px!important}.hva small{display:block;font:500 12.5px/1.5 ${FONT};color:#ff9aa2;padding-top:8px;border-top:1px solid rgba(255,90,90,.25)}
      .dl.tg{background:linear-gradient(135deg,rgba(150,120,255,.22),rgba(255,255,255,.06));border-color:rgba(190,170,255,.5);box-shadow:0 0 34px rgba(150,120,255,.18)}.dl.tg i{background:#fff;color:#0b0b13}
      .cmt{padding:14px 0;border-bottom:1px solid rgba(255,255,255,.07)}.cmt b{display:block;font:700 13px ${FONT};color:#fff;margin-bottom:5px}.cmt span{font:500 13.5px/1.55 ${FONT};color:#b9bacb}.em{padding:40px 0;text-align:center;color:#8e8fa3}`;
    const sh = mount(css, (cover ? '<div class="bgc" style="background-image:url(' + esc(cover) + ')"></div>' : '<div class="au"><i></i><i></i><i></i></div>') + '<div class="lb" id="lb"><img alt=""></div><div class="app"><div class="bar fg"><button class="back" id="bk">' + BACK + 'Volver</button><div class="tbw hubtb" id="nv">' + TABS.map((x, j) => '<button style="--j:' + j + '" data-k="' + x[0] + '">' + TI(x[0]) + '<span>' + x[1] + '</span></button>').join('') + '</div><span></span></div><div class="main"><div class="side"><div class="cv">' + (cover ? '<img src="' + esc(cover) + '" alt="">' : '') + '</div><h1 class="gt" id="gt"></h1><div class="chips">' + (t.ver ? '<span>' + esc(t.ver) + '</span>' : '') + (hv ? '<span class="hvt">⚠ HV</span>' : '') + (inf.lang ? '<span>🌐 ' + esc(inf.lang.slice(0, 40)) + '</span>' : '') + (inf.gen ? inf.gen.split(/,\s*/).slice(0, 3).map((g) => '<span>' + esc(g) + '</span>').join('') : '') + '</div>' +
      (prim ? '<a class="big" href="' + esc(prim.h) + '">' + ico + 'Descargar · ' + esc(prim.lb) + '</a>' : '<a class="big off">Sin enlaces de descarga</a>') + '<div class="st"><div><small>Repack</small><b>' + esc(inf.rep || '—') + '</b></div><div><small>Original</small><b>' + esc(inf.org || '—') + '</b></div></div></div>' +
      '<div class="panel"><div class="ptb"><button class="on" data-p="g">Juego</button><button data-p="d">Descargas' + ((mag.length + grp.length || dls.length) ? ' · ' + (mag.length + grp.length || dls.length) : '') + '</button>' + (cm.length ? '<button data-p="c">Comentarios · ' + cm.length + '</button>' : '') + '</div>' +
      '<div class="pn on" id="pg1">' + (hv ? '<div class="hva"><div class="hvh"><span>⚠</span><b>Repack con HV (hipervisor)</b></div><p>Este juego usa un método que depende del hipervisor de Windows. Normalmente hay que tener la virtualización activada y seguir los pasos que indica el repack; si no arranca, revisá las notas del repack y la sección de problemas del sitio.</p>' + (hvn ? '<small>Nota del repack: ' + esc(hvn) + '</small>' : '') + '</div>' : '') + (desc ? '<div class="lab">Sobre el juego</div><p>' + esc(desc) + '</p>' : '') + (feats.length ? '<div class="lab">Características del repack</div><ul>' + feats.map((f) => '<li>' + esc(f) + '</li>').join('') + '</ul>' : '') + (inf.co ? '<div class="lab">Compañía</div><p>' + esc(inf.co) + '</p>' : '') + (shots.length ? '<div class="lab" id="shl">Capturas</div><div class="gal" id="gal">' + shots.map((s) => '<img loading="lazy" src="' + esc(s) + '" alt="">').join('') + '</div>' : '') + '</div>' +
      '<div class="pn" id="pg2">' + (mag.length ? '<div class="lab">Torrent · recomendado</div>' + mag.map((m) => '<a class="dl tg" href="' + esc(m.h) + '"><b>' + m.lb + '</b><small>' + esc(m.ctx) + '</small><i>MAGNET</i></a>').join('') : '') + (mag.length && grp.length ? '<div class="lab" style="margin-top:26px">Descarga directa · alternativa</div>' : '') + (grp.length ? grp.map((g) => '<div class="gp"><a class="dl" href="' + esc(g.h) + '"><b>' + esc(g.name) + '</b><small>' + (g.parts.length ? g.parts.length + ' archivos' : '') + '</small><i>' + (g.tor ? 'TORRENT' : 'SITIO') + '</i></a>' + (g.parts.length ? '<div class="pts">' + g.parts.map((x, i) => '<a href="' + esc(x.h) + '">' + esc((x.t.replace(/^.*#/, '').slice(0, 34)) || 'Parte ' + (i + 1)) + '</a>').join('') + '</div>' : '') + '</div>').join('') : dls.length ? dls.map((d) => '<a class="dl" href="' + esc(d.h) + '"><b>' + esc(d.lb) + '</b><small>' + esc(d.tx && d.tx.length < 40 ? d.tx : d.ctx) + '</small><i>' + (d.kind === 'tor' ? 'TORRENT' : 'DIRECTO') + '</i></a>').join('') : '<div class="em">No encontré enlaces de descarga en esta página</div>') + '</div>' +
      '<div class="pn" id="pg3">' + cm.map((c) => '<div class="cmt"><b>' + esc(c.a || 'Anónimo') + '</b><span>' + esc(c.t) + '</span></div>').join('') + '</div></div></div></div>');
    const $ = (s) => sh.querySelector(s); setTitle($('#gt'), t.name);
    $('#bk').addEventListener('click', () => leave(sh, () => { if (history.length > 1) history.back(); else location.href = O + '/'; }));
    sh.querySelectorAll('#nv button').forEach((b) => b.addEventListener('click', () => leave(sh, () => { location.href = O + '/#wt=' + b.dataset.k; })));
    sh.querySelectorAll('.ptb button').forEach((b) => b.addEventListener('click', () => { sh.querySelectorAll('.ptb button').forEach((x) => x.classList.toggle('on', x === b)); sh.querySelectorAll('.pn').forEach((p) => p.classList.remove('on')); const p = $('#pg' + ({ g: 1, d: 2, c: 3 }[b.dataset.p])); void p.offsetWidth; p.classList.add('on'); fx(sh); }));
    { const lb = $('#lb'); lb.addEventListener('click', () => lb.classList.remove('on')); window.addEventListener('keydown', (e) => { if (e.key === 'Escape') lb.classList.remove('on'); }); const gg = $('#gal'); if (gg) gg.addEventListener('click', (e) => { const im = e.target.closest('img'); if (im) { lb.querySelector('img').src = im.src; lb.classList.add('on'); } }); }
    const g = $('#gal'); if (g) { const chk = () => { if (!g.querySelector('img')) { g.remove(); const l = $('#shl'); if (l) l.remove(); } }; g.querySelectorAll('img').forEach((im) => { const bad = () => { im.remove(); chk(); }; im.addEventListener('error', bad); im.addEventListener('load', () => { if (im.naturalWidth < 240) bad(); }); }); }
    hoverPill(sh); fx(sh); return true;
  };
  const TT = document.title, BODY = document.body.classList;
  const SECT = /^(pop repacks|popular repacks|all my repacks|updates list|upcoming repacks|most popular|top \d+)/i.test(TT) || /^\/(popular-repacks|all-my-repacks|updates-list|upcoming-repacks)/.test(P);
  const SINGLE = !SECT && (BODY.contains('single') || BODY.contains('single-post')) && !!document.querySelector('article');
  const LISTING = !SINGLE && (SECT || P === '/' || /^\/(page\/\d+|category\/)/.test(P) || !!Q.get('s'));
  const run = () => { try { if (SINGLE) game(); else if (LISTING) home(); } catch (e) { try { const x = document.getElementById('wt-console'); if (x) x.remove(); document.documentElement.classList.remove('wt-console-on'); } catch (_) {} } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
}

const skinFor = (url) => { try { const h = new URL(url).hostname; return SKINS.find((s) => s.test.test(h)) || null; } catch (e) { return null; } };
module.exports = { SKINS, MONO_JS, skinFor, CONSOLE_JS: { steamrip: '(' + steamripConsole.toString() + ')()', fitgirl: '(' + fitgirlConsole.toString() + ')()' } };
