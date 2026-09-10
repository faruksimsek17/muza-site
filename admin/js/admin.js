(function () {
  var AUTH_KEY = "grosper-admin-auth";
  var USER = "admin";
  var PASS = "grosper";

  var titles = {
    dashboard: ["Özet", "Sitenin güncel içerik özeti"],
    sliders: ["Slider", "Ana sayfa yana kayan bannerlar"],
    banners: ["Blok Banner", "Ana sayfadaki 3 kampanya görseli"],
    news: ["Haberler", "Blog ve kampanya haberleri"],
    gallery: ["Öne Çıkan Kategoriler", "Ana sayfadaki öne çıkan kategori görselleri"],
    videos: ["Videolar", "YouTube video bağlantıları"],
    branches: ["Şubeler", "Mağaza adresleri ve çalışma saatleri"],
    reviews: ["Yorumlar", "Müşteri yorumları"],
    jobs: ["İş Başvuruları", "Gelen başvurular"],
    subscribers: ["Bülten", "İndirim bülteni kayıtları"],
    settings: ["Ayarlar", "İletişim bilgileri"]
  };

  function isAuthed() {
    return window.sessionStorage.getItem(AUTH_KEY) === "1";
  }

  function toast(message) {
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("is-on");
    window.setTimeout(function () {
      el.classList.remove("is-on");
    }, 1800);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function statusBadge(status) {
    if (status === "yayinda") return '<span class="badge badge--on">Yayında</span>';
    if (status === "yeni") return '<span class="badge badge--new">Yeni</span>';
    if (status === "incelendi") return '<span class="badge badge--off">İncelendi</span>';
    return '<span class="badge badge--off">Taslak</span>';
  }

  function bindLogin() {
    var form = document.getElementById("login-form");
    if (!form) return;
    if (isAuthed()) {
      window.location.href = "panel.html";
      return;
    }
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var error = document.getElementById("login-error");
      if (data.get("user") === USER && data.get("pass") === PASS) {
        window.sessionStorage.setItem(AUTH_KEY, "1");
        window.location.href = "panel.html";
        return;
      }
      if (error) error.hidden = false;
    });
  }

  function table(headers, rowsHtml) {
    return (
      '<div class="table-wrap"><table><thead><tr>' +
      headers.map(function (h) { return "<th>" + h + "</th>"; }).join("") +
      "</tr></thead><tbody>" +
      (rowsHtml || '<tr><td class="empty" colspan="' + headers.length + '">Kayıt yok.</td></tr>') +
      "</tbody></table></div>"
    );
  }

  function actions(id) {
    return (
      '<div class="row-actions">' +
        '<button class="btn btn-ghost" type="button" data-edit="' + id + '">Düzenle</button>' +
        '<button class="btn btn-danger" type="button" data-del="' + id + '">Sil</button>' +
      "</div>"
    );
  }

  function panel(title, extra, body) {
    return (
      '<article class="panel">' +
        '<div class="panel__head"><h2>' + title + "</h2>" + extra + "</div>" +
        body +
      "</article>"
    );
  }

  function field(label, name, value, type, full) {
    var cls = full ? ' class="full"' : "";
    if (type === "textarea") {
      return "<label" + cls + ">" + label + '<textarea name="' + name + '">' + escapeHtml(value) + "</textarea></label>";
    }
    if (type === "select") {
      return (
        "<label" + cls + ">" + label +
        '<select name="' + name + '">' +
          '<option value="yayinda"' + (value === "yayinda" ? " selected" : "") + ">Yayında</option>" +
          '<option value="taslak"' + (value === "taslak" ? " selected" : "") + ">Taslak</option>" +
        "</select></label>"
      );
    }
    return "<label" + cls + ">" + label + '<input type="' + (type || "text") + '" name="' + name + '" value="' + escapeHtml(value) + '"></label>';
  }

  function renderForm(fieldsHtml, id) {
    return (
      '<form class="editor" data-id="' + escapeHtml(id || "") + '">' +
        '<div class="form-grid">' + fieldsHtml + "</div>" +
        '<div class="form-actions">' +
          '<button class="btn btn-ghost" type="button" data-cancel>Vazgeç</button>' +
          '<button class="btn btn-primary" type="submit">Kaydet</button>' +
        "</div>" +
      "</form>"
    );
  }

  var view = "";
  var editing = null;

  function setView(name) {
    view = name;
    editing = null;
    document.querySelectorAll(".nav-link").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-view") === name);
    });
    var meta = titles[name] || ["Panel", ""];
    var title = document.getElementById("page-title");
    var desc = document.getElementById("page-desc");
    if (title) title.textContent = meta[0];
    if (desc) desc.textContent = meta[1];
    render();
  }

  function rowsFrom(items, mapFn) {
    if (!items.length) return "";
    return items.map(mapFn).join("");
  }

  function renderDashboard() {
    var data = GrosperStore.read();
    return (
      '<div class="stat-grid">' +
        '<article class="stat"><span>Slider</span><strong>' + data.sliders.length + "</strong></article>" +
        '<article class="stat"><span>Blok banner</span><strong>' + data.banners.length + "</strong></article>" +
        '<article class="stat"><span>Haber</span><strong>' + data.news.length + "</strong></article>" +
        '<article class="stat"><span>Yeni başvuru</span><strong>' + data.jobs.filter(function (j) { return j.status === "yeni"; }).length + "</strong></article>" +
      "</div>" +
      panel("Son haberler", "", table(["Tarih", "Başlık", "Durum"], rowsFrom(data.news.slice(0, 4), function (item) {
        return "<tr><td>" + escapeHtml(item.date) + "</td><td>" + escapeHtml(item.title) + "</td><td>" + statusBadge(item.status) + "</td></tr>";
      })))
    );
  }

  function addButton() {
    return '<button class="btn btn-primary" type="button" data-add>Yeni Ekle</button>';
  }

  function renderSliders() {
    if (editing === "new" || (editing && editing.id)) {
      var item = editing === "new" ? { title: "", text: "", image: "", link: "#kategoriler", status: "yayinda" } : editing;
      var image = item.image || "";
      return panel("Slider düzenle", "", (
        '<form class="editor" data-id="' + escapeHtml(item.id || "") + '">' +
          '<div class="form-grid">' +
            field("Başlık", "title", item.title) +
            field("Durum", "status", item.status || "yayinda", "select") +
            field("Tıklanınca gidilecek link", "link", item.link || "#kategoriler", "text", true) +
            field("Kısa açıklama", "text", item.text || "", "text", true) +
            '<div class="full upload-field">' +
              "<strong>Slider görseli</strong>" +
              '<p class="upload-hint">Dosya seçerek slayt görselini değiştirin. Kayıt sonrası ana sayfada görünür.</p>' +
              (image ? '<img class="upload-preview" src="' + escapeHtml(image) + '" alt="">' : "") +
              '<div class="file-row">' +
                '<label class="file-btn">Dosya Seç<input type="file" accept="image/*" data-file="image" hidden></label>' +
                '<span class="file-name" data-filename="image">' + escapeHtml(fileName(image)) + "</span>" +
              "</div>" +
              '<input type="hidden" name="image" value="' + escapeHtml(image) + '">' +
            "</div>" +
          "</div>" +
          '<div class="form-actions">' +
            '<button class="btn btn-ghost" type="button" data-cancel>Vazgeç</button>' +
            '<button class="btn btn-primary" type="submit">Kaydet</button>' +
          "</div>" +
        "</form>"
      ));
    }
    return panel("Slider listesi", addButton(), table(["Görsel", "Başlık", "Link", "Durum", ""], rowsFrom(GrosperStore.list("sliders"), function (item) {
      return "<tr><td><img class='thumb' src='" + escapeHtml(item.image) + "' alt=''></td><td>" + escapeHtml(item.title) + "</td><td>" + escapeHtml(item.link || "") + "</td><td>" + statusBadge(item.status) + "</td><td>" + actions(item.id) + "</td></tr>";
    })));
  }

  function fileName(src) {
    if (!src) return "Dosya seçilmedi";
    if (src.indexOf("data:") === 0) return "Yeni görsel seçildi";
    return src.split("/").pop();
  }

  function renderBanners() {
    if (editing === "new" || (editing && editing.id)) {
      var item = editing === "new" ? { title: "", image: "", link: "#kategoriler", status: "yayinda" } : editing;
      var image = item.image || item.desktopImage || "";
      return panel("Banner düzenle", "", (
        '<form class="editor" data-id="' + escapeHtml(item.id || "") + '">' +
          '<div class="form-grid">' +
            field("Başlık", "title", item.title) +
            field("Durum", "status", item.status || "yayinda", "select") +
            field("Tıklanınca gidilecek link", "link", item.link || "#kategoriler", "text", true) +
            '<div class="full upload-field">' +
              "<strong>Banner görseli</strong>" +
              '<p class="upload-hint">Dosya seçerek görseli değiştirin. Kayıt sonrası ana sayfada görünür.</p>' +
              (image ? '<img class="upload-preview" src="' + escapeHtml(image) + '" alt="">' : "") +
              '<div class="file-row">' +
                '<label class="file-btn">Dosya Seç<input type="file" accept="image/*" data-file="image" hidden></label>' +
                '<span class="file-name" data-filename="image">' + escapeHtml(fileName(image)) + "</span>" +
              "</div>" +
              '<input type="hidden" name="image" value="' + escapeHtml(image) + '">' +
            "</div>" +
          "</div>" +
          '<div class="form-actions">' +
            '<button class="btn btn-ghost" type="button" data-cancel>Vazgeç</button>' +
            '<button class="btn btn-primary" type="submit">Kaydet</button>' +
          "</div>" +
        "</form>"
      ));
    }
    return panel("Blok bannerlar", addButton(), table(["Görsel", "Başlık", "Link", "Durum", ""], rowsFrom(GrosperStore.list("banners"), function (item) {
      var img = item.image || item.desktopImage || "";
      return "<tr><td><img class='thumb' src='" + escapeHtml(img) + "' alt=''></td><td>" + escapeHtml(item.title) + "</td><td>" + escapeHtml(item.link || "") + "</td><td>" + statusBadge(item.status) + "</td><td>" + actions(item.id) + "</td></tr>";
    })));
  }

  function renderNews() {
    if (editing === "new" || (editing && editing.id)) {
      var item = editing === "new" ? { title: "", summary: "", body: "", date: "", image: "", status: "yayinda" } : editing;
      var image = item.image || "";
      return panel("Haber düzenle", "", (
        '<form class="editor" data-id="' + escapeHtml(item.id || "") + '">' +
          '<div class="form-grid">' +
            field("Başlık", "title", item.title) +
            field("Tarih", "date", item.date, "date") +
            field("Durum", "status", item.status || "yayinda", "select") +
            field("Özet", "summary", item.summary || "", "textarea", true) +
            field("Haber metni", "body", item.body || "", "textarea", true) +
            '<div class="full upload-field">' +
              "<strong>Haber görseli</strong>" +
              '<p class="upload-hint">Dosya seçerek haber görselini değiştirin. Kayıt sonrası Haberler sayfasında görünür.</p>' +
              (image ? '<img class="upload-preview" src="' + escapeHtml(image) + '" alt="">' : "") +
              '<div class="file-row">' +
                '<label class="file-btn">Dosya Seç<input type="file" accept="image/*" data-file="image" hidden></label>' +
                '<span class="file-name" data-filename="image">' + escapeHtml(fileName(image)) + "</span>" +
              "</div>" +
              '<input type="hidden" name="image" value="' + escapeHtml(image) + '">' +
            "</div>" +
          "</div>" +
          '<div class="form-actions">' +
            '<button class="btn btn-ghost" type="button" data-cancel>Vazgeç</button>' +
            '<button class="btn btn-primary" type="submit">Kaydet</button>' +
          "</div>" +
        "</form>"
      ));
    }
    return panel("Haber listesi", addButton(), table(["Görsel", "Başlık", "Tarih", "Durum", ""], rowsFrom(GrosperStore.list("news"), function (item) {
      return "<tr><td><img class='thumb' src='" + escapeHtml(item.image) + "' alt=''></td><td>" + escapeHtml(item.title) + "</td><td>" + escapeHtml(item.date) + "</td><td>" + statusBadge(item.status) + "</td><td>" + actions(item.id) + "</td></tr>";
    })));
  }

  function renderGallery() {
    if (editing === "new" || (editing && editing.id)) {
      var item = editing === "new" ? { title: "", image: "" } : editing;
      var image = item.image || "";
      return panel("Kategori düzenle", "", (
        '<form class="editor" data-id="' + escapeHtml(item.id || "") + '">' +
          '<div class="form-grid">' +
            field("Başlık", "title", item.title, "text", true) +
            '<div class="full upload-field">' +
              "<strong>Kategori görseli</strong>" +
              '<p class="upload-hint">Dosya seçerek görseli ekleyin veya değiştirin. Kayıt sonrası sitede görünür.</p>' +
              (image ? '<img class="upload-preview" src="' + escapeHtml(image) + '" alt="">' : "") +
              '<div class="file-row">' +
                '<label class="file-btn">Dosya Seç<input type="file" accept="image/*" data-file="image" hidden></label>' +
                '<span class="file-name" data-filename="image">' + escapeHtml(fileName(image)) + "</span>" +
              "</div>" +
              '<input type="hidden" name="image" value="' + escapeHtml(image) + '">' +
            "</div>" +
          "</div>" +
          '<div class="form-actions">' +
            '<button class="btn btn-ghost" type="button" data-cancel>Vazgeç</button>' +
            '<button class="btn btn-primary" type="submit">Kaydet</button>' +
          "</div>" +
        "</form>"
      ));
    }
    return panel("Öne çıkan kategoriler", addButton(), table(["Görsel", "Başlık", ""], rowsFrom(GrosperStore.list("gallery"), function (item) {
      return "<tr><td><img class='thumb' src='" + escapeHtml(item.image) + "' alt=''></td><td>" + escapeHtml(item.title) + "</td><td>" + actions(item.id) + "</td></tr>";
    })));
  }

  function renderVideos() {
    if (editing === "new" || (editing && editing.id)) {
      var item = editing === "new" ? { title: "", url: "" } : editing;
      return panel("Video düzenle", "", renderForm(
        field("Başlık", "title", item.title) +
        field("YouTube embed linki", "url", item.url, "text", true),
        item.id
      ));
    }
    return panel("Videolar", addButton(), table(["Başlık", "Link", ""], rowsFrom(GrosperStore.list("videos"), function (item) {
      return "<tr><td>" + escapeHtml(item.title) + "</td><td>" + escapeHtml(item.url) + "</td><td>" + actions(item.id) + "</td></tr>";
    })));
  }

  function renderBranches() {
    if (editing === "new" || (editing && editing.id)) {
      var item = editing === "new" ? { name: "", address: "", phone: "", hours: "" } : editing;
      return panel("Şube düzenle", "", renderForm(
        field("Şube adı", "name", item.name) +
        field("Telefon", "phone", item.phone) +
        field("Adres", "address", item.address, "text", true) +
        field("Çalışma saati", "hours", item.hours),
        item.id
      ));
    }
    return panel("Şubeler", addButton(), table(["Şube", "Adres", "Telefon", "Saat", ""], rowsFrom(GrosperStore.list("branches"), function (item) {
      return "<tr><td>" + escapeHtml(item.name) + "</td><td>" + escapeHtml(item.address) + "</td><td>" + escapeHtml(item.phone) + "</td><td>" + escapeHtml(item.hours) + "</td><td>" + actions(item.id) + "</td></tr>";
    })));
  }

  function renderReviews() {
    if (editing === "new" || (editing && editing.id)) {
      var item = editing === "new" ? { name: "", city: "", stars: 5, text: "", status: "yayinda" } : editing;
      return panel("Yorum düzenle", "", renderForm(
        field("Ad", "name", item.name) +
        field("İlçe", "city", item.city) +
        field("Puan", "stars", item.stars, "number") +
        field("Durum", "status", item.status, "select") +
        field("Yorum", "text", item.text, "textarea", true),
        item.id
      ));
    }
    return panel("Yorumlar", addButton(), table(["Müşteri", "Puan", "Yorum", "Durum", ""], rowsFrom(GrosperStore.list("reviews"), function (item) {
      return "<tr><td>" + escapeHtml(item.name) + " — " + escapeHtml(item.city) + "</td><td>" + escapeHtml(item.stars) + "</td><td>" + escapeHtml(item.text) + "</td><td>" + statusBadge(item.status) + "</td><td>" + actions(item.id) + "</td></tr>";
    })));
  }

  function renderJobs() {
    if (editing && editing.id) {
      return panel("Başvuru", "", renderForm(
        field("Ad Soyad", "name", editing.name) +
        field("Pozisyon", "role", editing.role) +
        field("E-posta", "email", editing.email) +
        field("Telefon", "phone", editing.phone) +
        field("Not", "note", editing.note, "textarea", true) +
        "<label>Durum<select name='status'>" +
          "<option value='yeni'" + (editing.status === "yeni" ? " selected" : "") + ">Yeni</option>" +
          "<option value='incelendi'" + (editing.status === "incelendi" ? " selected" : "") + ">İncelendi</option>" +
        "</select></label>",
        editing.id
      ));
    }
    return panel("İş başvuruları", "", table(["Ad", "Pozisyon", "Tarih", "Durum", ""], rowsFrom(GrosperStore.list("jobs"), function (item) {
      return "<tr><td>" + escapeHtml(item.name) + "</td><td>" + escapeHtml(item.role) + "</td><td>" + escapeHtml(item.date) + "</td><td>" + statusBadge(item.status) + "</td><td>" + actions(item.id) + "</td></tr>";
    })));
  }

  function renderSubscribers() {
    if (editing === "new" || (editing && editing.id)) {
      var item = editing === "new" ? { name: "", email: "", date: new Date().toISOString().slice(0, 10) } : editing;
      return panel("Kayıt düzenle", "", renderForm(
        field("Ad", "name", item.name) +
        field("E-posta", "email", item.email, "email") +
        field("Tarih", "date", item.date, "date"),
        item.id
      ));
    }
    return panel("Bülten kayıtları", addButton(), table(["Ad", "E-posta", "Tarih", ""], rowsFrom(GrosperStore.list("subscribers"), function (item) {
      return "<tr><td>" + escapeHtml(item.name) + "</td><td>" + escapeHtml(item.email) + "</td><td>" + escapeHtml(item.date) + "</td><td>" + actions(item.id) + "</td></tr>";
    })));
  }

  function renderUsers() {
    if (editing === "new" || (editing && editing.id)) {
      var item = editing === "new" ? { name: "", email: "", role: "Müşteri" } : editing;
      return panel("Kullanıcı düzenle", "", renderForm(
        field("Ad Soyad", "name", item.name) +
        field("E-posta", "email", item.email, "email") +
        field("Rol", "role", item.role),
        item.id
      ));
    }
    return panel("Kullanıcılar", addButton(), table(["Ad", "E-posta", "Rol", ""], rowsFrom(GrosperStore.list("users"), function (item) {
      return "<tr><td>" + escapeHtml(item.name) + "</td><td>" + escapeHtml(item.email) + "</td><td>" + escapeHtml(item.role) + "</td><td>" + actions(item.id) + "</td></tr>";
    })));
  }

  function renderOrders() {
    if (editing === "new" || (editing && editing.id)) {
      var item = editing === "new" ? { no: "", customer: "", total: "", status: "bekliyor" } : editing;
      return panel("Sipariş düzenle", "", renderForm(
        field("Sipariş no", "no", item.no) +
        field("Müşteri", "customer", item.customer) +
        field("Tutar", "total", item.total) +
        field("Durum", "status", item.status),
        item.id
      ));
    }
    return panel("Siparişler", addButton(), table(["No", "Müşteri", "Tutar", "Durum", ""], rowsFrom(GrosperStore.list("orders"), function (item) {
      return "<tr><td>" + escapeHtml(item.no) + "</td><td>" + escapeHtml(item.customer) + "</td><td>" + escapeHtml(item.total) + "</td><td>" + escapeHtml(item.status) + "</td><td>" + actions(item.id) + "</td></tr>";
    })));
  }

  function renderProducts() {
    if (editing === "new" || (editing && editing.id)) {
      var item = editing === "new" ? { title: "", price: "", status: "yayinda" } : editing;
      return panel("Ürün düzenle", "", renderForm(
        field("Ürün adı", "title", item.title) +
        field("Fiyat", "price", item.price) +
        field("Durum", "status", item.status, "select"),
        item.id
      ));
    }
    return panel("Süper Fırsat ürünleri", addButton(), table(["Ürün", "Fiyat", "Durum", ""], rowsFrom(GrosperStore.list("products"), function (item) {
      return "<tr><td>" + escapeHtml(item.title) + "</td><td>" + escapeHtml(item.price) + "</td><td>" + statusBadge(item.status) + "</td><td>" + actions(item.id) + "</td></tr>";
    })));
  }

  function renderPages() {
    if (editing === "new" || (editing && editing.id)) {
      var item = editing === "new" ? { title: "", slug: "" } : editing;
      return panel("Sayfa düzenle", "", renderForm(
        field("Sayfa adı", "title", item.title) +
        field("Bağlantı", "slug", item.slug),
        item.id
      ));
    }
    return panel("Sayfalar", addButton(), table(["Sayfa", "Bağlantı", ""], rowsFrom(GrosperStore.list("pages"), function (item) {
      return "<tr><td>" + escapeHtml(item.title) + "</td><td>" + escapeHtml(item.slug) + "</td><td>" + actions(item.id) + "</td></tr>";
    })));
  }

  function renderMenu() {
    if (editing === "new" || (editing && editing.id)) {
      var item = editing === "new" ? { label: "", url: "" } : editing;
      return panel("Menü düzenle", "", renderForm(
        field("Menü adı", "label", item.label) +
        field("Link", "url", item.url, "text", true),
        item.id
      ));
    }
    return panel("Menü / Linkler", addButton(), table(["Ad", "Link", ""], rowsFrom(GrosperStore.list("menu"), function (item) {
      return "<tr><td>" + escapeHtml(item.label) + "</td><td>" + escapeHtml(item.url) + "</td><td>" + actions(item.id) + "</td></tr>";
    })));
  }

  function renderSettings() {
    var s = GrosperStore.getSettings();
    return panel("İletişim ayarları", "", renderForm(
      field("Telefon", "phone", s.phone) +
      field("E-posta", "email", s.email) +
      field("Adres", "address", s.address, "textarea", true) +
      '<label class="full"><button class="btn btn-danger" type="button" data-reset>Verileri sıfırları</button></label>'
    ));
  }

  function render() {
    var root = document.getElementById("view");
    if (!root) return;
    var html = "";
    switch (view) {
      case "dashboard":
        html = renderDashboard();
        break;
      case "sliders":
        html = renderSliders();
        break;
      case "banners":
        html = renderBanners();
        break;
      case "news":
        html = renderNews();
        break;
      case "gallery":
        html = renderGallery();
        break;
      case "videos":
        html = renderVideos();
        break;
      case "branches":
        html = renderBranches();
        break;
      case "reviews":
        html = renderReviews();
        break;
      case "jobs":
        html = renderJobs();
        break;
      case "subscribers":
        html = renderSubscribers();
        break;
      case "settings":
        html = renderSettings();
        break;
      case "users":
        html = renderUsers();
        break;
      case "orders":
        html = renderOrders();
        break;
      case "products":
        html = renderProducts();
        break;
      case "pages":
        html = renderPages();
        break;
      case "menu":
        html = renderMenu();
        break;
      default:
        html = renderDashboard();
        break;
    }
    root.innerHTML = html;
    bindUploads(root);
  }

  function bindUploads(root) {
    root.querySelectorAll("[data-file]").forEach(function (input) {
      input.addEventListener("change", function () {
        var file = input.files && input.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
          var name = input.getAttribute("data-file");
          var hidden = root.querySelector('input[name="' + name + '"]');
          var label = root.querySelector('[data-filename="' + name + '"]');
          var box = input.closest(".upload-field");
          if (hidden) hidden.value = reader.result;
          if (label) label.textContent = file.name;
          if (box) {
            var preview = box.querySelector(".upload-preview");
            if (!preview) {
              preview = document.createElement("img");
              preview.className = "upload-preview";
              preview.alt = "";
              box.insertBefore(preview, box.querySelector(".file-row"));
            }
            preview.src = reader.result;
          }
        };
        reader.readAsDataURL(file);
      });
    });
  }

  function collectionFor(name) {
    switch (name) {
      case "sliders":
      case "banners":
      case "news":
      case "gallery":
      case "videos":
      case "branches":
      case "reviews":
      case "jobs":
      case "subscribers":
      case "users":
      case "orders":
      case "products":
      case "pages":
      case "menu":
        return name;
      default:
        return "";
    }
  }

  function findItem(name, id) {
    return GrosperStore.list(name).find(function (item) {
      return item.id === id;
    }) || null;
  }

  function formToItem(form, existing) {
    var item = existing ? Object.assign({}, existing) : {};
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.type === "file") return;
      if (el.type === "checkbox") {
        item[el.name] = el.checked;
        return;
      }
      item[el.name] = el.type === "number" ? Number(el.value) : el.value;
    });
    return item;
  }

  function bindPanel() {
    if (!isAuthed()) {
      window.location.href = "index.html";
      return;
    }

    document.querySelector(".admin").addEventListener("click", function (event) {
      var nav = event.target.closest("[data-view]");
      if (nav && !event.target.closest(".editor")) {
        setView(nav.getAttribute("data-view"));
      }
    });

    var logout = document.getElementById("logout-btn");
    if (logout) {
      logout.addEventListener("click", function () {
        window.sessionStorage.removeItem(AUTH_KEY);
        window.location.href = "index.html";
      });
    }

    var root = document.getElementById("view");
    root.addEventListener("click", function (event) {
      var add = event.target.closest("[data-add]");
      var addUser = event.target.closest("[data-add-user]");
      var edit = event.target.closest("[data-edit]");
      var del = event.target.closest("[data-del]");
      var cancel = event.target.closest("[data-cancel]");
      var reset = event.target.closest("[data-reset]");
      var col = collectionFor(view);

      if (addUser) {
        setView("users");
        editing = "new";
        render();
        return;
      }

      if (add) {
        editing = "new";
        render();
        return;
      }
      if (edit && col) {
        editing = findItem(col, edit.getAttribute("data-edit"));
        render();
        return;
      }
      if (del && col) {
        GrosperStore.remove(col, del.getAttribute("data-del"));
        toast("Kayıt silindi");
        editing = null;
        render();
        return;
      }
      if (cancel) {
        editing = null;
        render();
        return;
      }
      if (reset) {
        GrosperStore.reset();
        toast("Tüm veriler varsayılana döndü");
        render();
      }
    });

    root.addEventListener("submit", function (event) {
      var form = event.target.closest(".editor");
      if (!form) return;
      event.preventDefault();
      if (view === "settings") {
        GrosperStore.saveSettings(formToItem(form, GrosperStore.getSettings()));
        toast("Ayarlar kaydedildi");
        return;
      }
      var col = collectionFor(view);
      if (!col) return;
      var current = form.getAttribute("data-id") ? findItem(col, form.getAttribute("data-id")) : null;
      var isNew = !current;
      GrosperStore.upsert(col, formToItem(form, current));
      if (isNew && col === "users") GrosperStore.bumpStat("users", 1);
      if (isNew && col === "products") GrosperStore.bumpStat("products", 1);
      if (isNew && col === "orders") GrosperStore.bumpStat("orders", 1);
      toast("Kayıt kaydedildi");
      editing = null;
      render();
    });

    setView("dashboard");
  }

  bindLogin();
  if (document.getElementById("view")) bindPanel();
})();
