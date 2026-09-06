# Mariappan's doodle portfolio

A hand-drawn portfolio built with [Astro](https://astro.build). It ships as plain
static HTML + one CSS file + one tiny script: no framework runtime in the browser.
Astro is only there so the nav, footer, `<head>` and page chrome live in one place
instead of being pasted into every page.

**Live:** https://mariappan.netlify.app/

```bash
npm install      # once
npm run dev      # http://localhost:4321, hot reload
npm run build    # static site in dist/
npm run preview  # serve dist/ locally
npm run check    # type-check the .astro files
```

## Layout

```
src/
  pages/                    one file per URL
    index.astro             homepage: assembles the home sections below
    about.astro             the personal side               →  /about/
    404.astro               Netlify picks up dist/404.html automatically
    work/<slug>.astro       one file per project write-up   →  /work/<slug>/
    sitemap.xml.ts          builds /sitemap.xml from the pages above
  layouts/
    BaseLayout.astro        <head> (SEO, OG, Twitter, fonts, theme script), header, footer, main.js
    WorkLayout.astro        project page chrome: breadcrumb, title, lede, facts, back link, JSON-LD
  components/
    Header.astro, Footer.astro, Icon.astro
    home/                   Hero, Logos, Work (+ Rail, WorkCard), Talks (+ Ticket), Writing
    sketches/               the inline <svg class="sk"> product drawings used as card thumbnails
  data/
    site.ts                 name, URL, handles, social links, nav
    talks.ts, writing.ts, logos.ts
  styles/style.css          the whole design system: tokens, doodle primitives, components
  scripts/main.js           theme toggle, rotator, deck, rails, click-to-load YouTube (site works without it)
  assets/doodles.svg        every doodle icon as an SVG <symbol>; content-hashed at build time
public/                     copied to dist/ as-is
  images/portraits/         the three hero deck illustrations (WebP, 900x1200)
  images/footer/            transparent WebP cut-outs planted in the footer garden
  images/logos/             company logos; project media goes in images/work/<slug>/
  previews/                 talk thumbnails
  favicon.svg, favicon.ico, apple-touch-icon.png, og-image.png, robots.txt
astro.config.mjs            site URL, trailing slashes, HTML whitespace kept as authored
netlify.toml                build command, publish dir, cache/security headers
```

## Design system in one minute

- **Fonts.** `DM Serif Display` for display headings, `Space Grotesk` for body
  copy, `Inter` Light for subtitles, `JetBrains Mono` for eyebrows and `Caveat`
  only for the tiny hand-written notes. All from Google Fonts.
- **Colours** are CSS custom properties in `:root`. Light is warm paper, dark
  is a chalkboard. Dark mode follows the system, and the toggle stores an
  override in `localStorage` under `theme`.
- **Doodle primitives** (all in `src/styles/style.css`):
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

```astro
---
import Icon from '../components/Icon.astro';
---
<Icon name="guitar" />
<Icon name="pen" class="ink-coral" />          <!-- icons inherit `color` -->
<Icon name="arrow-right" style="transform:scaleX(-1)" />
```

That renders `<svg class="doodle" aria-hidden="true"><use href="/_astro/doodles.<hash>.svg#guitar"/></svg>`.
The sprite URL carries a content hash, so there is no `?v=` to bump any more:
edit `src/assets/doodles.svg` and every page picks it up on the next build.
Sizes: `.doodle--lg`, `.doodle--xl`. Available ids: guitar, sparkles, plane, pen,
camera, cooking, music, coffee, briefcase, folder, mic, book, heart, star, pin,
lightbulb, github, linkedin, x, mail, instagram, medium, substack, sun, moon,
external, play, slides, arrow-right, arrow-down, menu, close, check, squiggle,
line, circle-scribble, arrow-curly, dashes, asterisk, grass, daisy, hibiscus, bird,
bigsun, stone, coconuts, bigmoon, confetti, plant.

**Add a new doodle:** open `src/assets/doodles.svg`, copy any `<symbol>`, give it a
new `id`, and draw with stroke paths in a 24×24 box. Slightly uneven curves and
overshooting line ends are what make it read as hand-drawn. Don't set colours
inside the symbol; the page CSS supplies `stroke: currentColor`.

## Adding a project page

1. Copy `src/pages/work/thatpam.astro` to `src/pages/work/<new-slug>.astro`. The URL
   is `/work/<new-slug>/`.
2. Fill in the `<WorkLayout>` props at the top: `title` (the browser title, the
   ` | Work | Mariappan Subramanian` suffix is added for you), `description`, an
   optional shorter `ogDescription` for social cards, `heading`, an optional
   `eyebrow`, the `facts`, the `link`, and `schema` (feeds the JSON-LD block).
3. Write the lede in `<Fragment slot="lede">` and the write-up as the children;
   they land inside `<article class="prose">`. Images and videos go in
   `public/images/work/<new-slug>/`; there are commented examples for `<figure>`
   with `<img>` and `<video>` in the template. Always set `width`/`height` and
   `loading="lazy"` on images.
4. Add a card on the homepage in `src/components/home/Work.astro`. The section is
   a set of `<Rail>`s (one per company, plus Indie builds), each a sideways
   scroller of `<WorkCard>`s. Copy a card into the right rail and set its `href`,
   `accent` (coral, blue, teal, violet), `when`, `title`, one or two `tags`, and
   the description as children. The thumbnail goes in the `sketch` slot: either
   a drawing component from `src/components/sketches/` (a 600x440 `<svg class="sk">`
   using `.f-card`, `.f-bar`, `.s-soft` and friends so it follows the theme) or a
   real screenshot `<img slot="sketch" width height alt loading="lazy">`. Arrows and
   the progress line only appear once a rail has more cards than fit on screen.
5. The sitemap updates itself; nothing to do.

Watch out for `{` and `}` in `.astro` templates: they start an expression. Write
them as `{'{'}` or put the text in a data file (that is how "The {hey} fever" is done).

## Talks, writing, logos

Plain data, no markup to touch:

- `src/data/talks.ts`: one object per ticket. Give it a `video` (YouTube id) for a
  click-to-load player, or leave it out and the thumbnail links to the slides.
- `src/data/writing.ts`: shelves of books. `spine` is the short text, `title` the
  full one, `bh` the height and `bw` an optional width. One `lean: true` per shelf at most.
- `src/data/logos.ts`: the marquee, rendered twice for a seamless loop.

## The hero deck

The hero shows three illustrated cards stacked like a deck. Clicking the front
card sends it to the back; the arrow caption and the sticky note change with it.
The cards are the `deck` array in `src/components/home/Hero.astro`:
`label` is the handwritten arrow text, `note` the sticky note.
CSS positions `.pos-0` to `.pos-2`, so add a `.pos-3` rule in `style.css` if you go
beyond three. Export new illustrations at 900x1200 WebP:
`magick in.png -resize 900x -strip -quality 82 public/images/portraits/name.webp`

## Hero rotating line

The second half of "Design engineer crafting …" cycles through the `roles` array
in `Hero.astro` every 2.8 s. The first one is the default and what search engines read.

## Footer garden

The footer (`src/components/Footer.astro`) is a sand block with a wavy crest,
layered hills (inline SVG) and illustrations planted on them. Plants are the
`plants` array (`{ name, width, height }` → `public/images/footer/<name>.webp`) and
need a matching `.plant--name { left: 89%; --w: …; --sway: 6s; --swayA: 2deg; }` rule
in `style.css`. Small bits are the `sky` and `ground` arrays (`[position class, doodle id]`)
positioned the same way (`.deco-1` … `.deco-20`). Phones get their own scene: a
taller land, the `.hills--narrow` drawing and a `@media (max-width: 639px)` block
that repositions everything, so add a phone rule for anything new. To add a plant,
cut it out of its background
(`magick in.jpg -fuzz 10% -fill none -draw "alpha 0,0 floodfill" -trim out.png`),
export as WebP into `public/images/footer/`, add the entry and the rule.

## SEO and metadata

`BaseLayout` writes the title, description, canonical, robots, Open Graph,
Twitter card and theme-color tags from its props, and the JSON-LD block when a
page passes `jsonLd`. The canonical/og:url default to the page's own path under
the `site` in `astro.config.mjs`. `/sitemap.xml` is generated at build time from
`src/pages` (404 excluded) with `lastmod` from each file's last git commit.
`robots.txt` and `og-image.png` are in `public/`.

## Favicon and social image

`public/favicon.svg` is the source of the M mark. After editing it, regenerate the
raster copies (needs `rsvg-convert` and ImageMagick from Homebrew):

```bash
cd public && rsvg-convert -w 180 -h 180 favicon.svg -o apple-touch-icon.png && for s in 16 32 48; do rsvg-convert -w $s -h $s favicon.svg -o /tmp/fav$s.png; done && magick /tmp/fav16.png /tmp/fav32.png /tmp/fav48.png favicon.ico
```

`og-image.png` (1200x630) is a capture of the homepage hero. With `npm run dev`
running, headless Chrome takes the shot and ImageMagick trims the next section off
the bottom:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --hide-scrollbars --force-device-scale-factor=1 --window-size=1500,788 --timeout=12000 --user-data-dir=/tmp/og-profile --screenshot=/tmp/hero.png http://localhost:4321/ && magick /tmp/hero.png -crop 1500x722+0+0 +repage -background "#fff9f1" -gravity north -extent 1500x788 -resize "1200x630!" -strip public/og-image.png
```

## Deploy

Netlify runs `npm run build` and serves `dist/` (`netlify.toml`). Hashed assets
under `/_astro/` are cached for a year; HTML revalidates on every request.

## History

The hand-written HTML version this was migrated from is in the git history before
the Astro commit. The React + Vite + Tailwind version before that lives on the
`backup/react-portfolio-v4` branch.
