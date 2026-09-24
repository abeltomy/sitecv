function loadNavbar() {
  const mount = document.getElementById("site-nav");
  if (!mount) {
    return;
  }

  const scriptUrl = document.currentScript
    ? new URL(document.currentScript.src, window.location.href)
    : new URL("components/navbar.js", window.location.href);
  const siteRoot = new URL("../", scriptUrl);
  const links = [
    { href: new URL("index.html", siteRoot).href, label: "home" },
    { href: new URL("blog.html", siteRoot).href, label: "blog" },
    { href: new URL("cv.html", siteRoot).href, label: "cv" },
    { href: new URL("projects/projects.html", siteRoot).href, label: "projects" },
  ];
  const normalize = (p) => (p.replace(/\/+$/, "").replace(/\.html$/, "").replace(/\/index$/, "") || "/index");
  const here = normalize(window.location.pathname);
  const linksHtml = links.map((l) => {
    const linkPath = l.external ? null : normalize(new URL(l.href).pathname);
    const isActive = linkPath !== null && linkPath === here;
    const extraAttrs = l.external ? ` target="_blank" rel="noopener noreferrer"` : "";
    return `<a class="nav-link${isActive ? " active" : ""}" href="${l.href}"${extraAttrs}>${l.label}</a>`;
  }).join("");

  mount.innerHTML = `
    <nav class="site-nav-bar">
      <div class="nav-links">${linksHtml}</div>
      <button id="mode-toggle" class="mode-toggle" type="button" title="Cycle day / sunset / night">
        <svg class="mode-icon icon-sun" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="12" cy="12" r="5" fill="currentColor"/>
          <g stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
            <line x1="12" y1="1.5" x2="12" y2="4.5"/>
            <line x1="12" y1="19.5" x2="12" y2="22.5"/>
            <line x1="1.5" y1="12" x2="4.5" y2="12"/>
            <line x1="19.5" y1="12" x2="22.5" y2="12"/>
            <line x1="4.4" y1="4.4" x2="6.5" y2="6.5"/>
            <line x1="17.5" y1="17.5" x2="19.6" y2="19.6"/>
            <line x1="4.4" y1="19.6" x2="6.5" y2="17.5"/>
            <line x1="17.5" y1="6.5" x2="19.6" y2="4.4"/>
          </g>
        </svg>
        <svg class="mode-icon icon-sunset" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <line x1="2" y1="18" x2="22" y2="18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          <path d="M6 15a6 6 0 0 1 12 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          <line x1="12" y1="3" x2="12" y2="7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          <line x1="4.6" y1="8.6" x2="7" y2="10.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          <line x1="19.4" y1="8.6" x2="17" y2="10.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
        <svg class="mode-icon icon-moon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" fill="currentColor"/>
        </svg>
      </button>
    </nav>
  `;

  initThemeToggle();
  injectSky();
}

/* ---------- theme: day / sunset / night ----------
   State lives on <html data-mode>, driving CSS variables in style.css.
   Mirrors to body.night + the old "nightMode" key so pages not yet
   migrated to the sky theme keep working exactly as before. */
const MODES = ["day", "sunset", "night"];

function currentMode() {
  return document.documentElement.dataset.mode || "day";
}

function applyMode(mode, persist) {
  if (mode === "day") {
    delete document.documentElement.dataset.mode;
  } else {
    document.documentElement.dataset.mode = mode;
  }
  if (!document.body.classList.contains("sky-theme")) {
    document.body.classList.toggle("night", mode === "night");
  }
  if (persist) {
    try {
      localStorage.setItem("sky-mode", mode);
      localStorage.setItem("nightMode", mode === "night" ? "on" : "off");
    } catch (e) {}
  }
}

function initThemeToggle() {
  let saved = null;
  try {
    saved = localStorage.getItem("sky-mode");
    if (!saved) saved = localStorage.getItem("nightMode") === "on" ? "night" : null;
  } catch (e) {}
  if (saved && MODES.includes(saved)) applyMode(saved, false);

  const btn = document.getElementById("mode-toggle");
  if (!btn) return;
  btn.addEventListener("click", function () {
    const next = MODES[(MODES.indexOf(currentMode()) + 1) % MODES.length];
    applyMode(next, true);
  });
}

/* ---------- illustrated sky background ----------
   Only rendered on pages opting in with body.sky-theme, so pages not
   yet redesigned are untouched. Absolutely positioned behind the .hero
   block and sized to match it (falls back to 100vh without one). */
function sizeSkyToHero(sky) {
  const hero = document.querySelector(".hero");
  if (!hero) {
    sky.style.height = "100vh";
    return;
  }
  const sync = () => { sky.style.height = hero.offsetHeight + "px"; };
  sync();
  if (window.ResizeObserver) new ResizeObserver(sync).observe(hero);
  window.addEventListener("resize", sync);
  const img = hero.querySelector("img");
  if (img && !img.complete) img.addEventListener("load", sync, { once: true });
}

function injectSky() {
  if (!document.body.classList.contains("sky-theme")) return;
  if (document.getElementById("site-sky")) return;

  /* Fixed to the viewport, not the document — always exactly fills the
     screen no matter how tall the page is or how the window resizes, so
     there is no document-length boundary where the color could seam. */
  const backdrop = document.createElement("div");
  backdrop.id = "site-sky-backdrop";
  backdrop.setAttribute("aria-hidden", "true");
  backdrop.innerHTML = `
    <div class="sky-gradient"></div>
    <div class="sky-clouds"></div>
    <div class="sky-stars"></div>
    <div class="sky-aurora"></div>
    <div class="sky-plane">
      <div class="sky-plane-fly">
        <svg class="plane-icon" viewBox="0 0 24 10" width="26" height="11" aria-hidden="true">
          <path d="M22.5 5C22.5 4.3 21.6 4.2 20.5 4.2L16.5 4.2L10.6.4L9.2.4L12.4 4.2L5.4 4.2L3.2 1.8L2.2 1.8L3.4 4.3C2.2 4.5 2.2 5.5 3.4 5.7L2.2 8.2L3.2 8.2L5.4 5.8L12.4 5.8L9.2 9.6L10.6 9.6L16.5 5.8L20.5 5.8C21.6 5.8 22.5 5.7 22.5 5Z" fill="currentColor"/>
        </svg>
        <span class="sky-trail t1"></span>
        <span class="sky-trail t2"></span>
      </div>
    </div>
    <div class="sky-meteors">
      <span class="meteor" style="top:12%;left:58%;--mdur:5s;--mdelay:-2s;--mangle:26deg"></span>
      <span class="meteor" style="top:28%;left:76%;--mdur:6.5s;--mdelay:-5s;--mangle:32deg"></span>
      <span class="meteor" style="top:8%;left:34%;--mdur:8s;--mdelay:-3.5s;--mangle:20deg"></span>
      <span class="meteor" style="top:20%;left:70%;--mdur:11s;--mdelay:-1s;--mangle:28deg"></span>
    </div>
  `;
  document.body.insertBefore(backdrop, document.body.firstChild);

  /* Sized to the hero only, so the concrete scene (sun, moon, birds)
     lands at the end of the intro instead of drifting over later text. */
  const sky = document.createElement("div");
  sky.id = "site-sky";
  sky.setAttribute("aria-hidden", "true");
  sky.innerHTML = `
    <svg class="sky-birds" viewBox="0 0 100 40" aria-hidden="true">
      <path class="bird" d="M14 20q6-11 12 0q6-11 12 0"/>
      <path class="bird" d="M46 26q5-9 10 0q5-9 10 0"/>
      <path class="bird" d="M68 12q5-9 10 0q5-9 10 0"/>
    </svg>
    <div class="sky-moon"></div>
    <div class="sky-sun"></div>
  `;
  document.body.insertBefore(sky, backdrop.nextSibling);
  sizeSkyToHero(sky);
}

loadNavbar();
