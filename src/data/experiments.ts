/* Thenga's yard: the heap where every experiment gets piled up, and every one
   leaves something behind. Rendered by src/pages/experiments.astro (cards, the
   heap in the header, and the "cracked open" panel) and counted on the home
   card (src/components/home/Stash.astro).

   To add one: push an entry onto the right shelf. Keep it scannable: a one-line
   `hook` for the card, then a few short `sections` of points for the panel,
   `found` for what I took away, and links or a screenshot if they still exist.
   `id` is the #hash that opens it directly, e.g. /experiments/#quickfix.
   Experiments that grew into a story of their own go in `highlights` instead. */

/** Thenga's poses: `hero` is the mascot itself, the rest are outcomes. */
export type Mood = 'hero' | 'sprouted' | 'cracked' | 'moonshot';

export interface Experiment {
  id: string;
  name: string;
  /** Where it grew, e.g. "Strivelabs" or "College, with friends". */
  context: string;
  mood: Exclude<Mood, 'hero'>;
  /** Short state of play, e.g. "Live", "Pivoted", "Offline". */
  status: string;
  /** One line for the card. */
  hook: string;
  sections: { title: string; points: string[] }[];
  /** What I carried out of it. Shown as "Found inside". */
  found: string[];
  links?: { href: string; label: string }[];
  shot?: { src: string; alt: string; w: number; h: number };
  /** A small aside in my own voice, shown in handwriting. */
  note?: string;
}

/** A highlight: an experiment big enough to get a story of its own. Shown above
    the shelves as a wide card that links straight to the story. `sketch` picks
    the card drawing in src/pages/experiments.astro. */
export interface Highlight {
  href: string;
  title: string;
  /** Mono line under the title, e.g. "Strivelabs · 2024 → now". */
  context: string;
  hook: string;
  tags: string[];
  accent: 'coral' | 'blue' | 'teal' | 'violet';
  sketch: 'design-ecosystem';
}

export const highlights: Highlight[] = [
  {
    href: '/work/design-ecosystem/',
    title: 'Strive’s design ecosystem',
    context: 'Strivelabs · 2024 → now',
    hook: 'A design system nobody asked for: a theme on shadcn, two shared packages, Storybook, and a doc for people and coding agents.',
    tags: ['Design systems', 'Agents'],
    accent: 'coral',
    sketch: 'design-ecosystem',
  },
];

export interface Shelf {
  id: string;
  name: string;
  tagline: string;
  items: Experiment[];
}

/* What each coconut means. Shown as the legend on the page and the home card. */
export const moods: Record<Exclude<Mood, 'hero'>, { label: string; meaning: string }> = {
  sprouted: { label: 'Sprouted', meaning: 'It grew: shipped, used, or grew into something bigger.' },
  cracked: { label: 'Cracked open', meaning: 'It didn’t become a palm, but there was treasure inside.' },
  moonshot: { label: 'Moonshot', meaning: 'A wild idea I chased anyway, just to see how far it flies.' },
};

export const shelves: Shelf[] = [
  {
    id: 'on-the-job',
    name: 'Grown on the job',
    tagline: 'Side quests and bets from my time at companies.',
    items: [
      {
        id: 'zendesk-clickup',
        name: 'ClickUp for Zendesk',
        context: 'Strivelabs · micro SaaS',
        mood: 'sprouted',
        status: 'Live',
        hook: 'ClickUp inside the Zendesk sidebar. Live on the Zendesk Marketplace, with paying customers.',
        sections: [
          { title: 'What it is', points: [
            'One of two micro SaaS apps we built at Strivelabs, still running with customers.',
            'I owned the client side, design to prod, as a design engineer.',
          ] },
          { title: 'Tricky bits', points: [
            'A sidebar-sized viewport, holding huge volumes of data.',
            'Intuitive in a tiny frame meant infinite scroll and progressive loading.',
            'An onboarding tour that points at things without breaking anyone’s calm.',
            'Subscriptions on Paddle: we own the payments, not Zendesk.',
          ] },
        ],
        found: [
          'Small viewports make every pixel argue for its place.',
          'A good tour guides and then gets out of the way.',
        ],
        links: [{ href: 'https://www.zendesk.com/in/marketplace/apps/support/1074800/clickup-by-strivelabsai/', label: 'Zendesk Marketplace' }],
      },
      {
        id: 'zendesk-monday',
        name: 'monday.com for Zendesk',
        context: 'Strivelabs · micro SaaS',
        mood: 'sprouted',
        status: 'Live',
        hook: 'The sibling app: monday.com boards next to Zendesk tickets. Live, with customers.',
        sections: [
          { title: 'What it is', points: [
            'Built alongside the ClickUp app, on the same foundations.',
            'I owned the client side here too, design to prod.',
          ] },
          { title: 'Tricky bits', points: [
            'Same small sidebar frame, a different product’s data model.',
            'Onboarding tour wired with React Joyride: delightful, never irritating.',
            'Paddle subscriptions, handled on our side.',
          ] },
        ],
        found: [
          'The second app goes twice as fast when the first one’s bones are right.',
        ],
        links: [{ href: 'https://www.zendesk.com/in/marketplace/apps/support/1089784/mondaycom-by-strivelabsai/', label: 'Zendesk Marketplace' }],
      },
      {
        id: 'mardi-ai',
        name: 'Mardi AI',
        context: 'Strivelabs · standalone product',
        mood: 'sprouted',
        status: 'Pivoted',
        hook: 'A marketing digital assistant, built as its own product. It lives on as an agent in Strive.',
        sections: [
          { title: 'What it was', points: [
            'Our first go at a standalone product at Strivelabs.',
            'I was there from ideation to prod, prototype to shipped UI.',
          ] },
          { title: 'Where it went', points: [
            'We pivoted from product to platform.',
            'Mardi is now a negative keyword analyser agent workflow in Strive, tightly tied into chat.',
          ] },
        ],
        found: [
          'Auth, infra, pricing: shipping a whole product was a joy in itself.',
          'Designing for marketers as a team of engineers taught us a lot.',
        ],
        links: [{ href: 'https://keyword-optimizer.vercel.app/', label: 'Early prototype' }],
        note: 'The final version was easily 3–4x better than this prototype. Sadly, the domain had to go.',
      },
      {
        id: 'miro-freshdesk',
        name: 'Miro × Freshdesk',
        context: 'Freshworks · my first weeks',
        mood: 'cracked',
        status: 'Demo',
        hook: 'A simple Miro integration for Freshdesk, built in my early days at Freshworks.',
        sections: [
          { title: 'What it was', points: [
            'A demo project, never published to the marketplace.',
            'My way into the platform I was about to join: the Freshworks Marketplace.',
          ] },
        ],
        found: [
          'Building one small app is the fastest way to learn a platform’s edges.',
        ],
        links: [{ href: 'https://github.com/Marigameo/miro-freshdesk', label: 'Code on GitHub' }],
      },
      {
        id: 'groovehq-cliq',
        name: 'GrooveHQ for Zoho Cliq',
        context: 'Zoho · Cliq extension',
        mood: 'cracked',
        status: 'Slides',
        hook: 'A helpdesk extension that brought GrooveHQ into Zoho Cliq.',
        sections: [
          { title: 'What it was', points: [
            'A Zoho Cliq extension for GrooveHQ, the helpdesk software.',
            'Built during my stint as a marketplace apps developer at Zoho, in Zoho Deluge.',
          ] },
        ],
        found: [
          'My first taste of building on someone else’s platform.',
        ],
        links: [{ href: 'https://drive.google.com/file/d/1I9_OmMFHMC7Kyoe5OhyOroGVRjD2qQom/view', label: 'Slides' }],
      },
      {
        id: 'linkedin-cliq',
        name: 'LinkedIn for Zoho Cliq',
        context: 'Zoho · Cliq extension',
        mood: 'cracked',
        status: 'Slides',
        hook: 'Simplifying professional sharing, as an extension for Zoho Cliq.',
        sections: [
          { title: 'What it was', points: [
            'A Zoho Cliq extension to make professional sharing simpler.',
            'Built alongside the GrooveHQ one, in Zoho Deluge.',
          ] },
        ],
        found: [
          'Small extensions teach you a lot about other people’s APIs.',
        ],
        links: [{ href: 'https://drive.google.com/file/d/1OPuCuitF1TiHxXyp7WwohU0XtKrZV6xL/view', label: 'Slides' }],
      },
    ],
  },
  {
    id: 'home-grown',
    name: 'Home-grown',
    tagline: 'For myself, for friends, and for the community.',
    items: [
      {
        id: 'accetoss',
        name: 'Accetoss',
        context: 'ACGCET open source community',
        mood: 'cracked',
        status: 'Live',
        hook: 'A home for my college’s open source community. For friends, by friends.',
        sections: [
          { title: 'Why', points: [
            'I found open source late in college, on my own, and felt I’d missed a whole ecosystem.',
            'So after college I ran a small bootcamp for juniors in my network.',
          ] },
          { title: 'What we did', points: [
            'Featured a few of their projects on the site.',
            'Ran a Git bootcamp to get them started.',
            'Helped a few take their projects live, like the ISC media foundation site.',
          ] },
        ],
        found: [
          'Starting a community is easy. Keeping it passed down is the hard part.',
        ],
        links: [
          { href: 'https://accetoss.netlify.app/', label: 'Accetoss' },
          { href: 'https://www.youtube.com/playlist?list=PLNnW_yP-Bwee7vwqDFbR4TSwPJQz0zHgd', label: 'Git bootcamp videos' },
          { href: 'https://iscmediacumfoundation.netlify.app/', label: 'A project we took live' },
        ],
        note: 'It didn’t quite inspire them to keep it going, but it’s still live, under my college’s name on GitHub.',
      },
      {
        id: 'nutro',
        name: 'nutro-components',
        context: 'College, with a friend · npm',
        mood: 'moonshot',
        status: 'On npm',
        hook: 'An open source component library of our favourite UI inspirations, plus docs.',
        sections: [
          { title: 'What it is', points: [
            'Two UI engineers who lived with components every day: observing, admiring, collecting.',
            'So we turned our inspirations into a collectible library, to learn, look back on, and use ourselves.',
            'nutro-docs shows how to use each one.',
          ] },
        ],
        found: [
          'How the npm ecosystem works, end to end.',
          'What building as a team feels like, long before a job.',
        ],
        links: [
          { href: 'https://www.npmjs.com/package/nutro-components', label: 'npm' },
          { href: 'https://nutro.netlify.app/', label: 'nutro-docs' },
        ],
        note: 'Don’t look for download stats. We never aimed for any.',
      },
      {
        id: 'template-baker',
        name: 'Template baker',
        context: 'Right after college',
        mood: 'sprouted',
        status: 'Live',
        hook: 'Paste your post’s words, get a ready-to-share poster or slide. Built in one night.',
        sections: [
          { title: 'What it was', points: [
            'The person running Maker’s Tribe needed reusable post templates, fast.',
            'Type the wording, get a finished poster or slide instantly.',
          ] },
        ],
        found: [
          'Today it’s one prompt away. Back then, before LLMs, it was a fun all-nighter.',
        ],
        links: [{ href: 'https://template-baker.netlify.app/', label: 'Template baker' }],
      },
      {
        id: 'quickfix',
        name: 'Quickfix',
        context: 'College, a team of three',
        mood: 'moonshot',
        status: 'Offline',
        hook: 'A tiny venture connecting local hardware and software fixers with the people around our college.',
        sections: [
          { title: 'Why', points: [
            'Friends were already fixing hardware and software around campus, as a service.',
            'We wanted a wider network and more work for them.',
          ] },
          { title: 'The team', points: [
            'One on the logo and brand, one pitching and marketing, me building the app end to end.',
            'Ideation to a live app, as three friends.',
          ] },
        ],
        found: [
          'Running a thing, not just building it. Those lessons still give me chills.',
        ],
        note: 'It lived on Heroku, got suspended, and the code went missing along the way.',
        shot: { src: '/images/experiments/quickfix.webp', alt: 'Quickfix illustration: a mechanic leaning on a giant wrench beside an orange Quick Fix van, with a second mechanic waving from the driver’s seat.', w: 647, h: 638 },
      },
      {
        id: 'penaltyvaultz',
        name: 'PenaltyVaultz',
        context: 'College · final year project',
        mood: 'moonshot',
        status: 'Slides',
        hook: 'A decentralised app on Ethereum, with a smart contract written in Solidity.',
        sections: [
          { title: 'Why', points: [
            'In my final year I’d just discovered bitcoin, decentralised networks and dapps.',
            'So I wanted to try building something on the Ethereum network myself.',
          ] },
        ],
        found: [
          'Building with a brand-new tech is the fastest way to understand it.',
        ],
        links: [{ href: 'https://drive.google.com/file/d/14MoKn-bFmS2pws1Ew6ll2SOBhydWxbqR/view', label: 'Slides' }],
      },
      {
        id: 'accetosa',
        name: 'ACCETOSA',
        context: 'College · early days · WordPress',
        mood: 'cracked',
        status: 'Live',
        hook: 'A WordPress portal to bridge the gap between students and the alumni network.',
        sections: [
          { title: 'What it was', points: [
            'Built before I’d learned to code or anything about the web.',
            'I wanted to build something, found out WordPress existed, and made this portal.',
          ] },
        ],
        found: [
          'You don’t need to know how to code to start building.',
        ],
        links: [{ href: 'https://accetosaweb.wordpress.com/', label: 'ACCETOSA' }],
      },
      {
        id: 'marigameo',
        name: 'Marigameo',
        context: 'College · first year · Wix',
        mood: 'sprouted',
        status: 'Live',
        hook: 'My very first blog, built on Wix while I was trying out website builders.',
        sections: [
          { title: 'What it was', points: [
            'Built in my first year, back when I was experimenting with website builders.',
            'The UI is super embarrassing to look at now.',
          ] },
        ],
        found: [
          'It’s special anyway: this is where I discovered my love for writing.',
        ],
        links: [{ href: 'https://mariappangameo.wixsite.com/indragameo', label: 'The blog' }],
      },
    ],
  },
  {
    id: 'for-others',
    name: 'Planted for others',
    tagline: 'Freelance work, straight out of college.',
    items: [
      {
        id: 'economize',
        name: 'economize.cloud',
        context: 'Freelance · early stage',
        mood: 'sprouted',
        status: 'Grew up',
        hook: 'Interfaces for multi-cloud cost and infra, built with the founders in the early days.',
        sections: [
          { title: 'What I worked on', points: [
            'Heavy, data-centric modules, in a Vue-centric stack.',
            'Complex charts and visualisations to play with.',
            'A crash course in cloud, multi-cloud, costs and infra.',
          ] },
        ],
        found: [
          'Straight out of college, the learning curve was wild. Super grateful for the chance.',
        ],
        links: [{ href: 'https://www.economize.cloud/', label: 'economize.cloud' }],
        note: 'They’ve come a long way since, so today’s UI isn’t the one I built. Always rooting for them.',
      },
      {
        id: 'gettr',
        name: 'Gettr & c4scale',
        context: 'Freelance · consultancy website',
        mood: 'cracked',
        status: 'Archived',
        hook: 'Website work for a consultancy, back before LLMs could build a site for you.',
        sections: [
          { title: 'What it was', points: [
            'Helped build the consultancy’s website, as a college student.',
            'These are the versions I rolled out.',
          ] },
        ],
        found: [
          'Consulting wasn’t my forte then, so I didn’t take on client projects after this.',
          'Still super happy the business is running today.',
        ],
        links: [
          { href: 'https://gettr-home.netlify.app/', label: 'Gettr home' },
          { href: 'https://gettr.netlify.app/', label: 'Gettr' },
        ],
        note: 'Super embarrassing to look at now. Excuse me, it was rolled out by a college student.',
      },
    ],
  },
];

export const experiments = shelves.flatMap((s) => s.items);
export const experimentCount = experiments.length;
