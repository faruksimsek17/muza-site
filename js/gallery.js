(function () {
  var grid = document.querySelector(".gallery-grid");
  if (!grid || !window.GrosperStore) return;

  function publicSrc(src) {
    if (!src) return "";
    if (src.indexOf("data:") === 0 || src.indexOf("http") === 0) return src;
    return src;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var items = GrosperStore.list("gallery").filter(function (item) {
    return item.image;
  });
  if (!items.length) return;

  grid.innerHTML = items.map(function (item) {
    return '<img src="' + escapeHtml(publicSrc(item.image)) + '" alt="' + escapeHtml(item.title || "") + '">';
  }).join("");
})();
