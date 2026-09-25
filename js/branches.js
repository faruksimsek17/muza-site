(function () {
  var root = document.getElementById("branches-root");
  var filterRoot = document.getElementById("branch-filter");
  if (!root || !window.GrosperStore) return;

  var clockIcon =
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="8.2" stroke="currentColor" stroke-width="1.7"/>' +
      '<path d="M12 7.8V12l3 1.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>' +
    "</svg>";

  var phoneIcon =
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M8.2 4.8c.4-.4 1-.5 1.5-.2l2 1.2c.5.3.7.9.5 1.5l-.7 1.8c-.1.4 0 .8.3 1.1 1 1.2 2.3 2.4 3.6 3.3.3.2.8.3 1.1.1l1.8-.6c.5-.2 1.1 0 1.4.5l1.3 2c.3.5.2 1.1-.2 1.5l-1.2 1.2c-.4.4-1 .6-1.6.5-2.6-.4-5.3-2.4-8-5.1-2.7-2.7-4.6-5.5-5-8.1-.1-.6.1-1.2.5-1.6l1.2-1.1Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' +
    "</svg>";

  var mapIcon =
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M12 21s6.2-5.2 6.2-10.2A6.2 6.2 0 0 0 12 4.6a6.2 6.2 0 0 0-6.2 6.2C5.8 15.8 12 21 12 21Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>' +
      '<circle cx="12" cy="10.8" r="2.1" stroke="currentColor" stroke-width="1.7"/>' +
    "</svg>";

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function telHref(phone) {
    return "tel:" + String(phone || "").replace(/[^\d+]/g, "");
  }

  function mapHref(item) {
    var url = String(item.mapUrl || "").trim();
    if (!url && item && item.address) {
      url = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(item.address);
    }
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    return "https://" + url.replace(/^\/\//, "");
  }

  function cardHtml(item) {
    var hours = item.hours || "09:00-21:30";
    var phone = item.phone || "";
    var map = mapHref(item);
    return (
      '<article class="branch-card" data-branch-id="' + escapeHtml(item.id || "") + '">' +
        "<h3>" + escapeHtml(item.name || "") + "</h3>" +
        '<p class="branch-card__address">' + escapeHtml(item.address || "") + "</p>" +
        '<div class="branch-pills">' +
          '<span class="branch-pill branch-pill--hours">' + clockIcon + escapeHtml(hours) + "</span>" +
          (phone
            ? '<a class="branch-pill branch-pill--phone" href="' + telHref(phone) + '">' + phoneIcon + escapeHtml(phone) + "</a>"
            : "") +
          (map
            ? '<a class="branch-pill branch-pill--map" href="' + escapeHtml(map) + '" target="_blank" rel="noopener">' +
                mapIcon + "Haritada Gör" +
              "</a>"
            : "") +
        "</div>" +
      "</article>"
    );
  }

  var branches = GrosperStore.list("branches");
  if (!branches.length) return;

  if (filterRoot) {
    filterRoot.innerHTML =
      '<label class="branch-select" for="branch-select">' +
        "<span>Şube seçin</span>" +
        '<select id="branch-select">' +
          '<option value="">Tüm şubeler</option>' +
          branches.map(function (item) {
            return '<option value="' + escapeHtml(item.id) + '">' + escapeHtml(item.name || "") + "</option>";
          }).join("") +
        "</select>" +
      "</label>";
  }

  function render(selectedId) {
    var list = selectedId
      ? branches.filter(function (item) { return item.id === selectedId; })
      : branches;
    root.innerHTML = list.map(cardHtml).join("");
  }

  render("");

  var select = document.getElementById("branch-select");
  if (select) {
    select.addEventListener("change", function () {
      render(select.value);
    });
  }
})();
