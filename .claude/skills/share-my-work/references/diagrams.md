# Diagrams and sketches

Figures in these pieces are **hand-drawn in markup and CSS**, not screenshots, Mermaid or exported images. Each one is a short Astro component made of leaning, ink-outlined boxes on a dashed paper "sheet". They use theme tokens only, so dark mode comes for free, and they stack on a phone. The one kind of image allowed is a real photographed whiteboard (`Whiteboard`).

## Principles

1. **One idea per figure.** The figure shows the move the section is making, such as a before and after, a loop, a fork, or who talks to whom. If a figure needs a legend, it's doing too much.
2. **Only the essentials, with made-up data.** Wireframe-level sketches of the real UI, with no real customer data and no brand screenshots.
3. **Drawn, not diagrammed.** Boxes lean (`sk-lean-1…4`), outlines are 1.5px ink with a 3px hard offset shadow, labels are mono caps, and asides are handwritten (Caveat) with a curly arrow.
4. **Colour means something**, and the meaning stays the same across a piece:
   - **coral**: the bet, our choice, the pivot, agent-written things, the one highlighted element
   - **blue**: the host, the controlled or owned side, context
   - **teal**: data, good outcomes, "now", lessons, `+` marks
   - **violet**: a fourth category, used sparingly
   - **ghost** (dashed, faint, no shadow): the path not taken, the old way, "before"
   - **grey** rail (timelines): everything before the pivot
5. **Stamps** are small hand-lettered labels rotated −6°, such as "the bet", "live" or "lazy". Use at most one per figure, on the winning side.
6. **Accessible**: the sheet gets `role="img"` and an `aria-label`, or the component gets an `alt` prop, written as **full sentences that narrate the whole figure**. Put `aria-hidden="true"` on decorative bits like "vs", arrows and faces.
7. **Every figure gets a figcaption.** It's one sentence, often the section's maxim: "Live should never mean heavy." / "The report can ask for anything. It can't hold anything." / "The price: every bug is ours. Worth it for the one surface everything else runs through."
8. **Phone first.** Multi-column figures collapse to one column at `max-width: 559px` (or 519px or 719px for wide rows). Rows of arrows turn 90°. The "vs" or "&" text centres between the stacked boxes.

## Reuse first: the component catalogue

Check these before writing a new figure. Components under `studio/` and `genui/` that take props are generic. They were first drawn for Strive, but they work for any project: import them from where they are, and don't copy them into the new project's folder.

| Need | Component | Props |
|---|---|---|
| Side-by-side comparison, before/after, two options | `studio/Versus.astro` | `left`, `right`: `{ title, tone: 'ghost'|'coral'|'blue'|'teal'|'violet', items[], stamp?, minus? }`, `mid` ('vs' or '&'), `marks` ('plus-minus' or 'dot'), `alt`, `caption` |
| A flow of 3 to 4 steps with a loop-back note | `studio/StudioLoop.astro` | `steps: { kicker, label, sub, tone }[]`, `note`, `caption`, `alt` |
| Who talks to whom (3 lanes) | `studio/Sequence.astro` | `lanes` (3 × `{ label, sub, tone }`), `steps: { from, to, label, note? }[]`, `alt`, `caption` |
| A months-long arc with a pivot | `genui/ArcTimeline.astro` | `phases: { label, tone: 'grey'|'coral'|'teal', items: { period, title, detail, pivot? }[] }[]`, `caption` |
| Code | `genui/Snippet.astro` | `caption`, `code` (pre-escaped HTML), `editor?` |
| Sentence-cell table | `genui/ProseTable.astro` | `caption`, with `<thead>`/`<tbody>` in the slot |
| Photographed whiteboard | `genui/Whiteboard.astro` | `src`, `width`, `height`, `alt`, `caption` (and it needs the lightbox `<dialog>` on the page) |
| Big numbers | `genui/StatGrid.astro` | none: copy it and change the `stats` const |

Project-specific shapes worth copying as a starting point:

- **Build or buy with a ghost option**: `strive/BuildVsOwn.astro`
- **A fork into two branches**: `studio/TwoKindsOfUI.astro`, `genui/HybridSplit.astro`
- **A layered stack** (widest at the bottom): `strive/FoundationStack.astro`
- **Wrapping step chips with an "…and round again" note**: `strive/RoleLoop.astro`
- **A UI before/after wireframe**: `strive/CanvasBeforeAfter.astro`, `studio/KpiEmphasis.astro`
- **Mini wireframe cards**: `studio/ReportArchetypes.astro`, `strive/AiElements.astro`
- **Many inputs into one place**: `studio/EntryPoints.astro`
- **v1 → v2 layout**: `studio/StudioToChat.astro`
- **An annotated anatomy** (margin labels): `genui/BlockAnatomy.astro`
- **Sticky-note highlights** at the top of a story: `studio/StudioGlance.astro`

## Building a new figure

Put it in `src/components/sketches/<project>/<Name>.astro` and follow this skeleton:

```astro
---
/* One or two sentences on what the drawing shows and why it's drawn this way
   (what's ghosted, what's coral, how it stacks on a phone). Every sketch opens
   with this comment. */
import Icon from '../../Icon.astro';
const items = [ /* data as a const, markup maps over it */ ];
---
<figure class="sk-fig">
  <div class="sk-sheet xx" role="img" aria-label="Full-sentence narration of the figure.">
    <div class="sk-box sk-box--coral sk-lean-1">
      <p class="sk-hdr">Mono label</p>
      …
    </div>
    <span class="sk-arrow" aria-hidden="true"><Icon name="arrow-right" /></span>
    <p class="sk-hand"><Icon name="arrow-curly" /> a handwritten aside</p>
  </div>
  <figcaption>One sentence, often the section's maxim.</figcaption>
</figure>

<style>
  /* Two-letter prefix per component (vs-, sl-, tk-, bvo-, fs-). Tokens only. */
  .xx { display: grid; grid-template-columns: 1fr auto 1fr; gap: 1rem; }
  @media (max-width: 559px) { .xx { grid-template-columns: 1fr; } }
</style>
```

### The global primitives (in `src/styles/style.css`)

- `.sk-fig`: the figure wrapper, with its margin.
- `.sk-sheet`: the dashed, sand-tinted paper. Use `.sk-sheet--bare` when you don't want the sheet.
- `.sk-box`: an ink-outlined card with a hard shadow. Set its tone with `.sk-box--coral|blue|teal|violet`, which sets `--c` for children to use, or make it `.sk-box--ghost`.
- `.sk-lean-1…4`: the wobbly radius plus a small rotation. Vary them across siblings, for example `sk-lean-${i + 1}`.
- `.sk-hdr`: a mono uppercase label at .62rem.
- `.sk-hand`: a Caveat handwritten note, which takes the colour in `--c` or falls back to coral.
- `.sk-arrow`: a faint arrow holder.
- `<Icon name="…" />` comes from `src/assets/doodles.svg`. The useful names are arrow-right, arrow-down, arrow-curly, check, close, sparkles, pen, lightbulb, book, mail, plane, slides, pin, star, zoom-in, dashes, asterisk and squiggle.

### The type scale inside figures

| Role | Size |
|---|---|
| Labels | mono, .58 to .64rem, `letter-spacing: .12–.14em`, uppercase |
| Box titles | .84 to .95rem, weight 500, `var(--ink)` or `var(--c)` |
| Sub text | .72 to .85rem, `var(--ink-faint)` |
| Handwritten notes | `var(--font-hand)`, 1.05 to 1.2rem |
| Big glyphs ("vs", "&") | `var(--font-display)`, 1.4rem, faint |
| Chips | a 999px radius on `var(--sand-2)`, .72rem |

### Colour and theming rules

- Use only tokens: `--ink`, `--ink-soft`, `--ink-faint`, `--line`, `--paper`, `--paper-2`, `--sand`, `--sand-2`, `--coral`, `--coral-soft`, `--blue`, `--teal`, `--violet`, `--yellow` and `--shadow-ink`. Don't hardcode hex values. The one exception is `#fff` on coral buttons.
- For tints, use `color-mix(in srgb, var(--teal) 10%, var(--paper-2))`.
- Check the figure in dark mode (`document.documentElement.dataset.theme = 'dark'`) and at phone width before calling it done.

## Placement

- **Stories**: exactly one figure per slide, after the two bullets.
- **Blogs**: a figure roughly every 2 to 4 paragraphs, placed straight after the paragraph that sets it up. A good setup line is short and hands over to the picture: "Here's how we sketched it." / "Before any of it existed, it looked like this."
- **The same figure in both pieces** is fine and encouraged. Use props for a shorter version in the story, for example `caption`, `only="result"` or fewer `items`, and a `detailed` version in the blog.
