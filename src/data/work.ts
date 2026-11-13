/* Every work story, for /work/. Order here is the order on the page: work at a
   company first (newest company first, flagship first within it), then side builds.
   `featured` puts it under "Top picks" too (the tab the page opens on; the same
   picks as the homepage). `kind` puts a story under the "At work" or "Side builds" tab; `org` and `when`
   make the row's kicker; `hook` is its one line and `status` the foot. The
   thumbnail for each slug is picked in src/components/listing/WorkThumb.astro.
   Add a story: a page in src/pages/work/, an entry here, a case in WorkThumb. */
import type { Accent } from './talks';

export type WorkKind = 'work' | 'side-builds';

export interface Project {
  slug: string;
  title: string;
  titleLang?: string;
  titleNote?: string;
  kind: WorkKind;
  org: string;
  when: string;
  hook: string;
  status: string;
  accent: Accent;
  /** One of the "Top picks", the tab /work/ opens on. */
  featured?: boolean;
}

export const workKinds: { id: WorkKind; label: string }[] = [
  { id: 'work', label: 'At work' },
  { id: 'side-builds', label: 'Side builds' },
];

export const projects: Project[] = [
  // Strivelabs
  { slug: 'strive-gen-ui-chat', featured: true, title: 'Strive AI', kind: 'work', org: 'Strivelabs', when: '2024 → now', accent: 'coral',
    hook: 'A marketing chat that answers in live interfaces, not paragraphs.', status: 'In production, still shipping' },
  { slug: 'report-builder', featured: true, title: 'Strive Studio', kind: 'work', org: 'Strivelabs', when: '2026 → now', accent: 'blue',
    hook: 'Lovable for marketing reports, with numbers that never go stale.', status: 'Live for all customers' },
  { slug: 'brand-kit', title: 'Brand kit extractor', kind: 'work', org: 'Strivelabs', when: 'Aug 2026', accent: 'teal',
    hook: 'Read a customer’s brand off their website once, and every surface after that can wear it.', status: 'Live for all customers' },
  { slug: 'pluggable-agent-ui', title: 'Pluggable UI for agents', kind: 'work', org: 'Strivelabs', when: '2025 → now', accent: 'violet',
    hook: 'One command to a working agent UI on our framework and UX guidelines.', status: '~13+ agents, still growing' },
  { slug: 'public-share', title: 'Sharing artifacts in Strive', kind: 'work', org: 'Strivelabs', when: 'Oct 2026', accent: 'coral',
    hook: 'Public links for the pages Strive’s agent writes, from a whiteboard sketch in two days.', status: 'Live for every customer' },
  { slug: 'chat-diagrams', title: 'Diagrams in Strive chat', kind: 'work', org: 'Strivelabs', when: 'Sep 2026', accent: 'blue',
    hook: 'Teaching an agent when to draw, and never to show a broken diagram.', status: 'Live for every tenant' },
  { slug: 'design-ecosystem', title: 'Strive’s design ecosystem', kind: 'work', org: 'Strivelabs', when: '2024 → now', accent: 'teal',
    hook: 'A design system for people and agents: a shadcn theme, shared packages, Storybook and a doc agents can read.', status: 'Powers the platform' },
  // Freshworks
  { slug: 'freshworks-marketplace', featured: true, title: 'Freshworks Marketplace', kind: 'work', org: 'Freshworks', when: '2021 → 2024', accent: 'teal',
    hook: 'One codebase, two experiences, moved to Vue 3 with a revamp on top.', status: 'Shipped · WCAG 2.1 AA' },
  // Side builds
  { slug: 'tune-search', title: 'tune-search', kind: 'side-builds', org: 'Open source', when: 'Nov 2026', accent: 'teal',
    hook: 'My org switcher closed while I typed. Fixing it properly became a skill that tunes any search.', status: 'Open source · lab live' },
  { slug: 'agent-clarifier', featured: true, title: 'agent-clarifier', kind: 'side-builds', org: 'Open source', when: 'Oct 2026', accent: 'coral',
    hook: 'The card that lets an agent ask before it acts.', status: 'v0.2.1 on npm' },
  { slug: 'co-presence', title: 'co-presence', kind: 'side-builds', org: 'Open source', when: 'Oct 2026', accent: 'blue',
    hook: 'Started as a skill test, became a war room: who’s on it, people and agents, and what needs you.', status: 'v0.1.0 on npm' },
  { slug: 'fit-iphone-duo', title: 'fit-iphone-duo', kind: 'side-builds', org: 'Open source', when: 'Oct 2026', accent: 'violet',
    hook: 'Fitting a website to Apple’s foldable, a prompt away.', status: 'Open source · playground live' },
  { slug: 'draw-diagrams', title: 'draw-diagrams', kind: 'side-builds', org: 'Open source', when: 'Oct 2026', accent: 'coral',
    hook: 'A diagram skill for chat: knows when to draw, never shows a broken one.', status: 'In my skills repo' },
  { slug: 'thatpam', featured: true, title: 'தட்பம்', titleLang: 'ta', titleNote: 'thatpam', kind: 'side-builds', org: 'Indie', when: '2021', accent: 'teal',
    hook: 'Frontend, taught in Tamil, in tiny cohorts. All of it, from the pixels to the payments.', status: 'Paused · the students went pro' },
  { slug: 'dfordoubts', featured: true, title: 'DforDoubts', kind: 'side-builds', org: 'Contract', when: '2020 → 2022', accent: 'violet',
    hook: 'An e-learning marketplace, built solo from a one-line brief to payments.', status: 'Live · now a registered company' },
];
