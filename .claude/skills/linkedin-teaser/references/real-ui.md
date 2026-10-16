# Real UI in the reel

Feedback on the earlier launches: *"Can you put the actual product pages instead of just the mocks?"* It's UI work, so the reel should **show the real UI**. Redrawn mocks can't prove the craft. Real pixels can.

So the default has flipped. **Every scene that shows the product shows the real product**: a screenshot, or recorded footage, framed on the reel's paper with hand-drawn rings, arrows and notes on top. Drawings are kept only for ideas that have no screen, such as an architecture, a flow between systems, or the bet. That's at most one or two scenes.

The look stays the same: paper, ink frames, Caveat notes and the story's colour coding. Only what's inside the frame changes, from drawn bars to real pixels.

## Where the real UI comes from

Try these in order, and say in the scene table which source each scene uses.

| # | Source | When | How |
|---|---|---|---|
| 1 | **The live product, recorded** | It runs at a URL you can open: a public site, an npm demo, Storybook, the portfolio's own live playgrounds, or `localhost` | `capture.mjs` with a steps file (see below) |
| 2 | **Media the story already ships** | Nearly always. Look in `public/images/work/<slug>/` and `process/` for demo videos (`*-demo.mp4`), screenshots and before/after renders | `frames.mjs` for a video, or use the image as it is |
| 3 | **A screenshot of the live product** | A static screen makes the point, or the page is long enough to scroll through | `shoot.mjs` (`--el` for one component, `--full` for a scroll) |
| 4 | **A recording from the user** | The product is behind a login or holds customer data, as company products (Strivelabs) usually do | Ask for a short screen recording (QuickTime, ~1440px wide, demo workspace) or screenshots, then `frames.mjs` |
| 5 | **A drawing** | The idea has no screen | As before (see [reel.md](reel.md)) |

Earlier launches redrew things that already existed as real footage. Studio's reel drew the report building itself while `report-builder/studio-demo.mp4` sat in the repo, and Pluggable UI's reel did the same beside `pluggable-agent-ui/scaffold-demo.mp4`. Check the folder first.

## What's safe to show

Real UI can leak things that a mock never would. Before capturing, and again on every still:

- **Use demo or seed data only.** No customer names, emails, company names, revenue or real conversations. If a real account is the only way in, stop and ask the user. Don't capture it "just to see".
- **Ask before showing an unreleased or internal company product.** Name the screens you plan to show in the checkpoint, and get a yes for each one.
- **Hide the noise**: cookie bars, chat widgets, staging banners and personal avatars. Use `--hide ".sel1,.sel2"`, or cover a region in the reel with a sand bar.
- **Logins:** never ask for or type a password. If the user agrees to a capture of a logged-in page, have them run `npx playwright codegen --channel chrome --save-storage=<scratchpad>/auth.json <url>` (it opens a browser, they log in, and closing it saves the session). Then pass `--auth <scratchpad>/auth.json`. **Delete `auth.json` once the captures are done**, since it holds live session cookies.

## Capturing

Set up the renderer as in SKILL.md. `$R` holds all the scripts. Put the outputs in `<slug>-teaser/shots/` and `<slug>-teaser/clips/<name>/`.

```sh
# a still: the whole viewport, one element, or the full page for a scroll scene
node shoot.mjs <url> <abs>/<slug>-teaser/shots/hero.png [--el "#playground"] [--full] [--mobile]

# footage: drive the real UI with a steps file, recorded with a slowed clock and resampled to 30fps
node capture.mjs <url> <abs>/<slug>-teaser/clips/demo --steps <abs>/<slug>-teaser/steps.mjs [--mobile]

# an existing video, cut to the moment you need
node frames.mjs public/images/work/<slug>/<name>-demo.mp4 <abs>/<slug>-teaser/clips/demo --from 2.5 --to 8
```

- **Viewport.** Captures default to 1280×960 at 2x, which fits the template's browser window (952×714 view at scale .744). Use `--mobile` (390×780) for anything responsive or chat-shaped. A phone frame reads better on a phone feed, and its text comes out bigger.
- **Steps file.** Its default export gets `{ page, wait, mark, click, tap, type, K }`. `click` glides a visible cursor to the element before clicking. `tap` shows a touch disc on mobile. `wait(ms)` and `type` take real-speed times, and the helpers handle the slow-down. Call `mark('name')` at the beats you'll cut to. `events.json` lists them in clip seconds, so you can time notes and camera moves against them. See the header of `capture.mjs` for an example.
- **Smoothness.** The script prints how many screenshots it got per virtual second. If that's under ~30, raise `--k` (6 or 8) so every step of a short transition is caught.
- **Check the footage** before building on it: tile a few frames into a sheet with ffmpeg and look at it. Is the cursor visible, did the clicks land, does the UI really change?

## Making a still move

A held screenshot is a slide, not a reel. Each real-UI scene needs one motion that carries its point:

| Motion | Use it for | In the template |
|---|---|---|
| **Footage plays** | The product moment: what the user does and what comes back | `clip()` + `retime()`. Speed through the typing (2–3x), then play the reveal at 1x and hold the result |
| **Camera push** | Pointing at a detail after showing the whole | `camera()` keys `[t, x, y, scale]` in page px. Fit first (`.744`), then push to 1.2–1.6 on the detail |
| **Scroll-through** | A long page or a story's slides | A `--full` shot with the camera's `y` keyed down the page |
| **Ring + note** | "This is the design call" | `ring()` round the element's box (page px), drawn on with `draw()`. It sits in the stage, so it follows the camera |
| **Before → after wipe** | A redesign or a design-review fix | Two stages with a clip-path wipe and before/after pills |
| **Swap** | States of one component (empty → loading → done, light → dark) | Several shots in one stage, crossfaded |

## Legibility on a phone feed

The reel is watched on a phone, about 360px wide, so the 1080 canvas shrinks to a third of its size.

- **Never hold on a fit-scale desktop page.** At scale .744, 14px UI text comes out at about 10px on the canvas, which is unreadable. Show the whole page for a beat at most, then push in.
- **At the held moment, the text that matters should be 18px or more on the canvas.** Pick the scale from that: 14px UI text needs a scale of about 1.3, and 12px needs about 1.5. The 2x captures stay sharp up to about 2x zoom.
- Prefer **cropping to the component** (`--el`) or a **phone viewport** over a full desktop page.
- **Fit the frame to the shot.** A wide, short shot in the 4:3 window leaves dead white space, so either shorten the window or push in until the shot fills it.
- Pills and labels sit over the UI. Put them in a quiet corner, and check in the stills that they don't cover the words that matter.

## Colour coding on real UI

The product's own colours are what they are. The story's colour map now lives in what you **draw over** the UI: the ring, the arrow, the note and the pill. Coral marks the design call or the bet, and teal marks the payoff (an "after" pill, or the resolving note). Keep these marks thick (6px or more) and few: one ring per scene.
