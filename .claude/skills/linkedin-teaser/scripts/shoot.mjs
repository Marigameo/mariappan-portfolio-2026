// Screenshot a real product page (or one element of it) for a teaser reel.
// Usage: node shoot.mjs <url> <out.png> [--w 1280] [--h 960] [--dpr 2] [--full] [--el "<css>"]
//          [--mobile] [--dark] [--wait 800] [--scroll 0] [--hide ".a,.b"] [--auth state.json]
// --full: the whole scrollable page (for a scroll-through scene). --el: crop to one element.
// --hide: CSS selectors to hide (cookie bars, chat widgets, anything private). --auth: a Playwright
// storageState file for a logged-in page (see references/real-ui.md; delete it when done).
import { chromium } from 'playwright';
import { resolve } from 'path';

const args = process.argv.slice(2);
const pos = args.filter((a, i) => !a.startsWith('--') && !(args[i - 1] || '').match(/^--(w|h|dpr|el|wait|scroll|hide|auth)$/));
const opt = (k, d) => { const i = args.indexOf('--' + k); return i < 0 ? d : args[i + 1]; };
const flag = k => args.includes('--' + k);
const [url, out] = pos;
if (!url || !out) { console.error('usage: node shoot.mjs <url> <out.png> [--w --h --dpr --full --el --mobile --dark --wait --scroll --hide --auth]'); process.exit(1); }

const mobile = flag('mobile');
const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({
  viewport: { width: +opt('w', mobile ? 390 : 1280), height: +opt('h', mobile ? 780 : 960) },
  deviceScaleFactor: +opt('dpr', 2), isMobile: mobile, hasTouch: mobile,
  colorScheme: flag('dark') ? 'dark' : 'light',
  ...(opt('auth') ? { storageState: resolve(opt('auth')) } : {}),
});
const pg = await ctx.newPage();
await pg.goto(url, { waitUntil: 'networkidle' });
await pg.evaluate(() => document.fonts.ready);
if (opt('hide')) await pg.addStyleTag({ content: `${opt('hide')} { visibility: hidden !important; }` });
// Settle: no caret blink, no running transitions caught half-way.
await pg.addStyleTag({ content: '*, *::before, *::after { caret-color: transparent !important; }' });
if (+opt('scroll', 0)) await pg.evaluate(y => scrollTo(0, y), +opt('scroll'));
await pg.waitForTimeout(+opt('wait', 800));
if (opt('el')) await pg.locator(opt('el')).first().screenshot({ path: resolve(out) });
else await pg.screenshot({ path: resolve(out), fullPage: flag('full') });
const size = await pg.evaluate(() => [innerWidth, innerHeight, document.documentElement.scrollHeight]);
console.log(`${resolve(out)}  (css ${size[0]}×${size[1]}, page height ${size[2]}, dpr ${opt('dpr', 2)})`);
await Promise.race([b.close(), new Promise(r => setTimeout(r, 3000))]);
process.exit(0);
