(function () {
  var root = document.body.getAttribute("data-root") || "";
  var page = document.body.getAttribute("data-page") || "";
  var home = root + "index.html";
  var p = root + "sayfalar/";

  if (window.GrosperTheme) {
    GrosperTheme.apply();
  } else {
    var themeScript = document.createElement("script");
    themeScript.src = root + "js/theme.js?v=8";
    document.head.appendChild(themeScript);
  }

  function loadScript(src, done) {
    var script = document.createElement("script");
    script.src = src;
    script.onload = function () {
      if (done) done();
    };
    script.onerror = function () {
      if (done) done();
    };
    document.head.appendChild(script);
  }

  function bootBrand() {
    function applyNow() {
      if (window.GrosperBrand) GrosperBrand.apply(root);
    }
    function withBrand() {
      if (window.GrosperBrand) {
        applyNow();
        return;
      }
      loadScript(root + "js/brand.js?v=2", applyNow);
    }
    function withFiles() {
      if (window.GrosperFiles) {
        withBrand();
        return;
      }
      loadScript(root + "admin/js/files.js?v=8", withBrand);
    }
    if (window.GrosperStore) {
      withFiles();
      return;
    }
    loadScript(root + "admin/js/store.js?v=15", withFiles);
  }

  function headerHtml() {
    return (
      '<header class="header">' +
        '<div class="container header__inner">' +
          '<a class="logo" href="' + home + '" aria-label="Grosper anasayfa">' +
            '<img class="logo__img" src="' + root + 'images/logo.png" alt="Grosper — Alışverişe değer!" width="220" height="80" data-brand="header">' +
          "</a>" +
          '<a class="header-cta" href="' + p + 'bulten.html">İndirim Bülteni</a>' +
          '<input type="checkbox" id="nav-toggle" class="nav-toggle" hidden>' +
          '<label for="nav-toggle" class="nav-toggle-btn" aria-label="Menüyü aç"><span></span><span></span><span></span></label>' +
          '<label for="nav-toggle" class="drawer-overlay" aria-hidden="true"></label>' +
          '<label for="nav-toggle" class="drawer-close" aria-label="Menüyü kapat">' +
            '<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
          "</label>" +
          '<aside class="drawer" data-panel="main" aria-label="Mobil menü">' +
            '<div class="drawer__track">' +
              '<nav class="drawer__panel" data-panel="main">' +
                '<a href="' + home + '">Anasayfa</a>' +
                '<button type="button" class="drawer__next" data-open="about">Hakkımızda <span>›</span></button>' +
                '<a href="' + p + 'haberler.html">Haberler</a>' +
                '<button type="button" class="drawer__next" data-open="media">Multimedya <span>›</span></button>' +
                '<button type="button" class="drawer__next" data-open="contact">İletişim <span>›</span></button>' +
                '<a class="drawer__cta" href="' + p + 'bulten.html">İndirim Bülteni</a>' +
              "</nav>" +
              '<nav class="drawer__panel" data-panel="about">' +
                '<button type="button" class="drawer__back" data-back>‹ Hakkımızda</button>' +
                '<a href="' + p + 'kurumsal.html">Kurumsal</a>' +
                '<a href="' + p + 'referanslar.html">Referanslar</a>' +
                '<a href="' + p + 'belgelerimiz.html">Belgelerimiz</a>' +
              "</nav>" +
              '<nav class="drawer__panel" data-panel="media">' +
                '<button type="button" class="drawer__back" data-back>‹ Multimedya</button>' +
                '<a href="' + p + 'galeri.html">Resim Galerisi</a>' +
                '<a href="' + p + 'videolar.html">Videolar</a>' +
              "</nav>" +
              '<nav class="drawer__panel" data-panel="contact">' +
                '<button type="button" class="drawer__back" data-back>‹ İletişim</button>' +
                '<a href="' + p + 'subeler.html">Şubelerimiz</a>' +
                '<a href="' + p + 'is-basvurusu.html">İş Başvurusu</a>' +
                '<a href="' + p + 'insan-kaynaklari.html">İnsan Kaynakları</a>' +
                '<a href="' + p + 'musteri-yorumlari.html">Müşteri Yorumları</a>' +
              "</nav>" +
            "</div>" +
          "</aside>" +
          '<nav class="nav">' +
            '<a class="nav__link" href="' + home + '" data-nav="home">Anasayfa</a>' +
            '<div class="nav__group" data-nav="about">' +
              '<a class="nav__link" href="' + p + 'kurumsal.html">Hakkımızda</a>' +
              '<div class="nav__menu">' +
                '<a href="' + p + 'kurumsal.html">Kurumsal</a>' +
                '<a href="' + p + 'referanslar.html">Referanslar</a>' +
                '<a href="' + p + 'belgelerimiz.html">Belgelerimiz</a>' +
              "</div>" +
            "</div>" +
            '<a class="nav__link" href="' + p + 'haberler.html" data-nav="news">Haberler</a>' +
            '<div class="nav__group" data-nav="media">' +
              '<a class="nav__link" href="' + p + 'galeri.html">Multimedya</a>' +
              '<div class="nav__menu">' +
                '<a href="' + p + 'galeri.html">Resim Galerisi</a>' +
                '<a href="' + p + 'videolar.html">Videolar</a>' +
              "</div>" +
            "</div>" +
            '<div class="nav__group" data-nav="contact">' +
              '<a class="nav__link" href="' + p + 'subeler.html">İletişim</a>' +
              '<div class="nav__menu">' +
                '<a href="' + p + 'subeler.html">Şubelerimiz</a>' +
                '<a href="' + p + 'is-basvurusu.html">İş Başvurusu</a>' +
                '<a href="' + p + 'insan-kaynaklari.html">İnsan Kaynakları</a>' +
                '<a href="' + p + 'musteri-yorumlari.html">Müşteri Yorumları</a>' +
              "</div>" +
            "</div>" +
            '<a class="nav__link nav__link--cta" href="' + p + 'bulten.html" data-nav="bulletin">İndirim Bülteni</a>' +
          "</nav>" +
        "</div>" +
      "</header>"
    );
  }

  function footerHtml() {
    return (
      '<footer class="footer">' +
        '<div class="container footer__grid">' +
          "<div>" +
            '<img class="footer__logo" data-brand="footer" alt="Grosper" hidden>' +
            "<h3>Hızlı İletişim</h3>" +
            "<p>Telefon: 0216 517 28 05</p>" +
            "<p>E-Posta: info@grosper.com.tr</p>" +
            "<p>Adres: Çavuşoğlu Mh. Yakacık Cd. No:130<br>Kartal / İstanbul</p>" +
          "</div>" +
          "<div>" +
            "<h3>Biz Kimiz</h3>" +
            "<ul>" +
              '<li><a href="' + p + 'kurumsal.html">» Kurumsal</a></li>' +
              '<li><a href="' + p + 'referanslar.html">» Referanslar</a></li>' +
              '<li><a href="' + p + 'belgelerimiz.html">» Belgelerimiz</a></li>' +
            "</ul>" +
          "</div>" +
          "<div>" +
            "<h3>Hızlı Linkler</h3>" +
            "<ul>" +
              '<li><a href="' + p + 'subeler.html">» Şubelerimiz</a></li>' +
              '<li><a href="' + p + 'haberler.html">» Haberler</a></li>' +
              '<li><a href="' + p + 'galeri.html">» Galeri</a></li>' +
            "</ul>" +
          "</div>" +
        "</div>" +
        '<div class="container footer__bottom">' +
          '<div class="socials" aria-label="Sosyal medya">' +
            '<a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none"><rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="3.6" stroke="currentColor" stroke-width="1.6"/><circle cx="17.2" cy="6.8" r="0.9" fill="currentColor"/></svg></a>' +
            '<a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M13.2 8.2h1.6V6.2h-1.6c-1.7 0-2.8 1.1-2.8 2.8v1.4H9v2h1.4V18h2.2v-5.6h1.7l.3-2h-2V9.2c0-.5.3-.99 1.4-.99Z" fill="currentColor"/></svg></a>' +
            '<a href="#" aria-label="X"><svg viewBox="0 0 24 24" fill="none"><path d="M7 7 17 17M17 7 7 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></a>' +
            '<a href="' + p + 'bulten.html" aria-label="Bülten"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="3.2" stroke="currentColor" stroke-width="1.6"/></svg></a>' +
          "</div>" +
        "</div>" +
      "</footer>"
    );
  }

  var headerRoot = document.getElementById("site-header");
  if (headerRoot) headerRoot.outerHTML = headerHtml();

  function markActive() {
    document.querySelectorAll(".nav__link").forEach(function (link) {
      link.classList.remove("is-active");
    });
    var match = document.querySelector('[data-nav="' + page + '"]');
    if (!match) return;
    if (match.classList.contains("nav__link")) {
      match.classList.add("is-active");
      return;
    }
    var groupLink = match.querySelector(".nav__link");
    if (groupLink) groupLink.classList.add("is-active");
  }

  function bindFooter() {
    var footerRoot = document.getElementById("site-footer");
    if (footerRoot) footerRoot.outerHTML = footerHtml();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      bindFooter();
      markActive();
      bootBrand();
    });
  } else {
    bindFooter();
    markActive();
    bootBrand();
  }

  markActive();

  var toggle = document.getElementById("nav-toggle");
  var drawer = document.querySelector(".drawer");
  var overlay = document.querySelector(".drawer-overlay");
  var closer = document.querySelector(".drawer-close");
  [overlay, closer, drawer].forEach(function (el) {
    if (el) document.body.appendChild(el);
  });

  function showPanel(name) {
    var target = name || "main";
    if (!drawer) return;
    drawer.setAttribute("data-panel", target);
    drawer.querySelectorAll(".drawer__panel").forEach(function (panel) {
      var active = panel.getAttribute("data-panel") === target;
      panel.classList.toggle("is-active", active);
    });
  }

  function syncDrawer() {
    var open = !!(toggle && toggle.checked);
    document.body.classList.toggle("nav-open", open);
    if (drawer) drawer.setAttribute("data-open", open ? "true" : "false");
    if (overlay) overlay.setAttribute("data-open", open ? "true" : "false");
    if (closer) closer.setAttribute("data-open", open ? "true" : "false");
    if (!open) showPanel("main");
  }

  if (drawer) {
    drawer.querySelectorAll("[data-open]").forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        showPanel(btn.getAttribute("data-open"));
      });
    });
    drawer.querySelectorAll("[data-back]").forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        showPanel("main");
      });
    });
    showPanel("main");
  }

  if (toggle) {
    toggle.addEventListener("change", syncDrawer);
    syncDrawer();
  }
})();
