(function (window) {
  var KEY = "grosper-cms-v1";
  var THEME_KEY = "grosper-theme-v1";
  var BRAND_KEY = "grosper-brand-v1";

  function uid() {
    return "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function seed() {
    return {
      sliders: [
        { id: uid(), title: "Yemek kartları", text: "Tüm alışverişlerinizde geçerli 0 komisyonlu yemek kartları.", image: "../images/slider-kartlar.jpg", link: "#kategoriler", status: "yayinda" },
        { id: uid(), title: "İndirim bülteni", text: "2–14 Eylül indirim bültenimiz yayında.", image: "../images/slider-bulten.jpg", link: "../sayfalar/bulten.html", status: "yayinda" },
        { id: uid(), title: "Taşdelen şube açılışı", text: "2–28 Eylül şube açılış indirimleri.", image: "../images/slider-sube.jpg", link: "../sayfalar/subeler.html", status: "yayinda" }
      ],
      banners: [
        { id: uid(), title: "Züccaciye fırsatları", image: "../images/banner-zuccaciye.webp", link: "../#kategoriler", status: "yayinda" },
        { id: uid(), title: "Diş bakımında %25", image: "../images/banner-disbakim.webp", link: "../#kategoriler", status: "yayinda" },
        { id: uid(), title: "Deepep Solution", image: "../images/banner-deepep.webp", link: "../#kategoriler", status: "yayinda" }
      ],
      news: [
        { id: uid(), date: "2026-09-08", title: "Yerli meyve haftası başladı", summary: "Eylül boyunca seçili meyvelerde yüzde 25’e varan indirim var.", body: "Grosper raflarına bu hafta yerli şeftali, üzüm ve elma geldi. Çiftçiden doğrudan alım sayesinde hem tazelik korunuyor hem fiyatlar düşüyor.", image: "../images/fruits.jpg", status: "yayinda" },
        { id: uid(), date: "2026-09-02", title: "Kartal şubesi yenilendi", summary: "Daha geniş reyonlar ve aynı gün teslimat kapasitesi artırıldı.", body: "Kartal Yakacık şubemiz yenilenen reyon düzeni ve soğuk zincir alanı ile yeniden açıldı.", image: "../images/woman.jpg", status: "yayinda" },
        { id: uid(), date: "2026-08-26", title: "Yaz içecekleri kampanyası", summary: "Maden suyu ve gazlı içeceklerde 4 al 3 öde fırsatı.", body: "Sıcak günler için rafları yeniledik. Seçili içeceklerde 4 al 3 öde kampanyası stoklarla sınırlıdır.", image: "../images/drinks.jpg", status: "yayinda" },
        { id: uid(), date: "2026-08-18", title: "Sabah fırın saati", summary: "Her sabah 08.00–10.00 arası taze ekmekte özel fiyat.", body: "Fırından çıkan ekmek, poğaça ve simit artık her sabah Grosper reyonlarında.", image: "../images/bread.jpg", status: "yayinda" }
      ],
      gallery: [
        { id: uid(), title: "Meyveler", image: "../images/fruits.jpg" },
        { id: uid(), title: "Sebzeler", image: "../images/vegetables.jpg" },
        { id: uid(), title: "Fırın", image: "../images/bread.jpg" },
        { id: uid(), title: "Et reyonu", image: "../images/meat.jpg" },
        { id: uid(), title: "İçecekler", image: "../images/drinks.jpg" },
        { id: uid(), title: "Atıştırmalık", image: "../images/chips.jpg" }
      ],
      videos: [
        { id: uid(), title: "Taze meyve sebze", url: "https://www.youtube.com/embed/lTRiuFIWV54" },
        { id: uid(), title: "Market alışverişi", url: "https://www.youtube.com/embed/3JZ_D3ELwOQ" }
      ],
      branches: [
        { id: uid(), name: "Kartal / Yakacık", address: "Yakacık Caddesi No:130/2", phone: "0216 517 28 05", hours: "08:00 – 22:00" },
        { id: uid(), name: "Kadıköy / Caferağa", address: "Moda Caddesi No:48", phone: "0216 330 11 22", hours: "08:00 – 23:00" },
        { id: uid(), name: "Maltepe / Bağlarbaşı", address: "Bağlarbaşı Mah. Atatürk Cad. No:17", phone: "0216 441 09 09", hours: "08:00 – 22:00" },
        { id: uid(), name: "Pendik / Çamçeşme", address: "Çamçeşme Mah. Deniz Cad. No:9", phone: "0216 491 70 70", hours: "08:00 – 22:00" }
      ],
      reviews: [
        { id: uid(), name: "Ayşe K.", city: "Kartal", stars: 5, text: "Akşam 7’de verdiğim sipariş 50 dakikada geldi. Meyveler gerçekten taze.", status: "yayinda" },
        { id: uid(), name: "Mert D.", city: "Kadıköy", stars: 5, text: "Kurye çok ilgiliydi, eksik ürün olursa hemen arıyorlar.", status: "yayinda" },
        { id: uid(), name: "Selin A.", city: "Maltepe", stars: 4, text: "Fiyatlar makul, kampanya dönemlerinde özellikle avantajlı.", status: "yayinda" }
      ],
      jobs: [
        { id: uid(), name: "Elif Yılmaz", email: "elif@example.com", phone: "0532 111 22 33", role: "Kasa", note: "3 yıl market deneyimim var.", date: "2026-09-09", status: "yeni" },
        { id: uid(), name: "Burak Demir", email: "burak@example.com", phone: "0533 444 55 66", role: "Motokurye", note: "Kadıköy bölgesinde çalışabilirim.", date: "2026-09-07", status: "incelendi" }
      ],
      catalogs: [
        { id: uid(), title: "5 Günlük Dev İndirim", summary: "Stoklarla sınırlı haftalık indirim fırsatlarını kaçırmayın.", image: "../images/katalog-kapak.jpg", pdf: "../files/katalog.pdf", pdfName: "katalog.pdf", productsLink: "../index.html#kategoriler", status: "yayinda" },
        { id: uid(), title: "Kasap Bölüm Fırsatları", summary: "Stoklarla sınırlı haftalık indirim fırsatlarını kaçırmayın.", image: "../images/katalog-kasap.jpg", pdf: "../files/katalog.pdf", pdfName: "katalog.pdf", productsLink: "", status: "yayinda" },
        { id: uid(), title: "Haftalık Fırsatlar", summary: "Bu haftanın indirimli ürünlerini kaçırmayın.", image: "../images/katalog-haftalik.jpg", pdf: "../files/katalog.pdf", pdfName: "katalog.pdf", productsLink: "../index.html#kategoriler", status: "yayinda" }
      ],
      catalogFileVersion: 2,
      subscribers: [
        { id: uid(), name: "Canan Aksoy", email: "canan@example.com", date: "2026-09-10" },
        { id: uid(), name: "Kemal Uçar", email: "kemal@example.com", date: "2026-09-06" }
      ],
      users: [
        { id: uid(), name: "Admin Grosper", email: "admin@grosper.com.tr", role: "Yönetici" },
        { id: uid(), name: "Ayşe Kaya", email: "ayse@example.com", role: "Müşteri" },
        { id: uid(), name: "Mert Demir", email: "mert@example.com", role: "Müşteri" }
      ],
      orders: [
        { id: uid(), no: "GRP-1041", customer: "Ayşe Kaya", total: "186,50 ₺", status: "bekliyor" },
        { id: uid(), no: "GRP-1040", customer: "Mert Demir", total: "92,00 ₺", status: "teslim" },
        { id: uid(), no: "GRP-1038", customer: "Selin Aksoy", total: "254,90 ₺", status: "hazirlaniyor" }
      ],
      products: [
        { id: uid(), title: "Züccaciye seti", price: "349,90 ₺", status: "yayinda" },
        { id: uid(), title: "Sensodyne paket", price: "129,90 ₺", status: "yayinda" },
        { id: uid(), title: "Deepep şampuan", price: "189,00 ₺", status: "yayinda" }
      ],
      pages: [
        { id: uid(), title: "Kurumsal", slug: "kurumsal" },
        { id: uid(), title: "İnsan Kaynakları", slug: "insan-kaynaklari" }
      ],
      menu: [
        { id: uid(), label: "Anasayfa", url: "../index.html" },
        { id: uid(), label: "Haberler", url: "../sayfalar/haberler.html" },
        { id: uid(), label: "İndirim Bülteni", url: "../sayfalar/bulten.html" }
      ],
      settings: {
        phone: "0216 517 28 05",
        email: "info@grosper.com.tr",
        address: "Yakacık Caddesi No:130/2, İstanbul / Kartal",
        theme: {
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
        },
        brand: {
          headerLogo: "images/logo.png",
          footerLogo: "",
          hideFooterLogo: false,
          favicon: "",
          ogImage: ""
        }
      },
      stats: {
        users: 16433,
        products: 31331,
        orders: 8777,
        pendingOrders: 36,
        paidAmount: 561670,
        pendingPayments: 23,
        failedPayments: 30
      }
    };
  }

  function isDataUrl(value) {
    return typeof value === "string" && (value.indexOf("data:") === 0 || value === "pending");
  }

  function stripItemBinaries(item, imageFallback, pdfFallback) {
    if (!item) return;
    if (isDataUrl(item.image) || isDataUrl(item.desktopImage)) {
      item.image = imageFallback || "";
      if (item.desktopImage) item.desktopImage = imageFallback || "";
    }
    if (isDataUrl(item.pdf)) {
      item.pdf = pdfFallback || "../files/katalog.pdf";
      item.pdfName = item.pdfName && !isDataUrl(item.pdfName) ? item.pdfName : "katalog.pdf";
    }
  }

  function stripCatalogs(data) {
    (data.catalogs || []).forEach(function (item, index) {
      stripItemBinaries(item, index === 0 ? "../images/katalog-kapak.jpg" : "../images/katalog-kasap.jpg", "../files/katalog.pdf");
    });
    return data;
  }

  function stripAllBinaries(data) {
    stripCatalogs(data);
    (data.sliders || []).forEach(function (item) {
      stripItemBinaries(item, "../images/slider-kartlar.jpg");
    });
    (data.banners || []).forEach(function (item) {
      stripItemBinaries(item, "../images/banner-zuccaciye.webp");
    });
    (data.news || []).forEach(function (item) {
      stripItemBinaries(item, "../images/fruits.jpg");
    });
    (data.gallery || []).forEach(function (item) {
      stripItemBinaries(item, "../images/fruits.jpg");
    });
    stripBrand(data);
    return data;
  }

  function defaultBrand() {
    return {
      headerLogo: "images/logo.png",
      footerLogo: "",
      hideFooterLogo: false,
      favicon: "",
      ogImage: ""
    };
  }

  function stripBrand(data) {
    if (!data.settings) return data;
    data.settings.brand = Object.assign({}, defaultBrand(), data.settings.brand || {});
    ["headerLogo", "footerLogo", "favicon", "ogImage"].forEach(function (key) {
      if (isDataUrl(data.settings.brand[key])) {
        data.settings.brand[key] = key === "headerLogo" ? "images/logo.png" : "";
      }
    });
    return data;
  }

  function slimCatalogs(list) {
    return (list || []).map(function (item) {
      return {
        id: item.id,
        title: item.title || "",
        summary: item.summary || "",
        status: item.status || "yayinda",
        image: isDataUrl(item.image) ? "../images/katalog-kapak.jpg" : (item.image || "../images/katalog-kapak.jpg"),
        pdf: isDataUrl(item.pdf) || !item.pdf ? "../files/katalog.pdf" : item.pdf,
        pdfName: item.pdfName && !isDataUrl(item.pdfName) ? item.pdfName : "katalog.pdf",
        productsLink: item.productsLink || ""
      };
    });
  }

  function persist(data) {
    var json = JSON.stringify(data);
    try {
      window.localStorage.setItem(KEY, json);
      return true;
    } catch (error) {
      return false;
    }
  }

  function read() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) {
        var fresh = seed();
        persist(fresh);
        return fresh;
      }
      var parsed = JSON.parse(raw);
      var fresh = seed();
      Object.keys(fresh).forEach(function (key) {
        if (key === "catalogFileVersion") return;
        if (parsed[key] == null) parsed[key] = fresh[key];
      });
      var oldSlider = (parsed.sliders || []).some(function (item) {
        return item.title === "Tatil promosyonları" || (item.image || "").indexOf("eggs.jpg") !== -1;
      });
      if (oldSlider) parsed.sliders = fresh.sliders;
      stripCatalogs(parsed);
      (parsed.catalogs || []).forEach(function (item, index) {
        if (item.productsLink == null) {
          item.productsLink = index === 1 ? "" : "../index.html#kategoriler";
        }
      });
      if ((parsed.catalogs || []).length === 2 && fresh.catalogs[2]) {
        parsed.catalogs.push(Object.assign({}, fresh.catalogs[2], { id: uid() }));
      }
      parsed.catalogFileVersion = 3;
      persist(parsed) || persist(stripAllBinaries(parsed));
      return parsed;
    } catch (error) {
      var fallback = seed();
      persist(fallback);
      return fallback;
    }
  }

  function write(data) {
    stripCatalogs(data);
    stripBrand(data);
    if (persist(data)) return data;
    stripAllBinaries(data);
    if (persist(data)) return data;
    window.localStorage.removeItem(KEY);
    if (persist(data)) return data;
    var fresh = seed();
    fresh.catalogs = slimCatalogs(data.catalogs || fresh.catalogs);
    if (!persist(fresh)) {
      window.localStorage.removeItem(KEY);
      persist(seed());
    }
    return fresh;
  }

  function list(collection) {
    var data = read();
    return data[collection] || [];
  }

  function saveAll(collection, items) {
    var data = read();
    data[collection] = items;
    return write(data);
  }

  function upsert(collection, item) {
    var items = list(collection).slice();
    if (!item.id) item.id = uid();
    var index = items.findIndex(function (row) {
      return row.id === item.id;
    });
    if (index === -1) items.unshift(item);
    else items[index] = item;
    saveAll(collection, items);
    return item;
  }

  function remove(collection, id) {
    saveAll(collection, list(collection).filter(function (row) {
      return row.id !== id;
    }));
  }

  function getSettings() {
    var settings = read().settings || {};
    var fresh = seed().settings;
    if (!settings.theme) settings.theme = Object.assign({}, fresh.theme);
    Object.keys(fresh.theme).forEach(function (key) {
      if (!settings.theme[key]) settings.theme[key] = fresh.theme[key];
    });
    settings.brand = Object.assign({}, defaultBrand(), settings.brand || {});
    return settings;
  }

  function saveSettings(settings) {
    var data = read();
    var current = data.settings || {};
    data.settings = Object.assign({}, current, settings);
    if (settings.theme) {
      data.settings.theme = Object.assign({}, current.theme || seed().settings.theme, settings.theme);
    }
    return write(data);
  }

  function getTheme() {
    var theme = Object.assign({}, seed().settings.theme, (getSettings().theme || {}));
    try {
      var standalone = JSON.parse(window.localStorage.getItem(THEME_KEY) || "null");
      if (standalone && typeof standalone === "object") {
        Object.keys(theme).forEach(function (key) {
          if (standalone[key]) theme[key] = standalone[key];
        });
      }
    } catch (error) {}
    return theme;
  }

  function getBrand() {
    var brand = Object.assign({}, defaultBrand(), (getSettings().brand || {}));
    try {
      var standalone = JSON.parse(window.localStorage.getItem(BRAND_KEY) || "null");
      if (standalone && typeof standalone === "object") {
        Object.keys(defaultBrand()).forEach(function (key) {
          if (key === "hideFooterLogo") {
            if (standalone[key] != null) brand[key] = !!standalone[key];
            return;
          }
          if (standalone[key]) brand[key] = standalone[key];
        });
      }
    } catch (error) {}
    return brand;
  }

  function saveBrand(brand) {
    var next = Object.assign({}, defaultBrand());
    Object.keys(next).forEach(function (key) {
      if (key === "hideFooterLogo") {
        next[key] = !!(brand && brand[key]);
        return;
      }
      if (brand && brand[key]) next[key] = brand[key];
    });
    try {
      window.localStorage.setItem(BRAND_KEY, JSON.stringify(next));
    } catch (error) {}
    var settings = getSettings();
    settings.brand = next;
    try {
      saveSettings(settings);
    } catch (error) {}
    return next;
  }

  function saveTheme(theme) {
    var next = Object.assign({}, seed().settings.theme, theme);
    try {
      window.localStorage.setItem(THEME_KEY, JSON.stringify(next));
    } catch (error) {}
    var settings = getSettings();
    settings.theme = next;
    try {
      saveSettings(settings);
    } catch (error) {}
    return next;
  }

  function getStats() {
    return read().stats || seed().stats;
  }

  function bumpStat(key, amount) {
    var data = read();
    data.stats = data.stats || seed().stats;
    data.stats[key] = Number(data.stats[key] || 0) + (amount || 1);
    return write(data);
  }

  function reset() {
    window.localStorage.removeItem(KEY);
    window.localStorage.removeItem(THEME_KEY);
    window.localStorage.removeItem(BRAND_KEY);
    return read();
  }

  window.GrosperStore = {
    uid: uid,
    read: read,
    list: list,
    upsert: upsert,
    remove: remove,
    getSettings: getSettings,
    saveSettings: saveSettings,
    getTheme: getTheme,
    saveTheme: saveTheme,
    getBrand: getBrand,
    saveBrand: saveBrand,
    getStats: getStats,
    bumpStat: bumpStat,
    reset: reset
  };
})(window);
