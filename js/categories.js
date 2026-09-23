(function () {
  var cards = document.querySelectorAll("[data-category]");
  if (!cards.length || !window.GrosperStore) return;

  function publicSrc(src) {
    if (!src) return "";
    if (src.indexOf("data:") === 0 || src.indexOf("http") === 0 || src.indexOf("idb:") === 0) return src;
    return src.replace(/^\.\.\//, "");
  }

  function setSrc(img, src) {
    if (!img || !src) return;
    if (src.indexOf("idb:") === 0 && window.GrosperFiles) {
      GrosperFiles.get(src.slice(4)).then(function (blob) {
        if (blob) img.src = URL.createObjectURL(blob);
      });
      return;
    }
    img.src = publicSrc(src);
  }

  var items = GrosperStore.list("gallery").filter(function (item) {
    return item.image;
  });

  function shouldContain(item) {
    if (item.fitContain) return true;
    var title = String(item.title || "").toLocaleLowerCase("tr-TR");
    return title.indexOf("temel") !== -1 && title.indexOf("g") !== -1;
  }

  cards.forEach(function (card, index) {
    var item = items[index];
    if (!item) return;
    var img = card.querySelector("img");
    var title = card.querySelector("h3");
    setSrc(img, item.image);
    if (img) img.alt = item.title || img.alt;
    if (title && item.title) title.textContent = String(item.title).toLocaleLowerCase("tr-TR");
    card.classList.toggle("cat-banner--contain", shouldContain(item));
  });
})();
