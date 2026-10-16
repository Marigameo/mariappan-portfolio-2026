/* The palm-leaf bundle: my skills for coding agents, listed on /skills/. Each skill
   is one leaf, grouped by the kind of work it helps with, and links to its SKILL.md
   in github.com/Marigameo/skills. Only published skills go here.

   To add one: push a leaf onto `skills` with its group. Keep `hook` to one line,
   `when` to the moment you'd reach for it, and `tied` to the skill or thing it
   pairs with. Groups with no leaves don't show. */

export const skillsRepo = 'https://github.com/Marigameo/skills';
export const installCmd = 'npx skills@latest add marigameo/skills';

export type GroupId = 'craft' | 'use' | 'write' | 'ship';

export const groups: { id: GroupId; name: string; tagline: string }[] = [
  { id: 'craft', name: 'Leaves on craft', tagline: 'Building UI the careful way.' },
  { id: 'use', name: 'Leaves on use', tagline: 'Working with the things I’ve made.' },
  { id: 'write', name: 'Leaves on writing', tagline: 'Telling the story of the work.' },
  { id: 'ship', name: 'Leaves on shipping', tagline: 'Getting it out and seen.' },
];

export interface Skill {
  name: string;
  group: GroupId;
  /** One line for the leaf. */
  hook: string;
  /** "Read it when": the moment you'd reach for it. */
  when: string;
  /** "Tied with": what it pairs with. */
  tied: string;
}

export const skills: Skill[] = [
  {
    name: 'craft-component',
    group: 'craft',
    hook: 'Build a UI component the careful way: plan first, stop for a go, audit, then ship.',
    when: 'A card, widget or any self-contained piece of UI.',
    tied: 'Emil Kowalski’s and Jakub Krehel’s skills',
  },
  {
    name: 'ask-clarifier',
    group: 'use',
    hook: 'Wire agent-clarifier in, so your agent asks before it acts, and only when it matters.',
    when: 'A chat agent needs a few answers mid-task.',
    tied: 'agent-clarifier, on npm',
  },
  {
    name: 'show-co-presence',
    group: 'use',
    hook: 'Put co-presence in, so people see who’s on a task, people and agents, and what needs them.',
    when: 'A multi-agent or multiplayer product needs to show who’s on it.',
    tied: 'co-presence, on npm',
  },
];

export const skillHref = (s: Skill) => `${skillsRepo}/blob/main/skills/${s.name}/SKILL.md`;
