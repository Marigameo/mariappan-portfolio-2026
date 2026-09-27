/* Progressive enhancement only: theme toggle, hero text rotator, portrait deck,
   click-to-load videos, footer year. The site reads fine without it. */
(function () {
  var root = document.documentElement;
  var KEY = "theme";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- Theme toggle -------------------------------------------------------
  function systemTheme() { return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; }
  function current() { return root.getAttribute("data-theme") || systemTheme(); }
  function labelToggles(theme) {
    document.querySelectorAll(".theme-toggle").forEach(function (b) {
      b.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
      b.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    });
  }
  function apply(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0a0a0f" : "#fff9f1");
    labelToggles(theme);
  }
  document.querySelectorAll(".theme-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () { apply(current() === "dark" ? "light" : "dark"); });
  });
  labelToggles(current());

  // --- Hero role rotator ------------------------------------------------------
  // <span class="rotator"><span class="is-on">…</span><span>…</span></span>
  var rotator = document.querySelector(".rotator");
  if (rotator && !reduceMotion) {
    var items = Array.prototype.slice.call(rotator.children);
    if (items.length > 1) {
      var idx = 0;
      items.forEach(function (el, i) { el.setAttribute("aria-hidden", i === 0 ? "false" : "true"); });
      setInterval(function () {
        var out = items[idx];
        idx = (idx + 1) % items.length;
        var next = items[idx];
        out.classList.remove("is-on"); out.classList.add("is-out"); out.setAttribute("aria-hidden", "true");
        next.classList.remove("is-out"); next.classList.add("is-on"); next.setAttribute("aria-hidden", "false");
        setTimeout(function () { out.classList.remove("is-out"); }, 600);
      }, 2800);
    }
  }

  // --- Portrait deck: click the front card to send it to the back ------------
  var deck = document.getElementById("deck");
  if (deck) {
    var cards = Array.prototype.slice.call(deck.querySelectorAll(".deck-card"));
    var label = deck.querySelector("[data-deck-label]");
    var note = deck.querySelector("[data-deck-note]");
    var busy = false;
    function paint() { cards.forEach(function (c, i) { c.className = "deck-card pos-" + i + (i === 0 ? " taped" : ""); }); }
    function layout() {
      paint();
      var front = cards[0];
      if (label) label.classList.add("is-swapping");
      if (note) note.classList.add("is-swapping");
      setTimeout(function () {
        if (label) { label.textContent = front.getAttribute("data-label"); label.classList.remove("is-swapping"); }
        if (note) { note.textContent = front.getAttribute("data-note"); note.classList.remove("is-swapping"); }
      }, 220);
    }
    function shuffle() {
      if (busy) return;
      busy = true;
      deck.classList.add("is-used");
      cards[0].classList.add("is-flying");
      setTimeout(function () {
        cards.push(cards.shift());
        layout();
        setTimeout(function () { busy = false; }, 400);
      }, 300);
    }
    paint();
    deck.querySelector(".deck-stack").addEventListener("click", function (e) {
      if (e.target.closest(".deck-card")) shuffle();
    });
  }

  // --- Click-to-load YouTube --------------------------------------------------
  document.querySelectorAll(".video-btn[data-video]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-video");
      var wrap = btn.parentNode;
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      iframe.title = btn.getAttribute("aria-label") || "Talk video";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.setAttribute("allowfullscreen", "");
      wrap.innerHTML = "";
      wrap.appendChild(iframe);
    });
  });

  // --- Pause ambient animations while off-screen -------------------------------
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.style.animationPlayState = en.isIntersecting ? "" : "paused"; en.target.querySelectorAll("img, .marquee-track").forEach(function (x) { x.style.animationPlayState = en.isIntersecting ? "" : "paused"; }); });
    });
    document.querySelectorAll(".footer-land, .marquee").forEach(function (el) { io.observe(el); });
  }

  // --- Work rails: sideways card scrollers with arrows + a progress line ---------
  // <div data-rail> [data-prev] [data-next] [data-thumb] <ul data-track>…</ul> </div>
  document.querySelectorAll("[data-rail]").forEach(function (rail) {
    var track = rail.querySelector("[data-track]");
    if (!track) return;
    var prev = rail.querySelector("[data-prev]");
    var next = rail.querySelector("[data-next]");
    var thumb = rail.querySelector("[data-thumb]");
    function step() {
      var card = track.firstElementChild;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
    }
    function update() {
      var max = track.scrollWidth - track.clientWidth;
      rail.classList.toggle("rail--static", max < 4);
      if (thumb) {
        thumb.style.width = (track.clientWidth / track.scrollWidth * 100) + "%";
        thumb.style.left = (track.scrollLeft / track.scrollWidth * 100) + "%";
      }
      if (prev) prev.disabled = track.scrollLeft < 2;
      if (next) next.disabled = track.scrollLeft > max - 2;
    }
    function go(dir) { track.scrollBy({ left: dir * step(), behavior: reduceMotion ? "auto" : "smooth" }); }
    if (prev) prev.addEventListener("click", function () { go(-1); });
    if (next) next.addEventListener("click", function () { go(1); });

    // Several companies in one rail: the header shows the company of the card in view.
    // The "in view" point slides from the rail's left edge to its right edge as it
    // scrolls, so the first card wins at the start and the last card at the end, even
    // when two cards fit on screen at once.
    var chapters = track.querySelectorAll("[data-company]");
    var nameEl = rail.querySelector("[data-rail-name]");
    var metaEl = rail.querySelector("[data-rail-meta]");
    var liveEl = rail.querySelector("[data-rail-live]");
    var badge = rail.querySelector("[data-rail-badge]");
    var company = nameEl ? nameEl.textContent : "";
    var swapId = 0;
    function show(card) {
      nameEl.textContent = card.dataset.company;
      metaEl.textContent = card.dataset.meta || "";
      if (liveEl) liveEl.hidden = card.dataset.live !== "true";
    }
    function swap(card) {
      company = card.dataset.company;
      if (reduceMotion || !nameEl.animate) { show(card); return; }
      var id = ++swapId;
      var els = [nameEl, metaEl];
      var gone = { opacity: 0, transform: "translateY(-.5em)", filter: "blur(3px)" };
      var here = { opacity: 1, transform: "none", filter: "blur(0)" };
      var outs = els.map(function (el, i) {
        el.getAnimations().forEach(function (a) { a.cancel(); });
        return el.animate([here, gone], { duration: 170, delay: i * 40, easing: "ease-in", fill: "forwards" }).finished;
      });
      Promise.all(outs).then(function () {
        if (id !== swapId) return; // a newer swap took over mid-fade
        show(card);
        els.forEach(function (el, i) {
          el.getAnimations().forEach(function (a) { a.cancel(); });
          el.animate([{ opacity: 0, transform: "translateY(.5em)", filter: "blur(3px)" }, here], { duration: 320, delay: i * 60, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" });
        });
        if (badge) badge.animate([{ transform: "rotate(-4deg)" }, { transform: "rotate(10deg) scale(1.06)" }, { transform: "rotate(-4deg)" }], { duration: 450, easing: "ease-in-out" });
      }).catch(function () {});
    }
    function chapter() {
      var max = track.scrollWidth - track.clientWidth;
      var box = track.getBoundingClientRect();
      var pad = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
      var x = box.left + pad + (max > 0 ? track.scrollLeft / max : 0) * (box.width - 2 * pad);
      var pick = chapters[0], best = Infinity;
      chapters.forEach(function (c) {
        var r = c.getBoundingClientRect();
        var d = x < r.left ? r.left - x : x > r.right ? x - r.right : 0;
        if (d < best) { best = d; pick = c; }
      });
      if (pick.dataset.company !== company) swap(pick);
    }
    if (chapters.length && nameEl && metaEl) {
      track.addEventListener("scroll", chapter, { passive: true });
      window.addEventListener("resize", chapter);
    }

    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });

  // --- Developing polaroids: reveal each photo once it has loaded -----------------
  // <button class="polaroid is-developing" data-develop> … <img> … </button>
  document.querySelectorAll("[data-develop]").forEach(function (p) {
    var img = p.querySelector("img");
    function done() { p.classList.remove("is-developing"); }
    if (!img || (img.complete && img.naturalWidth)) { done(); return; }
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
  });

  // --- Photo carousels: one photo per view, arrows + a counter ---------------------
  // <div data-carousel> <div data-carousel-track>slides…</div> [data-carousel-prev] [data-carousel-next] [data-carousel-count] </div>
  document.querySelectorAll("[data-carousel]").forEach(function (c) {
    var track = c.querySelector("[data-carousel-track]");
    if (!track) return;
    var prev = c.querySelector("[data-carousel-prev]");
    var next = c.querySelector("[data-carousel-next]");
    var count = c.querySelector("[data-carousel-count]");
    var n = track.children.length;
    function at() { return Math.round(track.scrollLeft / (track.clientWidth || 1)); }
    function update() {
      var i = at();
      if (count) count.textContent = String(i + 1);
      if (prev) prev.disabled = i <= 0;
      if (next) next.disabled = i >= n - 1;
    }
    function go(d) { track.scrollTo({ left: (at() + d) * track.clientWidth, behavior: reduceMotion ? "auto" : "smooth" }); }
    if (prev) prev.addEventListener("click", function () { go(-1); });
    if (next) next.addEventListener("click", function () { go(1); });
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });

  // --- Photo lightbox: any [data-full] opens its image in the page's <dialog data-lightbox> ---
  var lightbox = document.querySelector("[data-lightbox]");
  if (lightbox && typeof lightbox.showModal === "function") {
    var lbImg = lightbox.querySelector("[data-lightbox-img]");
    var lbCap = lightbox.querySelector("[data-lightbox-caption]");
    document.querySelectorAll("[data-full]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var thumb = btn.querySelector("img");
        lbImg.src = btn.getAttribute("data-full");
        // whiteboard scans flip in dark mode; screenshots keep their colours
        lightbox.classList.toggle("lightbox--ink", btn.classList.contains("ink-shot"));
        lbImg.alt = thumb ? thumb.alt : "";
        if (lbCap) lbCap.textContent = thumb ? thumb.alt : "";
        lightbox.showModal();
      });
    });
    lightbox.querySelectorAll("[data-lightbox-close]").forEach(function (b) { b.addEventListener("click", function () { lightbox.close(); }); });
    // backdrop click: the dialog itself is the target only when clicking outside its content
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) lightbox.close(); });
    lightbox.addEventListener("keydown", function (e) { if (e.key === "Escape") { e.preventDefault(); lightbox.close(); } });
    lightbox.addEventListener("close", function () { lbImg.removeAttribute("src"); });
  }

  // --- Footer pin: toggles the sticky note about the landscape, with birdsong while open ---
  var pinBtn = document.querySelector("[data-pin]");
  if (pinBtn) {
    var pinNote = document.getElementById(pinBtn.getAttribute("aria-controls"));
    var pinAudio = document.querySelector("[data-pin-audio]");
    pinBtn.addEventListener("click", function () {
      var open = pinBtn.getAttribute("aria-expanded") !== "true";
      pinBtn.setAttribute("aria-expanded", open ? "true" : "false");
      if (pinNote) pinNote.hidden = !open;
      pinBtn.closest(".pin").classList.toggle("is-open", open);
      if (!pinAudio) return;
      if (open) {
        pinAudio.volume = 0.55;
        var p = pinAudio.play();
        if (p && p.catch) p.catch(function () {});
      } else {
        pinAudio.pause();
        pinAudio.currentTime = 0;
      }
    });
  }

  // --- Sideways-scrollable tables: show the nudge only when there is somewhere to go ---
  // CSS draws the edge shadows on its own, but whether a table actually overflows
  // depends on the text and the viewport, so the written hint needs measuring.
  var scrollers = document.querySelectorAll("[data-scrollable]");
  if (scrollers.length) {
    var syncScroller = function (box) {
      // 1px of slack: sub-pixel layout can leave scrollWidth a hair over clientWidth.
      var overflows = box.scrollWidth - box.clientWidth > 1;
      box.classList.toggle("can-scroll", overflows);
      box.classList.toggle("at-end", overflows && box.scrollLeft >= box.scrollWidth - box.clientWidth - 1);
    };
    scrollers.forEach(function (box) {
      syncScroller(box);
      box.addEventListener("scroll", function () { syncScroller(box); }, { passive: true });
    });
    var resyncAll = function () { scrollers.forEach(syncScroller); };
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(resyncAll);
      scrollers.forEach(function (box) { ro.observe(box); });
    } else {
      window.addEventListener("resize", resyncAll);
    }
    // Web fonts land after first paint and change how wide the cells are.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(resyncAll);
  }

  // --- Footer year ---------------------------------------------------------------
  document.querySelectorAll("[data-year]").forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();
