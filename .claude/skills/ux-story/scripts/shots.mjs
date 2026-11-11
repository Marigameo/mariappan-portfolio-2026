#!/usr/bin/env node
/* Turn raw screenshots into story-ready .webp files.

   Usage, from the portfolio root:
     node .claude/skills/ux-story/scripts/shots.mjs <manifest.json>

   The manifest:
     {
       "srcDir": "../my-project/process",          // relative to the cwd
       "outDir": "public/images/experiments/<slug>",
       "shots": [
         { "src": "21/final.png", "out": "hero.webp" },
         { "src": "17/worst.png", "out": "worst.webp", "crop": [0, 0, 2880, 1620] },
         { "src": "02/a.png", "out": "a.webp", "width": 1200, "quality": 82 }
       ]
     }

   crop is [left, top, width, height] in the source's own pixels, applied first.
   width caps the output (default 2000, never upscaled). quality defaults to 80.
   It prints each file's size and final dimensions: copy those dimensions into
   the page's width/height attributes so nothing shifts while images load. */
import sharp from 'sharp';
import { readFile, mkdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';

const manifestPath = process.argv[2];
if (!manifestPath) {
  console.error('Usage: node shots.mjs <manifest.json>');
  process.exit(1);
}
const m = JSON.parse(await readFile(manifestPath, 'utf8'));
await mkdir(m.outDir, { recursive: true });

let total = 0;
for (const s of m.shots) {
  const out = join(m.outDir, s.out);
  await mkdir(dirname(out), { recursive: true });
  let img = sharp(join(m.srcDir, s.src));
  if (s.crop) {
    const [left, top, width, height] = s.crop;
    img = img.extract({ left, top, width, height });
  }
  img = img.resize({ width: s.width ?? 2000, withoutEnlargement: true });
  const info = await img.webp({ quality: s.quality ?? 80, effort: 6 }).toFile(out);
  const kb = Math.round((await stat(out)).size / 1024);
  total += kb;
  console.log(`${String(kb).padStart(5)} KB  ${info.width}x${info.height}  ${s.out}`);
}
console.log(`${String(total).padStart(5)} KB  total`);
