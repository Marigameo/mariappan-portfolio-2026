# The teaser reel

A silent, **short** (~22-second), hand-drawn animation that re-tells the story's key moves. It has the same paper, ink and colour coding as the story's figures, so anyone who clicks through recognises the drawings. It's a **teaser**: it shows the product moment, the bet and a few design calls, and saves the lessons and outcomes for the blog.

Two reels show the style. Open both before building:

- [../examples/pluggable-agent-ui-reel.html](../examples/pluggable-agent-ui-reel.html) is **the default shape**: 6 scenes in 22.6s, mostly drawings, with notes of three to five words. The user asked for exactly this: "keep it short, key highlights mostly as visuals, not too much text."
- [../examples/strive-studio-reel.html](../examples/strive-studio-reel.html) has 7 scenes in 28s. It's the quality bar for drawing and motion (typewriter, count-up, travelling packet, layout morph, docking). Its still at 23.5s is [../examples/strive-studio-still.png](../examples/strive-studio-still.png).

**Show it, don't say it.** If a drawing can make the point, cut the words. Each scene gets a tag, one drawing that moves, and at most one note of about five words. Use small labels inside the drawing only where the picture is ambiguous without them ("trigger · output · reset", "Content agent", "Developers → The agent").

## Format

| | |
|---|---|
| Canvas | 1080 × 1350 (4:5 portrait, which fills the most of the LinkedIn feed on a phone) |
| Length | **~20 to 23s** in total. The end card starts around 19s and holds ~3s. Go longer than 25s only if the user asks |
| Scenes | 6: a title, four highlights of 3.8 to 4.4s each, and the end card, with a 0.4s crossfade between them |
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
- **Placeholder content**: sand bars (`.bar`) stand in for text, so only the words that matter are real words. Any numbers are made up (₹312, 4,704), never customer data.
- **Sizes for a phone feed**: notes at 66 to 72px, serif questions at about 96px, the title at 150 to 170px, scene tags at 22px and UI labels at 30px or more. Nothing important goes below 26px.

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

## The arc

The scene tags reuse the story's slide kickers word for word, and each note is a compressed figcaption or maxim from the story. That ties the reel back to the page.

| # | Scene | Studio example | Pattern |
|---|---|---|---|
| 1 | **Title card** (~3.4s) | Orange sparkle, the eyebrow "Strivelabs · the story of", "Strive Studio" in serif, a coral underline drawn in, the hand note "live reports, written by an agent" | Always the same shape. The hand note is the project's one-liner in five or six words |
| 2 | **The product moment** (~5.4s) | A chat bubble types a prompt, then a live report card rises, KPIs count up, bars grow, the trend line draws and the LIVE dot pulses. Note: "chat in → live report out" | Act out the lede: what a user does and what they get back |
| 3 | **The bet** (~3.6s) | A serif question, "What if the agent just *wrote the HTML?*", then a `report.html` window fills with colour-coded code bars. Note: "no schemas. just a page." | The story's "The bet" slide. Highlight the key phrase in coral |
| 4 to 6 | **Three design calls** (~3.6 to 4.4s each) | **Security**: three lanes (Report, Host, Your data), and a coloured packet travels Report → Host, checks, → data → back. Note: "it can ask for anything, it can’t hold anything"<br>**Design context**: "the AI-dashboard tell" gets struck through as four equal dashed cards morph into one hero and three supporters. Note: "one hero, a few supporters"<br>**Shipping it**: Chat and Studio panels side by side, then Studio docks into Chat. "build apart…" then "…then fold it in" | Pick the slides whose idea **is a movement**. Make the motion the argument |
| 7 | **End card** (from ~24s, held ~4s) | The sparkle again, "The full story" in serif, "the blog + the story, in the comments", and a drawn arrow that bobs downwards | Always the same shape. Swap only the mono label |

**The default is shorter than Studio.** Use a title, then **four highlights**, then the end card. Fold the product moment and the bet into those four, or drop them. Skip a serif-sentence scene unless the bet can't be drawn. Pluggable UI used: Foundations (a command types out, then a folder tree with coral edit and teal ready chips), Abstractions (coral builder cards over a dashed line, blue hook pills, ghost internals sinking out of sight on a sand platform), Routes (one dashed three-screen template morphs into four coloured views for content and one card for sales), and Today (a four-step staircase from developers to the agent, with an arrow climbing it).

**Choosing slides.** Studio's story had nine slides, and the reel used four of them: the bet, security, design context and shipping it. It left out naming, scale, canvas and lessons. Leave out slides whose point is a list, a number, a timeline or a lesson, since those don't animate well and they belong in the blog. Keep the ones where something moves, transforms, travels or snaps into place.

## Motion

Everything is a pure function of `t`. The renderer calls `seek(t)` for each frame and screenshots it, so:

- **There are no CSS animations or transitions, no `requestAnimationFrame`, no `Date.now()` and no unseeded randomness.** Compute every style from `t` on every call. Pulses and spins are `Math.sin(t * k)` or `t * deg`.
- `SCENES = [[id, start, end], …]` sets each scene's opacity with a 0.4s fade in and out. The last scene's end is `99`, so it holds until `DURATION`.
- These helpers are in the template, and you should use them rather than writing new ones:
  - `p(t, a, b)`: progress from 0 to 1
  - `out`, `inout`, `back`: easing curves
  - `lerp`: interpolates between two values
  - `rise(el, t, start, dur, dy)`: fades the element in and slides it up
  - `pop(el, t, start, dur, fromScale)`: fades in and springs up from a smaller scale
  - `draw(path, x)`: draws an SVG stroke, with `x` from 0 to 1
  - `show(el, t, a, b)`: fades in at `a` and out by `b`
- **Typewriter**: `text.slice(0, round(len * p(...)))` plus a blinking caret.
- **Count-up**: `Math.round(target * out(p(...)))`.
- **Travelling packet**: `path.getPointAtLength(L * inout(x))`, with the dot coloured like the leg it's on.
- **Morph**: `lerp` between two layouts for `left`, `top`, `width` and `height`, and swap borders from dashed to solid at `m > .5`.
- **Pacing.** Within a scene, the tag and headline come in during the first 0.5s and the drawing builds over about 2.5s. The note lands last. Leave **at least 1s of hold** before the fade so it can be read. Stagger repeated items by 0.06 to 0.15s.
- **Two-beat notes.** When the payoff note arrives, dim the setup note to about 45%, as with "build apart…" and "the AI-dashboard tell".

## Build checklist

- [ ] The colour map is written down from the project's sketches, and every coloured element follows it
- [ ] Scene tags match the story's kickers, and notes are about five words or fewer, taken from figcaptions or maxims
- [ ] Every scene is drawn in HTML and SVG, with no screenshots of the site or the product, and the drawing carries the point, not the words
- [ ] The total length is about 20 to 23s, with a title, four highlights and the end card
- [ ] Data is made up, and no real names, logos or customer numbers appear
- [ ] The fonts link uses `display=block`, the renderer waits for `document.fonts.ready`, and `window.DURATION` and `window.SCENES` are set
- [ ] Stills were reviewed for every scene: nothing clipped, overlapping or under 26px, and each note has 1s or more of hold
- [ ] The title card and end card follow the fixed shape, and the end card says "in the comments"
