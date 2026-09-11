(function (window) {
  var CMS_KEY = "grosper-cms-v1";
  var BRAND_KEY = "grosper-brand-v1";

  function defaults() {
    return {
      headerLogo: "images/logo.png",
      footerLogo: "",
      hideFooterLogo: false,
      favicon: "",
      ogImage: ""
    };
  }

  function readBrand() {
    var brand = defaults();
    function merge(stored) {
      if (!stored || typeof stored !== "object") return;
      Object.keys(brand).forEach(function (key) {
        if (key === "hideFooterLogo") {
          if (stored[key] != null) brand[key] = !!stored[key];
          return;
        }
        if (stored[key]) brand[key] = stored[key];
      });
    }
    try {
      var cms = JSON.parse(window.localStorage.getItem(CMS_KEY) || "{}");
      merge(cms.settings && cms.settings.brand);
    } catch (error) {}
    try {
      merge(JSON.parse(window.localStorage.getItem(BRAND_KEY) || "null"));
    } catch (error) {}
    if (window.GrosperStore && GrosperStore.getBrand) {
      merge(GrosperStore.getBrand());
    }
    return brand;
  }

  function publicPath(src, root) {
    if (!src) return "";
    if (/^(idb:|data:|blob:|https?:)/.test(src)) return src;
    src = String(src).replace(/^\.\.\//, "");
    return (root || "") + src;
  }

  function resolveSrc(src, root, done) {
    if (!src) {
      done("");
      return;
    }
    if (src.indexOf("idb:") === 0) {
      if (!window.GrosperFiles) {
        done("");
        return;
      }
      GrosperFiles.get(src.slice(4)).then(function (blob) {
        done(blob ? URL.createObjectURL(blob) : "");
      }).catch(function () {
        done("");
      });
      return;
    }
    done(publicPath(src, root));
  }

  function setImg(el, src) {
    if (!el) return;
    if (!src) {
      el.hidden = true;
      el.removeAttribute("src");
      return;
    }
    el.hidden = false;
    el.src = src;
  }

  function setFavicon(href) {
    if (!href) return;
    var link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.type = "image/png";
    link.href = href;
  }

  function setMeta(property, content) {
    if (!content) return;
    var el = document.querySelector('meta[property="' + property + '"]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("property", property);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  var applyTries = 0;

  function apply(root) {
    root = root == null ? (document.body && document.body.getAttribute("data-root")) || "" : root;
    var brand = readBrand();
    var needsFiles = [brand.headerLogo, brand.footerLogo, brand.favicon, brand.ogImage].some(function (src) {
      return src && String(src).indexOf("idb:") === 0;
    });
    if (needsFiles && !window.GrosperFiles && applyTries < 25) {
      applyTries += 1;
      window.setTimeout(function () {
        apply(root);
      }, 80);
      return;
    }
    applyTries = 0;

    var header = document.querySelector("[data-brand='header']") || document.querySelector(".logo__img");
    var footer = document.querySelector("[data-brand='footer']") || document.querySelector(".footer__logo");
    var fallbackHeader = publicPath("images/logo.png", root);

    resolveSrc(brand.headerLogo || "images/logo.png", root, function (src) {
      var next = src || fallbackHeader;
      setImg(header, next);
      if (!brand.favicon) setFavicon(next);
      if (!brand.ogImage) setMeta("og:image", next);
    });

    if (brand.hideFooterLogo || !brand.footerLogo) {
      setImg(footer, "");
    } else {
      resolveSrc(brand.footerLogo, root, function (src) {
        setImg(footer, src);
      });
    }

    if (brand.favicon) {
      resolveSrc(brand.favicon, root, function (src) {
        if (src) setFavicon(src);
      });
    }
    if (brand.ogImage) {
      resolveSrc(brand.ogImage, root, function (src) {
        if (src) setMeta("og:image", src);
      });
    }
  }

  window.GrosperBrand = {
    read: readBrand,
    apply: apply
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      apply();
    });
  } else {
    apply();
  }
})(window);
