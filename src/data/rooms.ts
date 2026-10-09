/* The rooms of Thenga's place (/experiments/): the studio, the stories and the
   yard. One room shows at a time on the Experiments page; the same three doors
   appear on the home card and under each studio story, so the rooms are never
   more than a click away. Counts come from the rooms' own data. */
import { studio } from './studio';
import { highlights, experimentCount } from './experiments';
import type { Hobby } from './offclock';
import type { Mood } from './experiments';

export interface Room {
  id: 'studio' | 'stories' | 'yard';
  name: string;
  count: number;
  /** One line on the door. */
  blurb: string;
  /** Thenga on the door: a hobby pose or a mood. */
  thenga: { hobby?: Hobby; mood?: Mood };
}

export const rooms: Room[] = [
  { id: 'studio', name: 'The studio', count: studio.length, blurb: 'Screens I’ve redrawn: the before, the after, and the smudges in between.', thenga: { hobby: 'brush' } },
  { id: 'stories', name: 'Stories', count: highlights.length, blurb: 'The experiments that grew into stories of their own, in full.', thenga: { hobby: 'pen' } },
  { id: 'yard', name: 'The yard', count: experimentCount, blurb: 'Shipped apps, a pivot, college ventures and night hacks.', thenga: { mood: 'cracked' } },
];

export const roomHref = (id: Room['id']) => `/experiments/#${id}`;
