// Immediately load nav.html into every page
(function loadNavAndInit() {
  const placeholder = document.getElementById('nav-placeholder');
  if (!placeholder) return;

  fetch('/path/to/nav.html')
    .then(r => r.text())
    .then(html => {
      placeholder.innerHTML = html;
      initDarkModeToggle();
    })
    .catch(console.error);

  function initDarkModeToggle() {
    const btn = document.getElementById('night-toggle');
    if (!btn) return;

    // Apply saved mode on load
    const isNight = localStorage.getItem('night-mode') === 'enabled';
    document.body.classList.toggle('night-mode', isNight);
    btn.textContent = isNight ? '☀️' : '🌙';

    // Toggle on click
    btn.addEventListener('click', () => {
      const nowNight = !document.body.classList.toggle('night-mode');
      // If we’re in night, add class; else remove.
      document.body.classList.toggle('night-mode', !nowNight);
      // Persist
      localStorage.setItem('night-mode', !nowNight ? 'enabled' : 'disabled');
      // Swap icon
      btn.textContent = !nowNight ? '☀️' : '🌙';
    });
  }
})();
