/* UX story behaviour (src/components/ux/): the lightbox, before/after toggles,
   and recordings that play only while in view. Everything degrades: without
   this script, images stay plain, both sides of a comparison show stacked, and
   recordings keep their controls. */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function initLightbox() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-ux-lightbox]');
  if (!dialog) return;
  const img = dialog.querySelector('img')!;
  const video = dialog.querySelector('video')!;
  const cap = dialog.querySelector<HTMLElement>('[data-ux-lightbox-cap]')!;

  document.addEventListener('click', (e) => {
    const btn = (e.target as Element).closest<HTMLButtonElement>('[data-ux-zoom]');
    if (!btn) return;
    const { kind = 'image', src = '', poster = '', alt = '', w = '', h = '', caption = '' } = btn.dataset;
    const isVideo = kind === 'video';
    img.hidden = isVideo;
    video.hidden = !isVideo;
    if (isVideo) {
      video.src = src;
      video.poster = poster;
      video.width = Number(w);
      video.height = Number(h);
      video.setAttribute('aria-label', alt);
      dialog.setAttribute('aria-label', 'Enlarged recording');
      if (!reduceMotion.matches) video.play().catch(() => {});
    } else {
      img.src = src;
      img.alt = alt;
      img.width = Number(w);
      img.height = Number(h);
      dialog.setAttribute('aria-label', 'Enlarged screenshot');
    }
    cap.textContent = caption;
    cap.hidden = !caption;
    dialog.showModal();
  });

  // Stop and unload a recording when the lightbox closes (Escape included).
  dialog.addEventListener('close', () => {
    video.pause();
    video.removeAttribute('src');
    video.load();
  });
  // A click on the backdrop (the dialog itself, outside the media) closes it.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.querySelector('[data-ux-lightbox-close]')?.addEventListener('click', () => dialog.close());
}

function initCompares() {
  document.querySelectorAll<HTMLElement>('[data-ux-compare]').forEach((c) => {
    const buttons = c.querySelectorAll<HTMLButtonElement>('[data-ux-side]');
    const layers = c.querySelectorAll<HTMLElement>('[data-ux-layer]');
    const set = (side: string) => {
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.uxSide === side)));
      layers.forEach((l) => {
        const on = l.dataset.uxLayer === side;
        l.classList.toggle('is-on', on);
        if (on) l.removeAttribute('aria-hidden');
        else l.setAttribute('aria-hidden', 'true');
        l.querySelectorAll('button').forEach((b) => (b.tabIndex = on ? 0 : -1));
      });
    };
    buttons.forEach((b) => b.addEventListener('click', () => set(b.dataset.uxSide!)));
    set(c.dataset.start || 'before');
    c.classList.add('is-ready');
  });
}

function initAutoplay() {
  const videos = document.querySelectorAll<HTMLVideoElement>('video[data-ux-autoplay]');
  if (!videos.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      const v = target as HTMLVideoElement;
      // Someone who paused it, or asked for less motion, keeps it still.
      if (reduceMotion.matches || v.dataset.userPaused) continue;
      if (isIntersecting) v.play().catch(() => {});
      else if (!v.paused) {
        v.dataset.autoPause = '1';
        v.pause();
      }
    }
  }, { threshold: 0.4 });
  videos.forEach((v) => {
    // A pause we didn't make came from the viewer's controls: respect it.
    v.addEventListener('pause', () => {
      if (v.dataset.autoPause) delete v.dataset.autoPause;
      else v.dataset.userPaused = '1';
    });
    v.addEventListener('play', () => delete v.dataset.userPaused);
    io.observe(v);
  });
}

// Browsers fetch a video's poster with the page, so below the fold the
// poster waits in data-poster until the video is near the viewport.
function initPosters() {
  const videos = document.querySelectorAll<HTMLVideoElement>('video[data-poster]');
  const set = (v: HTMLVideoElement) => { v.poster = v.dataset.poster!; v.removeAttribute('data-poster'); };
  if (!('IntersectionObserver' in window)) return videos.forEach(set);
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { set(e.target as HTMLVideoElement); io.unobserve(e.target); }
  }, { rootMargin: '800px 0px' });
  videos.forEach((v) => io.observe(v));
}

initPosters();
initLightbox();
initCompares();
initAutoplay();
