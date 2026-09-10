(function () {
  if (!window.GrosperStore) return;

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

  function formatDate(value) {
    if (!value) return "";
    var parts = String(value).split("-");
    if (parts.length !== 3) return value;
    var months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    var month = months[Number(parts[1]) - 1];
    if (!month) return value;
    return Number(parts[2]) + " " + month + " " + parts[0];
  }

  var news = GrosperStore.list("news").filter(function (item) {
    return item.status !== "taslak";
  });

  var grid = document.querySelector(".page-grid");
  if (grid && news.length) {
    grid.innerHTML = news.map(function (item) {
      var image = publicSrc(item.image || "../images/fruits.jpg");
      return (
        '<article class="news-card">' +
          '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(item.title) + '">' +
          '<div class="news-card__body">' +
            '<p class="news-meta">' + escapeHtml(formatDate(item.date)) + "</p>" +
            "<h3>" + escapeHtml(item.title) + "</h3>" +
            "<p>" + escapeHtml(item.summary || "") + "</p>" +
            '<a class="btn btn--red" href="haber-detay.html?id=' + encodeURIComponent(item.id) + '">Haberi Oku</a>' +
          "</div>" +
        "</article>"
      );
    }).join("");
  }

  var titleEl = document.getElementById("news-title");
  if (!titleEl || !news.length) return;

  var rawId = new URLSearchParams(window.location.search).get("id") || "";
  var post = news.find(function (item) {
    return item.id === rawId;
  });
  if (!post && /^\d+$/.test(rawId)) {
    post = news[Number(rawId) - 1];
  }
  if (!post) post = news[0];

  document.title = post.title + " — Grosper";
  titleEl.textContent = post.title;
  var dateEl = document.getElementById("news-date");
  var leadEl = document.getElementById("news-lead");
  var bodyEl = document.getElementById("news-body");
  var img = document.getElementById("news-image");
  if (dateEl) dateEl.textContent = formatDate(post.date);
  if (leadEl) leadEl.textContent = post.summary || "";
  if (bodyEl) bodyEl.textContent = post.body || post.summary || "";
  if (img) {
    img.src = publicSrc(post.image || "");
    img.alt = post.title || "";
  }
})();
