// Record a real product interaction as a 30fps frame sequence for a teaser reel.
// Usage: node capture.mjs <url> <out dir> [--steps steps.mjs] [--secs 6] [--w 1280] [--h 960] [--dpr 2]
//          [--mobile] [--dark] [--k 4] [--hide ".a,.b"] [--auth state.json]
// Writes <out>/f/00000.jpg… (30fps, virtual time), <out>/events.json (your marks, in seconds) and <out>/final.png.
//
// The page clock is slowed by K (timers, Date, performance, CSS/WAAPI animations), so a screenshot loop
// that only manages ~10–15 shots a second still catches every step of a 150ms transition.
// Without --steps it just records --secs of whatever the page does on its own.
// With --steps, the module's default export drives the page (all times are real-speed, the helpers scale them):
//   export default async ({ page, wait, mark, click, tap, type, K }) => {
//     await wait(600); mark('type');
//     await type(page.locator('#box'), 'Find me a hotel in Lisbon');
//     await click(page.getByRole('button', { name: 'Send' }), 'send');   // cursor glides there, then clicks
//     await page.locator('.reply').waitFor({ timeout: 8000 * K }); await wait(1500);
//   };
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, copyFileSync, rmSync } from 'fs';
import { join, resolve } from 'path';
import { pathToFileURL } from 'url';

const args = process.argv.slice(2);
const pos = args.filter((a, i) => !a.startsWith('--') && !(args[i - 1] || '').match(/^--(steps|secs|w|h|dpr|k|hide|auth)$/));
const opt = (k, d) => { const i = args.indexOf('--' + k); return i < 0 ? d : args[i + 1]; };
const flag = k => args.includes('--' + k);
const [url, dir] = pos;
if (!url || !dir) { console.error('usage: node capture.mjs <url> <out dir> [--steps --secs --w --h --dpr --mobile --dark --k --hide --auth]'); process.exit(1); }
const OUT = resolve(dir), K = +opt('k', 4), FPS = 30, mobile = flag('mobile');
rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'raw'), { recursive: true });
mkdirSync(join(OUT, 'f'), { recursive: true });

const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({
  viewport: { width: +opt('w', mobile ? 390 : 1280), height: +opt('h', mobile ? 780 : 960) },
  deviceScaleFactor: +opt('dpr', 2), isMobile: mobile, hasTouch: mobile,
  colorScheme: flag('dark') ? 'dark' : 'light',
  ...(opt('auth') ? { storageState: resolve(opt('auth')) } : {}),
});
await ctx.addInitScript((K) => {
  const rNow = performance.now.bind(performance), rDate = Date.now, p0 = rNow(), d0 = rDate();
  performance.now = () => p0 + (rNow() - p0) / K;
  Date.now = () => d0 + (rDate() - d0) / K;
  const sT = setTimeout, sI = setInterval, rAF = requestAnimationFrame;
  window.setTimeout = (f, ms = 0, ...a) => sT(f, ms * K, ...a);
  window.setInterval = (f, ms = 0, ...a) => sI(f, ms * K, ...a);
  window.requestAnimationFrame = (f) => rAF(() => f(performance.now()));
}, K);
// Make input visible on camera: a soft disc for taps (mobile), an arrow cursor plus a click ring (desktop).
await ctx.addInitScript((mobile) => {
  const ring = (x, y) => {
    const d = document.createElement('div');
    d.style.cssText = `position:fixed;left:${x - 22}px;top:${y - 22}px;width:44px;height:44px;border-radius:50%;background:rgba(40,40,40,.2);border:2px solid rgba(40,40,40,.35);pointer-events:none;z-index:2147483647;transition:transform .35s ease-out,opacity .45s ease-out;transform:scale(1.3)`;
    document.documentElement.append(d);
    requestAnimationFrame(() => requestAnimationFrame(() => { d.style.transform = 'scale(.8)'; }));
    setTimeout(() => { d.style.opacity = '0'; }, 260);
    setTimeout(() => d.remove(), 800);
  };
  addEventListener('pointerdown', (e) => ring(e.clientX, e.clientY), true);
  if (mobile) return;
  addEventListener('DOMContentLoaded', () => {
    const c = document.createElement('div');
    c.innerHTML = '<svg width="26" height="32" viewBox="0 0 26 32"><path d="M2 2l20 15-9 1.6 5.2 10.6-4 1.8-5-10.6L2 26z" fill="#111" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>';
    c.style.cssText = 'position:fixed;left:-60px;top:-60px;pointer-events:none;z-index:2147483647';
    document.documentElement.append(c);
    addEventListener('mousemove', (e) => { c.style.left = e.clientX - 2 + 'px'; c.style.top = e.clientY - 2 + 'px'; }, true);
  });
}, mobile);

const pg = await ctx.newPage();
await pg.goto(url, { waitUntil: 'networkidle' });
await pg.evaluate(() => document.fonts.ready);
if (opt('hide')) await pg.addStyleTag({ content: `${opt('hide')} { visibility: hidden !important; }` });
await pg.waitForTimeout(600 * K);

const cdp = await ctx.newCDPSession(pg);
await cdp.send('Animation.enable');
await cdp.send('Animation.setPlaybackRate', { playbackRate: 1 / K });
const frames = [];
let n = 0, shooting = true;
const shoot = (async () => {
  while (shooting) {
    const a = Date.now() / 1000;
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 95 });
    const z = Date.now() / 1000;
    const file = `${String(n++).padStart(5, '0')}.jpg`;
    writeFileSync(join(OUT, 'raw', file), Buffer.from(data, 'base64'));
    frames.push({ file, ts: (a + z) / 2 });
  }
})();
const T0 = Date.now() / 1000;
const events = [];
const mark = (name) => events.push({ name, t: +((Date.now() / 1000 - T0) / K).toFixed(3) });
const wait = (ms) => pg.waitForTimeout(ms * K);
let mx = +opt('w', 1280) / 2, my = +opt('h', 960) * .7;
const glide = async (loc) => {
  const bx = await loc.boundingBox(); if (!bx) return;
  const x = bx.x + bx.width / 2, y = bx.y + bx.height / 2, steps = 18;
  for (let i = 1; i <= steps; i++) { const k = i / steps, e = k < .5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
    await pg.mouse.move(mx + (x - mx) * e, my + (y - my) * e); await wait(22); }
  mx = x; my = y;
};
const click = async (loc, name, pause = 400) => { await glide(loc); await wait(120); if (name) mark(name); await loc.click(); await wait(pause); };
const tap = async (loc, name, pause = 400) => { if (name) mark(name); await loc.tap(); await wait(pause); };
const type = async (loc, text, delay = 40) => { await loc.click(); await loc.pressSequentially(text, { delay: delay * K }); };

if (opt('steps')) {
  const steps = (await import(pathToFileURL(resolve(opt('steps'))).href)).default;
  await steps({ page: pg, wait, mark, click, tap, type, K });
} else {
  await wait(+opt('secs', 6) * 1000);
}
mark('end');
shooting = false; await shoot;
await pg.screenshot({ path: join(OUT, 'final.png') });

// Resample to 30fps by virtual time: each output frame shows the latest shot at or before it.
const dur = (frames.at(-1).ts - T0) / K, N = Math.floor(dur * FPS);
let j = 0;
for (let i = 0; i < N; i++) {
  const t = T0 + (i / FPS) * K;
  while (j + 1 < frames.length && frames[j + 1].ts <= t) j++;
  copyFileSync(join(OUT, 'raw', frames[j].file), join(OUT, 'f', `${String(i).padStart(5, '0')}.jpg`));
}
rmSync(join(OUT, 'raw'), { recursive: true, force: true });
const size = await pg.evaluate(() => [innerWidth, innerHeight, devicePixelRatio]);
writeFileSync(join(OUT, 'events.json'), JSON.stringify({ fps: FPS, frames: N, raw: frames.length, K, css: size.slice(0, 2), dpr: size[2], events }, null, 1));
console.log(`${frames.length} shots over ${dur.toFixed(2)}s virtual → ${N} frames at ${FPS}fps (${(frames.length / dur).toFixed(1)} shots per virtual second; under ~30, raise --k)`);
console.log(events.map((e) => `${e.t.toFixed(2)}s ${e.name}`).join('\n'));
await Promise.race([b.close(), new Promise((r) => setTimeout(r, 3000))]);
process.exit(0);
