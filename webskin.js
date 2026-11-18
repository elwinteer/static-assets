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
  const HOSTS = { 'megadb.net': 'MegaDB', 'gofile.io': 'Gofile', '1fichier.com': '1Fichier', 'buzzheavier.com': 'BuzzHeavier', 'vikingfile.com': 'VikingFile', 'pixeldrain.com': 'Pixeldrain', 'mediafire.com': 'MediaFire', 'filecrypt.cc': 'FileCrypt', 'filecrypt.co': 'FileCrypt', 'datanodes.to': 'DataNodes', 'ddownload.com': 'DDownload', 'rapidgator.net': 'Rapidgator', 'drive.google.com': 'Google Drive', 'mega.nz': 'MEGA', 'qiwi.gg': 'Qiwi', 'workupload.com': 'Workupload', 'send.cm': 'Send.cm', 'uploadhaven.com': 'UploadHaven', 'turbobit.net': 'Turbobit' };
  const BAD = /(discord|facebook|twitter|x\.com|instagram|youtube|youtu\.be|t\.me|telegram|reddit|steampowered|patreon|ko-fi|paypal|store\.epicgames|gog\.com)/i;
  const clean = (t) => String(t || '').replace(/\s+/g, ' ').replace(/\s*[-–—|]?\s*free\s+download.*$/i, '').replace(/\s*\(?\bbuild\s*\d+\)?\s*$/i, '').trim();
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
    const vm = /\bbuild\s*(\d{5,})|\bv\s*(\d+(?:\.\d+)+)/i.exec(raw + ' ' + full.slice(0, 2500)), ver = vm ? (vm[1] ? 'Build ' + vm[1] : 'v' + vm[2]) : '';
    const sp0 = req.min['Espacio'] || req.rec['Espacio'] || '', spm = /([\d.,]+\s*(?:GB|MB|TB))/i.exec(sp0), space = spm ? spm[1].toUpperCase() : sp0;
    const info = blocks.filter((b) => b.p.length && !/requirement/i.test(b.h) && !/^(download|how to|installation|steps)/i.test(b.h)).slice(0, 8);
    const shots = imgs.map((i) => i.currentSrc || i.src).filter((u, i, a) => u !== cover && a.indexOf(u) === i).slice(0, 8);
    return { title, cover, links, cats, date, info, shots, req, size, ver, space };
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reqCard = (t, o) => { const ks = Object.keys(o); return ks.length ? '<div class="rq"><h4>' + t + '</h4>' + ks.map((k) => '<div class="rw"><span>' + k + '</span><b>' + esc(o[k]) + '</b></div>').join('') + '</div>' : ''; };
  const mount = (d) => {
    const hostEl = document.createElement('div'); hostEl.id = 'wt-console';
    hostEl.style.cssText = 'position:fixed;inset:0;z-index:2147483000;display:block';
    const sh = hostEl.attachShadow({ mode: 'open' }), main = d.links[0], rest = d.links.slice(1);
    const stats = [['Tamaño', d.size], ['Espacio en disco', d.space], ['Versión', d.ver], ['Publicado', d.date]].filter((x) => x[1]);
    const reqHTML = reqCard('Mínimos', d.req.min) + reqCard('Recomendados', d.req.rec);
    sh.innerHTML = `<style>
      :host{all:initial}*{box-sizing:border-box}
      .w{position:absolute;inset:0;overflow:auto;color:#ececf3;font:15px/1.55 "Segoe UI",system-ui,sans-serif;background:radial-gradient(60% 45% at 18% 0%,rgba(255,255,255,.07),transparent 70%),radial-gradient(50% 40% at 88% 8%,rgba(255,255,255,.045),transparent 70%),#07060f;scroll-behavior:smooth;animation:fi .7s cubic-bezier(.22,1,.36,1) backwards}
      .w::-webkit-scrollbar{width:10px}.w::-webkit-scrollbar-thumb{background:#2a2a34;border-radius:10px}
      @keyframes fi{from{opacity:0}}@keyframes up{from{opacity:0;transform:translateY(20px)}}@keyframes pop{from{opacity:0;transform:translateY(26px) scale(.93) rotate(-2deg)}}@keyframes sl{from{opacity:0;transform:translateX(-16px)}}@keyframes dr{0%,100%{transform:scale(1.12) translate(0,0)}50%{transform:scale(1.18) translate(-1.5%,1%)}}@keyframes dn{from{opacity:0;transform:translateY(-120%) scale(.9)}}@keyframes wd{from{opacity:0;transform:translateY(.7em) rotate(2deg);filter:blur(10px)}}@keyframes rev{from{clip-path:inset(100% 0 0 0 round 22px);opacity:.2;transform:scale(1.08) translateY(30px)}}@keyframes tr{from{opacity:0;transform:translateX(34px)}}@keyframes tl{from{opacity:0;transform:translateX(-34px)}}@keyframes rp{from{transform:scale(0);opacity:.5}to{transform:scale(1);opacity:0}}@keyframes sh{from{transform:translateX(-120%) skewX(-18deg)}to{transform:translateX(260%) skewX(-18deg)}}@keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
      .bg{position:fixed;inset:-70px;background:center/cover;filter:blur(64px) brightness(.34) saturate(1.3);opacity:.9;animation:fi 1.4s ease backwards,dr 28s ease-in-out infinite;pointer-events:none}
      .top{position:sticky;top:0;z-index:5;display:flex;justify-content:space-between;align-items:center;padding:14px 28px;background:linear-gradient(180deg,rgba(7,6,15,.92),rgba(7,6,15,0))}
      .top a,.top button{font:600 13px "Segoe UI",system-ui;color:#c9cad6;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:99px;padding:8px 16px;cursor:pointer;text-decoration:none;transition:background .3s,color .3s,transform .4s cubic-bezier(.22,1,.36,1)}
      .top button:hover{background:rgba(255,255,255,.16);color:#fff;transform:translateY(-1px)}.top button:active{transform:scale(.96)}
      .mini{position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:9;display:none;align-items:center;gap:14px;padding:8px 10px 8px 8px;border-radius:99px;background:rgba(14,14,22,.92);border:1px solid rgba(255,255,255,.12);box-shadow:0 18px 50px rgba(0,0,0,.55)}.mini.on{display:flex;animation:dn .6s cubic-bezier(.34,1.5,.64,1)}
      .mini img{width:34px;height:34px;border-radius:50%;object-fit:cover}.mini b{font:700 14px "Segoe UI",system-ui;max-width:360px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mini a{font:700 13px "Segoe UI",system-ui;background:#f4f4f8;color:#0b0b13;border-radius:99px;padding:9px 18px;text-decoration:none;transition:transform .35s cubic-bezier(.22,1,.36,1)}.mini a:hover{transform:scale(1.05)}
      .hero{position:relative;display:grid;grid-template-columns:300px minmax(0,1fr);gap:46px;max-width:1180px;margin:6px auto 0;padding:10px 40px 30px}
      .cvw{perspective:900px;width:300px}.cv{position:relative;width:300px;aspect-ratio:2/3;border-radius:22px;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,.65),0 0 0 1px rgba(255,255,255,.12);animation:rev 1.15s .05s cubic-bezier(.22,1,.36,1) backwards,pop .9s .05s cubic-bezier(.34,1.4,.64,1) backwards;background:#14141c;transition:transform .5s cubic-bezier(.22,1,.36,1),box-shadow .5s;transform-style:preserve-3d;will-change:transform}
      .cv img{width:100%;height:100%;object-fit:cover;display:block}.cv i{position:absolute;inset:0;background:radial-gradient(60% 60% at var(--mx,50%) var(--my,30%),rgba(255,255,255,.22),transparent 65%);opacity:0;transition:opacity .4s;pointer-events:none}.cv:hover i{opacity:1}
      .inf{display:flex;flex-direction:column;gap:16px;min-width:0;justify-content:center}
.wd{display:inline-block;animation:wd 1s calc(.2s + var(--i) * .055s) cubic-bezier(.22,1,.36,1) backwards;margin-right:.26em}h1{animation:none!important}
      .inf>*{animation:up .9s cubic-bezier(.22,1,.36,1) backwards}.inf>*:nth-child(1){animation-delay:.12s}.inf>*:nth-child(2){animation-delay:.2s}.inf>*:nth-child(3){animation-delay:.28s}.inf>*:nth-child(4){animation-delay:.36s}
      .ch{display:flex;flex-wrap:wrap;gap:8px}.ch span{animation:up .7s calc(.3s + var(--j,0) * .06s) cubic-bezier(.34,1.4,.64,1) backwards;font-size:12.5px;padding:5px 13px;border-radius:99px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.08);color:#d4d5e0}
      h1{margin:0;font-size:40px;line-height:1.08;letter-spacing:-1px;text-shadow:0 4px 30px rgba(0,0,0,.6)}
      .st{display:flex;flex-wrap:wrap;gap:10px}.st div{animation:up .8s calc(.42s + var(--j,0) * .07s) cubic-bezier(.34,1.3,.64,1) backwards;padding:10px 16px;border-radius:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);min-width:112px;transition:transform .45s cubic-bezier(.22,1,.36,1),background .3s}.st div:hover{transform:translateY(-3px);background:rgba(255,255,255,.1)}.st small{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#8e90a0;font-weight:700}.st b{font-size:16px}
      .dl{display:flex;flex-direction:column;gap:10px;max-width:520px}
      .big{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:space-between;gap:16px;height:58px;padding:0 22px;border-radius:16px;background:#f4f4f8;color:#0b0b13;font:700 16px "Segoe UI",system-ui;text-decoration:none;box-shadow:0 14px 40px rgba(255,255,255,.12);transition:transform .45s cubic-bezier(.22,1,.36,1),box-shadow .45s,background .3s}
      .big:after{content:'';position:absolute;top:0;bottom:0;width:38%;left:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.75),transparent);transform:translateX(-120%) skewX(-18deg);pointer-events:none}.big:hover:after{animation:sh .9s cubic-bezier(.22,1,.36,1)}.rp{position:absolute;border-radius:50%;background:rgba(0,0,0,.18);pointer-events:none;animation:rp .7s cubic-bezier(.22,1,.36,1) forwards}
      .big:hover{transform:translateY(-3px);box-shadow:0 22px 50px rgba(255,255,255,.2);background:#fff}.big:active{transform:scale(.98)}.big small{font-weight:600;opacity:.6;font-size:12.5px}
      .alt{display:grid;gap:8px}.alt a{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:12px 18px;border-radius:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);color:#e8e8f0;text-decoration:none;font-weight:600;transition:background .3s,transform .5s cubic-bezier(.34,1.4,.64,1),border-color .3s;animation:sl .8s cubic-bezier(.34,1.3,.64,1) backwards}
      .alt a:hover{background:rgba(255,255,255,.13);transform:translateX(6px);border-color:rgba(255,255,255,.2)}.alt small{color:#9a9bad;font-weight:500;font-size:12.5px}
      .lbl{font-size:11.5px;letter-spacing:.2em;text-transform:uppercase;color:#8e90a0;font-weight:700;margin:4px 2px 0}
      .tabs{position:sticky;top:0;z-index:4;display:flex;gap:6px;max-width:1180px;margin:8px auto 0;padding:6px 40px 0;background:linear-gradient(180deg,rgba(7,6,15,.0),rgba(7,6,15,0))}.tb{position:relative;font:600 14px "Segoe UI",system-ui;color:#9d9eb0;background:none;border:0;padding:12px 20px;cursor:pointer;border-radius:12px;transition:color .3s,background .3s}.tb:hover{color:#fff;background:rgba(255,255,255,.05)}.tb.on{color:#fff}
      .ind{position:absolute;bottom:0;height:2px;background:#fff;border-radius:2px;transition:left .6s cubic-bezier(.34,1.4,.64,1),width .6s cubic-bezier(.34,1.4,.64,1)}
      .line{max-width:1180px;margin:0 auto;border-bottom:1px solid rgba(255,255,255,.08)}
      .pn{max-width:1180px;margin:0 auto;padding:26px 40px 90px;display:none}.pn.on{display:block;animation:up .65s cubic-bezier(.22,1,.36,1)}.pn.on.fr{animation:tr .6s cubic-bezier(.22,1,.36,1)}.pn.on.fl{animation:tl .6s cubic-bezier(.22,1,.36,1)}
      .rv{opacity:0;transform:translateY(26px) scale(.985);filter:blur(6px);transition:opacity .9s cubic-bezier(.22,1,.36,1),transform 1s cubic-bezier(.22,1,.36,1),filter .9s cubic-bezier(.22,1,.36,1)}.rv.in{opacity:1;transform:none;filter:none}
      .sec{transition:border-color .4s,background .4s,transform .5s cubic-bezier(.22,1,.36,1);background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:18px;padding:20px 24px;margin-bottom:14px}.sec.in:hover{border-color:rgba(255,255,255,.16);background:rgba(255,255,255,.055)}.sec h3{margin:0 0 10px;font-size:16px;color:#fff}.sec p{margin:0 0 8px;color:#c4c5d2}
      .rqs{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;margin-bottom:14px}.rq{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:18px;padding:18px 22px;transition:transform .45s cubic-bezier(.22,1,.36,1),background .3s}.rq:hover{transform:translateY(-3px);background:rgba(255,255,255,.06)}.rq h4{margin:0 0 10px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#8e90a0}.rw{display:grid;grid-template-columns:100px minmax(0,1fr);gap:12px;padding:7px 0;border-top:1px solid rgba(255,255,255,.06)}.rw:first-of-type{border-top:0}.rw span{color:#8e90a0;font-size:13.5px}.rw b{font-weight:600;color:#ececf3;font-size:14px}
      .gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px;margin-top:6px}.gal img{width:100%;border-radius:14px;display:block;cursor:zoom-in;transition:transform .55s cubic-bezier(.22,1,.36,1),box-shadow .45s}.gal img:hover{transform:translateY(-4px) scale(1.025);box-shadow:0 22px 44px rgba(0,0,0,.55)}
      .lb{position:fixed;inset:0;z-index:20;display:grid;place-items:center;background:rgba(4,4,8,.88);animation:fi .35s;cursor:zoom-out}.lb img{max-width:92vw;max-height:90vh;border-radius:14px;box-shadow:0 40px 100px rgba(0,0,0,.7);animation:pop .5s cubic-bezier(.22,1,.36,1)}
      .cm{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:18px;padding:22px 26px;color:#d6d7e2;min-height:120px}.empty{color:#8e90a0;padding:30px;text-align:center}
      @media (max-width:900px){.hero{grid-template-columns:1fr;justify-items:center}.cv,.cvw{width:220px}}
      @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.rv{opacity:1;transform:none}}
    </style>
    <div class="bg" style="background-image:url('${esc(d.cover)}')"></div>
    <div class="mini" id="mini"><img src="${esc(d.cover)}" alt=""><b>${esc(d.title)}</b><a href="${esc(main.href)}" target="_blank" rel="noopener">Descargar</a></div>
    <div class="w" id="w"><div class="top"><button id="back">‹ Volver</button><button id="orig">Ver página original</button></div>
      <div class="hero"><div class="cvw"><div class="cv" id="cv"><img src="${esc(d.cover)}" alt=""><i></i></div></div>
        <div class="inf"><div class="ch">${d.cats.map((c, i) => '<span style="--j:' + i + '">' + esc(c) + '</span>').join('')}</div>
          <h1>${d.title.split(' ').map((x, i) => '<span class="wd" style="--i:' + i + '">' + esc(x) + '</span>').join('')}</h1>
          ${stats.length ? '<div class="st">' + stats.map((x, i) => '<div style="--j:' + i + '"><small>' + x[0] + '</small><b>' + esc(x[1]) + '</b></div>').join('') + '</div>' : ''}
          <div class="dl"><a class="big" href="${esc(main.href)}" target="_blank" rel="noopener"><span>Descargar</span><small>${esc(main.name)}</small></a>
            ${rest.length ? '<div class="lbl">Más enlaces</div><div class="alt">' + rest.map((l, i) => '<a href="' + esc(l.href) + '" target="_blank" rel="noopener" style="animation-delay:' + (0.45 + i * 0.06) + 's"><span>' + esc(l.name) + '</span><small>' + (l.sub.toLowerCase() === l.name.toLowerCase() ? '' : esc(l.sub)) + '</small></a>').join('') + '</div>' : ''}</div></div></div>
      <div class="tabs" id="tabs"><button class="tb on" data-t="i">Información</button><button class="tb" data-t="c">Comentarios</button><span class="ind" id="ind"></span></div><div class="line"></div>
      <div class="pn on" id="p-i">${reqHTML ? '<div class="rqs rv">' + reqHTML + '</div>' : ''}${d.info.map((b) => '<div class="sec rv"><h3>' + esc(b.h) + '</h3>' + b.p.map((x) => '<p>' + esc(x) + '</p>').join('') + '</div>').join('') || (reqHTML ? '' : '<div class="empty">Sin descripción</div>')}${d.shots.length ? '<div class="sec rv"><h3>Capturas</h3><div class="gal">' + d.shots.map((u) => '<img loading="lazy" src="' + esc(u) + '" alt="">').join('') + '</div></div>' : ''}</div>
      <div class="pn" id="p-c"><div class="cm"><slot name="c"><div class="empty">No encontré comentarios en esta página</div></slot></div></div></div>`;
    const $ = (q) => sh.querySelector(q), ind = $('#ind'), w = $('#w');
    const place = (b) => { if (b) { ind.style.left = b.offsetLeft + 'px'; ind.style.width = b.offsetWidth + 'px'; } };
    const reveal = () => { const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { root: w, threshold: 0.08 }) : null; sh.querySelectorAll('.pn.on .rv:not(.in)').forEach((e, i) => { e.style.transitionDelay = Math.min(i, 5) * 70 + 'ms'; io ? io.observe(e) : e.classList.add('in'); }); };
    sh.querySelectorAll('.tb').forEach((b) => b.addEventListener('click', () => {
      const dirR = b.dataset.t === 'c'; sh.querySelectorAll('.tb').forEach((x) => x.classList.toggle('on', x === b)); sh.querySelectorAll('.pn').forEach((p) => { p.classList.remove('fr', 'fl'); const on = p.id === 'p-' + b.dataset.t; p.classList.toggle('on', on); if (on) { void p.offsetWidth; p.classList.add(dirR ? 'fr' : 'fl'); } }); place(b); reveal();
    }));
    // inclinación 3D de la portada que sigue al mouse + brillo
    const cv = $('#cv');
    cv.addEventListener('mousemove', (e) => { const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; cv.style.transition = 'transform .08s linear,box-shadow .5s'; cv.style.transform = 'rotateY(' + ((x - .5) * 12) + 'deg) rotateX(' + ((.5 - y) * 12) + 'deg) scale(1.02)'; cv.style.setProperty('--mx', x * 100 + '%'); cv.style.setProperty('--my', y * 100 + '%'); });
    cv.addEventListener('mouseleave', () => { cv.style.transition = 'transform .7s cubic-bezier(.22,1,.36,1),box-shadow .5s'; cv.style.transform = ''; });
    // botón principal: se atrae suavemente al mouse y hace ondas al apretarlo
    const big = $('.big');
    big.addEventListener('mousemove', (e) => { const r = big.getBoundingClientRect(); big.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .04) + 'px,' + (-3 + (e.clientY - r.top - r.height / 2) * .12) + 'px)'; });
    big.addEventListener('mouseleave', () => { big.style.transform = ''; });
    big.addEventListener('mousedown', (e) => { const r = big.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2, sp = document.createElement('span'); sp.className = 'rp'; sp.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px'; big.appendChild(sp); setTimeout(() => sp.remove(), 800); });
    // paralaje al bajar: la portada y el fondo se mueven a distinta velocidad
    const cvw = sh.querySelector('.cvw'), bgE = sh.querySelector('.bg'); let raf = 0;
    w.addEventListener('scroll', () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; const y = w.scrollTop; cvw.style.transform = 'translateY(' + Math.min(y * .18, 160) + 'px)'; bgE.style.transform = 'translateY(' + (-y * .06) + 'px)'; }); }, { passive: true });
    // barra compacta al bajar
    const mini = $('#mini'); w.addEventListener('scroll', () => mini.classList.toggle('on', w.scrollTop > 420), { passive: true });
    // capturas a pantalla completa
    sh.addEventListener('click', (e) => { const im = e.target; if (im.matches && im.matches('.gal img')) { const lb = document.createElement('div'); lb.className = 'lb'; lb.innerHTML = '<img src="' + im.src + '" alt="">'; sh.appendChild(lb); const big2 = lb.firstChild, a = im.getBoundingClientRect(); requestAnimationFrame(() => { const b2 = big2.getBoundingClientRect(); if (big2.animate && b2.width) big2.animate([{ transform: 'translate(' + (a.left - b2.left) + 'px,' + (a.top - b2.top) + 'px) scale(' + (a.width / b2.width) + ')', borderRadius: '8px' }, { transform: 'none' }], { duration: 550, easing: 'cubic-bezier(.22,1,.36,1)' }); }); big2.style.animation = 'none'; lb.onclick = () => { lb.style.transition = 'opacity .25s'; lb.style.opacity = 0; setTimeout(() => lb.remove(), 260); }; } });
    document.documentElement.classList.add('wt-console-on'); document.body.appendChild(hostEl);
    requestAnimationFrame(() => { place($('.tb.on')); reveal(); });
    $('#back').onclick = () => history.length > 1 ? history.back() : (location.href = '/');
    $('#orig').onclick = () => {
      hostEl.style.display = 'none'; document.documentElement.classList.remove('wt-console-on');
      const b = document.createElement('button'); b.textContent = 'Volver al menú';
      b.style.cssText = 'position:fixed;right:20px;bottom:20px;z-index:2147483001;padding:10px 18px;border-radius:99px;border:1px solid rgba(255,255,255,.2);background:#111;color:#fff;font:600 13px system-ui;cursor:pointer';
      b.onclick = () => { hostEl.style.display = 'block'; document.documentElement.classList.add('wt-console-on'); b.remove(); }; document.body.appendChild(b);
    };
    // comentarios: se mueve el bloque real (mismo sistema de la página, con todos sus comentarios) a la pestaña
    const grab = () => { const c = document.querySelector('#comments, .comments-area, #disqus_thread, .wpd-comm, #wpdcom'); if (c && !hostEl.contains(c)) { c.setAttribute('slot', 'c'); hostEl.appendChild(c); const n = c.querySelectorAll('.comment, .wpd-comment, li.comment').length; sh.querySelector('.tb[data-t=c]').textContent = n ? 'Comentarios (' + n + ')' : 'Comentarios'; place(sh.querySelector('.tb.on')); return true; } return false; };
    let tries = 0; if (!grab()) { const iv = setInterval(() => { if (grab() || ++tries > 24) clearInterval(iv); }, 500); }
    return hostEl;
  };
  let tries = 0; const go = () => { try { const d = build(); if (d) { mount(d); return; } } catch (e) {} if (++tries < 6) setTimeout(go, 1000); };
  if (!/free-download/i.test(location.pathname)) return; go();
}
const skinFor = (url) => { try { const h = new URL(url).hostname; return SKINS.find((s) => s.test.test(h)) || null; } catch (e) { return null; } };
module.exports = { SKINS, MONO_JS, skinFor, CONSOLE_JS: { steamrip: '(' + steamripConsole.toString() + ')()' } };
