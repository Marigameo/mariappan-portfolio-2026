/* The Brand wait from Strive's image generation, rebuilt for the story page
   (src/pages/experiments/studio/image-generation.astro). A playground, not the
   product code: the product's GeneratedImage lives in Strive's shared library.
   This one follows the build journal's final rules
   (side-builds/strivelabs-image-gen-loading/JOURNAL.md, rounds 2 to 7):

   - Progress is an estimate from elapsed time that slows near the end and never
     finishes on its own. Only the image arriving finishes it.
   - Particles in the logo's gradient lay the mark down in stroke order: the
     first hook to ~40%, the bar to ~70%, then the second hook.
   - A particle is a dot only in flight. Once it lands it widens into a window
     onto the real logo artwork, so the mark reads as a surface, not dots.
   - The mark starts dim (~28%) and tops out at ~75%: no full-brightness moment.
   - When the image is ready the rest of the mark is laid down (faster, still
     travelling), it rests 0.3s, then goes out of focus as the image comes into
     focus: fade in blurred and slightly enlarged, then sharpen and settle.
   - The pointer pushes particles aside (opening a hole in the mark); a click
     sends a ring through them and hides the percent chip.

   Two modes: "run" plays simulated generations on a button; "scrub" maps a
   range input straight to the estimate. Both pause when off screen. */

/* ---------- The Strive mark (public/images/logos/strivelabs.svg) ---------- */
const HOOK_1 = 'M26.1402 82.6L27.2708 86.2328C29.9802 94.9382 25.1486 104.207 16.4719 106.929L12.8526 108.064L10.5905 100.799L14.2098 99.6636C18.8856 98.197 21.4936 93.1989 20.0319 88.5023L18.9013 84.8696L26.1402 82.6Z';
const HOOK_2 = 'M42.0058 90.9408L38.3862 92.0756C29.7128 94.7949 24.8707 104.059 27.5822 112.767L28.7132 116.4L35.9519 114.13L34.8208 110.497C33.3599 105.805 35.9689 100.808 40.6475 99.3411L44.267 98.2064L42.0058 90.9408Z';
const BAR = 'M44.267 98.2061L12.8525 108.059L10.5905 100.794L42.0052 90.9409L44.267 98.2061Z';
const STOPS = ['#F9DBCF', '#F6A509', '#F34D13', '#7A03BD'];
const GRADS: [number, number, number, number, boolean][] = [
  [17.0666, 67.4875, 28.3407, 101.966, false], // first hook
  [36.7734, 131.042, 27.901, 96.1024, false], // second hook
  [8.83884, 109.289, 49.5781, 91.4491, true], // bar (stops reversed)
];
// The mark's box is 10.59 → 44.27 by 82.6 → 116.4; it fills MARK of the field.
const MARK = 0.48;
const SC = MARK / 33.8;
const OX = 0.5 - 27.43 * SC;
const OY = 0.5 - 99.5 * SC;

// Centre lines, so each piece is laid down along its length like a stroke.
const LINE_HOOK_1: [number, number][] = [[22.6, 83.4], [24.6, 90], [22.2, 97], [16.3, 102.4], [11.6, 104.4]];
const LINE_BAR: [number, number][] = [[11.7, 104.4], [43.1, 94.6]];
const LINE_HOOK_2: [number, number][] = [[43.1, 94.6], [37.5, 97], [32.6, 101.3], [31.1, 107.5], [32.3, 115.3]];

/* ---------- Small helpers ---------- */
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
/** How far along a polyline (0..1) the nearest point to (x, y) sits. */
function along(line: [number, number][], x: number, y: number) {
  const lens: number[] = [];
  let total = 0;
  for (let i = 1; i < line.length; i++) {
    const l = Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]);
    lens.push(l);
    total += l;
  }
  let best = Infinity, at = 0, run = 0;
  for (let i = 1; i < line.length; i++) {
    const [ax, ay] = line[i - 1], [bx, by] = line[i];
    const dx = bx - ax, dy = by - ay;
    const t = clamp(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy), 0, 1);
    const d = Math.hypot(ax + dx * t - x, ay + dy * t - y);
    if (d < best) { best = d; at = (run + t * lens[i - 1]) / total; }
    run += lens[i - 1];
  }
  return at;
}

/** Paint the mark at full strength onto a context already scaled to field units × size. */
function paintMark(ctx: CanvasRenderingContext2D) {
  [HOOK_1, HOOK_2, BAR].forEach((d, i) => {
    const [x1, y1, x2, y2, rev] = GRADS[i];
    const g = ctx.createLinearGradient(x1, y1, x2, y2);
    (rev ? [...STOPS].reverse() : STOPS).forEach((c, j) => g.addColorStop(j / 3, c));
    ctx.fillStyle = g;
    ctx.fill(new Path2D(d), 'evenodd');
  });
}
function markTransform(ctx: CanvasRenderingContext2D, px: number) {
  ctx.setTransform(px * SC, 0, 0, px * SC, px * OX, px * OY);
}

/* ---------- Particles, in field units (0..1) ---------- */
interface Particle {
  tx: number; ty: number; // landing spot (targets only)
  x: number; y: number; vx: number; vy: number;
  th: number; // estimate at which it's called in
  col: string;
  w: number; // 0 = a dot in flight, 1 = a window onto the mark
  a: number; rho: number; om: number; seed: number;
  target: boolean;
}

const SPACING = MARK / 36;
const COVER = SPACING * 0.8; // ≥ spacing / √2, so landed windows close every gap

function buildParticles(): Particle[] {
  // Sample the mark on a grid, sort each piece along its stroke, and give
  // every landing spot the estimate at which it's called in.
  const probe = document.createElement('canvas').getContext('2d')!;
  const K = 1000;
  markTransform(probe, K);
  const paths = [new Path2D(HOOK_1), new Path2D(BAR), new Path2D(HOOK_2)];
  const lines = [LINE_HOOK_1, LINE_BAR, LINE_HOOK_2];
  const spans: [number, number][] = [[0.02, 0.4], [0.4, 0.7], [0.7, 0.985]];
  const groups: { x: number; y: number; key: number }[][] = [[], [], []];
  const rand = rng(7);
  for (let y = 0.5 - MARK / 2; y <= 0.5 + MARK / 2; y += SPACING) {
    for (let x = 0.5 - MARK / 2; x <= 0.5 + MARK / 2; x += SPACING) {
      const gi = paths.findIndex((p) => probe.isPointInPath(p, x * K, y * K, 'evenodd'));
      if (gi < 0) continue;
      const lx = (x - OX) / SC, ly = (y - OY) / SC;
      groups[gi].push({ x, y, key: along(lines[gi], lx, ly) + (rand() - 0.5) * 0.05 });
    }
  }
  // Colours come from the artwork itself, sampled once from a small raster.
  const N = 256;
  const raster = document.createElement('canvas');
  raster.width = raster.height = N;
  const rc = raster.getContext('2d', { willReadFrequently: true })!;
  markTransform(rc, N);
  paintMark(rc);
  const px = rc.getImageData(0, 0, N, N).data;
  const colourAt = (x: number, y: number) => {
    const i = (clamp(Math.round(y * N), 0, N - 1) * N + clamp(Math.round(x * N), 0, N - 1)) * 4;
    return `rgb(${px[i]},${px[i + 1]},${px[i + 2]})`;
  };

  const out: Particle[] = [];
  const orbit = (target: boolean): Omit<Particle, 'tx' | 'ty' | 'th' | 'col' | 'target'> => {
    const a = rand() * Math.PI * 2, rho = 0.17 + rand() * 0.33;
    return { x: 0.5 + Math.cos(a) * rho, y: 0.5 + Math.sin(a) * rho, vx: 0, vy: 0, w: 0, a, rho, om: (0.06 + rand() * 0.1) * (target ? 1 : 0.7), seed: rand() };
  };
  groups.forEach((g, gi) => {
    g.sort((p, q) => p.key - q.key);
    const [s0, s1] = spans[gi];
    g.forEach((p, i) => {
      out.push({ ...orbit(true), tx: p.x, ty: p.y, th: s0 + (s1 - s0) * (i / Math.max(1, g.length - 1)), col: colourAt(p.x, p.y), target: true });
    });
  });
  // A quieter cloud that never lands.
  const ambient = ['#F6A509', '#F34D13', '#F34D13', '#C2338A'];
  for (let i = 0; i < 170; i++) out.push({ ...orbit(false), tx: 0, ty: 0, th: 2, col: ambient[i % ambient.length], target: false });
  return out;
}

/* ---------- Generated pictures (drawn here, so the page needs no network) ---------- */
interface Scene { prompt: string; file: string; aspect: number; wait: number; draw: (c: CanvasRenderingContext2D, w: number, h: number) => void }

const SCENES: Scene[] = [
  {
    prompt: 'Dunes at golden hour', file: 'dunes-at-golden-hour', aspect: 16 / 9, wait: 7.5,
    draw(c, w, h) {
      const sky = c.createLinearGradient(0, 0, 0, h * 0.7);
      sky.addColorStop(0, '#e98a5b'); sky.addColorStop(0.55, '#f6c08c'); sky.addColorStop(1, '#fde6c4');
      c.fillStyle = sky; c.fillRect(0, 0, w, h);
      const sx = w * 0.66, sy = h * 0.47;
      const halo = c.createRadialGradient(sx, sy, 0, sx, sy, w * 0.28);
      halo.addColorStop(0, 'rgba(255,246,222,.95)'); halo.addColorStop(0.18, 'rgba(255,236,200,.55)'); halo.addColorStop(1, 'rgba(255,236,200,0)');
      c.fillStyle = halo; c.fillRect(0, 0, w, h);
      c.fillStyle = '#fff7e6'; c.beginPath(); c.arc(sx, sy, w * 0.045, 0, Math.PI * 2); c.fill();
      const layers = [
        { base: 0.6, amp: 0.05, f: 1.3, ph: 0.4, top: '#e7a571', bot: '#d48756' },
        { base: 0.68, amp: 0.07, f: 1.0, ph: 2.1, top: '#d9864f', bot: '#bb6539' },
        { base: 0.78, amp: 0.06, f: 1.6, ph: 4.0, top: '#c06637', bot: '#97482a' },
        { base: 0.9, amp: 0.07, f: 0.8, ph: 1.2, top: '#924126', bot: '#6a2c1b' },
      ];
      for (const L of layers) {
        const ridge = (x: number) => h * (L.base - L.amp * Math.sin((x / w) * Math.PI * L.f + L.ph) - L.amp * 0.4 * Math.sin((x / w) * Math.PI * L.f * 2.7 + L.ph * 2));
        const g = c.createLinearGradient(0, h * (L.base - L.amp * 1.4), 0, h);
        g.addColorStop(0, L.top); g.addColorStop(1, L.bot);
        c.fillStyle = g; c.beginPath(); c.moveTo(0, h);
        for (let x = 0; x <= w; x += 8) c.lineTo(x, ridge(x));
        c.lineTo(w, h); c.closePath(); c.fill();
        c.strokeStyle = 'rgba(255,232,196,.35)'; c.lineWidth = 2; c.beginPath();
        for (let x = 0; x <= w; x += 8) (x ? c.lineTo(x, ridge(x)) : c.moveTo(x, ridge(x)));
        c.stroke();
      }
    },
  },
  {
    prompt: 'Citrus slices on a blue table', file: 'citrus-slices-on-a-blue-table', aspect: 1, wait: 4.5,
    draw(c, w, h) {
      const bg = c.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, '#3b67dc'); bg.addColorStop(1, '#1f3f9e');
      c.fillStyle = bg; c.fillRect(0, 0, w, h);
      const slices = [
        { x: 0.37, y: 0.38, r: 0.21, rind: '#f28a1c', flesh: '#ffb347' },
        { x: 0.68, y: 0.62, r: 0.17, rind: '#f2c81f', flesh: '#ffe36b' },
        { x: 0.3, y: 0.76, r: 0.12, rind: '#e2532d', flesh: '#ff8a5c' },
      ];
      for (const s of slices) {
        const x = s.x * w, y = s.y * h, r = s.r * w;
        c.fillStyle = 'rgba(8,20,60,.35)'; c.beginPath(); c.ellipse(x + r * 0.12, y + r * 0.16, r, r, 0, 0, Math.PI * 2); c.fill();
        c.fillStyle = s.rind; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
        c.fillStyle = '#fff3dc'; c.beginPath(); c.arc(x, y, r * 0.9, 0, Math.PI * 2); c.fill();
        const n = 9;
        for (let i = 0; i < n; i++) {
          const a0 = (i / n) * Math.PI * 2 + 0.05, a1 = ((i + 1) / n) * Math.PI * 2 - 0.05;
          c.fillStyle = s.flesh; c.beginPath(); c.moveTo(x + Math.cos((a0 + a1) / 2) * r * 0.08, y + Math.sin((a0 + a1) / 2) * r * 0.08);
          c.arc(x, y, r * 0.82, a0, a1); c.closePath(); c.fill();
        }
        c.fillStyle = 'rgba(255,255,255,.25)'; c.beginPath(); c.arc(x - r * 0.3, y - r * 0.3, r * 0.22, 0, Math.PI * 2); c.fill();
      }
      c.fillStyle = '#3f9d5a'; c.beginPath(); c.ellipse(w * 0.62, h * 0.24, w * 0.09, w * 0.035, -0.6, 0, Math.PI * 2); c.fill();
      c.strokeStyle = '#2d7a44'; c.lineWidth = w * 0.004; c.beginPath(); c.moveTo(w * 0.555, h * 0.285); c.lineTo(w * 0.685, h * 0.195); c.stroke();
    },
  },
  {
    prompt: 'Moonrise over a calm sea', file: 'moonrise-over-a-calm-sea', aspect: 4 / 5, wait: 10,
    draw(c, w, h) {
      const hz = h * 0.58;
      const sky = c.createLinearGradient(0, 0, 0, hz);
      sky.addColorStop(0, '#0c1230'); sky.addColorStop(0.6, '#25315f'); sky.addColorStop(1, '#6a5a8e');
      c.fillStyle = sky; c.fillRect(0, 0, w, hz);
      const r = rng(11);
      for (let i = 0; i < 140; i++) { c.fillStyle = `rgba(255,255,255,${0.25 + r() * 0.6})`; c.beginPath(); c.arc(r() * w, r() * hz * 0.8, r() * 1.6 + 0.4, 0, Math.PI * 2); c.fill(); }
      const mx = w * 0.62, my = h * 0.3, mr = w * 0.075;
      const halo = c.createRadialGradient(mx, my, mr, mx, my, mr * 5);
      halo.addColorStop(0, 'rgba(255,244,214,.45)'); halo.addColorStop(1, 'rgba(255,244,214,0)');
      c.fillStyle = halo; c.fillRect(0, 0, w, hz);
      c.fillStyle = '#fff4d8'; c.beginPath(); c.arc(mx, my, mr, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#1b2045'; c.beginPath(); c.moveTo(0, hz); c.lineTo(0, hz - h * 0.03); c.quadraticCurveTo(w * 0.12, hz - h * 0.06, w * 0.26, hz - h * 0.012); c.lineTo(w * 0.3, hz); c.fill();
      const sea = c.createLinearGradient(0, hz, 0, h);
      sea.addColorStop(0, '#283463'); sea.addColorStop(1, '#090d24');
      c.fillStyle = sea; c.fillRect(0, hz, w, h - hz);
      for (let y = hz + 6; y < h; y += 9) {
        const k = (y - hz) / (h - hz);
        const half = w * (0.03 + k * 0.1) * (0.6 + r() * 0.7);
        c.fillStyle = `rgba(255,240,205,${0.55 * (1 - k) + 0.05})`;
        c.fillRect(mx - half + (r() - 0.5) * w * 0.04, y, half * 2, 2 + k * 2);
      }
    },
  },
];

const sceneCache = new Map<Scene, string>();
function renderScene(s: Scene) {
  let url = sceneCache.get(s);
  if (!url) {
    const w = 1200, h = Math.round(w / s.aspect);
    const cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    s.draw(cv.getContext('2d')!, w, h);
    url = cv.toDataURL('image/jpeg', 0.9);
    sceneCache.set(s, url);
  }
  return url;
}

/* ---------- The engine ---------- */
type State = 'waiting' | 'finishing' | 'resting' | 'revealing' | 'done';

class BrandWait {
  private root: HTMLElement;
  private mode: 'run' | 'scrub';
  private well: HTMLElement;
  private stage: HTMLElement;
  private field: HTMLElement;
  private main: HTMLCanvasElement;
  private soft: HTMLCanvasElement;
  private temp = document.createElement('canvas');
  private art = document.createElement('canvas');
  private chip: HTMLElement;
  private chipNum: HTMLElement;
  private img?: HTMLImageElement;
  private dl?: HTMLAnchorElement;
  private status?: HTMLElement;
  private live?: HTMLElement;
  private prompt?: HTMLElement;
  private range?: HTMLInputElement;

  private parts = buildParticles();
  private S = 0;
  private dpr = 1;
  private reduce = matchMedia('(prefers-reduced-motion: reduce)');
  private dark = false;
  private darkCheck = 0;

  private visible = false;
  private raf = 0;
  private last = 0;
  private t = 0; // animation clock (only runs while visible)

  private mp = 0; // mark progress, 0..1 (the estimate, then the finish)
  private shownPct = -1;
  private state: State = 'waiting';
  private tRun = 0;
  private tState = 0;
  private p0 = 0;
  private finishDur = 1;
  private scene = 0;
  private started = false;

  private pointer: { x: number; y: number } | null = null;
  private rings: { x: number; y: number; t: number }[] = [];
  private chipHidden = false;

  constructor(root: HTMLElement) {
    this.root = root;
    this.mode = root.dataset.bw === 'scrub' ? 'scrub' : 'run';
    const q = <T extends Element>(s: string) => root.querySelector<T>(s)!;
    this.well = q('[data-bw-well]');
    this.stage = q('[data-bw-stage]');
    this.field = q('[data-bw-field]');
    this.main = q('[data-bw-main]');
    this.soft = q('[data-bw-soft]');
    this.chip = q('[data-bw-chip]');
    this.chipNum = q('[data-bw-pct]');
    this.img = root.querySelector<HTMLImageElement>('[data-bw-img]') ?? undefined;
    this.dl = root.querySelector<HTMLAnchorElement>('[data-bw-dl]') ?? undefined;
    this.status = root.querySelector<HTMLElement>('[data-bw-status]') ?? undefined;
    this.live = root.querySelector<HTMLElement>('[data-bw-live]') ?? undefined;
    this.prompt = root.querySelector<HTMLElement>('[data-bw-prompt]') ?? undefined;
    this.range = root.querySelector<HTMLInputElement>('[data-bw-range]') ?? undefined;

    new ResizeObserver(() => this.resize()).observe(this.well);
    new IntersectionObserver(([e]) => { this.visible = e.isIntersecting; this.kick(); }, { threshold: 0.15 }).observe(this.stage);
    document.addEventListener('visibilitychange', () => this.kick());

    this.stage.addEventListener('pointermove', (e) => { this.pointer = this.toField(e); this.kick(); });
    this.stage.addEventListener('pointerleave', () => (this.pointer = null));
    this.stage.addEventListener('pointercancel', () => (this.pointer = null));
    this.stage.addEventListener('click', (e) => {
      if ((e.target as Element).closest('a, button')) return;
      if (this.state === 'done' || this.state === 'revealing') return;
      this.rings.push({ ...this.toField(e), t: 0 });
      this.chipHidden = !this.chipHidden;
      this.chip.classList.toggle('is-hidden', this.chipHidden);
      this.kick();
    });

    if (this.mode === 'scrub' && this.range) {
      const r = this.range;
      const sync = () => {
        this.mp = Number(r.value) / 100;
        const v = Number(r.value);
        r.setAttribute('aria-valuetext', `${v}%, ${v < 40 ? 'laying the first hook' : v < 70 ? 'laying the bar' : v < 100 ? 'laying the second hook' : 'the whole mark'}`);
        this.kick();
      };
      r.addEventListener('input', sync);
      sync();
    } else {
      root.querySelector('[data-bw-go]')?.addEventListener('click', () => this.generate());
    }
    this.dark = getComputedStyle(document.documentElement).colorScheme.includes('dark');
    this.resize();
  }

  private toField(e: PointerEvent | MouseEvent) {
    const r = this.field.getBoundingClientRect();
    return { x: (e.clientX - r.left) / this.S, y: (e.clientY - r.top) / this.S };
  }

  /* ----- Size ----- */
  private resize() {
    const avail = this.well.clientWidth;
    const S = Math.round(Math.min(avail, Number(this.root.dataset.max ?? 440)));
    if (!S || S === this.S) return;
    this.S = S;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.root.style.setProperty('--bw-s', `${S}px`);
    const px = Math.round(S * this.dpr);
    for (const c of [this.main, this.temp, this.art, this.soft]) { c.width = px; c.height = px; }
    // The artwork, once per size; the soft copy is the same artwork under a CSS blur.
    for (const c of [this.art, this.soft]) {
      const ctx = c.getContext('2d')!;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, px, px);
      markTransform(ctx, px);
      paintMark(ctx);
    }
    this.soft.style.filter = `blur(${Math.round(S * 0.03)}px)`;
    if (this.state === 'done' || this.state === 'revealing') this.fitBox(false);
    else this.setBox(S, S, false);
    this.draw();
  }

  private setBox(w: number, h: number, animate: boolean) {
    this.stage.classList.toggle('is-moving', animate && !this.reduce.matches);
    this.stage.style.width = `${Math.round(w)}px`;
    this.stage.style.height = `${Math.round(h)}px`;
  }
  /** The box holds its square until the image opens, then takes the image's shape. */
  private fitBox(animate: boolean) {
    const a = SCENES[this.scene].aspect, S = this.S;
    if (a >= 1) this.setBox(S, S / a, animate);
    else this.setBox(S * a, S, animate);
  }

  /* ----- The run ----- */
  private generate() {
    if (this.mode !== 'run' || !this.img) return;
    if (this.started) this.scene = (this.scene + 1) % SCENES.length;
    this.started = true;
    const s = SCENES[this.scene];
    this.state = 'waiting';
    this.tRun = 0;
    this.tState = 0;
    this.mp = 0;
    this.chipHidden = false;
    this.chip.classList.remove('is-hidden');
    this.root.classList.remove('is-done');
    this.img.getAnimations().forEach((a) => a.cancel());
    this.img.style.opacity = '0';
    this.field.getAnimations().forEach((a) => a.cancel());
    this.chip.style.opacity = '';
    if (!this.reduce.matches) this.field.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 350, easing: 'ease-out' });
    this.setBox(this.S, this.S, true);
    if (this.prompt) this.prompt.textContent = `“${s.prompt}”`;
    if (this.dl) this.dl.download = `${s.file}.jpg`;
    this.say(`Generating “${s.prompt}”.`);
    this.kick();
  }

  private ready() {
    // The image has arrived: lay the rest of the mark down, a little faster
    // than during the wait but still travelling.
    this.state = 'finishing';
    this.tState = 0;
    this.p0 = this.mp;
    this.finishDur = this.reduce.matches ? 0.3 : 0.6 + (1 - this.p0) * 1.6;
  }

  private reveal() {
    const img = this.img!, s = SCENES[this.scene];
    this.state = 'revealing';
    this.tState = 0;
    img.src = renderScene(s);
    img.alt = `The generated image for “${s.prompt}”.`;
    if (this.dl) this.dl.href = img.src;
    this.fitBox(true);
    const still = this.reduce.matches;
    const blur = Math.round(this.S * 0.035);
    this.field.animate(
      still ? [{ opacity: 1 }, { opacity: 0 }] : [{ filter: 'blur(0px)', opacity: 1 }, { filter: `blur(${blur}px)`, opacity: 0 }],
      { duration: still ? 300 : 800, easing: 'ease-in', fill: 'forwards' },
    );
    this.chip.style.opacity = '0';
    img.style.opacity = '';
    // Fade in blurred and slightly enlarged (0.65s), then sharpen and settle (1.5s).
    const anim = img.animate(
      still
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [
            { opacity: 0, filter: 'blur(22px)', transform: 'scale(1.06)' },
            { opacity: 1, filter: 'blur(12px)', transform: 'scale(1.035)', offset: 0.3 },
            { opacity: 1, filter: 'blur(0px)', transform: 'scale(1)' },
          ],
      { duration: still ? 400 : 2150, easing: 'cubic-bezier(.25,.6,.25,1)', fill: 'forwards' },
    );
    anim.finished.then(() => {
      if (this.state !== 'revealing') return;
      this.state = 'done';
      this.root.classList.add('is-done');
      this.say('Image ready.');
    }).catch(() => {});
  }

  private say(text: string) { if (this.live) this.live.textContent = text; }

  /* ----- The loop ----- */
  private kick() {
    if (this.raf || !this.visible || document.hidden || !this.S) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private frame = (now: number) => {
    this.raf = 0;
    const dt = Math.min((now - this.last) / 1000, 1 / 30);
    this.last = now;
    if (!this.visible || document.hidden) return;
    if (this.mode === 'run' && !this.started) this.generate();
    this.step(dt);
    this.draw();
    const idle = this.state === 'done' || (this.mode === 'scrub' && this.reduce.matches);
    if (!idle) this.raf = requestAnimationFrame(this.frame);
  };

  private step(dt: number) {
    this.t += dt;
    if (--this.darkCheck <= 0) {
      this.darkCheck = 30;
      this.dark = getComputedStyle(document.documentElement).colorScheme.includes('dark');
    }

    if (this.mode === 'run') {
      this.tRun += dt;
      this.tState += dt;
      const s = SCENES[this.scene];
      if (this.state === 'waiting') {
        // The model reports no progress: an estimate from elapsed time that
        // slows as it nears the end and never finishes on its own.
        this.mp = 0.96 * (1 - Math.exp(-this.tRun / 6));
        if (this.tRun >= s.wait) this.ready();
      } else if (this.state === 'finishing') {
        const k = clamp(this.tState / this.finishDur, 0, 1);
        this.mp = this.p0 + (1 - this.p0) * ease(k);
        if (k >= 1) {
          // If a pointer is holding particles out of place, stop waiting after 2.4s.
          const settled = this.parts.every((p) => !p.target || p.w > 0.97);
          if (settled || this.reduce.matches || this.tState > this.finishDur + 2.4) { this.state = 'resting'; this.tState = 0; }
        }
      } else if (this.state === 'resting' && this.tState >= 0.3) {
        this.reveal();
      }
      if (this.status) this.status.textContent = this.state === 'waiting' ? `generating · ${this.tRun.toFixed(1)}s` : `image back in ${s.wait.toFixed(1)}s`;
    }

    const pct = Math.round(this.mp * 100);
    if (pct !== this.shownPct) { this.shownPct = pct; this.chipNum.textContent = `${pct}%`; }

    if (this.reduce.matches) return;
    this.rings = this.rings.filter((r) => (r.t += dt) < 0.7);
    const R = 0.11;
    for (const p of this.parts) {
      const called = p.target && this.mp >= p.th;
      let gx: number, gy: number, k: number, c: number;
      if (called) {
        gx = p.tx; gy = p.ty; k = 42; c = 9.5;
      } else {
        p.a += p.om * dt;
        gx = 0.5 + Math.cos(p.a) * p.rho;
        gy = 0.5 + Math.sin(p.a) * p.rho * 0.92 + Math.sin(this.t * 0.7 + p.seed * 6.28) * 0.015;
        k = 3; c = 2.6;
      }
      let fx = k * (gx - p.x) - c * p.vx;
      let fy = k * (gy - p.y) - c * p.vy;
      if (this.pointer) {
        const dx = p.x - this.pointer.x, dy = p.y - this.pointer.y, d = Math.hypot(dx, dy);
        if (d < R && d > 1e-4) { const f = (1 - d / R) ** 2 * 14; fx += (dx / d) * f; fy += (dy / d) * f; }
      }
      for (const r of this.rings) {
        const dx = p.x - r.x, dy = p.y - r.y, d = Math.hypot(dx, dy), front = r.t * 0.75;
        const band = 1 - Math.abs(d - front) / 0.05;
        if (band > 0 && d > 1e-4) { const f = band * 9 * (1 - r.t / 0.7); fx += (dx / d) * f; fy += (dy / d) * f; }
      }
      p.vx += fx * dt; p.vy += fy * dt;
      const sp = Math.hypot(p.vx, p.vy);
      if (sp > 1.6) { p.vx *= 1.6 / sp; p.vy *= 1.6 / sp; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (called) {
        const d = Math.hypot(p.x - p.tx, p.y - p.ty);
        if (d < 0.004) p.w = Math.min(1, p.w + dt / 0.35);
        else if (d > 0.008) p.w = Math.max(0, p.w - dt / 0.15);
      } else if (p.w > 0) {
        p.w = Math.max(0, p.w - dt / 0.15);
      }
    }
  }

  private draw() {
    const S = this.S, px = Math.round(S * this.dpr);
    if (!S) return;
    const ctx = this.main.getContext('2d')!;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, px, px);
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const still = this.reduce.matches;
    const mp = this.mp;

    // 1. A quiet ground of dots, with a slow shimmer passing across it.
    const g = clamp(S / 34, 9, 14);
    const ink = this.dark ? '242,237,227' : '20,20,20';
    for (let y = g / 2; y < S; y += g) {
      for (let x = g / 2; x < S; x += g) {
        const wave = still ? 0.5 : Math.max(0, Math.sin(((x * 0.6 + y * 0.4) / S) * 6 - this.t * 1.1));
        ctx.fillStyle = `rgba(${ink},${(this.dark ? 0.09 : 0.1) * (0.65 + 0.7 * wave)})`;
        ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
      }
    }

    // 2. A warm glow that gathers with the mark and breathes a little: a tint, not a colour.
    const breathe = still ? 1 : 1 + 0.08 * Math.sin(this.t * 1.6);
    const ga = (0.04 + 0.12 * mp) * breathe * (this.dark ? 1.5 : 1);
    const glow = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S * 0.44);
    glow.addColorStop(0, `rgba(249,115,22,${ga})`);
    glow.addColorStop(0.5, `rgba(249,115,22,${ga * 0.45})`);
    glow.addColorStop(1, 'rgba(249,115,22,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, S, S);

    // 3. The mark: dim at first, never past ~75%.
    const strength = 0.28 + 0.47 * mp;
    if (still) {
      ctx.globalAlpha = strength * clamp(mp * 1.6, 0, 1);
      ctx.drawImage(this.art, 0, 0, S, S);
      ctx.globalAlpha = 1;
      return;
    }
    const tc = this.temp.getContext('2d')!;
    tc.setTransform(1, 0, 0, 1, 0, 0);
    tc.globalCompositeOperation = 'source-over';
    tc.clearRect(0, 0, px, px);
    tc.setTransform(px, 0, 0, px, 0, 0);
    tc.fillStyle = '#000';
    tc.beginPath();
    const dot = 1.3 / S;
    for (const p of this.parts) {
      if (p.w <= 0) continue;
      const r = dot + (COVER - dot) * ease(p.w);
      tc.moveTo(p.x + r, p.y);
      tc.arc(p.x, p.y, r, 0, Math.PI * 2);
    }
    tc.fill();
    tc.setTransform(1, 0, 0, 1, 0, 0);
    tc.globalCompositeOperation = 'source-in';
    tc.drawImage(this.art, 0, 0);
    // A slow band of light across the formed mark.
    tc.globalCompositeOperation = 'source-atop';
    const bx = (((this.t * 0.16) % 1.8) - 0.4) * px;
    const band = tc.createLinearGradient(bx - px * 0.12, 0, bx + px * 0.12, px * 0.25);
    band.addColorStop(0, 'rgba(255,255,255,0)');
    band.addColorStop(0.5, 'rgba(255,255,255,.22)');
    band.addColorStop(1, 'rgba(255,255,255,0)');
    tc.fillStyle = band;
    tc.fillRect(0, 0, px, px);
    tc.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = strength;
    ctx.drawImage(this.temp, 0, 0, S, S);

    // 4. Particles in flight: small and quiet.
    for (const p of this.parts) {
      if (p.w >= 1) continue;
      const called = p.target && mp >= p.th;
      ctx.globalAlpha = (p.target ? (called ? 0.9 : 0.5) : 0.32) * (1 - p.w);
      ctx.fillStyle = p.col;
      ctx.beginPath();
      ctx.arc(p.x * S, p.y * S, p.target ? 1.3 : 1.05, 0, Math.PI * 2);
      ctx.fill();
    }
    // 5. A click's ring, barely there.
    for (const r of this.rings) {
      ctx.globalAlpha = 0.28 * (1 - r.t / 0.7);
      ctx.strokeStyle = '#F34D13';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(r.x * S, r.y * S, r.t * 0.75 * S, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
}

export function mountBrandWait() {
  document.querySelectorAll<HTMLElement>('[data-bw]:not([data-bw-ready])').forEach((el) => {
    el.dataset.bwReady = '';
    new BrandWait(el);
  });
}
