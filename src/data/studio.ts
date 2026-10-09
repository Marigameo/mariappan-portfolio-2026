/* The studio: UI experiments, each told as a small story (the problem, what I
   changed, old vs new, the mistakes and what I learnt). Listed first on the
   Experiments page as a gallery of artboards (src/pages/experiments.astro); each
   artboard opens its story at /experiments/studio/<slug>/.

   To add one: push an entry here and write its page in
   src/pages/experiments/studio/<slug>.astro. The artboard shows `preview`: a
   short muted loop of the new UI (played on hover, or once in view on touch
   screens), or a hand-drawn sketch (picked in experiments.astro) until a
   recording exists. Keep loops ~8s and under ~1 MB, with a poster. */

export interface StudioPiece {
  slug: string;
  title: string;
  /** Mono line under the title, e.g. "Strivelabs · Knowledge base". */
  context: string;
  /** The frame name above the artboard, like a Figma frame label. */
  frame: string;
  /** One line for the card: the problem in brief. */
  hook?: string;
  tags: string[];
  accent: 'coral' | 'blue' | 'teal' | 'violet';
  preview:
    | { kind: 'sketch'; sketch: 'kb-graph' | 'kb-props'; alt: string }
    | { kind: 'video'; src: string; poster: string; width: number; height: number; alt: string };
}

export const studio: StudioPiece[] = [
  {
    slug: 'kb-homepage',
    title: 'Redesigning the KB homepage',
    context: 'Strivelabs · Knowledge base',
    frame: 'KB / Home',
    hook: 'Making a draggable graph of a tenant’s knowledge feel calm next to two sidebars.',
    tags: ['Navigation', 'Graph view'],
    accent: 'teal',
    preview: {
      kind: 'video',
      src: '/images/experiments/kb/loop.mp4',
      poster: '/images/experiments/kb/loop-poster.webp',
      width: 960,
      height: 500,
      alt: 'The live knowledge base home in Strive: both sidebars open, and a graph of soft folder circles and file pills. Hovering a file shows its details, then the Recent panel opens and closes.',
    },
  },
  {
    slug: 'kb-frontmatter',
    title: 'Designing frontmatter for KB pages',
    context: 'Strivelabs · Knowledge base',
    frame: 'KB / File',
    hook: 'Showing a file’s properties as part of the page, not a form beside it.',
    tags: ['Editing', 'Frontmatter'],
    accent: 'coral',
    preview: {
      kind: 'sketch',
      sketch: 'kb-props',
      alt: 'Sketch of a knowledge base file in Strive: a header with the file’s icon, title and folder, three property rows with one being edited in place, and the doc below in the same card.',
    },
  },
];

export const studioHref = (p: StudioPiece) => `/experiments/studio/${p.slug}/`;
