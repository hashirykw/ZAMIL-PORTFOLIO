/* ─────────────────────────────────────────────────────────────
   MAIN CONFIG — Zamil Shaikh's portfolio (the public site).
   The backend repo (ADMIN-ZAMIL-PORTFOLIO) has its own copy of the two
   Supabase values in admin-config.js. Keep both pointing at the same project.
   ───────────────────────────────────────────────────────────── */
window.PORTFOLIO_CONFIG = {

  /* Supabase → Project Settings → Data API (Project URL)
     and → API Keys (the publishable key, starts sb_publishable_).
     Until these are filled in, the site shows the content further down
     and the contact form hands visitors over to WhatsApp.              */
  supabaseUrl: 'https://psiejwbyvnlogatrmoyp.supabase.co',
  supabaseKey: 'sb_publishable_GxMJmpFueRfyE5R-jzONDg_Tj3XeOWq',

  video: {
    desktop: 'hero-hd.mp4',
    mobile:  'hero-mobile.mp4',
    poster:  'hero-poster.webp',
    posterMobile: 'hero-poster-mobile.webp',
    intro:     1.6,
    length:    14.6,
    idleRate:  0.62,
    scrollRate: 1.85,
    loopFrom:  0
  },

  contact: {
    site:      'https://nexlyr.solutions',
    instagram: 'https://www.instagram.com/zamil_fr',
    linkedin:  'https://www.linkedin.com/in/zamil-shaikh-6154ba41a',
    email:     'zamilshaikh700@gmail.com',
    whatsapp:  '923337799953'          // country code + number, no 0 and no spaces
  },

  /* Shown until Supabase has rows. The admin panel takes over after that. */
  fallback: {
    projects: [
      { logo:'nexlyr-mark.png', type:'Campaign and video content', name:'Nexlyr Social Content',
        description:'Social-first creative and promotional content produced for Nexlyr projects.' },
      { icon:'film', type:'Client content', name:'Short-form Brand Reels',
        description:'Engaging reels and promotional clips, edited for social platforms.' },
      { icon:'megaphone', type:'Campaign', name:'Social Media Campaigns',
        description:'Content production and platform-focused creative for brands and businesses.' },
      { icon:'camera', type:'Promotional video', name:'Creative Promo Videos',
        description:'Video content shot, directed and edited for digital promotion.' }
    ],
    experience: [
      { role:'Co-founder', company:'Nexlyr Solutions', is_current:true, logo:'nexlyr-mark.png',
        description:'Helps lead creative production, video editing, social media work and client projects, and contributes to the company\u2019s overall growth.',
        tags:'Video editing, Shooting & directing, Social media, Client handling' },
      { role:'Founder', company:'Khidmat-e-Rizq', is_current:true, icon:'heart',
        description:'Food drive initiative supporting people through food distribution and community service.' },
      { role:'Video Editor & Social Media Specialist', company:'Freelance', is_current:true, icon:'film',
        period_start:'2023', description:'Short-form videos, promotional content and social media assets for clients and brands.' },
      { role:'Creative Content Producer', company:'Independent projects', is_current:false, icon:'camera',
        description:'Shooting, directing, editing and social media content across different projects and campaigns.' }
    ],

    /* Video edits: the strip stays hidden until a clip has a file.
       Easiest is the admin panel (Video edits → + New → upload).
       To add them here instead, drop the mp4 next to index.html and fill src:
       { src:'reel-1.mp4', poster:'reel-1.webp', title:'Brand Promo Reel', client:'Client project',
         note:'Shot and edited a short promotional video for social media.' },
       { title:'Social Media Reel', note:'Edited fast-paced short-form content for audience engagement.' },
       { title:'Product/Service Promo', note:'Combined shooting, direction and editing into a social-ready promotional clip.' },
       { title:'Campaign Highlight', note:'Produced a concise highlight edit for digital promotion.' }            */
    reels: [
      { src:'reel-noir.mp4',        poster:'reel-noir.webp',        title:'Noir',            client:'Restaurant promo',
        note:'Food and drinks promo for Noir, cut for social.' },
      { src:'reel-xahid-portal.mp4', poster:'reel-xahid-portal.webp', title:'Student portal promo', client:'Sir Xahid Anwar',
        note:'Promo for Sir Xahid Anwar’s student portal: the teacher on camera with animated screens.' },
      { src:'reel-nexlyr-services.mp4', poster:'reel-nexlyr-services.webp', title:'Nexlyr services', client:'Nexlyr Solutions',
        note:'3D motion graphics ad for Nexlyr Solutions’ services.' },
      { src:'reel-kitchen.mp4',     poster:'reel-kitchen.webp',     title:'Kitchen to table', client:'Restaurant promo',
        note:'From the pan to the plate: dishes and drinks, edited for social.' },
      { src:'reel-fire-plate.mp4',  poster:'reel-fire-plate.webp',  title:'Fire & plate',    client:'Food promo',
        note:'Flames, steak and pasta, edited to the beat.' },
      { src:'reel-airbnb.mp4',      poster:'reel-airbnb.webp',      title:'Airbnb stay',     client:'Property reel',
        note:'A walk through a holiday home, from the stairs to the bedroom.' },
      { src:'reel-nexlyr.mp4',      poster:'reel-nexlyr.webp',      title:'Ab Boring Nahi',  client:'Nexlyr Solutions',
        note:'Motion graphics reel for Nexlyr Solutions.' },
      { src:'reel-nexlyr-your-turn.mp4', poster:'reel-nexlyr-your-turn.webp', title:'Your turn', client:'Nexlyr Solutions',
        note:'Kinetic type ad for Nexlyr Solutions.' },
      { src:'reel-nitro-gym.mp4',   poster:'reel-nitro-gym.webp',   title:'Nitro gym',       client:'Gym walkthrough',
        note:'A tour of the gym floor, the machines and the people training on them.' },
      { src:'reel-gym-night.mp4',   poster:'reel-gym-night.webp',   title:'Gym night',       client:'Gym edit',
        note:'A moody gym edit with colour grading and sound design.' },
      { src:'reel-nfl.mp4',         poster:'reel-nfl.webp',         title:'NFL legends',     client:'Sports edit',
        note:'A sports highlight edit with slow motion and text.' },
      { src:'reel-kind.mp4',        poster:'reel-kind.webp',        title:'Kind',            client:'Typography edit',
        note:'A short edit built on kinetic text.' },
      { src:'reel-night-drive.mp4', poster:'reel-night-drive.webp', title:'Night drive',     client:'Cinematic edit',
        note:'A cinematic edit with subtitles over the voiceover.' },
      { src:'reel-after-hours.mp4', poster:'reel-after-hours.webp', title:'After hours',     client:'Mood edit',
        note:'A slow, late-night mood edit.' }
    ],

    /* Design work: hidden until an image has a file, same as above. */
    designs: [],

    /* { name:'Certificate name', org:'Who issued it', year:'2025' } */
    certificates: []
  }
};
