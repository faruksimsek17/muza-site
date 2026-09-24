(function (window) {
  var PAGE_W = 595.28;
  var PAGE_H = 841.89;
  var CANVAS_W = 1240;
  var CANVAS_H = 1754;
  var RED = "#e30613";
  var INK = "#111111";
  var MUTED = "#6b6b6b";
  var LINE = "#e6e6e6";
  var FONT = "'Plus Jakarta Sans', Arial, sans-serif";

  function settings() {
    return window.GrosperStore && GrosperStore.getSettings ? GrosperStore.getSettings() : {};
  }

  function brandLogoSrc() {
    var brand = window.GrosperStore && GrosperStore.getBrand ? GrosperStore.getBrand() : {};
    return publicSrc(brand.headerLogo || "images/logo.png");
  }

  function publicSrc(path) {
    if (!path) return "";
    if (path.indexOf("idb:") === 0) return "";
    if (/^(https?:|data:|blob:)/.test(path)) return path;
    if (path.indexOf("../") === 0) return path;
    return "../" + String(path).replace(/^\//, "");
  }

  function loadImage(src) {
    return new Promise(function (resolve) {
      if (!src) {
        resolve(null);
        return;
      }
      var img = new Image();
      img.onload = function () {
        resolve(img);
      };
      img.onerror = function () {
        resolve(null);
      };
      img.src = src;
    });
  }

  function photoSrc(item) {
    if (!item || !item.photo) return Promise.resolve("");
    if (item.photo.indexOf("idb:") === 0) {
      if (!window.GrosperFiles) return Promise.resolve("");
      return GrosperFiles.get(item.photo.slice(4)).then(function (blob) {
        return blob ? URL.createObjectURL(blob) : "";
      }).catch(function () {
        return "";
      });
    }
    return Promise.resolve(publicSrc(item.photo));
  }

  function statusLabel(status) {
    if (status === "incelendi") return "İncelendi";
    if (status === "yeni") return "Yeni";
    return status || "Yeni";
  }

  function formatDate(value) {
    var raw = String(value || "");
    var parts = raw.split("-");
    if (parts.length === 3) return parts[2] + "." + parts[1] + "." + parts[0];
    return raw || "—";
  }

  function safeFileName(item) {
    var base = String(item && item.name ? item.name : "basvuru")
      .replace(/[^A-Za-z0-9çğıöşüÇĞİÖŞÜ._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "basvuru";
    return "grosper-basvuru-" + base + ".pdf";
  }

  function enc(str) {
    var out = new Uint8Array(str.length);
    var i;
    for (i = 0; i < str.length; i += 1) out[i] = str.charCodeAt(i) & 255;
    return out;
  }

  function concat(parts) {
    var total = 0;
    parts.forEach(function (part) {
      total += part.length;
    });
    var out = new Uint8Array(total);
    var offset = 0;
    parts.forEach(function (part) {
      out.set(part, offset);
      offset += part.length;
    });
    return out;
  }

  function jpegFromCanvas(canvas) {
    var raw = atob(canvas.toDataURL("image/jpeg", 0.88).split(",")[1]);
    var bytes = new Uint8Array(raw.length);
    var i;
    for (i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
    return bytes;
  }

  function buildPdf(jpegs) {
    var parts = [];
    var offsets = [0];
    var size = 0;

    function add(chunk) {
      if (typeof chunk === "string") chunk = enc(chunk);
      parts.push(chunk);
      size += chunk.length;
    }

    function mark() {
      offsets.push(size);
    }

    add("%PDF-1.4\n");
    mark();
    add("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n");

    var kids = jpegs.map(function (_, index) {
      return (3 + index * 3) + " 0 R";
    }).join(" ");
    mark();
    add("2 0 obj << /Type /Pages /Kids [" + kids + "] /Count " + jpegs.length + " >> endobj\n");

    jpegs.forEach(function (jpeg, index) {
      var pageNo = 3 + index * 3;
      var contentNo = pageNo + 1;
      var imageNo = pageNo + 2;
      mark();
      add(
        pageNo + " 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 " + PAGE_W + " " + PAGE_H +
        "] /Resources << /XObject << /Im0 " + imageNo + " 0 R >> >> /Contents " + contentNo + " 0 R >> endobj\n"
      );
      var stream = "q " + PAGE_W + " 0 0 " + PAGE_H + " 0 0 cm /Im0 Do Q";
      mark();
      add(contentNo + " 0 obj << /Length " + stream.length + " >> stream\n" + stream + "\nendstream endobj\n");
      mark();
      add(
        imageNo + " 0 obj << /Type /XObject /Subtype /Image /Width " + CANVAS_W +
        " /Height " + CANVAS_H + " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " +
        jpeg.length + " >> stream\n"
      );
      add(jpeg);
      add("\nendstream endobj\n");
    });

    var xrefAt = size;
    add("xref\n0 " + offsets.length + "\n");
    add("0000000000 65535 f \n");
    offsets.slice(1).forEach(function (offset) {
      var line = String(offset);
      while (line.length < 10) line = "0" + line;
      add(line + " 00000 n \n");
    });
    add("trailer << /Size " + offsets.length + " /Root 1 0 R >>\nstartxref\n" + xrefAt + "\n%%EOF");
    return new Blob([concat(parts)], { type: "application/pdf" });
  }

  function wrapLines(ctx, text, maxWidth) {
    var source = String(text || "").replace(/\r\n/g, "\n").split("\n");
    var lines = [];
    source.forEach(function (paragraph) {
      var words = paragraph.split(/\s+/).filter(Boolean);
      if (!words.length) {
        lines.push("");
        return;
      }
      var line = "";
      words.forEach(function (word) {
        var next = line ? line + " " + word : word;
        if (ctx.measureText(next).width <= maxWidth) {
          line = next;
          return;
        }
        if (line) lines.push(line);
        if (ctx.measureText(word).width <= maxWidth) {
          line = word;
          return;
        }
        var chunk = "";
        String(word).split("").forEach(function (ch) {
          if (ctx.measureText(chunk + ch).width > maxWidth && chunk) {
            lines.push(chunk);
            chunk = ch;
          } else {
            chunk += ch;
          }
        });
        line = chunk;
      });
      if (line) lines.push(line);
    });
    return lines;
  }

  function drawCovered(ctx, img, x, y, w, h) {
    var scale = Math.max(w / img.width, h / img.height);
    var dw = img.width * scale;
    var dh = img.height * scale;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
    ctx.restore();
  }

  function drawContained(ctx, img, x, y, w, h) {
    var scale = Math.min(w / img.width, h / img.height);
    var dw = img.width * scale;
    var dh = img.height * scale;
    ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  }

  function newPage(logo) {
    var canvas = document.createElement("canvas");
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = RED;
    ctx.fillRect(0, 0, CANVAS_W, 118);
    if (logo) {
      ctx.save();
      ctx.filter = "brightness(0) invert(1)";
      drawContained(ctx, logo, 56, 28, 210, 62);
      ctx.restore();
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.font = "800 34px " + FONT;
      ctx.fillText("GROSPER", 56, 74);
    }
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 28px " + FONT;
    ctx.textAlign = "right";
    ctx.fillText("İş Başvuru Formu", CANVAS_W - 56, 72);
    ctx.textAlign = "left";
    ctx.fillStyle = LINE;
    ctx.fillRect(56, CANVAS_H - 78, CANVAS_W - 112, 2);
    var site = settings();
    ctx.fillStyle = MUTED;
    ctx.font = "400 20px " + FONT;
    ctx.fillText(
      [site.address, site.phone, site.email].filter(Boolean).join("  •  ") || "Grosper İnsan Kaynakları",
      56,
      CANVAS_H - 42
    );
    return { canvas: canvas, ctx: ctx };
  }

  function drawField(ctx, label, value, x, y, width) {
    ctx.fillStyle = MUTED;
    ctx.font = "700 18px " + FONT;
    ctx.fillText(String(label).toUpperCase(), x, y);
    ctx.fillStyle = INK;
    ctx.font = "600 28px " + FONT;
    var lines = wrapLines(ctx, value || "—", width);
    lines.slice(0, 2).forEach(function (line, index) {
      ctx.fillText(line, x, y + 36 + index * 34);
    });
    return y + 36 + Math.min(lines.length, 2) * 34 + 22;
  }

  function renderPages(job, logo, photo) {
    var pages = [];
    var first = newPage(logo);
    var ctx = first.ctx;
    var y = 168;
    var photoW = 248;
    var photoH = 312;
    var photoX = CANVAS_W - 56 - photoW;
    var textW = photo ? CANVAS_W - 56 - photoW - 88 : CANVAS_W - 112;

    ctx.fillStyle = "#f6f7f9";
    ctx.fillRect(photoX - 8, y - 8, photoW + 16, photoH + 16);
    if (photo) {
      drawCovered(ctx, photo, photoX, y, photoW, photoH);
    } else {
      ctx.fillStyle = "#ececec";
      ctx.fillRect(photoX, y, photoW, photoH);
      ctx.fillStyle = MUTED;
      ctx.font = "600 22px " + FONT;
      ctx.textAlign = "center";
      ctx.fillText("Fotoğraf yok", photoX + photoW / 2, y + photoH / 2);
      ctx.textAlign = "left";
    }

    y = drawField(ctx, "Ad Soyad", job.name, 56, y, textW);
    y = drawField(ctx, "Pozisyon", job.role, 56, y, textW);
    y = drawField(ctx, "E-posta", job.email, 56, y, textW);
    y = drawField(ctx, "Telefon", job.phone, 56, y, textW);
    y = drawField(ctx, "Başvuru tarihi", formatDate(job.date), 56, y, textW);
    y = drawField(ctx, "Durum", statusLabel(job.status), 56, y, textW);
    y = Math.max(y, 168 + photoH + 36);

    ctx.fillStyle = RED;
    ctx.fillRect(56, y, 72, 6);
    y += 42;
    ctx.fillStyle = INK;
    ctx.font = "800 28px " + FONT;
    ctx.fillText("Kısa özgeçmiş", 56, y);
    y += 40;
    ctx.fillStyle = INK;
    ctx.font = "400 24px " + FONT;
    var noteLines = wrapLines(ctx, job.note || "—", CANVAS_W - 112);
    var lineH = 36;
    var maxY = CANVAS_H - 110;
    var lineIndex = 0;
    var current = first;

    function pushPage() {
      pages.push(current.canvas);
    }

    while (lineIndex < noteLines.length) {
      if (y + lineH > maxY) {
        pushPage();
        current = newPage(logo);
        ctx = current.ctx;
        y = 168;
        ctx.fillStyle = INK;
        ctx.font = "800 26px " + FONT;
        ctx.fillText("Kısa özgeçmiş (devam)", 56, y);
        y += 44;
        ctx.font = "400 24px " + FONT;
      }
      ctx.fillStyle = INK;
      ctx.font = "400 24px " + FONT;
      ctx.fillText(noteLines[lineIndex], 56, y);
      y += lineH;
      lineIndex += 1;
    }
    pushPage();
    return pages;
  }

  function preview(job) {
    return photoSrc(job).then(function (src) {
      return Promise.all([loadImage(brandLogoSrc()), loadImage(src)]);
    }).then(function (images) {
      var canvases = renderPages(job || {}, images[0], images[1]);
      return {
        pages: canvases.map(function (canvas) {
          return canvas.toDataURL("image/jpeg", 0.88);
        }),
        blob: buildPdf(canvases.map(jpegFromCanvas))
      };
    });
  }

  function render(job) {
    return preview(job).then(function (result) {
      return result.blob;
    });
  }

  function open(job) {
    var page = "basvuru-pdf.html?id=" + encodeURIComponent(job && job.id ? job.id : "");
    var preview = window.open("about:blank", "_blank");
    if (!preview) {
      window.location.href = page;
      return Promise.resolve();
    }
    try {
      preview.sessionStorage.setItem("grosper-admin-auth", "1");
    } catch (error) {}
    preview.location.href = page;
    return Promise.resolve();
  }

  window.GrosperJobPdf = {
    open: open,
    preview: preview,
    render: render
  };
})(window);
