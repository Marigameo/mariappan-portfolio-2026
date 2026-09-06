/* The doodle sprite. Importing it with ?url gives a content-hashed URL
   (/_astro/doodles.<hash>.svg) so browsers can cache it forever and still
   pick up every edit: no more bumping ?v= by hand. */
import spriteUrl from '../assets/doodles.svg?url';
export { spriteUrl };
