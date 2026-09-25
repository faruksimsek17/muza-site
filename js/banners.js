(function () {
  var grid = document.querySelector(".promo-grid");
  if (!grid || !window.GrosperStore) return;

  function publicSrc(src) {
    if (!src) return "";
    if (src.indexOf("data:") === 0 || src.indexOf("http") === 0 || src.indexOf("idb:") === 0) return src;
    return src.replace(/^\.\.\//, "");
  }

  function publicHref(link) {
    if (!link) return "#kategoriler";
    if (link.indexOf("http") === 0 || link.charAt(0) === "#") return link;
    return link.replace(/^\.\.\//, "");
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
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

  var banners = GrosperStore.list("banners").filter(function (item) {
    return item && item.status !== "taslak" && (item.image || item.desktopImage);
  });
  if (!banners.length) return;

  grid.innerHTML = banners.map(function (item) {
    var src = item.image || item.desktopImage || "";
    var idb = src.indexOf("idb:") === 0;
    return (
      '<a class="promo" href="' + escapeHtml(publicHref(item.link)) + '">' +
        '<img src="' + escapeHtml(idb ? "" : publicSrc(src)) + '" alt="' + escapeHtml(item.title || "") + '"' +
          (idb ? ' data-idb="' + escapeHtml(src.slice(4)) + '"' : "") +
        ">" +
      "</a>"
    );
  }).join("");

  grid.querySelectorAll("img[data-idb]").forEach(function (img) {
    setSrc(img, "idb:" + img.getAttribute("data-idb"));
  });
})();

(function () {
  var slider = document.querySelector("[data-hero-slider]");
  var track = slider && slider.querySelector(".hero-slider__track");
  var dotsWrap = slider && slider.querySelector(".hero__dots");
  if (!track || !window.GrosperStore) return;

  function publicSrc(src) {
    if (!src) return "";
    if (src.indexOf("data:") === 0 || src.indexOf("http") === 0 || src.indexOf("idb:") === 0) return src;
    return src.replace(/^\.\.\//, "");
  }

  function publicHref(link) {
    if (!link) return "#kategoriler";
    if (link.indexOf("http") === 0 || link.charAt(0) === "#") return link;
    return link.replace(/^\.\.\//, "");
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function imgTag(src, cls, alt) {
    var idb = src && src.indexOf("idb:") === 0;
    var path = idb ? "" : publicSrc(src);
    return (
      '<img class="' + cls + '" src="' + escapeHtml(path) + '" alt="' + escapeHtml(alt || "") + '"' +
        (idb ? ' data-idb="' + escapeHtml(src.slice(4)) + '"' : "") +
      ">"
    );
  }

  var sliders = GrosperStore.list("sliders").filter(function (item) {
    return item.status !== "taslak" && (item.image || item.desktopImage);
  });
  if (!sliders.length) return;

  track.innerHTML = sliders.map(function (item, index) {
    var desktop = item.image || item.desktopImage || "";
    var mobile = item.mobileImage || "";
    var hasMobile = !!mobile;
    var alt = item.title || "";
    var images = imgTag(desktop, "hero-slide__img hero-slide__img--desk", alt);
    if (hasMobile) images += imgTag(mobile, "hero-slide__img hero-slide__img--mob", alt);
    return (
      '<a class="hero-slide hero-slider__slide' + (hasMobile ? " has-mobile" : "") + '" href="' + escapeHtml(publicHref(item.link)) + '" aria-hidden="' + (index === 0 ? "false" : "true") + '">' +
        images +
      "</a>"
    );
  }).join("");

  if (dotsWrap) {
    dotsWrap.innerHTML = sliders.map(function (item, index) {
      return '<button type="button" class="' + (index === 0 ? "is-active" : "") + '" data-hero-dot aria-label="' + (index + 1) + '. slayt"' + (index === 0 ? ' aria-current="true"' : "") + "></button>";
    }).join("");
  }

  if (window.GrosperFiles) {
    track.querySelectorAll("[data-idb]").forEach(function (img) {
      GrosperFiles.get(img.getAttribute("data-idb")).then(function (blob) {
        if (blob) img.src = URL.createObjectURL(blob);
      });
    });
  }
})();
