async function loadNavbar() {
  const mount = document.getElementById("site-nav");
  if (!mount) {
    return;
  }

  mount.innerHTML = `
    <nav style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <a href="/">home</a> |
        <a href="/blog.html">blog</a> |
        <a href="/projects.html">projects</a>
      </div>
      <button id="night-toggle" style="background:none;border:none;cursor:pointer;font-size:1.2em;" title="Toggle night mode">🌙</button>
    </nav>
  `;

  if (window.location.protocol === "file:") {
    const links = mount.querySelectorAll("a[href^='/']");
    links.forEach(function (link) {
      link.setAttribute("href", link.getAttribute("href").replace(/^\//, ""));
    });
  }

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
