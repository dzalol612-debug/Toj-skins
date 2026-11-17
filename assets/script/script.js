/* ============================================================
   ГДЕ ЧТО ЛЕЖИТ (порядок подключения — в index.html)
     skins.js      — редкости, цены, список скинов
     cases.js      — кейсы, шансы, страница «Кейсы», рулетка
     promocodes.js — промокоды и их активация
     script.js     — этот файл: баланс, инвентарь, скачивание, звук, меню, баннер, пополнение
     extras.js     — главная, пасс, настройки, окно установки (с видео)
     games.js      — Краш, Блэкджек, Апгрейдер
   ============================================================ */

/* ============================================================
   1. НАСТРОЙКИ — всё, что ты будешь менять, лежит в этом блоке
   ============================================================ */
const START_BALANCE = 0;

// --- Звуки -------------------------------------------------
// Просто положи файлы в папку assets/sounds/ с этими именами.
// Нет файла — нет звука, ошибок не будет.
const SOUNDS = {
  tick:  'assets/sounds/tick.mp3',    // щелчок при каждом проезде предмета мимо маркера
  start: 'assets/sounds/start.mp3',   // старт рулетки
  win:   'assets/sounds/win.mp3',     // обычный выигрыш
  rare:  'assets/sounds/rare.mp3',    // выпала аркана или легендарка
  buy:   'assets/sounds/buy.mp3',     // покупка скина
};
const VOLUME = 0.5;                   // громкость от 0 до 1


// --- Пополнение баланса ------------------------------------
// price — цена в сомон, coins — сколько монет получит игрок
const DONATE_PACKS = [
  { price: 5,   coins: 5 },
  { price: 10,  coins: 12 },
  { price: 20,  coins: 25 },
  { price: 25,  coins: 35 },
  { price: 50,  coins: 75 },
  { price: 100, coins: 150 },
];

// Оплата без сервера и касс — вручную:
//  1) игрок переводит деньги по твоим реквизитам,
//  2) нажимает «Я оплатил» — открывается твой чат в Telegram с готовым сообщением, он шлёт туда чек,
//  3) ты проверяешь поступление и отвечаешь ему промокодом на нужную сумму (коды готовишь заранее в tools/codes.html).
// telegram — твой ник без @. Пока он пустой, игроки видят «Оплата временно недоступна».
// methods  — способы оплаты. name — название, details — номер карты или кошелька (пустой details = способ не показывается).
const PAY = {
  telegram: 'yusufl_999',
  methods: [
    { name: 'Карта',  details: '' },    // например: Корти Милли 0000 0000 0000 0000
    { name: 'Alif | Дилбар Б.', details: '935304019' },   // например: Alif / DC Wallet +992 000 00 00 00
  ],
};

// --- Баннер ------------------------------------------------
// Полоса под шапкой. enabled: false — баннер скрыт совсем.
// id — меняй его, когда меняешь текст: тогда баннер снова появится у тех, кто его закрыл.
// image — файл из папки assets/images/ ('' = без картинки).
// onClick — что произойдёт по кнопке. Здесь открывается всплывающее окно (см. showPopup ниже).
const BANNER = {
  enabled: true,
  id: 'new-cases',
  title: '🔥 Новые кейсы уже открыты',
  text: 'Открывай кейсы и забирай аркану и легендарки.',
  button: 'Подробнее',
  image: 'case_1.jpg',
  onClick: () => showPopup({
    title: 'Новые кейсы',
    text: 'В кейсах лежат ножи, AK-47 и другие скины.\nШанс редких скинов показан под каждой рулеткой.',
    image: 'case_2.jpg',
    button: 'К кейсам',
    onClick: () => { location.hash = '#cases'; },
  }),
};



// --- Продажа скинов из инвентаря ---------------------------
// 0.5 = скин продаётся в 2 раза дешевле цены покупки. Дробная часть отбрасывается (25с → 12с).
const SELL_RATE = 0.5;

// --- Настройки игрока --------------------------------------
// Значения по умолчанию. Игрок меняет их на странице «Настройки», хранятся на его устройстве.
const SETTINGS_DEFAULT = {
  nick: '',            // имя на главной странице
  volume: VOLUME,      // громкость 0–1
  confirmSell: true,   // спрашивать подтверждение перед продажей
  installGuide: true,  // показывать окно с инструкцией по кнопке «Установить»
  fastSpin: false,     // быстрая рулетка
  noAnim: false,       // выключить декоративные анимации
};

/* ============================================================
   2. ОБЩЕЕ: состояние, хранение, мелкие помощники
   ============================================================ */
const pad = n => String(n).padStart(2, '0');

// Сегодняшний день по часам устройства: '2026-11-15'
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Баланс для шапки: до 9 999 — полностью, дальше сокращаем (12,5K, 1,2M), чтобы число не ломало вёрстку
function fmtCoins(n) {
  const short = (value, unit) => String(Math.floor(value * 10) / 10).replace('.', ',') + unit;
  if (n >= 1e6)  return short(n / 1e6, 'M');
  if (n >= 1e4)  return short(n / 1e3, 'K');
  return n.toLocaleString('ru-RU');
}

const $  = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

const state = {
  bal: START_BALANCE, inv: [], usedCodes: [], muted: false, closedBanner: '',
  settings: {},                    // настройки игрока (см. SETTINGS_DEFAULT)
  pass: { day: 0, last: '' },      // пасс: сколько наград забрано и в какой день была последняя
};
try { Object.assign(state, JSON.parse(localStorage.getItem('cs16'))); } catch (e) {}

// Если в старом сохранении нет новых полей — добавляем значения по умолчанию
state.settings = { ...SETTINGS_DEFAULT, ...state.settings };
state.pass     = { day: 0, last: '', ...state.pass };
delete state.freeDay;   // остаток старого сохранения: бесплатного кейса больше нет

const filter = { weapon: 'all', query: '', sort: 'default' };
let selectedPack = 1;

function save() {
  try { localStorage.setItem('cs16', JSON.stringify(state)); } catch (e) {}
}

function updateBalance() {
  $('#bal').textContent = fmtCoins(state.bal) + 'с';
  $('#bal').title = state.bal.toLocaleString('ru-RU') + 'с';   // полное число — по наведению
  save();
}

function toast(text) {
  const el = $('#toast');
  el.textContent = text;
  el.classList.add('on');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('on'), 2200);
}

const isRare = skin => 'el'.includes(skin.rarity);   // аркана или легендарка

/* ============================================================
   3. ЗВУК
   Использование в коде: sound.play('tick')
   ============================================================ */
const sound = {
  pools: {},

  // Для каждого звука делаем несколько копий, чтобы щелчки могли накладываться друг на друга
  init() {
    for (const [name, src] of Object.entries(SOUNDS)) {
      const copies = name === 'tick' ? 8 : 2;
      this.pools[name] = { index: 0, list: Array.from({ length: copies }, () => new Audio(src)) };
    }
    this.updateButton();
  },

  play(name) {
    const pool = this.pools[name];
    if (state.muted || !pool) return;
    const audio = pool.list[pool.index++ % pool.list.length];
    audio.volume = state.settings.volume;
    audio.currentTime = 0;
    audio.play().catch(() => {});   // файла нет или браузер не разрешил — молча пропускаем
  },

  toggle() {
    state.muted = !state.muted;
    save();
    this.updateButton();
    toast(state.muted ? 'Звук выключен' : 'Звук включён');
  },

  updateButton() { $('#sound-btn').textContent = state.muted ? '🔇 Звук выключен' : '🔊 Звук включён'; },
};

/* ============================================================
   4. КАРТОЧКИ СКИНОВ
   ============================================================ */

// Картинка скина. Если image не указан или файл не найден — остаётся градиент с иконкой.
function skinArt(skin, label = true) {
  const img = skin.image
    ? `<img src="${IMAGES_DIR}${skin.image}" alt="${skin.name}" loading="lazy" onerror="this.remove()">`
    : '';
  return `<div class="art" style="--h:${skin.hue}">
            ${GUN_ICON}${img}${label ? `<em>${skin.weapon}</em>` : ''}
          </div>`;
}

// button — кнопка справа от цены, extra — любой HTML под ценой (например, ряд кнопок в инвентаре)
function skinCard(skin, button = '', extra = '') {
  const rarity = RARITY[skin.rarity];
  return `
    <div class="card glass" data-r="${skin.rarity}" style="--rc:${rarity.color}">
      ${skinArt(skin)}
      <h3>${skin.name}</h3>
      <p style="color:${rarity.color}">${rarity.name}</p>
      <div class="row"><b>${skin.price}с</b>${button}</div>
      ${extra}
    </div>`;
}

const GUN_ICON = '<svg viewBox="0 0 100 30"><path d="M1 12h60l6-4h18l4 4h8v5H80l-4 3H62l-4 9h-8l3-9H30l-6 4h-8l2-8H2z" fill="rgba(255,255,255,.9)"/></svg>';

/* ============================================================
   5. СТРАНИЦЫ
   ============================================================ */

// --- Скины ---
function renderSkins() {
  const weapons = ['all', ...new Set(SKINS.map(s => s.weapon))];
  const chips = weapons.map(w =>
    `<button class="chip ${filter.weapon === w ? 'on' : ''}" data-action="filter" data-id="${w}">${w === 'all' ? 'Все' : w}</button>`
  ).join('');
  const sortOption = (value, text) => `<option value="${value}" ${filter.sort === value ? 'selected' : ''}>${text}</option>`;

  $('#app').innerHTML = `
    <section class="hero glass">
      <div>
        <h1>Скины для <span>CS 1.6</span></h1>
        <p class="sub">Выбери оружие, найди скин, забери в инвентарь и установи в один клик.</p>
      </div>
      <div class="stats">
        <div><b>${SKINS.length}</b><small>скинов</small></div>
        <div><b>${CASES.length}</b><small>кейса</small></div>
        <div><b>${state.inv.length}</b><small>у тебя</small></div>
      </div>
    </section>

    <div class="bar">
      ${chips}
      <input id="search" placeholder="Поиск по названию" value="${filter.query}">
      <select id="sort">
        ${sortOption('default', 'По умолчанию')}
        ${sortOption('cheap', 'Сначала дешёвые')}
        ${sortOption('expensive', 'Сначала дорогие')}
        ${sortOption('rarity', 'По редкости')}
      </select>
    </div>
    <div class="grid" id="grid"></div>`;

  $('#search').oninput = e => { filter.query = e.target.value; renderGrid(); };
  $('#sort').onchange  = e => { filter.sort = e.target.value;  renderGrid(); };
  renderGrid();
}

const rarityOrder = Object.keys(RARITY);   // от обычных к легендарным
const SORTERS = {
  default:   () => 0,
  cheap:     (a, b) => a.price - b.price,
  expensive: (a, b) => b.price - a.price,
  rarity:    (a, b) => rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity),
};

function renderGrid() {
  const query = filter.query.toLowerCase();
  const list = SKINS
    .filter(s => (filter.weapon === 'all' || s.weapon === filter.weapon) && (s.name + s.weapon).toLowerCase().includes(query))
    .sort(SORTERS[filter.sort]);

  $('#grid').innerHTML = list.length
    ? list.map(s => skinCard(s, `<button class="p" data-action="buy" data-id="${s.id}">Купить</button>`)).join('')
    : '<div class="empty">Ничего не найдено. Измени фильтр или запрос.</div>';
}

function buySkin(id) {
  const skin = SKINS[id];
  if (state.bal < skin.price) return toast('Не хватает монет — пополни баланс');
  state.bal -= skin.price;
  state.inv.push(id);
  updateBalance();
  sound.play('buy');
  toast(`Куплено: ${skin.weapon} | ${skin.name}`);
}


// --- Инвентарь ---
// Цена продажи: цена покупки × SELL_RATE, минимум 1с
const sellPrice = id => Math.max(1, Math.floor(SKINS[id].price * SELL_RATE));

function renderInventory() {
  const total = state.inv.reduce((sum, id) => sum + SKINS[id].price, 0);
  const payout = state.inv.reduce((sum, id) => sum + sellPrice(id), 0);

  // index — место предмета в массиве state.inv: по нему продаём (одинаковых скинов может быть несколько)
  const cards = state.inv.map((id, index) => skinCard(SKINS[id], '', `
    <div class="inv-acts">
      <button class="btn install" data-install="${id}" type="button">Установить</button>
      <button class="btn sell" data-sell="${index}" type="button">Продать ${sellPrice(id)}с</button>
    </div>`)).join('');

  $('#app').innerHTML = `
    <div class="inv-head">
      <div>
        <h1>Инвентарь</h1>
        <p class="sub">Предметов: ${state.inv.length}. Стоимость: ${total}с. Продажа — в ${Math.round(1 / SELL_RATE * 10) / 10} раза дешевле цены покупки.</p>
      </div>
      ${state.inv.length ? `<button class="btn sell" data-sell-all type="button">Продать всё за ${payout}с</button>` : ''}
    </div>
    ${state.inv.length
      ? `<div class="grid">${cards}</div>`
      : '<div class="empty glass">Здесь пока пусто. Купи скин или открой кейс.</div>'}`;
}

// Продать один предмет. Если в настройках включено подтверждение — сначала спрашиваем.
function sellSkin(index) {
  const id = state.inv[index];
  if (id === undefined) return;
  const skin = SKINS[id];

  if (!state.settings.confirmSell) return doSell(index);
  showPopup({
    title: 'Продать скин?',
    text: `${skin.weapon} | ${skin.name}\nТы получишь ${sellPrice(id)}с (куплен был за ${skin.price}с).`,
    button: 'Продать',
    onClick: () => doSell(index),
  });
}

function doSell(index) {
  const id = state.inv[index];
  if (id === undefined) return;
  state.inv.splice(index, 1);
  state.bal += sellPrice(id);
  updateBalance();
  sound.play('buy');
  toast(`Продано: ${SKINS[id].name} (+${sellPrice(id)}с)`);

  // Если продали прямо из окна кейса — убираем карточку выпавшего скина, чтобы нельзя было нажать дважды
  const fromCase = $('#result [data-sell]');
  if (fromCase && +fromCase.dataset.sell === index) setResult(`Продано: ${SKINS[id].name} (+${sellPrice(id)}с)`);

  route();   // перерисовать текущую страницу (в инвентаре пропадёт проданный предмет)
}

function sellAll() {
  if (!state.inv.length) return;
  const payout = state.inv.reduce((sum, id) => sum + sellPrice(id), 0);
  showPopup({
    title: 'Продать всё?',
    text: `Предметов: ${state.inv.length}. Ты получишь ${payout}с. Вернуть скины будет нельзя.`,
    button: 'Продать всё',
    onClick: () => {
      state.inv = [];
      state.bal += payout;
      updateBalance();
      sound.play('buy');
      toast(`Продано всё: +${payout}с`);
      route();
    },
  });
}

/* ============================================================
   5.5. СКАЧИВАНИЕ СКИНА
   Файл скачивается через fetch → Blob, а не просто ссылкой: так загрузка работает
   и в браузерах телефонов. Если сайт открыт прямо с диска (file://) и fetch запрещён,
   включается запасной вариант — обычная ссылка с download.
   После успешного скачивания скин ИСЧЕЗАЕТ из инвентаря (один экземпляр): архив выдан, второй раз его не скачать.
   Если файла нет или он пустой — скин остаётся в инвентаре.
   ============================================================ */
function saveFile(href, filename) {
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// Убирает из инвентаря один экземпляр скина с этим id. Возвращает true, если скин был
function consumeSkin(id) {
  const index = state.inv.indexOf(id);
  if (index === -1) return false;
  state.inv.splice(index, 1);
  updateBalance();   // заодно сохраняет
  return true;
}

// Скачивание началось: убираем скин, закрываем окно установки и обновляем страницу
function skinDownloaded(id) {
  consumeSkin(id);
  closeModal('install-modal');
  toast(`Скачивается: ${SKINS[id].name}. Скин убран из инвентаря`);

  // если скачали прямо из окна кейса — карточка выпавшего скина больше не нужна
  if ($(`#result [data-install="${id}"]`)) setResult('Скин скачан и убран из инвентаря');
  route();   // в инвентаре пропадёт карточка
}

async function downloadSkin(id) {
  const skin = SKINS[id];
  if (!state.inv.includes(id)) return toast('Этого скина уже нет в инвентаре');
  const filename = `${skin.name}.zip`;
  try {
    const response = await fetch(skin.file);
    if (!response.ok) return toast(`Файл не найден: ${skin.file}. Скин остался в инвентаре`);

    const blob = await response.blob();
    if (blob.size < 100) return toast(`Файл ${skin.file} пустой — положи в него архив со скином`);   // пустой zip весит 22 байта

    const url = URL.createObjectURL(blob);
    saveFile(url, filename);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    skinDownloaded(id);
  } catch (e) {
    // fetch не сработал (чаще всего сайт открыт с диска). Проверить, что файл скачался, нельзя —
    // поэтому скин убираем только при локальном тесте (file://), на настоящем сайте он остаётся.
    saveFile(skin.file, filename);
    if (location.protocol === 'file:') skinDownloaded(id);
    else toast('Не удалось проверить загрузку — скин остался в инвентаре');
  }
}


/* ============================================================
   7. ПРОМОКОДЫ И ДОНАТ
   ============================================================ */

let orderId = '';   // номер заказа: игрок присылает его вместе с чеком

function renderPacks() {
  const pack = DONATE_PACKS[selectedPack];
  const methods = PAY.methods.filter(m => m.details);
  const ready = PAY.telegram && methods.length;

  $('#packs').innerHTML = DONATE_PACKS.map((p, i) =>
    `<button class="pack ${i === selectedPack ? 'on' : ''}" data-pack="${i}"><b>${p.coins}с</b><small>${p.price} сомон</small></button>`
  ).join('');

  $('#pay-info').innerHTML = ready ? `
    <p class="pay-step"><b>1.</b> Переведи <b>${pack.price} сомон</b> любым способом:</p>
    ${methods.map(m => `
      <div class="pay-method">
        <div><small>${m.name}</small><b>${m.details}</b></div>
        <button type="button" data-copy="${m.details}">Копировать</button>
      </div>`).join('')}
    <p class="pay-step"><b>2.</b> Нажми «Я оплатил» и отправь чек в Telegram. Заказ <b>#${orderId}</b>.</p>
    <p class="pay-step"><b>3.</b> Получишь промокод на ${pack.coins}с. Введи его в поле «Промокод».</p>`
    : '<p class="pay-warn">Оплата временно недоступна. Загляни позже.</p>';

  $('#pay-btn').textContent = 'Я оплатил — написать в Telegram';
  $('#pay-btn').disabled = !ready;
}

function openDonate() {
  closeSide();
  orderId = Math.random().toString(36).slice(2, 7).toUpperCase();
  renderPacks();
  openModal('donate-modal');
}

// Открывает чат с тобой в Telegram и подставляет сообщение с суммой и номером заказа
function pay() {
  const pack = DONATE_PACKS[selectedPack];
  const text = `Пополнение: ${pack.coins}с за ${pack.price} сомон. Заказ #${orderId}. Чек прикладываю.`;
  const url = `https://t.me/${PAY.telegram}?text=${encodeURIComponent(text)}`;
  if (window.Telegram?.WebApp?.openTelegramLink) Telegram.WebApp.openTelegramLink(url);   // внутри Telegram Mini App
  else window.open(url, '_blank', 'noopener');
}

function copyText(text) {
  (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
    .then(() => toast('Скопировано'))
    .catch(() => toast('Не удалось скопировать — выдели текст вручную'));
}

/* ============================================================
   7.5. БАННЕР И ВСПЛЫВАЮЩЕЕ ОКНО

   Вызвать окно можно откуда угодно — из кода или из консоли браузера (F12):

     showPopup({
       title:  'Заголовок',
       text:   'Текст окна (\\n — перенос строки)',
       image:  'case_1.jpg',            // необязательно, файл из assets/images/
       button: 'Перейти',               // текст кнопки (по умолчанию «Понятно»)
       onClick: () => { ... },          // необязательно: что сделать по кнопке
     });

   Если onClick не указан — окно просто закроется по кнопке.
   ============================================================ */
let popupAction = null;

function showPopup({ title = '', text = '', image = '', button = 'Понятно', onClick = null } = {}) {
  $('#popup-title').textContent = title;
  $('#popup-text').textContent = text;
  $('#popup-btn').textContent = button;
  $('#popup-cancel').hidden = !onClick;   // «Закрыть» нужна, только если у главной кнопки есть действие

  const img = $('#popup-img');
  img.hidden = !image;
  if (image) img.src = IMAGES_ROOT + image;

  popupAction = onClick;
  openModal('popup-modal');
}

function popupConfirm() {
  const action = popupAction;
  popupAction = null;
  closeModals();
  if (action) action();
}

function renderBanner() {
  const box = $('#banner');
  if (!BANNER.enabled || state.closedBanner === BANNER.id) { box.innerHTML = ''; return; }

  box.innerHTML = `
    <div class="banner glass">
      ${BANNER.image ? `<img src="${IMAGES_ROOT}${BANNER.image}" alt="" onerror="this.remove()">` : ''}
      <div class="bt"><b>${BANNER.title}</b><span>${BANNER.text}</span></div>
      <button class="p" data-banner="go" type="button">${BANNER.button}</button>
      <button class="x" data-banner="close" type="button" aria-label="Закрыть баннер">✕</button>
    </div>`;
}

$('#banner').addEventListener('click', e => {
  const action = e.target.closest('[data-banner]')?.dataset.banner;
  if (action === 'go') BANNER.onClick?.();
  if (action === 'close') { state.closedBanner = BANNER.id; save(); renderBanner(); }
});

/* ============================================================
   8. МЕНЮ, ОКНА, НАВИГАЦИЯ
   ============================================================ */
const openSide  = () => document.body.classList.add('side-open');
const closeSide = () => document.body.classList.remove('side-open');

// Функции, которые нужно вызвать при закрытии окон (extras.js ставит сюда остановку видео)
const onModalsClosed = [];

function openModal(id) { $('#' + id).classList.add('on'); }

// Закрыть одно окно (остальные остаются открытыми)
function closeModal(id) {
  $('#' + id).classList.remove('on');
  onModalsClosed.forEach(fn => fn());
}

function closeModals() {
  if (spinning) return toast('Дождись конца рулетки');
  $$('.modal').forEach(m => m.classList.remove('on'));
  onModalsClosed.forEach(fn => fn());
}

// Страницы сайта. Остальные (home, pass, settings, игры) добавляют extras.js и games.js
const PAGES = { skins: renderSkins, cases: renderCases, inv: renderInventory };
const DEFAULT_PAGE = 'home';

function route() {
  const hash = location.hash.slice(1);
  const page = hash in PAGES ? hash : DEFAULT_PAGE;
  $$('nav a').forEach(a => a.classList.toggle('on', a.dataset.page === page));
  closeSide();
  (PAGES[page] || PAGES.skins)();   // extras.js ещё не загружен на самом первом вызове — рисуем скины, потом перерисуется
}

/* ============================================================
   9. СОБЫТИЯ И ЗАПУСК
   ============================================================ */
// Клики внутри страницы (один обработчик на все страницы)
$('#app').addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const { action, id } = el.dataset;
  if (action === 'filter') { filter.weapon = id; renderSkins(); }
  if (action === 'buy') buySkin(+id);
  if (action === 'open-case') openCase(+id);
});

$('#go').addEventListener('click', () => spin(false));
$('#demo').addEventListener('click', () => spin(true));

$('#burger').addEventListener('click', openSide);
$('#overlay').addEventListener('click', closeSide);
$('#sound-btn').addEventListener('click', () => sound.toggle());
$('#promo-btn').addEventListener('click', activatePromo);
$('#promo-input').addEventListener('keydown', e => { if (e.key === 'Enter') activatePromo(); });
$('#donate-btn').addEventListener('click', openDonate);
$('#pay-btn').addEventListener('click', pay);
$('#popup-btn').addEventListener('click', popupConfirm);

$('#pay-info').addEventListener('click', e => {
  const el = e.target.closest('[data-copy]');
  if (el) copyText(el.dataset.copy);
});

$('#packs').addEventListener('click', e => {
  const el = e.target.closest('[data-pack]');
  if (el) { selectedPack = +el.dataset.pack; renderPacks(); }
});

// Закрытие окон: крестик, кнопка «Закрыть», клик по фону, Esc
$$('[data-close]').forEach(b => b.addEventListener('click', closeModals));
$$('.modal').forEach(m => m.addEventListener('click', e => { if (e.target === m) closeModals(); }));
addEventListener('keydown', e => { if (e.key === 'Escape') { closeSide(); closeModals(); } });

// «Установить» и «В инвентарь» — работают и на странице инвентаря, и в окне кейса
document.addEventListener('click', e => {
  const install = e.target.closest('[data-install]');
  if (install) openInstall(+install.dataset.install);   // окно с инструкцией (extras.js)

  const sell = e.target.closest('[data-sell]');
  if (sell) sellSkin(+sell.dataset.sell);

  if (e.target.closest('[data-sell-all]')) sellAll();

  const goto = e.target.closest('[data-goto]');
  if (goto) { closeModals(); location.hash = '#' + goto.dataset.goto; }
});

addEventListener('hashchange', route);

sound.init();
updateBalance();
renderBanner();
route();
