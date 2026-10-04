// Contrast / inverted mode buttons, after thebestmotherfucking.website.
// Loaded in <head> so the saved mode applies before first paint.
(function () {
  var root = document.documentElement;
  var modes = [
    { key: "contrast", id: "contrast-btn", labels: ["Add more contrast", "Remove additional contrast"] },
    { key: "inverted", id: "invert-btn", labels: ["Inverted mode", "Normal mode"] },
  ];

  function load(key) {
    try { return localStorage.getItem(key) === "true"; } catch (e) { return false; }
  }
  function save(key, on) {
    try { localStorage.setItem(key, on); } catch (e) {}
  }

  modes.forEach(function (m) { root.classList.toggle(m.key, load(m.key)); });

  document.addEventListener("DOMContentLoaded", function () {
    var box = document.createElement("div");
    box.className = "mode-toggles";
    modes.forEach(function (m) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.id = m.id;
      function render() {
        var on = root.classList.contains(m.key);
        btn.textContent = m.labels[on ? 1 : 0];
        btn.setAttribute("aria-pressed", on);
      }
      btn.addEventListener("click", function () {
        var on = root.classList.toggle(m.key);
        save(m.key, on);
        render();
      });
      render();
      box.appendChild(btn);
    });
    document.body.appendChild(box);
  });
})();
