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

  window.GrosperFiles = {
    put: put,
    get: get,
    remove: remove
  };
})(window);
