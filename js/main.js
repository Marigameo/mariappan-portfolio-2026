/* Tiny progressive-enhancement script: theme toggle + click-to-load videos.
   Everything on the site works without it (theme falls back to system). */
(function () {
  var root = document.documentElement;
  var KEY = "theme";

  // --- Theme toggle -------------------------------------------------------
  function systemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function current() {
    return root.getAttribute("data-theme") || systemTheme();
  }
  function apply(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#171a21" : "#fbf7ef");
    document.querySelectorAll(".theme-toggle").forEach(function (b) {
      b.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
      b.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    });
  }
  document.querySelectorAll(".theme-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      apply(current() === "dark" ? "light" : "dark");
    });
  });
  // Label the button correctly on load without forcing a stored theme.
  document.querySelectorAll(".theme-toggle").forEach(function (b) {
    b.setAttribute("aria-label", current() === "dark" ? "Switch to light theme" : "Switch to dark theme");
  });

  // --- Click-to-load YouTube (no iframes until asked) ---------------------
  document.querySelectorAll(".video-btn[data-video]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-video");
      var wrap = btn.parentNode;
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      iframe.title = btn.getAttribute("aria-label") || "Talk video";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.setAttribute("allowfullscreen", "");
      iframe.loading = "lazy";
      wrap.innerHTML = "";
      wrap.appendChild(iframe);
    });
  });

  // --- Footer year ---------------------------------------------------------
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
