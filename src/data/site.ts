/* One place for the facts every page repeats: name, URL, handles, links. */
export const site = {
  name: 'Mariappan Subramanian',
  url: 'https://mariappan.netlify.app',
  ogImage: '/og-image.png', // 1200x630, in public/
  twitter: '@mariapp62431572',
  email: 'mariappangameo@gmail.com',
  themeColor: { light: '#fff9f1', dark: '#0a0a0f' },
  links: {
    github: 'https://github.com/Marigameo',
    linkedin: 'https://www.linkedin.com/in/marigameo/',
    x: 'https://x.com/mariapp62431572',
    instagram: 'https://www.instagram.com/mari.fstop/',
    guitar: 'https://www.instagram.com/mari.strings/',
    travel: 'https://www.instagram.com/mari.gameo/',
    poetry: 'https://www.instagram.com/ullunarvu.writes/',
    medium: 'https://medium.com/@mariappan',
    strivelabs: 'https://strivelabs.ai',
  },
} as const;

export const nav = [
  { key: 'work', href: '/#work', label: 'Work' },
  { key: 'talks', href: '/#talks', label: 'Talks' },
  { key: 'writing', href: '/#writing', label: 'Writing' },
  { key: 'about', href: '/about/', label: 'About' },
] as const;

export type NavKey = (typeof nav)[number]['key'];
