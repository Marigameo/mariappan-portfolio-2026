// Render a teaser reel to MP4: calls window.seek(t) per frame, screenshots, pipes to ffmpeg.
// Usage: node render.mjs <abs path to reel.html> <abs path to out.mp4> [fps=30]
import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { resolve } from 'path';
import ffmpeg from 'ffmpeg-static';

const [html, out, fpsArg] = process.argv.slice(2);
if (!html || !out) { console.error('usage: node render.mjs <reel.html> <out.mp4> [fps]'); process.exit(1); }
const FPS = Number(fpsArg) || 30;

const b = await chromium.launch({ channel: 'chrome' });
const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
await pg.goto('file://' + resolve(html), { waitUntil: 'networkidle' });
await pg.evaluate(() => document.fonts.ready);
const D = await pg.evaluate(() => window.DURATION);
const N = Math.round(D * FPS);

const ff = spawn(ffmpeg, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', '-preset', 'slow', '-movflags', '+faststart', resolve(out)],
  { stdio: ['pipe', 'ignore', 'inherit'] });
for (let i = 0; i < N; i++) {
  await pg.evaluate(t => window.seek(t), i / FPS);
  const buf = await pg.screenshot({ type: 'png' });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (i % (FPS * 5) === 0) console.log(`frame ${i}/${N}`);
}
ff.stdin.end(); await new Promise(r => ff.on('close', r));
console.log(`done: ${out} (${D}s, ${N} frames)`);
// Chrome can hang on exit on this Mac, so don't wait on it forever.
await Promise.race([b.close(), new Promise(r => setTimeout(r, 3000))]);
process.exit(0);
