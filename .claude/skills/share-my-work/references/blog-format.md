# Blog format (`/writing/<slug>/`)

References: `src/pages/writing/strive-studio-frontend.astro` (about 10 minutes, the newest and cleanest) and `src/pages/writing/generative-ui-chat-engine.astro` (about 15 minutes, which also has the tables, stats and research extracts). Copy the closer one's scaffold. The values below are from the Strive pieces and are examples; use the new project's details.

## Top matter (PostLayout props)

```astro
<PostLayout
  title="Building live reports inside Strive: the story of Strive Studio"   // "<hook>: <what it is>"
  description={description}          // 1–2 sentences: the arc of the post
  ogDescription="…"
  heading="…same as title…"
  eyebrow="<Series or org> · <Topic>"   // e.g. "Strivelabs engineering · Generative UI"; for side projects, e.g. "Indie build · <Topic>"
  published="2026-09-25"  publishedLabel="September 2026"
  keywords="…comma list…"
  facts={[
    { label: 'Stack', value: 'React 19 · TypeScript · sandboxed iframes' },
    { label: 'Read', value: '~10 minutes' },
  ]}
  elsewhere={[…]}   // only if it's also published elsewhere; then add { label: 'Originally', … } to facts
>
```

**Titles** follow the shape "hook: plain description". For example: "From answers to UI: how we built Strive’s generative UI engine" and "Building live reports inside Strive: the story of Strive Studio".

**The lede** is a single paragraph that previews the arc, with one `mark.hl`: "How a chat that could already share insights grew a studio for <mark class="hl">live reports</mark>. The backstory, the naming call that let both live side by side, the bet on letting the agent write HTML, and everything that broke once people started using it."

## The spine

Not every post uses every section, but they come in this order:

1. **Opening paragraph.** Put the product name in `<strong>` and say what it is in plain terms, then give a one-line `<blockquote>` ("A chat that answers in UI, not just text." / "Think Claude artifacts, but the numbers never go stale."). A reflective post can add a sentence saying what it covers: "This post is a reflection on the full ride: how it started, …"
2. **The one-liner** (h2 "The one-liner"). Explain the whole mechanism in two or three sentences, followed by the loop or overview figure. This can come before or after the backstory.
3. **A little bit of backstory** (h2). Cover where it came from, who spotted it (a founder, lead or teammate, by role, quoted in a blockquote), the date it started, and the whiteboard photo if there is one. The h3 subsections cover v1 and "Where v1 ran out", or the options we evaluated ("Vercel AI SDK: the obvious first stop", "SPA or Next.js?", "The rest of the field").
4. **The decision or bet** (h2, a claim). Give the reasons as a bold-lead list, then an honest aside ("We're not against frameworks. This one just works for us."), then a figure.
5. **How it works** (h2s named for the problem: "Hosting a page we didn't write"). Include the figure, a `Snippet` if code helps, and the rules as a bold-lead list. End with a blockquote maxim.
6. **What broke / Where it started to hurt** (h2). Give each failure an h3, then say briefly what it was, why it hurt, and what we did. Before/after `Versus` figures work well here. Finish with the reframe: "Read together, those aren't five bugs. They're one: …"
7. **The pivot or fold-in** (h2), if there was one. Include the date in bold, the POC ("A small POC first", with questions as a list), and "What we landed on".
8. **The small things that make it feel native** (h2, optional). This is a list of UX details, the design-engineer's corner.
9. **What I'd keep / Seven lessons worth keeping** (h2). Use `<ol class="doodle-list doodle-list--num">` with 5 to 7 items. Each item is "**Maxim.** One sentence of evidence."
10. **N months on one timeline** (h2). Use `<ArcTimeline phases={…} caption="…" />`: a grey phase for before, coral for the bet, teal for after.
11. **Where it stands today** (optional), with a `StatGrid`, followed straight away by "The numbers are the least interesting part."
12. **What's next** (h2). Give a short bold-item list, then end on a forward line: "They won't be the last." / "And honestly, it feels like we're just getting started."
13. **Thanks** (h2), one paragraph: "<Product> is a team effort, from … to … Thanks to the whole team at <Org> for building it together." For a solo project, thank whoever helped (users, students, friends) or drop the section.
14. **The back-to-story callout**, if there's a story page:
    ```astro
    <aside class="back-to-story callout wobbly wobbly--3" aria-label="The short version">
      <Icon name="slides" />
      <div><strong>The short version</strong><p>One slide per chapter, a drawing on each: <a href="/work/<slug>/">… on the work page</a>.</p></div>
    </aside>
    ```
15. **The lightbox `<dialog>`** at the end, if any `Whiteboard` is used. Copy it from the reference.

## Paragraph rhythm

- Keep paragraphs to one to three sentences. Single-sentence paragraphs are normal.
- A figure or list roughly every 2 to 4 paragraphs. Don't run five paragraphs of prose in a row.
- Use h3 inside an h2 for sub-stories. Never go below h3.
- Mention deferred topics honestly: "That part deserves its own post, coming soon." / "…is a story of its own. We'll write that one up separately."

## Code samples

Use `<Snippet caption="…" code={…} />` with **pre-escaped HTML** in a frontmatter const. Wrap comments in `<span class="c">`, keywords in `<span class="k">` and strings in `<span class="s">`, and escape `<`, `>` and `"` as entities. Add `editor` to get line numbers when showing "a file being read". The caption is a short sentence-case label: "Three checks before acting on a message", "The theme, roughly". Show the shape of the code, not the production source, and say so in the frontmatter comment.

## Tables

Use `<ProseTable caption="…">` with `<thead>` and `<tbody>`, and put the row label in `<th scope="row">`. Keep cells to short sentences. Use it for comparisons like symptom → root cause → fix.

## Shelf entry

Add a book to the Tech shelf in `src/data/writing.ts`:

- `href: '/writing/<slug>/'`
- `title`: the full title
- `spine`: 3 or 4 words
- `colour`: one that isn't used by its neighbours
- `bh`: between `12rem` and `14.5rem`
- `bw`: optional

Also add a frontmatter comment at the top of the page that says what the piece is and where its figures live, like the references do.
