# The teaser reel

A silent, **short** (~22–24-second) teaser that re-tells the story's key moves by **showing the real product**: real screenshots and recorded footage, framed in ink on the site's paper, with hand-drawn rings, arrows and notes in the story's colour coding. It's a **teaser**: it shows the product moment and a few design calls, and saves the lessons and outcomes for the blog.

**Real UI first.** Any scene that shows the product uses the real product (see [real-ui.md](real-ui.md) for sourcing, capture, privacy and legibility). Drawings are only for ideas that have no screen. This came from feedback on the earlier, fully drawn reels: *"Can you put the actual product pages instead of just the mocks?"*

Two drawn reels are still the bar for the paper look, pacing and motion. Open both before building, and borrow their framing, notes and timing, not their redrawn product:

- [../examples/pluggable-agent-ui-reel.html](../examples/pluggable-agent-ui-reel.html) has **the default shape**: 6 scenes in 22.6s, with notes of three to five words. The user asked for exactly this: "keep it short, key highlights mostly as visuals, not too much text."
- [../examples/strive-studio-reel.html](../examples/strive-studio-reel.html) has 7 scenes in 28s. It's the quality bar for motion in a drawn scene (typewriter, count-up, travelling packet, layout morph, docking). Its still at 23.5s is [../examples/strive-studio-still.png](../examples/strive-studio-still.png).

The template ([../assets/reel-template.html](../assets/reel-template.html)) carries the real-UI parts: a browser window and a phone frame, `camera()`, `clip()` + `retime()`, `ring()` and a before/after wipe.

**Show it, don't say it.** If the real UI can make the point, cut the words. Each scene gets a tag, one real (or drawn) thing that moves, and at most one note of about five words. Add a ring or arrow only where the eye wouldn't find the point by itself.

## Format

| | |
|---|---|
| Canvas | 1080 × 1350 (4:5 portrait, which fills the most of the LinkedIn feed on a phone) |
| Length | **~22 to 24s** in total. The end card starts around 20s and holds ~3s. Go longer than 26s only if the user asks |
| Scenes | 6: a title, four highlights of 4 to 5s each (real UI needs a beat longer than a drawing for the eye to find its way), and the end card, with a 0.4s crossfade between them |
| Output | H.264, yuv420p, 30fps, CRF 16, `+faststart`. Silent, with no audio track |
| Theme | Light only. It's a fixed render, so there's no dark mode to handle |

## Look

Copy the tokens and base classes from the template unchanged:

- **Paper**: `#fff9f1` with a faint dot grid (`radial-gradient … 34px 34px`).
- **Ink boxes**: `.box` has a 3px ink border, an `8px 9px 0` hard shadow and a wobbly `border-radius: 22px 12px 26px 14px / 14px 26px 12px 22px`.
- **Fonts**, each with one job:
  - **DM Serif Display** (`.serif`) for the title and the big question
  - **Space Grotesk** for UI labels inside the drawings
  - **JetBrains Mono caps** (`.mono`) for the scene tag at top left and file names
  - **Caveat** (`.hand`) for the handwritten notes
- **Real UI frames**: `.win` (a browser window with a sand title bar and URL pill) or `.phone`, both as an ink `.box` with the hard shadow. Real pixels go inside, and the paper stays around them.
- **Data in the UI**: demo or seed data only, never customer data (see [real-ui.md](real-ui.md#whats-safe-to-show)). In a drawn scene, sand bars (`.bar`) stand in for text and any numbers are made up (₹312, 4,704).
- **Sizes for a phone feed**: notes at 66 to 72px, serif questions at about 96px, the title at 150 to 170px, scene tags at 22px and drawn labels at 30px or more. Nothing important goes below 26px. **Real UI text that matters must be 18px or more on the canvas at the held moment**, so push the camera in until it is.

## Colour coding (the point of the reel)

Each colour means what it means in the story's sketches (see `share-my-work/references/diagrams.md`), and the meaning stays fixed for the whole reel. **Before drawing, read the project's sketch components and write down the map.** For Studio it was:

| Colour | Meaning in the Studio reel |
|---|---|
| coral `#d9573f` | the bet and the agent-written thing: the report, the trend line, the hero KPI's top border, the question's highlighted words, the strike-through, setup notes |
| blue `#2f5bd8` | the host or controlled side: the Host lane, the check marks, code tags |
| teal `#1a9a86` | data and good outcomes: "Your data", ▲ deltas, and the **payoff** notes ("no schemas. just a page.", "…then fold it in") |
| orange `#f26b1d` | the project's own accent: the sparkle star on the title and end cards, the report's top bar |
| green `#16a34a` | only for the LIVE pill |
| ghost (dashed, faint) | the old way, or the untrusted thing: dashed cards before the morph, the dashed sandboxed Report |
| sand `#eee8d2` / `#e4dcc2` | neutral surfaces: chat bubbles, panel headers, placeholder bars |

Notes use coral by default and **teal for a payoff**, so a two-beat scene reads as coral setup, then teal resolution.

On a real-UI scene, the product keeps its own colours. The map applies to what you draw over it: the ring, arrows, pills and the note.

## The arc

The scene tags reuse the story's slide kickers word for word, and each note is a compressed figcaption or maxim from the story. That ties the reel back to the page.

| # | Scene | Source | Pattern |
|---|---|---|---|
| 1 | **Title card** (~3s) | drawn | Orange sparkle, the eyebrow "Strivelabs · the story of", the name in serif, a coral underline drawn in, and the one-liner as a hand note in five or six words. Always the same shape |
| 2 | **The product moment** (~5s) | **real footage** | Act out the lede on the real product: a prompt typed, a click, and what comes back. Speed through the typing, play the reveal at 1x, then push the camera in on the result. Note: the lede in five words ("chat in → live report out") |
| 3 to 5 | **Three design calls** (~4 to 4.5s each) | **real UI**, or drawn if there's no screen | Show where the decision lives in the product. Fit the screen, push in, ring it, and land the note. Use a before → after wipe for a redesign, or a swap for states. Draw only the ideas with no screen: security lanes and a travelling packet, a layout system, a build pipeline |
| 6 | **End card** (from ~20s, held ~3–4s) | drawn | The sparkle again, "The full story" in serif, "the blog + the story, in the comments", and a drawn arrow that bobs downwards. Always the same shape. Swap only the mono label |

**How Studio would cut now.** The product moment would be `report-builder/studio-demo.mp4` (chat in, live report out), not a drawn report. "Design context" would ring the hero KPI on a real report screenshot, and "Shipping it" would be footage of Studio docking into Chat. "Security" has no screen, so it stays drawn (three lanes and a travelling packet). For Pluggable UI, "Foundations" would be `scaffold-demo.mp4` rather than a drawn command and folder tree.

**Choosing slides.** Studio's story had nine slides, and the reel used four of them: the bet, security, design context and shipping it. It left out naming, scale, canvas and lessons. Leave out slides whose point is a list, a number, a timeline or a lesson, since those don't animate well and they belong in the blog. Keep the ones where something visibly happens on screen, or where something moves, transforms or snaps into place. The bet only gets its own serif scene if no product shot can carry it.

## Motion

Everything is a pure function of `t`. The renderer calls `seek(t)` for each frame, waits for it, and screenshots it, so:

- **There are no CSS animations or transitions, no `requestAnimationFrame`, no `Date.now()` and no unseeded randomness.** Compute every style from `t` on every call. Pulses and spins are `Math.sin(t * k)` or `t * deg`.
- **`seek` is async.** Clip frames are swapped with `clip()`, which returns a decode promise. Push each one into `loads` and `await Promise.all(loads)` at the end, so no frame is captured half-loaded. Set `window.ready` (as the template does), and the renderer waits for it before frame 0. **Don't use a playing `<video>`**: its time isn't `t`. Turn videos into frame sequences with `frames.mjs`.
- `SCENES = [[id, start, end], …]` sets each scene's opacity with a 0.4s fade in and out. The last scene's end is `99`, so it holds until `DURATION`.
- These helpers are in the template, and you should use them rather than writing new ones:
  - `p(t, a, b)`: progress from 0 to 1
  - `out`, `inout`, `back`: easing curves
  - `lerp`: interpolates between two values
  - `rise(el, t, start, dur, dy)`: fades the element in and slides it up
  - `pop(el, t, start, dur, fromScale)`: fades in and springs up from a smaller scale
  - `draw(path, x)`: draws an SVG stroke, with `x` from 0 to 1
  - `show(el, t, a, b)`: fades in at `a` and out by `b`
  - `camera(stage, keys, t)`: pans and zooms a real screenshot or clip. Keys are `[t, x, y, scale]` in the capture's page px
  - `clip(img, dir, n, vt)`: shows frame `vt` (clip seconds) of a 30fps sequence
  - `retime(t, [[reelT, clipT], …])`: maps reel time to clip time, to speed up the dull parts and hold the result
  - `ring(path, x, y, w, h)`: a hand-drawn loop round a box in page px. Draw it on with `draw()`
- **Camera moves.** Hold the fit view for about 1s so the viewer knows where they are, push in over 0.8–1s with `inout`, and then hold. Don't pan and zoom at the same time as something changes in the UI, because the eye can only follow one of them.
- **Typewriter**: `text.slice(0, round(len * p(...)))` plus a blinking caret (in drawn scenes. In footage, the real typing is the typewriter).
- **Count-up**: `Math.round(target * out(p(...)))`.
- **Travelling packet**: `path.getPointAtLength(L * inout(x))`, with the dot coloured like the leg it's on.
- **Morph**: `lerp` between two layouts for `left`, `top`, `width` and `height`, and swap borders from dashed to solid at `m > .5`.
- **Pacing.** Within a scene, the tag comes in during the first 0.5s, and the real UI (or the drawing) does its thing over about 2.5s. The ring and then the note land last. Leave **at least 1s of hold** before the fade so it can be read. Stagger repeated items by 0.06 to 0.15s.
- **Two-beat notes.** When the payoff note arrives, dim the setup note to about 45%, as with "build apart…" and "the AI-dashboard tell".

## Build checklist

- [ ] Every scene that shows the product uses the real product (footage, a screenshot or a real render). Drawings are only used where there's no screen, and there are no more than two of them
- [ ] `public/images/work/<slug>/` and `process/` were checked for existing demo videos and renders before anything was captured or drawn
- [ ] The UI shows demo data only, with no customer names, emails, numbers or private conversations. The user said yes to each company screen, and `auth.json` (if one was made) is deleted
- [ ] At each held moment, the UI text that matters is 18px or more on the canvas. No scene holds on a fit-scale desktop page
- [ ] The colour map is written down from the project's sketches, and every ring, pill, note and drawn element follows it
- [ ] Scene tags match the story's kickers, and notes are about five words or fewer, taken from figcaptions or maxims
- [ ] The total length is about 22 to 24s, with a title, four highlights and the end card
- [ ] The fonts link uses `display=block`, `window.ready`, `window.DURATION` and `window.SCENES` are set, and `seek` awaits its clip frames
- [ ] Stills were reviewed for every scene, plus a mid-motion still for each clip and camera move: nothing clipped, overlapping, half-loaded or unreadable, and each note has 1s or more of hold
- [ ] The title card and end card follow the fixed shape, and the end card says "in the comments"
