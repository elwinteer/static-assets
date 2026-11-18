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
  { name: 'vimm', test: /(^|\.)vimm\.net$/i, css: `
    html,body{background:#07060f!important;color:#d6d7e2!important}
    a{color:#fff}
    table,td,th,tr{background-color:transparent!important;border-color:rgba(255,255,255,.1)!important;color:#d6d7e2!important}
    input,select,textarea{background:rgba(255,255,255,.06)!important;color:#fff!important;border:1px solid rgba(255,255,255,.14)!important;border-radius:10px!important}
    button,input[type=submit]{border-radius:10px!important}
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
    const goPage = async (k, n) => {
      const st = ST[k]; if (st.busy || n < 1) return;
      if (st.pages[n]) { showPage(k, n); return; }
      st.busy = 1; st.err = ''; if (k === cur && st.items) draw();
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
// Vimm's Lair: portada de consolas por pestañas, lista de juegos paginada y barra flotante en la página de cada juego.
function vimmConsole() {
  if (window.__wtV) return; window.__wtV = 1;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const T = (n) => (n && n.textContent || '').replace(/\s+/g, ' ').trim();
  const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const P = location.pathname.replace(/\/+$/, '') || '/', Q = new URLSearchParams(location.search), O = location.origin;
  const HUB = O + '/?p=vault';
  const BR = { nintendo: ['Nintendo', '#ef4b55'], sega: ['Sega', '#4c8dff'], sony: ['PlayStation', '#7a7cff'], xbox: ['Xbox', '#3ddc97'], atari: ['Atari y más', '#f5a524'] };
  // [alias, corto, nombre, año, marca, tipo, portátil]
  const META = [
    [['nes', 'famicom'], 'NES', 'Nintendo Entertainment System', 1985, 'nintendo', 'cart'], [['snes', 'supernintendo'], 'SNES', 'Super Nintendo', 1990, 'nintendo', 'cart'],
    [['n64', 'nintendo64'], 'N64', 'Nintendo 64', 1996, 'nintendo', 'cart'], [['gamecube', 'gc', 'gcn'], 'GameCube', 'Nintendo GameCube', 2001, 'nintendo', 'disc'],
    [['wii'], 'Wii', 'Nintendo Wii', 2006, 'nintendo', 'disc'], [['wiiware'], 'WiiWare', 'Wii · juegos descargables', 2008, 'nintendo', 'disc'],
    [['vb', 'virtualboy'], 'Virtual Boy', 'Nintendo Virtual Boy', 1995, 'nintendo', 'wide', 1], [['gb', 'gameboy'], 'Game Boy', 'Nintendo Game Boy', 1989, 'nintendo', 'hand', 1],
    [['gbc', 'gameboycolor'], 'GBC', 'Game Boy Color', 1998, 'nintendo', 'hand', 1], [['gba', 'gameboyadvance'], 'GBA', 'Game Boy Advance', 2001, 'nintendo', 'wide', 1],
    [['ds', 'nds', 'nintendods'], 'DS', 'Nintendo DS', 2004, 'nintendo', 'wide', 1], [['3ds', 'nintendo3ds'], '3DS', 'Nintendo 3DS', 2011, 'nintendo', 'wide', 1],
    [['sms', 'mastersystem'], 'Master System', 'Sega Master System', 1985, 'sega', 'cart'], [['genesis', 'megadrive'], 'Genesis', 'Sega Genesis / Mega Drive', 1988, 'sega', 'cart'],
    [['segacd', 'megacd'], 'Sega CD', 'Sega CD / Mega-CD', 1992, 'sega', 'disc'], [['32x', 'sega32x'], '32X', 'Sega 32X', 1994, 'sega', 'cart'],
    [['saturn', 'segasaturn'], 'Saturn', 'Sega Saturn', 1994, 'sega', 'disc'], [['dreamcast', 'dc'], 'Dreamcast', 'Sega Dreamcast', 1998, 'sega', 'disc'],
    [['gg', 'gamegear'], 'Game Gear', 'Sega Game Gear', 1990, 'sega', 'wide', 1],
    [['ps1', 'psx', 'playstation', 'psone'], 'PS1', 'PlayStation', 1994, 'sony', 'disc'], [['ps2', 'playstation2'], 'PS2', 'PlayStation 2', 2000, 'sony', 'disc'],
    [['ps3', 'playstation3'], 'PS3', 'PlayStation 3', 2006, 'sony', 'disc'], [['psp', 'playstationportable'], 'PSP', 'PlayStation Portable', 2004, 'sony', 'wide', 1],
    [['xbox'], 'Xbox', 'Microsoft Xbox', 2001, 'xbox', 'disc'], [['xbox360', 'x360', 'x360d', 'xbox360d'], 'Xbox 360', 'Microsoft Xbox 360', 2005, 'xbox', 'disc'],
    [['atari2600', '2600'], 'Atari 2600', 'Atari 2600', 1977, 'atari', 'stick'], [['atari5200', '5200'], 'Atari 5200', 'Atari 5200', 1982, 'atari', 'stick'],
    [['atari7800', '7800'], 'Atari 7800', 'Atari 7800', 1986, 'atari', 'stick'], [['jaguar', 'atarijaguar'], 'Jaguar', 'Atari Jaguar', 1993, 'atari', 'pad'],
    [['lynx', 'atarilynx'], 'Lynx', 'Atari Lynx', 1989, 'atari', 'wide', 1], [['tg16', 'turbografx16', 'pcengine'], 'TG-16', 'TurboGrafx-16', 1987, 'atari', 'cart'],
    [['tgcd', 'turbografxcd', 'pcenginecd'], 'TG-CD', 'TurboGrafx-CD', 1990, 'atari', 'disc'], [['cdi', 'philipscdi'], 'CD-i', 'Philips CD-i', 1991, 'atari', 'disc'],
  ];
  const FALL = ['NES', 'SNES', 'N64', 'GameCube', 'Wii', 'WiiWare', 'VB', 'GB', 'GBC', 'GBA', 'DS', 'SMS', 'Genesis', 'SegaCD', '32X', 'Saturn', 'Dreamcast', 'PS1', 'PS2', 'PS3', 'PSP', 'Xbox', 'X360', 'Atari2600', 'Atari5200', 'Atari7800', 'Jaguar', 'Lynx', 'TG16', 'TGCD', 'CDi'];
  const metaOf = (code, text) => {
    const a = norm(code), b = norm(text), m = META.find((r) => r[0].includes(a)) || META.find((r) => r[0].includes(b)) || META.find((r) => norm(r[2]) === b || norm(r[1]) === b);
    if (m) return { code, short: m[1], name: m[2], year: m[3], brand: m[4], type: m[5], port: !!m[6], ico: m[0][0] };
    return { code, short: (text && text.length <= 14 ? text : code).slice(0, 14), name: text || code, year: 0, brand: 'atari', type: 'pad', port: false };
  };
  const SV = {
    cart: '<path d="M18 7h28a3 3 0 0 1 3 3v36l-5 9H20l-5-9V10a3 3 0 0 1 3-3z"/><path d="M22 13h20v15H22z"/><path d="M25 55v-5h14v5"/><path d="M26 36h12M26 41h8"/>',
    disc: '<circle cx="32" cy="32" r="24"/><circle cx="32" cy="32" r="7"/><circle cx="32" cy="32" r="2.4" fill="currentColor" stroke="none"/><path d="M14 24a19 19 0 0 1 11-9"/><path d="M50 40a19 19 0 0 1-11 9" opacity=".5"/>',
    pad: '<path d="M18 21h28a11 11 0 0 1 11 12l-2 12a6.5 6.5 0 0 1-11 2.5L38 43H26l-6 4.5A6.5 6.5 0 0 1 9 45L7 33a11 11 0 0 1 11-12z"/><path d="M20 28v10M15 33h10"/><circle cx="42" cy="30" r="2.2"/><circle cx="47.5" cy="35" r="2.2"/>',
    hand: '<rect x="17" y="5" width="30" height="54" rx="6"/><rect x="22" y="10" width="20" height="18" rx="2"/><path d="M26 40v9M21.5 44.5h9"/><circle cx="40" cy="42" r="2.3"/><circle cx="45" cy="47" r="2.3" opacity=".6"/>',
    wide: '<rect x="4" y="16" width="56" height="32" rx="9"/><rect x="20" y="20" width="24" height="24" rx="2"/><path d="M11 29v9M6.5 33.5h9"/><circle cx="50" cy="31" r="2.3"/><circle cx="54" cy="37" r="2.3" opacity=".6"/>',
    stick: '<path d="M32 8v24"/><circle cx="32" cy="9" r="5.5"/><path d="M12 54l5-18h30l5 18z"/><circle cx="43" cy="45" r="2.2"/>',
  };
  const ICONS = {
    "nes": "<path class=\"f\" d=\"M4 17h56a2 2 0 0 1 2 2v26a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V19a2 2 0 0 1 2-2z\"/><path d=\"M4 17h56a2 2 0 0 1 2 2v26a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V19a2 2 0 0 1 2-2z\"/><rect x=\"6.5\" y=\"23\" width=\"51\" height=\"20\" rx=\"2\" fill=\"currentColor\" fill-opacity=\".3\" stroke=\"none\"/><path d=\"M15 27.5v11.0M9.5 33h11.0\" stroke-width=\"3.8\"/><rect x=\"26\" y=\"36\" width=\"8\" height=\"3.2\" rx=\"1.6\" fill=\"currentColor\" fill-opacity=\".8\" stroke=\"none\"/><rect x=\"36.500\" y=\"36\" width=\"8\" height=\"3.2\" rx=\"1.6\" fill=\"currentColor\" fill-opacity=\".8\" stroke=\"none\"/><circle cx=\"47\" cy=\"33\" r=\"3.8\" fill=\"#ef5a6b\" stroke=\"none\"/><circle cx=\"55\" cy=\"33\" r=\"3.8\" fill=\"#ef5a6b\" stroke=\"none\"/><path d=\"M26 20h6M36 20h8\" opacity=\".6\"/>",
    "snes": "<path class=\"f\" d=\"M15 19h34a12 12 0 0 1 12 13 12 12 0 0 1-12 13H15A12 12 0 0 1 3 32a12 12 0 0 1 12-13z\"/><path d=\"M15 19h34a12 12 0 0 1 12 13 12 12 0 0 1-12 13H15A12 12 0 0 1 3 32a12 12 0 0 1 12-13z\"/><path d=\"M11 19v-3.500h11V19M42 19v-3.500h11V19\"/><rect x=\"23\" y=\"24.500\" width=\"18\" height=\"15\" rx=\"7.500\" fill=\"currentColor\" fill-opacity=\".14\"/><path d=\"M15.5 26.2v11.6M9.7 32h11.6\" stroke-width=\"3.6\"/><circle cx=\"48\" cy=\"25.5\" r=\"2.8\" fill=\"#5b8def\" stroke=\"none\"/><circle cx=\"42\" cy=\"32\" r=\"2.8\" fill=\"#42c28f\" stroke=\"none\"/><circle cx=\"54\" cy=\"32\" r=\"2.8\" fill=\"#ef5a6b\" stroke=\"none\"/><circle cx=\"48\" cy=\"38.5\" r=\"2.8\" fill=\"#f6c445\" stroke=\"none\"/><path d=\"M26.500 37l4-2.400M32.500 37l4-2.400\" stroke-width=\"2.400\"/>",
    "n64": "<path class=\"f\" d=\"M5 21Q5 12 14 12H50Q59 12 59 21V46A8 8 0 0 1 43 46V40H38V52A6 6 0 0 1 26 52V40H21V46A8 8 0 0 1 5 46Z\"/><path d=\"M5 21Q5 12 14 12H50Q59 12 59 21V46A8 8 0 0 1 43 46V40H38V52A6 6 0 0 1 26 52V40H21V46A8 8 0 0 1 5 46Z\"/><circle cx=\"32\" cy=\"25\" r=\"6\" fill=\"currentColor\" fill-opacity=\".18\"/><circle cx=\"32\" cy=\"25\" r=\"2.500\" class=\"a\"/><path d=\"M14 21.5v9.0M9.5 26h9.0\" stroke-width=\"3\"/><circle cx=\"48\" cy=\"20.5\" r=\"2\" fill=\"#f6c445\" stroke=\"none\"/><circle cx=\"48\" cy=\"28.5\" r=\"2\" fill=\"#f6c445\" stroke=\"none\"/><circle cx=\"44\" cy=\"24.5\" r=\"2\" fill=\"#f6c445\" stroke=\"none\"/><circle cx=\"52\" cy=\"24.5\" r=\"2\" fill=\"#f6c445\" stroke=\"none\"/><circle cx=\"45\" cy=\"34\" r=\"2.6\" fill=\"#5b8def\" stroke=\"none\"/><circle cx=\"52\" cy=\"33\" r=\"2.3\" fill=\"#42c28f\" stroke=\"none\"/><circle cx=\"32\" cy=\"35.5\" r=\"1.8\" fill=\"#ef5a6b\" stroke=\"none\"/><path d=\"M29 47h6\" opacity=\".6\"/>",
    "gamecube": "<path d=\"M24 22v-6a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6\"/><rect class=\"f\" x=\"8\" y=\"22\" width=\"48\" height=\"34\" rx=\"7\"/><rect x=\"8\" y=\"22\" width=\"48\" height=\"34\" rx=\"7\"/><circle cx=\"32\" cy=\"40\" r=\"11\"/><circle cx=\"32\" cy=\"40\" r=\"3.500\" class=\"a\"/><path d=\"M22 34a12 12 0 0 1 8-5\" opacity=\".6\"/><rect x=\"14\" y=\"27\" width=\"8\" height=\"3\" rx=\"1.500\"/><circle cx=\"48\" cy=\"29\" r=\"1.800\" class=\"a\"/>",
    "wii": "<rect class=\"f\" x=\"21\" y=\"4\" width=\"22\" height=\"56\" rx=\"7\"/><rect x=\"21\" y=\"4\" width=\"22\" height=\"56\" rx=\"7\"/><path d=\"M26 17h12\"/><path d=\"M26 22h12\" opacity=\".5\"/><circle cx=\"32\" cy=\"48\" r=\"4\"/><circle cx=\"32\" cy=\"48\" r=\"1.400\" class=\"a\"/><path d=\"M27 55h10\" opacity=\".5\"/>",
    "wiiware": "<rect class=\"f\" x=\"22\" y=\"3\" width=\"20\" height=\"58\" rx=\"9\"/><rect x=\"22\" y=\"3\" width=\"20\" height=\"58\" rx=\"9\"/><path d=\"M32 9v10M27 14h10\" stroke-width=\"3\"/><circle cx=\"32\" cy=\"27\" r=\"3.600\" class=\"a\"/><circle cx=\"32\" cy=\"36\" r=\"1.800\"/><circle cx=\"28\" cy=\"41\" r=\"1.800\"/><circle cx=\"36\" cy=\"41\" r=\"1.800\"/><path d=\"M26 49h12\"/><path d=\"M26 54h12\" opacity=\".5\"/>",
    "vb": "<path class=\"f\" d=\"M6 12h52v20a8 8 0 0 1-8 8H14a8 8 0 0 1-8-8z\"/><path d=\"M6 12h52v20a8 8 0 0 1-8 8H14a8 8 0 0 1-8-8z\"/><path d=\"M22 40v-3a10 10 0 0 1 20 0v3\"/><circle cx=\"25\" cy=\"25\" r=\"4.500\" class=\"a\"/><circle cx=\"39\" cy=\"25\" r=\"4.500\" class=\"a\"/><path d=\"M20 40l-9 18M44 40l9 18M32 40v18\"/>",
    "gb": "<path class=\"f\" d=\"M16 5h32a3 3 0 0 1 3 3v41l-9 9H16a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z\"/><path d=\"M16 5h32a3 3 0 0 1 3 3v41l-9 9H16a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z\"/><rect x=\"18\" y=\"10\" width=\"28\" height=\"22\" rx=\"2.500\"/><rect x=\"23\" y=\"14\" width=\"18\" height=\"14\" rx=\"1\" class=\"f\"/><path d=\"M24 41v10M19 46h10\" stroke-width=\"3.2\"/><circle class=\"a\" cx=\"42\" cy=\"46\" r=\"3\"/><circle class=\"a\" cx=\"36\" cy=\"49.500\" r=\"3\"/><path d=\"M40 55l5-5M44 55l5-5\" opacity=\".6\"/>",
    "gbc": "<path class=\"f\" d=\"M16 5h32a3 3 0 0 1 3 3v41l-9 9H16a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z\"/><path d=\"M16 5h32a3 3 0 0 1 3 3v41l-9 9H16a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z\"/><rect x=\"18\" y=\"10\" width=\"28\" height=\"22\" rx=\"2.500\"/><rect x=\"23\" y=\"14\" width=\"18\" height=\"14\" rx=\"1\" class=\"f\"/><circle cx=\"22\" cy=\"36\" r=\"1.100\" class=\"a\"/><circle cx=\"26\" cy=\"36\" r=\"1.100\"/><circle cx=\"30\" cy=\"36\" r=\"1.100\"/><path d=\"M24 44v9M19.500 48.500h9\" stroke-width=\"3.2\"/><circle class=\"a\" cx=\"42\" cy=\"47\" r=\"3\"/><circle class=\"a\" cx=\"36\" cy=\"51\" r=\"3\"/>",
    "gba": "<path class=\"f\" d=\"M12 16h40a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H12a8 8 0 0 1-8-8V24a8 8 0 0 1 8-8z\"/><path d=\"M12 16h40a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H12a8 8 0 0 1-8-8V24a8 8 0 0 1 8-8z\"/><path d=\"M9 16v-4h9v4M46 16v-4h9v4\"/><rect x=\"21\" y=\"20\" width=\"22\" height=\"24\" rx=\"2\"/><rect x=\"24.500\" y=\"23.500\" width=\"15\" height=\"15\" rx=\"1\" class=\"f\"/><path d=\"M12 29v10M7 34h10\" stroke-width=\"3.200\"/><circle class=\"a\" cx=\"53\" cy=\"31\" r=\"2.800\"/><circle class=\"a\" cx=\"49\" cy=\"37.500\" r=\"2.800\"/>",
    "ds": "<rect class=\"f\" x=\"9\" y=\"3\" width=\"46\" height=\"26\" rx=\"4\"/><rect x=\"9\" y=\"3\" width=\"46\" height=\"26\" rx=\"4\"/><rect x=\"14\" y=\"7.500\" width=\"36\" height=\"17\" rx=\"1.500\"/><rect class=\"f\" x=\"9\" y=\"35\" width=\"46\" height=\"26\" rx=\"4\"/><rect x=\"9\" y=\"35\" width=\"46\" height=\"26\" rx=\"4\"/><rect x=\"22\" y=\"39.500\" width=\"20\" height=\"17\" rx=\"1.500\"/><path d=\"M16 44v8M12 48h8\" stroke-width=\"2.800\"/><circle class=\"a\" cx=\"48\" cy=\"45\" r=\"2.100\"/><circle class=\"a\" cx=\"45\" cy=\"50\" r=\"2.100\"/><path d=\"M9 32h46\" opacity=\".5\"/>",
    "3ds": "<rect class=\"f\" x=\"9\" y=\"3\" width=\"46\" height=\"26\" rx=\"4\"/><rect x=\"9\" y=\"3\" width=\"46\" height=\"26\" rx=\"4\"/><rect x=\"14\" y=\"7\" width=\"36\" height=\"18\" rx=\"1.500\"/><path d=\"M52 8v8\" stroke-width=\"2.600\" class=\"a\"/><rect class=\"f\" x=\"9\" y=\"35\" width=\"46\" height=\"26\" rx=\"4\"/><rect x=\"9\" y=\"35\" width=\"46\" height=\"26\" rx=\"4\"/><rect x=\"23\" y=\"39.500\" width=\"18\" height=\"14\" rx=\"1.500\"/><circle cx=\"16\" cy=\"47\" r=\"3.500\"/><circle class=\"a\" cx=\"48\" cy=\"44\" r=\"2\"/><circle class=\"a\" cx=\"45\" cy=\"49\" r=\"2\"/><path d=\"M9 32h46\" opacity=\".5\"/>",
    "sms": "<rect class=\"f\" x=\"4\" y=\"26\" width=\"56\" height=\"26\" rx=\"3\"/><rect x=\"4\" y=\"26\" width=\"56\" height=\"26\" rx=\"3\"/><path d=\"M14 26v-7a2 2 0 0 1 2-2h32a2 2 0 0 1 2 2v7\"/><rect x=\"18\" y=\"21\" width=\"28\" height=\"5\" class=\"f\"/><path d=\"M10 40h22\"/><circle cx=\"46\" cy=\"38\" r=\"2.200\" class=\"a\"/><rect x=\"40\" y=\"43\" width=\"14\" height=\"4\" rx=\"1\" opacity=\".6\"/>",
    "genesis": "<path class=\"f\" d=\"M5 38V28a5 5 0 0 1 5-5h44a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5z\"/><path d=\"M5 38V28a5 5 0 0 1 5-5h44a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5z\"/><circle cx=\"32\" cy=\"33\" r=\"9\"/><rect x=\"26\" y=\"29\" width=\"12\" height=\"8\" rx=\"1.500\" class=\"f\"/><path d=\"M11 34h8M45 33h8\" opacity=\".6\"/><path d=\"M6 47h52\" opacity=\".4\"/><circle class=\"a\" cx=\"12\" cy=\"29\" r=\"1.800\"/>",
    "segacd": "<rect class=\"f\" x=\"5\" y=\"33\" width=\"54\" height=\"22\" rx=\"4\"/><rect x=\"5\" y=\"33\" width=\"54\" height=\"22\" rx=\"4\"/><circle cx=\"24\" cy=\"44\" r=\"7.500\"/><circle cx=\"24\" cy=\"44\" r=\"2\" class=\"a\"/><path d=\"M38 41h16M38 47h10\" opacity=\".6\"/><path class=\"f\" d=\"M14 29v-8a3 3 0 0 1 3-3h30a3 3 0 0 1 3 3v8\"/><path d=\"M14 29v-8a3 3 0 0 1 3-3h30a3 3 0 0 1 3 3v8\"/><circle cx=\"32\" cy=\"24\" r=\"3.500\"/>",
    "32x": "<path class=\"f\" d=\"M7 22h50a3 3 0 0 1 3 3v22a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V25a3 3 0 0 1 3-3z\"/><path d=\"M7 22h50a3 3 0 0 1 3 3v22a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V25a3 3 0 0 1 3-3z\"/><path d=\"M14 22v-6h36v6\"/><text x=\"32\" y=\"43\" text-anchor=\"middle\" font-family=\"Segoe UI,Arial\" font-weight=\"800\" font-size=\"17\" fill=\"currentColor\" stroke=\"none\">32X</text>",
    "saturn": "<path class=\"f\" d=\"M5 24a4 4 0 0 1 4-4h46a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z\"/><path d=\"M5 24a4 4 0 0 1 4-4h46a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z\"/><circle cx=\"23\" cy=\"36\" r=\"11\"/><circle cx=\"23\" cy=\"36\" r=\"3\" class=\"a\"/><path d=\"M15 29a10 10 0 0 1 6-4\" opacity=\".6\"/><rect x=\"40\" y=\"27\" width=\"14\" height=\"4\" rx=\"1\"/><rect x=\"40\" y=\"35\" width=\"14\" height=\"4\" rx=\"1\"/><circle cx=\"47\" cy=\"45\" r=\"1.800\" class=\"a\"/>",
    "dreamcast": "<rect class=\"f\" x=\"7\" y=\"7\" width=\"50\" height=\"50\" rx=\"9\"/><rect x=\"7\" y=\"7\" width=\"50\" height=\"50\" rx=\"9\"/><circle cx=\"32\" cy=\"29\" r=\"16\"/><path d=\"M32 21a8 8 0 1 1-8 8 5 5 0 0 1 5-5 3 3 0 0 1 3 3\" class=\"a\" fill=\"none\" stroke=\"var(--ac)\" stroke-width=\"2.600\"/><rect x=\"13\" y=\"49\" width=\"7\" height=\"4\" rx=\"1\"/><rect x=\"22\" y=\"49\" width=\"7\" height=\"4\" rx=\"1\"/><rect x=\"35\" y=\"49\" width=\"7\" height=\"4\" rx=\"1\"/><rect x=\"44\" y=\"49\" width=\"7\" height=\"4\" rx=\"1\"/>",
    "gg": "<path class=\"f\" d=\"M10 15h44a7 7 0 0 1 7 7v20a7 7 0 0 1-7 7H10a7 7 0 0 1-7-7V22a7 7 0 0 1 7-7z\"/><path d=\"M10 15h44a7 7 0 0 1 7 7v20a7 7 0 0 1-7 7H10a7 7 0 0 1-7-7V22a7 7 0 0 1 7-7z\"/><rect x=\"16\" y=\"19\" width=\"32\" height=\"26\" rx=\"2\"/><rect x=\"19.500\" y=\"22.500\" width=\"25\" height=\"19\" rx=\"1\" class=\"f\"/><path d=\"M9 29v9M4.500 33.500h9\" stroke-width=\"3\"/><circle class=\"a\" cx=\"55\" cy=\"30\" r=\"2.800\"/><circle class=\"a\" cx=\"55\" cy=\"38\" r=\"2.800\"/>",
    "ps1": "<path class=\"f\" d=\"M15 17h34c6 0 10 4 11 10l3 18c1 6-6 10-11 6l-6-6H18l-6 6c-5 4-12 0-11-6l3-18c1-6 5-10 11-10z\"/><path d=\"M15 17h34c6 0 10 4 11 10l3 18c1 6-6 10-11 6l-6-6H18l-6 6c-5 4-12 0-11-6l3-18c1-6 5-10 11-10z\"/><path d=\"M13 17v-3.500h10V17M41 17v-3.500h10V17\"/><path d=\"M16.5 23.5v11.0M11.0 29h11.0\" stroke-width=\"3.4\"/><path d=\"M47 21.500l3.200 5.400h-6.400z\" fill=\"#42c28f\" stroke=\"none\"/><circle cx=\"54\" cy=\"29\" r=\"3\" fill=\"#ef5a6b\" stroke=\"none\"/><path d=\"M44 32.800l5 5M49 32.800l-5 5\" stroke=\"#5b8def\" stroke-width=\"2.200\"/><rect x=\"38.200\" y=\"26.800\" width=\"5.400\" height=\"5.400\" rx=\"1\" fill=\"#ec8fc0\" stroke=\"none\"/><rect x=\"28\" y=\"30\" width=\"3.600\" height=\"2\" rx=\"1\" fill=\"currentColor\" stroke=\"none\"/><rect x=\"34\" y=\"30\" width=\"3.600\" height=\"2\" rx=\"1\" fill=\"currentColor\" stroke=\"none\"/>",
    "ps2": "<rect class=\"f\" x=\"17\" y=\"4\" width=\"30\" height=\"56\" rx=\"4\"/><rect x=\"17\" y=\"4\" width=\"30\" height=\"56\" rx=\"4\"/><path d=\"M21 16h22\"/><path d=\"M21 20h22\" opacity=\".5\"/><circle cx=\"32\" cy=\"32\" r=\"6\"/><circle cx=\"32\" cy=\"32\" r=\"1.800\" class=\"a\"/><rect x=\"21\" y=\"45\" width=\"6\" height=\"4\" rx=\"1\"/><rect x=\"29\" y=\"45\" width=\"6\" height=\"4\" rx=\"1\"/><rect x=\"37\" y=\"45\" width=\"6\" height=\"4\" rx=\"1\"/><circle cx=\"42\" cy=\"10\" r=\"1.800\" class=\"a\"/>",
    "ps3": "<path class=\"f\" d=\"M15 17h34c6 0 10 4 11 10l3 18c1 6-6 10-11 6l-6-6H18l-6 6c-5 4-12 0-11-6l3-18c1-6 5-10 11-10z\"/><path d=\"M15 17h34c6 0 10 4 11 10l3 18c1 6-6 10-11 6l-6-6H18l-6 6c-5 4-12 0-11-6l3-18c1-6 5-10 11-10z\"/><path d=\"M14 17v-3.500h12V17M38 17v-3.500h12V17\"/><circle cx=\"32\" cy=\"26\" r=\"3\" class=\"a\"/><circle cx=\"23.500\" cy=\"37\" r=\"5.500\" fill=\"currentColor\" fill-opacity=\".15\"/><circle cx=\"40.500\" cy=\"37\" r=\"5.500\" fill=\"currentColor\" fill-opacity=\".15\"/><path d=\"M15 22.8v8.4M10.8 27h8.4\" stroke-width=\"3\"/><path d=\"M47.500 21l2.600 4.400h-5.200z\" fill=\"#42c28f\" stroke=\"none\"/><circle cx=\"53\" cy=\"27\" r=\"2.3\" fill=\"#ef5a6b\" stroke=\"none\"/><circle cx=\"47.5\" cy=\"32\" r=\"0\" fill=\"#5b8def\" stroke=\"none\"/><path d=\"M45 30l4 4M49 30l-4 4\" stroke=\"#5b8def\" stroke-width=\"1.900\"/><rect x=\"40.800\" y=\"25\" width=\"4.200\" height=\"4.200\" rx=\".8\" fill=\"#ec8fc0\" stroke=\"none\"/>",
    "psp": "<path class=\"f\" d=\"M12 14h40a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8H12a8 8 0 0 1-8-8V22a8 8 0 0 1 8-8z\"/><path d=\"M12 14h40a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8H12a8 8 0 0 1-8-8V22a8 8 0 0 1 8-8z\"/><rect x=\"16\" y=\"18\" width=\"32\" height=\"28\" rx=\"3\"/><rect x=\"19\" y=\"21\" width=\"26\" height=\"22\" rx=\"1.500\" class=\"f\"/><path d=\"M10 28v8M6 32h8\" stroke-width=\"2.800\"/><circle cx=\"54\" cy=\"27\" r=\"1.800\"/><circle cx=\"54\" cy=\"37\" r=\"1.800\"/><circle cx=\"50.500\" cy=\"32\" r=\"1.800\"/><circle cx=\"57.500\" cy=\"32\" r=\"1.800\" class=\"a\"/>",
    "xbox": "<rect class=\"f\" x=\"5\" y=\"14\" width=\"54\" height=\"36\" rx=\"6\"/><rect x=\"5\" y=\"14\" width=\"54\" height=\"36\" rx=\"6\"/><circle cx=\"32\" cy=\"32\" r=\"13\"/><path d=\"M25.500 25.500l13 13M38.500 25.500l-13 13\" stroke=\"var(--ac)\" stroke-width=\"3.400\"/><circle cx=\"10.500\" cy=\"44.500\" r=\"1.200\"/><circle cx=\"53.500\" cy=\"44.500\" r=\"1.200\"/>",
    "xbox360": "<path class=\"f\" d=\"M15 17h34c6 0 10 4 11 10l3 18c1 6-6 10-11 6l-6-6H18l-6 6c-5 4-12 0-11-6l3-18c1-6 5-10 11-10z\"/><path d=\"M15 17h34c6 0 10 4 11 10l3 18c1 6-6 10-11 6l-6-6H18l-6 6c-5 4-12 0-11-6l3-18c1-6 5-10 11-10z\"/><path d=\"M13 17v-3.500h12V17M39 17v-3.500h12V17\"/><circle cx=\"32\" cy=\"25\" r=\"5\" fill=\"currentColor\" fill-opacity=\".12\"/><circle cx=\"32\" cy=\"25\" r=\"2.200\" fill=\"#42c28f\" stroke=\"none\"/><circle cx=\"19\" cy=\"25.500\" r=\"5\" fill=\"currentColor\" fill-opacity=\".15\"/><path d=\"M25.5 33.3v8.4M21.3 37.5h8.4\" stroke-width=\"3\"/><circle cx=\"40\" cy=\"37.500\" r=\"5\" fill=\"currentColor\" fill-opacity=\".15\"/><circle cx=\"47.5\" cy=\"21.5\" r=\"2.4\" fill=\"#f6c445\" stroke=\"none\"/><circle cx=\"53.5\" cy=\"27\" r=\"2.4\" fill=\"#ef5a6b\" stroke=\"none\"/><circle cx=\"47.5\" cy=\"32.5\" r=\"2.4\" fill=\"#42c28f\" stroke=\"none\"/><circle cx=\"41.5\" cy=\"27\" r=\"2.4\" fill=\"#5b8def\" stroke=\"none\"/>",
    "atari2600": "<path class=\"f\" d=\"M12 44h40l3 12H9z\"/><path d=\"M12 44h40l3 12H9z\"/><path d=\"M32 44V22\"/><circle cx=\"32\" cy=\"16\" r=\"7\"/><path d=\"M28.500 13a5 5 0 0 1 5-2.500\" opacity=\".6\"/><circle cx=\"48\" cy=\"50\" r=\"2.800\" class=\"a\"/>",
    "atari5200": "<rect class=\"f\" x=\"14\" y=\"4\" width=\"36\" height=\"56\" rx=\"7\"/><rect x=\"14\" y=\"4\" width=\"36\" height=\"56\" rx=\"7\"/><circle cx=\"32\" cy=\"16\" r=\"6.500\"/><circle cx=\"32\" cy=\"16\" r=\"2.500\" class=\"a\"/><rect x=\"21\" y=\"29\" width=\"6\" height=\"5\" rx=\"1\"/><rect x=\"29\" y=\"29\" width=\"6\" height=\"5\" rx=\"1\"/><rect x=\"37\" y=\"29\" width=\"6\" height=\"5\" rx=\"1\"/><rect x=\"21\" y=\"37\" width=\"6\" height=\"5\" rx=\"1\"/><rect x=\"29\" y=\"37\" width=\"6\" height=\"5\" rx=\"1\"/><rect x=\"37\" y=\"37\" width=\"6\" height=\"5\" rx=\"1\"/><rect x=\"21\" y=\"45\" width=\"6\" height=\"5\" rx=\"1\"/><rect x=\"29\" y=\"45\" width=\"6\" height=\"5\" rx=\"1\"/><rect x=\"37\" y=\"45\" width=\"6\" height=\"5\" rx=\"1\"/>",
    "atari7800": "<path class=\"f\" d=\"M8 40h48l3 14H5z\"/><path d=\"M8 40h48l3 14H5z\"/><path d=\"M32 40V20\"/><circle cx=\"32\" cy=\"14\" r=\"6.500\"/><circle cx=\"16\" cy=\"47\" r=\"2.800\" class=\"a\"/><circle cx=\"48\" cy=\"47\" r=\"2.800\" class=\"a\"/><path d=\"M20 28h24\" opacity=\".4\"/>",
    "jaguar": "<path class=\"f\" d=\"M9 11h46a5 5 0 0 1 5 5l-2 34a7 7 0 0 1-11.500 5L41 51H23l-5.500 4A7 7 0 0 1 6 50L4 16a5 5 0 0 1 5-5z\"/><path d=\"M9 11h46a5 5 0 0 1 5 5l-2 34a7 7 0 0 1-11.500 5L41 51H23l-5.500 4A7 7 0 0 1 6 50L4 16a5 5 0 0 1 5-5z\"/><rect x=\"24\" y=\"16\" width=\"16\" height=\"25\" rx=\"2\" fill=\"currentColor\" fill-opacity=\".12\"/><rect x=\"25.5\" y=\"17.5\" width=\"4\" height=\"4.400\" rx=\".8\" fill=\"currentColor\" stroke=\"none\" opacity=\".8\"/><rect x=\"30.5\" y=\"17.5\" width=\"4\" height=\"4.400\" rx=\".8\" fill=\"currentColor\" stroke=\"none\" opacity=\".8\"/><rect x=\"35.5\" y=\"17.5\" width=\"4\" height=\"4.400\" rx=\".8\" fill=\"currentColor\" stroke=\"none\" opacity=\".8\"/><rect x=\"25.5\" y=\"23.5\" width=\"4\" height=\"4.400\" rx=\".8\" fill=\"currentColor\" stroke=\"none\" opacity=\".8\"/><rect x=\"30.5\" y=\"23.5\" width=\"4\" height=\"4.400\" rx=\".8\" fill=\"currentColor\" stroke=\"none\" opacity=\".8\"/><rect x=\"35.5\" y=\"23.5\" width=\"4\" height=\"4.400\" rx=\".8\" fill=\"currentColor\" stroke=\"none\" opacity=\".8\"/><rect x=\"25.5\" y=\"29.5\" width=\"4\" height=\"4.400\" rx=\".8\" fill=\"currentColor\" stroke=\"none\" opacity=\".8\"/><rect x=\"30.5\" y=\"29.5\" width=\"4\" height=\"4.400\" rx=\".8\" fill=\"currentColor\" stroke=\"none\" opacity=\".8\"/><rect x=\"35.5\" y=\"29.5\" width=\"4\" height=\"4.400\" rx=\".8\" fill=\"currentColor\" stroke=\"none\" opacity=\".8\"/><rect x=\"25.5\" y=\"35.5\" width=\"4\" height=\"4.400\" rx=\".8\" fill=\"currentColor\" stroke=\"none\" opacity=\".8\"/><rect x=\"30.5\" y=\"35.5\" width=\"4\" height=\"4.400\" rx=\".8\" fill=\"currentColor\" stroke=\"none\" opacity=\".8\"/><rect x=\"35.5\" y=\"35.5\" width=\"4\" height=\"4.400\" rx=\".8\" fill=\"currentColor\" stroke=\"none\" opacity=\".8\"/><path d=\"M14.5 21v10M9.5 26h10\" stroke-width=\"3.2\"/><circle cx=\"50\" cy=\"21\" r=\"2.6\" fill=\"#ef5a6b\" stroke=\"none\"/><circle cx=\"50\" cy=\"29\" r=\"2.6\" fill=\"#f6c445\" stroke=\"none\"/><circle cx=\"50\" cy=\"37\" r=\"2.6\" fill=\"#5b8def\" stroke=\"none\"/><rect x=\"25\" y=\"44\" width=\"14\" height=\"3\" rx=\"1.500\" fill=\"currentColor\" fill-opacity=\".6\" stroke=\"none\"/>",
    "lynx": "<path class=\"f\" d=\"M12 14h40c5 0 8 3 8 7l-1 22c0 4-3 7-8 7H13c-5 0-8-3-8-7L4 21c0-4 3-7 8-7z\"/><path d=\"M12 14h40c5 0 8 3 8 7l-1 22c0 4-3 7-8 7H13c-5 0-8-3-8-7L4 21c0-4 3-7 8-7z\"/><rect x=\"18\" y=\"18\" width=\"28\" height=\"24\" rx=\"2.500\"/><rect x=\"21.500\" y=\"21.500\" width=\"21\" height=\"17\" rx=\"1\" class=\"f\"/><path d=\"M11 25v10M6 30h10\" stroke-width=\"3\"/><circle class=\"a\" cx=\"54\" cy=\"28\" r=\"2.600\"/><circle class=\"a\" cx=\"54\" cy=\"36\" r=\"2.600\"/>",
    "tg16": "<path class=\"f\" d=\"M12 8h30l10 10v36a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z\" transform=\"translate(1 0)\"/><path d=\"M13 8h30l10 10v36a2 2 0 0 1-2 2H13a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z\"/><rect x=\"17\" y=\"16\" width=\"26\" height=\"18\" rx=\"2\" class=\"f\"/><path d=\"M21 22h18M21 27h12\" opacity=\".7\"/><path d=\"M18 46v6M23 46v6M28 46v6M33 46v6M38 46v6M43 46v6\" stroke=\"var(--ac)\" stroke-width=\"2.200\"/>",
    "tgcd": "<circle cx=\"32\" cy=\"32\" r=\"25\"/><circle class=\"f\" cx=\"32\" cy=\"32\" r=\"25\"/><circle cx=\"32\" cy=\"32\" r=\"8\"/><circle cx=\"32\" cy=\"32\" r=\"2.500\" class=\"a\"/><path d=\"M13 24a21 21 0 0 1 12-10\"/><path d=\"M51 40a21 21 0 0 1-12 10\" opacity=\".5\"/><path d=\"M19 44l-3 4M45 20l3-4\" opacity=\".6\"/>",
    "cdi": "<circle class=\"f\" cx=\"32\" cy=\"32\" r=\"25\"/><circle cx=\"32\" cy=\"32\" r=\"25\"/><circle cx=\"32\" cy=\"32\" r=\"12\"/><circle cx=\"32\" cy=\"32\" r=\"3\" class=\"a\"/><path d=\"M14 24a20 20 0 0 1 11-9\"/><text x=\"32\" y=\"53\" text-anchor=\"middle\" font-family=\"Georgia,serif\" font-style=\"italic\" font-weight=\"700\" font-size=\"9\" fill=\"currentColor\" stroke=\"none\">CD-i</text>",
  };
  const svg = (t, n, k) => '<svg viewBox="0 0 64 64" width="' + (n || 56) + '" height="' + (n || 56) + '" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[k] || SV[t] || SV.pad) + '</svg>';
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

  // ---------- portada: consolas por pestañas ----------
  const hub = () => {
    const seen = new Set(), list = [];
    for (const a of document.querySelectorAll('a[href]')) {
      let u; try { u = new URL(a.getAttribute('href'), location.href); } catch (e) { continue; }
      if (u.origin !== O) continue; let code = '';
      const m = /^\/vault\/([A-Za-z][A-Za-z0-9_-]*)\/?$/.exec(u.pathname); if (m) code = m[1]; else if (u.searchParams.get('p') === 'list' && u.searchParams.get('system') && !u.searchParams.get('section')) code = u.searchParams.get('system');
      if (!code || /^(about|search|lists|wishlist|login|register)$/i.test(code)) continue; const k = norm(code); if (seen.has(k)) continue; seen.add(k);
      if (/-d$/i.test(code) || /digital|\(d\)/i.test(T(a))) continue;
      const x = metaOf(code, T(a)); if (list.some((y) => y.short === x.short && x.year)) continue; x.href = u.href; list.push(x);
    }
    let items = list.length >= 5 ? list : FALL.map((c) => { const x = metaOf(c, ''); x.href = O + '/vault/' + c; return x; });
    items.sort((a, b) => (a.year || 9999) - (b.year || 9999));
    try { sessionStorage.setItem('__wtv', JSON.stringify(items.map((x) => ({ c: x.code, t: x.short, h: x.href })))); } catch (e) {}
    const TABS = [['all', 'Todas'], ['nintendo', 'Nintendo'], ['sega', 'Sega'], ['sony', 'PlayStation'], ['xbox', 'Xbox'], ['atari', 'Atari y más'], ['port', 'Portátiles']];
    const cnt = (k) => items.filter((x) => k === 'all' || (k === 'port' ? x.port : x.brand === k)).length;
    const tabs = TABS.filter((t) => cnt(t[0]) > 0);
    const TIC = { all: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6"/>', nintendo: '<rect x="2.5" y="7" width="19" height="10" rx="3"/><path d="M7 10v4M5 12h4"/><circle cx="15.5" cy="11" r="1"/><circle cx="18" cy="13.2" r="1"/>', sega: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.6"/><path d="M5.5 9a7 7 0 0 1 4-3.2"/>', sony: '<path d="M12 3.5l3.6 6.2H8.4z"/><circle cx="17.5" cy="16.5" r="3.2"/><path d="M3.5 13.5l5.5 5.5M9 13.5L3.5 19"/>', xbox: '<circle cx="12" cy="12" r="8.8"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7"/>', atari: '<path d="M12 4v9"/><circle cx="12" cy="4.5" r="2.2"/><path d="M4.5 20.5l2.2-6.5h10.6l2.2 6.5z"/>', port: '<rect x="7" y="2.5" width="10" height="19" rx="2.8"/><rect x="9.5" y="5.5" width="5" height="5.5" rx=".9"/><path d="M10 15.5v3M8.5 17h3"/><circle cx="15" cy="16" r=".9"/>' };
    const TI = (k) => '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (TIC[k] || TIC.all) + '</svg>';
    const css = `.cg{display:grid;grid-template-columns:repeat(auto-fill,minmax(205px,1fr));gap:18px}
      .cs{--ac:#fff;position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:6px;min-height:210px;padding:22px 22px 18px;border-radius:24px;background:linear-gradient(160deg,rgba(26,26,40,.72),rgba(12,12,20,.68));border:1px solid rgba(255,255,255,.08);box-shadow:0 18px 44px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.05);cursor:pointer;overflow:hidden;text-align:left;color:#fff;font-family:${FONT};animation:pop .6s calc(var(--i)*38ms) cubic-bezier(.22,1,.36,1) backwards;transform:perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .28s cubic-bezier(.22,1,.36,1),border-color .35s,box-shadow .45s}
      .cs:before{content:'';position:absolute;inset:0;background:radial-gradient(260px circle at var(--mx,85%) var(--my,0%),var(--ac),transparent 70%);opacity:0;transition:opacity .5s}
      .cs:after{content:'';position:absolute;top:0;bottom:0;left:-60%;width:40%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.12),transparent);transform:skewX(-18deg);transition:left .9s cubic-bezier(.22,1,.36,1)}
      .cs:hover{transform:perspective(900px) translateY(-7px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));border-color:rgba(255,255,255,.22);box-shadow:0 28px 60px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.04)}.cs:hover:before{opacity:.26}.ic svg{animation:fl 5s ease-in-out calc(var(--i)*-.45s) infinite}.cs:hover .ic svg{animation-duration:2s}.cs:hover:after{left:130%}.cs:active{transform:perspective(900px) translateY(-3px) scale(.985)}
      .ic{position:relative;z-index:1;color:#e8e8f2;margin-bottom:10px;transition:transform .6s cubic-bezier(.34,1.5,.64,1),color .3s,filter .4s}.cs:hover .ic{transform:translateY(-3px) rotate(-7deg) scale(1.12);color:#fff;filter:drop-shadow(0 6px 18px var(--ac))}
      .cs b{position:relative;z-index:1;font:800 23px ${FONT};letter-spacing:-.01em}.cs small{position:relative;z-index:1;font:500 12.5px ${FONT};color:#9293a8;line-height:1.35}
      .yr{position:absolute;z-index:1;top:18px;right:18px;font:700 11px ${FONT};letter-spacing:.08em;color:#c9cad6;padding:4px 10px;border-radius:99px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.08)}
      .go{position:absolute;z-index:1;right:18px;bottom:16px;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.08);color:#fff;opacity:0;transform:translateX(-8px);transition:opacity .35s,transform .45s cubic-bezier(.22,1,.36,1)}.cs:hover .go{opacity:1;transform:none}`;
    const sh = mount(css, '<div class="bar hb"><div class="lg">CONSOLAS</div><div class="tbw hubtb" id="tb"><span class="ac"></span>' + tabs.map((t, j) => '<button style="--j:' + j + '" data-k="' + t[0] + '">' + TI(t[0]) + '<span>' + t[1] + '</span><i>' + cnt(t[0]) + '</i></button>').join('') + '</div><label class="sr">' + SRCH + '<input id="q" placeholder="Buscar consola…" spellcheck="false"></label></div><div class="ct"><div class="hd"><div><h2 id="ti"></h2><p id="ts"></p></div></div><div class="gr" id="gr"></div></div>');
    const $ = (s) => sh.querySelector(s), gr = $('#gr'); let cur = 'all', t0, tabTk = 0;
    const moveAc = () => { const b = sh.querySelector('#tb button.on'), a = sh.querySelector('#tb .ac'); if (b && a) { a.style.left = b.offsetLeft + 'px'; a.style.width = b.offsetWidth + 'px'; } };
    window.addEventListener('resize', moveAc); setTimeout(moveAc, 60); setTimeout(moveAc, 700);
    const draw = () => {
      const q = norm($('#q').value), L = items.filter((x) => (cur === 'all' || (cur === 'port' ? x.port : x.brand === cur)) && (!q || norm(x.short + x.name).includes(q)));
      const tb = tabs.find((t) => t[0] === cur); setTitle($('#ti'), q ? 'Resultados' : (cur === 'all' ? 'Todas las consolas' : tb[1])); countTo($('#ts'), L.length, L.length === 1 ? ' consola' : ' consolas');
      gr.className = 'gr cg';
      gr.innerHTML = L.length ? L.map((x, i) => '<a class="cs" style="--i:' + Math.min(i, 24) + ';--ac:' + ((BR[x.brand] || [0, '#fff'])[1]) + '" data-h="' + esc(x.href) + '"><span class="ic">' + svg(x.type, 76, x.ico) + '</span>' + (x.year ? '<span class="yr">' + x.year + '</span>' : '') + '<b>' + esc(x.short) + '</b><small>' + esc(x.name) + '</small><span class="go">' + '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>').join('') : '<div class="em">No encontré esa consola</div>';
      gr.querySelectorAll('.cs').forEach((c) => {
        c.addEventListener('pointermove', (e) => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; c.style.setProperty('--ry', ((x - .5) * 12).toFixed(1) + 'deg'); c.style.setProperty('--rx', ((.5 - y) * 10).toFixed(1) + 'deg'); c.style.setProperty('--mx', (x * 100).toFixed(0) + '%'); c.style.setProperty('--my', (y * 100).toFixed(0) + '%'); });
        c.addEventListener('pointerleave', () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
        c.addEventListener('click', (e) => { e.preventDefault(); ripple(c, e); leave(sh, () => { location.href = c.dataset.h; }); });
      });
    };
    const setTab = (k, anim) => {
      const old = tabs.findIndex((t) => t[0] === cur), nw = tabs.findIndex((t) => t[0] === k); cur = k;
      sh.querySelectorAll('#tb button').forEach((b) => b.classList.toggle('on', b.dataset.k === k)); moveAc();
      if (!anim) { draw(); return; } const fw = nw > old; clearTimeout(t0); const tk = ++tabTk;
      swapGrid(gr, fw, () => { if (tk === tabTk) draw(); });
    };
    sh.querySelectorAll('#tb button').forEach((b) => b.addEventListener('click', () => { if (b.dataset.k !== cur) setTab(b.dataset.k, 1); }));
    $('#q').addEventListener('input', () => draw()); hoverPill(sh); setTab('all', 0);
    window.addEventListener('keydown', (e) => { if (e.key === '/' && sh.activeElement !== $('#q')) { e.preventDefault(); $('#q').focus(); } });
  };

  // ---------- lista de juegos de una consola ----------
  const sysCode = (() => {
    const m = /^\/vault\/([A-Za-z][A-Za-z0-9_-]*)$/.exec(P); if (m) return m[1];
    if (Q.get('p') === 'list' && Q.get('system')) return Q.get('system'); return '';
  })();
  const LANGS = new Set(['en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'sv', 'da', 'no', 'fi', 'ja', 'ko', 'zh', 'ru', 'pl', 'cs', 'hu', 'el', 'tr', 'ca', 'ar', 'he']);
  const LNAME = { spanish: 'es', english: 'en', french: 'fr', german: 'de', italian: 'it', portuguese: 'pt', dutch: 'nl', swedish: 'sv', japanese: 'ja', korean: 'ko', chinese: 'zh', russian: 'ru' };
  const langsOf = (cell) => {
    if (!cell) return []; const out = [];
    const add = (c) => { c = c.toLowerCase(); if (LANGS.has(c) && !out.includes(c)) out.push(c); };
    T(cell).split(/[^A-Za-z]+/).forEach((w) => { if (w.length === 2) add(w); else if (LNAME[w.toLowerCase()]) add(LNAME[w.toLowerCase()]); });
    cell.querySelectorAll('img[title],img[alt]').forEach((im) => { const v = (im.getAttribute('title') || im.getAttribute('alt') || '').trim(); if (v.length === 2) add(v); else if (LNAME[v.toLowerCase()]) add(LNAME[v.toLowerCase()]); });
    return out;
  };
  const hue = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360; return h; };
  const sysPage = () => {
    const rows = [], seen = new Set(), hdr = [];
    for (const tr of document.querySelectorAll('table tr')) { const ths = [...tr.children].filter((c) => c.tagName === 'TH'); if (ths.length > 1) { ths.forEach((th) => hdr.push(T(th).toLowerCase())); break; } }
    const col = (re) => hdr.findIndex((h) => re.test(h));
    const cL = col(/lang/), cR = col(/rating|score/), cV = col(/version/);
    for (const a of document.querySelectorAll('table a[href], .vault a[href], #content a[href]')) {
      let u; try { u = new URL(a.getAttribute('href'), location.href); } catch (e) { continue; } if (!/^\/vault\/\d+\/?$/.test(u.pathname) || seen.has(u.href)) continue;
      const ti = T(a); if (!ti) continue; seen.add(u.href);
      const tr = a.closest('tr'), cells = tr ? [...tr.children] : [], ch = []; let lg = [], rt = 0;
      if (tr) {
        if (cL >= 0 && cells[cL]) lg = langsOf(cells[cL]);
        if (cR >= 0 && cells[cR]) { const n = parseFloat(T(cells[cR]).replace(',', '.')); if (n > 0 && n <= 10) rt = n; }
        tr.querySelectorAll('img[title],img[alt]').forEach((im) => { const v = (im.getAttribute('title') || im.getAttribute('alt') || '').trim(); if (v && v.length > 2 && v.length < 20 && !ch.includes(v) && !LNAME[v.toLowerCase()]) ch.push(v); });
        cells.forEach((td, i) => {
          if (td.contains(a) || i === cL || i === cR) return; const v = T(td); if (!v || v.length > 22) return;
          if (cL < 0 && !lg.length) { const l = /^[A-Za-z]{2}(\s*[,/]\s*[A-Za-z]{2})*$/.test(v) ? langsOf(td) : []; if (l.length) { lg = l; return; } }
          if (cR < 0 && !rt && i !== cV && /^\d(\.\d{1,2})?$|^10(\.0+)?$/.test(v) && cells.some((c, j) => j !== i && /^\d+\.\d+$/.test(T(c)))) { const n = parseFloat(v); if (n > 0 && n <= 10 && ch.some((x) => /^\d+\.\d+$/.test(x))) { rt = n; return; } }
          if (!ch.includes(v)) ch.push(v);
        });
      }
      rows.push({ t: ti, h: u.href, ch: ch.slice(0, 3), lg, rt, es: lg.includes('es') });
    }
    if (!rows.length) return 0;
    const letters = [], ls = new Set(); const cs = Q.get('section') || '';
    for (const a of document.querySelectorAll('a[href]')) { let u; try { u = new URL(a.getAttribute('href'), location.href); } catch (e) { continue; } const s = u.searchParams.get('section'); if (!s || u.searchParams.get('system') !== (Q.get('system') || sysCode) || ls.has(s)) continue; ls.add(s); letters.push({ s, h: u.href, tx: T(a) || s }); }
    const mt = metaOf(sysCode, ''), PS = 30, known = rows.some((r) => r.lg.length), nEs = rows.filter((r) => r.es).length;
    const noEs = known && nEs === 0; let onlyEs = known && !noEs;
    const AC = (BR[mt.brand] || [0, '#fff'])[1];
    const css = `.bn{display:flex;align-items:center;gap:22px}.bi{--ac:var(--bc,#fff);color:#fff;flex:none;filter:drop-shadow(0 6px 24px rgba(255,255,255,.25));animation:pop .7s backwards}.bi svg{animation:fl 5s ease-in-out infinite}
      .big{position:relative;display:flex;align-items:center;gap:14px;height:62px;padding:0 20px;margin:0 0 20px;border-radius:22px;background:linear-gradient(180deg,rgba(26,26,40,.85),rgba(14,14,22,.8));border:1px solid rgba(255,255,255,.13);box-shadow:0 22px 60px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.07);color:#9293a8;transition:border-color .35s,box-shadow .45s,transform .45s cubic-bezier(.22,1,.36,1);animation:up .7s .08s backwards}
      .big:focus-within{border-color:rgba(255,255,255,.5);box-shadow:0 22px 60px rgba(0,0,0,.5),0 0 0 4px rgba(255,255,255,.07),0 0 50px ${AC}40;transform:translateY(-2px);color:#fff}
      .big svg{flex:none;transition:transform .5s cubic-bezier(.34,1.6,.64,1)}.big:focus-within>svg{transform:scale(1.2) rotate(-10deg)}
      .big input{flex:1;min-width:0;background:none;border:0;outline:0;color:#fff;font:600 18px ${FONT}}.big input::placeholder{color:#76778c;font-weight:500}
      .kb{flex:none;font:700 12px ${FONT};color:#9fa0b4;padding:5px 11px;border-radius:9px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1)}.cl{flex:none;width:30px;height:30px;border-radius:50%;display:none;place-items:center;background:rgba(255,255,255,.1);color:#fff;border:0;cursor:pointer;transition:transform .3s cubic-bezier(.34,1.6,.64,1),background .3s}.cl:hover{transform:rotate(90deg) scale(1.1);background:rgba(255,255,255,.2)}.big.has .cl{display:grid}.big.has .kb{display:none}
      .two{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:28px;align-items:start}@media (max-width:1100px){.two{grid-template-columns:1fr}.aside{display:none}}
      .lt{display:flex;flex-wrap:wrap;gap:7px;margin:0 0 20px;animation:up .7s .16s backwards}.lt a{min-width:38px;height:36px;padding:0 11px;display:grid;place-items:center;border-radius:12px;font:700 13px ${FONT};color:#a6a7b8;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);cursor:pointer;transition:all .3s cubic-bezier(.22,1,.36,1)}.lt a:hover{color:#fff;background:rgba(255,255,255,.12);transform:translateY(-3px) scale(1.06)}.lt a.on{color:#0b0b13;background:#f4f4f8;box-shadow:0 6px 22px rgba(255,255,255,.2)}
      .nt{display:flex;align-items:center;gap:12px;padding:13px 18px;margin:0 0 16px;border-radius:16px;font:600 13.5px ${FONT};animation:up .6s backwards}.nt.warn{color:#ffd58a;background:rgba(245,165,36,.1);border:1px solid rgba(245,165,36,.3)}.nt.inf{color:#b9bacb;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)}
      .nt button{margin-left:auto;font:700 12.5px ${FONT};color:#0b0b13;background:#f4f4f8;border:0;border-radius:99px;padding:7px 15px;cursor:pointer;transition:transform .3s cubic-bezier(.34,1.6,.64,1)}.nt button:hover{transform:scale(1.07)}
      .lr{display:flex;flex-direction:column;gap:10px}
      .rw{position:relative;overflow:hidden;display:flex;align-items:center;gap:16px;padding:12px 18px 12px 12px;border-radius:20px;background:linear-gradient(90deg,rgba(26,26,40,.72),rgba(14,14,22,.62));border:1px solid rgba(255,255,255,.07);cursor:pointer;color:#fff;animation:up .5s calc(var(--i)*26ms) cubic-bezier(.22,1,.36,1) backwards;transition:transform .45s cubic-bezier(.22,1,.36,1),border-color .3s,background .3s,box-shadow .4s}
      .rw:before{content:'';position:absolute;inset:0;border-radius:inherit;background:radial-gradient(340px circle at var(--mx,50%) 50%,rgba(255,255,255,.1),transparent 70%);opacity:0;transition:opacity .4s;pointer-events:none}.rw:hover:before{opacity:1}
      .rw:hover{transform:translateX(7px);border-color:rgba(255,255,255,.24);background:linear-gradient(90deg,rgba(42,42,60,.88),rgba(20,20,30,.72));box-shadow:0 16px 40px rgba(0,0,0,.4)}.rw:active{transform:translateX(3px) scale(.99)}
      .tl{flex:none;width:50px;height:50px;border-radius:15px;display:grid;place-items:center;font:800 20px ${FONT};color:#fff;background:linear-gradient(135deg,hsl(var(--h) 60% 42%),hsl(calc(var(--h) + 40) 65% 26%));box-shadow:inset 0 1px 0 rgba(255,255,255,.25),0 8px 20px hsl(var(--h) 60% 20% / .6);transition:transform .5s cubic-bezier(.34,1.6,.64,1)}.rw:hover .tl{transform:rotate(-8deg) scale(1.1)}
      .tx{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.tx b{font:700 15.5px ${FONT};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cc{display:flex;flex-wrap:wrap;gap:6px}.cc span{font:600 11px ${FONT};color:#b4b5c6;padding:3px 10px;border-radius:99px;background:rgba(255,255,255,.07)}
      .cc .es{color:#7ff0b9;background:rgba(61,220,151,.14);box-shadow:inset 0 0 0 1px rgba(61,220,151,.3)}.cc .nes{color:#ffd58a;background:rgba(245,165,36,.12);box-shadow:inset 0 0 0 1px rgba(245,165,36,.28)}
      .st{flex:none;display:flex;align-items:center;gap:5px;font:800 14px ${FONT};color:#ffd36e}.st svg{filter:drop-shadow(0 0 8px rgba(255,211,110,.6))}
      .rw>.ar{flex:none;opacity:0;transform:translateX(-8px);transition:all .4s cubic-bezier(.22,1,.36,1);color:#fff}.rw:hover>.ar{opacity:1;transform:none}
      .aside{position:sticky;top:84px;display:flex;flex-direction:column;gap:18px;animation:up .8s .2s backwards}
      .cd{padding:20px 18px 14px;border-radius:24px;background:linear-gradient(170deg,rgba(28,28,44,.78),rgba(12,12,20,.72));border:1px solid rgba(255,255,255,.09);box-shadow:0 20px 50px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.06);overflow:hidden;position:relative}
      .cd:before{content:'';position:absolute;top:-60px;right:-60px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,${AC}38,transparent 70%);animation:orb 9s ease-in-out infinite alternate;--x:-30px;--y:30px}
      .cd h3{position:relative;margin:0 0 14px;font:800 13px ${FONT};letter-spacing:.14em;text-transform:uppercase;color:#cfd0de;display:flex;align-items:center;gap:9px}.cd h3 svg{color:#ffd36e}
      .tp{position:relative;display:flex;align-items:center;gap:13px;padding:10px 8px;border-radius:14px;cursor:pointer;color:#fff;animation:up .55s calc(var(--i)*70ms + .35s) cubic-bezier(.22,1,.36,1) backwards;transition:background .3s,transform .4s cubic-bezier(.22,1,.36,1)}.tp:hover{background:rgba(255,255,255,.08);transform:translateX(4px)}
      .tp .nm{flex:none;width:30px;height:30px;border-radius:10px;display:grid;place-items:center;font:800 14px ${FONT};color:#0b0b13;background:linear-gradient(135deg,#fff,#b9bacb)}.tp:nth-of-type(1) .nm{background:linear-gradient(135deg,#ffe08a,#f5a524)}.tp:nth-of-type(2) .nm{background:linear-gradient(135deg,#f3f4f8,#a7a9bd)}.tp:nth-of-type(3) .nm{background:linear-gradient(135deg,#f0b48a,#b0693a)}
      .tp .tt{flex:1;min-width:0;font:600 13.5px ${FONT};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tp .rr{flex:none;font:800 12.5px ${FONT};color:#ffd36e}
      .sm{position:relative;display:flex;flex-direction:column;gap:9px;font:500 13px ${FONT};color:#9fa0b4}.sm div{display:flex;justify-content:space-between}.sm b{color:#fff;font-weight:700}
      .em a{color:#fff;font-weight:700;cursor:pointer;text-decoration:underline;text-underline-offset:4px}
      .pg{display:flex;flex-wrap:wrap;gap:7px;justify-content:center;margin-top:30px}.pg button{min-width:40px;height:40px;padding:0 13px;border-radius:13px;font:700 13.5px ${FONT};color:#a6a7b8;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);cursor:pointer;transition:all .3s cubic-bezier(.22,1,.36,1);animation:pop .45s backwards}.pg button:hover{color:#fff;background:rgba(255,255,255,.12);transform:translateY(-3px)}.pg button.on{color:#0b0b13;background:#f4f4f8}.pg button:disabled{opacity:.35;pointer-events:none}.pg span{align-self:center;color:#6f7085}`;
    const STAR = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.400 6.100 20.500l1.200-6.500L2.500 9.400l6.600-.9z"/></svg>';
    const sh = mount(css, '<div class="bar"><button class="back" id="bk">' + BACK + 'Consolas</button><div class="tbw"><button class="on sw" id="sw">' + svg(mt.type, 20, mt.ico) + '<span>' + esc(mt.short) + '</span><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button></div><div class="rt">' + (known && !noEs ? '<button class="tg on" id="tg"><span class="kn"></span><em>Solo español</em></button>' : '<span></span>') + '</div></div><div class="dd" id="dd"></div><div class="ct"><div class="hd"><div class="bn"><span class="bi" style="--bc:' + AC + '">' + svg(mt.type, 72, mt.ico) + '</span><div><h2 id="ti"></h2><p id="ts"></p></div></div></div>' +
      '<label class="big" id="bg">' + SRCH.replace('width="16" height="16"', 'width="22" height="22"') + '<input id="q" placeholder="Buscar en ' + esc(mt.short) + '…" spellcheck="false" autocomplete="off"><span class="kb">/</span><button class="cl" id="cl" title="Borrar">' + '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></label>' +
      (letters.length ? '<div class="lt">' + letters.map((l, i) => '<a style="animation:pop .5s ' + (i * 28 + 200) + 'ms cubic-bezier(.34,1.5,.64,1) backwards" data-h="' + esc(l.h) + '" class="' + (l.s.toLowerCase() === cs.toLowerCase() ? 'on' : '') + '">' + esc(l.tx.length > 4 ? l.s : l.tx) + '</a>').join('') + '</div>' : '') +
      '<div class="two"><div><div id="nt"></div><div class="gr" id="gr"></div><div class="pg" id="pg"></div></div><div class="aside"><div class="cd" id="tp"></div><div class="cd"><h3>Resumen</h3><div class="sm" id="sm"></div></div></div></div></div>');
    const $ = (s) => sh.querySelector(s), gr = $('#gr'); let pg = 1, t0;
    const base = () => rows.filter((r) => !onlyEs || r.es);
    const view = () => { const q = norm($('#q').value), b = base(); return q ? b.filter((r) => norm(r.t).includes(q)) : b; };
    const rowHtml = (r, i) => '<a class="rw" style="--i:' + Math.min(i, 18) + '" data-h="' + esc(r.h) + '"><span class="tl" style="--h:' + hue(r.t) + '">' + esc((r.t.replace(/^[^A-Za-z0-9]+/, '')[0] || '?').toUpperCase()) + '</span><span class="tx"><b>' + esc(r.t) + '</b><span class="cc">' +
      r.ch.map((c) => '<span>' + esc(c) + '</span>').join('') + r.lg.slice(0, 4).map((l) => '<span class="' + (l === 'es' ? 'es' : '') + '">' + l.toUpperCase() + '</span>').join('') + (known && !r.es ? '<span class="nes">⚠ Sin español</span>' : '') + '</span></span>' +
      (r.rt ? '<span class="st">' + STAR + r.rt.toFixed(1) + '</span>' : '') + '<svg class="ar" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>';
    const side = () => {
      const b = base(), rated = b.filter((r) => r.rt).sort((x, y) => y.rt - x.rt).slice(0, 5), top = rated.length ? rated : b.slice(0, 5);
      $('#tp').innerHTML = '<h3>' + STAR.replace('width="14" height="14"', 'width="15" height="15"') + (rated.length ? 'Top 5 mejor valorados' : 'Primeros 5') + '</h3>' + (top.length ? top.map((r, i) => '<a class="tp" style="--i:' + i + '" data-h="' + esc(r.h) + '"><span class="nm">' + (i + 1) + '</span><span class="tt">' + esc(r.t) + '</span>' + (r.rt ? '<span class="rr">★ ' + r.rt.toFixed(1) + '</span>' : '') + '</a>').join('') : '<div class="em" style="padding:16px 0">Sin juegos</div>');
      $('#tp').querySelectorAll('.tp').forEach((a) => a.addEventListener('click', () => leave(sh, () => { location.href = a.dataset.h; })));
      $('#sm').innerHTML = '<div><span>Juegos en la lista</span><b>' + rows.length + '</b></div>' + (known ? '<div><span>En español</span><b>' + nEs + '</b></div>' : '') + (cs ? '<div><span>Sección</span><b>' + esc(cs.toUpperCase()) + '</b></div>' : '');
    };
    const draw = () => {
      const L = view(), pages = Math.max(1, Math.ceil(L.length / PS)); if (pg > pages) pg = pages; const sl = L.slice((pg - 1) * PS, pg * PS), q = $('#q').value.trim();
      $('#bg').classList.toggle('has', !!q); countTo($('#ts'), L.length, (L.length === 1 ? ' juego' : ' juegos') + (onlyEs ? ' en español' : '') + (cs ? ' · sección ' + cs.toUpperCase() : '') + (pages > 1 ? ' · página ' + pg + ' de ' + pages : ''));
      const hid = rows.length - base().length;
      $('#nt').innerHTML = noEs ? '<div class="nt warn">⚠ No hay juegos en español en esta sección. Te muestro todos, pero ninguno tiene traducción al español.</div>' : (onlyEs && hid > 0 ? '<div class="nt inf">Solo juegos en español · ' + hid + ' ocultos por no tener ES<button id="sa">Mostrar todos</button></div>' : (known && !onlyEs ? '<div class="nt inf">Mostrando todos los idiomas<button id="sa">Solo español</button></div>' : (!known ? '<div class="nt inf">No pude leer el idioma de esta lista, así que muestro todo.</div>' : '')));
      const sa = $('#sa'); if (sa) sa.onclick = () => flip(); const tg = $('#tg'); if (tg) tg.classList.toggle('on', onlyEs);
      gr.className = 'gr lr';
      gr.innerHTML = sl.length ? sl.map(rowHtml).join('') : '<div class="em">' + (q ? 'No encontré «' + esc(q) + '» en esta lista.<br><br><a id="vs">Buscarlo en todo Vimm\'s Lair →</a>' : (onlyEs ? 'No hay juegos en español en esta lista.' : 'No hay juegos.')) + '</div>';
      const vs = $('#vs'); if (vs) vs.onclick = () => leave(sh, () => { location.href = O + '/vault/?p=list&system=' + encodeURIComponent(Q.get('system') || sysCode) + '&q=' + encodeURIComponent(q); });
      gr.querySelectorAll('.rw').forEach((c) => { c.addEventListener('pointermove', (e) => { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); }); c.addEventListener('click', (e) => { e.preventDefault(); ripple(c, e); leave(sh, () => { location.href = c.dataset.h; }); }); });
      const pgs = []; for (let i = 1; i <= pages; i++) if (i === 1 || i === pages || Math.abs(i - pg) <= 2) pgs.push(i); const out = []; pgs.forEach((n, i) => { if (i && n - pgs[i - 1] > 1) out.push('<span>…</span>'); out.push('<button data-p="' + n + '" class="' + (n === pg ? 'on' : '') + '">' + n + '</button>'); });
      $('#pg').innerHTML = pages > 1 ? '<button data-p="' + (pg - 1) + '"' + (pg < 2 ? ' disabled' : '') + '>‹</button>' + out.join('') + '<button data-p="' + (pg + 1) + '"' + (pg >= pages ? ' disabled' : '') + '>›</button>' : '';
      $('#pg').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => go(+b.dataset.p)));
    };
    const flip = () => { onlyEs = !onlyEs; pg = 1; swapGrid(gr, true, () => { draw(); side(); }); };
    const go = (n) => { if (n < 1 || n === pg) return; const fw = n > pg; swapGrid(gr, fw, () => { pg = n; draw(); }, () => sh.querySelector('.w').scrollTo({ top: 0, behavior: 'smooth' })); };
    { let saved = []; try { saved = JSON.parse(sessionStorage.getItem('__wtv') || '[]'); } catch (e) {}
      const all = (saved.length ? saved.map((x) => Object.assign(metaOf(x.c, x.t), { href: x.h })) : FALL.map((c) => Object.assign(metaOf(c, ''), { href: O + '/vault/' + c }))).sort((a, b) => (a.year || 9999) - (b.year || 9999));
      const dd = $('#dd'), sw = $('#sw'), me = norm(sysCode);
      dd.innerHTML = all.map((x, i) => '<a class="di' + (norm(x.code) === me ? ' cur' : '') + '" style="--i:' + i + ';color:inherit" data-h="' + esc(x.href) + '"><span style="--ac:' + ((BR[x.brand] || [0, '#fff'])[1]) + '">' + svg(x.type, 34, x.ico) + '</span>' + esc(x.short) + '</a>').join('');
      const wEl = sh.querySelector('.w'), shut = () => { dd.classList.remove('open'); sw.classList.remove('open'); wEl.classList.remove('dop'); };
      sw.addEventListener('click', (e) => { e.stopPropagation(); dd.classList.toggle('open'); sw.classList.toggle('open'); wEl.classList.toggle('dop', dd.classList.contains('open')); });
      sh.addEventListener('click', (e) => { if (!e.target.closest || !e.target.closest('#dd')) shut(); });
      window.addEventListener('keydown', (e) => { if (e.key === 'Escape') shut(); });
      dd.querySelectorAll('.di').forEach((a) => a.addEventListener('click', () => { if (a.classList.contains('cur')) { shut(); return; } leave(sh, () => { location.href = a.dataset.h; }); }));
      const tg = $('#tg'); if (tg) tg.addEventListener('click', flip); }
    setTitle($('#ti'), mt.name);
    $('#bk').addEventListener('click', () => leave(sh, () => { location.href = HUB; }));
    sh.querySelectorAll('.lt a').forEach((a) => a.addEventListener('click', () => leave(sh, () => { location.href = a.dataset.h; })));
    $('#q').addEventListener('input', () => { pg = 1; draw(); }); $('#cl').addEventListener('click', () => { $('#q').value = ''; pg = 1; draw(); $('#q').focus(); });
    window.addEventListener('keydown', (e) => { if (e.key === '/' && sh.activeElement !== $('#q')) { e.preventDefault(); $('#q').focus(); } else if (e.key === 'Escape' && $('#q').value) { $('#q').value = ''; pg = 1; draw(); } });
    draw(); side(); setTimeout(() => $('#q').focus({ preventScroll: true }), 500); return 1;
  };

  // ---------- aviso de idioma en la página de un juego ----------
  const langWarn = () => {
    if (!/^\/vault\/\d+$/.test(P)) return;
    let cell = null;
    for (const c of document.querySelectorAll('td,th')) { if (/^languages?\s*:?$/i.test(T(c))) { cell = c.nextElementSibling; break; } }
    const lg = cell ? langsOf(cell) : []; if (!lg.length || lg.includes('es')) return;
    const h = document.createElement('div'); h.id = 'wt-lw'; h.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:2147483001';
    const sh = h.attachShadow({ mode: 'open' });
    sh.innerHTML = '<style>:host{all:initial}div{display:flex;align-items:center;gap:12px;padding:12px 18px 12px 16px;border-radius:99px;font:600 13.5px ' + FONT + ';color:#ffd58a;background:rgba(30,22,8,.9);border:1px solid rgba(245,165,36,.45);backdrop-filter:blur(18px);box-shadow:0 18px 46px rgba(0,0,0,.55),0 0 40px rgba(245,165,36,.15);animation:d .7s cubic-bezier(.34,1.5,.64,1) backwards}@keyframes d{from{opacity:0;transform:translateY(-30px) scale(.9)}}button{background:none;border:0;color:#ffd58a;cursor:pointer;font:700 16px ' + FONT + ';padding:0 0 0 6px;opacity:.7}button:hover{opacity:1}</style><div>⚠ Este juego no está en español · idiomas: ' + lg.map((l) => l.toUpperCase()).join(', ') + '<button>✕</button></div>';
    sh.querySelector('button').onclick = () => h.remove(); document.documentElement.appendChild(h);
  };

  // ---------- resto de páginas: botón flotante para volver ----------
  const floatBar = () => {
    const h = document.createElement('div'); h.id = 'wt-fb'; h.style.cssText = 'position:fixed;left:18px;bottom:18px;z-index:2147483000;display:flex;gap:8px';
    const sh = h.attachShadow({ mode: 'open' });
    sh.innerHTML = '<style>:host{all:initial}button{display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 18px 0 14px;font:600 13.5px ' + FONT + ';color:#d6d7e2;background:rgba(16,16,26,.82);border:1px solid rgba(255,255,255,.14);border-radius:99px;cursor:pointer;backdrop-filter:blur(18px);box-shadow:0 14px 36px rgba(0,0,0,.5);transition:transform .4s cubic-bezier(.22,1,.36,1),color .3s,background .3s;animation:u .6s backwards}button:hover{color:#fff;background:rgba(40,40,58,.9);transform:translateY(-2px)}button:active{transform:scale(.95)}@keyframes u{from{opacity:0;transform:translateY(14px)}}</style><button id="a">' + BACK + 'Atrás</button><button id="b" style="animation-delay:.08s">Consolas</button>';
    sh.getElementById('a').onclick = () => history.back(); sh.getElementById('b').onclick = () => { location.href = HUB; };
    document.documentElement.appendChild(h);
  };
  const isHub = (P === '/' || P === '/vault') && !sysCode && (!Q.get('p') || Q.get('p') === 'vault');
  const run = () => { try { if (isHub) hub(); else if (sysCode && sysPage()) return; else { floatBar(); langWarn(); } } catch (e) { try { floatBar(); } catch (_) {} } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
}
const skinFor = (url) => { try { const h = new URL(url).hostname; return SKINS.find((s) => s.test.test(h)) || null; } catch (e) { return null; } };
module.exports = { SKINS, MONO_JS, skinFor, CONSOLE_JS: { steamrip: '(' + steamripConsole.toString() + ')()', vimm: '(' + vimmConsole.toString() + ')()' } };
