/* The tune-search story's simulations. Each [data-sim] is drawn here and plays a
   scripted timeline: the same moment untuned and tuned, side by side, in real time.
   The org switcher itself is shown by its real recordings, not a sim.
   Each [data-call] is a question: picking an answer opens its reveal and plays the
   sim inside. Without this script the reveals stay open and each sim shows its
   fallback line, so the story still reads. Org names and pages are made up. */

const STOP = Symbol('stop');
type Wait = (ms: number) => Promise<void>;
type Sim = { play: () => void };

// One timeline at a time per sim: a new play cancels the waits of the old one.
function player(run: (wait: Wait) => Promise<void>) {
  let id = 0;
  return () => {
    const me = ++id;
    const wait: Wait = (ms) => new Promise((res, rej) => setTimeout(() => (me === id ? res() : rej(STOP)), ms));
    run(wait).catch((e) => { if (e !== STOP) throw e; });
  };
}

function h<K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', html = ''): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (html) el.innerHTML = html;
  return el;
}
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const searchIcon = '<svg class="ms-icon" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></svg>';
const tag = (tone: 'before' | 'after', text?: string) => `<span class="sim-tag sim-tag--${tone}">${text ?? (tone === 'before' ? 'Untuned' : 'Tuned')}</span>`;

/* A small search box with a panel: the building block of most sims. */
interface Row { id: string; label: string; meta?: string; head?: boolean; on?: boolean }
function miniSearch(tone: 'before' | 'after', label?: string) {
  const root = h('div', `ms ms--${tone}`, `${tag(tone, label)}
    <div class="ms-box">
      <div class="ms-input">${searchIcon}<span class="ms-q"></span><span class="ms-caret"></span></div>
      <div class="ms-panel"><ul class="ms-list"></ul></div>
      <p class="ms-toast"></p>
    </div>
    <p class="sim-note" aria-live="polite"></p>`);
  const q = root.querySelector<HTMLElement>('.ms-q')!;
  const panel = root.querySelector<HTMLElement>('.ms-panel')!;
  const list = root.querySelector<HTMLElement>('.ms-list')!;
  const toast = root.querySelector<HTMLElement>('.ms-toast')!;
  const note = root.querySelector<HTMLElement>('.sim-note')!;
  return {
    root, panel, list,
    query: (html: string) => { q.innerHTML = html; },
    rows: (rows: Row[]) => {
      list.innerHTML = rows.map((r) => r.head
        ? `<li class="ms-head">${esc(r.label)}</li>`
        : `<li class="ms-row${r.on ? ' is-on' : ''}"><span>${esc(r.label)}</span>${r.meta ? `<em>${esc(r.meta)}</em>` : ''}</li>`).join('');
    },
    open: (on: boolean) => panel.classList.toggle('is-closed', !on),
    dim: (on: boolean) => panel.classList.toggle('is-dim', on),
    toast: (text: string, good?: boolean) => {
      toast.textContent = text;
      toast.className = `ms-toast${text ? ' is-on' : ''}${good === undefined ? '' : good ? ' is-good' : ' is-bad'}`;
    },
    note: (text: string) => { note.textContent = text; },
  };
}
type Mini = ReturnType<typeof miniSearch>;

function keycaps() {
  const el = h('p', 'keys', '<span class="keys-label">Keys</span>');
  return {
    el,
    reset: () => { el.querySelectorAll('kbd').forEach((k) => k.remove()); },
    press: (key: string) => {
      const k = h('kbd', 'is-down', esc(key));
      el.append(k);
      setTimeout(() => k.classList.remove('is-down'), 180);
    },
  };
}

/* ---------- Panel height: fit, resize later, or never shrink ------------------- */
const PAGES = ['Invoices', 'Invoice templates', 'Inventory', 'Integrations', 'Insights', 'Invite teammates', 'Billing', 'Sign-in methods', 'Settings', 'Team', 'Usage', 'Brand kit'];

function height(el: HTMLElement): Sim {
  const stages = el.querySelector<HTMLElement>('.sim-stages')!;
  const kinds = [
    { id: 'fit', label: 'A · Fit the results' },
    { id: 'later', label: 'B · Resize when typing stops' },
    { id: 'grow', label: 'C · Never shrink while open' },
  ];
  const cols = kinds.map((k) => {
    const root = h('div', `ht ht--${k.id}`, `<span class="sim-tag sim-tag--${k.id === 'grow' ? 'after' : 'before'}">${k.label}</span>
      <div class="ht-screen" aria-hidden="true">
        <div class="ms-input">${searchIcon}<span class="ms-q"></span><span class="ms-caret"></span></div>
        <div class="ht-panel is-closed"><ul></ul><p class="ht-foot">Search all for “<span></span>”</p></div>
        <i></i><i></i><i></i>
      </div>
      <p class="sim-note" aria-live="polite"></p>`);
    stages.append(root);
    return { ...k, root, q: root.querySelector<HTMLElement>('.ms-q')!, panel: root.querySelector<HTMLElement>('.ht-panel')!, list: root.querySelector<HTMLElement>('ul')!, foot: root.querySelector<HTMLElement>('.ht-foot')!, footQ: root.querySelector<HTMLElement>('.ht-foot span')!, note: root.querySelector<HTMLElement>('.sim-note')!, rows: 0, jumps: 0 };
  });
  type Col = (typeof cols)[number];
  const ROW = 24;

  const count = (c: Col) => `The footer jumped ${c.jumps === 0 ? 'never' : c.jumps === 1 ? 'once' : `${c.jumps} times`}.`;
  const setRows = (c: Col, rows: number) => {
    if (c.rows && rows !== c.rows) {
      c.jumps++;
      c.foot.classList.remove('is-jump');
      void c.foot.offsetWidth;
      c.foot.classList.add('is-jump');
    }
    c.rows = rows;
    c.list.style.height = `${rows * ROW}px`;
  };
  const show = (c: Col, query: string, hits: string[]) => {
    c.q.textContent = query;
    c.footQ.textContent = query;
    c.list.innerHTML = hits.map((p) => `<li>${esc(p)}</li>`).join('');
    c.panel.classList.toggle('is-closed', !query);
  };

  const play = player(async (wait) => {
    cols.forEach((c) => { c.rows = 0; c.jumps = 0; c.note.textContent = ''; c.foot.classList.remove('is-jump'); show(c, '', []); c.list.style.height = '0px'; });
    await wait(700);
    let query = '';
    for (const ch of 'invoice') {
      query += ch;
      const hits = PAGES.filter((p) => p.toLowerCase().includes(query)).slice(0, 6);
      for (const c of cols) {
        show(c, query, hits);
        if (c.id === 'fit') setRows(c, hits.length);
        if (c.id === 'later' && !c.rows) setRows(c, hits.length);
        if (c.id === 'grow') setRows(c, Math.max(c.rows, hits.length));
      }
      await wait(300);
    }
    cols.forEach((c) => { if (c.id !== 'later') c.note.textContent = count(c); });
    await wait(650);
    const later = cols.find((c) => c.id === 'later')!;
    setRows(later, later.list.children.length);
    later.note.textContent = `${count(later)} Right as you started reading.`;
  });
  cols.forEach((c) => show(c, '', []));
  return { play };
}

/* ---------- Race: the slow answer that lands last ------------------------------ */
const RESULTS: Record<string, string[]> = {
  typo: ['Typo checker', 'Fix typos in docs', 'Common typos'],
  typography: ['Typography', 'Typography scale', 'Font pairing'],
};

function race(el: HTMLElement): Sim {
  const stages = el.querySelector<HTMLElement>('.sim-stages')!;
  const minis = [miniSearch('before'), miniSearch('after')];
  minis.forEach((m) => stages.append(m.root));
  const AXIS = 2200;
  const lanes = h('div', 'lanes', `<p class="lanes-title">Requests on the wire</p>
    <div class="lane" data-q="typo"><span>“typo”</span><div class="lane-track"><b></b></div><em></em></div>
    <div class="lane" data-q="typography"><span>“typography”</span><div class="lane-track"><b></b></div><em></em></div>`);
  el.querySelector('.sim-extra')!.append(lanes);
  const lane = (q: string) => {
    const l = lanes.querySelector<HTMLElement>(`[data-q="${q}"]`)!;
    return { bar: l.querySelector<HTMLElement>('b')!, label: l.querySelector<HTMLElement>('em')! };
  };
  const send = (q: string, at: number, takes: number) => {
    const { bar, label } = lane(q);
    bar.style.transition = 'none';
    bar.style.left = `${(at / AXIS) * 100}%`;
    bar.style.width = '0';
    void bar.offsetWidth;
    bar.style.transition = `width ${takes}ms linear`;
    bar.style.width = `${(takes / AXIS) * 100}%`;
    label.textContent = `${takes}ms`;
  };
  const results = (m: Mini, q: string, current: string) => {
    const wrong = q !== current;
    m.rows([{ id: 'h', label: `results for “${q}”`, head: true }, ...RESULTS[q].map((r) => ({ id: r, label: r }))]);
    m.list.querySelector('.ms-head')!.classList.toggle('is-wrong', wrong);
  };

  const play = player(async (wait) => {
    lanes.querySelectorAll<HTMLElement>('.lane b').forEach((b) => { b.style.transition = 'none'; b.style.width = '0'; });
    lanes.querySelectorAll('em').forEach((e) => { e.textContent = ''; });
    minis.forEach((m) => { m.query(''); m.rows([]); m.open(false); m.toast(''); m.note(''); });
    await wait(500);
    const word = 'typography';
    for (let i = 1; i <= word.length; i++) {
      minis.forEach((m) => m.query(esc(word.slice(0, i))));
      if (i === 4) send('typo', 0, 1800);
      await wait(i === 4 ? 260 : 90);
    }
    send('typography', 800, 400);
    await wait(400);
    minis.forEach((m) => { results(m, 'typography', 'typography'); m.open(true); });
    await wait(600);
    results(minis[0], 'typo', 'typography');
    minis[0].note('The late answer wins: results for “typo”, under “typography”.');
    minis[1].toast('“typo” came back late, and was dropped', true);
    minis[1].note('Each answer carries its query. Not the current one? Dropped.');
  });
  minis.forEach((m) => m.open(false));
  return { play };
}

/* ---------- Blink: a loading signal that flashes ------------------------------- */
function blink(el: HTMLElement): Sim {
  const stages = el.querySelector<HTMLElement>('.sim-stages')!;
  const minis = [miniSearch('before', 'Untuned · dim after 150ms'), miniSearch('after', 'Tuned · 150ms, then at least 300ms')];
  const bars = minis.map((m) => {
    const bar = h('div', 'tbar', '<div class="tbar-track"><b class="tbar-dim"></b><i class="tbar-hit"></i></div><span>0</span><span>1s</span>');
    m.root.querySelector('.ms-box')!.after(bar);
    stages.append(m.root);
    return { dim: bar.querySelector<HTMLElement>('.tbar-dim')!, hit: bar.querySelector<HTMLElement>('.tbar-hit')! };
  });
  const AXIS = 1000;
  let latency = 200;
  const chips = el.querySelectorAll<HTMLButtonElement>('[data-latency]');
  chips.forEach((c) => c.addEventListener('click', () => {
    latency = Number(c.dataset.latency);
    chips.forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
    play();
  }));
  // The answer for "invoice" brings a row the old one didn't have, so its arrival shows.
  const rowsFor = (q: string) => [...PAGES.slice(0, 2), ...(q === 'invoice' ? ['Invoice reminders'] : [])].map((p) => ({ id: p, label: p }));
  const mark = (i: number, from: number | null, to: number, hit: number) => {
    const b = bars[i];
    b.dim.style.left = `${((from ?? 0) / AXIS) * 100}%`;
    b.dim.style.width = from === null ? '0' : `${((to - from) / AXIS) * 100}%`;
    b.hit.style.left = `${(Math.min(hit, AXIS) / AXIS) * 100}%`;
    b.hit.hidden = false;
  };

  const play = player(async (wait) => {
    const L = latency;
    const tunedAt = L <= 150 ? L : Math.max(L, 450);
    const notes = L <= 150
      ? ['Back in 80ms: no dim. Fine.', 'Back in 80ms: no dim. Same.']
      : L < 450
        ? [`Dimmed for ${L - 150}ms. That’s the flicker.`, `Dimmed for 300ms, results at ${tunedAt}ms. Calm.`]
        : [`Dimmed for ${L - 150}ms. A clear wait.`, `Dimmed for ${L - 150}ms. The same clear wait.`];
    for (let round = 0; round < 3; round++) {
      bars.forEach((b) => { b.dim.style.width = '0'; b.hit.hidden = true; });
      minis.forEach((m) => { m.query('invoic'); m.rows(rowsFor('invoic')); m.open(true); m.dim(false); m.note(round ? '' : 'Typing the last letter…'); });
      await wait(700);
      minis.forEach((m) => m.query('invoice'));
      // Both timelines run from the keystroke; step through their events in order.
      const events: [number, () => void][] = [];
      if (L > 150) {
        events.push([150, () => minis.forEach((m) => m.dim(true))]);
      }
      events.push([L, () => { minis[0].dim(false); minis[0].rows(rowsFor('invoice')); }]);
      events.push([tunedAt, () => { minis[1].dim(false); minis[1].rows(rowsFor('invoice')); }]);
      events.sort((a, b) => a[0] - b[0]);
      let now = 0;
      for (const [t, run] of events) { await wait(t - now); now = t; run(); }
      mark(0, L > 150 ? 150 : null, L, L);
      mark(1, L > 150 ? 150 : null, tunedAt, tunedAt);
      minis.forEach((m, i) => m.note(notes[i]));
      await wait(1100);
    }
  });
  return { play };
}

/* ---------- Highlight: Enter opens what you chose ------------------------------ */
const LOCAL = ['Design review', 'Designers team page', 'Desk booking'];
const SERVER = ['Design tokens doc', 'Design system v2', 'Desktop app notes'];

function highlight(el: HTMLElement): Sim {
  const stages = el.querySelector<HTMLElement>('.sim-stages')!;
  const minis = [miniSearch('before'), miniSearch('after')];
  minis.forEach((m) => stages.append(m.root));
  const keys = keycaps();
  el.querySelector('.sim-extra')!.append(keys.el);

  // Untuned keeps an index into one list; tuned keeps an id across sections.
  let index = -1;
  let id = '';
  let landed = false;
  const drawBefore = () => {
    const items = landed ? [...SERVER, ...LOCAL] : LOCAL;
    minis[0].rows(items.map((x, i) => ({ id: x, label: x, meta: LOCAL.includes(x) ? 'Recent' : '', on: i === index })));
    return items[index];
  };
  const drawAfter = () => {
    const rows: Row[] = [{ id: 'r', label: 'Recent', head: true }, ...LOCAL.map((x) => ({ id: x, label: x, on: x === id }))];
    if (landed) rows.push({ id: 's', label: 'From the server', head: true }, ...SERVER.map((x) => ({ id: x, label: x })));
    minis[1].rows(rows);
  };
  const draw = () => { drawBefore(); drawAfter(); };

  const play = player(async (wait) => {
    index = -1; id = ''; landed = false;
    keys.reset();
    minis.forEach((m) => { m.query('des'); m.open(true); m.toast(''); m.note(''); });
    draw();
    await wait(800);
    keys.press('↓'); index = 0; id = LOCAL[0]; draw();
    await wait(600);
    keys.press('↓'); index = 1; id = LOCAL[1]; draw();
    minis.forEach((m) => m.note('You land on “Designers team page”.'));
    await wait(1100);
    landed = true; draw();
    minis[0].note('Server results land on top. The highlight stays at row 2, on something else.');
    minis[1].note('Server results land below, in their own section. Your row stays yours.');
    await wait(1500);
    keys.press('⏎');
    minis[0].toast(`Opened “${drawBefore()}”`, false);
    minis[1].toast(`Opened “${id}”`, true);
  });
  minis.forEach((m) => { m.query('des'); m.open(true); });
  draw();
  return { play };
}

/* ---------- Emphasis: bold matches move the row -------------------------------- */
const TITLES = ['Typography scale', 'Type ramps', 'Typefaces we use'];

function emphasis(el: HTMLElement): Sim {
  const stages = el.querySelector<HTMLElement>('.sim-stages')!;
  const minis = [miniSearch('before', 'Bold match'), miniSearch('after', 'Coloured match')];
  minis.forEach((m) => { stages.append(m.root); m.open(true); m.panel.classList.add(m === minis[0] ? 'em-bold' : 'em-colour'); });
  const draw = (q: string) => {
    minis.forEach((m) => {
      m.query(esc(q));
      m.list.innerHTML = TITLES.map((t) => {
        const at = q ? t.toLowerCase().indexOf(q) : -1;
        const title = at < 0 ? esc(t) : `${esc(t.slice(0, at))}<mark>${esc(t.slice(at, at + q.length))}</mark>${esc(t.slice(at + q.length))}`;
        return `<li class="ms-row"><span>${title}<small> · Docs</small></span></li>`;
      }).join('');
    });
  };
  // Where each row's "· Docs" sits; the biggest move from the empty query is the shift.
  const metaX = (m: Mini) => [...m.list.querySelectorAll('small')].map((s) => s.getBoundingClientRect().left);
  // A dashed line where the first row's "· Docs" starts, so the drift is visible.
  const guides = minis.map((m) => { const g = h('i', 'em-guide'); m.panel.append(g); return g; });

  const play = player(async (wait) => {
    draw('');
    const base = minis.map(metaX);
    minis.forEach((m, i) => { guides[i].style.left = `${base[i][0] - m.panel.getBoundingClientRect().left}px`; });
    const moved = [0, 0];
    minis.forEach((m) => m.note(''));
    await wait(600);
    let q = '';
    for (const ch of 'typography') {
      q += ch;
      draw(q);
      minis.forEach((m, i) => metaX(m).forEach((x, r) => { moved[i] = Math.max(moved[i], Math.abs(x - base[i][r])); }));
      await wait(260);
    }
    minis[0].note(`Every key nudged the row: “· Docs” moved up to ${moved[0].toFixed(1)}px.`);
    minis[1].note(moved[1] < 0.5 ? 'Colour costs no width. Nothing moved.' : `Moved ${moved[1].toFixed(1)}px.`);
  });
  draw('');
  return { play };
}

/* ---------- Escape: close first, keep the text ---------------------------------------- */
function escape(el: HTMLElement): Sim {
  const stages = el.querySelector<HTMLElement>('.sim-stages')!;
  const minis = [miniSearch('before'), miniSearch('after')];
  minis.forEach((m) => stages.append(m.root));
  const keys = keycaps();
  el.querySelector('.sim-extra')!.append(keys.el);
  const rows = PAGES.slice(0, 3).map((p, i) => ({ id: p, label: p, on: i === 0 }));

  const play = player(async (wait) => {
    keys.reset();
    minis.forEach((m) => { m.query('invo'); m.rows(rows); m.open(true); m.note('Typed “invo”.'); });
    await wait(900);
    keys.press('Esc');
    minis[0].query(''); minis[0].open(false);
    minis[0].note('Closed, and your text went with it.');
    minis[1].open(false);
    minis[1].note('Closed. Your text stays; a second Escape would clear it.');
  });
  minis.forEach((m) => { m.query('invo'); m.rows(rows); m.open(true); });
  return { play };
}

/* ---------- IME: Enter belongs to the keyboard while composing ----------------- */
function ime(el: HTMLElement): Sim {
  const stages = el.querySelector<HTMLElement>('.sim-stages')!;
  const minis = [miniSearch('before'), miniSearch('after')];
  minis.forEach((m) => stages.append(m.root));
  const keys = keycaps();
  el.querySelector('.sim-extra')!.append(keys.el);
  const composing = '<span class="ime-comp" lang="ja">とうきょう<span class="ime-cand">東京</span></span>';
  const rows = [{ id: 'a', label: 'Tokyo office' }, { id: 'b', label: 'Tokyo team' }];

  const play = player(async (wait) => {
    keys.reset();
    minis.forEach((m) => { m.query(composing); m.rows(rows.map((r, i) => ({ ...r, on: i === 0 }))); m.open(true); m.toast(''); m.note('Typing in Japanese. The keyboard offers 東京.'); });
    await wait(1300);
    keys.press('⏎');
    minis.forEach((m) => m.query('<span lang="ja">東京</span>'));
    minis[0].toast('Opened “Tokyo office”', false);
    minis[0].note('The search took the keyboard’s Enter as its own.');
    minis[1].rows([{ id: 'c', label: '東京 office' }, { id: 'd', label: '東京 team' }]);
    minis[1].note('Enter confirmed the characters. Nothing opened.');
  });
  minis.forEach((m) => { m.query(composing); m.rows(rows); m.open(true); });
  return { play };
}

const sims: Record<string, (el: HTMLElement) => Sim> = { height, race, blink, highlight, emphasis, escape, ime };

/* ---------- Wiring: sims, play buttons, and the questions ---------------------- */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const built = new Map<HTMLElement, Sim>();

document.querySelectorAll<HTMLElement>('[data-sim]').forEach((el) => {
  const make = sims[el.dataset.sim!];
  if (!make) return;
  el.querySelector('.sim-fallback')?.remove();
  el.classList.add('is-live');
  const sim = make(el);
  built.set(el, sim);
  el.querySelector<HTMLButtonElement>('[data-play]')?.addEventListener('click', sim.play);
});

document.querySelectorAll<HTMLElement>('[data-call]').forEach((call) => {
  const reveal = call.querySelector<HTMLElement>('[data-reveal]')!;
  const verdict = call.querySelector<HTMLElement>('[data-verdict]');
  const opts = call.querySelectorAll<HTMLButtonElement>('[data-opt]');
  reveal.hidden = true;
  opts.forEach((b) => b.addEventListener('click', () => {
    if (call.dataset.answered) return;
    call.dataset.answered = 'true';
    const right = b.hasAttribute('data-right');
    opts.forEach((o) => {
      o.setAttribute('aria-disabled', 'true');
      if (o.hasAttribute('data-right')) o.classList.add('is-right');
    });
    b.classList.add('is-picked');
    if (verdict) verdict.textContent = b.hasAttribute('data-skip') ? '' : right ? 'Yes.' : 'Not quite.';
    reveal.hidden = false;
    reveal.querySelectorAll<HTMLElement>('[data-sim]').forEach((s) => built.get(s)?.play());
  }));
});

// The switcher recordings play while in view and pause on a click. Under reduced
// motion they wait, with controls.
document.querySelectorAll<HTMLVideoElement>('[data-inview-video]').forEach((v) => {
  if (reduce) { v.controls = true; return; }
  v.addEventListener('click', () => (v.paused ? v.play().catch(() => {}) : v.pause()));
  new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.6 }).observe(v);
});
