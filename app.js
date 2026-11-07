/* ===== 마이노트 앱 =====
 * 이 파일은 고칠 필요가 없습니다. 설정은 firebase-config.js 한 곳에서만 합니다.
 */
(function () {
  'use strict';

  var APP_VERSION = '1.0.0';
  var MAX_FILE = 5 * 1024 * 1024; // 첨부 파일 1개 최대 5MB
  var TRASH_DAYS = 30;

  /* ---------------- 글꼴·크기·색 목록 ---------------- */
  var FONTS = [
    { label: '기본 글꼴', value: 'inherit' },
    { label: '노토 산스', value: 'Noto Sans KR' },
    { label: '나눔고딕', value: 'Nanum Gothic' },
    { label: '나눔명조', value: 'Nanum Myeongjo' },
    { label: '고운돋움', value: 'Gowun Dodum' },
    { label: '나눔펜 손글씨', value: 'Nanum Pen Script' },
    { label: '개구 손글씨', value: 'Gaegu' }
  ];
  var APP_FONTS = FONTS.slice(1);
  var SIZES = [12, 14, 16, 18, 20, 24, 28, 36];
  var TEXT_COLORS = [
    { name: '기본', value: 'var(--ink)' },
    { name: '빨강', value: '#E53935' }, { name: '주황', value: '#F57C00' }, { name: '노랑', value: '#C9A100' },
    { name: '초록', value: '#2E9E4F' }, { name: '파랑', value: '#1E73E8' }, { name: '남색', value: '#3949AB' },
    { name: '보라', value: '#8E44CF' }, { name: '분홍', value: '#D81B78' }, { name: '회색', value: '#8A8A8A' }
  ];
  var HILITE_COLORS = [
    { name: '없음', value: 'transparent' },
    { name: '노랑', value: 'rgba(255,214,0,.45)' }, { name: '연두', value: 'rgba(120,220,90,.40)' },
    { name: '하늘', value: 'rgba(80,170,255,.35)' }, { name: '분홍', value: 'rgba(255,100,160,.35)' },
    { name: '주황', value: 'rgba(255,150,40,.40)' }
  ];
  var NOTE_COLORS = [
    { name: '기본', key: '' }, { name: '노랑', key: 'yellow' }, { name: '초록', key: 'green' },
    { name: '파랑', key: 'blue' }, { name: '분홍', key: 'pink' }, { name: '보라', key: 'purple' }, { name: '회색', key: 'gray' }
  ];
  var FOLDER_COLORS = ['#F08A24', '#E53935', '#2E9E4F', '#1E73E8', '#8E44CF', '#D81B78', '#00897B', '#8A8A8A'];
  var ACCENTS = [
    { name: '주황', value: '#F08A24' }, { name: '파랑', value: '#2D7FF9' }, { name: '초록', value: '#23A26D' },
    { name: '보라', value: '#8B5CF6' }, { name: '분홍', value: '#E8508A' }, { name: '회색', value: '#6B7280' }
  ];

  /* ---------------- 아이콘 ---------------- */
  var I = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    star: '<path d="M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.7L12 16.8 6.9 19.5l1-5.7-4.1-4 5.7-.8z"/>',
    clip: '<path d="M20 11.5l-7.8 7.8a5 5 0 01-7.1-7.1l8.2-8.2a3.3 3.3 0 014.7 4.7l-8.2 8.2a1.7 1.7 0 01-2.4-2.4l7.6-7.6"/>',
    more: '<circle cx="12" cy="5.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="18.5" r="1.4" fill="currentColor" stroke="none"/>',
    trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6"/>',
    folder: '<path d="M3.5 6.5A1.5 1.5 0 015 5h4.5l2 2.5H19a1.5 1.5 0 011.5 1.5v8.5A1.5 1.5 0 0119 19H5a1.5 1.5 0 01-1.5-1.5z"/>',
    notes: '<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    list: '<rect x="4" y="4.5" width="16" height="6" rx="1.5"/><rect x="4" y="13.5" width="16" height="6" rx="1.5"/>',
    sort: '<path d="M7 4v16M3.5 16.5L7 20l3.5-3.5M17 20V4M13.5 7.5L17 4l3.5 3.5"/>',
    settings: '<path d="M4 7h9M18 7h2M4 17h3M12 17h8"/><circle cx="15.5" cy="7" r="2.3"/><circle cx="9.5" cy="17" r="2.3"/>',
    bold: '<path d="M7.5 4.5h5.5a3.75 3.75 0 010 7.5H7.5zM7.5 12h6.5a3.75 3.75 0 010 7.5H7.5z" stroke-width="2.3"/>',
    italic: '<path d="M10 4.5h8M6 19.5h8M14 4.5l-4 15"/>',
    underline: '<path d="M7 4v7a5 5 0 0010 0V4M5 20h14"/>',
    strike: '<path d="M4 12h16M16.5 7.5c0-1.9-2-3.5-4.5-3.5S7.5 5.4 7.5 7.5M8 16c.3 2 2 3.5 4.5 3.5s4.5-1.5 4.5-3.5"/>',
    color: '<path d="M7.5 15L12 4l4.5 11M9.1 11h5.8"/>',
    hilite: '<path d="M14.5 4.5l5 5-8 8H6.5v-5z"/>',
    alignL: '<path d="M4 6h16M4 10h10M4 14h16M4 18h10"/>',
    alignC: '<path d="M4 6h16M7 10h10M4 14h16M7 18h10"/>',
    alignR: '<path d="M4 6h16M10 10h10M4 14h16M10 18h10"/>',
    ul: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.2" fill="currentColor"/><circle cx="4.5" cy="12" r="1.2" fill="currentColor"/><circle cx="4.5" cy="18" r="1.2" fill="currentColor"/>',
    ol: '<path d="M10 6h10M10 12h10M10 18h10M4 4.5h1.5V9M3.8 9h3.2M3.8 14.2a1.5 1.5 0 012.9.6L4 19h3"/>',
    check: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><path d="M5.2 7l1.4 1.4 2.4-2.6M13.5 7H20M13.5 17H20"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/>',
    clear: '<path d="M5 5h11M10.5 5L8 19M14 13l6 6M20 13l-6 6"/>',
    undo: '<path d="M9 6L4.5 10.5 9 15"/><path d="M5 10.5h9a5 5 0 010 10h-3"/>',
    redo: '<path d="M15 6l4.5 4.5L15 15"/><path d="M19 10.5h-9a5 5 0 000 10h3"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    file: '<path d="M6 3.5h8l4.5 4.5v12.5H6z"/><path d="M14 3.5V8h4.5"/>',
    cloud: '<path d="M7 18.5a4.5 4.5 0 01-.6-9 6 6 0 0111.5 1.6 3.8 3.8 0 01-.4 7.4z"/>',
    cloudOff: '<path d="M7 18.5a4.5 4.5 0 01-.6-9 6 6 0 0111.5 1.6 3.8 3.8 0 01-.4 7.4zM4 4l16 16"/>',
    device: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>',
    sync: '<path d="M20 12a8 8 0 01-14 5.3M4 12a8 8 0 0114-5.3M18 3v4h-4M6 21v-4h4"/>',
    palette: '<path d="M12 3.5a8.5 8.5 0 100 17c1.2 0 1.8-.8 1.8-1.7 0-1.2-1-1.6-1-2.6 0-.9.7-1.6 1.7-1.6H17a3.5 3.5 0 003.5-3.5c0-4.3-3.8-7.6-8.5-7.6z"/><circle cx="7.5" cy="11" r="1" fill="currentColor"/><circle cx="10" cy="7.5" r="1" fill="currentColor"/><circle cx="14.5" cy="7.5" r="1" fill="currentColor"/>',
    restore: '<path d="M4 12a8 8 0 108-8 8 8 0 00-6 2.7M4 4v4h4"/>',
    download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
    open: '<path d="M14 4h6v6M20 4l-9 9M18 14v5.5H4.5V6H10"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.5v.5"/>',
    edit: '<path d="M4.5 19.5l1-4.5L16 4.5l3.5 3.5L9 18.5z"/>',
    logout: '<path d="M14 4.5H6v15h8M10 12h10M16.5 8.5L20 12l-3.5 3.5"/>',
    backup: '<path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M5 14v5.5h14V14"/>'
  };
  function ic(name, fill) {
    return '<svg class="ic" viewBox="0 0 24 24" fill="' + (fill ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + I[name] + '</svg>';
  }

  /* ---------------- 도우미 ---------------- */
  var $ = function (id) { return document.getElementById(id); };
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 10); }
  function fmtSize(b) { return b < 1024 ? b + 'B' : b < 1048576 ? (b / 1024).toFixed(0) + 'KB' : (b / 1048576).toFixed(1) + 'MB'; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmtDate(t, full) {
    if (!t) return '';
    var d = new Date(t), now = new Date();
    var hm = pad(d.getHours()) + ':' + pad(d.getMinutes());
    if (full) return d.getFullYear() + '. ' + (d.getMonth() + 1) + '. ' + d.getDate() + '. ' + hm;
    if (d.toDateString() === now.toDateString()) return hm;
    if (d.getFullYear() === now.getFullYear()) return (d.getMonth() + 1) + '월 ' + d.getDate() + '일';
    return d.getFullYear() + '. ' + (d.getMonth() + 1) + '. ' + d.getDate() + '.';
  }
  var toastTimer;
  function toast(msg, ms) {
    var t = $('toast'); t.textContent = msg; t.classList.remove('hidden');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.add('hidden'); }, ms || 2600);
  }
  function isWide() { return window.matchMedia('(min-width: 1024px)').matches; }

  /* 붙여 넣거나 불러온 내용에서 위험한 부분 제거 */
  function sanitize(html) {
    var doc = new DOMParser().parseFromString('<div>' + (html || '') + '</div>', 'text/html');
    var root = doc.body.firstChild;
    if (!root) return '';
    root.querySelectorAll('script,style,iframe,object,embed,link,meta,form,input,textarea,button,select,svg,math,img,video,audio,source,base').forEach(function (e) { e.remove(); });
    root.querySelectorAll('*').forEach(function (e) {
      Array.prototype.slice.call(e.attributes).forEach(function (a) {
        var n = a.name.toLowerCase();
        if (n !== 'style' && n !== 'class') e.removeAttribute(a.name);
        else if (n === 'style' && /url\s*\(|expression/i.test(a.value)) e.removeAttribute(a.name);
      });
    });
    return root.innerHTML;
  }

  /* ---------------- 설정 (기기별로 저장) ---------------- */
  var DEFAULT_SETTINGS = { theme: 'system', accent: '#F08A24', font: 'Noto Sans KR', size: 16, layout: 'grid', sort: 'updated' };
  var settings = (function () {
    try { return Object.assign({}, DEFAULT_SETTINGS, JSON.parse(localStorage.getItem('mynote-settings') || '{}')); }
    catch (e) { return Object.assign({}, DEFAULT_SETTINGS); }
  })();
  function saveSettings() { try { localStorage.setItem('mynote-settings', JSON.stringify(settings)); } catch (e) { /* 저장 불가 환경 */ } applySettings(); }
  var darkMQ = window.matchMedia('(prefers-color-scheme: dark)');
  function applySettings() {
    var root = document.documentElement;
    var dark = settings.theme === 'dark' || (settings.theme === 'system' && darkMQ.matches);
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    root.style.setProperty('--accent', settings.accent);
    root.style.setProperty('--app-font', "'" + settings.font + "', system-ui, -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif");
    root.style.setProperty('--editor-size', settings.size + 'px');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#1E1E1E' : '#FFFFFF');
    $('noteList').className = 'note-list ' + (settings.layout === 'list' ? 'list' : 'grid');
    $('layoutBtn').innerHTML = ic(settings.layout === 'list' ? 'grid' : 'list');
  }
  darkMQ.addEventListener && darkMQ.addEventListener('change', applySettings);

  /* ---------------- 상태 ---------------- */
  var store = null, fb = null, currentUser = null;
  var state = {
    notes: new Map(), folders: new Map(),
    view: { type: 'all', folderId: null },
    query: '',
    currentId: null, draft: null, dirty: false, shownAt: 0,
    sync: { local: true }, online: navigator.onLine,
    purged: false
  };

  /* ================= 시작 ================= */
  function boot() {
    applySettings();
    setupStaticIcons();
    bindUI();
    registerSW();
    var cfg = window.FIREBASE_CONFIG;
    var cloud = cfg && cfg.apiKey && cfg.projectId && String(cfg.apiKey).indexOf('여기') === -1;
    if (!cloud) {
      store = new window.MyNoteStore.LocalStore();
      startStore();
      return;
    }
    window.MyNoteStore.initFirebase(cfg).then(function (f) {
      fb = f;
      fb.authM.onAuthStateChanged(fb.auth, function (user) {
        if (user) {
          currentUser = user;
          if (store && store.stop) store.stop();
          store = new window.MyNoteStore.CloudStore(fb, user);
          startStore();
        } else {
          currentUser = null;
          if (store && store.stop) store.stop();
          store = null;
          showLogin();
        }
      });
    }).catch(function (e) {
      console.error(e);
      $('bootMsg').innerHTML = '연동 모듈을 불러오지 못했습니다.<br>처음 한 번은 인터넷에 연결된 상태에서 열어 주세요.<br><br><small>' + String(e && e.message || e).replace(/</g, '&lt;') + '</small>';
    });
  }

  function startStore() {
    state.notes.clear(); state.folders.clear(); state.purged = false;
    $('bootView').classList.add('hidden');
    $('loginView').classList.add('hidden');
    $('mainView').classList.remove('hidden');
    Promise.resolve(store.start({
      onNotes: function (list) {
        state.notes = new Map(list.map(function (n) { return [n.id, n]; }));
        if (!state.purged) { state.purged = true; purgeOldTrash(); }
        refreshOpenNoteFromRemote();
        renderAll();
      },
      onFolders: function (list) {
        state.folders = new Map(list.map(function (f) { return [f.id, f]; }));
        renderAll();
        if (state.currentId) renderFolderSelect();
      },
      onSync: function (s) { state.sync = s; renderSync(); },
      onError: function (e) {
        console.error(e);
        var code = (e && e.code) || '';
        if (code === 'permission-denied') toast('저장 권한이 없습니다. Firebase 보안 규칙(가이드 2단계)을 확인하세요.', 6000);
        else if (code === 'resource-exhausted') toast('오늘 무료 사용량을 다 썼습니다. 내일 다시 동기화됩니다.', 6000);
        else if (String(e && e.message).indexOf('QuotaExceeded') !== -1) toast('기기 저장 공간이 부족합니다.', 5000);
      }
    })).catch(function (e) { console.error(e); toast('저장소를 열지 못했습니다. 브라우저의 비공개(시크릿) 창이 아닌지 확인하세요.', 6000); });
    renderDrawerFoot();
  }

  /* ================= 로그인 ================= */
  function showLogin() {
    $('bootView').classList.add('hidden');
    $('mainView').classList.add('hidden');
    $('loginView').classList.remove('hidden');
    $('loginMsg').textContent = navigator.onLine ? '' : '지금은 인터넷이 끊겨 있습니다. 첫 로그인은 인터넷이 필요합니다.';
  }
  function authErr(e) {
    var c = (e && e.code) || '';
    var map = {
      'auth/invalid-email': '이메일 형식이 올바르지 않습니다.',
      'auth/invalid-credential': '이메일 또는 비밀번호가 맞지 않습니다.',
      'auth/wrong-password': '이메일 또는 비밀번호가 맞지 않습니다.',
      'auth/user-not-found': '이메일 또는 비밀번호가 맞지 않습니다.',
      'auth/missing-password': '비밀번호를 입력하세요.',
      'auth/email-already-in-use': '이미 가입된 이메일입니다. 로그인 버튼을 누르세요.',
      'auth/weak-password': '비밀번호는 6자 이상이어야 합니다.',
      'auth/network-request-failed': '인터넷 연결을 확인하세요.',
      'auth/too-many-requests': '시도가 너무 많습니다. 잠시 뒤 다시 해 보세요.',
      'auth/operation-not-allowed': 'Firebase에서 이메일/비밀번호 로그인이 꺼져 있습니다. (가이드 2단계)',
      'auth/admin-restricted-operation': '새 계정 만들기가 막혀 있습니다. Firebase 설정을 확인하세요.',
      'auth/unauthorized-domain': '이 주소가 Firebase 승인 도메인에 없습니다. (가이드 4단계)',
      'auth/api-key-not-valid.-please-pass-a-valid-api-key.': 'firebase-config.js의 apiKey 값이 틀렸습니다. (가이드 3단계)'
    };
    return map[c] || ('오류가 났습니다: ' + (c || (e && e.message) || e));
  }
  function doLogin(signup) {
    var email = $('loginEmail').value.trim(), pw = $('loginPw').value;
    if (!email || !pw) { $('loginMsg').textContent = '이메일과 비밀번호를 입력하세요.'; return; }
    $('loginMsg').textContent = '확인 중…';
    var fn = signup ? fb.authM.createUserWithEmailAndPassword : fb.authM.signInWithEmailAndPassword;
    fn(fb.auth, email, pw).then(function () { $('loginMsg').textContent = ''; $('loginPw').value = ''; })
      .catch(function (e) { $('loginMsg').textContent = authErr(e); });
  }

  /* ================= 목록 그리기 ================= */
  function visibleNotes() {
    var q = state.query.trim().toLowerCase();
    var v = state.view;
    var arr = Array.from(state.notes.values()).filter(function (n) {
      if (q) return !n.trashed && ((n.title || '') + '\n' + (n.text || '')).toLowerCase().indexOf(q) !== -1;
      if (v.type === 'trash') return n.trashed;
      if (n.trashed) return false;
      if (v.type === 'fav') return n.favorite;
      if (v.type === 'folder') return n.folderId === v.folderId;
      if (v.type === 'none') return !n.folderId || !state.folders.has(n.folderId);
      return true;
    });
    var s = settings.sort;
    arr.sort(function (a, b) {
      if (s === 'title') return (a.title || a.text || '').localeCompare(b.title || b.text || '', 'ko');
      if (s === 'created') return (b.createdAt || 0) - (a.createdAt || 0);
      return (b.updatedAt || 0) - (a.updatedAt || 0);
    });
    return arr;
  }
  function viewTitle() {
    if (state.query.trim()) return '검색 결과';
    var v = state.view;
    if (v.type === 'fav') return '즐겨찾기';
    if (v.type === 'trash') return '휴지통';
    if (v.type === 'none') return '폴더 없음';
    if (v.type === 'folder') { var f = state.folders.get(v.folderId); return f ? f.name : '폴더'; }
    return '모든 노트';
  }
  function renderAll() { renderList(); renderDrawer(); }

  function renderList() {
    var list = $('noteList'), notes = visibleNotes();
    $('viewTitle').textContent = viewTitle();
    $('countLabel').textContent = '노트 ' + notes.length + '개';
    $('trashBar').classList.toggle('hidden', !(state.view.type === 'trash' && !state.query.trim()));
    $('fab').classList.toggle('hidden', state.view.type === 'trash');
    list.textContent = '';
    notes.forEach(function (n) {
      var c = el('div', 'card');
      c.setAttribute('role', 'button'); c.tabIndex = 0;
      if (n.color) c.setAttribute('data-nc', n.color);
      if (n.id === state.currentId) c.classList.add('selected');
      var firstLine = (n.text || '').split('\n')[0];
      c.appendChild(el('div', 'card-title', n.title || firstLine || '제목 없음'));
      var body = n.title ? (n.text || '') : (n.text || '').split('\n').slice(1).join('\n');
      c.appendChild(el('div', 'card-body', body.slice(0, 300)));
      var foot = el('div', 'card-foot');
      var f = n.folderId && state.folders.get(n.folderId);
      if (f) { var d = el('span', 'fdot'); d.style.background = f.color; d.title = f.name; foot.appendChild(d); }
      if (n.favorite) { var s = el('span', 'star'); s.innerHTML = ic('star', true); foot.appendChild(s); }
      if (n.attachments && n.attachments.length) { var a = el('span'); a.innerHTML = ic('clip'); foot.appendChild(a); }
      foot.appendChild(el('span', 'date', fmtDate(n.updatedAt)));
      c.appendChild(foot);
      c.addEventListener('click', function () { onCardClick(n.id); });
      c.addEventListener('keydown', function (e) { if (e.key === 'Enter') onCardClick(n.id); });
      list.appendChild(c);
    });
    var em = $('emptyMsg');
    if (!notes.length) {
      em.classList.remove('hidden');
      em.textContent = state.query.trim() ? '"' + state.query.trim() + '"에 맞는 노트가 없습니다.'
        : state.view.type === 'trash' ? '휴지통이 비어 있습니다.'
          : '노트가 없습니다.\n오른쪽 아래 + 버튼을 눌러 첫 노트를 만들어 보세요.';
      em.style.whiteSpace = 'pre-line';
    } else em.classList.add('hidden');
  }

  function navItem(icon, label, count, active, onClick, dotColor) {
    var b = el('button', 'nav-item' + (active ? ' active' : ''));
    if (dotColor) { var d = el('span', 'dot'); d.style.background = dotColor; b.appendChild(d); }
    else { var i = el('span'); i.innerHTML = ic(icon); b.appendChild(i); }
    b.appendChild(el('span', 'nav-label', label));
    if (count != null) b.appendChild(el('span', 'count', String(count)));
    b.appendChild(el('span', 'more-space'));
    b.addEventListener('click', onClick);
    return b;
  }
  function renderDrawer() {
    var nav = $('drawerNav'); nav.textContent = '';
    var all = Array.from(state.notes.values());
    var live = all.filter(function (n) { return !n.trashed; });
    var v = state.view;
    function go(view) { return function () { state.view = view; state.query = ''; $('searchInput').value = ''; $('searchBar').classList.add('hidden'); closeDrawer(); renderAll(); }; }
    nav.appendChild(navItem('notes', '모든 노트', live.length, v.type === 'all', go({ type: 'all' })));
    nav.appendChild(navItem('star', '즐겨찾기', live.filter(function (n) { return n.favorite; }).length, v.type === 'fav', go({ type: 'fav' })));
    var t = el('div', 'nav-title'); t.appendChild(el('span', null, '폴더'));
    var addB = el('button', null, '+ 폴더 추가'); addB.addEventListener('click', function () { editFolder(null); }); t.appendChild(addB);
    nav.appendChild(t);
    var folders = Array.from(state.folders.values()).sort(function (a, b) { return (a.createdAt || 0) - (b.createdAt || 0); });
    folders.forEach(function (f) {
      var b = navItem(null, f.name, live.filter(function (n) { return n.folderId === f.id; }).length,
        v.type === 'folder' && v.folderId === f.id, go({ type: 'folder', folderId: f.id }), f.color);
      var m = el('span', 'icon-btn more'); m.innerHTML = ic('more'); m.title = '폴더 편집';
      m.addEventListener('click', function (e) { e.stopPropagation(); folderMenu(f); });
      b.replaceChild(m, b.querySelector('.more-space'));
      nav.appendChild(b);
    });
    var none = live.filter(function (n) { return !n.folderId || !state.folders.has(n.folderId); }).length;
    nav.appendChild(navItem('folder', '폴더 없음', none, v.type === 'none', go({ type: 'none' })));
    nav.appendChild(el('div', 'nav-title', ' '));
    nav.appendChild(navItem('trash', '휴지통', all.length - live.length, v.type === 'trash', go({ type: 'trash' })));
  }
  function renderDrawerFoot() {
    var f = $('drawerFoot');
    if (store && store.mode === 'cloud' && currentUser) f.textContent = '연동 계정: ' + (currentUser.email || '');
    else f.textContent = '이 기기에만 저장 중 (로컬 모드)\nPC·휴대폰 연동은 가이드 2~4단계를 따라 설정하세요.';
    f.style.whiteSpace = 'pre-line';
  }
  function renderSync() {
    var p = $('syncPill'), s = state.sync;
    p.classList.remove('off');
    if (!store || store.mode === 'local') { p.innerHTML = ic('device') + '<span>이 기기에만 저장</span>'; return; }
    if (!state.online) { p.classList.add('off'); p.innerHTML = ic('cloudOff') + '<span>오프라인 · 연결되면 자동 동기화</span>'; return; }
    if (s.pending) { p.innerHTML = ic('sync') + '<span>동기화 중…</span>'; return; }
    if (s.fromCache) { p.innerHTML = ic('sync') + '<span>서버에 연결 중…</span>'; return; }
    p.innerHTML = ic('cloud') + '<span>동기화됨</span>';
  }

  /* ================= 서랍(메뉴) ================= */
  function openDrawer() { $('mainView').classList.add('drawer-open'); }
  function closeDrawer() { $('mainView').classList.remove('drawer-open'); }

  /* ================= 폴더 ================= */
  function editFolder(folder) {
    var body = el('div');
    var inp = el('input'); inp.type = 'text'; inp.placeholder = '폴더 이름'; inp.value = folder ? folder.name : ''; inp.maxLength = 40;
    body.appendChild(inp);
    var chosen = folder ? folder.color : FOLDER_COLORS[0];
    var sw = el('div', 'swatches'); sw.style.marginTop = '14px';
    FOLDER_COLORS.forEach(function (c) {
      var s = el('button', 'sw' + (c === chosen ? ' sel' : '')); s.style.background = c; s.title = c;
      s.addEventListener('click', function () { chosen = c; sw.querySelectorAll('.sw').forEach(function (x) { x.classList.remove('sel'); }); s.classList.add('sel'); });
      sw.appendChild(s);
    });
    body.appendChild(sw);
    openSheet(folder ? '폴더 편집' : '새 폴더', body, [
      { label: '취소' },
      { label: '저장', primary: true, run: function () {
        var name = inp.value.trim();
        if (!name) { toast('폴더 이름을 입력하세요.'); return false; }
        var f = folder ? Object.assign({}, folder) : { id: 'f_' + uid(), createdAt: Date.now() };
        f.name = name; f.color = chosen;
        store.saveFolder(f);
        if (!folder) { state.view = { type: 'folder', folderId: f.id }; closeDrawer(); }
      } }
    ]);
    setTimeout(function () { inp.focus(); }, 50);
  }
  function folderMenu(f) {
    var body = el('div');
    body.appendChild(menuItem('edit', '이름·색 바꾸기', function () { closeSheet(); editFolder(f); }));
    body.appendChild(menuItem('trash', '폴더 삭제 (노트는 "폴더 없음"으로 이동)', function () {
      closeSheet();
      state.notes.forEach(function (n) { if (n.folderId === f.id) { var c = Object.assign({}, n, { folderId: null }); store.saveNote(c); } });
      store.deleteFolder(f.id);
      if (state.view.folderId === f.id) state.view = { type: 'all' };
      toast('폴더를 삭제했습니다.');
    }, true));
    openSheet(f.name, body, [{ label: '닫기' }]);
  }

  /* ================= 노트 열기·저장 ================= */
  function onCardClick(id) {
    var n = state.notes.get(id);
    if (!n) return;
    if (n.trashed) { trashMenu(n); return; }
    openNote(n);
  }
  function newNote() {
    var now = Date.now();
    var folderId = state.view.type === 'folder' ? state.view.folderId : null;
    var n = { id: 'n_' + uid(), title: '', html: '', text: '', folderId: folderId, favorite: state.view.type === 'fav',
      color: '', trashed: false, trashedAt: null, createdAt: now, updatedAt: now, attachments: [] };
    state.draft = n;
    openNote(n, true);
  }
  function getCurrent() {
    if (!state.currentId) return null;
    return state.notes.get(state.currentId) || (state.draft && state.draft.id === state.currentId ? state.draft : null);
  }
  function openNote(n, isNew) {
    if (state.currentId && state.currentId !== n.id) flushSave(true);
    state.currentId = n.id;
    if (!isNew) state.draft = null;
    $('editorEmpty').classList.add('hidden');
    $('editorBox').classList.remove('hidden');
    $('noteTitle').value = n.title || '';
    $('editor').innerHTML = sanitize(n.html);
    state.shownAt = n.updatedAt || 0;
    state.dirty = false;
    renderEditorMeta();
    updatePlaceholder();
    var wasEditing = $('mainView').classList.contains('editing');
    $('mainView').classList.add('editing');
    if (!isWide() && !wasEditing) { try { history.pushState({ mynote: 'editor' }, ''); } catch (e) { /* 무시 */ } }
    $('editorScroll').scrollTop = 0;
    renderList();
    if (isNew) setTimeout(function () { $('editor').focus(); }, 60);
  }
  function renderEditorMeta() {
    var n = getCurrent(); if (!n) return;
    renderFolderSelect();
    $('noteDate').textContent = '수정 ' + fmtDate(n.updatedAt, true);
    $('favBtn').innerHTML = ic('star', !!n.favorite);
    $('favBtn').classList.toggle('on', !!n.favorite);
    var box = $('editorBox');
    if (n.color) box.setAttribute('data-nc', n.color); else box.removeAttribute('data-nc');
    renderAttachments();
  }
  function renderFolderSelect() {
    var n = getCurrent(); if (!n) return;
    var sel = $('noteFolder'); sel.textContent = '';
    var o = el('option', null, '폴더 없음'); o.value = ''; sel.appendChild(o);
    Array.from(state.folders.values()).sort(function (a, b) { return (a.createdAt || 0) - (b.createdAt || 0); }).forEach(function (f) {
      var op = el('option', null, f.name); op.value = f.id; sel.appendChild(op);
    });
    sel.value = n.folderId && state.folders.has(n.folderId) ? n.folderId : '';
  }
  function closeEditor() {
    flushSave(true);
    state.currentId = null; state.draft = null;
    $('mainView').classList.remove('editing');
    $('editorBox').classList.add('hidden');
    $('editorEmpty').classList.remove('hidden');
    hidePalette();
    renderList();
  }
  function isEmptyNote(n) { return !(n.title || '').trim() && !(n.text || '').trim() && !(n.attachments && n.attachments.length); }

  var saveTimer = null;
  function markDirty() {
    state.dirty = true;
    updatePlaceholder();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () { flushSave(false); }, 700);
  }
  function collectText() {
    return ($('editor').innerText || '').replace(/​/g, '').replace(/\n{3,}/g, '\n\n').trim();
  }
  function flushSave(leaving) {
    clearTimeout(saveTimer);
    var n = getCurrent();
    if (!n) return;
    if (!state.dirty) {
      if (leaving && n === state.draft && isEmptyNote(n)) state.draft = null;
      return;
    }
    var updated = Object.assign({}, n, {
      title: $('noteTitle').value.trim(),
      html: sanitize($('editor').innerHTML),
      text: collectText(),
      updatedAt: Date.now()
    });
    state.dirty = false;
    var persisted = state.notes.has(n.id);
    if (isEmptyNote(updated)) {
      if (persisted && leaving) { store.deleteNote(n.id); }
      else if (!persisted) { state.draft = leaving ? null : updated; return; }
      else { store.saveNote(updated); }
      return;
    }
    state.shownAt = updated.updatedAt;
    state.notes.set(n.id, updated);
    if (state.draft && state.draft.id === n.id) state.draft = null;
    store.saveNote(updated);
    $('noteDate').textContent = '수정 ' + fmtDate(updated.updatedAt, true);
  }
  /* 노트의 다른 속성(즐겨찾기·폴더·색·첨부)을 바꾸고 바로 저장 */
  function patchCurrent(patch) {
    var n = getCurrent(); if (!n) return;
    var updated = Object.assign({}, n, patch, {
      title: $('noteTitle').value.trim(), html: sanitize($('editor').innerHTML), text: collectText(), updatedAt: Date.now()
    });
    state.dirty = false;
    state.shownAt = updated.updatedAt;
    state.notes.set(n.id, updated);
    if (state.draft && state.draft.id === n.id) state.draft = null;
    store.saveNote(updated);
    renderEditorMeta();
  }
  /* 다른 기기에서 같은 노트를 고쳤을 때: 지금 이 기기에서 쓰는 중이 아니면 화면을 새로 고침 */
  function refreshOpenNoteFromRemote() {
    var n = state.currentId && state.notes.get(state.currentId);
    if (!n) return;
    var editing = document.activeElement === $('editor') || document.activeElement === $('noteTitle');
    if ((n.updatedAt || 0) > state.shownAt && !state.dirty && !editing) {
      $('noteTitle').value = n.title || '';
      $('editor').innerHTML = sanitize(n.html);
      state.shownAt = n.updatedAt;
      updatePlaceholder();
    }
    renderEditorMeta();
  }
  function updatePlaceholder() {
    var ed = $('editor');
    var empty = !ed.textContent.replace(/​/g, '').trim() && !ed.querySelector('li');
    ed.classList.toggle('empty', empty);
  }

  /* ================= 휴지통 ================= */
  function moveToTrash() {
    var n = getCurrent(); if (!n) return;
    flushSave(false);
    if (!state.notes.has(n.id)) { state.dirty = false; state.draft = null; closeEditorOrBack(); return; }
    patchCurrent({ trashed: true, trashedAt: Date.now() });
    closeEditorOrBack();
    toast('휴지통으로 옮겼습니다.');
  }
  function closeEditorOrBack() {
    if (!isWide() && history.state && history.state.mynote === 'editor') history.back();
    else closeEditor();
  }
  function trashMenu(n) {
    var body = el('div');
    body.appendChild(el('p', 'set-note', (n.title || (n.text || '').slice(0, 40) || '제목 없음') + ' · 삭제 ' + fmtDate(n.trashedAt, true)));
    body.appendChild(menuItem('restore', '복원', function () {
      closeSheet(); store.saveNote(Object.assign({}, n, { trashed: false, trashedAt: null })); toast('노트를 복원했습니다.');
    }));
    body.appendChild(menuItem('trash', '영구 삭제', function () {
      closeSheet(); deleteForever(n); toast('영구 삭제했습니다.');
    }, true));
    openSheet('휴지통의 노트', body, [{ label: '닫기' }]);
  }
  function deleteForever(n) {
    (n.attachments || []).forEach(function (a) { store.deleteFile(a); });
    store.deleteNote(n.id);
  }
  function purgeOldTrash() {
    var limit = Date.now() - TRASH_DAYS * 864e5;
    state.notes.forEach(function (n) { if (n.trashed && n.trashedAt && n.trashedAt < limit) deleteForever(n); });
  }

  /* ================= 첨부 파일 ================= */
  function renderAttachments() {
    var n = getCurrent(), box = $('attachList'); box.textContent = '';
    if (!n) return;
    (n.attachments || []).forEach(function (a) {
      var c = el('button', 'chip'); c.title = a.name;
      c.innerHTML = ic('file');
      c.appendChild(el('span', 'name', a.name));
      c.appendChild(el('span', 'size', fmtSize(a.size)));
      c.addEventListener('click', function () { attachMenu(a); });
      box.appendChild(c);
    });
  }
  function addFiles(files) {
    var n = getCurrent(); if (!n || !files || !files.length) return;
    var list = Array.prototype.slice.call(files);
    var tooBig = list.filter(function (f) { return f.size > MAX_FILE; });
    if (tooBig.length) toast('5MB가 넘는 파일은 첨부할 수 없습니다: ' + tooBig.map(function (f) { return f.name; }).join(', '), 4500);
    list = list.filter(function (f) { return f.size <= MAX_FILE; });
    if (!list.length) return;
    toast('첨부하는 중…');
    Promise.all(list.map(function (f) {
      var id = 'a_' + uid();
      return store.putFile(id, f).then(function (chunks) {
        return { id: id, name: f.name, size: f.size, type: f.type || 'application/octet-stream', chunks: chunks, addedAt: Date.now() };
      });
    })).then(function (metas) {
      var cur = getCurrent(); if (!cur) return;
      patchCurrent({ attachments: (cur.attachments || []).concat(metas) });
      toast(metas.length + '개 파일을 첨부했습니다.');
    }).catch(function (e) { console.error(e); toast('첨부하지 못했습니다: ' + (e.message || e)); });
  }
  function loadFile(a) {
    return store.getFile(a).catch(function (e) {
      toast(state.online ? '파일을 불러오지 못했습니다.' : '이 파일은 아직 이 기기에 내려받지 않았습니다. 인터넷에 연결한 뒤 다시 열어 주세요.', 5000);
      throw e;
    });
  }
  function attachMenu(a) {
    var body = el('div');
    body.appendChild(el('p', 'set-note', a.name + ' · ' + fmtSize(a.size)));
    body.appendChild(menuItem('open', '열기', function () {
      var win = window.open('', '_blank');
      loadFile(a).then(function (blob) {
        var url = URL.createObjectURL(blob);
        if (win) win.location.href = url; else window.location.href = url;
        setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
      }).catch(function () { if (win) win.close(); });
      closeSheet();
    }));
    body.appendChild(menuItem('download', '기기에 저장', function () {
      loadFile(a).then(function (blob) {
        var url = URL.createObjectURL(blob), link = document.createElement('a');
        link.href = url; link.download = a.name; document.body.appendChild(link); link.click(); link.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
      }).catch(function () { /* 안내는 loadFile에서 */ });
      closeSheet();
    }));
    body.appendChild(menuItem('trash', '첨부 삭제', function () {
      var cur = getCurrent(); if (!cur) return;
      store.deleteFile(a);
      patchCurrent({ attachments: (cur.attachments || []).filter(function (x) { return x.id !== a.id; }) });
      closeSheet(); toast('첨부를 삭제했습니다.');
    }, true));
    openSheet('첨부 파일', body, [{ label: '닫기' }]);
  }

  /* ================= 서식 (색상·글씨체·크기) ================= */
  var savedRange = null;
  document.addEventListener('selectionchange', function () {
    var sel = window.getSelection();
    // 도구 막대(글꼴·크기 선택 상자)로 초점이 옮겨 갈 때 선택 영역을 잃지 않도록 편집 칸에 초점이 있을 때만 기억함
    if (sel.rangeCount && document.activeElement === $('editor') && $('editor').contains(sel.anchorNode)) {
      savedRange = sel.getRangeAt(0).cloneRange();
      updateToolbarState();
    }
  });
  function restoreRange() {
    var ed = $('editor');
    ed.focus({ preventScroll: true });
    if (savedRange && ed.contains(savedRange.startContainer)) {
      var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(savedRange);
    } else {
      var r = document.createRange(); r.selectNodeContents(ed); r.collapse(false);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    }
  }
  function exec(cmd, val, css) {
    restoreRange();
    try { document.execCommand('styleWithCSS', false, !!css); } catch (e) { /* 무시 */ }
    document.execCommand(cmd, false, val == null ? null : val);
    rememberRange();
  }
  /* 지금 선택 영역을 바로 기억 (글자를 바꾼 직후에는 예전에 기억한 위치가 틀어지므로) */
  function rememberRange() {
    var sel = window.getSelection();
    if (sel.rangeCount && $('editor').contains(sel.anchorNode)) savedRange = sel.getRangeAt(0).cloneRange();
  }
  /* 선택이 없을 때(커서만 있을 때)는 보이지 않는 글자를 담은 칸을 만들어 그 뒤부터 서식이 적용되게 함 */
  function caretSpan(style) {
    restoreRange();
    var sel = window.getSelection(); if (!sel.rangeCount) return;
    var r = sel.getRangeAt(0);
    var span = document.createElement('span');
    Object.keys(style).forEach(function (k) { span.style[k] = style[k]; });
    var t = document.createTextNode('​'); span.appendChild(t);
    r.insertNode(span);
    var nr = document.createRange(); nr.setStart(t, 1); nr.collapse(true);
    sel.removeAllRanges(); sel.addRange(nr);
    savedRange = nr.cloneRange();
  }
  /* execCommand가 만든 <font> 태그를 <span style>로 바꿈 */
  var SENTINEL = '#010203';
  function convertFonts(style) {
    var ed = $('editor'), made = [];
    ed.querySelectorAll('font').forEach(function (f) {
      var s = document.createElement('span');
      if (f.hasAttribute('face')) s.style.fontFamily = style.fontFamily || f.getAttribute('face');
      if (f.hasAttribute('color')) s.style.color = style.color || f.getAttribute('color');
      if (f.hasAttribute('size')) s.style.fontSize = style.fontSize || '';
      while (f.firstChild) s.appendChild(f.firstChild);
      f.replaceWith(s);
      made.push(s);
      // 안쪽에 남아 있는 같은 종류의 서식은 지워서 새로 고른 값이 보이게 함
      s.querySelectorAll('span').forEach(function (inner) {
        if (style.fontFamily) inner.style.fontFamily = '';
        if (style.color) inner.style.color = '';
        if (style.fontSize) inner.style.fontSize = '';
        if (!inner.getAttribute('style')) inner.removeAttribute('style');
      });
    });
    if (made.length) {
      var r = document.createRange();
      r.setStartBefore(made[0]); r.setEndAfter(made[made.length - 1]);
      var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      savedRange = r.cloneRange();
    }
  }
  function applyInline(kind, value) {
    restoreRange();
    var sel = window.getSelection();
    var collapsed = !sel.rangeCount || sel.getRangeAt(0).collapsed;
    var style = {};
    if (kind === 'font') style.fontFamily = value;
    if (kind === 'size') style.fontSize = value;
    if (kind === 'color') style.color = value;
    if (collapsed) { caretSpan(style); markDirty(); return; }
    if (kind === 'font') exec('fontName', value === 'inherit' ? 'inherit' : value, false);
    if (kind === 'size') exec('fontSize', '7', false);
    if (kind === 'color') exec('foreColor', SENTINEL, false);
    convertFonts(style);
    markDirty();
  }
  function applyHilite(value) {
    restoreRange();
    var sel = window.getSelection();
    if (!sel.rangeCount || sel.getRangeAt(0).collapsed) { caretSpan({ backgroundColor: value }); markDirty(); return; }
    exec('hiliteColor', value, true);
    markDirty();
  }
  function selectionAncestor(tag) {
    var sel = window.getSelection(); if (!sel.rangeCount) return null;
    var node = sel.anchorNode, ed = $('editor');
    while (node && node !== ed) { if (node.nodeName === tag) return node; node = node.parentNode; }
    return null;
  }
  function toggleChecklist() {
    restoreRange();
    var ul = selectionAncestor('UL');
    if (ul && ul.classList.contains('checklist')) { exec('insertUnorderedList'); }
    else if (ul) { ul.classList.add('checklist'); }
    else { exec('insertUnorderedList'); var u = selectionAncestor('UL'); if (u) u.classList.add('checklist'); }
    markDirty();
  }
  function toggleBullets() {
    restoreRange();
    var ul = selectionAncestor('UL');
    if (ul && ul.classList.contains('checklist')) ul.classList.remove('checklist');
    else exec('insertUnorderedList');
    markDirty();
  }
  function updateToolbarState() {
    ['bold', 'italic', 'underline', 'strikeThrough'].forEach(function (c) {
      var b = document.querySelector('.tb[data-cmd="' + c + '"]');
      try { b.classList.toggle('on', document.queryCommandState(c)); } catch (e) { /* 무시 */ }
    });
    // 완료한 체크리스트 줄의 취소선은 서식이 아니므로 취소선 버튼을 켜진 것으로 보이지 않게 함
    var li = selectionAncestor('LI');
    if (li && li.classList.contains('done')) document.querySelector('.tb[data-cmd="strikeThrough"]').classList.remove('on');
  }

  /* 팔레트 (글자 색 / 형광펜) */
  function showPalette(kind) {
    var p = $('palette');
    if (!p.classList.contains('hidden') && p.dataset.kind === kind) { hidePalette(); return; }
    p.dataset.kind = kind; p.textContent = '';
    p.appendChild(el('h3', null, kind === 'color' ? '글자 색' : '형광펜 색'));
    var sw = el('div', 'swatches');
    (kind === 'color' ? TEXT_COLORS : HILITE_COLORS).forEach(function (c) {
      var b = el('button', 'sw'); b.title = c.name;
      if (kind === 'color') { b.style.background = c.value === 'var(--ink)' ? 'var(--surface)' : c.value; if (c.value === 'var(--ink)') b.textContent = '기본'; }
      else { b.style.background = c.value; if (c.value === 'transparent') b.textContent = '없음'; }
      keepFocus(b);
      b.addEventListener('click', function () {
        if (kind === 'color') applyInline('color', c.value); else applyHilite(c.value);
        hidePalette();
      });
      sw.appendChild(b);
    });
    p.appendChild(sw);
    if (kind === 'color') {
      var row = el('label', 'sw-custom'); row.appendChild(el('span', null, '직접 고르기'));
      var inp = el('input'); inp.type = 'color'; inp.value = '#E53935';
      inp.addEventListener('change', function () { applyInline('color', inp.value); hidePalette(); });
      row.appendChild(inp); p.appendChild(row);
    }
    p.classList.remove('hidden');
  }
  /* 버튼을 눌러도 편집 칸의 커서·선택이 사라지지 않게 함 */
  function keepFocus(b) {
    b.addEventListener('pointerdown', function (e) { e.preventDefault(); });
    b.addEventListener('mousedown', function (e) { e.preventDefault(); });
  }
  function hidePalette() { $('palette').classList.add('hidden'); }

  /* ================= 노트 더보기 메뉴 ================= */
  function noteMoreMenu() {
    var n = getCurrent(); if (!n) return;
    var body = el('div');
    body.appendChild(el('p', 'set-note', '노트 배경색'));
    var sw = el('div', 'swatches'); sw.style.margin = '6px 0 12px';
    NOTE_COLORS.forEach(function (c) {
      var b = el('button', 'sw' + ((n.color || '') === c.key ? ' sel' : '')); b.title = c.name;
      if (c.key) b.setAttribute('data-nc', c.key); else b.textContent = '기본';
      b.addEventListener('click', function () { patchCurrent({ color: c.key }); closeSheet(); });
      sw.appendChild(b);
    });
    body.appendChild(sw);
    body.appendChild(menuItem('info', '노트 정보', function () {
      closeSheet();
      var cur = getCurrent(); var info = el('div');
      [['만든 날짜', fmtDate(cur.createdAt, true)], ['수정한 날짜', fmtDate(cur.updatedAt, true)],
        ['글자 수', String(collectText().replace(/\s/g, '').length) + '자'], ['첨부 파일', String((cur.attachments || []).length) + '개']].forEach(function (r) {
        var row = el('div', 'set-row'); row.appendChild(el('span', null, r[0])); row.appendChild(el('div', null, r[1])); info.appendChild(row);
      });
      openSheet('노트 정보', info, [{ label: '닫기' }]);
    }));
    body.appendChild(menuItem('trash', '휴지통으로 이동', function () { closeSheet(); moveToTrash(); }, true));
    openSheet('노트 메뉴', body, [{ label: '닫기' }]);
  }

  /* ================= 설정 화면 ================= */
  function seg(options, current, onPick) {
    var s = el('div', 'seg');
    options.forEach(function (o) {
      var b = el('button', o[0] === current ? 'on' : null, o[1]);
      b.addEventListener('click', function () { s.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on'); onPick(o[0]); });
      s.appendChild(b);
    });
    return s;
  }
  function setRow(label, control, note) {
    var r = el('div', 'set-row'); r.appendChild(el('span', null, label)); r.appendChild(control);
    if (note) r.appendChild(el('p', 'set-note', note));
    return r;
  }
  function openSettings() {
    closeDrawer();
    var body = el('div');
    body.appendChild(setRow('화면 모드', seg([['system', '시스템'], ['light', '밝게'], ['dark', '어둡게']], settings.theme, function (v) { settings.theme = v; saveSettings(); })));
    var acc = el('div', 'swatches');
    ACCENTS.forEach(function (a) {
      var b = el('button', 'sw' + (a.value === settings.accent ? ' sel' : '')); b.style.background = a.value; b.title = a.name;
      b.addEventListener('click', function () { settings.accent = a.value; saveSettings(); acc.querySelectorAll('.sw').forEach(function (x) { x.classList.remove('sel'); }); b.classList.add('sel'); });
      acc.appendChild(b);
    });
    body.appendChild(setRow('테마 색', acc));
    var fs = el('select');
    APP_FONTS.forEach(function (f) { var o = el('option', null, f.label); o.value = f.value; o.style.fontFamily = f.value; fs.appendChild(o); });
    fs.value = settings.font;
    fs.addEventListener('change', function () { settings.font = fs.value; saveSettings(); });
    body.appendChild(setRow('기본 글꼴', fs, '앱 화면과 노트 본문의 기본 글꼴입니다. 일부 글자만 바꾸려면 편집 화면 아래 도구 막대를 쓰세요.'));
    var ss = el('select');
    SIZES.forEach(function (s) { var o = el('option', null, s + 'px'); o.value = String(s); ss.appendChild(o); });
    ss.value = String(settings.size);
    ss.addEventListener('change', function () { settings.size = Number(ss.value); saveSettings(); });
    body.appendChild(setRow('기본 글자 크기', ss));
    body.appendChild(setRow('목록 보기', seg([['grid', '격자'], ['list', '목록']], settings.layout, function (v) { settings.layout = v; saveSettings(); renderList(); })));
    body.appendChild(setRow('정렬', seg([['updated', '수정일'], ['created', '만든 날짜'], ['title', '제목']], settings.sort, function (v) { settings.sort = v; saveSettings(); renderList(); })));
    var bk = el('div'); bk.style.display = 'flex'; bk.style.gap = '8px';
    var ex = el('button', 'btn small', '내보내기'); ex.addEventListener('click', exportBackup);
    var im = el('button', 'btn small', '가져오기'); im.addEventListener('click', function () { $('importInput').click(); });
    bk.appendChild(ex); bk.appendChild(im);
    body.appendChild(setRow('백업', bk, '모든 노트·폴더·첨부를 파일 하나(.json)로 저장하거나 되살립니다.'));
    if (store && store.mode === 'cloud') {
      var lo = el('button', 'btn small danger', '로그아웃');
      lo.addEventListener('click', function () { flushSave(true); closeSheet(); closeEditor(); fb.authM.signOut(fb.auth); });
      body.appendChild(setRow('계정', lo, (currentUser && currentUser.email || '') + ' 로 연동 중'));
    } else {
      body.appendChild(setRow('계정', el('div', null, '로컬 모드'), '지금은 노트가 이 기기에만 저장됩니다. PC·휴대폰 연동은 가이드의 2~4단계를 따라 firebase-config.js를 채우면 켜집니다.'));
    }
    body.appendChild(setRow('버전', el('div', null, '마이노트 ' + APP_VERSION + ' · Firebase SDK ' + window.MyNoteStore.SDK_VERSION)));
    openSheet('설정', body, [{ label: '닫기', primary: true }]);
  }

  /* ================= 백업 ================= */
  function blobToB64(blob) {
    return new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(String(r.result).split(',')[1] || ''); }; r.onerror = rej; r.readAsDataURL(blob); });
  }
  function exportBackup() {
    flushSave(false);
    toast('백업 파일을 만드는 중…');
    var notes = Array.from(state.notes.values()), files = {}, jobs = [];
    notes.forEach(function (n) {
      (n.attachments || []).forEach(function (a) {
        jobs.push(store.getFile(a).then(blobToB64).then(function (b) { files[a.id] = b; }).catch(function () { /* 내려받지 못한 첨부는 건너뜀 */ }));
      });
    });
    Promise.all(jobs).then(function () {
      var data = { app: 'mynote', version: 1, exportedAt: new Date().toISOString(), folders: Array.from(state.folders.values()), notes: notes, files: files };
      var blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      var d = new Date(), name = '마이노트-백업-' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + '.json';
      var url = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
      var missing = jobs.length - Object.keys(files).length;
      toast(missing ? '백업했습니다. (이 기기에 없는 첨부 ' + missing + '개는 빠짐)' : '백업 파일을 저장했습니다.', 4000);
    });
  }
  function importBackup(file) {
    var r = new FileReader();
    r.onload = function () {
      var data;
      try { data = JSON.parse(r.result); } catch (e) { toast('백업 파일을 읽지 못했습니다.'); return; }
      if (!data || data.app !== 'mynote') { toast('마이노트 백업 파일이 아닙니다.'); return; }
      (data.folders || []).forEach(function (f) { store.saveFolder(f); });
      var jobs = [];
      (data.notes || []).forEach(function (n) {
        (n.attachments || []).forEach(function (a) {
          var b64 = data.files && data.files[a.id];
          if (!b64) return;
          var bin = atob(b64), u8 = new Uint8Array(bin.length);
          for (var i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
          jobs.push(store.putFile(a.id, new Blob([u8], { type: a.type })).then(function (c) { a.chunks = c; }));
        });
      });
      Promise.all(jobs).then(function () {
        (data.notes || []).forEach(function (n) { store.saveNote(n); });
        toast('노트 ' + (data.notes || []).length + '개를 가져왔습니다.', 3500);
      });
    };
    r.readAsText(file);
  }

  /* ================= 공용 팝업 ================= */
  function menuItem(icon, label, run, danger) {
    var b = el('button', 'menu-item' + (danger ? ' danger' : ''));
    var i = el('span'); i.innerHTML = ic(icon); b.appendChild(i); b.appendChild(el('span', null, label));
    b.addEventListener('click', run);
    return b;
  }
  function openSheet(title, bodyEl, actions) {
    $('sheetTitle').textContent = title;
    var body = $('sheetBody'); body.textContent = ''; body.appendChild(bodyEl);
    var act = $('sheetActions'); act.textContent = '';
    (actions || []).forEach(function (a) {
      var b = el('button', 'btn' + (a.primary ? ' primary' : ''), a.label);
      b.addEventListener('click', function () { if (a.run && a.run() === false) return; closeSheet(); });
      act.appendChild(b);
    });
    $('sheetWrap').classList.remove('hidden');
  }
  function closeSheet() { $('sheetWrap').classList.add('hidden'); }

  /* ================= 화면 연결 ================= */
  function setupStaticIcons() {
    $('menuBtn').innerHTML = ic('menu'); $('searchBtn').innerHTML = ic('search'); $('sortBtn').innerHTML = ic('sort');
    $('settingsBtn').innerHTML = ic('settings'); $('fab').innerHTML = ic('plus');
    $('backBtn').innerHTML = ic('back'); $('attachBtn').innerHTML = ic('clip'); $('noteMoreBtn').innerHTML = ic('more');
    $('undoBtn').innerHTML = ic('undo'); $('redoBtn').innerHTML = ic('redo');
    var map = { bold: 'bold', italic: 'italic', underline: 'underline', strikeThrough: 'strike', justifyLeft: 'alignL', justifyCenter: 'alignC', justifyRight: 'alignR', insertOrderedList: 'ol' };
    document.querySelectorAll('.tb[data-cmd]').forEach(function (b) { b.innerHTML = ic(map[b.dataset.cmd]); });
    $('colorBtn').innerHTML = ic('color').replace('</svg>', '<rect x="5" y="18" width="14" height="3" rx="1" fill="#E53935" stroke="none"/></svg>');
    $('hiliteBtn').innerHTML = ic('hilite').replace('</svg>', '<rect x="4" y="19" width="16" height="3" rx="1" fill="#FFD600" stroke="none"/></svg>');
    $('checkBtn').innerHTML = ic('check'); $('ulBtn').innerHTML = ic('ul'); $('clearBtn').innerHTML = ic('clear');
    var fsel = $('fontSel');
    var f0 = el('option', null, '글꼴'); f0.value = ''; fsel.appendChild(f0);
    FONTS.forEach(function (f) { var o = el('option', null, f.label); o.value = f.value; fsel.appendChild(o); });
    var ssel = $('sizeSel');
    var o0 = el('option', null, '크기'); o0.value = ''; ssel.appendChild(o0);
    SIZES.forEach(function (s) { var o = el('option', null, String(s)); o.value = String(s); ssel.appendChild(o); });
    var od = el('option', null, '기본'); od.value = 'inherit'; ssel.appendChild(od);
  }

  function bindUI() {
    // 로그인
    $('loginBtn').addEventListener('click', function () { doLogin(false); });
    $('signupBtn').addEventListener('click', function () { doLogin(true); });
    $('loginPw').addEventListener('keydown', function (e) { if (e.key === 'Enter') doLogin(false); });
    $('resetBtn').addEventListener('click', function () {
      var email = $('loginEmail').value.trim();
      if (!email) { $('loginMsg').textContent = '위에 이메일을 먼저 입력하세요.'; return; }
      fb.authM.sendPasswordResetEmail(fb.auth, email).then(function () { $('loginMsg').textContent = '비밀번호 재설정 메일을 보냈습니다. 메일함(스팸함 포함)을 확인하세요.'; })
        .catch(function (e) { $('loginMsg').textContent = authErr(e); });
    });

    // 목록 화면
    $('menuBtn').addEventListener('click', openDrawer);
    $('scrim').addEventListener('click', closeDrawer);
    $('settingsBtn').addEventListener('click', openSettings);
    $('fab').addEventListener('click', newNote);
    $('searchBtn').addEventListener('click', function () {
      var bar = $('searchBar'); bar.classList.toggle('hidden');
      if (!bar.classList.contains('hidden')) $('searchInput').focus();
      else { state.query = ''; $('searchInput').value = ''; renderList(); }
    });
    $('searchInput').addEventListener('input', function () { state.query = this.value; renderList(); });
    $('layoutBtn').addEventListener('click', function () { settings.layout = settings.layout === 'list' ? 'grid' : 'list'; saveSettings(); });
    $('sortBtn').addEventListener('click', function () {
      var body = el('div');
      [['updated', '수정한 날짜순'], ['created', '만든 날짜순'], ['title', '제목순']].forEach(function (o) {
        body.appendChild(menuItem(settings.sort === o[0] ? 'check' : 'sort', o[1], function () { settings.sort = o[0]; saveSettings(); renderList(); closeSheet(); }));
      });
      openSheet('정렬', body, [{ label: '닫기' }]);
    });
    $('emptyTrashBtn').addEventListener('click', function () {
      var t = Array.from(state.notes.values()).filter(function (n) { return n.trashed; });
      if (!t.length) return;
      openSheet('휴지통 비우기', el('p', null, '휴지통의 노트 ' + t.length + '개를 영구 삭제합니다. 되돌릴 수 없습니다.'), [
        { label: '취소' }, { label: '영구 삭제', primary: true, run: function () { t.forEach(deleteForever); toast('휴지통을 비웠습니다.'); } }
      ]);
    });

    // 편집 화면
    $('backBtn').addEventListener('click', closeEditorOrBack);
    window.addEventListener('popstate', function () { if ($('mainView').classList.contains('editing') && !isWide()) closeEditor(); });
    $('noteTitle').addEventListener('input', markDirty);
    $('noteTitle').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); $('editor').focus(); } });
    var ed = $('editor');
    ed.addEventListener('input', function (e) {
      if (e.inputType === 'insertParagraph') {
        var li = selectionAncestor('LI');
        if (li && li.classList.contains('done') && !li.textContent.replace(/​/g, '').trim()) li.classList.remove('done');
      }
      rememberRange();
      markDirty();
    });
    ['keyup', 'mouseup', 'touchend', 'focus'].forEach(function (ev) { ed.addEventListener(ev, function () { setTimeout(rememberRange, 0); }); });
    ed.addEventListener('keydown', function () { setTimeout(rememberRange, 0); });
    ed.addEventListener('paste', function (e) {
      e.preventDefault();
      var files = e.clipboardData && e.clipboardData.files;
      if (files && files.length) { addFiles(files); return; }
      var text = (e.clipboardData || window.clipboardData).getData('text/plain');
      document.execCommand('insertText', false, text);
    });
    ed.addEventListener('drop', function (e) {
      var dt = e.dataTransfer; if (!dt) return;
      if (dt.files && dt.files.length) { e.preventDefault(); addFiles(dt.files); return; }
      if (Array.prototype.indexOf.call(dt.types || [], 'text/html') !== -1) { e.preventDefault(); ed.focus(); document.execCommand('insertText', false, dt.getData('text/plain')); }
    });
    ed.addEventListener('click', function (e) {
      var li = e.target.closest && e.target.closest('ul.checklist > li');
      if (li && e.clientX - li.getBoundingClientRect().left < 26) { li.classList.toggle('done'); markDirty(); }
    });
    $('editorScroll').addEventListener('click', function (e) { if (e.target === this) { ed.focus(); } });
    $('editorScroll').addEventListener('pointerdown', hidePalette);
    $('favBtn').addEventListener('click', function () { var n = getCurrent(); if (n) patchCurrent({ favorite: !n.favorite }); });
    $('noteFolder').addEventListener('change', function () { patchCurrent({ folderId: this.value || null }); });
    $('attachBtn').addEventListener('click', function () { $('fileInput').click(); });
    $('fileInput').addEventListener('change', function () { addFiles(this.files); this.value = ''; });
    $('noteMoreBtn').addEventListener('click', noteMoreMenu);
    $('undoBtn').addEventListener('click', function () { exec('undo'); markDirty(); });
    $('redoBtn').addEventListener('click', function () { exec('redo'); markDirty(); });
    ['undoBtn', 'redoBtn'].forEach(function (id) { keepFocus($(id)); });

    // 도구 막대: 누를 때 커서가 사라지지 않게 함
    document.querySelectorAll('#toolbar .tb').forEach(keepFocus);
    document.querySelectorAll('.tb[data-cmd]').forEach(function (b) {
      b.addEventListener('click', function () {
        var c = b.dataset.cmd;
        exec(c, null, c.indexOf('justify') === 0);
        markDirty(); updateToolbarState();
      });
    });
    $('fontSel').addEventListener('change', function () { if (this.value) applyInline('font', this.value); this.value = ''; });
    $('sizeSel').addEventListener('change', function () { if (this.value) applyInline('size', this.value === 'inherit' ? 'inherit' : this.value + 'px'); this.value = ''; });
    $('colorBtn').addEventListener('click', function () { showPalette('color'); });
    $('hiliteBtn').addEventListener('click', function () { showPalette('hilite'); });
    $('checkBtn').addEventListener('click', toggleChecklist);
    $('ulBtn').addEventListener('click', toggleBullets);
    $('clearBtn').addEventListener('click', function () {
      restoreRange();
      var sel = window.getSelection();
      if (sel.rangeCount && !sel.getRangeAt(0).collapsed) {
        exec('removeFormat');
        // removeFormat이 지우지 못하는 span 서식(글꼴·크기·색)도 지움
        var r = sel.getRangeAt(0);
        ed.querySelectorAll('span[style]').forEach(function (s) { if (r.intersectsNode(s)) s.removeAttribute('style'); });
        markDirty();
      } else toast('서식을 지울 글자를 먼저 선택하세요.');
    });

    // 팝업 바깥을 누르면 닫기
    $('sheetWrap').addEventListener('click', function (e) { if (e.target === this) closeSheet(); });
    $('importInput').addEventListener('change', function () { if (this.files[0]) importBackup(this.files[0]); this.value = ''; closeSheet(); });

    // 키보드: Esc
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (!$('sheetWrap').classList.contains('hidden')) closeSheet();
        else if (!$('palette').classList.contains('hidden')) hidePalette();
        else if ($('mainView').classList.contains('drawer-open')) closeDrawer();
      }
    });

    // 인터넷 연결 상태
    window.addEventListener('online', function () { state.online = true; renderSync(); toast('인터넷에 다시 연결되었습니다. 동기화합니다.'); });
    window.addEventListener('offline', function () { state.online = false; renderSync(); toast('인터넷이 끊겼습니다. 계속 쓰면 연결된 뒤 동기화됩니다.', 3500); });

    // 앱을 닫거나 다른 앱으로 넘어갈 때 바로 저장
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') flushSave(false); });
    window.addEventListener('pagehide', function () { flushSave(false); });
    window.addEventListener('resize', function () { if (isWide()) closeDrawer(); });
  }

  /* ================= 오프라인용 서비스 워커 ================= */
  function registerSW() {
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
      navigator.serviceWorker.register('./sw.js').catch(function (e) { console.warn('서비스 워커 등록 실패', e); });
    }
  }

  /* 휴대폰 키보드가 올라와도 서식 도구 막대가 키보드 위에 보이도록 화면 높이를 맞춤 */
  (function fitViewport() {
    var vv = window.visualViewport; if (!vv) return;
    function fit() {
      var r = document.documentElement;
      r.style.setProperty('--vvh', vv.height + 'px');
      r.style.setProperty('--vvtop', vv.offsetTop + 'px');
    }
    vv.addEventListener('resize', fit); vv.addEventListener('scroll', fit); fit();
  })();

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  // 시험용 (개발자 도구에서 확인할 때만 사용)
  window.__mynote = { state: state, settings: settings, sanitize: sanitize };
})();
