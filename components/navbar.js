function loadNavbar() {
  const mount = document.getElementById("site-nav");
  if (!mount) {
    return;
  }

  const scriptUrl = document.currentScript
    ? new URL(document.currentScript.src, window.location.href)
    : new URL("components/navbar.js", window.location.href);
  const siteRoot = new URL("../", scriptUrl);
  const homeHref = new URL("index.html", siteRoot).href;
  const blogHref = new URL("blog.html", siteRoot).href;
  const cvHref = new URL("cv.html", siteRoot).href;
  const projectsHref = new URL("projects.html", siteRoot).href;

  mount.innerHTML = `
    <nav style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <a href="${homeHref}">home</a> |
        <a href="${blogHref}">blog</a> |
        <a href="${cvHref}">cv</a> |
        <a href="${projectsHref}">projects</a>
      </div>
      <button id="night-toggle" style="background:none;border:none;cursor:pointer;font-size:1.2em;" title="Toggle night mode">🌙</button>
    </nav>
  `;

  const btn = document.getElementById("night-toggle");
  if (!btn) {
    return;
  }

  if (localStorage.getItem("nightMode") === "on") {
    document.body.classList.add("night");
    btn.textContent = "☀️";
  }

  btn.addEventListener("click", function () {
    document.body.classList.toggle("night");
    const isNight = document.body.classList.contains("night");
    btn.textContent = isNight ? "☀️" : "🌙";
    localStorage.setItem("nightMode", isNight ? "on" : "off");
  });
}

loadNavbar();
