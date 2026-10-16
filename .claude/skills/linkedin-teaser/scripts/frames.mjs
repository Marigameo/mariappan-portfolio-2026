// Turn an existing product video (the story's demo .mp4, or a screen recording the user sends) into
// a 30fps frame sequence the reel can seek frame-exactly.
// Usage: node frames.mjs <video> <out dir> [--from 0] [--to <end>] [--w 1600] [--crop w:h:x:y]
// Writes <out>/f/00000.jpg… and prints the frame count and size.
import { spawnSync } from 'child_process';
import { mkdirSync, rmSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import ffmpeg from 'ffmpeg-static';

const args = process.argv.slice(2);
const pos = args.filter((a, i) => !a.startsWith('--') && !(args[i - 1] || '').match(/^--(from|to|w|crop)$/));
const opt = (k, d) => { const i = args.indexOf('--' + k); return i < 0 ? d : args[i + 1]; };
const [video, dir] = pos;
if (!video || !dir) { console.error('usage: node frames.mjs <video> <out dir> [--from s] [--to s] [--w px] [--crop w:h:x:y]'); process.exit(1); }
const OUT = join(resolve(dir), 'f');
rmSync(resolve(dir), { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const vf = [opt('crop') && `crop=${opt('crop')}`, 'fps=30', `scale=${opt('w', 1600)}:-2:flags=lanczos`].filter(Boolean).join(',');
const r = spawnSync(ffmpeg, ['-y', '-loglevel', 'error', '-ss', opt('from', '0'), ...(opt('to') ? ['-to', opt('to')] : []),
  '-i', resolve(video), '-vf', vf, '-q:v', '2', '-start_number', '0', join(OUT, '%05d.jpg')], { stdio: 'inherit' });
if (r.status) process.exit(r.status);
const n = readdirSync(OUT).length;
console.log(`${n} frames (${(n / 30).toFixed(2)}s at 30fps) in ${OUT}`);
