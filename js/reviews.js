(function () {
  var root = document.getElementById("reviews-root");
  if (!root || !window.GrosperStore) return;

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function starText(value) {
    var n = Math.max(1, Math.min(5, Math.round(Number(value) || 5)));
    var out = "";
    var i;
    for (i = 1; i <= 5; i += 1) out += i <= n ? "★" : "☆";
    return out;
  }

  function quote(text) {
    var value = String(text || "").trim();
    if (!value) return "";
    if (/^[“"«]/.test(value)) return value;
    return "“" + value + ( /[”"»]$/.test(value) ? "" : "”" );
  }

  var reviews = GrosperStore.list("reviews").filter(function (item) {
    return item && item.status !== "taslak";
  });

  if (!reviews.length) {
    root.innerHTML = '<p class="page-empty">Henüz yayınlanmış yorum yok.</p>';
    return;
  }

  root.innerHTML = reviews.map(function (item) {
    var who = [item.name, item.city].filter(Boolean).join(" — ");
    return (
      '<article class="review-card">' +
        '<p class="stars">' + starText(item.stars) + "</p>" +
        "<p>" + escapeHtml(quote(item.text)) + "</p>" +
        (who ? "<p><strong>" + escapeHtml(item.name || "") + "</strong>" +
          (item.city ? " — " + escapeHtml(item.city) : "") + "</p>" : "") +
      "</article>"
    );
  }).join("");
})();
