/* Home page data: the work index (Live / Demos / Software + categories), logos,
   experience, reels, designs, the media viewer, Supabase (admin content and the
   contact form). The markup in index.html is a pre-rendered copy of exactly what
   this script draws, so crawlers and the first paint see the content. */
(() => {
'use strict';
const CFG = window.PORTFOLIO_CONFIG || {};
const FB = CFG.fallback || {};
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const safeLink = u => /^https?:\/\//i.test(u || '') ? u : null;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8.5 7H17v8.5"/></svg>';

/* ── contact links ── */
const contact = Object.assign({ site:'https://nexlyr.solutions', linkedin:'https://www.linkedin.com/in/zamil-shaikh-6154ba41a',
  instagram:'https://www.instagram.com/zamil_fr', email:'zamilshaikh700@gmail.com', whatsapp:'923337799953' }, CFG.contact || {});
function applyContact(c){
  if(c.site) $$('[data-site]').forEach(a => a.href = c.site);
  if(c.linkedin) $$('[data-linkedin]').forEach(a => a.href = c.linkedin);
  if(c.email) $$('[data-email]').forEach(a => a.href = 'mailto:' + c.email);
  if(c.instagram) $$('[data-instagram]').forEach(a => a.href = c.instagram);
  if(c.whatsapp){
    const n = String(c.whatsapp).replace(/\D/g, '');
    $$('[data-whatsapp]').forEach(a => a.href = `https://wa.me/${n}?text=${encodeURIComponent('Hi Zamil, I found your portfolio.')}`);
    $$('[data-nexlyr-wa]').forEach(a => a.href = `https://wa.me/${n}?text=${encodeURIComponent('Hi Nexlyr! I saw Zamil Shaikh\'s portfolio and I\'d like to talk about a project.')}`);
  }
}
applyContact(contact);

/* ── icons for projects without a logo ── */
const ICON = {
  code:'<path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.5 6l-3 12"/>',
  chart:'<path d="M4 20V13l4.5-3.5 4 3L20 6M14.5 6H20v5.5M4 20h16"/>',
  book:'<path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5Zm0 0v13"/>',
  paw:'<circle cx="7" cy="9" r="1.8"/><circle cx="17" cy="9" r="1.8"/><circle cx="10" cy="5.5" r="1.7"/><circle cx="14" cy="5.5" r="1.7"/><path d="M12 12c-3 0-6 3.4-6 6 0 1.5 1.3 2 3 2 1.2 0 2-.5 3-.5s1.8.5 3 .5c1.7 0 3-.5 3-2 0-2.6-3-6-6-6Z"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.8a3.3 3.3 0 0 1 0 6.4M18 14a6 6 0 0 1 3.5 5.6"/>',
  megaphone:'<path d="M3.5 9.5v4.5a2 2 0 0 0 2 2h1.8l8.7 4.6V4.4L7.3 9.5Z"/><path d="M19 9.6a3.6 3.6 0 0 1 0 4.8"/>',
  pen:'<path d="M12 2.6 4.6 13.4 12 21.4l7.4-8Z"/><path d="M12 2.6v18.8"/>',
  bag:'<path d="M4.2 7.8h15.6l-1.2 12.4H5.4Z"/><path d="M8.6 10.6V6.8a3.4 3.4 0 0 1 6.8 0v3.8"/>',
  camera:'<path d="M4 8h3.2l1.6-2.4h6.4L16.8 8H20v11H4Z"/><circle cx="12" cy="13.2" r="3.4"/>',
  heart:'<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z"/>',
  film:'<rect x="3" y="6" width="18" height="13" rx="1"/><path d="M3 10h18M8 6v13M16 6v13"/>'
};
const logoBox = (item, cls) => {
  const dark = item.logoBg === 'dark' ? ' dark' : '';
  if(item.logo) return `<span class="${cls}${dark}"><img src="${esc(item.logo)}" alt="" loading="lazy" decoding="async" width="52" height="52"></span>`;
  const ic = ICON[item.icon] || ICON.code;
  return `<span class="${cls}"><svg viewBox="0 0 24 24" aria-hidden="true">${ic}</svg></span>`;
};
const host = u => String(u || '').replace(/^https?:\/\//, '').replace(/\/$/, '');

/* ── work index ── */
const CAT_ORDER = ['Education', 'Fitness & martial arts', 'Food & cafés', 'Business & services'];
const SHOW = 12;
let projects = [], workGroup = 'live', workCat = 'all';
const groupOf = p => p.group || (p.featured === false ? 'demo' : 'live');
const inGroup = g => projects.filter(p => groupOf(p) === g || (g === 'live' && p.alsoLive));
function paintTabs(){
  $$('#filters button').forEach(b => {
    const n = inGroup(b.dataset.f).length;
    const i = b.querySelector('i'); if(i) i.textContent = String(n).padStart(2, '0');
    b.hidden = !n && b.dataset.f !== 'live';
    b.classList.toggle('on', b.dataset.f === workGroup);
    b.setAttribute('aria-pressed', b.dataset.f === workGroup);
  });
}
function paintCats(list){
  const box = $('#cats'), counts = {};
  list.forEach(p => { if(p.cat) counts[p.cat] = (counts[p.cat] || 0) + 1; });
  const cats = Object.keys(counts).sort((a, b) => (CAT_ORDER.indexOf(a) + 1 || 99) - (CAT_ORDER.indexOf(b) + 1 || 99));
  if(workCat !== 'all' && !counts[workCat]) workCat = 'all';
  box.hidden = cats.length < 2;
  box.innerHTML = [['all', 'All', list.length], ...cats.map(c => [c, c, counts[c]])].map(([k, label, n]) =>
    `<button type="button" data-cat="${esc(k)}" class="${k === workCat ? 'on' : ''}" aria-pressed="${k === workCat}">${esc(label)}<i>${n}</i></button>`).join('');
}
function paintWork(){
  const all = inGroup(workGroup);
  paintTabs(); paintCats(all);
  const list = workCat === 'all' ? all : all.filter(p => p.cat === workCat);
  const rows = $('#workRows');
  rows.classList.remove('show-all');
  rows.innerHTML = list.map((p, i) => {
    const href = safeLink(p.link);
    return `<article class="row${i >= SHOW ? ' is-more' : ''}">
      <span class="row__no num">${String(i + 1).padStart(2, '0')}</span>
      ${logoBox(p, 'row__logo')}
      <div class="row__name"><b>${esc(p.name)}</b><small>${esc(p.type || 'Project')}</small></div>
      <p class="row__desc">${esc(p.description)}</p>
      <div class="row__go">${href ? `<a href="${esc(href)}" target="_blank" rel="noopener" aria-label="Visit ${esc(p.name)}"><span>${esc(p.url || host(href))}</span>${ARROW}</a>` : ''}</div>
    </article>`;
  }).join('') || '<p class="row__desc" style="padding:1.5rem 0">Nothing in this group yet.</p>';
  const more = $('#workMore');
  more.hidden = list.length <= SHOW;
  more.querySelector('button').textContent = `Show all ${list.length}`;
}
$('#filters').addEventListener('click', e => {
  const b = e.target.closest('button[data-f]');
  if(!b || b.dataset.f === workGroup) return;
  workGroup = b.dataset.f; workCat = 'all';
  paintWork();
});
$('#cats').addEventListener('click', e => {
  const b = e.target.closest('button[data-cat]');
  if(!b || b.dataset.cat === workCat) return;
  workCat = b.dataset.cat;
  paintWork();
});
$('#workMore button').addEventListener('click', () => {
  $('#workRows').classList.add('show-all');
  $('#workMore').hidden = true;
});

/* ── logos on cream tiles (every project that has a logo) ── */
function paintLogos(){
  if(!$('#logoGrid')) return;
  const seen = new Set();
  const list = projects.filter(p => p.logo && !seen.has(p.logo) && seen.add(p.logo) && p.logo !== 'nexlyr-mark.png');
  $('#logoGrid').innerHTML = list.map(p => {
    const href = safeLink(p.link);
    const inner = `<span class="lbl">${esc(p.cat || p.type || 'Client')}</span><img src="${esc(p.logo)}" alt="${esc(p.name)} logo" loading="lazy" decoding="async" width="120" height="120"><b>${esc(p.name)}</b>`;
    return href ? `<a class="logo-tile" href="${esc(href)}" target="_blank" rel="noopener">${inner}</a>` : `<div class="logo-tile">${inner}</div>`;
  }).join('') + `<a class="logo-tile logo-tile--next" href="#contact"><span class="lbl">Next</span><span class="h2-like">Yours?</span><b>Start a project ↗</b></a>`;
}

/* ── experience ── */
function paintExperience(list){
  const now = list.filter(r => r.is_current), before = list.filter(r => !r.is_current);
  const row = r => {
    const when = r.period_start ? `${esc(r.period_start)}–${r.period_end ? esc(r.period_end) : 'now'}` : (r.soon ? 'Soon' : r.is_current ? 'Now' : '');
    return `<div class="exp__row"><b>${esc(r.role)}</b><span>${esc(r.company)}</span>${when ? `<em class="num">${when}</em>` : ''}</div>`;
  };
  $('#expList').innerHTML =
    (now.length ? `<div class="exp__group"><span class="lbl">Now</span>${now.map(row).join('')}</div>` : '') +
    (before.length ? `<div class="exp__group"><span class="lbl">Before</span>${before.map(row).join('')}</div>` : '');
}

/* ── certificates (hidden until the list has something in it) ── */
function paintCerts(list){
  $('#certsBox').hidden = !list.length;
  $('#certs').innerHTML = list.map(c => {
    const meta = [c.org, c.year, c.done === false ? 'in progress' : ''].filter(Boolean).map(esc).join(' · ');
    const name = c.url ? `<a href="${esc(c.url)}" target="_blank" rel="noopener nofollow">${esc(c.name)} ↗</a>` : esc(c.name);
    return `<div class="exp__row"><b>${name}</b><span>${meta}</span></div>`;
  }).join('');
  const id = 'ld-credentials';
  let tag = document.getElementById(id);
  const done = list.filter(c => c.done !== false);
  if(!done.length){ if(tag) tag.remove(); return; }
  if(!tag){ tag = document.createElement('script'); tag.type = 'application/ld+json'; tag.id = id; document.head.appendChild(tag); }
  tag.textContent = JSON.stringify({ '@context':'https://schema.org', '@type':'Person', '@id':'https://zamil.nexlyr.solutions/#zamil', name:'Zamil Shaikh',
    hasCredential: done.map(c => Object.assign({ '@type':'EducationalOccupationalCredential', name:c.name, credentialCategory:'certificate' },
      c.org ? { recognizedBy:{ '@type':'Organization', name:c.org } } : {}, c.year ? { dateCreated:String(c.year) } : {}, c.url ? { url:c.url } : {})) });
}

/* ── reels and designs ── */
let REELS = FB.reels || [], DESIGNS = FB.designs || [];
const SOUND = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.2l5.4 4.4V5.1L7.2 9.5Z"/><path d="M16 9.5a3.6 3.6 0 0 1 0 5M18.6 7a7 7 0 0 1 0 10"/></svg>';
let reelIO = null;
function paintMedia(reelRows, designRows){
  REELS = (reelRows && reelRows.length) ? reelRows : (FB.reels || []);
  DESIGNS = (designRows && designRows.length) ? designRows : (FB.designs || []);
  $('#reels').hidden = !REELS.length;
  $('#design').hidden = !DESIGNS.length;
  $('#reelRow').innerHTML = REELS.map((r, i) => `
    <button class="reel" type="button" data-lb="reel" data-i="${i}" aria-label="Play ${esc(r.title)} with sound">
      <span class="reel__media"><video src="${esc(r.src)}" poster="${esc(r.poster || '')}" muted loop playsinline preload="none" aria-hidden="true"></video>
      <span class="reel__badge">${SOUND}Sound</span></span>
      <figcaption><b>${esc(r.title)}</b><small>${esc(r.client || '')}</small></figcaption>
    </button>`).join('');
  $('#designGrid').innerHTML = DESIGNS.map((d, i) => `
    <button class="poster" type="button" data-lb="design" data-i="${i}" aria-label="Open ${esc(d.title)} full size">
      <span class="poster__media"><img src="${esc(d.thumb || d.src)}" alt="${esc(d.title)}${d.client ? ' — ' + esc(d.client) : ''}, by Zamil Shaikh" loading="lazy" decoding="async" width="440" height="594"></span>
      <figcaption><b>${esc(d.title)}</b><small>${esc(d.client || '')}</small></figcaption>
    </button>`).join('');
  if(reelIO) reelIO.disconnect();
  reelIO = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target.querySelector('video');
    if(!v) return;
    if(e.isIntersecting && !reduce){ if(v.preload !== 'auto'){ v.preload = 'auto'; v.load(); } v.play().catch(() => {}); }
    else v.pause();
  }), { threshold:.45 });
  $$('#reelRow .reel').forEach(el => reelIO.observe(el));
}

/* ── media viewer ── */
const lb = $('#lightbox'), lbMedia = $('#lbMedia');
let lbList = [], lbIndex = 0, lbKind = 'reel', lbReturn = null;
function lbShow(i){
  lbIndex = (i + lbList.length) % lbList.length;
  const item = lbList[lbIndex];
  lbMedia.innerHTML = lbKind === 'reel'
    ? `<video src="${esc(item.src)}" poster="${esc(item.poster || '')}" controls autoplay playsinline preload="auto"></video>`
    : `<img src="${esc(item.src)}" alt="${esc(item.title)}">`;
  $('#lbTitle').textContent = [item.title, item.client].filter(Boolean).join(' — ');
  $('#lbNote').textContent = item.note || '';
  $('#lbPrev').hidden = $('#lbNext').hidden = lbList.length < 2;
}
function lbOpen(kind, i, from){
  lbKind = kind; lbList = kind === 'reel' ? REELS : DESIGNS;
  if(!lbList.length) return;
  lbReturn = from || null;
  lb.hidden = false;
  requestAnimationFrame(() => lb.classList.add('on'));
  window.__lenis && window.__lenis.stop();
  lbShow(i);
  $('#lbClose').focus({ preventScroll:true });
}
function lbClose(){
  lb.classList.remove('on');
  window.__lenis && window.__lenis.start();
  setTimeout(() => { lb.hidden = true; lbMedia.innerHTML = ''; }, 300);
  if(lbReturn) lbReturn.focus({ preventScroll:true });
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-lb]');
  if(t) return lbOpen(t.dataset.lb, +t.dataset.i, t);
  if(e.target === lb) lbClose();
});
$('#lbClose').addEventListener('click', lbClose);
$('#lbPrev').addEventListener('click', () => lbShow(lbIndex - 1));
$('#lbNext').addEventListener('click', () => lbShow(lbIndex + 1));
addEventListener('keydown', e => {
  if(lb.hidden) return;
  if(e.key === 'Escape'){ e.stopPropagation(); lbClose(); }
  if(e.key === 'ArrowLeft') lbShow(lbIndex - 1);
  if(e.key === 'ArrowRight') lbShow(lbIndex + 1);
});

/* ── paint (config first, Supabase when it answers) ── */
function paint(p, e, c){
  projects = (CFG.projectsFrom === 'admin' && p.length) ? p : (FB.projects || p);
  paintWork(); paintLogos();
  paintExperience(e.length ? e : (FB.experience || []));
  paintCerts(c && c.length ? c : (FB.certificates || []));
}
paint([], [], []);
paintMedia();

const URL_OK = CFG.supabaseUrl && !CFG.supabaseUrl.includes('YOUR-PROJECT');
const SB_HEAD = { apikey: CFG.supabaseKey, Authorization: `Bearer ${CFG.supabaseKey}` };
async function q(table, order){
  const r = await fetch(`${CFG.supabaseUrl}/rest/v1/${table}?select=*&order=${order}`, { headers: SB_HEAD });
  if(!r.ok) throw new Error(table);
  return r.json();
}
const camel = r => ({ ...r, logoBg: r.logo_bg || r.logoBg });
const live = list => (list || []).filter(r => r.visible !== false);
function applySettings(rows){
  const map = Object.fromEntries((rows || []).map(r => [r.key, r.value || {}]));
  if(map.contact) applyContact(map.contact);
}
if(URL_OK){
  Promise.allSettled([
    q('projects', 'sort_order.asc'),
    q('experience', 'sort_order.asc'),
    q('certificates', 'sort_order.asc'),
    q('reels', 'sort_order.asc'),
    q('designs', 'sort_order.asc'),
    q('site_settings', 'key.asc')
  ]).then(([p, e, c, r, d, st]) => {
    paint(live(p.value).map(camel), live(e.value).map(camel), live(c.value));
    paintMedia(live(r.value), live(d.value));
    applySettings(st.value);
  });
}

/* ── the dusk-city chapter card plays the old hero film, on big screens only ── */
(() => {
  const box = $('[data-film]');
  if(!box || reduce) return;
  const net = navigator.connection || {};
  const big = matchMedia('(min-width: 64rem) and (hover: hover)').matches;
  if(!big || net.saveData || /2g/.test(net.effectiveType || '')) return;
  const io = new IntersectionObserver(es => {
    if(!es[0].isIntersecting) return;
    io.disconnect();
    const v = document.createElement('video');
    Object.assign(v, { muted:true, loop:true, playsInline:true, autoplay:true, preload:'auto' });
    v.setAttribute('aria-hidden', 'true');
    v.poster = box.dataset.poster; v.src = box.dataset.film;
    v.style.opacity = '0'; v.style.transition = 'opacity .8s';
    v.style.position = 'absolute'; v.style.inset = '0';
    v.addEventListener('playing', () => { v.style.opacity = '1'; }, { once:true });
    box.prepend(v);
    v.play().catch(() => {});
  }, { rootMargin:'400px 0px' });
  io.observe(box);
})();


/* ── the HELLO figure: a rotating 3D model of Zamil with his camera, loaded only when the block comes near the screen ── */
(() => {
  const t = $('.turn'); if(!t) return;
  const gl = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch(e){ return false; } })();
  if(!gl){ t.classList.add('no-3d'); return; }
  const io = new IntersectionObserver(es => {
    if(!es[0].isIntersecting) return; io.disconnect();
    import('./figure.js?v=1').then(m => m.mountFigure(t)).catch(() => t.classList.add('no-3d'));
  }, { rootMargin:'600px' });
  io.observe(t);
})();

/* ── contact form → Supabase messages table ── */
const form = $('#form'), msg = $('#note'), send = $('#send'), sendLabel = $('#sendLabel');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const f = new FormData(form);
  if(f.get('company')) return;
  const row = { name:String(f.get('name')).trim(), email:String(f.get('email')).trim(), phone:String(f.get('phone') || '').trim(), message:String(f.get('message')).trim() };
  $$('#form [aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
  const bad = (name, text) => { const el = form.elements[name]; el.setAttribute('aria-invalid', 'true'); el.focus(); msg.className = 'note bad'; msg.textContent = text; };
  if(!row.name) return bad('name', 'Add your name.');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) return bad('email', 'That email address looks incomplete.');
  const digits = row.phone.replace(/\D/g, '');
  if(digits.length < 7 || digits.length > 15) return bad('phone', 'Add a phone or WhatsApp number I can reach you on.');
  if(!row.message) return bad('message', 'Tell me a little about the project.');
  if(!URL_OK){ msg.className = 'note bad'; msg.textContent = 'The form is not connected yet. Please reach out on WhatsApp for now.'; return; }
  send.disabled = true; send.dataset.state = 'loading'; sendLabel.textContent = 'Sending'; msg.className = 'note'; msg.textContent = '';
  try{
    const r = await fetch(`${CFG.supabaseUrl}/rest/v1/messages`, {
      method:'POST',
      headers:{ ...SB_HEAD, 'Content-Type':'application/json', Prefer:'return=minimal' },
      body: JSON.stringify(row)
    });
    if(!r.ok) throw new Error(r.status);
    form.reset();
    msg.className = 'note ok'; msg.textContent = 'Sent. I will reply to your email.';
  }catch(err){
    msg.className = 'note bad'; msg.textContent = 'Could not send right now. Try again, or message me on WhatsApp.';
  }
  send.disabled = false; delete send.dataset.state; sendLabel.textContent = 'Send message';
});
})();
