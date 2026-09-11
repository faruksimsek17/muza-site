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
    subscribers: ["Bülten Kayıtları", "İndirim bülteni e-posta kayıtları"],
    catalogs: ["İndirim Bülteni", "PDF broşür ve katalog kapakları"],
    colors: ["Site renkleri", "Mağaza temasındaki ana renkleri buradan değiştirin. Değişiklik tüm sayfalara yansır."],
    brand: ["Marka ve site ayarları", "Header, footer, favicon ve paylaşım görsellerini buradan değiştirin."],
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
        '<article class="stat"><span>Katalog</span><strong>' + (data.catalogs || []).length + "</strong></article>" +
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

  var MAX_PDF_BYTES = 20 * 1024 * 1024;
  var MAX_BRAND_BYTES = 5 * 1024 * 1024;

  function fileName(src, fallbackLabel) {
    if (!src) return "Dosya seçilmedi";
    if (src === "pending" || src.indexOf("idb:") === 0 || src.indexOf("data:application/pdf") === 0) return fallbackLabel || "PDF seçildi";
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

  function lightRef(src) {
    if (!src || src.indexOf("data:") === 0 || src === "pending") return "";
    return src;
  }

  function fillIdbMedia(root) {
    if (!root || !window.GrosperFiles) return;
    root.querySelectorAll("[data-idb]").forEach(function (img) {
      GrosperFiles.get(img.getAttribute("data-idb")).then(function (blob) {
        if (blob) img.src = URL.createObjectURL(blob);
      });
    });
  }

  function renderCatalogs() {
    if (editing === "new" || (editing && editing.id)) {
      var item = editing === "new" ? { title: "", summary: "", image: "", pdf: "", pdfName: "", status: "yayinda" } : editing;
      var image = lightRef(item.image);
      var pdf = lightRef(item.pdf);
      var pdfLabel = item.pdfName || fileName(pdf, "PDF seçildi");
      var imagePreview = "";
      if (item.image && item.image.indexOf("idb:") === 0) {
        imagePreview = '<img class="upload-preview" alt="" data-idb="' + escapeHtml(item.image.slice(4)) + '">';
      } else if (image) {
        imagePreview = '<img class="upload-preview" src="' + escapeHtml(image) + '" alt="">';
      }
      return panel("Katalog düzenle", "", (
        '<form class="editor" data-id="' + escapeHtml(item.id || "") + '">' +
          '<div class="form-grid">' +
            field("Başlık", "title", item.title) +
            field("Durum", "status", item.status || "yayinda", "select") +
            field("Kısa açıklama", "summary", item.summary || "", "textarea", true) +
            '<div class="full upload-field">' +
              "<strong>Kapak görseli</strong>" +
              '<p class="upload-hint">Katalog kartında görünecek kapak fotoğrafını yükleyin.</p>' +
              imagePreview +
              '<div class="file-row">' +
                '<label class="file-btn">Dosya Seç<input type="file" accept="image/*" data-file="image" hidden></label>' +
                '<span class="file-name" data-filename="image">' + escapeHtml(fileName(image) === "Dosya seçilmedi" && item.image ? "Kapak seçildi" : fileName(image)) + "</span>" +
              "</div>" +
              '<input type="hidden" name="image" value="' + escapeHtml(image) + '">' +
            "</div>" +
            '<div class="full upload-field">' +
              "<strong>Katalog PDF</strong>" +
              '<p class="upload-hint">Online Katalog butonu bu PDF’i yeni sekmede açar. En fazla 20 MB. Daha büyük dosyalar yüklenmez.</p>' +
              '<div class="file-row">' +
                '<label class="file-btn">PDF Seç<input type="file" accept="application/pdf,.pdf" data-file="pdf" hidden></label>' +
                '<span class="file-name" data-filename="pdf">' + escapeHtml(pdf || item.pdfName ? pdfLabel : "Dosya seçilmedi") + "</span>" +
              "</div>" +
              '<input type="hidden" name="pdf" value="' + escapeHtml(pdf) + '">' +
              '<input type="hidden" name="pdfName" value="' + escapeHtml(item.pdfName || "") + '">' +
            "</div>" +
          "</div>" +
          '<div class="form-actions">' +
            '<button class="btn btn-ghost" type="button" data-cancel>Vazgeç</button>' +
            '<button class="btn btn-primary" type="submit">Kaydet</button>' +
          "</div>" +
        "</form>"
      ));
    }
    return panel("İndirim bülteni katalogları", addButton(), table(["Kapak", "Başlık", "PDF", "Durum", ""], rowsFrom(GrosperStore.list("catalogs"), function (item) {
      var thumb = lightRef(item.image);
      var thumbTag = item.image && item.image.indexOf("idb:") === 0
        ? "<img class='thumb' alt='' data-idb='" + escapeHtml(item.image.slice(4)) + "'>"
        : "<img class='thumb' src='" + escapeHtml(thumb) + "' alt=''>";
      return "<tr><td>" + thumbTag + "</td><td>" + escapeHtml(item.title) + "</td><td>" + escapeHtml(item.pdfName || (item.pdf ? "PDF yüklü" : "PDF yok")) + "</td><td>" + statusBadge(item.status) + "</td><td>" + actions(item.id) + "</td></tr>";
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

  function colorField(label, name, value) {
    var hex = escapeHtml(value);
    return (
      '<div class="color-field">' +
        "<span>" + label + "</span>" +
        '<div class="color-field__row">' +
          '<button class="color-field__swatch" type="button" data-open-color="' + name + '" aria-label="' + escapeHtml(label) + '">' +
            '<span class="color-field__chip" data-chip="' + name + '" style="background:' + hex + '"></span>' +
          "</button>" +
          '<input class="color-field__hex" type="text" name="' + name + '" value="' + hex + '" maxlength="7" spellcheck="false" autocomplete="off">' +
          '<input class="color-field__picker" type="color" data-sync="' + name + '" value="' + hex + '" tabindex="-1" aria-hidden="true">' +
        "</div>" +
      "</div>"
    );
  }

  function renderColors() {
    var t = window.GrosperStore && GrosperStore.getTheme ? GrosperStore.getTheme() : (window.GrosperTheme ? GrosperTheme.read() : {});
    return (
      '<article class="theme-card">' +
        '<form class="editor theme-form" data-theme-form novalidate>' +
          '<div class="theme-preview">' +
            '<div class="theme-preview__bar">Genel</div>' +
            '<div class="theme-preview__sample" data-preview="general">' +
              '<span class="theme-chip" data-preview-primary>Ana buton</span>' +
              '<span class="theme-chip" data-preview-hover>Hover / koyu</span>' +
              '<span class="theme-muted" data-preview-muted>Soluk metin örneği</span>' +
            "</div>" +
          "</div>" +
          '<div class="color-grid">' +
            colorField("Ana renk (butonlar, linkler)", "primary", t.primary) +
            colorField("Ana renk koyu (hover)", "primaryDark", t.primaryDark) +
            colorField("Koyu (genel vurgu)", "ink", t.ink) +
            colorField("Açık zemin", "bg", t.bg) +
            colorField("Kenarlık", "border", t.border) +
            colorField("Soluk metin", "muted", t.muted) +
          "</div>" +
          '<div class="theme-section">' +
            "<h3>Üst bar (Müşteri Hizmetleri şeridi)</h3>" +
            '<div class="theme-banner" data-preview="header">' +
              "<span>İndirim Bülteni</span><span>Şubeler</span><strong>0216 517 28 05</strong>" +
            "</div>" +
            '<div class="color-grid color-grid--2">' +
              colorField("Üst bar arka plan rengi", "headerBg", t.headerBg) +
              colorField("Üst bar yazı rengi", "headerText", t.headerText) +
            "</div>" +
          "</div>" +
          '<div class="theme-section">' +
            "<h3>Footer (Kurumsal / Sözleşmeler alanı)</h3>" +
            '<div class="theme-banner" data-preview="footer">' +
              "<strong>grosper.com.tr</strong><span>Kurumsal</span><span>Sözleşmeler</span>" +
            "</div>" +
            '<div class="color-grid color-grid--2">' +
              colorField("Footer arka plan rengi", "footerBg", t.footerBg) +
              colorField("Footer yazı rengi", "footerText", t.footerText) +
            "</div>" +
          "</div>" +
          '<div class="theme-actions">' +
            '<button class="theme-save" type="submit">Renkleri kaydet</button>' +
            '<button class="theme-reset" type="button" data-reset-theme>Varsayılana dön</button>' +
          "</div>" +
        "</form>" +
      "</article>"
    );
  }

  function themeFromForm(form) {
    var theme = Object.assign({}, GrosperStore.getTheme());
    var defaults = window.GrosperTheme ? GrosperTheme.DEFAULTS : {};
    form.querySelectorAll("[data-sync]").forEach(function (picker) {
      var name = picker.getAttribute("data-sync");
      var text = form.querySelector('input[name="' + name + '"]');
      var stored = String(theme[name] || "").toLowerCase();
      var fromPicker = window.GrosperTheme ? GrosperTheme.normalizeHex(picker.value, "") : picker.value;
      var fromText = text && window.GrosperTheme ? GrosperTheme.normalizeHex(text.value, "") : (text ? text.value : "");
      if (fromPicker && fromPicker !== stored) theme[name] = fromPicker;
      else if (fromText && fromText !== stored) theme[name] = fromText;
      else theme[name] = fromText || fromPicker || defaults[name] || theme[name];
    });
    return theme;
  }

  function paintThemePreview(root) {
    if (!root) return;
    var form = root.querySelector("[data-theme-form]");
    if (!form) return;
    var val = function (name) {
      var el = form.querySelector('input[name="' + name + '"]');
      return el ? el.value : "";
    };
    var general = root.querySelector('[data-preview="general"]');
    var head = root.querySelector(".theme-preview__bar");
    var header = root.querySelector('[data-preview="header"]');
    var footer = root.querySelector('[data-preview="footer"]');
    var primary = root.querySelector("[data-preview-primary]");
    var hover = root.querySelector("[data-preview-hover]");
    var muted = root.querySelector("[data-preview-muted]");
    if (general) general.style.background = val("bg");
    if (head) head.style.background = val("ink");
    if (primary) {
      primary.style.background = val("primary");
      primary.style.color = "#fff";
    }
    if (hover) {
      hover.style.background = val("primaryDark");
      hover.style.color = "#fff";
    }
    if (muted) muted.style.color = val("muted");
    if (header) {
      header.style.background = val("headerBg");
      header.style.color = val("headerText");
    }
    if (footer) {
      footer.style.background = val("footerBg");
      footer.style.color = val("footerText");
    }
    form.querySelectorAll("[data-chip]").forEach(function (chip) {
      var color = val(chip.getAttribute("data-chip"));
      if (color) chip.style.background = color;
    });
  }

  function bindThemeEditor(root) {
    var form = root.querySelector("[data-theme-form]");
    if (!form) return;

    function setFieldColor(name, value) {
      var hex = window.GrosperTheme ? GrosperTheme.normalizeHex(value, "") : value;
      if (!hex) return "";
      var picker = form.querySelector('[data-sync="' + name + '"]');
      var text = form.querySelector('input[name="' + name + '"]');
      var chip = form.querySelector('[data-chip="' + name + '"]');
      if (picker) picker.value = hex;
      if (text) text.value = hex;
      if (chip) chip.style.background = hex;
      return hex;
    }

    function paint() {
      paintThemePreview(root);
    }

    form.querySelectorAll("[data-sync]").forEach(function (picker) {
      var name = picker.getAttribute("data-sync");
      var text = form.querySelector('input[name="' + name + '"]');
      function fromPicker() {
        setFieldColor(name, picker.value);
        if (name === "primary") setFieldColor("headerBg", picker.value);
        paint();
      }
      picker.addEventListener("input", fromPicker);
      picker.addEventListener("change", fromPicker);
      if (text) {
        function fromText() {
          var hex = setFieldColor(name, text.value);
          if (hex && name === "primary") setFieldColor("headerBg", hex);
          paint();
        }
        text.addEventListener("input", fromText);
        text.addEventListener("change", fromText);
      }
    });

    form.querySelectorAll("[data-open-color]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var picker = form.querySelector('[data-sync="' + btn.getAttribute("data-open-color") + '"]');
        if (!picker) return;
        if (typeof picker.showPicker === "function") {
          try {
            picker.showPicker();
            return;
          } catch (error) {}
        }
        picker.style.pointerEvents = "auto";
        picker.click();
        picker.style.pointerEvents = "none";
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var theme = themeFromForm(form);
      GrosperStore.saveTheme(theme);
      if (window.GrosperTheme) {
        GrosperTheme.write(theme);
        GrosperTheme.apply(theme);
      }
      toast("Renkler kaydedildi");
      render();
    });

    paint();
  }

  function brandPreview(src, extraClass) {
    var cls = "brand-preview" + (extraClass ? " " + extraClass : "");
    if (src && src.indexOf("idb:") === 0) {
      return '<div class="' + cls + '"><img alt="" data-idb="' + escapeHtml(src.slice(4)) + '"></div>';
    }
    if (!src) return '<div class="' + cls + '"></div>';
    var url = src.indexOf("images/") === 0 ? "../" + src : src;
    return '<div class="' + cls + '"><img src="' + escapeHtml(url) + '" alt=""></div>';
  }

  function brandFileField(name, accept) {
    return (
      '<div class="file-row">' +
        '<label class="file-btn">Dosya Seç<input type="file" accept="' + accept + '" data-file="' + name + '" hidden></label>' +
        '<span class="file-name" data-filename="' + name + '">Dosya seçilmedi</span>' +
      "</div>" +
      '<input type="hidden" name="' + name + '" value="">'
    );
  }

  function renderBrand() {
    var b = GrosperStore.getBrand ? GrosperStore.getBrand() : {};
    return (
      '<article class="brand-card">' +
        '<form class="editor brand-form" data-brand-form novalidate>' +
          '<div class="brand-grid">' +
            '<div class="brand-field">' +
              "<span>Üst logo (header)</span>" +
              brandPreview(b.headerLogo || "images/logo.png", "brand-preview--header") +
              brandFileField("headerLogo", "image/*") +
              '<p class="upload-hint">PNG veya WEBP, şeffaf zemin önerilir.</p>' +
            "</div>" +
            '<div class="brand-field">' +
              "<span>Footer logo</span>" +
              brandPreview(b.hideFooterLogo ? "" : b.footerLogo, "brand-preview--footer") +
              '<label class="check-row brand-check"><input type="checkbox" name="hideFooterLogo"' + (b.hideFooterLogo ? " checked" : "") + "> Footer logoyu kaldır</label>" +
              brandFileField("footerLogo", "image/*") +
              '<p class="upload-hint">Footer için ayrı logo. Koyu zeminde görünsün; açık renkli / beyaz logo önerilir.</p>' +
            "</div>" +
            '<div class="brand-field">' +
              "<span>Tarayıcı ikonu (favicon)</span>" +
              brandPreview(b.favicon || b.headerLogo || "images/logo.png", "brand-preview--icon") +
              brandFileField("favicon", "image/png,image/x-icon,image/webp,image/jpeg,.png,.ico,.webp,.jpg") +
              '<p class="upload-hint">32×32 veya 64×64 ICO/PNG önerilir.</p>' +
            "</div>" +
            '<div class="brand-field">' +
              "<span>Sosyal paylaşım görseli (Open Graph)</span>" +
              (b.ogImage ? brandPreview(b.ogImage, "brand-preview--og") : "") +
              brandFileField("ogImage", "image/*") +
              '<p class="upload-hint">Paylaşım kartlarında kullanılır. Yoksa logo kullanılır.</p>' +
            "</div>" +
          "</div>" +
          '<div class="brand-actions">' +
            '<button class="theme-save" type="submit">Ayarları kaydet</button>' +
          "</div>" +
        "</form>" +
      "</article>"
    );
  }

  function saveBrandAssets(form) {
    var current = GrosperStore.getBrand ? GrosperStore.getBrand() : {};
    var item = {
      headerLogo: current.headerLogo || "images/logo.png",
      footerLogo: current.footerLogo || "",
      favicon: current.favicon || "",
      ogImage: current.ogImage || "",
      hideFooterLogo: !!(form.querySelector('[name="hideFooterLogo"]') && form.querySelector('[name="hideFooterLogo"]').checked)
    };
    var names = ["headerLogo", "footerLogo", "favicon", "ogImage"];
    var tasks = [];
    names.forEach(function (name) {
      var input = form.querySelector('[data-file="' + name + '"]');
      var file = (form._brandFiles && form._brandFiles[name]) || (input && input.files && input.files[0]);
      if (file && window.GrosperFiles) {
        var key = "brand-" + name;
        tasks.push(GrosperFiles.put(key, file).then(function () {
          item[name] = "idb:" + key;
        }));
      }
    });

    function finish() {
      GrosperStore.saveBrand(item);
      applyAdminBrand(item);
      toast("Ayarlar kaydedildi");
      render();
    }

    if (!window.GrosperFiles && names.some(function (name) {
      return (form._brandFiles && form._brandFiles[name]) || (form.querySelector('[data-file="' + name + '"]') && form.querySelector('[data-file="' + name + '"]').files[0]);
    })) {
      toast("Dosya kaydedilemedi. Sayfayı yenileyip tekrar deneyin.");
      return;
    }

    Promise.all(tasks).then(finish).catch(function () {
      toast("Dosya kaydedilemedi. Sayfayı yenileyip tekrar deneyin.");
    });
  }

  function applyAdminBrand(brand) {
    brand = brand || (GrosperStore.getBrand ? GrosperStore.getBrand() : {});
    var img = document.querySelector(".sidebar__logo");
    if (!img || !brand.headerLogo) return;
    if (brand.headerLogo.indexOf("idb:") === 0 && window.GrosperFiles) {
      GrosperFiles.get(brand.headerLogo.slice(4)).then(function (blob) {
        if (blob) img.src = URL.createObjectURL(blob);
      });
      return;
    }
    img.src = brand.headerLogo.indexOf("images/") === 0 ? "../" + brand.headerLogo : brand.headerLogo;
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
      case "catalogs":
        html = renderCatalogs();
        break;
      case "colors":
        html = renderColors();
        break;
      case "brand":
        html = renderBrand();
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
    fillIdbMedia(root);
    bindThemeEditor(root);
    if (view === "brand") {
      applyAdminBrand();
      var hide = root.querySelector('[name="hideFooterLogo"]');
      var footerBox = root.querySelector(".brand-preview--footer");
      if (hide && footerBox) {
        function syncFooterPreview() {
          footerBox.style.opacity = hide.checked ? "0.28" : "1";
        }
        hide.addEventListener("change", syncFooterPreview);
        syncFooterPreview();
      }
    }
  }

  function bindUploads(root) {
    var catalogForm = !!root.querySelector('[data-file="pdf"]');
    var brandForm = !!root.querySelector("[data-brand-form]");
    root.querySelectorAll("[data-file]").forEach(function (input) {
      input.addEventListener("change", function () {
        var file = input.files && input.files[0];
        if (!file) return;
        var name = input.getAttribute("data-file");
        var isPdf = name === "pdf" || file.type === "application/pdf";
        var storeFile = isPdf || (catalogForm && name === "image") || brandForm;
        if (storeFile) {
          if (isPdf && file.size > MAX_PDF_BYTES) {
            toast("PDF 20 MB’den büyük olamaz");
            input.value = "";
            return;
          }
          if (brandForm && file.size > MAX_BRAND_BYTES) {
            toast("Görsel 5 MB’den büyük olamaz");
            input.value = "";
            return;
          }
          var hidden = root.querySelector('input[name="' + name + '"]');
          var label = root.querySelector('[data-filename="' + name + '"]');
          if (hidden) hidden.value = "pending";
          if (label) label.textContent = file.name;
          if (brandForm) {
            var brandFormEl = input.closest("form");
            if (brandFormEl) {
              brandFormEl._brandFiles = brandFormEl._brandFiles || {};
              brandFormEl._brandFiles[name] = file;
            }
          }
          if (isPdf) {
            var pdfName = root.querySelector('input[name="pdfName"]');
            if (pdfName) pdfName.value = file.name;
            return;
          }
          var box = input.closest(".brand-field") || input.closest(".upload-field");
          if (box) {
            var wrap = box.querySelector(".brand-preview");
            var preview = box.querySelector(".brand-preview img") || box.querySelector(".upload-preview");
            if (!preview && wrap) {
              preview = document.createElement("img");
              preview.alt = "";
              wrap.appendChild(preview);
            }
            if (!preview && !wrap) {
              preview = document.createElement("img");
              preview.className = "upload-preview";
              preview.alt = "";
              box.insertBefore(preview, box.querySelector(".file-row"));
            }
            if (preview) preview.src = URL.createObjectURL(file);
          }
          return;
        }
        var reader = new FileReader();
        reader.onload = function () {
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
      case "catalogs":
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

  function saveCatalog(form, current) {
    var item = formToItem(form, current);
    if (item.image === "pending" || (item.image && item.image.indexOf("data:") === 0)) {
      item.image = current && current.image && current.image.indexOf("data:") !== 0 ? current.image : "../images/katalog-kapak.jpg";
    }
    if (item.pdf === "pending" || (item.pdf && item.pdf.indexOf("data:") === 0)) {
      item.pdf = current && current.pdf && current.pdf.indexOf("data:") !== 0 ? current.pdf : "../files/katalog.pdf";
    }
    if (!item.id) item.id = GrosperStore.uid();
    var pdfInput = form.querySelector('[data-file="pdf"]');
    var imageInput = form.querySelector('[data-file="image"]');
    var pdfFile = pdfInput && pdfInput.files && pdfInput.files[0];
    var imageFile = imageInput && imageInput.files && imageInput.files[0];

    function finish() {
      GrosperStore.upsert("catalogs", item);
      toast("Kayıt kaydedildi");
      editing = null;
      render();
    }

    if (pdfFile && pdfFile.size > MAX_PDF_BYTES) {
      toast("PDF 20 MB’den büyük olamaz");
      return;
    }

    var tasks = [];
    if (imageFile && window.GrosperFiles) {
      var imageKey = "catalog-image-" + item.id;
      tasks.push(GrosperFiles.put(imageKey, imageFile).then(function () {
        item.image = "idb:" + imageKey;
      }));
    }
    if (pdfFile && window.GrosperFiles) {
      var pdfKey = "catalog-pdf-" + item.id;
      tasks.push(GrosperFiles.put(pdfKey, pdfFile).then(function () {
        item.pdf = "idb:" + pdfKey;
        item.pdfName = pdfFile.name;
      }));
    } else if (pdfFile) {
      toast("PDF kaydedilemedi.");
      return;
    }

    Promise.all(tasks).then(finish).catch(function () {
      toast("Dosya kaydedilemedi. Sayfayı yenileyip tekrar deneyin.");
    });
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
        var deleted = findItem(col, del.getAttribute("data-del"));
        if (col === "catalogs" && deleted && window.GrosperFiles) {
          if (deleted.pdf && deleted.pdf.indexOf("idb:") === 0) GrosperFiles.remove(deleted.pdf.slice(4));
          if (deleted.image && deleted.image.indexOf("idb:") === 0) GrosperFiles.remove(deleted.image.slice(4));
        }
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
        return;
      }
      var resetTheme = event.target.closest("[data-reset-theme]");
      if (resetTheme) {
        var defaults = window.GrosperTheme ? GrosperTheme.DEFAULTS : {};
        GrosperStore.saveTheme(defaults);
        if (window.GrosperTheme) {
          GrosperTheme.write(defaults);
          GrosperTheme.apply(defaults);
        }
        toast("Renkler varsayılana döndü");
        render();
        return;
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
      if (view === "brand") {
        saveBrandAssets(form);
        return;
      }
      if (view === "colors") {
        var theme = themeFromForm(form);
        GrosperStore.saveTheme(theme);
        if (window.GrosperTheme) {
          GrosperTheme.write(theme);
          GrosperTheme.apply(theme);
        }
        toast("Renkler kaydedildi");
        render();
        return;
      }
      var col = collectionFor(view);
      if (!col) return;
      var current = form.getAttribute("data-id") ? findItem(col, form.getAttribute("data-id")) : null;
      var isNew = !current;
      if (view === "catalogs") {
        saveCatalog(form, current);
        return;
      }
      try {
        GrosperStore.upsert(col, formToItem(form, current));
      } catch (error) {
        toast("Kayıt kaydedilemedi.");
        return;
      }
      if (isNew && col === "users") GrosperStore.bumpStat("users", 1);
      if (isNew && col === "products") GrosperStore.bumpStat("products", 1);
      if (isNew && col === "orders") GrosperStore.bumpStat("orders", 1);
      toast("Kayıt kaydedildi");
      editing = null;
      render();
    });

    var initial = (window.location.hash || "").replace("#", "");
    setView(titles[initial] ? initial : "dashboard");
    applyAdminBrand();
  }

  bindLogin();
  if (document.getElementById("view")) bindPanel();
})();
