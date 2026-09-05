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

  // --- Footer year ---------------------------------------------------------------
  document.querySelectorAll("[data-year]").forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();
