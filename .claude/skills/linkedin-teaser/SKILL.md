---
name: linkedin-teaser
description: Turn a published portfolio story (/work/<slug>/) and blog (/writing/<slug>/) into a LinkedIn launch, meaning a short, personal post plus a short, silent (~22-second) animated teaser reel (1080×1350 MP4) drawn in the site's hand-drawn style with the story's colour coding. Use whenever the user asks for a LinkedIn post, a launch or announcement post, a teaser, reel or promo video for a project, or "something to share" once a story or blog is written. Usually runs right after share-my-work.
---

# LinkedIn teaser: the post and the reel

Once a project has its story and blog (see the `share-my-work` skill), Mariappan announces them on LinkedIn with two things:

1. **A short, personal post** that says why this one matters to them and points to the comments.
2. **A short, silent teaser reel** (~22s): the story's key highlights, shown as hand-drawn animations more than words, in the same colours as the story's figures. It's a teaser, made to get people to read further, not a summary.

Two launches set the style:

| Launch | Post | Reel | Notes |
|---|---|---|---|
| Pluggable UI for agents | in [references/post.md](references/post.md) | [examples/pluggable-agent-ui-reel.html](examples/pluggable-agent-ui-reel.html) | **The default shape.** 22.6s and 6 scenes, mostly drawings, with notes of a few words. |
| Strive Studio | in [references/post.md](references/post.md) | [examples/strive-studio-reel.html](examples/strive-studio-reel.html) | The quality bar for drawing and motion. Every scene is drawn and animated in code (28s, 7 scenes). |
| Strive AI | in [references/post.md](references/post.md) | not kept | The older style: a headline and a site screenshot per scene. Don't use it unless the user asks. |

Read [references/post.md](references/post.md) before writing the post and [references/reel.md](references/reel.md) before building the reel. They're the source of truth, and this file is a summary of them.

## Workflow

### 1. Read the published pieces

Start from what's already on the site, not from a fresh draft:

- `src/pages/work/<slug>.astro`: the eyebrow, lede, slide kickers, headlines and figcaptions. **The reel is cut from the story.**
- `src/pages/writing/<slug>.astro`: the one-liner, the opening backstory, and quotes (such as "a slightly wild idea from our CTO"). **The post is cut from the blog's opening.**
- The sketch components the story uses (`src/components/sketches/<project>/`) give the colour per idea: what's coral, blue, teal or ghost. The reel must use the same mapping.
- `src/data/writing.ts` and `src/components/home/Work.astro`: confirm the live URLs. The site is `https://mariappan.netlify.app`.
- Earlier launches in the same series (see the table above, or ask). A follow-up post links back with "Last week, I shared…".

Never invent a fact, number, date or quote. Everything in the post and the reel comes from the published pieces, or from the user.

### 2. One checkpoint before building

The voice is personal, so send one message with the following and wait for a go:

- **Post**: two or three full drafts (labelled A, B, C), each with a one-line rationale, plus your pick. Add the hashtags and the first-comment link block.
- **Reel**: a scene table with six rows (title, four highlights, end card): `time · tag · what's drawn · the motion · handwritten note · colours`. Say which story slide each scene comes from and which slides you left out.
- Any open questions, such as the series link, how to credit people, or whether to tag anyone.

Skip this step only if the user says to go straight to files.

### 3. Build the reel

- Work in `<slug>-teaser/` at the repo root, and start from [assets/reel-template.html](assets/reel-template.html). Keep the two examples open next to it. They're the quality bar for drawing, motion and pacing.
- Draw every scene in HTML, CSS and inline SVG. Animate each one as a pure function of time `t` inside `window.seek(t)`. See [references/reel.md](references/reel.md).
- Set up the renderer once per session, in the scratchpad:

  ```sh
  R=<scratchpad>/reel && mkdir -p $R && cp .claude/skills/linkedin-teaser/scripts/* $R/ && (cd $R && npm i --silent)
  ```

  It uses Playwright with the installed Google Chrome (`channel: 'chrome'`), plus `ffmpeg-static`.

### 4. Check stills, then render

1. Take stills: `(cd $R && node stills.mjs <abs>/reel.html <abs>/<slug>-teaser)`. With no times given, it takes one frame per scene, just before that scene fades out (the fully built state). Pass times such as `5.2 9.8` for mid-motion frames.
2. **Look at every still** with Read. Check for clipped or overlapping text, notes running into drawings, unreadable sizes, colours that don't match the story, and empty-looking frames.
3. Fix the problems, take the stills again, and then render: `(cd $R && node render.mjs <abs>/reel.html <abs>/<slug>-teaser/<slug>-teaser.mp4)`. That's about 840 frames, roughly 1.5 to 3 minutes. Run it in the background.
4. Keep one still from the strongest scene as `still-<t>.png`. It's useful as the cover image.

### 5. Hand over

Write `<slug>-teaser/post.md` with three parts, as text ready to paste: the post body, the hashtags and the first-comment block. In your reply, give:

- the paths to the MP4, the stills and `post.md`
- the reel's length and its scene list
- what you checked (stills reviewed, render finished, file size)
- anything left open

The `<slug>-teaser/` folder is a short-lived output, so don't commit it. Once the user has posted, offer to delete it. The skill keeps its own copies of the examples it needs. If a reel is good enough to become a new example, copy its `reel.html` into `examples/` before deleting the folder.
