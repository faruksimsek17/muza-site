(function (window) {
  var KEY = "grosper-cms-v1";

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
        address: "Yakacık Caddesi No:130/2, İstanbul / Kartal"
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

  function read() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) {
        var fresh = seed();
        window.localStorage.setItem(KEY, JSON.stringify(fresh));
        return fresh;
      }
      var parsed = JSON.parse(raw);
      var fresh = seed();
      Object.keys(fresh).forEach(function (key) {
        if (parsed[key] == null) parsed[key] = fresh[key];
      });
      var oldSlider = (parsed.sliders || []).some(function (item) {
        return item.title === "Tatil promosyonları" || (item.image || "").indexOf("eggs.jpg") !== -1;
      });
      if (oldSlider) {
        parsed.sliders = fresh.sliders;
        window.localStorage.setItem(KEY, JSON.stringify(parsed));
      }
      return parsed;
    } catch (error) {
      return seed();
    }
  }

  function write(data) {
    window.localStorage.setItem(KEY, JSON.stringify(data));
    return data;
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
    return read().settings || {};
  }

  function saveSettings(settings) {
    var data = read();
    data.settings = settings;
    return write(data);
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
    getStats: getStats,
    bumpStat: bumpStat,
    reset: reset
  };
})(window);
