/* Thenga's day off: the About page's hobbies, one scrapbook board each.
   Rendered by src/pages/about.astro.

   To feature a photo: drop it in public/images/about/<hobby>/ and add it to that
   hobby's `picks`. Picks show whole, big enough to enjoy in place, in a sideways
   reel that ends with the Instagram card; tapping one enlarges it. With no picks,
   the board shows just the Instagram card (or `aside`, when there's no account). */
import { site } from './site';

/** Thenga's props on its day off (src/components/mascots/Thenga.astro). */
export type Hobby = 'guitar' | 'camera' | 'pen' | 'pot' | 'backpack';

export interface Pick {
  src: string;
  alt: string;
  w: number;
  h: number;
  /** A few handwritten words on the polaroid's chin; long ones wrap to a second line. */
  caption?: string;
}

export interface Pastime {
  id: string;
  hobby: Hobby;
  accent: 'coral' | 'blue' | 'teal' | 'violet';
  title: string;
  text: string;
  /** What Thenga is up to, in handwriting next to the pose. */
  doing: string;
  link?: { href: string; label: string };
  /** The Instagram card's lead-in, e.g. "The covers are on". Defaults to "More on". */
  more?: string;
  /** Shown instead of the Instagram card when there's no account. */
  aside?: string;
  picks: Pick[];
}

export const pastimes: Pastime[] = [
  {
    id: 'music', hobby: 'guitar', accent: 'coral',
    title: 'Music, mostly on six strings',
    text: "I'm into music and love to play guitar. Covers land on Instagram now and then.",
    doing: 'strumming along',
    link: { href: site.links.guitar, label: '@mari.strings' },
    more: 'The covers are on',
    picks: [
      { src: '/images/portraits/guitar.webp', alt: 'Illustration of Mariappan playing an acoustic guitar on a bench', w: 900, h: 1200, caption: 'the doodle version' },
      { src: '/images/about/music/golden-hour.webp', alt: 'Mariappan sitting against a stone wall in golden-hour light, playing a black acoustic guitar, a second guitar leaning beside him', w: 1080, h: 1440, caption: 'golden hour' },
    ],
  },
  {
    id: 'travel', hobby: 'backpack', accent: 'blue',
    title: 'Slow travel',
    text: 'Not the rush-to-destinations kind. I stay until a place sinks in — no plans, just vibes, people, culture, and a lot of photographs to carry home.',
    doing: 'off somewhere, no plans',
    link: { href: site.links.travel, label: '@mari.gameo' },
    more: 'More trips on',
    picks: [
      { src: '/images/about/travel/trip-1.webp', alt: 'Mariappan grinning in a long puffer coat and beanie as snow falls thick around pine trees', w: 1080, h: 1440, caption: 'caught in the snow' },
      { src: '/images/about/travel/trip-2.webp', alt: 'Mariappan on skis in yellow boots, gripping the poles on a snowy slope with a misty valley behind', w: 1080, h: 1440, caption: 'first time on skis' },
      { src: '/images/about/travel/trip-3.webp', alt: 'Mariappan with arms flung wide, looking up at a roaring waterfall', w: 720, h: 1280, caption: 'hello, waterfall' },
      { src: '/images/about/travel/trip-4.webp', alt: 'Mariappan neck-deep in the river pool below a waterfall, hands on his head, smiling', w: 720, h: 1280, caption: 'straight in' },
      { src: '/images/about/travel/trip-5.webp', alt: 'Mariappan lying back in a rope hammock by the water as the sun sets over a palm-lined shore', w: 1080, h: 1440, caption: 'sunset, no plans' },
      { src: '/images/about/travel/trip-6.webp', alt: 'Two friends on the rocks of a small forest waterfall, one waving from the top, one sitting below', w: 960, h: 1280, caption: 'up the rocks' },
      { src: '/images/about/travel/trip-7.webp', alt: 'Mariappan and a friend knee-deep in a stream, cheering beside a little stack of balanced stones', w: 960, h: 1280, caption: 'the stone stack' },
      { src: '/images/about/travel/trip-8.webp', alt: 'A smiling selfie on a rocky trail, with a friendly brown dog peeking over his shoulder', w: 960, h: 1280, caption: 'a friend on the trail' },
    ],
  },
  {
    id: 'cooking', hobby: 'pot', accent: 'violet',
    title: 'Cooking, almost every day',
    text: 'I love home-cooked food, so I cook most days — and keep trying new dishes.',
    doing: 'something’s on the stove',
    aside: 'Not on Instagram. Mostly eaten before the photo.',
    picks: [
      { src: '/images/about/cooking/dish-1.webp', alt: 'Avocado ice cream milkshake in a steel tumbler, topped with chopped almonds, pistachios and a honey drizzle', w: 1080, h: 1440, caption: 'Avocado ice cream milkshake' },
      { src: '/images/about/cooking/dish-2.webp', alt: 'Chicken chettinad gravy heaped with fresh coriander, beside a pan of egg scramble and a tin of chicken 65', w: 1440, h: 1080, caption: 'Chicken chettinad, egg scramble & chicken 65' },
      { src: '/images/about/cooking/dish-3.webp', alt: 'A plate of donne biryani with a few sesame-glazed chicken pieces and sliced onions in curd', w: 1080, h: 1440, caption: 'Donne biryani' },
      { src: '/images/about/cooking/dish-4.webp', alt: 'A glass box of glazed lotus stem with sesame seeds, garlic and dried chillies', w: 1080, h: 1440, caption: 'Lotus stem' },
      { src: '/images/about/cooking/dish-5.webp', alt: 'Veg meals from above: sambar, rice, papads, payasam and vegetable sides', w: 1080, h: 1440, caption: 'Veg meals' },
    ],
  },
  {
    id: 'poetry', hobby: 'pen', accent: 'teal',
    title: 'Poetry, in Tamil',
    text: 'I pen down kavithai, mostly in Tamil.',
    doing: 'one more line…',
    link: { href: site.links.poetry, label: '@ullunarvu.writes' },
    more: 'More kavithai on',
    picks: [
      { src: '/images/about/poetry/sol-manamae.webp', alt: 'Sol Manamae, a Tamil poem in white on a starry night sky with a full moon', w: 1080, h: 1389, caption: 'Sol Manamae' },
      { src: '/images/about/poetry/oru-peyar.webp', alt: 'Oru peyar, a Tamil love poem on a cream page scattered with pink hearts', w: 1080, h: 1429, caption: 'Oru peyar…' },
      { src: '/images/about/poetry/thangai.webp', alt: 'A Tamil poem for my sister, over a soft dusk gradient with a drawing of a sister tying a rakhi', w: 1080, h: 1347, caption: 'for my sister' },
      { src: '/images/about/poetry/manpuru-mangaye.webp', alt: 'Ye Manpuru Mangaye, a Tamil poem beside a watercolour of a woman crowned with flowers', w: 1080, h: 1064, caption: 'Ye Manpuru Mangaye' },
      { src: '/images/about/poetry/thalattum-katre-vaa.webp', alt: 'Thalattum Katre Vaa, a Tamil poem in white over a rain-streaked window', w: 1080, h: 1069, caption: 'Thalattum Katre Vaa' },
    ],
  },
  {
    id: 'photos', hobby: 'camera', accent: 'coral',
    title: 'Photographs that get to live',
    text: 'I hate letting travel photographs die on my phone, so the keepers get curated here.',
    doing: 'hold still…',
    link: { href: site.links.instagram, label: '@mari.fstop' },
    more: 'More frames on',
    picks: [
      { src: '/images/about/photos/frame-1.webp', alt: 'The Padmanabhaswamy temple tower lit green and gold against a dusky night sky, lamp posts lining the path', w: 810, h: 1440, caption: 'Padmanabhaswamy at night' },
      { src: '/images/about/photos/frame-2.webp', alt: 'A narrow street in Jew Town, Fort Kochi: yellow tiled-roof houses, a hanging kettle cafe sign and an old lamp post', w: 1080, h: 1440, caption: 'Jew Town, Fort Kochi' },
      { src: '/images/about/photos/frame-3.webp', alt: 'A boatman silhouetted in a shikara on Dal Lake, the low sun flaring gold across the water', w: 1080, h: 1440, caption: 'Dal Lake at sundown' },
      { src: '/images/about/photos/frame-4.webp', alt: 'Qutub Minar lit up at night, looking straight up the tower from the ruins at its base', w: 1080, h: 1440, caption: 'Qutub Minar by night' },
      { src: '/images/about/photos/frame-5.webp', alt: 'Silhouettes of people wading into the waves as the sun sets over the sea', w: 1080, h: 1440, caption: 'last light at the beach' },
    ],
  },
];
