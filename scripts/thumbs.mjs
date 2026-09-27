// Reel-sized copies of the About page picks, plus a tiny blurred preview of each.
// Run after adding or replacing a photo in src/data/offclock.ts:  pnpm thumbs
//
// For every pick it writes <name>.sm.webp next to the original (760px tall: the
// reel shows picks 24rem tall, so this is sharp at 2x) and records a ~24px-wide
// preview as a data URI in src/data/thumbs.json. The page falls back to the
// original when a pick has no entry, so a forgotten run is slower, never broken.
// Up-to-date copies are skipped. Uses sharp, which Astro already installs.
import sharp from 'sharp';
import { readFile, writeFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const pub = join(root, 'public');
const out = join(root, 'src/data/thumbs.json');

const data = await readFile(join(root, 'src/data/offclock.ts'), 'utf8');
const srcs = [...new Set([...data.matchAll(/src: '([^']+\.(?:webp|jpe?g|png))'/g)].map((m) => m[1]))];

let old = {};
try { old = JSON.parse(await readFile(out, 'utf8')); } catch { /* first run */ }

const mtime = async (p) => { try { return (await stat(p)).mtimeMs; } catch { return 0; } };
const result = {};
let made = 0;

for (const src of srcs) {
  const file = join(pub, src);
  const sm = src.replace(/\.(webp|jpe?g|png)$/, '.sm.webp');
  const smFile = join(pub, sm);
  const srcTime = await mtime(file);
  if (!srcTime) { console.warn(`missing: ${src}`); continue; }
  if (old[src] && (await mtime(smFile)) >= srcTime) { result[src] = old[src]; continue; }

  await sharp(file).resize({ height: 760, withoutEnlargement: true }).webp({ quality: 74 }).toFile(smFile);
  const tiny = await sharp(file).resize({ width: 24 }).webp({ quality: 40 }).toBuffer();
  result[src] = { sm, lqip: `data:image/webp;base64,${tiny.toString('base64')}` };
  made++;
}

await writeFile(out, JSON.stringify(result, null, 1) + '\n');
console.log(`thumbs: ${made} made, ${Object.keys(result).length - made} up to date`);
