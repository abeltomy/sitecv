// nav.js
// 1. Inject the navbar where <div id="navbar"></div> appears
fetch("/nav.html")
  .then(r => r.text())
  .then(html => {
    document.getElementById("navbar").innerHTML = html;
    attachNightMode();        // wire up the toggle *after* it exists
  });

// 2. Night-mode helpers (same code you had inline)
function attachNightMode(){
  const btn = document.getElementById("night-toggle");
  if(!btn) return;                      // safety check
  if(localStorage.getItem("nightMode")==="on"){
    document.body.classList.add("night");
    btn.textContent="☀️";
  }
  btn.onclick = () => {
    document.body.classList.toggle("night");
    const isNight = document.body.classList.contains("night");
    btn.textContent = isNight ? "☀️" : "🌙";
    localStorage.setItem("nightMode", isNight ? "on" : "off");
  };
}
