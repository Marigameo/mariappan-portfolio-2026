/* Talks: each one becomes a ticket stub on the homepage.
   `video` is a YouTube id (click-to-load); without it the thumbnail links to the slides. */
export type Accent = 'coral' | 'blue' | 'teal' | 'violet';

export interface Talk {
  title: string;
  year: number;
  venue: string;
  city: string;
  date: string;
  image: string; // 640x360, in public/previews/
  slides: string;
  video?: string;
  accent: Accent;
  tilt: 1 | 2 | 3;
}

export const talks: Talk[] = [
  {
    title: 'Streaming SSR simplified with Next.js',
    year: 2023,
    venue: 'React Nexus 2023',
    city: 'Bangalore',
    date: 'Jul 7–8, 2023',
    image: '/previews/react-nexus.png',
    slides: 'https://drive.google.com/file/d/1XYKsAuleeNpGK913akIszkB4ex1oPOjg/view?usp=sharing',
    video: 'Dh3WTd8os0k',
    accent: 'coral',
    tilt: 1,
  },
  {
    title: 'State of frontend tooling',
    year: 2023,
    venue: 'Flipkart',
    city: 'Bangalore',
    date: 'Apr 16, 2023',
    image: '/previews/state-of-frontend-tooling.png',
    slides: 'https://drive.google.com/file/d/16rbqeU5RLaPZSHyYnZxx0HuMAkPvn7-l/view?usp=sharing',
    accent: 'blue',
    tilt: 2,
  },
  {
    title: 'Streaming SSR simplified',
    year: 2023,
    venue: 'Frontend meetup',
    city: 'Chennai',
    date: 'Mar 18, 2023',
    image: '/previews/streaming-ssr.png',
    slides: 'https://drive.google.com/file/d/1c-fpdHe80CLvGozXLHm1kO8KrQjnD8Nj/view?usp=sharing',
    accent: 'teal',
    tilt: 3,
  },
  {
    title: 'Monorepos at scale',
    year: 2023,
    venue: 'React Bangalore',
    city: 'Bangalore',
    date: 'Feb 18, 2023',
    image: '/previews/monorepos-at-scale.jpeg',
    slides: 'https://drive.google.com/file/d/19S3oFmjXD27ukoQcVp3hcRlh9j3UW0ML/view?usp=sharing',
    video: 'Nb_i1uQKwkM',
    accent: 'violet',
    tilt: 2,
  },
  {
    title: 'CSS Wrapped: 2023',
    year: 2023,
    venue: 'React Bangalore',
    city: 'Atlassian',
    date: 'Jul 7–8, 2023',
    image: '/previews/react-meetup-atlassian.jpeg',
    slides: 'https://www.canva.com/design/DAF4Ej-tEFE/28i751FSo8hodKp37Muy9g/edit?utm_content=DAF4Ej-tEFE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton',
    video: '1wn9Ox7Fa0I',
    accent: 'coral',
    tilt: 1,
  },
];
