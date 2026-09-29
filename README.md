# ZAMIL-PORTFOLIO (frontend)

Zamil Shaikh's portfolio for **zamil.nexlyr.solutions**. It has the same background video, blue-and-black theme,
liquid-glass styling and pull-down portfolio as HASHIR-PORTFOLIO. Only the content is different.

The admin panel and the database are in the backend repo, **ADMIN-ZAMIL-PORTFOLIO**, the same split as yours.

## 1. Put it online

1. On GitHub (your account), create a repo named `ZAMIL-PORTFOLIO` and upload everything in this folder.
2. Vercel → **Add New → Project** → import it → **Deploy**. There are no build settings to change.
3. In the Vercel project → **Settings → Domains**, add `zamil.nexlyr.solutions`. Then add `zamil` as a CNAME to
   `cname.vercel-dns.com` wherever the nexlyr.solutions DNS lives, the same way `hashir` is set up.

The site works straight away. Until Supabase is connected, the content comes from `config.js`, and the contact form
passes the visitor's message to Zamil's WhatsApp, already typed out.

## 2. Connect it to the backend

Set up Supabase by following the backend repo's README. Then paste the same **Project URL** and **publishable key**
at the top of `config.js` in this repo and commit.

## 3. Get it on Google (do this once)

1. **search.google.com/search-console**. If `nexlyr.solutions` is already a **Domain** property, the subdomain is
   covered. If not, add `https://zamil.nexlyr.solutions` as a **URL prefix** property, choose the **HTML tag** method,
   and paste the tag into `index.html`. (Done: the verification tag is already in place.)
2. Submit `sitemap.xml` under **Sitemaps**.
3. Under **URL Inspection**, click **Request indexing** for the home page, `/about` and the three service pages.
4. Link the site from places Google already crawls: Zamil's Instagram bio, his LinkedIn (Contact info → Website),
   the Khidmat-e-Rizq Instagram, nexlyr.solutions, and your own portfolio.

**What is already in place:** titles and descriptions sized for Google, canonical and hreflang tags, Open Graph and
Twitter cards with a 1200×630 share card, `rel="me"` identity links, and a full `<noscript>` text version.

The structured data covers:
- Person, with his occupation and you linked as colleague
- WebSite and ProfilePage
- Nexlyr as a ProfessionalService, with both founders
- Khidmat-e-Rizq as an Organization
- one Service per craft
- an ItemList of his work
- SiteNavigationElement and FAQPage
- a VideoObject per clip, generated automatically once clips exist

His projects and experience are written into the page as real HTML, so Google can read them without running code.
There are five indexable pages, all listed in `sitemap.xml`.

## Files

| File | What it is |
|---|---|
| `index.html` | The portfolio: video, panels, pull-down dashboard, contact form |
| `about.html`, `video-editing.html`, `shooting-directing.html`, `social-media-marketing.html` | The indexable pages |
| `config.js` | Supabase values, contact links and the fallback content |
| `zamil-cutout.webp`, `avatar.webp`, `og-card.jpg` | Zamil's photo, the round avatar and the link-preview card |
| `hero-*.mp4`, `hero-poster*.webp`, `sheet-bg.webp` | The background video and posters, the same as yours |
| `sitemap.xml`, `robots.txt`, `site.webmanifest`, `vercel.json` | Search, home-screen and hosting settings |
