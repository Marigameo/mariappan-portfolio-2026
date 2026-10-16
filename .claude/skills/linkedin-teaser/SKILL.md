---
name: linkedin-teaser
description: Turn a published portfolio story (/work/<slug>/) and blog (/writing/<slug>/) into a LinkedIn launch, meaning a short, personal post plus a short, silent (~22-second) animated teaser reel (1080×1350 MP4) that shows the real product UI (screenshots and recorded footage, framed on the site's hand-drawn paper with notes in the story's colour coding). Use whenever the user asks for a LinkedIn post, a launch or announcement post, a teaser, reel or promo video for a project, or "something to share" once a story or blog is written. Usually runs right after share-my-work.
---

# LinkedIn teaser: the post and the reel

Once a project has its story and blog (see the `share-my-work` skill), Mariappan announces them on LinkedIn with two things:

1. **A short, personal post** that says why this one matters to them and points to the comments.
2. **A short, silent teaser reel** (~22–24s): the story's key highlights, shown on **the real product** (recorded footage and screenshots, animated with camera moves, rings and wipes) inside ink frames on the site's paper, with hand-drawn notes in the story's colours. It's a teaser, made to get people to read further, not a summary.

**Real UI, not mocks.** Feedback on the earlier, fully drawn reels was: *"Can you put the actual product pages instead of just the mocks?"* It's UI work, so real pixels make the case. Drawings are kept only for ideas that have no screen. See [references/real-ui.md](references/real-ui.md).

Earlier launches set the style:

| Launch | Post | Reel | Notes |
|---|---|---|---|
| Agent clarifier | not kept | not kept | **The first real-footage reel.** Real recordings of the npm component in a drawn phone, the real before/after renders and the design board, with hand-drawn notes on top. The approach is now the default. |
| Pluggable UI for agents | in [references/post.md](references/post.md) | [examples/pluggable-agent-ui-reel.html](examples/pluggable-agent-ui-reel.html) | **The default shape** and pacing: 22.6s, 6 scenes, notes of a few words. Its product scenes are redrawn mocks; today they'd be real UI. |
| Strive Studio | in [references/post.md](references/post.md) | [examples/strive-studio-reel.html](examples/strive-studio-reel.html) | The quality bar for drawn motion (28s, 7 scenes). Same caveat: its report and docking scenes would now be the real `studio-demo.mp4`. |
| Strive AI | in [references/post.md](references/post.md) | not kept | The oldest style: a big headline over a static screenshot of the *portfolio site* per scene. Don't go back to it. Real UI now means the *product*, moving, in a frame, with the words cut to a note. |

Read [references/post.md](references/post.md) before writing the post, and [references/reel.md](references/reel.md) and [references/real-ui.md](references/real-ui.md) before building the reel. They're the source of truth, and this file is a summary of them.

## Workflow

### 1. Read the published pieces

Start from what's already on the site, not from a fresh draft:

- `src/pages/work/<slug>.astro`: the eyebrow, lede, slide kickers, headlines and figcaptions. **The reel is cut from the story.**
- `src/pages/writing/<slug>.astro`: the one-liner, the opening backstory, and quotes (such as "a slightly wild idea from our CTO"). **The post is cut from the blog's opening.**
- **The real UI the story already has.** Check `public/images/work/<slug>/` and `process/` for demo videos, screenshots and before/after renders, the story's live playgrounds, and any public URL, npm demo or Storybook for the product. Note which highlights have a real screen and which don't.
- The sketch components the story uses (`src/components/sketches/<project>/`) give the colour per idea: what's coral, blue, teal or ghost. The reel's rings, notes and drawings must use the same mapping.
- `src/data/writing.ts` and `src/components/home/Work.astro`: confirm the live URLs. The site is `https://mariappan.netlify.app`.
- Earlier launches in the same series (see the table above, or ask). A follow-up post links back with "Last week, I shared…".

Never invent a fact, number, date or quote. Everything in the post and the reel comes from the published pieces, or from the user.

### 2. One checkpoint before building

The voice is personal, so send one message with the following and wait for a go:

- **Post**: two or three full drafts (labelled A, B, C), each with a one-line rationale, plus your pick. Add the hashtags and the first-comment link block.
- **Reel**: a scene table with six rows (title, four highlights, end card): `time · tag · real UI source (footage / screenshot / existing video / drawn) · what's shown · the motion · handwritten note · colours`. Say which story slide each scene comes from and which slides you left out. Real UI is the default, so justify any drawn highlight in a few words ("no screen: it's the security model").
- **Screens to approve**: list each product screen you plan to show, with where it comes from (a URL, a file in the repo, or a recording you need from the user). For a company or logged-in product, ask whether it's OK to show and whether a demo workspace exists. Ask for a screen recording if you can't reach it yourself.
- Any open questions, such as the series link, how to credit people, or whether to tag anyone.

Skip this step only if the user says to go straight to files.

### 3. Build the reel

- Work in `<slug>-teaser/` at the repo root, and start from [assets/reel-template.html](assets/reel-template.html). It has the browser and phone frames, the camera, the clip player, the ring and the before/after wipe. Keep the two examples open for pacing and the drawn parts.
- Set up the renderer and capture scripts once per session, in the scratchpad:

  ```sh
  R=<scratchpad>/reel && mkdir -p $R && cp .claude/skills/linkedin-teaser/scripts/* $R/ && (cd $R && npm i --silent)
  ```

  It uses Playwright with the installed Google Chrome (`channel: 'chrome'`), plus `ffmpeg-static`.
- **Gather the real UI first** (see [references/real-ui.md](references/real-ui.md)), into `<slug>-teaser/shots/` and `<slug>-teaser/clips/`:
  - `shoot.mjs <url> <out.png>` for screenshots (`--el` crops to one component, `--full` captures a scroll)
  - `capture.mjs <url> <dir> --steps steps.mjs` records a real interaction as 30fps frames, with a visible cursor and taps
  - `frames.mjs <video> <dir>` turns the story's demo video, or the user's recording, into frames

  To run a local product or the portfolio itself, start its dev server. Look at a sheet of frames from each clip before building on it, and check every frame for private data.
- Build each scene in HTML, CSS and inline SVG around the real pixels, and animate it as a pure function of time `t` inside an async `window.seek(t)`. See [references/reel.md](references/reel.md).

### 4. Check stills, then render

1. Take stills: `(cd $R && node stills.mjs <abs>/reel.html <abs>/<slug>-teaser)`. With no times given, it takes one frame per scene, just before that scene fades out (the fully built state). Pass times such as `5.2 9.8` for mid-motion frames.
2. **Look at every still** with Read. Check for clipped or overlapping text, notes running into the UI, real UI text too small to read on a phone (under ~18px on the canvas), half-loaded clip frames, private data, colours that don't match the story, and empty-looking frames. Take mid-motion stills of each clip and camera move too.
3. Fix the problems, take the stills again, and then render: `(cd $R && node render.mjs <abs>/reel.html <abs>/<slug>-teaser/<slug>-teaser.mp4)`. That's about 700 frames, roughly 1 to 3 minutes. Run it in the background.
4. Keep one still from the strongest scene as `still-<t>.png`. It's useful as the cover image.

### 5. Hand over

Write `<slug>-teaser/post.md` with three parts, as text ready to paste: the post body, the hashtags and the first-comment block. In your reply, give:

- the paths to the MP4, the stills and `post.md`
- the reel's length and its scene list
- what you checked (stills reviewed, render finished, file size)
- which scenes are real UI and where each came from, and which are drawn and why
- anything left open

The `<slug>-teaser/` folder is a short-lived output, so don't commit it (its clips can run to hundreds of frames). Delete any `auth.json` straight after capturing. Once the user has posted, offer to delete it. The skill keeps its own copies of the examples it needs. If a reel is good enough to become a new example, copy its `reel.html` into `examples/` before deleting the folder.
