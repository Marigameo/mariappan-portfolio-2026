---
name: share-my-work
description: Turn a rough draft about any project (bullets, notes, a pasted doc) into a portfolio story (/work/<slug>/) and/or a long-form blog post (/writing/<slug>/) in Mariappan's house style. Works for company, client, side and solo projects. Covers voice, word choice, punctuation, structure, and how the hand-drawn sketch diagrams are built. Use whenever the user pastes a draft and asks for a story, case study, project page, blog, write-up or post about their work, or asks to match the style of their existing pieces.
---

# Share my work: project stories and blogs

This is how Mariappan shares the projects they work on, whatever the project. The style was set by four published pieces, all about Strivelabs projects. They're **examples of the style, not its scope**, so carry the voice, shape and drawings over to any project, and leave the Strive specifics behind.

Read the reference that matches the job before writing. The references are the source of truth, and this skill is a summary of them.

| Piece | File | Format |
|---|---|---|
| Strive AI, story | `src/pages/work/strive-gen-ui-chat.astro` | Story (slide deck) |
| Strive Studio, story | `src/pages/work/report-builder.astro` | Story (slide deck) |
| Strive gen-UI engine, blog | `src/pages/writing/generative-ui-chat-engine.astro` | Blog (long form) |
| Strive Studio, blog | `src/pages/writing/strive-studio-frontend.astro` | Blog (long form) |

`context.md` at the repo root is the raw draft the Studio pieces grew from. [references/draft-to-final.md](references/draft-to-final.md) shows how that draft became the published copy, line by line. It's the quickest way to see the style at work.

## Read these before writing

1. [references/voice.md](references/voice.md): tone, word choice, punctuation, spelling, headline patterns. **Always read it.**
2. [references/story-format.md](references/story-format.md): for a `/work/` story.
3. [references/blog-format.md](references/blog-format.md): for a `/writing/` post.
4. [references/diagrams.md](references/diagrams.md): for any figure. Reuse an existing sketch component before you build a new one.

## Workflow

### 1. Work out what's being asked for

- **Story**: short and visual, and about *my part*. It runs as numbered slides with a drawing on each, and ends in a card that links to the blog.
- **Blog**: the full journey. Backstory, the options we weighed, the bet, what broke, lessons, a timeline, what's next, thanks.
- **Both** (the default when the draft is about a project): the story and the blog link to each other. The story is a summary of the blog, so write the blog first and cut the story down from it.

If the draft doesn't make this clear, ask once.

### 2. Pull the facts out of the draft

List the facts, dates, numbers, names, decisions and trade-offs the draft contains. **Never invent** a metric, date, quote, library name or outcome. If a section needs a fact the draft doesn't have, add a visible `TODO:` inside the copy and list it for the user. Quotes from people (the CTO, the team) must come from the draft. You can tighten the wording but not the meaning.

Also note what the draft leaves out that the format expects, such as misses, lessons or what's next, and ask for it rather than making it up.

**Project details.** Every project fills the same slots, so collect these from the draft, or ask for them:

| Slot | Example (Strive Studio) | Where it's used |
|---|---|---|
| Organisation or context | Strivelabs / a client / "Solo build · Experiment" | eyebrow, schema, thanks |
| Role | Design engineer · frontend | eyebrow, facts |
| Dates | 2026 → now | eyebrow, timeline |
| Status | In production, still shipping | facts |
| Link | strivelabs.ai | facts |
| Stack | React 19 · TypeScript · sandboxed iframes | blog facts |
| Team or solo | a small team | framing, thanks |
| Blog series label | Strivelabs engineering · Generative UI | blog eyebrow |

Use the project's own names and people (by role) throughout. Never carry "Strive", "Strivelabs", "our CTO" or `strivelabs.ai` into a project they don't belong to.

**Solo and side projects.** When there was no team, use an honest "I". Don't invent a "we", don't brag, and keep the humble tone ("A one-person experiment…", "Lots of fun and lessons to carry forward"). Thanks is optional: credit the people who helped (students, early users, friends) or leave it out. See the Thatpam and D for Doubts pages in `src/pages/work/` for solo framing.

### 3. One checkpoint before building

Voice on this site is personal, so the user shapes it before anything lands. In one message, send:

- the slide or section outline (kicker plus headline for each slide, or the h2 list for a blog)
- 2 or 3 options for the **title** and the **lede**, each with a one-line rationale, and your pick
- the list of figures, saying which existing component each one reuses and which are new
- any `TODO` facts and open questions

Wait for a go, then build. Skip this step only if the user says to go straight to files.

### 4. Build

- New files go in `src/pages/work/<slug>.astro` and/or `src/pages/writing/<slug>.astro`. New sketches go in `src/components/sketches/<project>/`.
- Copy the structure and `<style>` block of the closest reference piece. The deck styles are page-scoped, so a new story repeats them.
- Wire it up (ask first if the piece shouldn't be listed yet):
  - Story: a `<WorkCard>` in `src/components/home/Work.astro`
  - Blog: a book on the Tech shelf in `src/data/writing.ts`
  - The sitemap picks up new pages automatically.
- Change only what the draft covers. Don't reword neighbouring cards or other pieces while you're there.

### 5. Verify

- Run `pnpm build`. It must pass.
- Check light theme, dark theme and phone width (≤ 559px) in the browser for every new figure. Figures stack on a phone, and dark mode works only because everything uses tokens.
- Run the self-check at the bottom of [references/voice.md](references/voice.md) over every line of copy.
- In the recap, say what you verified and list any `TODO`s left in the copy.
