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
    const shots = imgs.map((i) => i.currentSrc || i.src).filter((u, i, a) => u !== cover && a.indexOf(u) === i).slice(0, 8);
    return { title, cover, links, cats, date, info, shots, req, size, ver, space };
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reqCard = (t, o) => { const ks = Object.keys(o); return ks.length ? '<div class="rq"><h4>' + t + '</h4>' + ks.map((k) => '<div class="rw"><span>' + k + '</span><b>' + esc(o[k]) + '</b></div>').join('') + '</div>' : ''; };
  // pestañas compartidas (portada y página de juego)
  const TABS = () => [{ k: 'new', t: 'Lanzamientos', sub: 'Agregados recientemente', url: '' }, { k: 'top', t: 'Más populares', sub: 'Los más descargados', url: navLink(/top\s*games/i) }, { k: 'upd', t: 'Actualizados', sub: 'Con versión nueva', url: navLink(/recent\s*updates|updated/i) }, { k: 'all', t: 'Todos los juegos', sub: 'Lista completa', url: navLink(/games?\s*list|all\s*games|a\s*-?\s*z\b/i) }].filter((x) => x.k === 'new' || x.url);
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
      .bar:before{content:'';position:absolute;inset:-16px -60px -14px;background:linear-gradient(180deg,rgba(7,6,15,.92) 30%,rgba(7,6,15,0));z-index:-1;pointer-events:none}
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
    <div class="app"><div class="bar"><button class="ob" id="back">${ic('back')}Volver</button><div class="tbw" id="nv">${tabBtns(tabs)}</div><button class="ob" id="orig">${ic('ext')}Página original</button></div>
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
    const showOrig = (cm) => {
      hostEl.style.display = 'none'; document.documentElement.classList.remove('wt-console-on');
      if (cm) { cm.removeAttribute('slot'); document.body.appendChild(cm); setTimeout(() => cm.scrollIntoView({ block: 'start' }), 60); }
      const b = document.createElement('button'); b.textContent = 'Volver al menú';
      b.style.cssText = 'position:fixed;right:20px;bottom:20px;z-index:2147483001;padding:10px 18px;border-radius:99px;border:1px solid rgba(255,255,255,.2);background:#111;color:#fff;font:600 13px system-ui;cursor:pointer';
      b.onclick = () => { hostEl.style.display = 'block'; document.documentElement.classList.add('wt-console-on'); if (cm) { cm.setAttribute('slot', 'c'); hostEl.appendChild(cm); } b.remove(); }; document.body.appendChild(b);
    };
    $('#orig').onclick = () => showOrig(null);
    // comentarios: se usa el bloque real de la página; si el sitio los carga recién al verlos, se lo "despierta" y, si sigue vacío, se ofrece abrirlos en la página original
    let cmNode = null;
    const grab = () => { const c = document.querySelector('#comments, .comments-area, #disqus_thread, .wpd-comm, #wpdcom, [id*=comment]:not(script)'); if (c && !hostEl.contains(c)) { cmNode = c; c.setAttribute('slot', 'c'); hostEl.appendChild(c); return true; } return !!cmNode; };
    const count = () => { if (!cmNode) return 0; const n = cmNode.querySelectorAll('.comment, .wpd-comment, li.comment, article').length; const t = sh.querySelector('.tb[data-t=c]'); if (n) t.textContent = 'Comentarios (' + n + ')'; place(sh.querySelector('.tb.on')); return n || (cmNode.textContent || '').trim().length > 60 || cmNode.querySelector('iframe'); };
    let wk = 0;
    const wake = () => {
      if (wk > 2) return; wk++;
      try { window.dispatchEvent(new Event('scroll')); window.dispatchEvent(new Event('resize')); const btn = document.querySelector('.wpd-load-more-submit, #load-comments, .dsq-load-btn, [class*=load-comments], [id*=load-comments]'); if (btn) btn.click(); } catch (e) {}
      setTimeout(() => { if (count()) return; const box = $('.cm'); if (!box || box.querySelector('.fb')) return; const f = document.createElement('div'); f.className = 'fb'; f.innerHTML = '<div>' + (cmNode ? 'Los comentarios no se cargaron acá.' : 'No encontré comentarios en esta página.') + '</div>' + (cmNode ? '<button>Abrir comentarios en la página original</button>' : ''); box.appendChild(f); const bt = f.querySelector('button'); if (bt) bt.onclick = () => showOrig(cmNode); }, 2800);
    };
    let tries = 0; const iv = setInterval(() => { grab(); count(); if (++tries > 30) clearInterval(iv); }, 600); grab();
    return hostEl;
  };

  // ---------- portada de SteamRIP: biblioteca con destacados, pestañas (lanzamientos / populares / actualizados / lista), búsqueda y vista cuadrícula o lista ----------
  const cardsFrom = (doc, base, mode) => {
    const abs = (u) => { try { return new URL(u, base).href; } catch (e) { return ''; } };
    const all = [...doc.querySelectorAll('a[href*="free-download"]')].filter((a) => !a.closest('nav, header, footer'));
    let scope = doc.body;
    if (mode === 'new') { const hd = [...doc.querySelectorAll('h1,h2,h3,h4,span,div,p')].find((e) => !e.children.length && /^\s*recently added\s*$/i.test(e.textContent)); if (hd) { let c = hd, n = 0; while (c.parentElement && n++ < 7 && c.querySelectorAll('a[href*="free-download"]').length < 6) c = c.parentElement; if (c.querySelectorAll('a[href*="free-download"]').length >= 6) scope = c; } }
    else { const cnt = new Map(); for (const a of all) { let p = a.parentElement, d = 0; while (p && p !== doc.body && d++ < 6) { cnt.set(p, (cnt.get(p) || 0) + 1); p = p.parentElement; } } let best = null, bc = 0; for (const [el, c] of cnt) if (c > bc || (c === bc && best && best.contains(el))) { best = el; bc = c; } if (best && bc >= 4) scope = best; }
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
    const ST = {}, nxt = (k, doc, url, pg) => { const n = nextOf(doc, url); if (n) return n; if (k === 'new') return location.origin + '/page/' + (pg + 1) + '/'; try { const u = new URL(url); u.hash = ''; u.search = ''; u.pathname = u.pathname.replace(/\/page\/\d+\/?$/, '/').replace(/\/?$/, '/') + 'page/' + (pg + 1) + '/'; return u.href; } catch (e) { return ''; } }; tabs.forEach((x) => { ST[x.k] = { items: x.k === 'new' ? firstCards : null, pg: x.k === 'new' ? 1 : 0, next: x.k === 'new' ? nxt('new', document, location.href, (/\/page\/(\d+)/.exec(location.pathname) || [0, 1])[1] * 1) : '', busy: 0 }; });
    let cur = 'new', view = 'grid', q = '', shown = 0, pgN = 1; const PER = 14; const PAGE = 36;
    const row = (c, i) => { const m = c.m, ch = m ? [m.ver ? '<span class="v">' + esc(m.ver) + '</span>' : '', m.size ? '<span>' + esc(m.size) + '</span>' : '', ...(m.cats || []).map((x) => '<span>' + esc(x) + '</span>')].join('') : '<span class="uw" style="width:70px"></span><span class="uw" style="width:56px"></span>';
      return '<a class="up2 rv" data-i="' + i + '" href="' + esc(c.href) + '" style="--i:' + (i % 10) + '">' + (c.img ? '<span class="ubg" style="background-image:url(\'' + esc(c.img) + '\')"></span>' : '') + '<span class="un">' + String(i + 1).padStart(2, '0') + '</span><span class="ucv">' + (c.img ? '<img loading="lazy" src="' + esc(c.img) + '" alt="">' : '<b class="ph">' + esc(c.title.charAt(0)) + '</b>') + '</span><span class="ub"><span class="uk"><i class="dot"></i>Actualizado' + (m && m.date ? '<em>· ' + esc(m.date) + '</em>' : '') + '</span><b class="ut">' + esc(c.title) + '</b><span class="uc">' + ch + '</span>' + (m ? (m.desc ? '<span class="ud2">' + esc(m.desc) + '</span>' : '') : '<span class="uw" style="width:92%"></span><span class="uw" style="width:68%"></span>') + '<span class="uf"><small>' + (m && m.ver ? 'Nueva versión disponible' : 'Versión más reciente') + '</small><span class="ugo">Ver juego<i>›</i></span></span></span></a>'; };
    const lrow = (c, i) => { const m = c.m, ch = m ? [m.ver ? '<span class="v">' + esc(m.ver) + '</span>' : '', m.size ? '<span>' + esc(m.size) + '</span>' : '', ...(m.cats || []).map((x) => '<span>' + esc(x) + '</span>')].join('') : '<span class="uw" style="width:64px"></span><span class="uw" style="width:50px"></span>';
      return '<a class="alr rv" data-i="' + i + '" href="' + esc(c.href) + '" style="--i:' + (i % 14) + '">' + (c.img ? '<span class="abg" style="background-image:url(\'' + esc(c.img) + '\')"></span>' : '') + '<span class="aw">' + esc(c.title.trim().charAt(0).toUpperCase()) + '</span><span class="an">' + String(i + 1).padStart(3, '0') + '</span><span class="acv">' + (c.img ? '<img loading="lazy" src="' + esc(c.img) + '" alt="">' : '<b class="ph">' + esc(c.title.charAt(0)) + '</b>') + '</span><span class="ab"><b class="at">' + esc(c.title) + '</b><span class="ac">' + ch + (m && m.date ? '<em>' + esc(m.date) + '</em>' : '') + '</span>' + (m && m.desc ? '<span class="ax"><span>' + esc(m.desc) + '</span></span>' : '') + '</span><span class="ago">Ver juego<i>›</i></span></a>'; };
    const pager = (pages, pg) => { if (pages < 2) return ''; const set = new Set([1, pages, pg, pg - 1, pg + 1, pg - 2, pg + 2]); const arr = [...set].filter((x) => x >= 1 && x <= pages).sort((a, b) => a - b); let h = '<button class="pb nv2" data-p="' + (pg - 1) + '"' + (pg < 2 ? ' disabled' : '') + '>‹</button>', last = 0; for (const x of arr) { if (x - last > 1) h += '<span class="pe">…</span>'; h += '<button class="pb' + (x === pg ? ' on' : '') + '" data-p="' + x + '">' + x + '</button>'; last = x; } return '<div class="pgs">' + h + '<button class="pb nv2" data-p="' + (pg + 1) + '"' + (pg >= pages ? ' disabled' : '') + '>›</button></div>'; };
    const card = (c, i) => '<a class="cd rv" href="' + esc(c.href) + '" style="--i:' + (i % 12) + '"><span class="im">' + (c.img ? '<img loading="lazy" src="' + esc(c.img) + '" alt="">' : '<b class="ph">' + esc(c.title.charAt(0)) + '</b>') + '<i class="gl"></i></span>' + (cur === 'top' ? (() => { const rk = (ST.top.items || []).indexOf(c) + 1; return rk ? '<em class="rk r' + Math.min(rk, 4) + '">' + rk + '</em>' : ''; })() : '') + '<span class="nm"><b>' + esc(c.title) + '</b></span></a>';
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
    <div class="sp" id="sp"></div><button class="up" id="up">↑</button><div class="w" id="w"><div class="bar"><span></span><div class="tb" id="tb"><span class="pill" id="pill"></span>${tabBtns(tabs)}</div><button class="ob" id="orig">${ic('ext')}Sitio original</button></div>
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
    const allItems = () => Object.values(ST).flatMap((x) => x.items || []);
    const covQ = []; let covBusy = 0;
    const covPump = () => { while (covBusy < 4 && covQ.length) { const cd = covQ.shift(); covBusy++; metaOf(cd.href).then((m) => { const it = allItems().find((c) => c.href === cd.href); if (it) { it.m = m; if (m.img) it.img = m.img; }
      if (cd.classList.contains('up2') || cd.classList.contains('alr')) { if (it) { const t = document.createElement('div'); t.innerHTML = (cd.classList.contains('alr') ? lrow : row)(it, +cd.dataset.i); const n = t.firstChild; n.classList.add('in'); n.dataset.cv = 1; n.style.opacity = '0'; cd.replaceWith(n); requestAnimationFrame(() => { n.style.transition = 'opacity .7s'; n.style.opacity = '1'; }); } return; }
      const ph = cd.querySelector('.ph'); if (m.img && ph) { const im = new Image(); im.onload = () => { const t = document.createElement('img'); t.src = m.img; t.alt = ''; t.style.cssText = 'opacity:0;transition:opacity .8s'; ph.replaceWith(t); requestAnimationFrame(() => { t.style.opacity = '1'; }); }; im.src = m.img; } }).finally(() => { covBusy--; covPump(); }); } };
    const ioC = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { ioC.unobserve(e.target); covQ.push(e.target); covPump(); } }), { root: w, rootMargin: '400px' }) : null;
    let heroT = 0, heroTok = 0;
    const drawHero = () => {
      clearInterval(heroT); const it = (ST[cur].items || []).filter((c) => c.img).slice(0, 5);
      if (!it.length || q || cur === 'all') { hero.innerHTML = ''; return; }
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
      const vis = list.slice(0, q ? 400 : Math.max(shown, PAGE));
      gr.innerHTML = vis.length ? vis.map(cur === 'upd' ? row : card).join('') : '<div class="em">No hay juegos que coincidan</div>'; arm(); if (ioC) (cur === 'upd' ? gr.querySelectorAll('.up2') : [...gr.querySelectorAll('.ph')].map((p) => p.closest('.cd'))).forEach((cd) => { const it = cur === 'upd' ? allItems().find((c) => c.href === cd.href) : null; if (cd && !cd.dataset.cv && !(it && it.m)) { cd.dataset.cv = 1; ioC.observe(cd); } });
      const more = list.length > vis.length;
      ft.innerHTML = more || (st.next && !q) ? '<button id="mr">' + (st.busy ? 'Cargando…' : 'Cargar más') + '</button>' : (st.err ? '<span class="er">' + esc(st.err) + '</span>' : '');
      const mr = $('#mr'); if (mr) mr.onclick = loadMore;
    };
    const fetchTab = async (k, url) => {
      const st = ST[k]; if (st.busy) return; st.busy = 1;
      try { const r = await fetch(url, { credentials: 'include' }); if (r.status === 404 && (ST[k].items || []).length) { st.next = ''; st.busy = 0; if (k === cur) draw(); return; } if (!r.ok) throw new Error('HTTP ' + r.status); const doc = new DOMParser().parseFromString(await r.text(), 'text/html'); const have = new Set((st.items || []).map((c) => c.href)); const add = cardsFrom(doc, url, k === 'new' ? 'new' : 'x').filter((c) => !have.has(c.href)); await Promise.all(add.filter((c) => k !== 'all' && (!c.img || k === 'upd')).slice(0, 10).map((c) => metaOf(c.href).then((m) => { c.m = m; if (m.img) c.img = m.img; }))); st.items = (st.items || []).concat(add); if (k === 'all') st.items.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })); st.pg++; st.next = add.length && k !== 'all' ? nxt(k, doc, url, st.pg) : ''; st.err = add.length || st.items.length ? '' : 'No encontré juegos en esta sección'; }
      catch (e) { st.next = ''; st.items = st.items || []; st.err = 'No se pudo cargar (' + String(e.message || e).slice(0, 40) + ')'; }
      st.busy = 0; if (k === cur) { draw(); if (k !== 'new' || true) drawHero(); }
    };
    const loadMore = () => { const st = ST[cur], list = filt(); if (list.length > shown && !q) { shown += PAGE; draw(); return; } if (st.next) fetchTab(cur, st.next).then(() => { shown += PAGE; draw(); }); };
    let swT = 0;
    const sw = (k) => {
      const di = tabs.findIndex((x) => x.k === k) - tabs.findIndex((x) => x.k === cur), fw = di > 0; clearTimeout(swT);
      sh.querySelectorAll('#tb button').forEach((b) => b.classList.toggle('on', b.dataset.k === k)); pill(); w.scrollTo({ top: 0, behavior: 'smooth' });
      gr.classList.remove('xl', 'xr', 'ol', 'or'); void gr.offsetWidth; gr.classList.add(fw ? 'ol' : 'or'); hero.classList.add('o');
      swT = setTimeout(() => {
        cur = k; shown = PAGE; pgN = 1; q = ''; $('#q').value = ''; gr.classList.remove('ol', 'or'); draw(); gr.classList.add(fw ? 'xl' : 'xr'); hero.classList.remove('o');
        if (ST[k].items) drawHero(); else fetchTab(k, tabs.find((x) => x.k === k).url);
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
    $('#orig').onclick = () => { hostEl.style.display = 'none'; document.documentElement.classList.remove('wt-console-on'); const b = document.createElement('button'); b.textContent = 'Volver a la biblioteca'; b.style.cssText = 'position:fixed;right:20px;bottom:20px;z-index:2147483001;padding:10px 18px;border-radius:99px;border:1px solid rgba(255,255,255,.2);background:#111;color:#fff;font:600 13px system-ui;cursor:pointer'; b.onclick = () => { hostEl.style.display = 'block'; document.documentElement.classList.add('wt-console-on'); b.remove(); }; document.body.appendChild(b); };
    document.documentElement.classList.add('wt-console-on'); document.body.appendChild(hostEl); hoverPill(sh);
    shown = PAGE; sh.querySelector('#tb button[data-k=new]').classList.add('on'); requestAnimationFrame(() => { pill(); }); draw(); drawHero();
    { const hm = /wt=(\w+)/.exec(location.hash); if (hm && hm[1] !== 'new' && ST[hm[1]]) sw(hm[1]); }
  };
  let htries = 0; const goHome = () => { try { const c = cardsFrom(document, location.href, 'new'); if (c.length >= 4) { mountHome(c); return; } } catch (e) {} if (++htries < 8) setTimeout(goHome, 900); };
  let tries = 0; const go = () => { try { const d = build(); if (d) { mount(d); return; } } catch (e) {} if (++tries < 6) setTimeout(go, 1000); };
  if (/free-download/i.test(location.pathname)) go(); else if (/^\/(page\/\d+\/?)?$/.test(location.pathname)) goHome();
}
const skinFor = (url) => { try { const h = new URL(url).hostname; return SKINS.find((s) => s.test.test(h)) || null; } catch (e) { return null; } };
module.exports = { SKINS, MONO_JS, skinFor, CONSOLE_JS: { steamrip: '(' + steamripConsole.toString() + ')()' } };
