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

  function pullQuote(text) {
    var parts = String(text || "").match(/[^.!?…]+[.!?…]?/g) || [];
    parts = parts.map(function (part) { return part.trim(); }).filter(Boolean);
    return parts.length > 1 ? parts[parts.length - 1] : (parts[0] || "");
  }

  function padIndex(index) {
    return String(index + 1).padStart(2, "0");
  }

  function imageTag(src, alt, className) {
    if (!src) return "";
    var idbImage = src.indexOf("idb:") === 0;
    return (
      '<img class="' + className + '" src="' + escapeHtml(idbImage ? "" : src) + '" alt="' + escapeHtml(alt || "") + '"' +
      (idbImage ? ' data-idb="' + escapeHtml(src.slice(4)) + '"' : "") +
      ">"
    );
  }

  function bindIdbImages(scope) {
    if (!window.GrosperFiles) return;
    scope.querySelectorAll("[data-idb]").forEach(function (img) {
      GrosperFiles.get(img.getAttribute("data-idb")).then(function (blob) {
        if (blob) img.src = URL.createObjectURL(blob);
      });
    });
  }

  var about = GrosperStore.getAbout ? GrosperStore.getAbout() : {};
  var meta = about[page] || {};

  if (page === "corporate") {
    var sections = GrosperStore.list("aboutSections");
    var feature = sections[0] || { title: "", body: "", image: "" };
    var rest = sections.slice(1);
    var quote = pullQuote(feature.body);
    var photo = feature.image || "../images/kurumsal-hikaye.png";
    root.innerHTML =
      '<article class="magazine">' +
        '<header class="magazine__masthead">' +
          '<p class="magazine__folio">Grosper <span></span> Hakkımızda <span></span> Kurumsal</p>' +
          '<p class="magazine__kicker">Kapıya kadar mahalle marketi</p>' +
          "<h1>" + escapeHtml(meta.title || "Kurumsal") + "</h1>" +
          (meta.lead ? '<p class="magazine__deck">' + escapeHtml(meta.lead) + "</p>" : "") +
        "</header>" +
        '<figure class="magazine__figure">' +
          imageTag(photo, feature.title || meta.title, "magazine__photo") +
          "<figcaption>Grosper arşivi</figcaption>" +
        "</figure>" +
        '<section class="magazine__copy">' +
          '<p class="magazine__label">' + padIndex(0) + " / " + escapeHtml(feature.title || "Hikaye") + "</p>" +
          "<h2>" + escapeHtml(feature.title || "") + "</h2>" +
            '<p class="magazine__body' + (/^[A-Za-zÇĞİÖŞÜçğıöşü]/.test(feature.body || "") ? " magazine__body--drop" : "") + '">' + escapeHtml(feature.body || "") + "</p>" +
        "</section>" +
        (quote
          ? '<blockquote class="magazine__pull">“' + escapeHtml(quote.replace(/^[“”"]+|["”]+$/g, "")) + '”</blockquote>'
          : "") +
        (rest.length
          ? '<section class="magazine__folio-grid">' +
            rest.map(function (item, index) {
              return (
                '<section class="magazine__col">' +
                  '<p class="magazine__label">' + padIndex(index + 1) + " / " + escapeHtml(item.title || "") + "</p>" +
                  "<h2>" + escapeHtml(item.title || "") + "</h2>" +
                  "<p>" + escapeHtml(item.body || "") + "</p>" +
                "</section>"
              );
            }).join("") +
          "</section>"
          : "") +
      "</article>";
    bindIdbImages(root);
    if (meta.title) document.title = meta.title + " — Grosper";
    return;
  }

  if (page === "references") {
    var refs = GrosperStore.list("aboutRefs");
    root.innerHTML =
      heroHtml(meta.title, meta.lead) +
      '<div class="ref-grid">' +
        refs.map(function (item) {
          var image = item.image || "";
          return (
            '<article class="ref-logo">' +
              (image
                ? imageTag(image, item.title, "ref-logo__img")
                : "<h3>" + escapeHtml(item.title || "") + "</h3>") +
              (item.text ? "<p>" + escapeHtml(item.text) + "</p>" : "") +
            "</article>"
          );
        }).join("") +
      "</div>";
    bindIdbImages(root);
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
