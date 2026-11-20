# Design — Zamil Shaikh portfolio

Locked design system for every page of zamil.nexlyr.solutions, carried over 1:1 from
HASHIR-PORTFOLIO (same tokens, type, surfaces and components). All pages read
`site.css`; extend that file (and this note) rather than styling a page on its own.
Zamil-only differences live in the last block of `site.css` (the 3D figure holds his Sony camera, with a polaroid beside it, the four numbers, a centred toolkit, three crafts, lighter disc in the O).

## Genre
Editorial, studied DNA: crumpled graph paper, near-black ink sections, torn paper
edges between them, ultra-wide heavy caps, editor-style selection boxes.

## Surfaces
- `.paper` — off-white crumpled graph paper (`paper-light.webp` + 28px CSS grid)
- `.ink` — near-black crumpled sheet (`paper-dark.webp` + dark grid)
- `.tear-t` / `.tear-b` / `.tear-tb` — the section's top/bottom edge is torn
  (`tear-*.svg` masks, `fringe-*.svg` for the white fibres). The torn section
  always slides over its neighbour.

## Colour (tokens in `site.css :root`)
- paper `oklch(95.5% 0.004 90)` · ink `oklch(16% 0.004 90)`
- signal red `oklch(59% 0.215 27.5)` — one red per screen, never decoration
- selection pink `oklch(66% 0.2 6)` — only for selection frames
- Nexlyr cyan lives only inside the Nexlyr credit strip

## Type
- Display: Archivo Wide 900 (`font-archivo-wide-900.woff2`), caps, roman only
- Labels: Archivo Wide 700, small, tracked caps (`.lbl`) — corner labels
- Body: Archivo 400/600
- Handwriting: Nothing You Could Do (`font-hand.woff2`) — captions, notes only
- Hero and closing words are sized to fit the column exactly (`calc(... / 7.8)`)

## Signature components
- `data-sel` → selection frame with 8 handles; draws in, then images reveal
- `.glyphs` → ✸ ✦ ♣ row (SVG symbols `#g-burst`, `#g-spark`, `#g-club`)
- `.band` + `.marquee` + `.sticker` — black band, scroll-speed marquee, red-outlined cutout
- `.streak` + `.chapter` — motion-blurred chapter divider, then a moody photo card
  with a red title in a selection box and four corner labels
- `.polaroid`, `.sheetnote` (marker notes), `.logo-tile` (cream tiles)

## Motion
Ease `cubic-bezier(.16,1,.3,1)`. Text is never hidden or delayed; only frames,
images and decorations move. Reduced motion: marquee, streak drift and sticky
stacking switch off.

## CTA voice
Primary: black slab, wide caps, ↗ (`.btn`). Secondary: underlined caps link (`.link`).

## Zamil specifics
- Hero cutout: `zamil-pop.webp` (circle + head mask baked into alpha, from `zamil-cutout.webp`).
- Link preview: `.design/og-card.html` (uses `.design/og-pop.webp`), rendered to `og-card.jpg`
  at 1200x630; face and name stay inside the centre 630x630 square. Mockups: `.design/og-preview.html`.
- Chat: `assistant.js` is Zamil AI's knowledge base; hand-offs go to WhatsApp 923337799953.
- HELLO figure: `figure.js` builds Zamil in three.js (wavy hair, thick black glasses, Nexlyr polo with blue trim
  and stripes, dark jeans, Sony alpha in both hands) on the same plinth, light and drag-to-spin as Hashir's.
  `home.js` loads it only when the block comes near the screen; the photo cutout stays as the no-WebGL fallback.
