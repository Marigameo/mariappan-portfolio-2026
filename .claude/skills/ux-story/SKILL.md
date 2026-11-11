---
name: ux-story
description: Turn a UX-heavy build (a journal, a process folder of screenshots, screen recordings, a short gist) into a screenshot-led UX case study on the portfolio, usually a studio story at /experiments/studio/<slug>/. One decision per section, a real screenshot or recording for each, very little text, lazy-loaded and accessible media with a lightbox and before/after toggles. Use when the user asks for a UX case study, a "case study mode" story, a screenshot- or recording-driven story, or a studio story about a UI they designed. For story-plus-blog write-ups with hand-drawn diagrams, use share-my-work instead.
---

# UX story: a screenshot-led case study

A UX story shows **design decisions**, not a timeline. Each section is one call I made, proved by one real screenshot or recording, with a line or two of text and a few short notes. A reader who only looks at the pictures and the headlines should still get the story.

The reference piece is `src/pages/experiments/studio/datagrid.astro`. Read it before writing a new one.

| | share-my-work (slide deck) | ux-story (this skill) |
|---|---|---|
| Media | Hand-drawn sketches, some screenshots | Real screenshots and recordings only |
| Text | Bullets per slide | One "call" line per section, short notes |
| Shape | Backstory → build → lessons | Problem → process → decisions → measured → lessons |
| Lives in | `/work/` or `/experiments/studio/` | Usually `/experiments/studio/` |

**Voice**: always read `.claude/skills/share-my-work/references/voice.md` first. Same rules: British spelling, no em dashes in body copy, curly quotes, no hype words, "we" for the work and "I" for my own calls, sentence-case headlines that state a move.

## Workflow

### 1. Gather, and wait for the gist

Sources are usually a `JOURNAL.md` (one entry per round, the user's feedback in their own words) and a `process/NN-round/` folder of screenshots, plus a short gist from the user about the problem and what mattered. **Ask for the gist if it hasn't come**: it decides the framing, and the journal alone tends to produce a timeline.

Never invent a metric, date, quote or outcome. Every number on the page must trace back to the journal or the user. Quotes from the user can be tightened, not changed in meaning.

### 2. Find the crux and the decisions

- **The crux**: one or two sentences on why this mattered beyond the screen itself. Frame it as a product problem (what was missing, what it blocked), never as someone's dislike of it (for the datagrid: "Records are the core of the product, so nail the list once").
- **What "good" meant**: three short requirements, shown as notes under the crux.
- **The process**: 4–6 steps, plus the one artefact that shows how I worked (a design board, a review page).
- **Decisions**: 5–7 of them. Each one needs a tension ("where do filters live?"), a call, and a shot that proves it. A round that only polished something is a note, not a section.
- **Measured**: two to four before → after numbers, if the work was audited.
- **What I'd keep**: four lessons in the user's own words, each a short title plus one line (under ~12 words) with the crux in `<strong>`. No explaining: the sections above already did that.

Share this outline with the user before building if the story's direction isn't obvious.

### 3. Pick the shots

- **One decision per figure.** About 8–10 figures for the whole page. Fewer is better.
- **The newest, real UI wins.** Use the final state for each decision, and a before/after pair only when the change itself is the point.
- **One measure.** Every figure, clip, gallery and list sits at the text column's width. Don't break media out wider: mixed widths read as inconsistent on desktop. Dense UI relies on Enlarge, which every shot and recording has, and on tight crops.
- **Crop inside the shot's own card.** A capture of a rounded card brings its corners and backdrop along, which doubles up against the frame and looks chipped. Crop a few pixels inside the edge, and end each crop on a clean line, never through a row or a line of text.
- **Check the UI inside the shot, not just the frame.** Early prototype captures can carry bugs that were fixed later (icons stacked over button labels, clipped pills) and dev overlays (a floating data switcher, a request line over the footer). Pick the earliest snapshot where the UI renders cleanly, and crop overlays out, shadows included.
- **Crop to the decision.** Cut board labels, empty margins and browser chrome. A strip (a filter bar, a mid-drag frame) beats a full screen when the decision is small.
- **Before/after pairs share one framing**: same crop, same size, same data, so the toggle flips in place.
- **Never** use screenshots of another company's product (references the user collected), and never show real people's data unless the user has said it's fine.
- Prefer light theme; use a dark shot only when dark is part of the decision or the variety helps (like a gallery).

### 4. Make the media

Screenshots, with the bundled script (uses the repo's `sharp`; outputs `.webp`, never upscales):

```bash
node .claude/skills/ux-story/scripts/shots.mjs <manifest.json>
```

Keep the manifest in the session scratchpad, not the repo. Its format is documented at the top of `scripts/shots.mjs`; `crop` is `[left, top, width, height]` in source pixels. Copy the printed dimensions into each figure's `width`/`height`. Aim for ~30–80 KB per shot and well under 1 MB for the page.

Recordings: there is no ffmpeg on this machine. Use the bundled AVFoundation encoder, which trims, crops, scales and sets the bitrate, and writes a poster frame:

```bash
swift .claude/skills/ux-story/scripts/clip.swift in.mov public/images/.../clip.mp4 \
  --start 4.5 --duration 7.5 --width 1600 --kbps 1800 --poster <scratch>/clip.png
```

Then run the poster PNGs through `shots.mjs` to get `.webp` posters. macOS's `avconvert` also works for a quick trim, but its presets use a high bitrate (a 42s screen recording came out at 12.9 MB at 720p, against 5 MB at 1600px with `clip.swift`).

Before cutting, pull frames to map the timeline (a contact sheet every second), and check the edges for Dock tooltips, notifications and other apps: trim or crop them out. Write the alt text from the frames, not from memory.

- **Section clips**: one interaction each, 7–15s, about 1 MB, `autoplay` (plays only in view, loops, muted).
- **A full walkthrough**: fine as the hero, but click-to-play (no `autoplay`), so its few MB load only when someone asks.
- **The studio card loop**: ~8s, 960px wide, under 1 MB.

Media goes in `public/images/experiments/<slug>/` (or `public/images/work/<slug>/`).

### 5. Write the page

Use the components in `src/components/ux/`. They bring their own styles (`src/styles/ux-story.css`) and behaviour (`src/scripts/ux-story.ts`).

| Component | Use |
|---|---|
| `UxStory` | Wraps every section. Adds the lightbox and the script. Once per page. |
| `UxSection` | One decision: `id`, `num`, `kicker`, `title`, optional `notes` (array of `{ b, t }`), a `call` slot, an optional `quote` slot, media as children. |
| `UxShot` | One screenshot or recording, always at the text column's width (Enlarge opens either full size). `eager` only for the hero. `video={{ src, poster, autoplay }}` for recordings. |
| `UxCompare` | Before/after with a toggle. Falls back to both stacked without JS. |
| `UxGallery` | 2–4 shots side by side, each with a `label` and a `caption`. |

Plain-markup blocks styled by the same CSS: `ul.ux-cards` (with `li.is-focus` for the highlighted one), `ol.ux-steps`, `ul.ux-stats` (with `.ux-stat-num`), `ul.ux-lessons`, `blockquote.ux-quote`.

The page sits in `StudioLayout` (or `WorkLayout`): the lede in its `lede` slot with one `mark.hl`, three `facts`, and the hero `UxShot` in the `hero` slot (`eager wide`).

**Text budget**
- Lede: ≤ 50 words.
- Each `call`: ≤ 40 words, one `<strong>` phrase.
- Notes: 3 or 4 per section, a bold handle ending in a full stop, then ≤ 20 words.
- Captions: one line, ideally the section's quotable line ("Move the thing itself, not a picture of it.").
- One blockquote per page is plenty; the closer is a `blockquote.closer`.

**Alt text** says what the shot shows *and* what to notice: the state, the key labels, what's highlighted. Never "Screenshot of…". Captions add the takeaway; alt text doesn't repeat it.

### 6. Register it

- Studio story: add an entry at the top of `src/data/studio.ts` (newest first). `preview` can be a `video` loop (preferred), an `image` (a still, until a recording exists) or a `sketch`.
- Work story: follow the work index instead.
- The sitemap picks up new pages by itself.

### 7. Verify, then hand over

Build into the scratchpad (another session's dev server may hold port 4321) and serve it statically:

```bash
npx astro build --outDir <scratchpad>/dist && (cd <scratchpad>/dist && python3 -m http.server 4877)
```

Check in Playwright (co-presence's `node_modules/playwright`, with Chrome for Testing from `~/Library/Caches/ms-playwright/chromium-1243`) at 1440, 900 and 390 wide, light and dark:

- [ ] No horizontal overflow (`scrollWidth - innerWidth === 0`) at every width
- [ ] On load, only the hero image is requested; the rest load as you scroll
- [ ] No broken images, no console errors
- [ ] The lightbox opens from the keyboard, Escape and a backdrop click close it, and focus returns to the shot
- [ ] On a phone, the enlarged shot is readable and pans sideways
- [ ] The before/after toggle flips, with `aria-pressed` in step
- [ ] Recordings autoplay only in view, and not under reduced motion
- [ ] Voice self-check from `voice.md` (em dashes, quotes, British spelling)

Hand over with: the page URL path, what's assumed or marked `TODO:`, and where the user's recordings would slot in. Commit and push only when the user asks, and `git fetch` before pushing this repo.
