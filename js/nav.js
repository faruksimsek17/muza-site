(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));

  function setActive() {
    var hash = window.location.hash;
    links.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      var isHome = href === "index.html" && (hash === "" || hash === "#");
      var isSection = href.charAt(0) === "#" && href === hash;
      link.classList.toggle("is-active", isHome || isSection);
    });
  }

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      window.setTimeout(setActive, 0);
    });
  });

  window.addEventListener("hashchange", setActive);
  setActive();
})();
