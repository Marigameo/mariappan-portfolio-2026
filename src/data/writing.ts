/* The library: one shelf per theme, each book is an article.
   `spine` is the short text on the spine; `title` is the full title (tooltip + aria-label).
   `bh` is the book height, `bw` an optional width. At most one `lean` book per shelf. */
export type BookColour = 'coral' | 'blue' | 'teal' | 'violet' | 'yellow' | 'sand';

export interface Book {
  href: string;
  title: string;
  spine: string;
  colour: BookColour;
  bh: string;
  bw?: string;
  lean?: boolean;
}

export interface Shelf {
  label: string;
  icon: string;       // doodle id for the label
  iconInk: string;    // ink-* colour class for the label icon
  deco: string;       // doodle id standing at the end of the shelf
  books: Book[];
}

export const shelves: Shelf[] = [
  {
    label: 'Tech',
    icon: 'lightbulb',
    iconInk: 'ink-blue',
    deco: 'coffee',
    books: [
      { href: 'https://thefours.substack.com/p/micro-frontend-scaling-frontend-in', title: 'Micro frontend: scaling frontend in the micro-services era', spine: 'Micro frontends at scale', colour: 'blue', bh: '13.5rem' },
      { href: 'https://medium.com/front-end-weekly/whats-new-with-vue3-5b6562d3898b', title: "What's new in Vue 3, a roundup", spine: "What's new in Vue 3", colour: 'sand', bh: '11.5rem', bw: '2.5rem' },
      { href: 'https://medium.com/geekculture/vite-witnessing-the-next-gen-frontend-tooling-part-1-a157f4033c33', title: 'Vite: witnessing the next-gen frontend tooling', spine: 'Vite: next-gen tooling', colour: 'yellow', bh: '12.5rem', lean: true },
      { href: 'https://medium.com/@mariappan/monorepos-at-scale-4cbfd221f352', title: 'Monorepos at scale', spine: 'Monorepos at scale', colour: 'coral', bh: '14.5rem', bw: '3.1rem' },
    ],
  },
  {
    label: 'Life',
    icon: 'coffee',
    iconInk: 'ink-coral',
    deco: 'plant',
    books: [
      { href: 'https://medium.com/@mariappan/thrissur-pooram-how-a-crowd-hater-accidentally-found-the-experience-of-a-lifetime-794e7f06cc70', title: 'Thrissur Pooram: how a crowd-hater accidentally found the experience of a lifetime', spine: 'Thrissur Pooram', colour: 'teal', bh: '14rem', bw: '3.1rem' },
      { href: 'https://medium.com/@mariappan/art-of-curating-confusions-and-dissatisfaction-f8815da69822', title: 'Art of curating confusions and dissatisfaction', spine: 'Curating confusions', colour: 'violet', bh: '12rem', lean: true },
      { href: 'https://medium.com/@mariappan/hovering-news-being-an-amateur-reader-2fd88442ce80', title: 'Hovering news being an amateur reader', spine: 'Hovering news', colour: 'coral', bh: '13rem', bw: '2.6rem' },
      { href: 'https://medium.com/@mariappan/thinking-the-right-way-8dcb66d648ed', title: 'Thinking — the right way', spine: 'Thinking the right way', colour: 'blue', bh: '13.5rem', bw: '2.8rem' },
    ],
  },
  {
    label: 'Product',
    icon: 'pin',
    iconInk: 'ink-teal',
    deco: 'camera',
    books: [
      { href: 'https://medium.com/@mariappan/thinking-through-linkedins-endorsement-feature-189cfb39c214', title: "Thinking through LinkedIn's Endorsement feature", spine: 'LinkedIn endorsements', colour: 'violet', bh: '13rem', bw: '3rem' },
      { href: 'https://medium.com/@mariappan/the-hey-fever-61d45b640f56', title: 'The {hey} fever', spine: 'The {hey} fever', colour: 'yellow', bh: '11.5rem', bw: '2.6rem', lean: true },
      { href: 'https://medium.com/@mariappan/arts-and-culture-journey-with-google-b9f45dccc19b', title: 'Arts and culture journey with Google', spine: 'Arts & culture, Google', colour: 'teal', bh: '14rem', bw: '3rem' },
    ],
  },
];
