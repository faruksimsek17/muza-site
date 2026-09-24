(function (window) {
  var DB_NAME = "grosper-files-v1";
  var STORE = "blobs";

  function openDb() {
    return new Promise(function (resolve, reject) {
      var req = window.indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = function () {
        if (!req.result.objectStoreNames.contains(STORE)) {
          req.result.createObjectStore(STORE);
        }
      };
      req.onsuccess = function () {
        resolve(req.result);
      };
      req.onerror = function () {
        reject(req.error);
      };
    });
  }

  function put(key, blob) {
    var value = blob instanceof Blob ? blob : new Blob([blob]);
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, "readwrite");
        var req = tx.objectStore(STORE).put(value, key);
        req.onerror = function () {
          reject(req.error);
        };
        tx.oncomplete = function () {
          resolve(key);
        };
        tx.onerror = function () {
          reject(tx.error);
        };
      });
    });
  }

  function get(key) {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var req = db.transaction(STORE, "readonly").objectStore(STORE).get(key);
        req.onsuccess = function () {
          resolve(req.result || null);
        };
        req.onerror = function () {
          reject(req.error);
        };
      });
    });
  }

  function remove(key) {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).delete(key);
        tx.oncomplete = function () {
          resolve();
        };
        tx.onerror = function () {
          reject(tx.error);
        };
      });
    });
  }

  function keys() {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var req = db.transaction(STORE, "readonly").objectStore(STORE).getAllKeys();
        req.onsuccess = function () {
          resolve(req.result || []);
        };
        req.onerror = function () {
          reject(req.error);
        };
      });
    });
  }

  function extFromType(type, fallback) {
    if (type === "image/png") return "png";
    if (type === "image/jpeg" || type === "image/jpg") return "jpg";
    if (type === "image/webp") return "webp";
    if (type === "image/gif") return "gif";
    if (type === "image/svg+xml") return "svg";
    if (type === "application/pdf") return "pdf";
    return fallback || "bin";
  }

  function safeName(name) {
    return String(name || "file")
      .replace(/[^A-Za-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "file";
  }

  function upload(name, blob) {
    return fetch("/__cms-file?name=" + encodeURIComponent(name), {
      method: "POST",
      body: blob
    }).then(function (res) {
      if (!res.ok) throw new Error("upload-failed");
      return res.json();
    });
  }

  window.GrosperFiles = {
    put: put,
    get: get,
    remove: remove,
    keys: keys,
    extFromType: extFromType,
    safeName: safeName,
    upload: upload
  };
})(window);
