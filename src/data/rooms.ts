/* The parts of /experiments/, as doors under each studio story: the UX studio
   and the skills (that page's tabs) and the side quests (the whole list). Counts
   come from the rooms' own data. */
import { studio } from './studio';
import { experimentCount } from './experiments';
import { skills } from './skills';
import type { Hobby } from './offclock';
import type { Mood } from './experiments';

export interface Room {
  id: 'studio' | 'skills' | 'yard';
  name: string;
  count: number;
  /** One line on the door. */
  blurb: string;
  /** Thenga on the door: a hobby pose or a mood. */
  thenga: { hobby?: Hobby; mood?: Mood };
}

export const rooms: Room[] = [
  { id: 'studio', name: 'UX studio', count: studio.length, blurb: 'Design case studies: the before, the after, and the smudges in between.', thenga: { hobby: 'brush' } },
  { id: 'skills', name: 'Skills', count: skills.length, blurb: 'What I’ve learnt, written down for coding agents.', thenga: { hobby: 'pen' } },
  { id: 'yard', name: 'Side quests', count: experimentCount, blurb: 'Apps, ventures and night hacks, shipped as experiments.', thenga: { mood: 'cracked' } },
];

export const roomHref = (id: Room['id']) => (id === 'yard' ? '/experiments/' : `/experiments/#${id}`);
