(function (window) {
  var CMS_KEY = "grosper-cms-v1";
  var THEME_KEY = "grosper-theme-v1";

  var DEFAULTS = {
    primary: "#e30613",
    primaryDark: "#c10510",
    ink: "#111111",
    bg: "#f6f7f9",
    border: "#ececec",
    muted: "#6b6b6b",
    headerBg: "#e30613",
    headerText: "#ffffff",
    footerBg: "#0d0d0d",
    footerText: "#f3f3f3"
  };

  function normalizeHex(value, fallback) {
    var raw = String(value == null ? "" : value).trim();
    if (/^#[0-9a-fA-F]{6}$/.test(raw)) return raw.toLowerCase();
    if (/^[0-9a-fA-F]{6}$/.test(raw)) return "#" + raw.toLowerCase();
    return fallback;
  }

  function parseJson(raw) {
    try {
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function readTheme() {
    var theme = Object.assign({}, DEFAULTS);
    var cms = parseJson(window.localStorage.getItem(CMS_KEY) || "{}") || {};
    var fromCms = cms.settings && cms.settings.theme ? cms.settings.theme : {};
    var standalone = parseJson(window.localStorage.getItem(THEME_KEY) || "null") || {};
    Object.keys(DEFAULTS).forEach(function (key) {
      theme[key] = normalizeHex(standalone[key] || fromCms[key], DEFAULTS[key]);
    });
    return theme;
  }

  function writeStandalone(theme) {
    var next = Object.assign({}, DEFAULTS);
    Object.keys(DEFAULTS).forEach(function (key) {
      next[key] = normalizeHex(theme && theme[key], DEFAULTS[key]);
    });
    try {
      window.localStorage.setItem(THEME_KEY, JSON.stringify(next));
      return next;
    } catch (error) {
      return null;
    }
  }

  function apply(theme) {
    var next = Object.assign({}, DEFAULTS, theme || readTheme());
    Object.keys(DEFAULTS).forEach(function (key) {
      next[key] = normalizeHex(next[key], DEFAULTS[key]);
    });
    var css =
      ":root{" +
      "--red:" + next.primary + " !important;" +
      "--red-dark:" + next.primaryDark + " !important;" +
      "--ink:" + next.ink + " !important;" +
      "--muted:" + next.muted + " !important;" +
      "--bg:" + next.bg + " !important;" +
      "--line:" + next.border + " !important;" +
      "--header:" + next.headerBg + " !important;" +
      "--header-text:" + next.headerText + " !important;" +
      "--footer:" + next.footerBg + " !important;" +
      "--footer-text:" + next.footerText + " !important;" +
      "}";
    var el = document.getElementById("grosper-theme-vars");
    if (!el) {
      el = document.createElement("style");
      el.id = "grosper-theme-vars";
      (document.head || document.documentElement).appendChild(el);
    }
    el.textContent = css;
    var style = document.documentElement.style;
    style.setProperty("--red", next.primary, "important");
    style.setProperty("--red-dark", next.primaryDark, "important");
    style.setProperty("--ink", next.ink, "important");
    style.setProperty("--muted", next.muted, "important");
    style.setProperty("--bg", next.bg, "important");
    style.setProperty("--line", next.border, "important");
    style.setProperty("--header", next.headerBg, "important");
    style.setProperty("--header-text", next.headerText, "important");
    style.setProperty("--footer", next.footerBg, "important");
    style.setProperty("--footer-text", next.footerText, "important");
    return next;
  }

  window.GrosperTheme = {
    DEFAULTS: DEFAULTS,
    THEME_KEY: THEME_KEY,
    normalizeHex: normalizeHex,
    read: readTheme,
    write: writeStandalone,
    apply: apply
  };

  apply();
  window.addEventListener("storage", function (event) {
    if (event.key === CMS_KEY || event.key === THEME_KEY || event.key === null) apply();
  });
  window.addEventListener("pageshow", function () {
    apply();
  });
})(window);
