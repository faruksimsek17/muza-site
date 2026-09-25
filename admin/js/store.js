(function (window) {
  var KEY = "grosper-cms-v1";
  var THEME_KEY = "grosper-theme-v1";
  var BRAND_KEY = "grosper-brand-v1";

  function uid() {
    return "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function defaultBranches() {
    return [
      { name: "Merkez Depo", address: "Çavuşoğlu Mh. Yakacık Cd. No:130 Kartal / İstanbul", phone: "0216 517 28 05" },
      { name: "Soğanlık 1 Şube", address: "Gümüşpınar Mh. Atatürk Cd. No:16/1 Kartal / İstanbul", phone: "0216 452 20 00" },
      { name: "Soğanlık 2 Şube", address: "Yahya Kemal Beyatlı Cd. No:10 Soğanlık Kartal / İstanbul", phone: "0216 452 77 40" },
      { name: "Esenkent Şube", address: "Malazgirt Cd. Merkezi Cami Altı Esenkent / İstanbul", phone: "0216 376 53 52" },
      { name: "Göztepe Şube", address: "Eğitim Mh. Nahit Bey Sk. No:24 Kuyubaşı Kadıköy / İstanbul", phone: "0216 551 10 33" },
      { name: "Karabekir Şube", address: "Kazım Karabekir Mh. Adem Yavuz Cd. No:93 Ümraniye / İstanbul", phone: "0216 630 33 09" },
      { name: "Cevizli Şube", address: "Cevizli Mh. Orhangazi Cd. Önbaşı Sk. No:1 Maltepe / İstanbul", phone: "0216 457 05 30" },
      { name: "Ünalan Şube", address: "Ünalan Mh. Ayazma Cd. No:24 Üsküdar / İstanbul", phone: "0216 317 65 50" },
      { name: "Örnek Mh. Şube", address: "Örnek Mh. Yunus Emre Cd. No:8 BİLSEA YAPI Ataşehir / İstanbul", phone: "0216 565 71 74" },
      { name: "Çarşı Şube", address: "Namık Kemal Mh. Cengiz Topel Cd. Erciyes Sk. No:2 Ümraniye / İstanbul", phone: "0216 316 00 35" },
      { name: "Doğanevler Şube", address: "Tepeüstü Mh. Doğanevler Cd. Manidar Sk. No:1 Ümraniye / İstanbul", phone: "0216 540 55 67" },
      { name: "Çakmak Şube", address: "Armağan Evler Mh. Mithatpaşa Cd. No:138/A Çakmak / Ümraniye / İstanbul", phone: "0216 521 73 74" },
      { name: "Santral Şube", address: "Tantavi Mh. Su İş Cd. No:13 Ümraniye / İstanbul", phone: "0216 316 10 30" },
      { name: "Sultanbeyli Şube", address: "Necip Fazıl Mh. Trabzon Cd. Farabi Sk. No:1 Sultanbeyli / İstanbul", phone: "0216 497 73 39" },
      { name: "Tavukçuyolu Şube", address: "Mehmet Akif Mh. Şahin Cd. No:1 Ümraniye / İstanbul", phone: "0216 504 11 88" },
      { name: "Bulgurlu Şube", address: "Bulgurlu Mh. Bulgurlu Cd. No:115 Üsküdar / İstanbul", phone: "0216 376 84 08" },
      { name: "Sondurak Şube", address: "İstiklal Mh. Mihraç Cd. No:11-13 Ümraniye / İstanbul", phone: "0216 482 11 82" },
      { name: "Kavacık Şube", address: "Kavacık Mh. Otağtepe Cd. No:62 Beykoz / İstanbul", phone: "0216 465 45 87" },
      { name: "Selimiye Şube", address: "Selimiye Mh. Tıbbiye Cd. No:18 Üsküdar / İstanbul", phone: "0216 530 00 12" },
      { name: "Battalgazi Şube", address: "Battalgazi Mh. Bosna Bulvarı No:124 Sultanbeyli / İstanbul", phone: "0216 592 22 14" },
      { name: "Zeynep Kamil Şube", address: "Zeynep Kamil Mh. Fahri Atabey Cd. No:126-128 Üsküdar / İstanbul", phone: "0216 452 22 44" },
      { name: "Belediye Şube", address: "Atatürk Mh. Ayazma Cd. No:32-36 Ümraniye / İstanbul", phone: "0216 517 28 05" },
      { name: "Osmangazi Şube", address: "Osmangazi Mh. Alsancak Cd. No:8-10 Sancaktepe / İstanbul", phone: "0216 517 28 05" },
      { name: "Kaynarca Şube", address: "Kaynarca Mh. Kanuni Sultan Süleyman Cd. No:28-A-B Pendik / İstanbul", phone: "0216 517 28 05" },
      { name: "Karlıktepe Şube", address: "Karlıktepe Mah. Atılgan Sokak No:2/A Kartal / İstanbul", phone: "0216 517 28 05" },
      { name: "Taşdelen Şube", address: "Sultançiftliği Mh. Turgut Özal Bulvarı No:127 Taşdelen / Çekmeköy / İstanbul", phone: "0216 517 28 05" },
      { name: "Adil Mh. Şube", address: "Adil Mah. Hamidiye Cd. No:146 Sultanbeyli / İstanbul", phone: "0216 517 28 05" }
    ].map(function (item) {
      return {
        id: uid(),
        name: item.name,
        address: item.address,
        phone: item.phone,
        hours: item.hours || "09:00-21:30",
        mapUrl: item.mapUrl || mapsSearchUrl(item.address)
      };
    });
  }

  function mapsSearchUrl(address) {
    var query = String(address || "").trim();
    if (!query) return "";
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
  }

  function ensureBranchMaps(list) {
    (list || []).forEach(function (item) {
      if (!item) return;
      if (!String(item.mapUrl || "").trim() && item.address) {
        item.mapUrl = mapsSearchUrl(item.address);
      }
    });
    return list;
  }

  function isGeneratedMap(url) {
    return /google\.com\/maps\/search\/\?api=1/i.test(String(url || ""));
  }

  function pickMapUrl(current, other) {
    var a = String(current || "").trim();
    var b = String(other || "").trim();
    if (b && (!a || (isGeneratedMap(a) && !isGeneratedMap(b)))) return b;
    return a || b;
  }

  function mergeBranches(target, extra) {
    if (!target || !extra || !extra.branches) return target;
    var byId = {};
    var byName = {};
    (extra.branches || []).forEach(function (item) {
      if (!item) return;
      if (item.id) byId[item.id] = item;
      if (item.name) byName[item.name] = item;
    });
    (target.branches || []).forEach(function (item) {
      var other = (item.id && byId[item.id]) || (item.name && byName[item.name]);
      if (!other) return;
      item.mapUrl = pickMapUrl(item.mapUrl, other.mapUrl);
      if (!item.hours && other.hours) item.hours = other.hours;
      if (!item.phone && other.phone) item.phone = other.phone;
    });
    return target;
  }

  function defaultSliderSettings() {
    return {
      mobileAspectRatio: "1/1",
      mobileBreakpoint: 640
    };
  }

  function defaultAbout() {
    return {
      corporate: {
        title: "Kurumsal",
        lead: "Mahalle marketinin tezgâhını, İstanbul’un temposuna taşıyan bir yolculuk."
      },
      references: {
        title: "Referanslar",
        lead: "Birlikte çalıştığımız markalar ve iş ortaklarımız."
      },
      documents: {
        title: "Belgelerimiz",
        lead: "Kalite, hijyen ve yasal uygunluk belgelerimiz."
      }
    };
  }

  function seed() {
    return {
      sliderSettings: defaultSliderSettings(),
      sliders: [
        { id: "id-mtx0x9ntqhbl9", title: "Yemek kartları", text: "Tüm alışverişlerinizde geçerli 0 komisyonlu yemek kartları.", image: "../images/slider-kartlar.png", mobileImage: "../images/slider-kartlar-mobil.png", link: "#kategoriler", status: "yayinda" },
        { id: "id-mtx0x9ntpbexn", title: "İndirim bülteni", text: "2–14 Eylül indirim bültenimiz yayında.", image: "../images/slider-bulten.png", mobileImage: "../images/slider-bulten-mobil.png", link: "../sayfalar/bulten.html", status: "yayinda" },
        { id: "id-mtx0x9ntn2023", title: "Taşdelen şube açılışı", text: "2–28 Eylül şube açılış indirimleri.", image: "../images/slider-alisverise-deger.png", mobileImage: "", link: "../sayfalar/subeler.html", status: "yayinda" }
      ],
      banners: [
        { id: "id-mtx0x9nthjve4", title: "Züccaciye fırsatları", image: "../images/uploads/banner-id-mtx0x9nthjve4.png", link: "../#kategoriler", status: "yayinda" },
        { id: "id-mtx0x9ntezo2k", title: "Diş bakımında %25", image: "../images/uploads/banner-id-mtx0x9ntezo2k.png", link: "../#kategoriler", status: "yayinda" },
        { id: "id-mtx0x9ntnfu6s", title: "Deepep Solution", image: "../images/uploads/banner-id-mtx0x9ntnfu6s.png", link: "../#kategoriler", status: "yayinda" }
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
      branches: defaultBranches(),
      branchesVersion: 2,
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
      about: defaultAbout(),
      aboutSections: [
        { id: uid(), title: "Hikayemiz", body: "İstanbul’da 2016’da başlayan hikâyemiz, bir tezgâhın başından çıktı; evlerin mutfağına uzandı. Taze meyve-sebzeden temel gıdaya, binlerce ürünü kapıya kadar aynı özenle ulaştırmak istedik. Yolculuk büyüdü; vaat değişmedi." },
        { id: uid(), title: "Misyonumuz", body: "Kaliteli ürünü adil fiyatla, hızlı ve güvenilir teslimatla sunmak. Her sepette şeffaf, taze ve ulaşılabilir bir alışveriş." },
        { id: uid(), title: "Vizyonumuz", body: "Türkiye’nin en güvenilen mahalle marketi olmak. Her evin günlük ihtiyacını tek bir adresten karşılamak." }
      ],
      aboutRefs: [
        { id: uid(), title: "Nestlé", text: "Kahvaltılık ve süt ürünleri tedarik partneri." },
        { id: uid(), title: "Coca-Cola", text: "İçecek kategorisinde ulusal dağıtım iş birliği." },
        { id: uid(), title: "Ülker", text: "Atıştırmalık ve fırın ürünleri referans müşterisi." },
        { id: uid(), title: "Pınar", text: "Süt ve şarküteri ürünlerinde düzenli tedarik." },
        { id: uid(), title: "Lipton", text: "Çay ve sıcak içecek reyonu iş ortaklığı." },
        { id: uid(), title: "Eti", text: "Bisküvi ve çocuk atıştırmalıkları kategorisi." }
      ],
      aboutDocs: [
        { id: uid(), title: "ISO 9001", text: "Kalite yönetim sistemi belgesi.", file: "", fileName: "" },
        { id: uid(), title: "ISO 22000", text: "Gıda güvenliği yönetim sistemi belgesi.", file: "", fileName: "" },
        { id: uid(), title: "Helal Uygunluk", text: "Seçili ürün gruplarında helal belgesi.", file: "", fileName: "" },
        { id: uid(), title: "Ticaret Sicil", text: "Şirket ticaret sicil gazetesi özeti.", file: "", fileName: "" }
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
        address: "Çavuşoğlu Mh. Yakacık Cd. No:130, Kartal / İstanbul",
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
      if (isDataUrl(item.mobileImage)) item.mobileImage = "";
    });
    (data.banners || []).forEach(function (item) {
      if (isDataUrl(item.image) || isDataUrl(item.desktopImage)) {
        item.image = "";
        if (item.desktopImage) item.desktopImage = "";
      }
    });
    (data.news || []).forEach(function (item) {
      stripItemBinaries(item, "../images/fruits.jpg");
    });
    (data.gallery || []).forEach(function (item) {
      stripItemBinaries(item, "../images/fruits.jpg");
    });
    (data.aboutSections || []).forEach(function (item) {
      if (isDataUrl(item.image)) item.image = "";
    });
    (data.aboutDocs || []).forEach(function (item) {
      if (isDataUrl(item.file)) {
        item.file = "";
        item.fileName = item.fileName && !isDataUrl(item.fileName) ? item.fileName : "";
      }
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

  function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
  }

  function fileSnapshot() {
    var file = window.GROSPER_CMS_FILE;
    return file && typeof file === "object" ? file : null;
  }

  function fileVersion(data) {
    return Number((data && data.cmsFileVersion) || 0);
  }

  function collectMediaRefs(obj, acc) {
    if (!obj || typeof obj !== "object") return acc;
    Object.keys(obj).forEach(function (key) {
      var val = obj[key];
      if (typeof val === "string" && (val.indexOf("idb:") === 0 || val.indexOf("data:") === 0)) {
        acc.push({ obj: obj, key: key, val: val });
        return;
      }
      if (val && typeof val === "object") collectMediaRefs(val, acc);
    });
    return acc;
  }

  function blobFromRef(ref) {
    if (ref.indexOf("idb:") === 0) {
      if (!window.GrosperFiles) return Promise.resolve(null);
      return GrosperFiles.get(ref.slice(4));
    }
    return fetch(ref).then(function (res) {
      return res.ok ? res.blob() : null;
    }).catch(function () {
      return null;
    });
  }

  function filePathFor(key, blob, fieldKey) {
    var fallback = fieldKey === "pdf" || fieldKey === "file" ? "pdf" : "jpg";
    var ext = window.GrosperFiles
      ? GrosperFiles.extFromType(blob && blob.type, fallback)
      : fallback;
    var base = window.GrosperFiles ? GrosperFiles.safeName(key) : String(key || "file").replace(/[^A-Za-z0-9._-]+/g, "-");
    if (!/\.[A-Za-z0-9]+$/.test(base)) base += "." + ext;
    if (fieldKey === "headerLogo" || fieldKey === "footerLogo" || fieldKey === "favicon" || fieldKey === "ogImage") {
      return "images/uploads/" + base;
    }
    return "../images/uploads/" + base;
  }

  function postCmsBackup(data) {
    return fetch("/__cms-backup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(function (res) {
      if (!res.ok) throw new Error("backup-failed");
      return res.json();
    });
  }

  var backupTimer = null;
  var backupInFlight = null;

  function backupToDisk(options) {
    options = options || {};
    var data = cloneData(options.data || read());
    var refs = collectMediaRefs(data, []);
    var extraKeys = Promise.resolve([]);
    if (window.GrosperFiles && GrosperFiles.keys) {
      extraKeys = GrosperFiles.keys().catch(function () {
        return [];
      });
    }

    return extraKeys.then(function (keys) {
      (keys || []).forEach(function (key) {
        var already = refs.some(function (item) {
          return item.val === "idb:" + key;
        });
        if (!already) refs.push({ obj: null, key: key, val: "idb:" + key, orphan: true });
      });

      var uploaded = 0;
      var queue = Promise.resolve();
      refs.forEach(function (item) {
        queue = queue.then(function () {
          return blobFromRef(item.val).then(function (blob) {
            if (!blob || !window.GrosperFiles || !GrosperFiles.upload) return;
            var rawKey = item.val.indexOf("idb:") === 0 ? item.val.slice(4) : (item.key || "file");
            var path = filePathFor(rawKey, blob, item.key);
            var name = path.replace(/^(\.\.\/)?images\/uploads\//, "");
            return GrosperFiles.upload(name, blob).then(function (saved) {
              uploaded += 1;
              var next = (saved && saved.path) ? "../" + saved.path.replace(/^\.\.\//, "") : path;
              if (item.key === "headerLogo" || item.key === "footerLogo" || item.key === "favicon" || item.key === "ogImage") {
                next = (saved && saved.path) ? saved.path.replace(/^\.\.\//, "") : path.replace(/^\.\.\//, "");
              }
              if (item.obj) item.obj[item.key] = next;
            });
          });
        });
      });
      return queue.then(function () {
        return uploaded;
      });
    }).then(function (uploaded) {
      mergeInbound(data, readInbox());
      data.cmsFileVersion = Date.now();
      persist(data);
      return postCmsBackup(data).then(function () {
        return { ok: true, version: data.cmsFileVersion, files: uploaded || 0 };
      });
    }).catch(function (error) {
      return { ok: false, error: error && error.message ? error.message : "backup-failed" };
    });
  }

  function queueBackup() {
    if (backupTimer) window.clearTimeout(backupTimer);
    backupTimer = window.setTimeout(function () {
      backupTimer = null;
      if (backupInFlight) return;
      backupInFlight = backupToDisk().then(function (result) {
        backupInFlight = null;
        return result;
      });
    }, 400);
  }

  var INBOUND_KEYS = ["jobs", "subscribers"];
  var INBOX_LS = "grosper-inbox-v1";

  function mediaScore(item) {
    var img = String((item && (item.image || item.desktopImage)) || "");
    if (img.indexOf("uploads/") !== -1) return 5;
    if (img.indexOf("idb:") === 0) return 4;
    if (img.indexOf("data:") === 0) return 3;
    if (/banner-(zuccaciye|disbakim|deepep)/.test(img)) return 1;
    return img ? 2 : 0;
  }

  function pickRicher(a, b) {
    return mediaScore(b) >= mediaScore(a) ? b : a;
  }

  function isLegacyMedia(item) {
    var img = String((item && (item.image || item.desktopImage || item.mobileImage)) || "");
    return /banner-(zuccaciye|disbakim|deepep)\.webp/i.test(img)
      || /slider-(kartlar|bulten|sube)\.jpg/i.test(img)
      || /eggs\.jpg/i.test(img);
  }

  function dropLegacy(list) {
    return (list || []).filter(function (item) {
      return item && item.id && !isLegacyMedia(item);
    });
  }

  function mergePublished(target, extra, key) {
    if (!target || !extra) return target;
    var map = {};
    (target[key] || []).forEach(function (item) {
      if (item && item.id && !isLegacyMedia(item)) map[item.id] = item;
    });
    (extra[key] || []).forEach(function (item) {
      if (!item || !item.id || isLegacyMedia(item)) return;
      map[item.id] = map[item.id] ? pickRicher(map[item.id], item) : item;
    });
    target[key] = Object.keys(map).map(function (id) {
      return map[id];
    });
    return target;
  }

  function mergeById(target, extra, key, pick) {
    if (!target || !extra) return target;
    var map = {};
    (target[key] || []).concat(extra[key] || []).forEach(function (item) {
      if (!item || !item.id) return;
      map[item.id] = map[item.id] && pick ? pick(map[item.id], item) : item;
    });
    target[key] = Object.keys(map).map(function (id) {
      return map[id];
    });
    return target;
  }

  function mergeInbound(target, extra) {
    if (!target || !extra) return target;
    INBOUND_KEYS.forEach(function (key) {
      var map = {};
      (target[key] || []).concat(extra[key] || []).forEach(function (item) {
        if (!item || !item.id) return;
        map[item.id] = item;
      });
      target[key] = Object.keys(map).map(function (id) {
        return map[id];
      });
      if (key === "jobs") {
        target[key].sort(function (a, b) {
          return String(b.date || "").localeCompare(String(a.date || "")) || String(b.id).localeCompare(String(a.id));
        });
      }
    });
    return target;
  }

  function dropIds(list, ids) {
    var skip = {};
    (ids || []).forEach(function (id) {
      skip[id] = true;
    });
    return (list || []).filter(function (item) {
      return item && item.id && !skip[item.id];
    });
  }

  function uniqIds(a, b) {
    var map = {};
    (a || []).concat(b || []).forEach(function (id) {
      if (id) map[id] = true;
    });
    return Object.keys(map);
  }

  function emptyInbox() {
    return { jobs: [], subscribers: [], removedJobs: [], removedSubscribers: [] };
  }

  function applyInboxRemovals(inbox) {
    inbox.jobs = dropIds(inbox.jobs, inbox.removedJobs);
    inbox.subscribers = dropIds(inbox.subscribers, inbox.removedSubscribers);
    return inbox;
  }

  function readInbox() {
    var inbox = emptyInbox();
    var file = window.GROSPER_INBOX || {};
    var local = {};
    try {
      local = JSON.parse(window.localStorage.getItem(INBOX_LS) || "{}") || {};
    } catch (error) {}
    mergeInbound(inbox, file);
    mergeInbound(inbox, local);
    inbox.removedJobs = uniqIds(file.removedJobs, local.removedJobs);
    inbox.removedSubscribers = uniqIds(file.removedSubscribers, local.removedSubscribers);
    return applyInboxRemovals(inbox);
  }

  function persistInbox(inbox) {
    var payload = {
      jobs: inbox.jobs || [],
      subscribers: inbox.subscribers || [],
      removedJobs: inbox.removedJobs || [],
      removedSubscribers: inbox.removedSubscribers || []
    };
    window.GROSPER_INBOX = payload;
    try {
      window.localStorage.setItem(INBOX_LS, JSON.stringify(payload));
    } catch (error) {}
  }

  function postInbox(payload) {
    return fetch("/__cms-inbox", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(function () {
      return null;
    });
  }

  function syncInboxFrom(data, extra) {
    extra = extra || {};
    var inbox = readInbox();
    mergeInbound(inbox, { jobs: data.jobs, subscribers: data.subscribers });
    inbox.removedJobs = uniqIds(inbox.removedJobs, extra.removeJobs);
    inbox.removedSubscribers = uniqIds(inbox.removedSubscribers, extra.removeSubscribers);
    applyInboxRemovals(inbox);
    persistInbox(inbox);
    mergeInbound(data, inbox);
    postInbox({
      jobs: inbox.jobs,
      subscribers: inbox.subscribers,
      removeJobs: inbox.removedJobs,
      removeSubscribers: inbox.removedSubscribers
    });
    return inbox;
  }

  function read() {
    try {
      var file = fileSnapshot();
      var raw = window.localStorage.getItem(KEY);
      var parsed = raw ? JSON.parse(raw) : null;
      if (!parsed) {
        parsed = file ? cloneData(file) : seed();
        persist(parsed);
      } else if (file && fileVersion(file) > fileVersion(parsed) && fileVersion(parsed) > 0) {
        var incoming = cloneData(parsed);
        parsed = cloneData(file);
        mergeInbound(parsed, incoming);
        mergeById(parsed, incoming, "reviews");
        mergePublished(parsed, incoming, "banners");
        mergePublished(parsed, incoming, "sliders");
        mergeBranches(parsed, incoming);
        persist(parsed);
      } else if (file) {
        mergeInbound(parsed, file);
      }
      if (file) {
        mergeById(parsed, file, "reviews");
        mergePublished(parsed, file, "banners");
        mergePublished(parsed, file, "sliders");
        mergeBranches(parsed, file);
      }
      var fresh = seed();
      Object.keys(fresh).forEach(function (key) {
        if (key === "catalogFileVersion" || key === "branchesVersion") return;
        if (parsed[key] == null) parsed[key] = fresh[key];
      });
      if (!parsed.sliderSettings) parsed.sliderSettings = fresh.sliderSettings;
      (parsed.sliders || []).forEach(function (item) {
        if (item.mobileImage == null) item.mobileImage = "";
      });
      var oldBranches = (parsed.branchesVersion || 0) < 1 || (parsed.branches || []).some(function (item) {
        return item.name === "Kartal / Yakacık" || item.name === "Kadıköy / Caferağa";
      });
      if (oldBranches) {
        var keptMaps = {};
        (parsed.branches || []).forEach(function (item) {
          if (item && item.name && item.mapUrl) keptMaps[item.name] = item.mapUrl;
        });
        parsed.branches = fresh.branches;
        parsed.branches.forEach(function (item) {
          if (keptMaps[item.name]) item.mapUrl = keptMaps[item.name];
        });
        parsed.branchesVersion = 2;
      } else if ((parsed.branchesVersion || 0) < 2) {
        (parsed.branches || []).forEach(function (item) {
          if (!item.hours) item.hours = "09:00-21:30";
        });
        parsed.branchesVersion = 2;
      }
      ensureBranchMaps(parsed.branches);
      if ((parsed.settings || {}).address === "Yakacık Caddesi No:130/2, İstanbul / Kartal") {
        parsed.settings.address = fresh.settings.address;
      }
      var oldSlider = (parsed.sliders || []).some(function (item) {
        return item.title === "Tatil promosyonları" || isLegacyMedia(item);
      });
      if (oldSlider) {
        parsed.sliders = dropLegacy((file && file.sliders) || fresh.sliders);
      }
      parsed.banners = dropLegacy(parsed.banners);
      parsed.sliders = dropLegacy(parsed.sliders);
      if (file && file.banners && !parsed.banners.length) parsed.banners = dropLegacy(file.banners);
      if (file && file.sliders && !parsed.sliders.length) parsed.sliders = dropLegacy(file.sliders);
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
      var inbox = readInbox();
      mergeInbound(parsed, inbox);
      parsed.jobs = dropIds(parsed.jobs, inbox.removedJobs);
      parsed.subscribers = dropIds(parsed.subscribers, inbox.removedSubscribers);
      persist(parsed) || persist(stripAllBinaries(parsed));
      return parsed;
    } catch (error) {
      var fallback = seed();
      persist(fallback);
      return fallback;
    }
  }

  function write(data, options) {
    options = options || {};
    stripCatalogs(data);
    stripBrand(data);
    data.cmsFileVersion = Date.now();
    var saved = null;
    if (persist(data)) saved = data;
    else {
      stripAllBinaries(data);
      if (persist(data)) saved = data;
      else {
        window.localStorage.removeItem(KEY);
        if (persist(data)) saved = data;
      }
    }
    if (!saved) {
      var fresh = seed();
      fresh.catalogs = slimCatalogs(data.catalogs || fresh.catalogs);
      fresh.cmsFileVersion = Date.now();
      if (!persist(fresh)) {
        window.localStorage.removeItem(KEY);
        persist(seed());
      }
      saved = fresh;
    }
    syncInboxFrom(saved, options);
    persist(saved) || persist(stripAllBinaries(saved));
    queueBackup();
    return saved;
  }

  function list(collection) {
    var data = read();
    return data[collection] || [];
  }

  function saveAll(collection, items, options) {
    var data = read();
    data[collection] = items;
    return write(data, options);
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
    var options = {};
    if (collection === "jobs") options.removeJobs = [id];
    if (collection === "subscribers") options.removeSubscribers = [id];
    saveAll(collection, list(collection).filter(function (row) {
      return row.id !== id;
    }), options);
  }

  function getAbout() {
    var fresh = defaultAbout();
    var current = (read().about || {});
    return {
      corporate: Object.assign({}, fresh.corporate, current.corporate || {}),
      references: Object.assign({}, fresh.references, current.references || {}),
      documents: Object.assign({}, fresh.documents, current.documents || {})
    };
  }

  function saveAbout(about) {
    var data = read();
    var current = getAbout();
    data.about = {
      corporate: Object.assign({}, current.corporate, (about && about.corporate) || {}),
      references: Object.assign({}, current.references, (about && about.references) || {}),
      documents: Object.assign({}, current.documents, (about && about.documents) || {})
    };
    return write(data);
  }

  function getSliderSettings() {
    var next = Object.assign({}, defaultSliderSettings(), read().sliderSettings || {});
    next.mobileBreakpoint = 640;
    next.mobileAspectRatio = next.mobileAspectRatio || "1/1";
    return next;
  }

  function saveSliderSettings(settings) {
    var data = read();
    var current = getSliderSettings();
    var next = Object.assign({}, current, settings || {});
    next.mobileBreakpoint = Math.max(320, Math.min(1200, Number(next.mobileBreakpoint) || current.mobileBreakpoint));
    if (!next.mobileAspectRatio) next.mobileAspectRatio = current.mobileAspectRatio;
    data.sliderSettings = next;
    return write(data);
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
    getAbout: getAbout,
    saveAbout: saveAbout,
    getSliderSettings: getSliderSettings,
    saveSliderSettings: saveSliderSettings,
    getStats: getStats,
    bumpStat: bumpStat,
    reset: reset,
    backupToDisk: backupToDisk
  };
})(window);
