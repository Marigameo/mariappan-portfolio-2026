/* The library: one shelf per theme, each book is an article.
   `spine` is the short text on the spine; `title` is the full title (tooltip + aria-label).
   `bh` is the book height, `bw` an optional width. At most one `lean` book per shelf.
   `featured` books (2–3 per shelf) are the ones on the homepage shelf; the rest wait on the full list.
   `dek` (one line) and `read` (e.g. "10 min") fill the open book beside the homepage shelf and the
   rows on /writing/. `date` (ISO, when known) orders the list there, newest first. */
export type BookColour = 'coral' | 'blue' | 'teal' | 'violet' | 'yellow' | 'sand';

export interface Book {
  href: string;
  title: string;
  spine: string;
  colour: BookColour;
  bh: string;
  bw?: string;
  lean?: boolean;
  featured?: boolean;
  dek?: string;
  read?: string;
  date?: string;
}

export interface Shelf {
  label: string;
  icon: string;       // doodle id for the label
  iconInk: string;    // ink-* colour class for the label icon
  hue: 'coral' | 'blue' | 'teal' | 'violet'; // the theme's colour: every spine on the homepage shelf is a shade of it
  deco: string;       // doodle id standing at the end of the shelf
  books: Book[];
}

export const shelves: Shelf[] = [
  {
    label: 'Tech',
    hue: 'blue',
    icon: 'lightbulb',
    iconInk: 'ink-blue',
    deco: 'coffee',
    books: [
      { href: 'https://thefours.substack.com/p/micro-frontend-scaling-frontend-in', title: 'Micro frontend: scaling frontend in the micro-services era', spine: 'Micro frontends at scale', colour: 'blue', bh: '13.5rem' },
      { href: 'https://medium.com/front-end-weekly/whats-new-with-vue3-5b6562d3898b', title: "What's new in Vue 3, a roundup", spine: "What's new in Vue 3", colour: 'sand', bh: '11.5rem', bw: '2.5rem' },
      { href: 'https://medium.com/geekculture/vite-witnessing-the-next-gen-frontend-tooling-part-1-a157f4033c33', title: 'Vite: witnessing the next-gen frontend tooling', spine: 'Vite: next-gen tooling', colour: 'yellow', bh: '12.5rem', lean: true },
      { href: 'https://medium.com/@mariappan/monorepos-at-scale-4cbfd221f352', title: 'Monorepos at scale', spine: 'Monorepos at scale', colour: 'coral', bh: '14.5rem', bw: '3.1rem', read: '6 min', date: '2023-01-21' },
      { href: '/writing/monorepo-migration/', title: 'How we migrated Freshworks’ critical monorepo tackling tech debts', spine: 'Migrating a monorepo', colour: 'teal', bh: '13rem', bw: '2.7rem', featured: true, dek: 'One codebase, two experiences: paying down the tech debt behind Freshworks Marketplace.', read: '10 min', date: '2026-09-14' },
      { href: '/writing/generative-ui-chat-engine/', title: 'From answers to UI: how we built Strive’s generative UI engine', spine: "Strive's gen-UI engine", colour: 'violet', bh: '14rem', bw: '3.2rem', featured: true, dek: 'Why one big JSON document hit a ceiling, and what changed when every component became its own tool call.', read: '15 min', date: '2026-09-20' },
      { href: '/writing/strive-studio-frontend/', title: 'Building live reports inside Strive: the story of Strive Studio', spine: 'Building Strive Studio', colour: 'blue', bh: '13rem', bw: '2.9rem', featured: true, dek: 'How a chat grew a studio for live reports, and the bet on letting the agent write HTML.', read: '10 min', date: '2026-09-25' },
      { href: '/writing/agent-ui-evolution/', title: 'Who writes the UI? How agent interfaces evolved in Strive', spine: 'Who writes the UI?', colour: 'teal', bh: '13.5rem', bw: '2.8rem', dek: 'From a scaffold and three hooks for agent builders to agents writing their own UI.', read: '12 min', date: '2026-10-02' },
      { href: '/writing/brand-kit/', title: 'Read once, used everywhere: a brand kit for every Strive customer', spine: 'A brand kit, read once', colour: 'coral', bh: '12.5rem', bw: '2.8rem', dek: 'Reading a brand off a customer’s website, and keeping a guessed colour out of a report.', read: '10 min', date: '2026-10-03' },
      { href: '/writing/component-registry/', title: 'Bones before blocks: how I set up Strive’s component registry', spine: 'Bones before blocks', colour: 'yellow', bh: '13rem', bw: '2.7rem', dek: 'How patterns we kept rebuilding became a small component registry that powers Strive.', read: '8 min', date: '2026-10-08' },
      // From the Medium feed (dates and read times as Medium lists them).
      { href: 'https://medium.com/@mariappan/adding-sitemaps-to-a-next-js-project-52177664f283', title: 'Adding sitemaps to a Next.js project', spine: 'Sitemaps in Next.js', colour: 'sand', bh: '12rem', read: '3 min', date: '2024-12-07' },
      { href: 'https://medium.com/@mariappan/eyes-on-interop2023-30166b32ee2c', title: 'Eyes on: Interop 2023', spine: 'Eyes on Interop 2023', colour: 'blue', bh: '12.5rem', read: '6 min', date: '2024-01-05' },
      { href: 'https://medium.com/@mariappan/authoring-a-vite-plugin-52cedf5aa07e', title: 'Authoring a Vite plugin', spine: 'Authoring a Vite plugin', colour: 'yellow', bh: '12.5rem', read: '2 min', date: '2023-02-02' },
      { href: 'https://medium.com/@mariappan/maintaining-web-accessibility-in-your-vue-nuxt-applications-6d970429c197', title: 'Maintaining web accessibility in your Vue/Nuxt applications', spine: 'Accessible Vue apps', colour: 'teal', bh: '13rem', read: '4 min', date: '2022-10-22' },
      { href: 'https://medium.com/freshworks-developer-blog/localiz-s-ing-your-marketplace-apps-with-crayons-32761e282320', title: 'Localiz(s)ing your Marketplace apps with Crayons', spine: 'Localising with Crayons', colour: 'coral', bh: '12rem', read: '2 min', date: '2022-06-05' },
      { href: 'https://medium.com/@mariappan/how-does-google-authenticator-work-c520035ec2', title: 'How does Google Authenticator work?', spine: 'Google Authenticator', colour: 'violet', bh: '12.5rem', read: '2 min', date: '2022-05-08' },
      { href: 'https://medium.com/front-end-weekly/what-makes-pinia-the-new-default-d29c5359de15', title: 'What makes Pinia the new default?', spine: 'Pinia, the new default', colour: 'blue', bh: '13rem', read: '5 min', date: '2022-04-12' },
    ],
  },
  {
    label: 'Life',
    hue: 'coral',
    icon: 'coffee',
    iconInk: 'ink-coral',
    deco: 'plant',
    books: [
      { href: 'https://medium.com/@mariappan/thrissur-pooram-how-a-crowd-hater-accidentally-found-the-experience-of-a-lifetime-794e7f06cc70', title: 'Thrissur Pooram: how a crowd-hater accidentally found the experience of a lifetime', spine: 'Thrissur Pooram', colour: 'teal', bh: '14rem', bw: '3.1rem', featured: true, dek: 'A crowd-hater follows one Instagram picture to a two-century-old festival of elephants, drums and colour.', read: '7 min', date: '2025-10-19' },
      { href: 'https://medium.com/@mariappan/art-of-curating-confusions-and-dissatisfaction-f8815da69822', title: 'Art of curating confusions and dissatisfaction', spine: 'Curating confusions', colour: 'violet', bh: '12rem', lean: true, featured: true },
      { href: 'https://medium.com/@mariappan/hovering-news-being-an-amateur-reader-2fd88442ce80', title: 'Hovering news being an amateur reader', spine: 'Hovering news', colour: 'coral', bh: '13rem', bw: '2.6rem' },
      { href: 'https://medium.com/@mariappan/thinking-the-right-way-8dcb66d648ed', title: 'Thinking — the right way', spine: 'Thinking the right way', colour: 'blue', bh: '13.5rem', bw: '2.8rem', featured: true },
    ],
  },
  {
    label: 'Product',
    hue: 'teal',
    icon: 'pin',
    iconInk: 'ink-teal',
    deco: 'camera',
    books: [
      { href: 'https://medium.com/@mariappan/thinking-through-linkedins-endorsement-feature-189cfb39c214', title: "Thinking through LinkedIn's Endorsement feature", spine: 'LinkedIn endorsements', colour: 'violet', bh: '14.2rem', bw: '3rem', featured: true },
      { href: 'https://medium.com/@mariappan/the-hey-fever-61d45b640f56', title: 'The {hey} fever', spine: 'The {hey} fever', colour: 'yellow', bh: '11.5rem', bw: '2.6rem', lean: true, featured: true },
      { href: 'https://medium.com/@mariappan/arts-and-culture-journey-with-google-b9f45dccc19b', title: 'Arts and culture journey with Google', spine: 'Arts & culture, Google', colour: 'teal', bh: '14rem', bw: '3rem', featured: true },
    ],
  },
];

/* Every piece as one list for /writing/: newest first where the date is known, then
   the undated older pieces in shelf order. Each carries its shelf's label and hue. */
export const allWriting = shelves
  .flatMap((s) => s.books.map((b, i) => ({ ...b, shelf: s.label, hue: s.hue, icon: s.icon, order: i })))
  .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '') || 0);
