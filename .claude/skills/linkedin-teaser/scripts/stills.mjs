// Screenshot stills of a teaser reel for review.
// Usage: node stills.mjs <abs path to reel.html> <out dir> [t1 t2 …]
// With no times: one still per scene, 0.5s before it fades out (the end card: at DURATION - 0.5).
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { resolve, join } from 'path';

const [html, dir, ...rest] = process.argv.slice(2);
if (!html || !dir) { console.error('usage: node stills.mjs <reel.html> <out dir> [t …]'); process.exit(1); }
mkdirSync(dir, { recursive: true });

const b = await chromium.launch({ channel: 'chrome' });
const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
await pg.goto('file://' + resolve(html), { waitUntil: 'networkidle' });
await pg.evaluate(() => document.fonts.ready);
let ts = rest.map(Number);
if (!ts.length) ts = await pg.evaluate(() => (window.SCENES || []).map(([, , e]) => +(Math.min(e, window.DURATION) - 0.5).toFixed(2)));
if (!ts.length) { console.error('no times given and window.SCENES is not set'); process.exit(1); }
for (const t of ts) {
  await pg.evaluate(t => window.seek(t), t);
  const path = join(resolve(dir), `still-${t}.png`);
  await pg.screenshot({ path });
  console.log(path);
}
await Promise.race([b.close(), new Promise(r => setTimeout(r, 3000))]);
process.exit(0);
