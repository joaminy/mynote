/* ===== 마이노트 저장소 =====
 * LocalStore : 이 기기(브라우저)에만 저장 — firebase-config.js가 비어 있을 때
 * CloudStore : Firebase(Firestore)에 저장 + 기기 사이 연동 + 인터넷 없이도 동작
 * 이 파일은 고칠 필요가 없습니다.
 */
(function () {
  'use strict';

  var FIREBASE_SDK = '12.19.0';
  var SDK_BASE = 'https://www.gstatic.com/firebasejs/' + FIREBASE_SDK + '/';
  var CHUNK = 700 * 1024; // 첨부 파일을 700KB 조각으로 나눠 저장 (Firestore 문서 1개 최대 1MiB)

  /* ---------- 공통: 저장용 객체 정리 (undefined 제거) ---------- */
  function clean(obj) {
    var out = {};
    Object.keys(obj).forEach(function (k) {
      if (k.charAt(0) === '_') return;
      var v = obj[k];
      if (v === undefined) return;
      out[k] = v;
    });
    return out;
  }

  /* ================= 로컬 저장소 (IndexedDB) ================= */
  function idbOpen() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open('mynote-local', 1);
      req.onupgradeneeded = function () {
        var db = req.result;
        ['notes', 'folders', 'files'].forEach(function (s) {
          if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: 'id' });
        });
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }
  function idbAll(db, store) {
    return new Promise(function (resolve, reject) {
      var r = db.transaction(store).objectStore(store).getAll();
      r.onsuccess = function () { resolve(r.result || []); };
      r.onerror = function () { reject(r.error); };
    });
  }
  function idbDo(db, store, method, arg) {
    return new Promise(function (resolve, reject) {
      var tx = db.transaction(store, 'readwrite');
      var r = tx.objectStore(store)[method](arg);
      tx.oncomplete = function () { resolve(r.result); };
      tx.onerror = function () { reject(tx.error); };
    });
  }
  function idbGet(db, store, key) {
    return new Promise(function (resolve, reject) {
      var r = db.transaction(store).objectStore(store).get(key);
      r.onsuccess = function () { resolve(r.result); };
      r.onerror = function () { reject(r.error); };
    });
  }

  function LocalStore() {
    this.mode = 'local';
    this.notes = new Map();
    this.folders = new Map();
    this.db = null;
    this.h = null;
  }
  LocalStore.prototype.start = async function (handlers) {
    this.h = handlers;
    this.db = await idbOpen();
    var self = this;
    (await idbAll(this.db, 'notes')).forEach(function (n) { self.notes.set(n.id, n); });
    (await idbAll(this.db, 'folders')).forEach(function (f) { self.folders.set(f.id, f); });
    this._emitFolders();
    this._emitNotes();
    handlers.onSync({ local: true });
  };
  LocalStore.prototype._emitNotes = function () { this.h.onNotes(Array.from(this.notes.values())); };
  LocalStore.prototype._emitFolders = function () { this.h.onFolders(Array.from(this.folders.values())); };
  LocalStore.prototype.saveNote = function (note) {
    var n = clean(note);
    this.notes.set(n.id, n);
    idbDo(this.db, 'notes', 'put', n).catch(this._err.bind(this));
    this._emitNotes();
  };
  LocalStore.prototype.deleteNote = function (id) {
    this.notes.delete(id);
    idbDo(this.db, 'notes', 'delete', id).catch(this._err.bind(this));
    this._emitNotes();
  };
  LocalStore.prototype.saveFolder = function (folder) {
    var f = clean(folder);
    this.folders.set(f.id, f);
    idbDo(this.db, 'folders', 'put', f).catch(this._err.bind(this));
    this._emitFolders();
  };
  LocalStore.prototype.deleteFolder = function (id) {
    this.folders.delete(id);
    idbDo(this.db, 'folders', 'delete', id).catch(this._err.bind(this));
    this._emitFolders();
  };
  LocalStore.prototype.putFile = async function (id, blob) {
    await idbDo(this.db, 'files', 'put', { id: id, blob: blob });
    return 1;
  };
  LocalStore.prototype.getFile = async function (meta) {
    var rec = await idbGet(this.db, 'files', meta.id);
    if (!rec) throw new Error('not-found');
    return rec.blob;
  };
  LocalStore.prototype.deleteFile = function (meta) {
    idbDo(this.db, 'files', 'delete', meta.id).catch(this._err.bind(this));
  };
  LocalStore.prototype._err = function (e) { if (this.h && this.h.onError) this.h.onError(e); };

  /* ================= Firebase 연동 ================= */
  async function initFirebase(config) {
    var mods = await Promise.all([
      import(SDK_BASE + 'firebase-app.js'),
      import(SDK_BASE + 'firebase-auth.js'),
      import(SDK_BASE + 'firebase-firestore.js')
    ]);
    var appM = mods[0], authM = mods[1], fsM = mods[2];
    var app = appM.initializeApp(config);
    var auth = authM.getAuth(app);
    var db;
    try {
      // 인터넷이 끊겨도 쓰도록 기기에 복사본을 저장하는 설정
      db = fsM.initializeFirestore(app, {
        localCache: fsM.persistentLocalCache({ tabManager: fsM.persistentMultipleTabManager() })
      });
    } catch (e) {
      console.warn('오프라인 저장소를 켜지 못했습니다:', e);
      db = fsM.getFirestore(app);
    }
    return { authM: authM, fsM: fsM, auth: auth, db: db };
  }

  function CloudStore(fb, user) {
    this.mode = 'cloud';
    this.fb = fb;
    this.fs = fb.fsM;
    this.db = fb.db;
    this.uid = user.uid;
    this.unsubs = [];
    this.h = null;
  }
  CloudStore.prototype._col = function (name) { return this.fs.collection(this.db, 'users', this.uid, name); };
  CloudStore.prototype._doc = function (name, id) { return this.fs.doc(this.db, 'users', this.uid, name, id); };
  CloudStore.prototype.start = function (handlers) {
    var self = this, fs = this.fs;
    this.h = handlers;
    var sync = { notesPending: false, foldersPending: false, fromCache: true };
    function emitSync() { handlers.onSync({ pending: sync.notesPending || sync.foldersPending, fromCache: sync.fromCache }); }
    this.unsubs.push(fs.onSnapshot(this._col('notes'), { includeMetadataChanges: true }, function (snap) {
      handlers.onNotes(snap.docs.map(function (d) { var o = d.data(); o.id = d.id; return o; }));
      sync.notesPending = snap.metadata.hasPendingWrites;
      sync.fromCache = snap.metadata.fromCache;
      emitSync();
    }, function (e) { self._err(e); }));
    this.unsubs.push(fs.onSnapshot(this._col('folders'), { includeMetadataChanges: true }, function (snap) {
      handlers.onFolders(snap.docs.map(function (d) { var o = d.data(); o.id = d.id; return o; }));
      sync.foldersPending = snap.metadata.hasPendingWrites;
      emitSync();
    }, function (e) { self._err(e); }));
  };
  CloudStore.prototype.stop = function () { this.unsubs.forEach(function (u) { u(); }); this.unsubs = []; };
  // 저장 명령은 기다리지 않습니다. 인터넷이 끊겨 있으면 기기에 쌓였다가 연결되면 자동으로 올라갑니다.
  CloudStore.prototype.saveNote = function (note) {
    var n = clean(note); delete n.id;
    this.fs.setDoc(this._doc('notes', note.id), n).catch(this._err.bind(this));
  };
  CloudStore.prototype.deleteNote = function (id) {
    this.fs.deleteDoc(this._doc('notes', id)).catch(this._err.bind(this));
  };
  CloudStore.prototype.saveFolder = function (folder) {
    var f = clean(folder); delete f.id;
    this.fs.setDoc(this._doc('folders', folder.id), f).catch(this._err.bind(this));
  };
  CloudStore.prototype.deleteFolder = function (id) {
    this.fs.deleteDoc(this._doc('folders', id)).catch(this._err.bind(this));
  };
  CloudStore.prototype.putFile = async function (id, blob) {
    var buf = new Uint8Array(await blob.arrayBuffer());
    var count = Math.max(1, Math.ceil(buf.length / CHUNK));
    for (var i = 0; i < count; i++) {
      var part = buf.subarray(i * CHUNK, Math.min(buf.length, (i + 1) * CHUNK));
      this.fs.setDoc(this._doc('chunks', id + '_' + i), {
        fileId: id, idx: i, data: this.fs.Bytes.fromUint8Array(part)
      }).catch(this._err.bind(this));
    }
    return count;
  };
  CloudStore.prototype.getFile = async function (meta) {
    var fs = this.fs, self = this, parts = [];
    for (var i = 0; i < (meta.chunks || 1); i++) {
      var snap = await fs.getDoc(self._doc('chunks', meta.id + '_' + i));
      if (!snap.exists()) throw new Error('not-found');
      parts.push(snap.data().data.toUint8Array());
    }
    return new Blob(parts, { type: meta.type || 'application/octet-stream' });
  };
  CloudStore.prototype.deleteFile = function (meta) {
    for (var i = 0; i < (meta.chunks || 1); i++) {
      this.fs.deleteDoc(this._doc('chunks', meta.id + '_' + i)).catch(this._err.bind(this));
    }
  };
  CloudStore.prototype._err = function (e) { if (this.h && this.h.onError) this.h.onError(e); };

  window.MyNoteStore = { LocalStore: LocalStore, CloudStore: CloudStore, initFirebase: initFirebase, SDK_VERSION: FIREBASE_SDK };
})();
