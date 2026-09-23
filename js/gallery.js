(function () {
  var grid = document.querySelector(".gallery-grid");
  if (!grid || !window.GrosperStore) return;

  function publicSrc(src) {
    if (!src) return "";
    if (src.indexOf("data:") === 0 || src.indexOf("http") === 0 || src.indexOf("idb:") === 0) return src;
    return src.replace(/^\.\.\//, "");
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
    var idb = item.image.indexOf("idb:") === 0;
    return (
      '<img src="' + escapeHtml(idb ? "" : publicSrc(item.image)) + '" alt="' + escapeHtml(item.title || "") + '"' +
        (idb ? ' data-idb="' + escapeHtml(item.image.slice(4)) + '"' : "") +
      ">"
    );
  }).join("");

  if (window.GrosperFiles) {
    grid.querySelectorAll("[data-idb]").forEach(function (img) {
      GrosperFiles.get(img.getAttribute("data-idb")).then(function (blob) {
        if (blob) img.src = URL.createObjectURL(blob);
      });
    });
  }
})();
