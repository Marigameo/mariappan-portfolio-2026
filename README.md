# Mariappan's doodle portfolio

A hand-drawn, plain **HTML + CSS** portfolio. No framework, no build step, no
dependencies. Open `index.html` in a browser or push to Netlify and it works.

**Live:** https://mariappan.netlify.app/

## Layout

```
index.html              homepage (hero deck, logo marquee, work, talks, writing, footer)
about/index.html        the personal side: music, AI interfaces, travel, poetry, photography, cooking
work/<slug>/index.html  one folder per project write-up  →  /work/<slug>/
404.html                Netlify picks this up automatically
css/style.css           the whole design system: tokens, doodle primitives, components
js/main.js              theme toggle + click-to-load YouTube (site works without it)
assets/doodles.svg      every doodle icon as an SVG <symbol>
images/portraits/       the three hero deck illustrations (WebP, 900x1200)
images/footer/          transparent WebP cut-outs planted in the footer garden
images/logos/           company logos; project media goes in images/work/<slug>/
previews/               talk thumbnails
sitemap.xml, robots.txt, netlify.toml, og-image.png, favicon.ico
```

## Design system in one minute

- **Fonts.** `DM Serif Display` for display headings, `Space Grotesk` for body
  copy, `Inter` Light for subtitles, `JetBrains Mono` for eyebrows and `Caveat`
  only for the tiny hand-written notes. All from Google Fonts.
- **Colours** are CSS custom properties in `:root`. Light is warm paper, dark
  is a chalkboard. Dark mode follows the system, and the toggle stores an
  override in `localStorage` under `theme`.
- **Doodle primitives** (all in `css/style.css`):
  - `.wobbly`, `.wobbly--2`, `.wobbly--3` hand-drawn card borders, add `.wobbly--shadow` for an offset ink shadow
  - `mark.hl` highlighter swipe behind a word
  - `.sticky` yellow sticky note; `.taped` adds a tape strip to any positioned box
  - `.doodle-list` hand-drawn bullets
  - `.tilt-1/2/3` tiny rotations so cards look hand-placed
  - `.eyebrow` mono section label, `.sub` Inter Light subtitle, `.pill` outline button
  - `.wave` curvy fold separator: put it as the first child of the lower section
    and give that section `.has-wave` plus `.section--sand` or `.section--paper`
  - `.btn`, `.btn--primary`, `.btn--ghost`, `.tag`, `.callout`, `.facts`, `.prose`

### Using a doodle icon

```html
<svg class="doodle" aria-hidden="true"><use href="/assets/doodles.svg#guitar"/></svg>
```

Icons inherit `color`, so `<svg class="doodle ink-coral">` recolours one. The
`?v=2` on the sprite URL is a cache-buster: bump it in all pages whenever you
change `assets/doodles.svg`, otherwise browsers may keep the old sprite for a day.
Sizes: `.doodle--lg`, `.doodle--xl`. Available ids: guitar, sparkles, plane, pen,
camera, cooking, music, coffee, briefcase, folder, mic, book, heart, star, pin,
lightbulb, github, linkedin, x, mail, instagram, medium, substack, sun, moon,
external, play, slides, arrow-right, arrow-down, menu, close, check, squiggle,
line, circle-scribble, arrow-curly, dashes, asterisk.

**Add a new doodle:** open `assets/doodles.svg`, copy any `<symbol>`, give it a
new `id`, and draw with stroke paths in a 24×24 box. Slightly uneven curves and
overshooting line ends are what make it read as hand-drawn. Don't set colours
inside the symbol; the page CSS supplies `stroke: currentColor`.

## Adding a project page

1. Copy `work/thatpam/` to `work/<new-slug>/`.
2. Edit the `<title>`, meta description, canonical URL, Open Graph tags and the
   JSON-LD block at the top of `index.html`.
3. Write the content inside `<article class="prose">`. Images and videos go in
   `images/work/<new-slug>/`; there are commented examples for `<figure>` with
   `<img>` and `<video>` in the template. Always set `width`/`height` and
   `loading="lazy"` on images.
4. Add a card in the **Things I've built** section of the homepage, using the
   `project--internal` variant so it gets the dashed outline and arrow.
5. Add the URL to `sitemap.xml`.

## The hero deck

The hero shows three illustrated cards stacked like a deck. Clicking the front
card sends it to the back; the arrow caption and the sticky note change with it.
Each card is a `<button class="deck-card">` in `index.html`:

```html
<button class="deck-card" type="button" data-label="hand me a mic" data-note="Happiest with a mic and a room" aria-label="...">
  <img src="/images/portraits/mic.webp" width="900" height="1200" alt="..." loading="lazy">
</button>
```

- `data-label` is the handwritten arrow text, `data-note` the sticky note.
- Add a card by adding another button; CSS positions `.pos-0` to `.pos-2`, so
  add a `.pos-3` rule in `css/style.css` if you go beyond three.
- Export new illustrations at 900x1200 WebP:
  `magick in.png -resize 900x -strip -quality 82 images/portraits/name.webp`

## Hero rotating line

The second half of "Design engineer crafting …" cycles through the spans inside
`.rotator` in `index.html` every 2.8 s. Add or edit spans there; the first one
is the default and what search engines read.

## Footer garden

The footer is a sand block with a wavy crest, layered hills (inline SVG) and
illustrations planted on them. Each plant is:

```html
<div class="plant plant--banana"><img src="/images/footer/banana.webp" alt="" width="379" height="560" loading="lazy"></div>
```

with a matching `.plant--banana { left: 89%; --w: …; --sway: 6s; --swayA: 2deg; }`
rule in `css/style.css`. Small bits (`.deco-1` … `.deco-20`) are positioned the
same way. Phones get their own scene: a taller land, the `.hills--narrow`
drawing and a `@media (max-width: 639px)` block that repositions everything,
so add a phone rule for anything new. To add a new one, cut it out of its background
(`magick in.jpg -fuzz 10% -fill none -draw "alpha 0,0 floodfill" -trim out.png`),
export as WebP into `images/footer/`, add the element and the rule.

## Editing content

Everything is in the HTML, in reading order. The nav and footer are repeated in each page; edit them in all four files. Search for the section comment
(`<!-- ============ Talks ============ -->`) and edit in place. For a talk with
a YouTube video, set `data-video` on the play button to the video id; talks
without a video use the `.video--static` variant that links to the slides.

## Local preview

Any static server works:

```bash
python3 -m http.server 8765
```

then open http://localhost:8765. (Opening `index.html` directly also works,
but the `/assets/doodles.svg` sprite needs a server because of absolute paths.)

## Deploy

Netlify serves the repo root (`netlify.toml` sets `publish = "."`). Headers
for caching and basic security are in the same file. No build command.

## History

The previous React + Vite + Tailwind version lives on the
`backup/react-portfolio-v4` branch.
