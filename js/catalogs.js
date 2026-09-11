(function () {
  var grid = document.getElementById("catalog-grid");
  if (!grid || !window.GrosperStore) return;

  var arrow =
    '<span class="btn--catalog-arrow" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" fill="none">' +
        '<path d="M10 7l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>" +
    "</span>";

  function publicSrc(src) {
    if (!src) return "";
    if (src.indexOf("data:") === 0 || src.indexOf("http") === 0 || src.indexOf("idb:") === 0) return src;
    return src;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function openPdf(pdf) {
    if (!pdf) return;
    if (pdf.indexOf("idb:") === 0) {
      if (!window.GrosperFiles) return;
      GrosperFiles.get(pdf.slice(4)).then(function (blob) {
        if (!blob) return;
        window.open(URL.createObjectURL(blob), "_blank", "noopener");
      });
      return;
    }
    if (pdf.indexOf("data:") !== 0) {
      window.open(pdf, "_blank", "noopener");
      return;
    }
    var parts = pdf.split(",");
    var meta = parts[0] || "";
    var data = parts.slice(1).join(",");
    var mimeMatch = meta.match(/:(.*?);/);
    var mime = mimeMatch ? mimeMatch[1] : "application/pdf";
    var binary = meta.indexOf("base64") !== -1 ? atob(data) : decodeURIComponent(data);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    var url = URL.createObjectURL(new Blob([bytes], { type: mime || "application/pdf" }));
    window.open(url, "_blank", "noopener");
  }

  var catalogs = GrosperStore.list("catalogs").filter(function (item) {
    return item.status !== "taslak";
  });

  if (!catalogs.length) {
    grid.innerHTML = '<p class="catalog-empty">Şu anda yayında katalog bulunmuyor.</p>';
    return;
  }

  grid.innerHTML = catalogs.map(function (item) {
    var image = publicSrc(item.image || "../images/katalog-kapak.jpg");
    var idbImage = item.image && item.image.indexOf("idb:") === 0;
    var hasPdf = Boolean(item.pdf);
    return (
      '<article class="catalog-card">' +
        '<div class="catalog-card__cover">' +
          '<img src="' + escapeHtml(idbImage ? "../images/katalog-kapak.jpg" : image) + '" alt="' + escapeHtml(item.title || "") + '"' +
            (idbImage ? ' data-idb="' + escapeHtml(item.image.slice(4)) + '"' : "") +
          ">" +
        "</div>" +
        '<div class="catalog-card__body">' +
          "<h2>" + escapeHtml(item.title || "") + "</h2>" +
          "<p>" + escapeHtml(item.summary || "") + "</p>" +
          '<div class="catalog-card__actions">' +
            '<a class="btn btn--catalog" href="#"' + (hasPdf ? ' data-catalog="' + escapeHtml(item.id) + '"' : ' aria-disabled="true"') + ">Online Katalog " + arrow + "</a>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }).join("");

  if (window.GrosperFiles) {
    grid.querySelectorAll("[data-idb]").forEach(function (img) {
      GrosperFiles.get(img.getAttribute("data-idb")).then(function (blob) {
        if (blob) img.src = URL.createObjectURL(blob);
      });
    });
  }

  grid.addEventListener("click", function (event) {
    var link = event.target.closest("[data-catalog]");
    if (!link) return;
    event.preventDefault();
    var id = link.getAttribute("data-catalog");
    var item = catalogs.find(function (row) {
      return row.id === id;
    });
    if (item && item.pdf) openPdf(item.pdf);
  });
})();
