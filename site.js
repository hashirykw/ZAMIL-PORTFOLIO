/* Shared behaviour for every page: smooth scroll, nav, selection boxes,
   reveals, the marquee, streak dividers, polaroids and deep links.
   Nothing here hides text: only frames, images and decorations move. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
root.classList.remove('no-js');
root.classList.add('js');

/* ── smooth wheel scrolling (touch stays native) ── */
let lenis = null;
function startLenis(){
  if(reduce || !window.Lenis || lenis) return;
  lenis = new window.Lenis({ autoRaf:true, duration:1.1, easing:t => 1 - Math.pow(1 - t, 3.4), smoothWheel:true, syncTouch:false });
  lenis.on('scroll', e => onScroll(e.velocity || 0));
  window.__lenis = lenis;
}
if(window.Lenis) startLenis(); else addEventListener('load', startLenis);

const goTo = (el, instant) => {
  if(!el) return;
  const y = el.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(root).scrollPaddingTop) || 0);
  if(lenis && !instant) lenis.scrollTo(y, { duration:1.3 });
  else scrollTo({ top:y, behavior: instant || reduce ? 'auto' : 'smooth' });
};
window.__goTo = goTo;

/* in-page anchors go through Lenis so the easing matches */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"], a[href^="/#"]');
  if(!a) return;
  const href = a.getAttribute('href').replace(/^\//, '');
  if(href.length < 2) return;
  if(a.getAttribute('href').startsWith('/#') && location.pathname !== '/' && !/\/index(\.html)?$/.test(location.pathname)) return;
  const el = document.getElementById(href.slice(1));
  if(!el) return;
  e.preventDefault();
  closeSheet();
  goTo(el);
  history.replaceState(null, '', href);
});

/* ── nav: floating slab after the first screen, sheet on phones ── */
const float = $('.float'), sheet = $('#menu');
const heroEnd = () => (($('.hero, .phero') || {}).offsetHeight || innerHeight) * .7;
function openSheet(){ if(!sheet) return; sheet.classList.add('is-open'); sheet.removeAttribute('inert'); $$('[data-menu]').forEach(b => b.setAttribute('aria-expanded', 'true')); lenis && lenis.stop(); setTimeout(() => ($('a', sheet) || sheet).focus({ preventScroll:true }), 60); }
function closeSheet(){ if(!sheet || !sheet.classList.contains('is-open')) return; sheet.classList.remove('is-open'); sheet.setAttribute('inert', ''); $$('[data-menu]').forEach(b => b.setAttribute('aria-expanded', 'false')); lenis && lenis.start(); }
$$('[data-menu]').forEach(b => b.addEventListener('click', openSheet));
$$('[data-menu-close]').forEach(b => b.addEventListener('click', closeSheet));
addEventListener('keydown', e => { if(e.key === 'Escape') closeSheet(); });

/* ── scroll-driven bits ── */
const marquees = $$('.marquee__track').map(el => {
  const a = el.getAnimations ? el.getAnimations()[0] : null;
  return { el, a, rate:1 };
});
const streaks = $$('.streak');
let lastY = scrollY, lastT = performance.now(), vel = 0, ticking = false;
function onScroll(lv){
  if(typeof lv === 'number' && lv) vel = lv;
  if(ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const now = performance.now(), y = scrollY;
    if(!lenis){ vel = (y - lastY) / Math.max(16, now - lastT) * 16; }
    lastY = y; lastT = now;
    if(float) float.classList.toggle('is-on', y > heroEnd());
    if(!reduce){
      const vh = innerHeight;
      for(const s of streaks){
        const r = s.getBoundingClientRect();
        if(r.bottom < -50 || r.top > vh + 50) continue;
        const p = (vh - r.top) / (vh + r.height);           // 0 → 1 while it crosses the screen
        s.style.setProperty('--sx', `${(0.5 - p) * 46 * (s.dataset.dir === 'r' ? -1 : 1)}%`);
      }
    }
  });
}
addEventListener('scroll', () => onScroll(), { passive:true });
addEventListener('resize', () => onScroll(), { passive:true });

/* the marquee drifts on its own and speeds up with scroll velocity */
if(!reduce && marquees.length){
  const loop = () => {
    const target = 1 + Math.min(6, Math.abs(vel) * .45);
    for(const m of marquees){
      if(!m.a) continue;
      m.rate += (target - m.rate) * .08;
      m.a.playbackRate = m.rate;
    }
    vel *= .9;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

/* ── selection boxes: frame draws, handles pop, then images reveal ── */
$$('[data-sel]').forEach(el => {
  el.classList.add('sel');
  const f = document.createElement('span');
  f.className = 'sel__f'; f.setAttribute('aria-hidden', 'true');
  f.innerHTML = Array.from({ length:8 }, (_, i) => `<i style="--i:${i}"></i>`).join('');
  el.appendChild(f);
});
const io = new IntersectionObserver(es => es.forEach(e => {
  if(!e.isIntersecting) return;
  e.target.classList.add('is-on');
  io.unobserve(e.target);
}), { threshold:.25, rootMargin:'0px 0px -6% 0px' });
$$('.tk-grid').forEach(g => [...g.children].forEach((t, i) => t.style.setProperty('--i', i)));
$$('.sel, .polaroid, [data-in], [data-reveal], .tk-grid').forEach(el => io.observe(el));

/* ── deep links: /work, /reels, /contact … land on their section ── */
const PATHS = { services:'services', reels:'reels', design:'design', work:'work', experience:'route', contact:'contact', about:'about' };
function landOnSection(){
  const h = (location.hash || '').replace(/^#(s-)?/, '').toLowerCase();
  const p = (location.pathname || '/').replace(/^\/+|\/+$/g, '').toLowerCase();
  const id = (h && (PATHS[h] || h)) || PATHS[p];
  const el = id && document.getElementById(id);
  if(el) requestAnimationFrame(() => goTo(el, true));
}
if(document.readyState === 'complete') landOnSection(); else addEventListener('load', landOnSection);
addEventListener('hashchange', landOnSection);

$$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
onScroll();
})();

/* ═════════ theme switch (light is the default) ═════════ */
(() => {
  const $$ = (q, r = document) => [...r.querySelectorAll(q)];
  const root = document.documentElement;
  const SUN = '<svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const MOON = '<svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/></svg>';
  const label = () => root.dataset.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  const btns = [];
  $$('.top .wrap, .float, .sheet__top').forEach(host => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'theme-btn'; b.innerHTML = SUN + MOON; b.setAttribute('aria-label', label());
    const ref = host.matches('.top .wrap') ? host.querySelector(':scope > .menu-btn') : host.querySelector('.cta-nav, .menu-btn, .sheet__close');
    host.insertBefore(b, ref || null); btns.push(b);
  });
  const meta = document.querySelector('meta[name="theme-color"]'), metaLight = meta ? meta.content : '';
  function set(t){
    root.classList.add('theme-swap');
    root.dataset.theme = t;
    try { localStorage.setItem('hm-theme', t); } catch(e){}
    if(meta) meta.content = t === 'dark' ? '#1c1b19' : metaLight;
    btns.forEach(b => b.setAttribute('aria-label', label()));
    setTimeout(() => root.classList.remove('theme-swap'), 500);
  }
  btns.forEach(b => b.addEventListener('click', () => set(root.dataset.theme === 'dark' ? 'light' : 'dark')));
})();

/* ═════════ cookie notice (the site only keeps your theme and this choice in your browser) ═════════ */
(() => {
  let seen = null; try { seen = localStorage.getItem('hm-cookies'); } catch(e){}
  if(seen) return;
  const c = document.createElement('div');
  c.className = 'cookie'; c.setAttribute('role', 'region'); c.setAttribute('aria-label', 'Cookie notice');
  c.innerHTML = `<b><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#g-burst"/></svg>Cookies, quickly</b>
    <p>This site only stores your theme and this choice in your browser. Nothing is sold or shared.</p>
    <div class="cookie__row"><button type="button" class="cookie__ok">Accept</button><button type="button" class="cookie__no">Essential only</button></div>`;
  document.body.appendChild(c);
  setTimeout(() => c.classList.add('is-on'), 1400);
  const done = v => { try { localStorage.setItem('hm-cookies', v); } catch(e){} c.classList.remove('is-on'); setTimeout(() => c.remove(), 700); };
  c.querySelector('.cookie__ok').onclick = () => done('all');
  c.querySelector('.cookie__no').onclick = () => done('essential');
})();

/* ═════════ chat assistant: answers the common questions, hands real conversations to WhatsApp ═════════ */
(() => {
  const C = (window.PORTFOLIO_CONFIG || {});
  const contact = C.contact || {};
  const WA = (contact.whatsapp || '923337799953').replace(/\D/g, '');
  const wa = (text) => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
  const CHIPS = ['Video editing','Shooting & directing','Social media','AI UGC','Show me your work','Start a project'];

  const fab = document.createElement('button');
  fab.type = 'button'; fab.className = 'chat-fab'; fab.setAttribute('aria-label', 'Chat with Zamil AI'); fab.setAttribute('aria-expanded', 'false');
  fab.innerHTML = `<span class="chat-fab__me" aria-hidden="true"><i></i><img src="/nexlyr-logo.svg" alt="" width="631" height="1011"></span><span class="chat-fab__txt"><b>Zamil AI <em>●</em></b><small>Ask me anything</small></span><span class="chat-fab__go" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 17 17 7M8.5 7H17v8.5"/></svg></span>`;
  const box = document.createElement('section');
  box.className = 'chat'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Chat with Zamil AI');
  box.innerHTML = `<header class="chat__head"><span class="chat-fab__me chat-fab__me--sm" aria-hidden="true"><i></i><img src="/nexlyr-logo.svg" alt="" width="631" height="1011"></span><div><b>Zamil AI</b><small>Assistant · online now</small></div>
      <button class="chat__x" type="button" aria-label="Close chat"><svg viewBox="0 0 24 24"><path d="m6.5 6.5 11 11M17.5 6.5l-11 11"/></svg></button></header>
    <div class="chat__log" aria-live="polite"></div>
    <div class="chat__chips"></div>
    <form class="chat__form"><input name="q" autocomplete="off" placeholder="Type a question..." aria-label="Your message" maxlength="300"><button type="submit" aria-label="Send"><svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></svg></button></form>`;
  document.body.append(fab, box);
  const log = box.querySelector('.chat__log'), input = box.querySelector('input'), chipsEl = box.querySelector('.chat__chips');
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
  const add = (html, who) => { const m = document.createElement('div'); m.className = 'msg msg--' + who; m.innerHTML = html; log.appendChild(m); return m; };
  const setChips = list => { chipsEl.innerHTML = (list && list.length ? list : CHIPS).map(t => `<button type="button">${esc(t)}</button>`).join(''); chipsEl.scrollLeft = 0; };
  const save = () => { try { sessionStorage.setItem('zm-chat', JSON.stringify({ log:log.innerHTML, chips:[...chipsEl.children].map(b => b.textContent) })); } catch(e){} };

  // the knowledge base lives in its own file and only loads when someone opens the chat
  let brain;
  const loadBrain = () => brain || (brain = new Promise(res => {
    if(window.ZamilAI) return res(window.ZamilAI);
    const sc = document.createElement('script'); sc.src = '/assistant.js?v=1'; sc.async = true;
    sc.onload = () => res(window.ZamilAI); sc.onerror = () => res(null);
    document.head.appendChild(sc);
  }));
  let busy = false;
  async function respond(q){
    busy = true;
    const t = add('<i></i><i></i><i></i>', 'bot'); t.classList.add('msg--typing'); t.setAttribute('aria-label', 'Zamil AI is typing');
    t.scrollIntoView({ block:'end', behavior:'smooth' });
    const AI = await loadBrain();
    const r = AI ? AI.answer(q) : { html:`I couldn't load my notes just now. Zamil can answer directly: <a class="msg-cta" href="https://wa.me/${WA}?text=${encodeURIComponent('Hi Zamil, ' + q)}" target="_blank" rel="noopener">Message on WhatsApp ↗</a>`, chips:[] };
    const words = r.html.replace(/<[^>]+>/g, ' ').split(/\s+/).length;
    const wait = matchMedia('(prefers-reduced-motion: reduce)').matches ? 150 : Math.min(1500, 380 + words * 9);
    setTimeout(() => {
      t.remove();
      const m = add(r.html, 'bot');
      setChips(r.chips); busy = false; save();
      // long answers: show their start, not their end
      log.scrollTo({ top:Math.max(0, m.offsetTop - 12), behavior:'smooth' });
    }, wait);
  }
  function ask(text){
    if(busy) return;
    add(esc(text), 'me'); save();
    respond(text);
  }
  let opened = false;
  const open = v => {
    box.classList.toggle('is-open', v); fab.classList.toggle('is-open', v); fab.setAttribute('aria-expanded', String(v));
    if(v && !opened){
      opened = true;
      let past = null; try { past = JSON.parse(sessionStorage.getItem('zm-chat') || 'null'); } catch(e){}
      if(past && past.log){ log.innerHTML = past.log; setChips(past.chips); log.scrollTop = log.scrollHeight; loadBrain(); }
      else { setChips(); respond('hi'); }
    }
    if(v) setTimeout(() => input.focus({ preventScroll:true }), 300);
  };
  // warm the file up when the visitor shows intent, so the first answer is instant
  fab.addEventListener('pointerenter', loadBrain, { once:true });
  fab.addEventListener('click', () => open(true));
  box.querySelector('.chat__x').addEventListener('click', () => { open(false); fab.focus(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && box.classList.contains('is-open')) open(false); });
  chipsEl.addEventListener('click', e => { const b = e.target.closest('button'); if(b) ask(b.textContent); });
  box.querySelector('form').addEventListener('submit', e => { e.preventDefault(); const q = input.value.trim(); if(!q || busy) return; input.value = ''; ask(q); });
  // keep the cookie notice and the chat button from overlapping on small screens
  const fixCookie = () => { const ck = document.querySelector('.cookie'); if(ck && innerWidth < 560) ck.style.bottom = 'calc(max(.75rem, env(safe-area-inset-bottom)) + 4.4rem)'; };
  setTimeout(fixCookie, 1500);
})();
