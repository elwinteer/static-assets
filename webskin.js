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

// Página de juego de SteamRIP convertida en un menú tipo consola: portada, información, enlaces de descarga y comentarios en pestañas.
// Se ejecuta dentro de la página. Si no encuentra título + portada + enlaces, deja la página original intacta.
function steamripConsole() {
  if (window.__wtConsole) return; window.__wtConsole = 1;
  const HOSTS = { 'megadb.net': 'MegaDB', 'gofile.io': 'Gofile', '1fichier.com': '1Fichier', 'buzzheavier.com': 'BuzzHeavier', 'vikingfile.com': 'VikingFile', 'pixeldrain.com': 'Pixeldrain', 'mediafire.com': 'MediaFire', 'filecrypt.cc': 'FileCrypt', 'filecrypt.co': 'FileCrypt', 'datanodes.to': 'DataNodes', 'ddownload.com': 'DDownload', 'rapidgator.net': 'Rapidgator', 'drive.google.com': 'Google Drive', 'mega.nz': 'MEGA', 'qiwi.gg': 'Qiwi', 'workupload.com': 'Workupload', 'send.cm': 'Send.cm', 'uploadhaven.com': 'UploadHaven', 'turbobit.net': 'Turbobit' };
  const BAD = /(discord|facebook|twitter|x\.com|instagram|youtube|youtu\.be|t\.me|telegram|reddit|steampowered|patreon|ko-fi|paypal|store\.epicgames|gog\.com)/i;
  const clean = (t) => String(t || '').replace(/\s+/g, ' ').replace(/\s*[-–—|]?\s*free\s+download.*$/i, '').trim();
  const T = (n) => (n && n.textContent || '').replace(/\s+/g, ' ').trim();
  const host = (u) => { try { return new URL(u, location.href).hostname.replace(/^www\./, ''); } catch (e) { return ''; } };
  const build = () => {
    const h1 = document.querySelector('h1.entry-title, .entry-header h1, article h1, h1'); if (!h1) return 0;
    const title = clean(T(h1)); if (!title) return 0;
    const root = document.querySelector('.entry-content, .post-content, .post-entry, article .content, article') || document.body;
    // portada
    let cover = (document.querySelector('meta[property="og:image"]') || {}).content || '';
    const imgs = [...root.querySelectorAll('img')].filter((i) => (i.naturalWidth || i.width) >= 200 && !/logo|avatar|emoji|icon/i.test(i.src + i.className));
    if (!cover && imgs[0]) cover = imgs[0].currentSrc || imgs[0].src;
    if (!cover) return 0;
    // enlaces de descarga
    const seen = new Set(), links = [];
    for (const a of root.querySelectorAll('a[href]')) {
      const href = a.href; if (!href || seen.has(href) || /^javascript:|^#/.test(href) || href === location.href) continue;
      const hn = host(href), tx = T(a), mg = /^magnet:/i.test(href), tor = /\.torrent(\?|$)/i.test(href);
      if (BAD.test(hn)) continue;
      const known = Object.keys(HOSTS).find((k) => hn === k || hn.endsWith('.' + k));
      if (!(known || mg || tor || (/^(download|mirror|direct|link|torrent|magnet|click|here)/i.test(tx) && hn))) continue;
      seen.add(href);
      links.push({ href, name: mg || tor ? 'Torrent' : known ? HOSTS[known] : /steamrip/i.test(hn) ? (tx || 'Descarga') : hn.split('.').slice(-2, -1)[0].replace(/^./, (c) => c.toUpperCase()), sub: mg ? 'Enlace magnet' : tor ? 'Archivo .torrent' : (tx && tx.length < 40 ? tx : hn), mg: mg || tor });
    }
    if (!links.length) return 0;
    // información
    const cats = [...document.querySelectorAll('a[rel~=tag], a[rel~=category], .post-cat a, .meta-category a, .post-categories a')].map(T).filter((x, i, a) => x && a.indexOf(x) === i).slice(0, 6);
    const meta = []; const tm = document.querySelector('time'); if (tm) meta.push(T(tm));
    const blocks = []; let sec = null;
    for (const n of root.querySelectorAll('h2,h3,h4,p,li')) {
      if (n.closest('a') || n.closest('.wt-skip')) continue; const tx = T(n); if (!tx || tx.length < 3) continue;
      if (/^(h2|h3|h4)$/i.test(n.tagName)) { sec = { h: clean(tx), p: [] }; blocks.push(sec); continue; }
      if (links.some((l) => n.contains(n.querySelector('a[href="' + l.href.replace(/"/g, '') + '"]') || document.createElement('i'))) && tx.length < 80) continue;
      if (/^(download|mirror|link|click|password|how to install|join discord)/i.test(tx) && tx.length < 90) continue;
      if (!sec) { sec = { h: 'Acerca del juego', p: [] }; blocks.push(sec); } if (sec.p.length < 24) sec.p.push(tx);
    }
    const info = blocks.filter((b) => b.p.length).slice(0, 8);
    const shots = imgs.map((i) => i.currentSrc || i.src).filter((u, i, a) => u !== cover && a.indexOf(u) === i).slice(0, 8);
    return { title, cover, links, cats, meta, info, shots };
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const mount = (d) => {
    const host = document.createElement('div'); host.id = 'wt-console';
    host.style.cssText = 'position:fixed;inset:0;z-index:2147483000;display:block';
    const sh = host.attachShadow({ mode: 'open' }), main = d.links[0], rest = d.links.slice(1);
    sh.innerHTML = `<style>
      :host{all:initial}*{box-sizing:border-box}
      .w{position:absolute;inset:0;overflow:auto;color:#ececf3;font:15px/1.55 "Segoe UI",system-ui,sans-serif;background:radial-gradient(60% 45% at 18% 0%,rgba(255,255,255,.07),transparent 70%),radial-gradient(50% 40% at 88% 8%,rgba(255,255,255,.045),transparent 70%),#07060f;scroll-behavior:smooth;animation:fi .6s cubic-bezier(.22,1,.36,1) backwards}
      .w::-webkit-scrollbar{width:10px}.w::-webkit-scrollbar-thumb{background:#2a2a34;border-radius:10px}
      @keyframes fi{from{opacity:0}}@keyframes up{from{opacity:0;transform:translateY(18px)}}@keyframes pop{from{opacity:0;transform:translateY(22px) scale(.94) rotate(-1.5deg)}}@keyframes sl{from{opacity:0;transform:translateX(-14px)}}
      .bg{position:fixed;inset:-60px;background:center/cover;filter:blur(60px) brightness(.35) saturate(1.3);transform:scale(1.1);opacity:.85;animation:fi 1.2s ease backwards}
      .top{position:sticky;top:0;z-index:5;display:flex;justify-content:space-between;align-items:center;padding:14px 28px;background:linear-gradient(180deg,rgba(7,6,15,.9),rgba(7,6,15,0))}
      .top a,.top button{font:600 13px "Segoe UI",system-ui;color:#c9cad6;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:99px;padding:8px 16px;cursor:pointer;text-decoration:none;transition:background .3s,color .3s,transform .35s cubic-bezier(.22,1,.36,1)}
      .top a:hover,.top button:hover{background:rgba(255,255,255,.16);color:#fff;transform:translateY(-1px)}
      .hero{position:relative;display:grid;grid-template-columns:300px minmax(0,1fr);gap:44px;max-width:1180px;margin:10px auto 0;padding:10px 40px 30px}
      .cv{position:relative;width:300px;aspect-ratio:2/3;border-radius:22px;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,.65),0 0 0 1px rgba(255,255,255,.12);animation:pop .9s .1s cubic-bezier(.22,1,.36,1) backwards;background:#14141c}
      .cv img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 1.2s cubic-bezier(.22,1,.36,1)}.cv:hover img{transform:scale(1.05)}
      .inf{display:flex;flex-direction:column;gap:16px;min-width:0;justify-content:center}
      .inf>*{animation:up .8s cubic-bezier(.22,1,.36,1) backwards}.inf>*:nth-child(1){animation-delay:.12s}.inf>*:nth-child(2){animation-delay:.2s}.inf>*:nth-child(3){animation-delay:.28s}.inf>*:nth-child(4){animation-delay:.36s}
      .ch{display:flex;flex-wrap:wrap;gap:8px}.ch span{font-size:12.5px;padding:5px 13px;border-radius:99px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.08);color:#d4d5e0}
      h1{margin:0;font-size:40px;line-height:1.08;letter-spacing:-1px;text-shadow:0 4px 30px rgba(0,0,0,.6)}
      .dl{display:flex;flex-direction:column;gap:10px;max-width:520px}
      .big{display:flex;align-items:center;justify-content:space-between;gap:16px;height:58px;padding:0 22px;border-radius:16px;background:#f4f4f8;color:#0b0b13;font:700 16px "Segoe UI",system-ui;text-decoration:none;box-shadow:0 14px 40px rgba(255,255,255,.12);transition:transform .4s cubic-bezier(.22,1,.36,1),box-shadow .4s,background .3s}
      .big:hover{transform:translateY(-3px);box-shadow:0 22px 50px rgba(255,255,255,.2);background:#fff}.big:active{transform:scale(.98)}.big small{font-weight:600;opacity:.6;font-size:12.5px}
      .alt{display:grid;gap:8px}.alt a{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:12px 18px;border-radius:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);color:#e8e8f0;text-decoration:none;font-weight:600;transition:background .3s,transform .4s cubic-bezier(.22,1,.36,1),border-color .3s;animation:sl .6s backwards}
      .alt a:hover{background:rgba(255,255,255,.13);transform:translateX(5px);border-color:rgba(255,255,255,.2)}.alt small{color:#9a9bad;font-weight:500;font-size:12.5px}
      .lbl{font-size:11.5px;letter-spacing:.2em;text-transform:uppercase;color:#8e90a0;font-weight:700;margin:4px 2px 0}
      .tabs{position:relative;display:flex;gap:6px;max-width:1180px;margin:8px auto 0;padding:0 40px}.tb{position:relative;font:600 14px "Segoe UI",system-ui;color:#9d9eb0;background:none;border:0;padding:12px 20px;cursor:pointer;border-radius:12px;transition:color .3s,background .3s}.tb:hover{color:#fff;background:rgba(255,255,255,.05)}.tb.on{color:#fff}
      .ind{position:absolute;bottom:0;height:2px;background:#fff;border-radius:2px;transition:left .5s cubic-bezier(.22,1,.36,1),width .5s cubic-bezier(.22,1,.36,1)}
      .line{max-width:1180px;margin:0 auto;border-bottom:1px solid rgba(255,255,255,.08)}
      .pn{max-width:1180px;margin:0 auto;padding:26px 40px 80px;display:none}.pn.on{display:block;animation:up .6s cubic-bezier(.22,1,.36,1)}
      .sec{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:18px;padding:20px 24px;margin-bottom:14px}.sec h3{margin:0 0 10px;font-size:16px;color:#fff}.sec p{margin:0 0 8px;color:#c4c5d2}
      .gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px;margin-top:6px}.gal img{width:100%;border-radius:14px;display:block;transition:transform .5s cubic-bezier(.22,1,.36,1),box-shadow .4s}.gal img:hover{transform:translateY(-4px) scale(1.02);box-shadow:0 20px 40px rgba(0,0,0,.5)}
      ::slotted(*){max-width:100%}.cm{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:18px;padding:20px 24px;color:#d6d7e2}
      .empty{color:#8e90a0;padding:30px;text-align:center}
      @media (max-width:900px){.hero{grid-template-columns:1fr;justify-items:center}.cv{width:220px}}
      @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
    </style>
    <div class="bg" style="background-image:url('${esc(d.cover)}')"></div>
    <div class="w"><div class="top"><button id="back">‹ Volver</button><button id="orig">Ver página original</button></div>
      <div class="hero"><div class="cv"><img src="${esc(d.cover)}" alt=""></div>
        <div class="inf"><div class="ch">${d.cats.map((c) => '<span>' + esc(c) + '</span>').join('')}${d.meta.map((c) => '<span>' + esc(c) + '</span>').join('')}</div>
          <h1>${esc(d.title)}</h1>
          <div class="dl"><a class="big" href="${esc(main.href)}" target="_blank" rel="noopener"><span>Descargar</span><small>${esc(main.name)}</small></a>
            ${rest.length ? '<div class="lbl">Más enlaces</div><div class="alt">' + rest.map((l, i) => '<a href="' + esc(l.href) + '" target="_blank" rel="noopener" style="animation-delay:' + (0.45 + i * 0.05) + 's"><span>' + esc(l.name) + '</span><small>' + (l.sub.toLowerCase() === l.name.toLowerCase() ? '' : esc(l.sub)) + '</small></a>').join('') + '</div>' : ''}</div></div></div>
      <div class="tabs" id="tabs"><button class="tb on" data-t="i">Información</button><button class="tb" data-t="c">Comentarios</button><span class="ind" id="ind"></span></div><div class="line"></div>
      <div class="pn on" id="p-i">${d.info.map((b) => '<div class="sec"><h3>' + esc(b.h) + '</h3>' + b.p.map((x) => '<p>' + esc(x) + '</p>').join('') + '</div>').join('') || '<div class="empty">Sin descripción</div>'}${d.shots.length ? '<div class="sec"><h3>Capturas</h3><div class="gal">' + d.shots.map((u) => '<img loading="lazy" src="' + esc(u) + '" alt="">').join('') + '</div></div>' : ''}</div>
      <div class="pn" id="p-c"><div class="cm"><slot name="c"><div class="empty">No encontré comentarios en esta página</div></slot></div></div></div>`;
    const $ = (q) => sh.querySelector(q), ind = $('#ind');
    const place = (b) => { ind.style.left = b.offsetLeft + 'px'; ind.style.width = b.offsetWidth + 'px'; };
    sh.querySelectorAll('.tb').forEach((b) => b.addEventListener('click', () => {
      sh.querySelectorAll('.tb').forEach((x) => x.classList.toggle('on', x === b)); sh.querySelectorAll('.pn').forEach((p) => p.classList.toggle('on', p.id === 'p-' + b.dataset.t)); place(b);
    }));
    document.documentElement.classList.add('wt-console-on'); document.body.appendChild(host);
    requestAnimationFrame(() => place($('.tb.on')));
    $('#back').onclick = () => history.length > 1 ? history.back() : (location.href = '/');
    $('#orig').onclick = () => {
      host.style.display = 'none'; document.documentElement.classList.remove('wt-console-on');
      const b = document.createElement('button'); b.textContent = 'Volver al menú';
      b.style.cssText = 'position:fixed;right:20px;bottom:20px;z-index:2147483001;padding:10px 18px;border-radius:99px;border:1px solid rgba(255,255,255,.2);background:#111;color:#fff;font:600 13px system-ui;cursor:pointer';
      b.onclick = () => { host.style.display = 'block'; document.documentElement.classList.add('wt-console-on'); b.remove(); }; document.body.appendChild(b);
    };
    // comentarios: se mueve el bloque real (conserva sus scripts) y se muestra dentro de la pestaña
    const grab = () => { const c = document.querySelector('#comments, .comments-area, #disqus_thread, #respond, .wpd-comm'); if (c && !host.contains(c)) { c.setAttribute('slot', 'c'); host.appendChild(c); const n = c.querySelectorAll('.comment, .wpd-comment, li.comment').length; const tb = sh.querySelector('.tb[data-t=c]'); tb.textContent = n ? 'Comentarios (' + n + ')' : 'Comentarios'; place(sh.querySelector('.tb.on')); return true; } return false; };
    let tries = 0; if (!grab()) { const iv = setInterval(() => { if (grab() || ++tries > 20) clearInterval(iv); }, 500); }
    return host;
  };
  let tries = 0; const go = () => { try { const d = build(); if (d) { mount(d); return; } } catch (e) {} if (++tries < 6) setTimeout(go, 1000); };
  if (!/free-download/i.test(location.pathname)) return; go();
}
const skinFor = (url) => { try { const h = new URL(url).hostname; return SKINS.find((s) => s.test.test(h)) || null; } catch (e) { return null; } };
module.exports = { SKINS, MONO_JS, skinFor, CONSOLE_JS: { steamrip: '(' + steamripConsole.toString() + ')()' } };
