/* ===== 마이노트 앱 =====
 * 이 파일은 고칠 필요가 없습니다. 설정은 firebase-config.js 한 곳에서만 합니다.
 */
(function () {
  'use strict';

  var APP_VERSION = '1.5.0';
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
    { label: '개구 손글씨', value: 'Gaegu' },
    { label: '고운바탕', value: 'Gowun Batang' },
    { label: '도현', value: 'Do Hyeon' },
    { label: '주아', value: 'Jua' },
    { label: '나눔붓글씨', value: 'Nanum Brush Script' },
    { label: '하이멜로디', value: 'Hi Melody' }
  ];
  var APP_FONTS = FONTS.slice(1);
  var SIZES = [12, 14, 16, 18, 20, 24, 28, 36];
  var GRID_SIZES = [['s', '작게'], ['m', '보통'], ['l', '크게'], ['xl', '아주 크게']];
  var TEXT_COLORS = [
    { name: '기본', value: 'var(--ink)' },
    { name: '진빨강', value: '#B71C1C' }, { name: '빨강', value: '#E53935' }, { name: '산호', value: '#FF6F61' },
    { name: '진분홍', value: '#AD1457' }, { name: '분홍', value: '#D81B78' },
    { name: '진보라', value: '#6A1B9A' }, { name: '보라', value: '#8E44CF' }, { name: '연보라', value: '#9575CD' },
    { name: '남색', value: '#283593' }, { name: '군청', value: '#3949AB' },
    { name: '진파랑', value: '#0D47A1' }, { name: '파랑', value: '#1E73E8' }, { name: '하늘', value: '#039BE5' },
    { name: '청록', value: '#00838F' }, { name: '에메랄드', value: '#00897B' },
    { name: '진초록', value: '#1B5E20' }, { name: '초록', value: '#2E9E4F' }, { name: '연두', value: '#7CB342' }, { name: '올리브', value: '#827717' },
    { name: '노랑', value: '#C9A100' }, { name: '호박', value: '#FF8F00' }, { name: '주황', value: '#F57C00' }, { name: '진주황', value: '#E65100' },
    { name: '갈색', value: '#8D6E63' }, { name: '진갈색', value: '#5D4037' },
    { name: '회색', value: '#8A8A8A' }, { name: '진회색', value: '#546E7A' }, { name: '검정', value: '#212121' }
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
  var FOLDER_COLORS = [
    '#F08A24', '#FFA000', '#F6B400', '#C0CA33', '#7CB342', '#2E9E4F', '#00897B', '#00ACC1',
    '#039BE5', '#1E73E8', '#3949AB', '#5E35B1', '#8E44CF', '#BA68C8', '#D81B78', '#E53935',
    '#B71C1C', '#FF7043', '#1B5E20', '#0D47A1', '#8D6E63', '#5D4037', '#546E7A', '#8A8A8A',
    '#F8BBD0', '#FFCCBC', '#FFE082', '#C5E1A5', '#B2DFDB', '#B3E5FC', '#D1C4E9', '#CFD8DC'
  ];
  var ACCENTS = [
    { name: '주황', value: '#F08A24' }, { name: '파랑', value: '#2D7FF9' }, { name: '초록', value: '#23A26D' },
    { name: '보라', value: '#8B5CF6' }, { name: '분홍', value: '#E8508A' }, { name: '회색', value: '#6B7280' }
  ];

  /* ---------------- 아이콘 ---------------- */
  var I = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    chevR: '<path d="M9.5 6l6 6-6 6"/>',
    chevD: '<path d="M6 9.5l6 6 6-6"/>',
    home: '<path d="M4 11l8-6.5 8 6.5V20h-5.5v-5.5h-5V20H4z"/>',
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
    backup: '<path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M5 14v5.5h14V14"/>',
    image: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="10" r="1.7"/><path d="M4 17l5-4.5 3.5 3 3-2.5 4.5 4"/>',
    print: '<path d="M7 9V4h10v5M7 17H5a1.5 1.5 0 01-1.5-1.5v-5A1.5 1.5 0 015 9h14a1.5 1.5 0 011.5 1.5v5A1.5 1.5 0 0119 17h-2M7 14h10v6H7z"/>'
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
  function toast(msg, ms, actionLabel, action) {
    var t = $('toast'); t.textContent = msg; t.classList.remove('hidden');
    if (actionLabel) {
      var b = document.createElement('button'); b.textContent = actionLabel;
      b.addEventListener('click', function () { t.classList.add('hidden'); action(); });
      t.appendChild(b);
    }
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.add('hidden'); }, ms || 2600);
  }
  function isWide() { return window.matchMedia('(min-width: 1024px)').matches; }

  /* 붙여 넣거나 불러온 내용에서 위험한 부분 제거 */
  function sanitize(html) {
    var doc = new DOMParser().parseFromString('<div>' + (html || '') + '</div>', 'text/html');
    var root = doc.body.firstChild;
    if (!root) return '';
    root.querySelectorAll('script,style,iframe,object,embed,link,meta,form,input,textarea,button,select,svg,math,video,audio,source,base,picture').forEach(function (e) { e.remove(); });
    root.querySelectorAll('img').forEach(function (img) {
      var id = img.getAttribute('data-img') || '', ch = img.getAttribute('data-chunks') || '1', ty = img.getAttribute('data-type') || 'image/png';
      if (!/^[a-z0-9_]{1,40}$/i.test(id)) { img.remove(); return; }
      Array.prototype.slice.call(img.attributes).forEach(function (a) { img.removeAttribute(a.name); });
      img.setAttribute('data-img', id);
      img.setAttribute('data-chunks', /^\d{1,3}$/.test(ch) ? ch : '1');
      img.setAttribute('data-type', /^image\/[a-z0-9.+-]{1,20}$/i.test(ty) ? ty : 'image/png');
      img.className = 'note-img';
    });
    root.querySelectorAll('*').forEach(function (e) {
      if (e.nodeName === 'IMG') return;
      Array.prototype.slice.call(e.attributes).forEach(function (a) {
        var n = a.name.toLowerCase();
        if (n !== 'style' && n !== 'class') e.removeAttribute(a.name);
        else if (n === 'style' && /url\s*\(|expression/i.test(a.value)) e.removeAttribute(a.name);
      });
    });
    return root.innerHTML;
  }

  /* ---------------- 설정 (기기별로 저장) ---------------- */
  var DEFAULT_SETTINGS = { theme: 'system', accent: '#F08A24', font: 'Noto Sans KR', size: 16, layout: 'grid', sort: 'updated', textColor: '', recentColors: [], gridSize: 'm', subMenu: 'hide', expanded: {}, subGridOpen: true };
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
    root.style.setProperty('--editor-ink', /^#[0-9a-f]{3,8}$/i.test(settings.textColor || '') ? settings.textColor : 'var(--ink)');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#1E1E1E' : '#FFFFFF');
    $('noteList').className = 'note-list ' + (settings.layout === 'list' ? 'list' : 'grid');
    $('noteList').setAttribute('data-size', GRID_SIZES.some(function (g) { return g[0] === settings.gridSize; }) ? settings.gridSize : 'm');
    $('layoutBtn').innerHTML = ic(settings.layout === 'list' ? 'grid' : 'list');
  }
  darkMQ.addEventListener && darkMQ.addEventListener('change', applySettings);

  /* ---------------- 상태 ---------------- */
  var store = null, fb = null, currentUser = null;
  var state = {
    notes: new Map(), folders: new Map(),
    view: { type: 'home', folderId: null },
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

  /* ================= 폴더 모양·색 ================= */
  var FOLDER_SHAPES = [
    { key: 'folder', name: '기본' }, { key: 'round', name: '둥근' }, { key: 'binder', name: '바인더' },
    { key: 'box', name: '상자' }, { key: 'heart', name: '하트' }, { key: 'star', name: '별' }
  ];
  function safeColor(c) { return /^#[0-9a-f]{3,8}$/i.test(c || '') ? c : '#8A8A8A'; }
  function folderShape(f) { var s = f && f.shape; return FOLDER_SHAPES.some(function (x) { return x.key === s; }) ? s : 'folder'; }
  /* 폴더 그림 (가로 56 x 세로 48) */
  function folderSvg(shape, color) {
    var c = safeColor(color), b;
    if (shape === 'round') {
      b = '<path d="M4 14a7 7 0 017-7h11c1.2 0 2.3.5 3 1.3L29 12h16a7 7 0 017 7v18a7 7 0 01-7 7H11a7 7 0 01-7-7z" fill="' + c + '"/>' +
          '<path d="M4 22a7 7 0 017-7h34a7 7 0 017 7v15a7 7 0 01-7 7H11a7 7 0 01-7-7z" fill="#fff" fill-opacity=".25"/>';
    } else if (shape === 'binder') {
      b = '<rect x="6" y="4" width="44" height="40" rx="4" fill="' + c + '"/>' +
          '<path d="M10 4h7v40h-7a4 4 0 01-4-4V8a4 4 0 014-4z" fill="#000" fill-opacity=".16"/>' +
          '<circle cx="13.5" cy="13" r="2.3" fill="#fff"/><circle cx="13.5" cy="24" r="2.3" fill="#fff"/><circle cx="13.5" cy="35" r="2.3" fill="#fff"/>' +
          '<rect x="24" y="12" width="19" height="8" rx="2" fill="#fff" fill-opacity=".75"/>';
    } else if (shape === 'box') {
      b = '<path d="M8 16h40v25a3 3 0 01-3 3H11a3 3 0 01-3-3z" fill="' + c + '"/>' +
          '<path d="M5 9a3 3 0 013-3h40a3 3 0 013 3v7H5z" fill="' + c + '"/><path d="M5 9a3 3 0 013-3h40a3 3 0 013 3v7H5z" fill="#000" fill-opacity=".14"/>' +
          '<path d="M22 24h12" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/>';
    } else if (shape === 'heart') {
      b = '<path d="M28 44S5 31 5 17.5A10.5 10.5 0 0128 11a10.5 10.5 0 0123 6.5C51 31 28 44 28 44z" fill="' + c + '"/>' +
          '<ellipse cx="16" cy="16" rx="4.5" ry="3" fill="#fff" fill-opacity=".35" transform="rotate(-30 16 16)"/>';
    } else if (shape === 'star') {
      b = '<path d="M28 3l7.2 14.6 16.1 2.3-11.6 11.4 2.7 16-14.4-7.6-14.4 7.6 2.7-16L4.7 19.9l16.1-2.3z" fill="' + c + '" stroke="' + c + '" stroke-width="2" stroke-linejoin="round"/>';
    } else {
      b = '<path d="M4 10a3 3 0 013-3h14l5 5h23a3 3 0 013 3v26a3 3 0 01-3 3H7a3 3 0 01-3-3z" fill="' + c + '"/>' +
          '<path d="M4 18a3 3 0 013-3h42a3 3 0 013 3v23a3 3 0 01-3 3H7a3 3 0 01-3-3z" fill="#fff" fill-opacity=".25"/>';
    }
    return '<svg class="fsvg" viewBox="0 0 56 48" aria-hidden="true">' + b + '</svg>';
  }

  /* ================= 폴더 구조 (폴더 안의 폴더) ================= */
  function folderList() { return Array.from(state.folders.values()); }
  function parentOf(f) { return f && f.parentId && f.parentId !== f.id && state.folders.has(f.parentId) ? state.folders.get(f.parentId) : null; }
  function byCreated(a, b) { return (a.createdAt || 0) - (b.createdAt || 0); }
  function childFolders(pid) {
    return folderList().filter(function (f) { var p = parentOf(f); return (p ? p.id : null) === (pid || null); }).sort(function (a, b) { return folderKey(a) - folderKey(b); });
  }
  function folderPath(f) {
    var path = [], guard = 0;
    while (f && guard++ < 30) { path.unshift(f); f = parentOf(f); }
    return path;
  }
  function isInside(f, ancestorId) {
    var cur = parentOf(f), guard = 0;
    while (cur && guard++ < 30) { if (cur.id === ancestorId) return true; cur = parentOf(cur); }
    return false;
  }
  function folderTree() {
    var out = [], seen = {};
    (function walk(pid, depth) {
      childFolders(pid).forEach(function (f) {
        if (seen[f.id]) return; seen[f.id] = true;
        out.push({ f: f, depth: depth }); walk(f.id, depth + 1);
      });
    })(null, 0);
    return out;
  }
  /* 왼쪽 메뉴·옮기기 상자에 보일 폴더: 하위 폴더는 펼친 폴더 아래에만 보임 */
  function visibleFolderTree() {
    var auto = {};
    if (state.view.type === 'folder') {
      folderPath(state.folders.get(state.view.folderId)).slice(0, -1).forEach(function (p) { auto[p.id] = true; });
    }
    var exp = settings.expanded || {}, out = [], seen = {};
    (function walk(pid, depth) {
      childFolders(pid).forEach(function (f) {
        if (seen[f.id]) return; seen[f.id] = true;
        var kids = childFolders(f.id).length;
        var open = settings.subMenu === 'show' || !!exp[f.id] || !!auto[f.id];
        out.push({ f: f, depth: depth, kids: kids, open: open });
        if (kids && open) walk(f.id, depth + 1);
      });
    })(null, 0);
    return out;
  }
  function toggleExpanded(id) {
    var exp = Object.assign({}, settings.expanded || {});
    if (exp[id]) delete exp[id]; else exp[id] = true;
    settings.expanded = exp; saveSettings(); renderDrawer();
  }
  function pathName(f) { return folderPath(f).map(function (x) { return x.name; }).join(' › '); }
  function liveNotes() { return Array.from(state.notes.values()).filter(function (n) { return !n.trashed; }); }

  /* ================= 화면 이동 ================= */
  function goView(view) {
    state.view = view;
    state.query = ''; $('searchInput').value = ''; $('searchBar').classList.add('hidden');
    closeDrawer();
    // 휴대폰의 '뒤로' 버튼으로 상위 폴더·첫 화면으로 돌아가도록 기록을 남김
    if (!isWide() && view.type !== 'home' && !(history.state && history.state.mynote)) {
      try { history.pushState({ mynote: 'view' }, ''); } catch (e) { /* 무시 */ }
    }
    renderAll();
    $('listScroll').scrollTop = 0;
  }
  function goUp() {
    var v = state.view;
    if (v.type === 'folder') {
      var p = parentOf(state.folders.get(v.folderId));
      goView(p ? { type: 'folder', folderId: p.id } : { type: 'home' });
    } else goView({ type: 'home' });
  }

  /* ================= 목록 그리기 ================= */
  function visibleNotes() {
    var q = state.query.trim().toLowerCase();
    var v = state.view;
    if (!q && v.type === 'home') return []; // 첫 화면에는 폴더만 보임
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
      if (s === 'manual') return noteKey(a) - noteKey(b);
      if (s === 'created') return (b.createdAt || 0) - (a.createdAt || 0);
      return (b.updatedAt || 0) - (a.updatedAt || 0);
    });
    return arr;
  }
  function viewTitle() {
    if (state.query.trim()) return '검색 결과';
    var v = state.view;
    if (v.type === 'home') return '마이노트';
    if (v.type === 'all') return '모든 노트';
    if (v.type === 'fav') return '즐겨찾기';
    if (v.type === 'trash') return '휴지통';
    if (v.type === 'none') return '폴더 없음';
    var f = state.folders.get(v.folderId); return f ? f.name : '폴더';
  }
  function renderAll() {
    if (state.view.type === 'folder' && !state.folders.has(state.view.folderId)) state.view = { type: 'home' };
    renderList(); renderDrawer();
  }

  function folderTile(o) {
    var t = el('div', 'ftile' + (o.add ? ' add' : ''));
    t.setAttribute('role', 'button'); t.tabIndex = 0;
    var ico = el('div', 'ftile-ico');
    ico.innerHTML = o.add ? ic('plus') : folderSvg(o.shape, o.color);
    if (o.badge) { var bd = el('span', 'ftile-badge'); bd.innerHTML = ic(o.badge, o.badge === 'star'); ico.appendChild(bd); }
    t.appendChild(ico);
    t.appendChild(el('div', 'ftile-name', o.name));
    if (o.sub) t.appendChild(el('div', 'ftile-sub', o.sub));
    if (o.onMore) {
      var m = el('button', 'icon-btn ftile-more'); m.innerHTML = ic('more'); m.title = '폴더 편집'; m.setAttribute('aria-label', '폴더 편집');
      m.addEventListener('click', function (e) { e.stopPropagation(); o.onMore(); });
      t.appendChild(m);
    }
    if (o.drop !== undefined) t.dataset.drop = o.drop;
    if (o.folderId) { t.dataset.folder = o.folderId; bindDrag(t, 'folder', o.folderId); }
    t.addEventListener('click', o.onClick);
    t.addEventListener('keydown', function (e) { if (e.key === 'Enter') o.onClick(); });
    return t;
  }
  function folderSub(f, live) {
    var n = live.filter(function (x) { return x.folderId === f.id; }).length;
    var k = childFolders(f.id).length;
    return '노트 ' + n + (k ? ' · 폴더 ' + k : '');
  }
  var SYS_COLOR = '#9AA0A6';
  function renderFolderGrid() {
    var grid = $('folderGrid'); grid.textContent = '';
    var v = state.view, live = liveNotes();
    var show = !state.query.trim() && (v.type === 'home' || v.type === 'folder');
    grid.classList.toggle('hidden', !show);
    if (!show) return;
    var parentId = v.type === 'folder' ? v.folderId : null;
    var kids = childFolders(parentId);
    if (v.type === 'folder') {
      if (!kids.length) {
        var addPill = el('button', 'add-pill'); addPill.innerHTML = ic('plus'); addPill.appendChild(el('span', null, '하위 폴더 추가'));
        addPill.addEventListener('click', function () { editFolder(null, parentId); });
        grid.appendChild(addPill);
        return;
      }
      var open = settings.subGridOpen !== false;
      var head = el('button', 'sec-toggle');
      head.innerHTML = ic(open ? 'chevD' : 'chevR');
      head.appendChild(el('span', null, '하위 폴더 ' + kids.length + '개'));
      head.appendChild(el('span', 'sec-hint', open ? '접기' : '펼치기'));
      head.addEventListener('click', function () { settings.subGridOpen = !open; saveSettings(); renderFolderGrid(); });
      grid.appendChild(head);
      if (!open) return;
    }
    if (v.type === 'home') {
      grid.appendChild(folderTile({ shape: 'folder', color: SYS_COLOR, badge: 'notes', name: '모든 노트', sub: '노트 ' + live.length, onClick: function () { goView({ type: 'all' }); } }));
      grid.appendChild(folderTile({ shape: 'folder', color: SYS_COLOR, badge: 'star', name: '즐겨찾기', sub: '노트 ' + live.filter(function (n) { return n.favorite; }).length, onClick: function () { goView({ type: 'fav' }); } }));
    }
    kids.forEach(function (f) {
      grid.appendChild(folderTile({ shape: folderShape(f), color: f.color, name: f.name, sub: folderSub(f, live),
        drop: f.id, folderId: f.id, onClick: function () { goView({ type: 'folder', folderId: f.id }); }, onMore: function () { folderMenu(f); } }));
    });
    if (v.type === 'home') {
      var none = live.filter(function (n) { return !n.folderId || !state.folders.has(n.folderId); }).length;
      if (none) grid.appendChild(folderTile({ shape: 'folder', color: SYS_COLOR, badge: 'folder', name: '폴더 없음', sub: '노트 ' + none, drop: '', onClick: function () { goView({ type: 'none' }); } }));
    }
    grid.appendChild(folderTile({ add: true, name: v.type === 'folder' ? '하위 폴더 추가' : '새 폴더', onClick: function () { editFolder(null, parentId); } }));
  }
  function renderCrumbs(count) {
    var box = $('countLabel'); box.textContent = '';
    var v = state.view;
    if (v.type === 'folder' && !state.query.trim()) {
      var f = state.folders.get(v.folderId);
      var home = el('button', 'crumb', '홈'); home.dataset.dropRoot = ''; home.addEventListener('click', function () { goView({ type: 'home' }); }); box.appendChild(home);
      folderPath(f).forEach(function (p, i, arr) {
        box.appendChild(el('span', 'crumb-sep', '›'));
        if (i === arr.length - 1) box.appendChild(el('span', 'crumb-cur', p.name));
        else { var b = el('button', 'crumb', p.name); b.dataset.drop = p.id; b.addEventListener('click', function () { goView({ type: 'folder', folderId: p.id }); }); box.appendChild(b); }
      });
      box.appendChild(el('span', 'crumb-count', ' · 노트 ' + count + '개'));
    } else if (v.type === 'home' && !state.query.trim()) {
      box.textContent = '폴더 ' + childFolders(null).length + '개';
    } else box.textContent = '노트 ' + count + '개';
  }

  function renderList() {
    var list = $('noteList'), notes = visibleNotes(), v = state.view, q = state.query.trim();
    var title = $('viewTitle'); title.textContent = '';
    if (v.type === 'folder' && !q) {
      var cf = state.folders.get(v.folderId);
      var ti = el('span', 'tico'); ti.innerHTML = folderSvg(folderShape(cf), cf && cf.color); title.appendChild(ti);
    }
    title.appendChild(document.createTextNode(viewTitle()));
    $('upBtn').classList.toggle('hidden', v.type === 'home' && !q);
    renderCrumbs(notes.length);
    renderFolderGrid();
    $('trashBar').classList.toggle('hidden', !(v.type === 'trash' && !q));
    $('fab').classList.toggle('hidden', v.type === 'trash');
    var showLabel = v.type === 'folder' && !q && notes.length > 0;
    $('notesLabel').classList.toggle('hidden', !showLabel);
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
      if (f && !(v.type === 'folder' && v.folderId === f.id && !q)) {
        var chip = el('span', 'fchip'); chip.innerHTML = folderSvg(folderShape(f), f.color);
        chip.appendChild(el('span', null, f.name)); foot.appendChild(chip);
      }
      if (n.favorite) { var s = el('span', 'star'); s.innerHTML = ic('star', true); foot.appendChild(s); }
      if (n.html && n.html.indexOf('data-img') !== -1) { var im = el('span'); im.innerHTML = ic('image'); im.title = '그림 포함'; foot.appendChild(im); }
      if (n.attachments && n.attachments.length) { var a = el('span'); a.innerHTML = ic('clip'); foot.appendChild(a); }
      foot.appendChild(el('span', 'date', fmtDate(n.updatedAt)));
      c.appendChild(foot);
      c.dataset.note = n.id;
      c.addEventListener('click', function () { onCardClick(n.id); });
      if (!n.trashed) bindDrag(c, 'note', n.id);
      c.addEventListener('keydown', function (e) { if (e.key === 'Enter') onCardClick(n.id); });
      list.appendChild(c);
    });
    var em = $('emptyMsg'), msg = '';
    if (!notes.length) {
      if (q) msg = '"' + q + '"에 맞는 노트가 없습니다.';
      else if (v.type === 'trash') msg = '휴지통이 비어 있습니다.';
      else if (v.type === 'folder') { if (!childFolders(v.folderId).length) msg = '이 폴더는 비어 있습니다.\n+ 버튼으로 노트를 만들거나, "하위 폴더 추가"로 폴더 안에 폴더를 만드세요.'; }
      else if (v.type !== 'home') msg = '노트가 없습니다.\n오른쪽 아래 + 버튼을 눌러 노트를 만들어 보세요.';
    }
    em.textContent = msg; em.style.whiteSpace = 'pre-line';
    em.classList.toggle('hidden', !msg);
  }

  function navItem(iconHtml, label, count, active, onClick, depth) {
    var b = el('button', 'nav-item' + (active ? ' active' : ''));
    if (depth) b.style.paddingLeft = (12 + depth * 18) + 'px';
    var i = el('span', 'nav-ico'); i.innerHTML = iconHtml; b.appendChild(i);
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
    function go(view) { return function () { goView(view); }; }
    var homeItem = navItem(ic('home'), '홈 (폴더 보기)', null, v.type === 'home', go({ type: 'home' })); homeItem.dataset.dropRoot = ''; nav.appendChild(homeItem);
    nav.appendChild(navItem(ic('notes'), '모든 노트', live.length, v.type === 'all', go({ type: 'all' })));
    nav.appendChild(navItem(ic('star'), '즐겨찾기', live.filter(function (n) { return n.favorite; }).length, v.type === 'fav', go({ type: 'fav' })));
    var t = el('div', 'nav-title'); t.appendChild(el('span', null, '폴더'));
    var addB = el('button', null, '+ 폴더 추가'); addB.addEventListener('click', function () { editFolder(null, null); }); t.appendChild(addB);
    nav.appendChild(t);
    visibleFolderTree().forEach(function (row) {
      var f = row.f;
      var b = navItem(folderSvg(folderShape(f), f.color), f.name, live.filter(function (n) { return n.folderId === f.id; }).length,
        v.type === 'folder' && v.folderId === f.id, go({ type: 'folder', folderId: f.id }), row.depth);
      b.classList.add('nav-folder'); b.dataset.drop = f.id; b.dataset.folder = f.id; bindDrag(b, 'folder', f.id);
      var chev = el('span', 'chev');
      if (row.kids && settings.subMenu !== 'show') {
        chev.innerHTML = ic(row.open ? 'chevD' : 'chevR');
        chev.title = row.open ? '하위 폴더 접기' : '하위 폴더 ' + row.kids + '개 펼치기';
        chev.setAttribute('role', 'button');
        chev.addEventListener('click', function (e) { e.stopPropagation(); toggleExpanded(f.id); });
      }
      b.insertBefore(chev, b.firstChild);
      var m = el('span', 'icon-btn more'); m.innerHTML = ic('more'); m.title = '폴더 편집';
      m.addEventListener('click', function (e) { e.stopPropagation(); folderMenu(f); });
      b.replaceChild(m, b.querySelector('.more-space'));
      nav.appendChild(b);
    });
    var none = live.filter(function (n) { return !n.folderId || !state.folders.has(n.folderId); }).length;
    var noneItem = navItem(ic('folder'), '폴더 없음', none, v.type === 'none', go({ type: 'none' })); noneItem.dataset.drop = ''; nav.appendChild(noneItem);
    nav.appendChild(el('div', 'nav-title', ' '));
    nav.appendChild(navItem(ic('trash'), '휴지통', all.length - live.length, v.type === 'trash', go({ type: 'trash' })));
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

  /* ================= 폴더 만들기·편집 ================= */
  function editFolder(folder, parentIdDefault) {
    var body = el('div');
    var chosen = { color: folder ? safeColor(folder.color) : FOLDER_COLORS[0], shape: folder ? folderShape(folder) : 'folder' };
    var preview = el('div', 'folder-preview');
    var pv = el('div', 'pv-ico'); preview.appendChild(pv);
    var inp = el('input'); inp.type = 'text'; inp.placeholder = '폴더 이름'; inp.value = folder ? folder.name : ''; inp.maxLength = 40;
    preview.appendChild(inp);
    body.appendChild(preview);

    body.appendChild(el('p', 'set-label', '폴더 모양'));
    var shapes = el('div', 'shape-row');
    body.appendChild(shapes);

    body.appendChild(el('p', 'set-label', '폴더 색'));
    var sw = el('div', 'swatches');
    FOLDER_COLORS.forEach(function (c) {
      var s = el('button', 'sw'); s.style.background = c; s.title = c; s.dataset.c = c;
      s.addEventListener('click', function () { chosen.color = c; refresh(); });
      sw.appendChild(s);
    });
    body.appendChild(sw);
    var row = el('label', 'sw-custom'); row.appendChild(el('span', null, '직접 고르기'));
    var cin = el('input'); cin.type = 'color'; cin.value = /^#[0-9a-f]{6}$/i.test(chosen.color) ? chosen.color : '#F08A24';
    cin.addEventListener('input', function () { chosen.color = cin.value; refresh(); });
    row.appendChild(cin); body.appendChild(row);

    body.appendChild(el('p', 'set-label', '위치 (상위 폴더)'));
    var psel = el('select', 'parent-sel');
    var o0 = el('option', null, '맨 위 (홈)'); o0.value = ''; psel.appendChild(o0);
    folderTree().forEach(function (r) {
      if (folder && (r.f.id === folder.id || isInside(r.f, folder.id))) return; // 자기 자신과 그 안의 폴더는 고를 수 없음
      var op = el('option', null, '  '.repeat(r.depth) + r.f.name); op.value = r.f.id; psel.appendChild(op);
    });
    var curParent = folder ? (parentOf(folder) ? parentOf(folder).id : '') : (parentIdDefault || '');
    psel.value = curParent;
    body.appendChild(psel);

    function refresh() {
      pv.innerHTML = folderSvg(chosen.shape, chosen.color);
      shapes.textContent = '';
      FOLDER_SHAPES.forEach(function (s) {
        var b = el('button', 'shape-opt' + (s.key === chosen.shape ? ' sel' : ''));
        b.innerHTML = folderSvg(s.key, chosen.color); b.appendChild(el('span', null, s.name)); b.title = s.name;
        b.addEventListener('click', function () { chosen.shape = s.key; refresh(); });
        shapes.appendChild(b);
      });
      sw.querySelectorAll('.sw').forEach(function (x) { x.classList.toggle('sel', x.dataset.c === chosen.color); });
    }
    refresh();
    openSheet(folder ? '폴더 편집' : (parentIdDefault ? '하위 폴더 만들기' : '새 폴더'), body, [
      { label: '취소' },
      { label: '저장', primary: true, run: function () {
        var name = inp.value.trim();
        if (!name) { toast('폴더 이름을 입력하세요.'); return false; }
        var f = folder ? Object.assign({}, folder) : { id: 'f_' + uid(), createdAt: Date.now() };
        f.name = name; f.color = chosen.color; f.shape = chosen.shape; f.parentId = psel.value || null;
        store.saveFolder(f);
        toast(folder ? '폴더를 바꿨습니다.' : '"' + name + '" 폴더를 만들었습니다.');
      } }
    ]);
    if (!folder) setTimeout(function () { inp.focus(); }, 50);
  }
  function folderMenu(f) {
    var body = el('div');
    body.appendChild(menuItem('edit', '이름·모양·색·위치 바꾸기', function () { closeSheet(); editFolder(f); }));
    body.appendChild(menuItem('plus', '이 폴더 안에 폴더 만들기', function () { closeSheet(); editFolder(null, f.id); }));
    body.appendChild(menuItem('trash', '폴더 삭제 (안의 노트·폴더는 한 단계 위로 이동)', function () {
      closeSheet();
      var p = parentOf(f), pid = p ? p.id : null;
      state.notes.forEach(function (n) { if (n.folderId === f.id) store.saveNote(Object.assign({}, n, { folderId: pid })); });
      childFolders(f.id).forEach(function (c) { store.saveFolder(Object.assign({}, c, { parentId: pid })); });
      store.deleteFolder(f.id);
      if (state.view.type === 'folder' && state.view.folderId === f.id) goView(pid ? { type: 'folder', folderId: pid } : { type: 'home' });
      toast('폴더를 삭제했습니다.');
    }, true));
    openSheet(f.name, body, [{ label: '닫기' }]);
  }


  /* ================= 끌어서 옮기기 (노트·폴더) =================
   * PC: 마우스로 잡아 끌기 / 휴대폰: 0.4초 길게 누른 뒤 끌기
   * 노트: 폴더 위에 놓으면 그 폴더로 이동, 다른 노트 카드의 앞·뒤에 놓으면 순서 변경
   * 폴더: 다른 폴더 가운데에 놓으면 그 안으로, 폴더의 앞·뒤(가장자리)에 놓으면 순서 변경, "맨 위(홈)"에 놓으면 맨 위로
   */
  var drag = null, suppressClick = false;
  function noteKey(n) { return typeof n.order === 'number' ? n.order : -(n.createdAt || 0) / 1000; }
  function folderKey(f) { return typeof f.order === 'number' ? f.order : (f.createdAt || 0) / 1000; }
  function noteLabel(n) { var t = n.title || (n.text || '').split('\n')[0] || '제목 없음'; return t.length > 14 ? t.slice(0, 14) + '…' : t; }
  function canReorderNotes() { var t = state.view.type; return !state.query.trim() && t !== 'trash' && t !== 'home'; }

  function bindDrag(elm, kind, id) {
    var skip = '.ftile-more, .more, .chev';
    elm.addEventListener('mousedown', function (e) {
      if (e.button !== 0 || (e.target.closest && e.target.closest(skip))) return;
      e.preventDefault();
      drag = { kind: kind, id: id, el: elm, x0: e.clientX, y0: e.clientY, active: false, mode: 'mouse' };
      // 노트를 마우스로 꾹(0.5초) 누르고 있으면 삭제 메뉴
      if (kind === 'note') drag.holdTimer = setTimeout(function () {
        if (drag && drag.el === elm && !drag.active) { drag.pressed = true; showPressMenu(id, elm, drag.x0, drag.y0); }
      }, 500);
    });
    elm.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1 || (e.target.closest && e.target.closest(skip))) return;
      var t = e.touches[0];
      drag = { kind: kind, id: id, el: elm, x0: t.clientX, y0: t.clientY, active: false, mode: 'touch' };
      drag.timer = setTimeout(function () {
        if (!drag || drag.active) return;
        if (kind === 'note') {
          // 노트를 꾹 누르면 삭제 메뉴가 나오고, 그대로 손가락을 움직이면 끌기가 시작됨
          drag.pressed = true;
          try { if (navigator.vibrate) navigator.vibrate(15); } catch (e) { /* 무시 */ }
          showPressMenu(id, elm, drag.x0, drag.y0);
        } else startDrag(drag.x0, drag.y0);
      }, 400);
    }, { passive: true });
    elm.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      // 마우스 오른쪽 버튼으로도 같은 메뉴
      if (kind === 'note' && !(drag && drag.active) && !(e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) && !pressMenuNote) showPressMenu(id, elm, e.clientX, e.clientY);
    });
  }
  function startDrag(x, y) {
    var label, icon;
    if (drag.kind === 'note') {
      var n = state.notes.get(drag.id); if (!n) { drag = null; return; }
      label = noteLabel(n); icon = ic('notes');
    } else {
      var f = state.folders.get(drag.id); if (!f) { drag = null; return; }
      label = f.name; icon = folderSvg(folderShape(f), f.color);
    }
    drag.active = true;
    try { if (navigator.vibrate) navigator.vibrate(15); } catch (e) { /* 무시 */ }
    var g = el('div', 'drag-ghost'); g.innerHTML = icon; g.appendChild(el('span', null, label));
    document.body.appendChild(g); drag.ghost = g;
    drag.el.classList.add('dragging');
    $('toast').classList.add('hidden');
    document.body.classList.add('is-dragging');
    showDropTray();
    drag.scrollTimer = setInterval(autoScroll, 16);
    moveDrag(x, y);
  }
  function findTarget(x, y) {
    var hit = document.elementFromPoint(x, y);
    if (!hit || !hit.closest) return null;
    if (drag.kind === 'note') {
      var fd = hit.closest('[data-drop]');
      if (fd) return { el: fd, action: 'into', folderId: fd.dataset.drop || null };
      var card = hit.closest('.card[data-note]');
      if (card && card.dataset.note !== drag.id && canReorderNotes()) {
        var r = card.getBoundingClientRect();
        var before = settings.layout === 'list' ? y < r.top + r.height / 2 : x < r.left + r.width / 2;
        return { el: card, action: before ? 'before' : 'after', id: card.dataset.note };
      }
      return null;
    }
    var root = hit.closest('[data-drop-root]');
    if (root) return { el: root, action: 'root' };
    var fe = hit.closest('[data-folder]') || hit.closest('[data-drop]');
    if (!fe) return null;
    var fid = fe.dataset.folder || fe.dataset.drop;
    var tf = fid && state.folders.get(fid);
    if (!tf || fid === drag.id || isInside(tf, drag.id)) return null; // 자기 자신이나 자기 안의 폴더에는 넣을 수 없음
    if (fe.dataset.folder) {
      var r2 = fe.getBoundingClientRect(), vertical = fe.classList.contains('nav-folder');
      var pos = vertical ? (y - r2.top) / r2.height : (x - r2.left) / r2.width;
      if (pos < 0.25) return { el: fe, action: 'before', id: fid };
      if (pos > 0.75) return { el: fe, action: 'after', id: fid };
    }
    return { el: fe, action: 'into', folderId: fid };
  }
  function clearMark(t) { if (t && t.el) t.el.classList.remove('drop-hover', 'ins-before', 'ins-after'); }
  function moveDrag(x, y) {
    if (!drag || !drag.ghost) return;
    drag.lastX = x; drag.lastY = y;
    if (drag.mode === 'touch') drag.ghost.style.transform = 'translate(' + (x - 40) + 'px,' + (y - 78) + 'px)';
    else drag.ghost.style.transform = 'translate(' + (x + 12) + 'px,' + (y - 18) + 'px)';
    var t = findTarget(x, y);
    var same = t && drag.target && t.el === drag.target.el && t.action === drag.target.action;
    if (!same) {
      clearMark(drag.target);
      if (t) t.el.classList.add(t.action === 'before' ? 'ins-before' : t.action === 'after' ? 'ins-after' : 'drop-hover');
      drag.target = t;
    }
  }
  /* 끄는 중에 목록 위·아래 끝으로 가면 목록이 저절로 움직임 */
  function autoScroll() {
    if (!drag || !drag.active || drag.lastY == null) return;
    var sc = $('listScroll'), r = sc.getBoundingClientRect(), tr = $('dropTray').getBoundingClientRect();
    var top = Math.max(r.top, tr.bottom), y = drag.lastY, dy = 0;
    if (drag.lastX < r.left || drag.lastX > r.right) return;
    if (y > top && y < top + 44) dy = -Math.max(4, (top + 44 - y) / 3);
    else if (y > r.bottom - 52 && y < r.bottom + 30) dy = Math.max(4, (y - (r.bottom - 52)) / 3);
    if (dy) { sc.scrollTop += dy; moveDrag(drag.lastX, drag.lastY); }
  }
  function endDrag(x, y) {
    if (!drag) return;
    if (!drag.active) {
      clearTimeout(drag.holdTimer);
      // 꾹 눌러 메뉴만 연 경우: 손을 떼도 노트가 열리지 않게 함
      if (drag.pressed && drag.mode === 'mouse') { suppressClick = true; setTimeout(function () { suppressClick = false; }, 0); }
      drag = null; return;
    }
    moveDrag(x, y);
    var t = drag.target, kind = drag.kind, id = drag.id;
    // 마우스로 끈 뒤 생기는 클릭으로 노트·폴더가 열리지 않게 함 (터치는 touchend에서 이미 막음)
    if (drag.mode === 'mouse') { suppressClick = true; setTimeout(function () { suppressClick = false; }, 0); }
    cleanupDrag();
    if (!t) return;
    if (kind === 'note') {
      if (t.action === 'into') moveNoteTo(id, t.folderId, true);
      else reorderNote(id, t.id, t.action);
    } else {
      if (t.action === 'root') moveFolderTo(id, null);
      else if (t.action === 'into') moveFolderTo(id, t.folderId);
      else reorderFolder(id, t.id, t.action);
    }
  }
  function cleanupDrag() {
    if (!drag) return;
    clearTimeout(drag.timer); clearInterval(drag.scrollTimer);
    if (drag.ghost) drag.ghost.remove();
    clearMark(drag.target);
    if (drag.el) drag.el.classList.remove('dragging');
    document.body.classList.remove('is-dragging');
    $('dropTray').classList.add('hidden');
    drag = null;
  }
  document.addEventListener('click', function (e) {
    if (suppressClick) { suppressClick = false; e.stopPropagation(); e.preventDefault(); }
  }, true);
  document.addEventListener('mousemove', function (e) {
    if (!drag || drag.mode !== 'mouse') return;
    if (!drag.active) {
      if (Math.abs(e.clientX - drag.x0) + Math.abs(e.clientY - drag.y0) < 8) return;
      clearTimeout(drag.holdTimer); hidePressMenu();
      startDrag(e.clientX, e.clientY);
      if (!drag) return;
    }
    moveDrag(e.clientX, e.clientY);
  });
  document.addEventListener('mouseup', function (e) { if (drag && drag.mode === 'mouse') endDrag(e.clientX, e.clientY); });
  document.addEventListener('touchmove', function (e) {
    if (!drag || drag.mode !== 'touch') return;
    var t = e.touches[0];
    if (!drag.active) {
      // 길게 누르기 전에 손가락을 움직이면 끌기가 아니라 화면 넘기기로 봄
      if (Math.abs(t.clientX - drag.x0) + Math.abs(t.clientY - drag.y0) > 10) {
        if (drag.pressed) { e.preventDefault(); hidePressMenu(); startDrag(t.clientX, t.clientY); return; }
        clearTimeout(drag.timer); drag = null;
      }
      return;
    }
    e.preventDefault();
    moveDrag(t.clientX, t.clientY);
  }, { passive: false });
  document.addEventListener('touchend', function (e) {
    if (!drag || drag.mode !== 'touch') return;
    clearTimeout(drag.timer);
    if (drag.active) { e.preventDefault(); var t = e.changedTouches[0]; endDrag(t.clientX, t.clientY); }
    else { if (drag.pressed) e.preventDefault(); drag = null; }
  }, { passive: false });
  document.addEventListener('touchcancel', function () { if (drag) cleanupDrag(); });

  /* 끄는 동안 화면 위쪽에 나타나는 "놓을 곳" 상자 */
  function showDropTray() {
    var tray = $('dropTray'); tray.textContent = '';
    var box = el('div', 'drop-chips');
    function chip(html, label, attrs, isCur) {
      var c = el('div', 'drop-chip' + (isCur ? ' cur' : ''));
      Object.keys(attrs).forEach(function (k) { c.setAttribute(k, attrs[k]); });
      c.innerHTML = html; c.appendChild(el('span', null, label + (isCur ? ' (지금 위치)' : '')));
      box.appendChild(c);
    }
    if (drag.kind === 'note') {
      var n = state.notes.get(drag.id);
      var cur = n.folderId && state.folders.has(n.folderId) ? n.folderId : null;
      tray.appendChild(el('h3', null, canReorderNotes() ? '폴더 위에 놓으면 이동 · 다른 노트 앞뒤에 놓으면 순서 변경' : '옮길 폴더 위에 놓으세요'));
      visibleFolderTree().forEach(function (r) { chip(folderSvg(folderShape(r.f), r.f.color), pathName(r.f), { 'data-drop': r.f.id }, cur === r.f.id); });
      chip(ic('folder'), '폴더 없음', { 'data-drop': '' }, cur === null);
    } else {
      var f = state.folders.get(drag.id), p = parentOf(f);
      tray.appendChild(el('h3', null, '폴더 위에 놓으면 그 안으로 · 폴더 가장자리에 놓으면 순서 변경'));
      chip(ic('home'), '맨 위 (홈)', { 'data-drop-root': '' }, !p);
      visibleFolderTree().forEach(function (r) {
        if (r.f.id === f.id || isInside(r.f, f.id)) return;
        chip(folderSvg(folderShape(r.f), r.f.color), pathName(r.f), { 'data-drop': r.f.id }, p && p.id === r.f.id);
      });
    }
    tray.appendChild(box);
    tray.classList.remove('hidden');
  }

  /* ----- 노트 이동·순서 ----- */
  function saveNoteQuiet(id, patch) {
    if (state.currentId === id) flushSave(false);
    var n = state.notes.get(id); if (!n) return;
    var updated = Object.assign({}, n, patch);
    state.notes.set(id, updated);
    store.saveNote(updated);
  }
  function setNoteFolder(id, folderId) {
    var n = state.notes.get(id); if (!n) return;
    if (state.currentId === id) { patchCurrent({ folderId: folderId }); renderAll(); return; }
    var updated = Object.assign({}, n, { folderId: folderId, updatedAt: Date.now() });
    state.notes.set(id, updated);
    store.saveNote(updated);
    renderAll();
  }
  function moveNoteTo(id, folderId, withUndo) {
    var n = state.notes.get(id); if (!n) return;
    if (folderId && !state.folders.has(folderId)) return;
    var from = n.folderId && state.folders.has(n.folderId) ? n.folderId : null;
    if (from === folderId) { toast('이미 이 폴더에 있습니다.'); return; }
    setNoteFolder(id, folderId);
    var name = folderId ? state.folders.get(folderId).name : '폴더 없음';
    if (withUndo) toast('"' + noteLabel(n) + '" → ' + name + '(으)로 옮겼습니다.', 5000, '되돌리기', function () { setNoteFolder(id, from); toast('되돌렸습니다.'); });
  }
  /* "직접 정렬"로 처음 바꿀 때, 지금 화면에 보이는 순서를 그대로 고정 */
  function freezeManualOrder() {
    var shown = visibleNotes();
    var min = Math.min.apply(null, Array.from(state.notes.values()).map(noteKey).concat([0]));
    var base = Math.floor(min) - shown.length - 1;
    shown.forEach(function (n, i) { saveNoteQuiet(n.id, { order: base + i }); });
  }
  function reorderNote(id, targetId, where) {
    var switched = false;
    if (settings.sort !== 'manual') { freezeManualOrder(); settings.sort = 'manual'; saveSettings(); switched = true; }
    var moving = state.notes.get(id); if (!moving) return;
    var oldOrder = moving.order;
    var arr = visibleNotes().filter(function (n) { return n.id !== id; });
    var ti = arr.findIndex(function (n) { return n.id === targetId; });
    if (ti < 0) return;
    var at = where === 'before' ? ti : ti + 1;
    var prev = arr[at - 1], next = arr[at];
    var k = prev && next ? (noteKey(prev) + noteKey(next)) / 2 : prev ? noteKey(prev) + 1 : next ? noteKey(next) - 1 : 0;
    if ((prev && !(k > noteKey(prev))) || (next && !(k < noteKey(next)))) {
      // 간격이 너무 좁아지면 이 목록의 번호를 다시 매김
      arr.splice(at, 0, moving);
      var base = noteKey(arr[0]);
      arr.forEach(function (n, i) { if (n.id !== id) saveNoteQuiet(n.id, { order: base + i }); else k = base + i; });
    }
    saveNoteQuiet(id, { order: k });
    renderAll();
    toast(switched ? '정렬을 "직접 정렬"로 바꾸고 순서를 옮겼습니다.' : '순서를 바꿨습니다.', 5000, '되돌리기', function () {
      saveNoteQuiet(id, { order: oldOrder === undefined ? null : oldOrder }); renderAll(); toast('되돌렸습니다.');
    });
  }

  /* ----- 폴더 이동·순서 ----- */
  function saveFolderPatch(id, patch) {
    var f = state.folders.get(id); if (!f) return;
    var updated = Object.assign({}, f, patch);
    state.folders.set(id, updated);
    store.saveFolder(updated);
  }
  function folderUndo(id, f) {
    return function () { saveFolderPatch(id, { parentId: f.parentId || null, order: typeof f.order === 'number' ? f.order : null }); renderAll(); toast('되돌렸습니다.'); };
  }
  function moveFolderTo(id, parentId) {
    var f = state.folders.get(id); if (!f) return;
    var cur = parentOf(f);
    if ((cur ? cur.id : null) === (parentId || null)) { toast('이미 이 위치에 있습니다.'); return; }
    if (parentId && (parentId === id || isInside(state.folders.get(parentId), id))) { toast('폴더를 자기 안으로 옮길 수는 없습니다.'); return; }
    var sibs = childFolders(parentId);
    var k = sibs.length ? folderKey(sibs[sibs.length - 1]) + 1 : 0;
    saveFolderPatch(id, { parentId: parentId || null, order: k });
    if (parentId) { var exp = Object.assign({}, settings.expanded || {}); exp[parentId] = true; settings.expanded = exp; saveSettings(); }
    renderAll();
    var where = parentId ? '"' + state.folders.get(parentId).name + '" 안으로' : '맨 위(홈)로';
    toast('"' + f.name + '" 폴더를 ' + where + ' 옮겼습니다.', 5000, '되돌리기', folderUndo(id, f));
  }
  function reorderFolder(id, targetId, where) {
    var f = state.folders.get(id), target = state.folders.get(targetId); if (!f || !target) return;
    var tp = parentOf(target), pid = tp ? tp.id : null;
    var arr = childFolders(pid).filter(function (x) { return x.id !== id; });
    var ti = arr.findIndex(function (x) { return x.id === targetId; }); if (ti < 0) return;
    var at = where === 'before' ? ti : ti + 1;
    var prev = arr[at - 1], next = arr[at];
    var k = prev && next ? (folderKey(prev) + folderKey(next)) / 2 : prev ? folderKey(prev) + 1 : next ? folderKey(next) - 1 : 0;
    if ((prev && !(k > folderKey(prev))) || (next && !(k < folderKey(next)))) {
      arr.splice(at, 0, f);
      arr.forEach(function (x, i) { if (x.id !== id) saveFolderPatch(x.id, { order: i }); else k = i; });
    }
    var movedParent = (parentOf(f) ? parentOf(f).id : null) !== pid;
    saveFolderPatch(id, { parentId: pid, order: k });
    renderAll();
    toast(movedParent ? '"' + f.name + '" 폴더를 옮겼습니다.' : '폴더 순서를 바꿨습니다.', 5000, '되돌리기', folderUndo(id, f));
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
      order: settings.sort === 'manual' ? Math.floor(Math.min.apply(null, Array.from(state.notes.values()).map(noteKey).concat([0]))) - 1 : null,
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
    hydrateImages($('editor'));
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
    folderTree().forEach(function (r) {
      var op = el('option', null, '\u00A0\u00A0\u00A0'.repeat(r.depth) + r.f.name); op.value = r.f.id; sel.appendChild(op);
    });
    var cur = n.folderId && state.folders.get(n.folderId);
    sel.value = cur ? cur.id : '';
    $('noteFolderIco').innerHTML = cur ? folderSvg(folderShape(cur), cur.color) : ic('folder');
    sel.title = cur ? pathName(cur) : '폴더 없음';
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
  function isEmptyNote(n) { return !(n.title || '').trim() && !(n.text || '').trim() && !(n.attachments && n.attachments.length) && !(n.html && n.html.indexOf('data-img') !== -1); }

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
      hydrateImages($('editor'));
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
    blobRefs(n).forEach(function (a) { store.deleteFile(a); });
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
    if (kind === 'color') { style.color = value; setColorBar(value); }
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
      var recent = (settings.recentColors || []).filter(function (c) { return /^#[0-9a-f]{6}$/i.test(c); });
      if (recent.length) {
        p.appendChild(el('h3', 'pal-sub', '최근 직접 고른 색'));
        var rs = el('div', 'swatches');
        recent.forEach(function (c) {
          var b = el('button', 'sw'); b.style.background = c; b.title = c; keepFocus(b);
          b.addEventListener('click', function () { applyInline('color', c); hidePalette(); });
          rs.appendChild(b);
        });
        p.appendChild(rs);
      }
      var row = el('label', 'sw-custom'); row.appendChild(el('span', null, '직접 고르기'));
      var inp = el('input'); inp.type = 'color'; inp.value = recent[0] || '#E53935';
      inp.addEventListener('change', function () {
        settings.recentColors = [inp.value].concat((settings.recentColors || []).filter(function (c) { return c !== inp.value; })).slice(0, 8);
        saveSettings();
        applyInline('color', inp.value); hidePalette();
      });
      row.appendChild(inp); p.appendChild(row);
    }
    p.classList.remove('hidden');
  }
  /* 버튼을 눌러도 편집 칸의 커서·선택이 사라지지 않게 함 */
  function keepFocus(b) {
    b.addEventListener('pointerdown', function (e) { e.preventDefault(); });
    b.addEventListener('mousedown', function (e) { e.preventDefault(); });
  }
  function setColorBar(c) {
    var bar = document.getElementById('colorBar');
    if (bar) bar.setAttribute('fill', c === 'var(--ink)' ? 'currentColor' : c);
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
    body.appendChild(menuItem('download', '파일로 저장 (텍스트·PDF·이미지 등)', function () { var cur = getCurrent(); closeSheet(); if (cur) { if (!state.notes.has(cur.id)) { toast('내용을 먼저 입력하세요.'); return; } exportMenu(cur.id); } }));
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
    var tc = el('div', 'swatches');
    [{ name: '자동', value: '' }].concat(TEXT_COLORS.slice(1)).forEach(function (c) {
      var b = el('button', 'sw' + ((settings.textColor || '') === c.value ? ' sel' : '')); b.title = c.name;
      if (c.value) b.style.background = c.value; else b.textContent = '자동';
      b.addEventListener('click', function () { settings.textColor = c.value; saveSettings(); tc.querySelectorAll('.sw').forEach(function (x) { x.classList.remove('sel'); }); b.classList.add('sel'); });
      tc.appendChild(b);
    });
    var tcRow = el('label', 'sw-custom'); tcRow.appendChild(el('span', null, '직접 고르기'));
    var tcIn = el('input'); tcIn.type = 'color';
    tcIn.value = /^#[0-9a-f]{6}$/i.test(settings.textColor || '') ? settings.textColor : '#333333';
    tcIn.addEventListener('input', function () { settings.textColor = tcIn.value; saveSettings(); tc.querySelectorAll('.sw').forEach(function (x) { x.classList.remove('sel'); }); });
    tcRow.appendChild(tcIn); tc.appendChild(tcRow);
    body.appendChild(setRow('기본 글자 색', tc, '노트 본문의 기본 글자 색입니다. "자동"은 밝은 화면에서 검정, 어두운 화면에서 흰색입니다. 검정·진한 색을 고르면 어두운 화면에서는 잘 안 보일 수 있습니다. 일부 글자만 바꾸려면 편집 화면 아래 A 버튼을 쓰세요.'));
    body.appendChild(setRow('목록 보기', seg([['grid', '격자'], ['list', '목록']], settings.layout, function (v) { settings.layout = v; saveSettings(); renderList(); })));
    body.appendChild(setRow('격자 크기', seg(GRID_SIZES, settings.gridSize, function (v) { settings.gridSize = v; saveSettings(); renderList(); }), '목록 위의 보기 버튼에서도 바꿀 수 있습니다.'));
    body.appendChild(setRow('왼쪽 메뉴의 하위 폴더', seg([['hide', '접어 두기'], ['show', '모두 펼치기']], settings.subMenu, function (v) { settings.subMenu = v; saveSettings(); renderDrawer(); }), '"접어 두기"는 맨 위 폴더만 보이고, 폴더 옆 ▸를 눌러야 하위 폴더가 보입니다.'));
    body.appendChild(setRow('정렬', seg([['updated', '수정일'], ['created', '만든 날짜'], ['title', '제목'], ['manual', '직접']], settings.sort, function (v) { settings.sort = v; saveSettings(); renderList(); })));
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
      blobRefs(n).forEach(function (a) {
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
      toast(missing ? '백업했습니다. (이 기기에 없는 첨부·그림 ' + missing + '개는 빠짐)' : '백업 파일을 저장했습니다.', 4000);
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
        blobRefs(n).forEach(function (a) {
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

  /* ================= 노트 안의 그림 (캡처 화면 붙여넣기) =================
   * 그림은 노트 글 안에 <img data-img="아이디">로만 적고, 그림 자체는 첨부와 같은 저장소에 따로 보관합니다.
   * (노트 하나의 크기 제한 1MiB를 넘지 않게 하려는 것)
   */
  var MAX_IMAGE = 5 * 1024 * 1024;
  var imgCache = {};
  function imgMeta(img) {
    return { id: img.getAttribute('data-img'), chunks: Number(img.getAttribute('data-chunks')) || 1, type: img.getAttribute('data-type') || 'image/png' };
  }
  function noteImages(n) {
    if (!n || !n.html || n.html.indexOf('data-img') === -1) return [];
    var doc = new DOMParser().parseFromString('<div>' + n.html + '</div>', 'text/html');
    return Array.prototype.map.call(doc.querySelectorAll('img[data-img]'), imgMeta).filter(function (m) { return m.id; });
  }
  /* 첨부 파일 + 노트 안 그림 (영구 삭제·백업에 씀) */
  function blobRefs(n) { return (n.attachments || []).concat(noteImages(n)); }
  function imageUrl(m) {
    if (imgCache[m.id]) return Promise.resolve(imgCache[m.id]);
    return store.getFile(m).then(function (blob) { var u = URL.createObjectURL(blob); imgCache[m.id] = u; return u; });
  }
  function hydrateImages(root) {
    root.querySelectorAll('img[data-img]').forEach(function (img) {
      var m = imgMeta(img); if (!m.id) return;
      img.alt = '그림';
      imageUrl(m).then(function (u) { img.src = u; img.classList.remove('img-missing'); })
        .catch(function () { img.classList.add('img-missing'); img.alt = '그림을 불러오지 못했습니다 (인터넷 연결 후 다시 열어 주세요)'; });
    });
  }
  function encodeCanvas(c, type, q) { return new Promise(function (res) { c.toBlob(function (b) { res(b); }, type, q); }); }
  /* 큰 캡처 화면은 긴 변 1800px로 줄이고 압축해서 저장 공간을 아낌 */
  function compressImage(file) {
    return new Promise(function (resolve) {
      if (file.size < 300 * 1024) { resolve(file); return; }
      var url = URL.createObjectURL(file), im = new Image();
      im.onload = function () {
        var max = 1800, w = im.naturalWidth, h = im.naturalHeight, s = Math.min(1, max / Math.max(w, h));
        var c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w * s)); c.height = Math.max(1, Math.round(h * s));
        var ctx = c.getContext('2d'); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(im, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        encodeCanvas(c, 'image/webp', 0.86).then(function (b) {
          if (b && b.type === 'image/webp') return b;
          return encodeCanvas(c, 'image/jpeg', 0.86); // 사파리처럼 webp를 못 만드는 브라우저
        }).then(function (b) { resolve(b && b.size < file.size ? b : file); });
      };
      im.onerror = function () { URL.revokeObjectURL(url); resolve(file); };
      im.src = url;
    });
  }
  function insertImages(files) {
    var n = getCurrent(); if (!n) return;
    var list = Array.prototype.slice.call(files).filter(function (f) { return /^image\//.test(f.type); });
    if (!list.length) return;
    restoreRange();
    toast('그림을 넣는 중…');
    var chain = Promise.resolve();
    list.forEach(function (file) {
      chain = chain.then(function () { return compressImage(file); }).then(function (blob) {
        if (blob.size > MAX_IMAGE) { toast('5MB가 넘는 그림은 넣을 수 없습니다.'); return; }
        var id = 'i_' + uid();
        return store.putFile(id, blob).then(function (chunks) {
          var img = document.createElement('img');
          img.setAttribute('data-img', id); img.setAttribute('data-chunks', String(chunks)); img.setAttribute('data-type', blob.type || 'image/png');
          img.className = 'note-img'; img.alt = '그림';
          var u = URL.createObjectURL(blob); imgCache[id] = u; img.src = u;
          restoreRange();
          var sel = window.getSelection(), r = sel.getRangeAt(0);
          r.deleteContents();
          var after = document.createElement('div'); after.appendChild(document.createElement('br'));
          r.insertNode(img);
          // 그림 뒤에 빈 줄을 두어 바로 이어서 글을 쓸 수 있게 함
          if (!img.nextSibling) img.parentNode.insertBefore(after, null);
          var nr = document.createRange(); nr.setStartAfter(img); nr.collapse(true);
          sel.removeAllRanges(); sel.addRange(nr); savedRange = nr.cloneRange();
          markDirty();
        });
      });
    });
    chain.then(function () { toast('그림을 넣었습니다.'); }).catch(function (e) { console.error(e); toast('그림을 넣지 못했습니다.'); });
  }

  /* ================= 노트를 꾹 눌렀을 때 나오는 메뉴 ================= */
  var pressMenuNote = null, swallowClickUntil = 0;
  function showPressMenu(noteId, cardEl, x, y) {
    var n = state.notes.get(noteId); if (!n || n.trashed) return;
    hidePressMenu();
    pressMenuNote = { id: noteId, el: cardEl };
    cardEl.classList.add('pressed');
    var m = $('pressMenu'); m.textContent = '';
    m.appendChild(el('div', 'pm-title', noteLabel(n)));
    function item(icon, label, run, danger) {
      var b = el('button', 'pm-item' + (danger ? ' danger' : '')); b.innerHTML = ic(icon, icon === 'star' && n.favorite); b.appendChild(el('span', null, label));
      b.addEventListener('click', function (e) { e.stopPropagation(); hidePressMenu(); run(); });
      m.appendChild(b);
    }
    item('trash', '삭제', function () { trashNoteById(noteId); }, true);
    item('star', n.favorite ? '즐겨찾기 해제' : '즐겨찾기', function () {
      var cur = state.notes.get(noteId); if (!cur) return;
      if (state.currentId === noteId) patchCurrent({ favorite: !cur.favorite }); else saveNoteQuiet(noteId, { favorite: !cur.favorite });
      renderAll();
    });
    item('download', '파일로 저장', function () { exportMenu(noteId); });
    m.classList.remove('hidden');
    var w = m.offsetWidth, h = m.offsetHeight;
    var left = Math.min(Math.max(8, x - w / 2), window.innerWidth - w - 8);
    var top = y + 14; if (top + h > window.innerHeight - 8) top = Math.max(8, y - h - 14);
    m.style.left = left + 'px'; m.style.top = top + 'px';
  }
  function hidePressMenu() {
    if (pressMenuNote && pressMenuNote.el) pressMenuNote.el.classList.remove('pressed');
    pressMenuNote = null;
    $('pressMenu').classList.add('hidden');
  }
  function trashNoteById(id) {
    var n = state.notes.get(id); if (!n) return;
    if (state.currentId === id) { flushSave(false); closeEditorOrBack(); }
    saveNoteQuiet(id, { trashed: true, trashedAt: Date.now() });
    renderAll();
    toast('"' + noteLabel(n) + '"을(를) 휴지통으로 옮겼습니다.', 5000, '되돌리기', function () {
      saveNoteQuiet(id, { trashed: false, trashedAt: null }); renderAll(); toast('되돌렸습니다.');
    });
  }
  // 메뉴 바깥을 누르면 닫기 (그 누름으로 다른 노트가 열리지는 않게 함)
  document.addEventListener('pointerdown', function (e) {
    if (!pressMenuNote) return;
    if (e.target.closest && e.target.closest('#pressMenu')) return;
    hidePressMenu(); swallowClickUntil = Date.now() + 600;
  }, true);
  document.addEventListener('click', function (e) {
    if (Date.now() < swallowClickUntil && !(e.target.closest && e.target.closest('#pressMenu'))) { swallowClickUntil = 0; e.stopPropagation(); e.preventDefault(); }
  }, true);

  /* ================= 노트를 파일로 저장 (텍스트·PDF·이미지·웹 문서·인쇄) ================= */
  var LIBS = {
    html2canvas: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
    jspdf: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
  };
  var libLoads = {};
  function loadLib(name) {
    if (libLoads[name]) return libLoads[name];
    libLoads[name] = new Promise(function (res, rej) {
      var s = document.createElement('script'); s.src = LIBS[name]; s.async = true;
      s.onload = res; s.onerror = function () { delete libLoads[name]; rej(new Error('lib')); };
      document.head.appendChild(s);
    });
    return libLoads[name];
  }
  function exportNote(id) {
    if (state.currentId === id) flushSave(false);
    return state.notes.get(id) || (state.draft && state.draft.id === id ? state.draft : null);
  }
  function fileBase(n) {
    var t = (n.title || (n.text || '').split('\n')[0] || '노트').replace(/[\\/:*?"<>|\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60);
    return t || '노트';
  }
  function isIOS() { return /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
  function saveBlob(blob, name) {
    function download() {
      var url = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
    }
    // 아이폰은 '공유 → 파일에 저장'이 더 잘 되므로 공유 창을 먼저 시도
    if (isIOS() && navigator.canShare) {
      try {
        var f = new File([blob], name, { type: blob.type });
        if (navigator.canShare({ files: [f] })) { navigator.share({ files: [f], title: name }).catch(function (e) { if (e && e.name !== 'AbortError') download(); }); return; }
      } catch (e) { /* 아래 방법으로 */ }
    }
    download();
  }
  /* 글자만 뽑기: 체크리스트는 ☐/☑, 글머리는 •, 번호는 1. 2. … */
  function htmlToText(html) {
    var doc = new DOMParser().parseFromString('<div>' + (html || '') + '</div>', 'text/html');
    var out = [];
    function walk(node, prefix) {
      node.childNodes.forEach(function (c) {
        if (c.nodeType === 3) { out.push(c.nodeValue.replace(/​/g, '')); return; }
        if (c.nodeType !== 1) return;
        var tag = c.nodeName;
        if (tag === 'BR') { out.push('\n'); return; }
        if (tag === 'IMG') { out.push('\n[그림]\n'); return; }
        if (tag === 'UL' || tag === 'OL') {
          var i = 0;
          c.childNodes.forEach(function (li) {
            if (li.nodeName !== 'LI') return; i++;
            var mark = tag === 'OL' ? i + '. ' : c.classList.contains('checklist') ? (li.classList.contains('done') ? '☑ ' : '☐ ') : '• ';
            out.push('\n' + prefix + mark); walk(li, prefix + '   ');
          });
          out.push('\n'); return;
        }
        var block = /^(DIV|P|H[1-6]|BLOCKQUOTE|PRE|LI)$/.test(tag);
        if (block) out.push('\n');
        walk(c, prefix);
        if (block) out.push('\n');
      });
    }
    walk(doc.body.firstChild, '');
    return out.join('').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  }
  function blobToDataUrl(blob) { return new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(r.result); }; r.onerror = rej; r.readAsDataURL(blob); }); }
  var EXPORT_BG = { '': '#ffffff', yellow: '#FFF4CC', green: '#E2F4E4', blue: '#E0ECFF', pink: '#FCE3EC', purple: '#EDE5FF', gray: '#ECECEC' };
  /* 저장용 화면 만들기 (항상 밝은 화면 색으로) */
  function buildExportPage(n, opts) {
    opts = opts || {};
    var page = el('div', 'export-page');
    page.style.background = EXPORT_BG[n.color || ''] || '#ffffff';
    if (opts.noVPad) { page.style.paddingTop = '0'; page.style.paddingBottom = '0'; }
    page.appendChild(el('h1', 'export-title', n.title || (n.text || '').split('\n')[0] || '제목 없음'));
    var f = n.folderId && state.folders.get(n.folderId);
    page.appendChild(el('div', 'export-meta', (f ? pathName(f) + ' · ' : '') + '수정 ' + fmtDate(n.updatedAt, true)));
    var body = el('div', 'editor export-body'); body.innerHTML = sanitize(n.html);
    page.appendChild(body);
    var imgs = Array.prototype.slice.call(body.querySelectorAll('img[data-img]'));
    return Promise.all(imgs.map(function (img) {
      var m = imgMeta(img);
      return store.getFile(m).then(function (blob) {
        return opts.dataUrls ? blobToDataUrl(blob) : (imgCache[m.id] || (imgCache[m.id] = URL.createObjectURL(blob)));
      }).then(function (src) {
        return new Promise(function (res) { img.onload = res; img.onerror = res; img.src = src; });
      }).catch(function () { img.replaceWith(el('div', 'export-missing', '[그림을 불러오지 못했습니다]')); });
    })).then(function () { return page; });
  }
  function mountOffscreen(page) {
    var holder = el('div', 'export-holder'); holder.appendChild(page); document.body.appendChild(holder);
    return (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { return holder; });
  }
  function renderCanvas(page, holder) {
    return loadLib('html2canvas').then(function () {
      var h = page.scrollHeight, w = page.offsetWidth;
      // 아주 긴 노트는 휴대폰 메모리 한도를 넘지 않게 선명도를 낮춤
      var scale = Math.max(0.6, Math.min(2, 30000 / h, Math.sqrt(16000000 / (w * h))));
      return window.html2canvas(page, { scale: scale, backgroundColor: page.style.background || '#ffffff', useCORS: true, logging: false })
        .then(function (canvas) { return { canvas: canvas, scale: scale }; });
    });
  }
  function exportTxt(n) {
    var text = (n.title ? n.title + '\n\n' : '') + htmlToText(n.html);
    saveBlob(new Blob(['﻿' + text.replace(/\n/g, '\r\n')], { type: 'text/plain;charset=utf-8' }), fileBase(n) + '.txt');
    return Promise.resolve();
  }
  function exportHtml(n) {
    return buildExportPage(n, { dataUrls: true }).then(function (page) {
      var css = 'body{margin:0;background:#f4f4f2;font-family:"Noto Sans KR","Malgun Gothic","Apple SD Gothic Neo",sans-serif;color:#1f1f1f}' +
        '.export-page{max-width:794px;margin:24px auto;padding:48px 56px;box-sizing:border-box;box-shadow:0 1px 6px rgba(0,0,0,.08)}' +
        '.export-title{font-size:26px;margin:0 0 6px}.export-meta{font-size:13px;color:#777;margin-bottom:24px}' +
        '.export-body{font-size:16px;line-height:1.7;word-break:break-word}.export-body img{max-width:100%;height:auto;display:block;margin:8px 0;border-radius:8px}' +
        'ul.checklist{list-style:none;padding-left:4px}ul.checklist>li{position:relative;padding-left:28px}' +
        'ul.checklist>li::before{content:"☐";position:absolute;left:2px}ul.checklist>li.done{color:#888;text-decoration:line-through}ul.checklist>li.done::before{content:"☑"}';
      var fonts = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&family=Nanum+Gothic:wght@400;700&family=Nanum+Myeongjo:wght@400;700&family=Gowun+Dodum&family=Nanum+Pen+Script&family=Gaegu:wght@400;700&family=Gowun+Batang:wght@400;700&family=Do+Hyeon&family=Jua&family=Nanum+Brush+Script&family=Hi+Melody&display=swap">';
      var title = (n.title || '노트').replace(/[<&]/g, function (c) { return c === '<' ? '&lt;' : '&amp;'; });
      var html = '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + title + '</title>' + fonts + '<style>' + css + '</style></head><body>' +
        page.outerHTML.replace(/var\(--ink\)/g, '#1f1f1f') + '</body></html>';
      saveBlob(new Blob([html], { type: 'text/html;charset=utf-8' }), fileBase(n) + '.html');
    });
  }
  function exportPng(n) {
    var holder;
    return buildExportPage(n).then(mountOffscreen).then(function (h) { holder = h; return renderCanvas(h.firstChild, h); })
      .then(function (r) { return encodeCanvas(r.canvas, 'image/png'); })
      .then(function (blob) { saveBlob(blob, fileBase(n) + '.png'); })
      .finally(function () { if (holder) holder.remove(); });
  }
  function exportPdf(n) {
    var holder;
    return Promise.all([buildExportPage(n, { noVPad: true }).then(mountOffscreen), loadLib('jspdf')]).then(function (rs) {
      holder = rs[0]; var page = holder.firstChild;
      var W = page.offsetWidth, usable = Math.floor(W * 297 / 210) - 2 * 48; // A4 한 장에 들어가는 높이 (위아래 여백 48px)
      // 줄 중간이 잘리지 않도록 문단·목록 항목·그림의 경계에서 쪽을 나눔
      var top0 = page.getBoundingClientRect().top, bounds = [];
      page.querySelectorAll('.export-title, .export-meta, .export-body > *, .export-body li, .export-body img').forEach(function (e) {
        var r = e.getBoundingClientRect(); bounds.push(Math.round(r.bottom - top0));
      });
      var total = page.scrollHeight; bounds.push(total);
      bounds = bounds.filter(function (b, i, a) { return b > 0 && a.indexOf(b) === i; }).sort(function (a, b) { return a - b; });
      var cuts = [], start = 0;
      while (start < total - 1) {
        var limit = start + usable, best = 0;
        bounds.forEach(function (b) { if (b > start && b <= limit) best = b; });
        if (!best) best = Math.min(limit, total);
        cuts.push([start, best]); start = best;
      }
      return renderCanvas(page, holder).then(function (r) {
        var pdf = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
        var mmPerPx = 210 / W, bg = page.style.background || '#ffffff';
        cuts.forEach(function (c, i) {
          if (i) pdf.addPage();
          var hPx = c[1] - c[0];
          var slice = document.createElement('canvas');
          slice.width = r.canvas.width; slice.height = Math.max(1, Math.round(hPx * r.scale));
          var ctx = slice.getContext('2d'); ctx.fillStyle = bg; ctx.fillRect(0, 0, slice.width, slice.height);
          ctx.drawImage(r.canvas, 0, Math.round(c[0] * r.scale), slice.width, slice.height, 0, 0, slice.width, slice.height);
          if (bg !== '#ffffff') { pdf.setFillColor(bg); pdf.rect(0, 0, 210, 297, 'F'); }
          pdf.addImage(slice.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 48 * mmPerPx, 210, hPx * mmPerPx);
        });
        saveBlob(pdf.output('blob'), fileBase(n) + '.pdf');
      });
    }).finally(function () { if (holder) holder.remove(); });
  }
  function exportPrint(n) {
    return buildExportPage(n).then(function (page) {
      var area = $('printArea'); area.textContent = ''; area.appendChild(page);
      return (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
        var done = function () { area.textContent = ''; window.removeEventListener('afterprint', done); };
        window.addEventListener('afterprint', done);
        window.print();
      });
    });
  }
  function exportMenu(id) {
    var n = exportNote(id); if (!n) return;
    var body = el('div');
    body.appendChild(el('p', 'set-note', '"' + noteLabel(n) + '"을(를) 어떤 파일로 저장할까요?'));
    function run(fn, msg) {
      return function () {
        closeSheet(); toast('파일을 만드는 중…', 8000);
        var note = exportNote(id);
        Promise.resolve().then(function () { return fn(note); })
          .then(function () { toast(msg || '파일을 저장했습니다. (브라우저의 다운로드 폴더)', 4000); })
          .catch(function (e) {
            console.error(e);
            toast(e && e.message === 'lib' ? '처음 한 번은 인터넷에 연결된 상태에서 저장해 주세요. (PDF·이미지 저장 도구를 내려받아야 합니다)' : '파일을 만들지 못했습니다.', 6000);
          });
      };
    }
    body.appendChild(menuItem('file', '텍스트 파일 (.txt) — 글자만', run(exportTxt)));
    body.appendChild(menuItem('file', 'PDF 파일 (.pdf) — 보이는 그대로, A4', run(exportPdf)));
    body.appendChild(menuItem('image', '이미지 파일 (.png) — 노트 전체를 한 장으로', run(exportPng)));
    body.appendChild(menuItem('open', '웹 문서 (.html) — 서식·그림 포함, 브라우저·워드에서 열림', run(exportHtml)));
    body.appendChild(menuItem('print', '인쇄 (프린터 또는 "PDF로 저장" — 글자 선택 가능)', run(exportPrint, '인쇄 창을 열었습니다.')));
    openSheet('파일로 저장', body, [{ label: '닫기' }]);
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
    $('colorBtn').innerHTML = ic('color').replace('</svg>', '<rect id="colorBar" x="5" y="18" width="14" height="3" rx="1" fill="#E53935" stroke="none"/></svg>');
    $('upBtn').innerHTML = ic('back');
    $('hiliteBtn').innerHTML = ic('hilite').replace('</svg>', '<rect x="4" y="19" width="16" height="3" rx="1" fill="#FFD600" stroke="none"/></svg>');
    $('imgBtn').innerHTML = ic('image');
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
    $('upBtn').addEventListener('click', function () { if (state.query.trim()) { state.query = ''; $('searchInput').value = ''; $('searchBar').classList.add('hidden'); renderList(); } else goUp(); });
    $('scrim').addEventListener('click', closeDrawer);
    $('settingsBtn').addEventListener('click', openSettings);
    $('fab').addEventListener('click', function () {
      if (state.view.type !== 'home') { newNote(); return; }
      var body = el('div');
      body.appendChild(menuItem('edit', '새 노트 (폴더 없음)', function () { closeSheet(); newNote(); }));
      body.appendChild(menuItem('folder', '새 폴더', function () { closeSheet(); editFolder(null, null); }));
      openSheet('만들기', body, [{ label: '닫기' }]);
    });
    $('searchBtn').addEventListener('click', function () {
      var bar = $('searchBar'); bar.classList.toggle('hidden');
      if (!bar.classList.contains('hidden')) $('searchInput').focus();
      else { state.query = ''; $('searchInput').value = ''; renderList(); }
    });
    $('searchInput').addEventListener('input', function () { state.query = this.value; renderList(); });
    $('layoutBtn').addEventListener('click', function () {
      var body = el('div');
      body.appendChild(setRow('보기 방식', seg([['grid', '격자'], ['list', '목록']], settings.layout, function (v) { settings.layout = v; saveSettings(); renderList(); })));
      body.appendChild(setRow('격자 크기', seg(GRID_SIZES, settings.gridSize, function (v) { settings.gridSize = v; if (settings.layout !== 'grid') settings.layout = 'grid'; saveSettings(); renderList(); }), '노트 카드의 크기입니다. 작게 할수록 한 화면에 노트가 많이 보입니다.'));
      openSheet('보기 설정', body, [{ label: '닫기', primary: true }]);
    });
    $('sortBtn').addEventListener('click', function () {
      var body = el('div');
      [['updated', '수정한 날짜순'], ['created', '만든 날짜순'], ['title', '제목순'], ['manual', '직접 정렬 (노트를 끌어서 순서 정하기)']].forEach(function (o) {
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
    window.addEventListener('popstate', function () {
      if ($('mainView').classList.contains('editing') && !isWide()) { closeEditor(); return; }
      if (!$('sheetWrap').classList.contains('hidden')) closeSheet();
      if (state.view.type !== 'home' || state.query.trim()) goUp();
    });
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
      var cd = e.clipboardData, files = cd ? Array.prototype.slice.call(cd.files || []) : [];
      if (!files.length && cd && cd.items) files = Array.prototype.slice.call(cd.items).filter(function (it) { return it.kind === 'file'; }).map(function (it) { return it.getAsFile(); }).filter(Boolean);
      if (files.length) {
        var imgs = files.filter(function (f) { return /^image\//.test(f.type); }), others = files.filter(function (f) { return !/^image\//.test(f.type); });
        if (imgs.length) insertImages(imgs);   // 캡처 화면·그림은 노트 안에 바로 보이게
        if (others.length) addFiles(others);   // 그 밖의 파일은 첨부
        return;
      }
      var text = (e.clipboardData || window.clipboardData).getData('text/plain');
      document.execCommand('insertText', false, text);
    });
    ed.addEventListener('drop', function (e) {
      var dt = e.dataTransfer; if (!dt) return;
      if (dt.files && dt.files.length) {
        e.preventDefault();
        var fl = Array.prototype.slice.call(dt.files);
        var imgs = fl.filter(function (f) { return /^image\//.test(f.type); }), others = fl.filter(function (f) { return !/^image\//.test(f.type); });
        if (imgs.length) insertImages(imgs);
        if (others.length) addFiles(others);
        return;
      }
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
    $('imgBtn').addEventListener('click', function () { $('imgInput').click(); });
    $('imgInput').addEventListener('change', function () { insertImages(this.files); this.value = ''; });
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
      if (e.key === 'Escape' && drag) { cleanupDrag(); return; }
      if (e.key === 'Escape' && pressMenuNote) { hidePressMenu(); return; }
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
    window.addEventListener('resize', function () { if (isWide()) closeDrawer(); hidePressMenu(); });
    $('listScroll').addEventListener('scroll', function () { if (pressMenuNote && !(drag && drag.pressed)) hidePressMenu(); });
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
