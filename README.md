# ZAMIL-PORTFOLIO (frontend)

Zamil Shaikh's portfolio for **zamil.nexlyr.solutions**, in the same "paper & ink" design system, features and
code as HASHIR-PORTFOLIO. Only the content, photos and the chat's knowledge are Zamil's.

The admin panel and the database are in the backend repo, **ADMIN-ZAMIL-PORTFOLIO**. Nothing about that split
changed: the site still reads `projects`, `experience`, `certificates`, `reels`, `designs` and `site_settings`
from Supabase and posts the contact form to `messages`, using the values in `config.js`.

## Pages
| URL | File |
|---|---|
| `/` | `index.html` (hero, HELLO, toolkit, band, studio, services, work, shoots, social, contact) |
| `/video-editing` | `video-editing.html` |
| `/shooting-directing` | `shooting-directing.html` |
| `/social-media-marketing` | `social-media-marketing.html` |
| `/about` | `about.html` |

## Files
| File | What it is |
|---|---|
| `site.css`, `site.js` | The shared system (same as Hashir's) plus a Zamil block at the end of `site.css` |
| `home.js` | Home page data: work rows, experience, reels/designs (hidden until the admin adds some), contact form |
| `assistant.js` | Zamil AI: knowledge base and matching, loaded the first time the chat opens |
| `config.js` | Supabase values, contact links and the fallback content |
| `zamil-pop.webp`, `zamil-sticker.webp`, `studio-portrait.webp`, `zamil-standing.webp`, `zamil-camera.webp`, `avatar-ink.webp` | Made from Zamil's own photos (`zamil-cutout.webp`, `zamil-desk.webp`, `avatar.webp`) |
| `og-card.jpg` | 1200x630 link preview, crop-safe (source in `.design/og-card.html`) |
| `skills/*.svg` | Toolkit logos |
| `.design/`, `design.md`, `.hallmark/` | Design notes, kept out of the deploy by `.vercelignore` |

Reels and design images: add them in the admin panel and the "Video edits" / "Design" strips appear on their own.
