# Story format (`/work/<slug>/`)

References: `src/pages/work/strive-gen-ui-chat.astro` and `src/pages/work/report-builder.astro`. Copy the closer one wholesale (imports, `<WorkLayout>`, markup and `<style>`), then replace the content with the new project's. The values below are the Strive Studio ones, shown as examples. Fill each `<slot>` from the project details collected in SKILL.md.

## What a story is

It's a short deck of numbered slides, told as **my part** in the project rather than as product marketing. Each slide has a headline, two pointers and a drawing. It takes about three minutes to read. The long version lives in the blog, which the story links to at the end.

## Top matter (WorkLayout props)

```astro
<WorkLayout
  title="<Project> — <short descriptor>"   // e.g. "Strive Studio — agent-written live reports" (the one em dash allowed)
  description="…"        // 1–2 sentences for SEO: what it is + "told from the frontend side"
  ogDescription="…"      // shorter social version
  eyebrow="<Org or context> · <Role> · <Start> → <end or now>"   // e.g. "Strivelabs · Design engineer · 2026 → now", "Indie · Solo ed-tech experiment · 2021"
  heading="<Project>"                                            // just the product name
  facts={[
    { label: 'Role', value: '<role>' },       // e.g. 'Design engineer · frontend'
    { label: 'Status', value: '<status>' },   // e.g. 'In production, still shipping', 'Paused, not closed'
  ]}
  link={{ href: '<project url>', label: '<domain>' }}
  schema={{ name, url, description, inLanguage: 'en', keywords }}
>
  <ProjectSketch slot="sketch" />   // the same sketch as the home WorkCard
```

**The lede** is two or three sentences: what it does, with one `<mark class="hl">` phrase, then a comparison to something familiar, then the team line (or, for a solo build, an honest line about my role).

> Describe a marketing report in chat and get back a <mark class="hl">live dashboard</mark>, wired to your own ad and CRM data. Think Lovable for marketing, or Claude artifacts whose numbers never go stale. We built it as a small team; this is the frontend side.

> A marketing chat that answers in <mark class="hl">live interfaces, not paragraphs</mark>. We built it as a small team, all new to AI, and I got to play a big part on the frontend: research, prototypes, the design system and the UI we shipped. This is my side of the story.

## The slide

```astro
<section class="slide" aria-labelledby="s-bet">
  <header class="slide-head">
    <span class="slide-num" aria-hidden="true">02</span>
    <div><p class="slide-kicker">The bet</p><h2 id="s-bet">Let the model write HTML</h2></div>
  </header>
  <ul class="doodle-list slide-points">
    <li>Every new report layout meant <strong>another schema and another UI tool</strong>. Some reports can’t be written as JSON at all.</li>
    <li>So for reports we dropped schemas, and let the agent write what it knows best.</li>
  </ul>
  <SomeSketch />
</section>
```

Rules:

- **Numbers are two digits**: 01, 02 and so on. Aim for 6 to 8 slides, with lessons as the last one.
- **The kicker** is a mono label of 1 to 3 words. Patterns include "My role", "Backstory", "Foundations", "The bet", "Security", "Scale", "Shipping it", "Under the UI", "Misses &amp; lessons". A design decision gets **"Design call · <topic>"**.
- **The h2** is a headline of 2 to 6 words, following the patterns in voice.md.
- **Exactly two bullets.** Each is one or two short sentences with one `<strong>` phrase. The first bullet usually states the problem or context, and the second the move. The second often starts with "So…" or "Now…", or with a bold version label ("**v1 was its own chat**…", "**v2 made it a skill**…").
- **Exactly one drawing per slide**, placed after the bullets. See diagrams.md.
- Links inside bullets are fine, such as a link to the sibling story or a library.

### Optional slide extras

- **Debate or quote bubble** (`.qa`): a two-line chat for a pushback moment, with the team on the left and me on the right, or a single bubble for a quote from the CTO. Both avoid real names: the team is shown as three drawn faces and the CTO as one drawn face, with my portrait at `/images/portraits/me.webp`. Copy the markup and styles from the reference piece that has the variant you need.
  - Team: "Isn't that just a Claude copy?" → Me: "Claude set the standard, and this fixes our usability problems. If it's the right way to present, we use it and make what goes inside the panel ours."
- **Handwritten pointer to the blog** (`.more-note`), right-aligned in Caveat and coral: "There’s a lot more behind this call: what we tried, what we weighed, and why. The full story is in the blog →"
- **An intro glance figure** can sit before slide 01 (`<StudioGlance />`).

## The last slide: misses and lessons

Kicker "Misses &amp; lessons". The h2 is reflective: "What I'd tell day-zero me" or "What the first reports taught us". It holds four entries, rendered by the `lessons` array into leaning boxes:

```ts
const lessons = [
  { miss: 'Wrote 650 lines of CSS for the agent to learn.', lesson: 'Give it taste, not a stylesheet. Extend what models already write, like Tailwind.' },
  { miss: 'Asked the model for one giant JSON per answer.', lesson: 'Make complexity additive. One bad block should never sink the whole reply.' },
];
```

- **The miss** is a past-tense clause that owns the mistake with no excuses. It often drops the subject: "Rendered…", "Asked…", "Loaded every row on page load. Big accounts froze the tab."
- **The lesson** opens with a maxim, then adds one concrete sentence. "Familiar is a feature. Stand out on what goes inside the pattern."

## Ending

1. An optional `<blockquote class="closer">` with a one-line kicker: "A dashboard shows you numbers someone else chose. This builds the report you asked for, and keeps it alive."
2. **A deep-dive card** to the blog (`<a class="deep-dive wobbly wobbly--2">`) with the blog's whiteboard or cover image, and an eyebrow reading "Deep dive · ~N min read". Add the full blog title in `<strong>`, a one-line sub ("The backstory, the naming call, the bet on HTML, and everything that broke at scale."), and "Read the full story →".

## Home card

Add a `<WorkCard>` in `src/components/home/Work.astro`, in the right rail (company work or indie builds), following the existing entries:

- `accent`: pick a colour that isn't used by the neighbouring cards
- `when`: a short label
- `title`
- `tags`: two tags

The blurb is one or two sentences. **Show it to the user before you add it**, because the home copy is sensitive.
