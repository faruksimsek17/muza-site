(function () {
  var form = document.getElementById("job-form");
  if (!form) return;

  var MAX_BYTES = 5 * 1024 * 1024;
  var preview = document.getElementById("job-photo-preview");
  var fileName = form.querySelector("[data-filename]");
  var ok = document.getElementById("job-ok");
  var error = document.getElementById("job-error");
  var photoInput = form.querySelector('input[name="photo"]');

  function today() {
    var d = new Date();
    var month = String(d.getMonth() + 1);
    var day = String(d.getDate());
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return d.getFullYear() + "-" + month + "-" + day;
  }

  if (photoInput) {
    photoInput.addEventListener("change", function () {
      var file = photoInput.files && photoInput.files[0];
      if (!file) return;
      if (fileName) fileName.textContent = file.name;
      if (preview) {
        preview.hidden = false;
        preview.src = URL.createObjectURL(file);
      }
      if (error) error.hidden = true;
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (ok) ok.classList.remove("is-visible");
    if (error) error.hidden = true;

    var data = new FormData(form);
    var file = photoInput && photoInput.files && photoInput.files[0];
    if (!file) {
      if (error) {
        error.textContent = "Lütfen bir fotoğraf ekleyin.";
        error.hidden = false;
      }
      return;
    }
    if (file.size > MAX_BYTES) {
      if (error) {
        error.textContent = "Fotoğraf 5 MB’den büyük olamaz.";
        error.hidden = false;
      }
      return;
    }
    if (!window.GrosperStore) {
      if (error) {
        error.textContent = "Kayıt sistemi yüklenemedi. Sayfayı yenileyip tekrar deneyin.";
        error.hidden = false;
      }
      return;
    }

    var item = {
      id: GrosperStore.uid(),
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      role: String(data.get("role") || "").trim(),
      note: String(data.get("note") || "").trim(),
      date: today(),
      status: "yeni",
      photo: ""
    };

    function finish() {
      GrosperStore.upsert("jobs", item);
      form.reset();
      if (fileName) fileName.textContent = "Dosya seçilmedi";
      if (preview) {
        preview.hidden = true;
        preview.removeAttribute("src");
      }
      if (ok) ok.classList.add("is-visible");
    }

    function failPhoto() {
      if (error) {
        error.textContent = "Fotoğraf kaydedilemedi. Tekrar deneyin.";
        error.hidden = false;
      }
    }

    var key = "job-photo-" + item.id;
    var saveLocal = window.GrosperFiles ? GrosperFiles.put(key, file) : Promise.resolve();
    var ext = window.GrosperFiles && GrosperFiles.extFromType ? GrosperFiles.extFromType(file.type, "jpg") : "jpg";
    var uploadName = (window.GrosperFiles && GrosperFiles.safeName ? GrosperFiles.safeName(key) : key) + "." + ext;
    var saveDisk = window.GrosperFiles && GrosperFiles.upload
      ? GrosperFiles.upload(uploadName, file)
      : Promise.resolve(null);

    saveLocal.then(function () {
      return saveDisk.catch(function () {
        return null;
      });
    }).then(function (saved) {
      if (saved && saved.path) item.photo = "../" + String(saved.path).replace(/^\.\.\//, "");
      else item.photo = "idb:" + key;
      finish();
    }).catch(failPhoto);
  });
})();
