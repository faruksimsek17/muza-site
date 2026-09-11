(function () {
  var page = document.body.getAttribute("data-about");
  var root = document.getElementById("about-root");
  if (!page || !root || !window.GrosperStore) return;

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function openFile(src) {
    if (!src) return;
    if (src.indexOf("idb:") === 0) {
      if (!window.GrosperFiles) return;
      GrosperFiles.get(src.slice(4)).then(function (blob) {
        if (blob) window.open(URL.createObjectURL(blob), "_blank", "noopener");
      });
      return;
    }
    window.open(src, "_blank", "noopener");
  }

  function heroHtml(title, lead) {
    return (
      '<section class="page-hero">' +
        "<h1>" + escapeHtml(title || "") + "</h1>" +
        "<p>" + escapeHtml(lead || "") + "</p>" +
      "</section>"
    );
  }

  var about = GrosperStore.getAbout ? GrosperStore.getAbout() : {};
  var meta = about[page] || {};

  if (page === "corporate") {
    var sections = GrosperStore.list("aboutSections");
    root.innerHTML =
      heroHtml(meta.title, meta.lead) +
      sections.map(function (item) {
        var image = item.image || "";
        var idbImage = image.indexOf("idb:") === 0;
        var photo = "";
        if (image) {
          photo =
            '<img class="page-card__photo" src="' + escapeHtml(idbImage ? "" : image) + '" alt="' + escapeHtml(item.title || "") + '"' +
            (idbImage ? ' data-idb="' + escapeHtml(image.slice(4)) + '"' : "") +
            ">";
        }
        return (
          '<article class="page-card' + (image ? " page-card--photo" : "") + '">' +
            photo +
            "<h2>" + escapeHtml(item.title || "") + "</h2>" +
            "<p>" + escapeHtml(item.body || "") + "</p>" +
          "</article>"
        );
      }).join("");
    if (window.GrosperFiles) {
      root.querySelectorAll("[data-idb]").forEach(function (img) {
        GrosperFiles.get(img.getAttribute("data-idb")).then(function (blob) {
          if (blob) img.src = URL.createObjectURL(blob);
        });
      });
    }
    if (meta.title) document.title = meta.title + " — Grosper";
    return;
  }

  if (page === "references") {
    var refs = GrosperStore.list("aboutRefs");
    root.innerHTML =
      heroHtml(meta.title, meta.lead) +
      '<div class="page-grid">' +
        refs.map(function (item) {
          return (
            '<article class="ref-card">' +
              "<h3>" + escapeHtml(item.title || "") + "</h3>" +
              "<p>" + escapeHtml(item.text || "") + "</p>" +
            "</article>"
          );
        }).join("") +
      "</div>";
    if (meta.title) document.title = meta.title + " — Grosper";
    return;
  }

  if (page === "documents") {
    var docs = GrosperStore.list("aboutDocs");
    root.innerHTML =
      heroHtml(meta.title, meta.lead) +
      '<div class="page-grid">' +
        docs.map(function (item) {
          var hasFile = Boolean(item.file);
          return (
            '<article class="doc-card">' +
              "<h3>" + escapeHtml(item.title || "") + "</h3>" +
              "<p>" + escapeHtml(item.text || "") + "</p>" +
              (hasFile
                ? '<a class="btn btn--red" href="#" data-about-file="' + escapeHtml(item.id) + '">Belgeyi İncele</a>'
                : "") +
            "</article>"
          );
        }).join("") +
      "</div>";
    root.addEventListener("click", function (event) {
      var link = event.target.closest("[data-about-file]");
      if (!link) return;
      event.preventDefault();
      var item = docs.find(function (row) {
        return row.id === link.getAttribute("data-about-file");
      });
      if (item) openFile(item.file);
    });
    if (meta.title) document.title = meta.title + " — Grosper";
  }
})();
