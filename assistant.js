/* Zamil AI: the assistant's knowledge and matching engine. Loaded the first time the chat opens.
   Everything below comes from Zamil's own site text; nothing is invented. */
(() => {
'use strict';
const PROJECTS = [
  { n:'Nexlyr Social Content', t:'Campaign and video content', c:'Social', g:'live', d:'Social-first creative and promotional content produced for Nexlyr projects.', l:'nexlyr-mark.png' },
  { n:'Short-form Brand Reels', t:'Client content', c:'Video', g:'live', d:'Engaging reels and promotional clips, edited for social platforms.' },
  { n:'Social Media Campaigns', t:'Campaign', c:'Social', g:'live', d:'Content production and platform-focused creative for brands and businesses.' },
  { n:'Creative Promo Videos', t:'Promotional video', c:'Shoots', g:'live', d:'Video content shot, directed and edited for digital promotion.' }
];

/* ───────── who, what, how: everything the assistant knows ───────── */
const WA = '923337799953';
const wa = t => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
const A = (href, text, ext) => `<a href="${href}"${ext ? ' target="_blank" rel="noopener"' : ''}>${text}</a>`;
const waBtn = (text, label = 'Message Zamil on WhatsApp') => `<a class="msg-cta" href="${wa(text)}" target="_blank" rel="noopener">${label} ↗</a>`;
const ul = items => '<ul>' + items.map(i => `<li>${i}</li>`).join('') + '</ul>';

const CATS = {
  video:  { label:'Video edits', cat:'Video',  words:['reel','reels','short form','shortform','shorts','edits','clips'] },
  social: { label:'Social work', cat:'Social', words:['campaign','campaigns','social work','page work','posts'] },
  shoots: { label:'Shoots',      cat:'Shoots', words:['promo','promos','promo videos','shoot','shoots','shot'] }
};

/* topics: id, trigger words (English + Roman Urdu), answer, next chips */
const T = [
  { id:'greet', w:['hi','hello','hey','salam','assalam','assalamualaikum','aoa','hola','yo','good morning','good evening','sup','kya hal','kaise ho','kese ho'],
    a:() => `Hi! I'm <b>Zamil AI</b>, Zamil's assistant. I know his services, process, timelines, tools and the work on this site.<br><br>What are you working on?`,
    c:['Video editing','Shooting & directing','Social media','AI UGC','Show me your work','Start a project'] },

  { id:'bot', w:['who are you','are you human','are you real','are you ai','are you a bot','bot','robot','chatgpt','your name','tum kaun','aap kaun'],
    a:() => `I'm <b>Zamil AI</b>, an assistant built into this portfolio. I'm not Zamil himself, but I know his work, services and process. For anything personal, a quote or a booking, I'll pass you straight to Zamil on WhatsApp.`,
    c:['About Zamil','Services','Contact'] },

  { id:'about', w:['who is zamil','about zamil','about you','zamil','zamil shaikh','zamil fr','zamil_fr','who made','background','bio','introduce','kaun hai','kon hai'],
    a:() => `<b>Zamil Shaikh</b> (zamil_fr online) is a video editor, shooter and director in Karachi, Pakistan. He edits, shoots and directs video and manages social media, with a focus on content that looks professional and communicates clearly. He also creates AI UGC content.
      ${ul([
        'Co-founder of <b>Nexlyr Solutions</b>, where he helps lead creative production, video editing, social media work and client projects',
        'Founder of <b>Khidmat-e-Rizq</b>, a food drive initiative',
        '<b>30+</b> videos edited, <b>26+</b> clients, <b>40</b> projects, <b>3</b> years of experience'
      ])}${A('/about','Read more about Zamil')}`,
    c:['Experience','Nexlyr Solutions','Services','Show me your work'] },

  { id:'exp', w:['experience','career','worked','jobs','cv','resume','history','journey','previous','tajurba'],
    a:() => `<b>Now</b>${ul(['Co-founder, Nexlyr Solutions','Founder, Khidmat-e-Rizq','Video Editor &amp; Social Media Specialist, freelance (2023 to now)'])}
      <b>Before</b>${ul(['Creative Content Producer on independent projects: shooting, directing, editing and social media content'])}
      His work grew through hands-on projects with clients and businesses, taking ideas all the way to final delivery.`,
    c:['Skills & tools','Show me your work','Contact'] },

  { id:'stats', w:['how many','numbers','stats','clients','how many clients','how many videos','years','kitne clients','kitni videos'],
    a:() => `The numbers from his portfolio:${ul(['<b>30+</b> videos edited','<b>26+</b> clients','<b>40</b> projects','<b>3</b> years of experience'])}`,
    c:['Show me your work','Experience','Start a project'] },

  { id:'nexlyr', w:['nexlyr','agency','nexlyr solutions','team','company','your agency','studio'],
    a:() => `<b>Nexlyr Solutions</b> is the digital agency Zamil co-founded with Muhammad Hashir. It covers web development, brand identity, video editing and digital marketing. Zamil helps lead creative production, video editing, social media work and client projects there.<br>${A('https://nexlyr.solutions','nexlyr.solutions',1)}`,
    c:['Services','Who is Hashir?','Websites','Contact'] },

  { id:'hashir', w:['hashir','muhammad hashir','co founder','cofounder','partner','who is hashir'],
    a:() => `<b>Muhammad Hashir</b> is Zamil's co-founder at Nexlyr Solutions and handles the web development side. His portfolio: ${A('https://hashir.nexlyr.solutions','hashir.nexlyr.solutions',1)}`,
    c:['Nexlyr Solutions','Websites','Video editing'] },

  { id:'khidmat', w:['khidmat','khidmat e rizq','khidmat-e-rizq','rizq','food drive','charity','community service','food distribution','welfare','ngo'],
    a:() => `<b>Khidmat-e-Rizq</b> is a food drive initiative Zamil founded, supporting people through food distribution and community service. ${A('https://www.instagram.com/khidmat_e_riqz','See it on Instagram',1)}`,
    c:['About Zamil','Contact'] },

  { id:'services', w:['services','what do you do','what can you do','offer','offering','help me with','kya karte','kya karte ho','kaam','work do you do','capabilities'],
    a:() => `Here's what Zamil does:${ul([
      `<b>Video editing</b>: reels, short-form content, promos and social clips (${A('/video-editing','details')})`,
      `<b>Shooting &amp; directing</b>: promos planned, shot, directed and edited (${A('/shooting-directing','details')})`,
      `<b>Social media marketing</b>: content planning, posting, page management and campaign support (${A('/social-media-marketing','details')})`,
      '<b>AI UGC content</b>: AI-made, creator-style videos for brands'
    ])}Which one fits what you need?`,
    c:['Video editing','Shooting & directing','Social media','AI UGC','Start a project'] },

  { id:'video', w:['video','videos','edit','editing','editor','video editor','reel','reels','promo','short form','shorts','tiktok video','youtube','clip','clips','highlight','highlights','capcut','premiere','after effects','davinci','cut','video banwani','reel banwani','edit karwana'],
    a:() => `Video editing for brands and businesses:${ul([
      '<b>Reels</b>: fast-paced vertical edits made for social platforms',
      '<b>Short-form content</b> that gets to the point and holds attention on a feed',
      '<b>Promotional videos</b> for a brand, a product or a service',
      '<b>Social clips and highlights</b> pulled from longer footage'
    ])}He edits in <b>CapCut</b> and <b>Premiere Pro</b>, along with related tools. Most edits take <b>one to three days</b>.<br>${A('/video-editing','See video editing')}`,
    c:['Can you shoot it too?','What do you need from me?','How long does it take?','Start a project'] },

  { id:'shoot', w:['shoot','shooting','shooter','direct','directing','director','videography','videographer','camera','film','filming','production','promo shoot','product shoot','shoot karwana','video shoot','can you shoot it too'],
    a:() => `Yes, Zamil shoots and directs too, then edits the footage himself, so one person carries the idea from planning to the final cut:${ul([
      '<b>Brand promos</b> for social media',
      '<b>Product and service promos</b>',
      '<b>Campaign content</b>, cut into highlight edits',
      '<b>Creative direction</b>: deciding what gets filmed and how, before the edit starts'
    ])}Planning comes first, so the shoot day is spent getting the right footage.<br>${A('/shooting-directing','See shooting &amp; directing')}`,
    c:['What happens before the shoot?','Where are you based?','Start a project'] },

  { id:'social', w:['social media','social','instagram','facebook','tiktok','linkedin page','content','posts','posting','marketing','digital marketing','page management','manage my page','smm','content calendar','content plan','page chalana','page sambhalna'],
    a:() => `Social media marketing, from the plan to what goes out on the page:${ul([
      '<b>Content planning</b>: what gets posted, when, and what each piece is for',
      '<b>Posting and page management</b>, so a page never looks abandoned',
      '<b>Audience-focused content</b> made for the people the page wants to reach',
      '<b>Campaign support</b>, including the videos, shot and edited in-house'
    ])}A content cycle usually takes <b>three to seven days</b>, depending on the campaign.<br>${A('/social-media-marketing','See social media marketing')}`,
    c:['Do you make the content too?','How long does it take?','Start a project'] },

  { id:'ugc', w:['ugc','ai ugc','user generated','ai video','ai videos','ai avatar','ai ads','ai content','generative ai','gen ai','higgsfield','veo','veo 3','google flow','runway','elevenlabs','ai voice','ai tools','ai'],
    a:() => `Zamil is also an <b>AI UGC creator</b>: creator-style videos for brands, made with AI video and voice tools, and edited like his other content so they look professional and communicate clearly.<br><br>Tell him what you want to promote and he'll say what fits.${waBtn('Hi Zamil, I want AI UGC content for my brand: ')}`,
    c:['Skills & tools','Video editing','Start a project'] },

  { id:'skills', w:['skills','tools','software','software you use','toolkit','what do you use','apps','editing software','kis app'],
    a:() => `The toolkit on this site:${ul([
      '<b>Edit &amp; shoot</b>: Premiere Pro, After Effects, CapCut, DaVinci Resolve, Photoshop, Lightroom, Canva',
      '<b>AI UGC</b>: Higgsfield, Veo 3, Google Flow, Runway, ElevenLabs, ChatGPT'
    ])}${A('/#skills','See the toolkit')}`,
    c:['Video editing','AI UGC','Start a project'] },

  { id:'web', w:['website','websites','web','site','landing page','web app','web development','developer','app','logo','branding','brand identity','graphic design'],
    a:() => `Websites and brand identity are handled at <b>Nexlyr Solutions</b>, the agency Zamil co-founded. The web side is led by Muhammad Hashir: ${A('https://hashir.nexlyr.solutions','hashir.nexlyr.solutions',1)} · ${A('https://nexlyr.solutions','nexlyr.solutions',1)}<br><br>Zamil can make the videos and social content to go with it.`,
    c:['Nexlyr Solutions','Video editing','Social media'] },

  { id:'price', w:['price','prices','pricing','cost','costs','charges','charge','rate','rates','budget','fee','fees','how much','quote','quotation','estimate','package','packages','cheap','affordable','expensive','kitna','paisay','paise','rupees','dollars','usd','pkr','kharcha'],
    a:ctx => {
      const s = ctx.service && SERVICE_NAMES[ctx.service];
      return `${s ? `For <b>${s}</b>, the` : 'The'} cost depends on the scope, so there's no fixed price list. The content, the scope and the deliverables are agreed <b>before</b> any work starts, and smaller projects are welcome, depending on the scope and timeline.<br><br>Tell Zamil what you need and he'll come back with a clear quote.${waBtn(`Hi Zamil, I'd like a quote${s ? ' for ' + s : ''}: `, 'Get a quote on WhatsApp')}`;
    },
    c:['Start a project','How long does it take?','How it works'] },

  { id:'time', w:['how long','time','timeline','duration','turnaround','deadline','days','weeks','fast','urgent','asap','kab tak','kitne din','delivery time','how quickly','when ready','jaldi'],
    a:ctx => {
      const by = {
        video:'<b>Video editing</b>: usually one to three days, depending on the length and how much footage there is.',
        social:'<b>Social media</b>: a content cycle usually takes three to seven days, depending on the campaign.',
        shoot:'<b>Shoots</b>: the plan is agreed first, and the timeline is set with it, since it depends on what the shoot needs to capture.',
        ugc:'<b>AI UGC</b>: depends on how many videos and versions you need; ask Zamil for an exact timeline.'
      };
      return ctx.service && by[ctx.service] ? by[ctx.service] + '<br><br>Urgent? Say so on WhatsApp and Zamil will tell you what is possible.' :
        `Rough guide:${ul([by.video, by.social, by.shoot])}You get an exact timeline when the plan is agreed.`;
    },
    c:['How much does it cost?','Start a project','How it works'] },

  { id:'payment', w:['payment','pay','advance','deposit','installment','invoice','bank','easypaisa','jazzcash','paypal','wise','refund','contract','payment terms'],
    a:() => `Payment terms are agreed with the plan, before work starts. For the exact options, ask Zamil directly.${waBtn('Hi Zamil, what are your payment terms?')}`,
    c:['How it works','Start a project'] },

  { id:'revisions', w:['revision','revisions','changes','change','modify','not happy','redo','corrections','feedback'],
    a:() => `Your feedback is part of the process: in the <b>create and refine</b> step, shooting and editing happen with your feedback worked in along the way, before the final files are delivered.`,
    c:['How it works','Start a project'] },

  { id:'need', w:['what do you need','what do i send','requirements','materials','what to send','what info','start with','footage','raw footage','what do you need from me','before the shoot','what happens before the shoot'],
    a:ctx => ctx.service === 'shoot' ? `Before a shoot, you go over the goal and the audience together, then agree the content, the scope and the deliverables, so everyone knows what the shoot needs to capture.` :
      `For an edit: the footage, your logo if you have one, and one line on what the video needs to do. If you don't have footage, Zamil can shoot it.`,
    c:['Start a project','How long does it take?'] },

  { id:'preshoot', w:['before the shoot','what happens before the shoot','pre production','planning the shoot','shoot plan'],
    a:() => `Before a shoot, you go over the goal and the audience together, then agree the content, the scope and the deliverables, so everyone knows what the shoot needs to capture.`,
    c:['Start a project','How long does it take?'] },

  { id:'makecontent', w:['make the content','do you make the content','create content','content bhi','you design posts'],
    a:() => `Yes. The videos can be shot, directed and edited as part of the same work, alongside the planning and posting.`,
    c:['Social media','Start a project'] },

  { id:'style', w:['match my style','my style','reference','references','similar to','like this','copy style','existing style','trend','trending'],
    a:() => `Send a few videos or pages you like with your brief, and Zamil will tell you how he'd approach it for your brand.`,
    c:['Video editing','Start a project'] },

  { id:'small', w:['small project','small business','startup','just one reel','one video','single video','small budget','beginner','new business','smaller projects','chota kaam'],
    a:() => `Yes, Zamil takes smaller projects too, depending on the scope and timeline.`,
    c:['How much does it cost?','Start a project'] },

  { id:'location', w:['where are you','where is zamil','location','based','karachi','pakistan','office','address','city','visit','meet','where are you based','kahan','kahan ho'],
    a:() => `Zamil is based in <b>Karachi, Pakistan</b>. For a shoot somewhere else, or to meet, ask him on WhatsApp.`,
    c:['Contact','Shooting & directing'] },

  { id:'contact', w:['contact','whatsapp','phone','number','call','email','mail','reach','talk','message','dm','instagram id','insta','linkedin','get in touch','rabta','number do'],
    a:() => `The fastest way is <b>WhatsApp</b>: ${A(wa("Hi Zamil, I'd like to talk about a project."),'+92 333 7799953',1)}${ul([
      `Email: ${A('mailto:zamilshaikh700@gmail.com','zamilshaikh700@gmail.com')}`,
      `Instagram: ${A('https://www.instagram.com/zamil_fr','@zamil_fr',1)}`,
      `LinkedIn: ${A('https://www.linkedin.com/in/zamil-shaikh-6154ba41a','Zamil Shaikh',1)}`,
      `Agency: ${A('https://nexlyr.solutions','nexlyr.solutions',1)}`,
      `Or the ${A('/#contact','contact form')} on this site`
    ])}`,
    c:['Start a project','Services'] },

  { id:'start', w:['start a project','start','hire','hire you','book','booking','order','begin','get started','work with you','lets work','kaam karwana','start karna','lets start'],
    a:() => null, flow:'lead' },

  { id:'work', w:['work','portfolio','projects','examples','samples','case studies','show me','your best','previous work','what have you made','show me your work'],
    a:() => null, flow:'projects' },

  { id:'process', w:['process','how do you work','how it works','workflow','steps','method','approach','how does it work','what happens next'],
    a:() => `The same four steps whether it is one reel or a full campaign:${ul([
      '<b>Understand the goal</b>: who the content is for, and what it needs to do once it is out there',
      '<b>Agree the plan</b>: the content, the scope and the deliverables, settled before any work starts',
      '<b>Create and refine</b>: shooting and editing, with your feedback worked in along the way',
      '<b>Deliver</b>: final files, ready to publish or use wherever they are going'
    ])}`, c:['Start a project','How long does it take?','How much does it cost?'] },

  { id:'why', w:['why you','why zamil','why should i','why choose','what makes you different','better than','trust','reliable','guarantee','reviews','testimonials'],
    a:() => `A few reasons people work with Zamil:${ul([
      '<b>One person</b> can carry it from the idea to the final cut: planning, shooting, directing and editing',
      'Content made to <b>look professional and communicate clearly</b>',
      'Social media handled alongside the videos, so the page and the content match',
      'You talk to Zamil directly on WhatsApp'
    ])}The best proof is the work: ${A('/#work','see the projects')}.`, c:['Show me your work','Start a project'] },

  { id:'lang', w:['urdu','language','languages','speak','hindi','roman urdu','english'],
    a:() => `You can chat with me in English or Roman Urdu. For anything specific, message Zamil on WhatsApp.`,
    c:['Contact','Services'] },

  { id:'thanks', w:['thanks','thank you','thx','ty','shukriya','shukria','jazakallah','great','awesome','perfect','nice','cool','ok','okay','got it','helpful','acha','theek'],
    a:() => `Anytime! Anything else, or should I connect you with Zamil?`,
    c:['Start a project','Contact','Show me your work'] },

  { id:'bye', w:['bye','goodbye','see you','allah hafiz','khuda hafiz','that is all','thats all'],
    a:() => `Take care! Zamil is one tap away whenever you're ready.${waBtn("Hi Zamil, I was chatting with your assistant.")}`,
    c:[] }
];
const SERVICE_NAMES = { video:'video editing', shoot:'a promo shoot', social:'social media management', ugc:'AI UGC content' };
const CHIP_MAP = {
  'Video editing':'video','Shooting & directing':'shoot','Social media':'social','AI UGC':'ugc','Show me your work':'work','Services':'services',
  'About Zamil':'about','Contact':'contact','Experience':'exp','Nexlyr Solutions':'nexlyr','Skills & tools':'skills','Who is Hashir?':'hashir','Websites':'web',
  'Start a project':'start','How much does it cost?':'price','How long does it take?':'time','How it works':'process','Can you shoot it too?':'shoot',
  'What do you need from me?':'need','What happens before the shoot?':'preshoot','Where are you based?':'location','Do you make the content too?':'makecontent','Why Zamil?':'why'
};

/* ───────── text matching: tokens, typos, phrases ───────── */
const norm = s => (' ' + s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9.+#& ]+/g, ' ').replace(/\.(?![a-z0-9])/g, ' ').replace(/\s+/g, ' ') + ' ');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
function lev(a, b){
  if(Math.abs(a.length - b.length) > 2) return 9;
  const d = Array.from({ length:a.length + 1 }, (_, i) => [i]);
  for(let j = 1; j <= b.length; j++) d[0][j] = j;
  for(let i = 1; i <= a.length; i++) for(let j = 1; j <= b.length; j++)
  {
    d[i][j] = Math.min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
    if(i > 1 && j > 1 && a[i-1] === b[j-2] && a[i-2] === b[j-1]) d[i][j] = Math.min(d[i][j], d[i-2][j-2] + 1); // swapped letters count as one typo
  }
  return d[a.length][b.length];
}
// one topic scores each word of the message once: "price" shouldn't also count as a typo of "prices"
function topicScore(text, tokens, words){
  let n = 0; const used = new Set();
  for(const word of words){
    const w = word.toLowerCase();
    if(w.includes(' ')){ if(text.includes(' ' + w + ' ')){ n += 2.2 + w.split(' ').length * .4; w.split(' ').forEach(x => used.add(x)); } continue; }
    if(used.has(w)) continue;
    if(text.includes(' ' + w + ' ')){ n += w.length <= 3 ? 1.1 : 1.5; used.add(w); continue; }
  }
  for(const word of words){
    const w = word.toLowerCase(); if(w.includes(' ') || w.length < 5) continue;
    for(const t of tokens){ if(t.length >= 4 && !used.has(t) && t !== w && lev(t, w) <= (w.length >= 8 ? 2 : 1)){ n += 1.1; used.add(t); break; } }
  }
  return n;
}
const hit = (text, tokens, w) => topicScore(text, tokens, [w]);
function score(q){
  const text = norm(q), tokens = text.trim().split(' ');
  return T.map(t => ({ t, s:topicScore(text, tokens, t.w) })).filter(x => x.s > 0).sort((a, b) => b.s - a.s);
}
const SERVICE_OF = { video:'video', shoot:'shoot', preshoot:'shoot', social:'social', makecontent:'social', ugc:'ugc' };

/* ───────── projects: search by name, category or kind ───────── */
const NAME_STOP = ['nexlyr','social','content','media','short','form','brand','reels','campaigns','creative','promo','videos','video'];
function findProjects(q){
  const text = norm(q), tokens = text.trim().split(' ');
  const byName = PROJECTS.filter(p => {
    const n = norm(p.n).trim(); if(text.includes(' ' + n + ' ')) return true;
    return n.split(' ').filter(w => w.length > 3 && !NAME_STOP.includes(w)).some(w => tokens.some(t => t === w || t.length >= 5 && w.length >= 5 && lev(t, w) <= 1));
  });
  if(byName.length) return { list:byName, title:byName.length === 1 ? '' : 'Here are the matches:' };
  for(const [k, c] of Object.entries(CATS)){
    if(c.words.some(w => hit(text, tokens, w))){
      const list = PROJECTS.filter(p => c.cat ? p.c === c.cat : p.g === c.g);
      if(list.length) return { list, title:`${c.label}: ${list.length} project${list.length > 1 ? 's' : ''}`, cat:k };
    }
  }
  if(/\bdemo/.test(text)) return { list:PROJECTS.filter(p => p.g === 'demo'), title:'Demo sites (built as pitches and showcases):' };
  return null;
}
function cards(list, max = 4){
  return `<div class="pcards">${list.slice(0, max).map(p => `<a class="pcard" href="${p.u || '/#work'}"${p.u ? ' target="_blank" rel="noopener"' : ''}>
      ${p.l ? `<img src="/${p.l}" alt="" width="40" height="40" loading="lazy">` : '<span class="pcard__ph">✦</span>'}
      <span><b>${p.n}</b><small>${p.t}${p.c ? ' · ' + p.c : ''}</small><em>${p.d}</em></span></a>`).join('')}</div>`;
}

/* ───────── the brain ───────── */
const ctx = { service:null, last:null, more:null, lead:null };

function projectsAnswer(q){
  const f = findProjects(q || '');
  if(f){
    ctx.more = f.list.length > 4 ? f.list.slice(4) : null;
    if(f.cat === 'video') ctx.service = 'video'; else if(f.cat === 'social') ctx.service = 'social'; else if(f.cat === 'shoots') ctx.service = 'shoot';
    const one = f.list.length === 1 && f.list[0];
    return { html:(one ? `<b>${one.n}</b>: ${one.d}` : f.title) + cards(f.list) + (ctx.more ? `<br>${ctx.more.length} more in this group.` : ''),
      chips:[...(ctx.more ? ['Show more'] : []), 'Start a project', 'Services'] };
  }
  const best = PROJECTS.filter(p => p.g === 'live').slice(0, 4);
  ctx.more = PROJECTS.filter(p => !best.includes(p));
  return { html:`Zamil has <b>30+ videos edited</b> and <b>40 projects</b> for <b>26+ clients</b>. The work on this site:` + cards(best) + `<br>Ask me for a kind: "reels", "promo shoots", "social campaigns"…`,
    chips:['Reels','Promo shoots','Social campaigns','Start a project'] };
}

const LEAD = [
  { key:'need', ask:'Great, let\'s put your brief together (4 quick questions). What do you need?', chips:['Video editing','A promo shoot','Social media management','AI UGC content','Something else'] },
  { key:'about', ask:'Nice. In one line, what is the brand or project, and who should see it?', chips:['Cancel'] },
  { key:'when', ask:'When would you like it ready?', chips:['As soon as possible','Within a month','No rush'] },
  { key:'name', ask:'Last one: your name?', chips:['Cancel'] }
];
function leadStep(input){
  const L = ctx.lead;
  if(input != null) L.data[LEAD[L.i].key] = input;
  L.i++;
  if(L.i < LEAD.length) return { html:LEAD[L.i].ask, chips:LEAD[L.i].chips, lead:true };
  const d = L.data; ctx.lead = null;
  for(const k in d) d[k] = d[k] || '-';
  const msg = `Hi Zamil, I'm ${d.name}. I need: ${d.need}.\nAbout the project: ${d.about}.\nTimeline: ${d.when}.`;
  return { html:`Thanks, ${esc(d.name.split(' ')[0])}. Here's your brief, ready to send:<div class="brief">${esc(msg).replace(/\n/g,'<br>')}</div>${waBtn(msg, 'Send to Zamil on WhatsApp')}<br><small>WhatsApp is the fastest way to reach him.</small>`, chips:['Show me your work','Services'] };
}

function answer(q, forcedId){
  // inside the project brief flow
  if(ctx.lead && !forcedId){
    if(/^(cancel|stop|exit|nevermind|never mind|no)$/i.test(q.trim())){ ctx.lead = null; return { html:'No problem, cancelled. What else can I help with?', chips:['Services','Show me your work'] }; }
    return leadStep(q.trim().slice(0, 160));
  }
  if(q === 'Show more' && ctx.more && ctx.more.length){
    const list = ctx.more; ctx.more = list.length > 4 ? list.slice(4) : null;
    return { html:'More projects:' + cards(list) + (ctx.more ? `<br>${ctx.more.length} more.` : ''), chips:[...(ctx.more ? ['Show more'] : []), 'Start a project'] };
  }
  const quick = { 'Reels':'reels', 'Promo shoots':'promo shoots', 'Social campaigns':'social campaigns' };
  if(quick[q]) return projectsAnswer(quick[q]);
  if(q === 'Cancel') return { html:'Okay. What else can I help with?', chips:['Services','Show me your work'] };
  const id = forcedId || CHIP_MAP[q];
  let topics;
  if(id) topics = [T.find(t => t.id === id)];
  else {
    const r = score(q);
    // a named project or a kind of business wins when it is the clear subject
    const f = findProjects(q);
    if(f && (!r.length || r[0].t.id === 'work' || f.list.length === 1 && !f.cat && r[0].s < 3)) return projectsAnswer(q);
    if(!r.length){
      if(/\b(it|that|this|same|and|also|what about|aur)\b/i.test(q) && ctx.last) topics = [ctx.last];
      else return fallback(q);
    } else {
      topics = [r[0].t];
      // two clear questions in one message: answer both (price + time, service + price …)
      const skip = ['greet','thanks','bye','about'];
      for(const x of r.slice(1, 3)) if(x.s >= r[0].s * .7 && x.s >= 1.1 && !skip.includes(x.t.id)) topics.push(x.t);
      // a price / time / payment question always gets answered, even next to a strong service word
      for(const x of r) if(['price','time','payment','revisions'].includes(x.t.id) && x.s >= 1.1 && !topics.includes(x.t)) topics.push(x.t);
      if(['greet','about'].includes(topics[0].id) && r[1] && r[1].s >= 1.5) topics = [r[1].t, ...topics.slice(1).filter(t => t !== r[1].t)];
      const fl = topics.find(t => t.flow); if(fl) topics = [fl];
      // "how much is a website?" → the website is context, the price is the answer
      const asks = ['price','time','payment','revisions','edit','hosting','need'];
      if(topics.some(t => asks.includes(t.id)) && topics.length > 1){
        topics.forEach(t => { if(SERVICE_OF[t.id]) ctx.service = SERVICE_OF[t.id]; });
        topics = topics.filter(t => !SERVICE_OF[t.id] || asks.includes(t.id));
      }
    }
  }
  // remember which service we're talking about, so "how much?" means that service
  topics.forEach(t => { if(SERVICE_OF[t.id]) ctx.service = SERVICE_OF[t.id]; });
  const svcFromText = score(q).map(x => SERVICE_OF[x.t.id]).find(Boolean); if(svcFromText) ctx.service = svcFromText;
  const parts = [], chips = new Set();
  for(const t of topics){
    if(t.flow === 'lead'){ ctx.lead = { i:-1, data:{} }; const r0 = leadStep(null); return r0; }
    if(t.flow === 'projects') return projectsAnswer(q);
    parts.push(t.a(ctx)); (t.c || []).forEach(c => chips.add(c)); ctx.last = t;
  }
  return { html:parts.join('<hr>'), chips:[...chips].slice(0, 6) };
}
function fallback(q){
  return { html:`I'm not sure about that one, but Zamil will know.${waBtn('Hi Zamil, ' + q)}<br><br>Or try one of these:`,
    chips:['Services','Show me your work','How much does it cost?','Start a project'] };
}

window.ZamilAI = { answer, welcome:() => answer("hi", "greet"), ctx, _score:score };

})();
