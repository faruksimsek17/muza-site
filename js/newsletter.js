(function () {
  var form = document.getElementById("newsletter-form");
  if (!form || !window.GrosperStore) return;

  var msg = document.getElementById("newsletter-msg");

  function showMessage(text, success) {
    if (!msg) return;
    msg.hidden = false;
    msg.textContent = text;
    msg.classList.toggle("is-success", !!success);
    msg.classList.toggle("is-error", !success);
  }

  function todayIso() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var input = form.elements.email;
    var email = (input && input.value ? input.value : "").trim();
    if (!email || email.indexOf("@") === -1 || email.indexOf(".") === -1) {
      showMessage("Geçerli bir e-posta adresi girin.", false);
      return;
    }
    var list = GrosperStore.list("subscribers");
    var exists = list.some(function (row) {
      return String(row.email || "").toLowerCase() === email.toLowerCase();
    });
    if (exists) {
      showMessage("Bu e-posta zaten kayıtlı.", true);
      form.reset();
      return;
    }
    try {
      GrosperStore.upsert("subscribers", {
        id: GrosperStore.uid(),
        name: "Ana sayfa",
        email: email,
        date: todayIso(),
        source: "ana-sayfa"
      });
      form.reset();
      showMessage("Teşekkürler! Bültenimize abone oldunuz.", true);
    } catch (error) {
      showMessage("Kayıt alınamadı. Lütfen tekrar deneyin.", false);
    }
  });
})();
