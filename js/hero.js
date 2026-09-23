(function () {
  function initHeroSlider() {
  var slider = document.querySelector("[data-hero-slider]");
  if (!slider) return;

  var track = slider.querySelector(".hero-slider__track");
  var slides = slider.querySelectorAll(".hero-slider__slide");
  var prev = slider.querySelector("[data-hero-prev]");
  var next = slider.querySelector("[data-hero-next]");
  var dots = slider.querySelectorAll("[data-hero-dot]");
  var total = slides.length;
  if (!track || total < 1) return;
  var index = 0;
  var timer = null;
  var delay = 5500;
  var startX = 0;
  var deltaX = 0;
  var dragging = false;

  function goTo(nextIndex) {
    index = (nextIndex + total) % total;
    track.style.transform = "translateX(-" + index * 100 + "%)";
    slides.forEach(function (slide, i) {
      slide.setAttribute("aria-hidden", i === index ? "false" : "true");
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === index);
      if (i === index) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  }

  function play() {
    stop();
    timer = window.setInterval(function () {
      goTo(index + 1);
    }, delay);
  }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  if (prev) {
    prev.addEventListener("click", function () {
      goTo(index - 1);
      play();
    });
  }

  if (next) {
    next.addEventListener("click", function () {
      goTo(index + 1);
      play();
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      goTo(i);
      play();
    });
  });

  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", play);

  slider.addEventListener("touchstart", function (event) {
    startX = event.changedTouches[0].clientX;
    deltaX = 0;
    dragging = true;
    stop();
  }, { passive: true });

  slider.addEventListener("touchmove", function (event) {
    if (!dragging) return;
    deltaX = event.changedTouches[0].clientX - startX;
  }, { passive: true });

  slider.addEventListener("touchend", function () {
    if (!dragging) return;
    dragging = false;
    if (Math.abs(deltaX) > 40) {
      goTo(deltaX < 0 ? index + 1 : index - 1);
    }
    play();
  });

  goTo(0);
  if (total > 1) play();
  }

  initHeroSlider();
})();
