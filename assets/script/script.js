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

// --- Промокоды ---------------------------------------------
// code — ключ (регистр не важен), coins — награда.
// Каждый код можно активировать один раз (на этом устройстве).
const PROMOCODES = [
  { code: '4R5643', coins: 5 },
  { code: '3B7SCG', coins: 5 },
  { code: 'S45VYY', coins: 5 },

  { code: '79U8IK', coins: 10 },
  { code: 'X3ATZF', coins: 10 },
  { code: '1QX6ZG', coins: 10 },

  { code: 'R5FC65', coins: 20 },
  { code: 'AXT7WV', coins: 20 },
  { code: 'J8N9JH', coins: 20 },

  { code: 'S4A7XS', coins: 25 },
  { code: 'SDVYSD', coins: 25 },
  { code: 'A3SXSY', coins: 25 },

  { code: 'WSU8DX', coins: 50 },
  { code: '7XGDIK', coins: 50 },
  { code: '24U8IK', coins: 50 },

  { code: '3V6VJC', coins: 100 },
  { code: 'E46VJD', coins: 100 },
  { code: '35763V', coins: 100 },
];

// --- Донат -------------------------------------------------
// price — цена в сомон, coins — сколько монет получит игрок
const DONATE_PACKS = [
  { price: 5,   coins: 5 },
  { price: 10,  coins: 12 },
  { price: 20,  coins: 25 },
  { price: 25,  coins: 35 },
  { price: 50,  coins: 75 },
  { price: 100, coins: 150 },
];

// Ссылка на оплату (DonationAlerts и т.п.). Пока пусто — работает демо:
// монеты начисляются сразу. Настоящую оплату нужно подтверждать на сервере.
const DONATE_URL = '';

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

// --- Редкости ----------------------------------------------
// weight — шанс выпадения (чем больше, тем чаще)
const RARITY = {
  c: { name: 'редкий',      color: '#9aa4b2', weight: 55 },
  u: { name: 'сверхредкий', color: '#4b8bff', weight: 25 },
  r: { name: 'эпический',   color: '#8b5cf6', weight: 12 },
  e: { name: 'аркана',      color: '#e11d1d', weight: 6 },
  l: { name: 'легендарный', color: '#ffb020', weight: 2 },
};
const BASE_PRICE = { c: 3, u: 5, r: 10, e: 15, l: 25 };

// --- Скины -------------------------------------------------
// Чтобы добавить скин — скопируй строку и поменяй значения.
//   weapon — оружие (по нему работает фильтр)
//   name   — название
//   rarity — c / u / r / e / l (см. RARITY выше)
//   hue    — цвет градиента 0–360 (виден, пока нет картинки)
//   image  — имя файла из папки assets/images/skins/ ('' = без картинки)
// Файл для кнопки «Установить» берётся по порядку: первый скин — assets/skins/1.zip, второй — 2.zip...
const IMAGES_ROOT = 'assets/images/';          // общие картинки: кейсы, баннер, окно
const IMAGES_DIR  = IMAGES_ROOT + 'skins/';    // картинки скинов

const SKIN_DATA = [
  { weapon: 'knife', name: 'Нож Керамбит Градиент', rarity: 'l', hue: 5, image: 'karambit-knife-fade.avif' },
  { weapon: 'knife', name: 'Нож Бабочка Синее море', rarity: 'l', hue: 5, image: 'butterfly-knife-blue-sea.avif' },
  { weapon: 'ak-47', name: 'AK-47 Неоновая революция', rarity: 'e', hue: 5, image: 'ak-47-neon-revolution.avif' },

  
  // { weapon: 'AK-47', name: 'AK-47 Огненный змей', rarity: 'l', hue: 25, image: 'ak47-fire.png' },
];

const SKINS = SKIN_DATA.map((data, id) => ({
  ...data,
  id,
  price: Math.round(BASE_PRICE[data.rarity] * (1 + (id % 5) * 0.12)),
  file: `assets/skins/${id + 1}.zip`,
}));

// --- Кейсы -------------------------------------------------
// Названия оружия пиши строчными буквами — так же, как в SKIN_DATA (weapon).
const T_WEAPONS  = ['ak-47', 'glock', 'deagle', 'p90', 'knife'];
const CT_WEAPONS = ['m4a1', 'usp', 'awp', 'scout', 'mp5'];
const hasWeapon = (list, skin) => list.includes(skin.weapon.toLowerCase());

// image — картинка кейса из папки assets/images/ (нет файла — покажется номер)
// hue   — цвет свечения вокруг кейса (0–360)
// tag   — значок в углу карточки ('' = без значка)
// has   — какие скины лежат в кейсе
// boost — шанс аркан и легендарок выше в 4 раза
const CASES = [
  { name: 'Кейс Бомжатник', price: 10, image: 'case_1.jpg', hue: 210, tag: '',    has: s => hasWeapon(T_WEAPONS, s) },
  { name: 'Кейс Среднечек', price: 20, image: 'case_2.jpg', hue: 280, tag: '',    has: s => hasWeapon(CT_WEAPONS, s) },
  { name: 'Кейс Богач',     price: 50, image: 'case_2.jpg', hue: 45,  tag: 'VIP', has: () => true, boost: true },
];

// --- Рулетка -----------------------------------------------
// Ширину предмета код берёт из CSS сам (.it), так что на телефоне ничего не собьётся.
const TRACK_LENGTH = 60;     // сколько предметов в ленте
const WIN_INDEX    = 52;     // какой по счёту предмет остановится под маркером
const SPIN_MS      = 6000;   // длительность прокрутки
const FAST_SPIN_MS = 2500;   // длительность, если игрок включил «Быстрое открытие» в настройках

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

const filter = { weapon: 'all', query: '', sort: 'default' };
let currentCase = null;
let spinning = false;
let selectedPack = 1;

function save() {
  try { localStorage.setItem('cs16', JSON.stringify(state)); } catch (e) {}
}

function updateBalance() {
  $('#bal').textContent = state.bal + 'с';
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

  updateButton() { $('#sound-btn').textContent = state.muted ? '🔇' : '🔊'; },
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

// --- Кейсы ---
function renderCases() {
  const items = CASES.map((c, k) => {
    const count = SKINS.filter(c.has).length;
    const button = count
      ? `<button class="p" data-action="open-case" data-id="${k}">Открыть за ${c.price}с</button>`
      : '<button type="button" disabled>Скоро</button>';
    return `
      <div class="case glass ${count ? '' : 'soon'}" style="--h:${c.hue}">
        ${c.tag ? `<span class="tag">${c.tag}</span>` : ''}
        <div class="crate">
          <img src="${IMAGES_ROOT}${c.image}" alt="${c.name}" loading="lazy" onerror="this.parentElement.textContent='${k + 1}'">
        </div>
        <h3>${c.name}</h3>
        <p>${count ? `${count} скинов${c.boost ? ', шанс редких выше' : ''}` : 'Скины появятся скоро'}</p>
        ${button}
      </div>`;
  }).join('');

  $('#app').innerHTML = `
    <h1>Кейсы</h1>
    <p class="sub">Открой кейс и смотри, что выпадет. Демо-режим ничего не списывает.</p>
    <div class="cases">${items}</div>`;
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
   ============================================================ */
function saveFile(href, filename) {
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function downloadSkin(id) {
  const skin = SKINS[id];
  const filename = `${skin.name}.zip`;
  try {
    const response = await fetch(skin.file);
    if (!response.ok) return toast(`Файл не найден: ${skin.file}`);

    const blob = await response.blob();
    if (blob.size < 100) return toast(`Файл ${skin.file} пустой — положи в него архив со скином`);   // пустой zip весит 22 байта

    const url = URL.createObjectURL(blob);
    saveFile(url, filename);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    toast(`Скачивается: ${skin.name}`);
  } catch (e) {
    saveFile(skin.file, filename);
  }
}

/* ============================================================
   6. РУЛЕТКА
   ============================================================ */

// Шансы скинов внутри кейса: [{ skin, weight }, ...]
function caseWeights(c) {
  return SKINS.filter(c.has).map(skin => ({
    skin,
    weight: RARITY[skin.rarity].weight * (c.boost && isRare(skin) ? 4 : 1),
  }));
}

function pickSkin(weights) {
  let roll = Math.random() * weights.reduce((sum, w) => sum + w.weight, 0);
  for (const w of weights) {
    if (roll <= w.weight) return w.skin;
    roll -= w.weight;
  }
  return weights[weights.length - 1].skin;
}

// Список «Что может выпасть» под рулеткой
function renderPool(c) {
  const weights = caseWeights(c);
  const total = weights.reduce((sum, w) => sum + w.weight, 0);
  $('#pool').innerHTML = weights
    .sort((a, b) => a.weight - b.weight)   // редкие — первыми
    .map(({ skin, weight }) => rouletteItem(skin, `<small class="chance">${(weight / total * 100).toFixed(1)}%</small>`))
    .join('') || '<div class="empty">В этом кейсе пока нет скинов.</div>';
}

// Один предмет: и в ленте рулетки, и в списке «Что может выпасть»
function rouletteItem(skin, extra = '') {
  return `
    <div class="it" style="--rc:${RARITY[skin.rarity].color}">
      ${skinArt(skin, false)}
      <b>${RARITY[skin.rarity].name}</b>
      <small>${skin.name}</small>
      ${extra}
    </div>`;
}

// Полная ширина предмета вместе с отступами — берём из реальной вёрстки
function itemWidth() {
  const item = $('#track .it');
  const style = getComputedStyle(item);
  return item.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
}

// Пока рулетка крутится, кнопки отключены
function setSpinButtons(disabled) {
  $('#go').disabled = disabled;
  $('#demo').disabled = disabled;
}

// Текст в блоке результата («Нажми…», «Крутим…»)
function setResult(text) {
  $('#result').innerHTML = `<p class="rv-note">${text}</p>`;
}

// До запуска в ленте лежит предпросмотр — предметы кейса по кругу
function showPreview(c) {
  const list = SKINS.filter(c.has);
  const track = $('#track');
  track.style.transition = 'none';
  track.style.transform = 'translateX(0)';
  track.innerHTML = list.length
    ? Array.from({ length: 14 }, (_, i) => rouletteItem(list[i % list.length])).join('')
    : '';
}

// Блок «Выпало»: большая картинка, название, редкость, цена и кнопки
// index — место выпавшего предмета в инвентаре (нужно для кнопки «Продать»)
function revealHTML(skin, demo, index = -1) {
  const rarity = RARITY[skin.rarity];
  const buttons = demo ? '' : `
    <div class="acts">
      <button class="btn install" data-install="${skin.id}" type="button">Установить</button>
      <button class="btn sell" data-sell="${index}" type="button">Продать ${sellPrice(skin.id)}с</button>
      <button class="btn" data-goto="inv" type="button">В инвентарь</button>
    </div>`;
  return `
    <div class="rv" style="--rc:${rarity.color}">
      <div class="rv-art ${isRare(skin) ? 'rare' : ''}">${skinArt(skin, false)}</div>
      <div class="rv-info">
        <small>${demo ? 'Демо — ничего не списано' : 'Тебе выпало'}</small>
        <h3>${skin.name}</h3>
        <span class="rv-tag">${rarity.name}</span><b class="rv-price">${skin.price}с</b>
        ${buttons}
      </div>
    </div>`;
}

function openCase(k) {
  currentCase = CASES[k];
  const empty = !SKINS.some(currentCase.has);
  $('#case-box').style.setProperty('--h', currentCase.hue);   // цвет свечения окна = цвет кейса
  $('#case-title').textContent = currentCase.name;
  $('#case-img').src = IMAGES_ROOT + currentCase.image;
  $('#case-price').textContent = currentCase.price + 'с';
  $('#go').textContent = `Открыть за ${currentCase.price}с`;
  $('#viewport').classList.remove('done', 'rare');
  showPreview(currentCase);
  setResult('Нажми «Открыть», чтобы запустить рулетку');
  setSpinButtons(empty);
  renderPool(currentCase);
  openModal('case-modal');
}

// Пока крутится лента, каждый раз когда под маркером меняется предмет — играем щелчок
// и подсвечиваем этот предмет. Звук и анимация идут точно в такт прокрутке.
function watchTrack(width) {
  const track = $('#track');
  const half = track.parentElement.clientWidth / 2;
  let last = -1;

  (function frame() {
    if (!spinning) return;
    const x = new DOMMatrix(getComputedStyle(track).transform).m41;   // текущий сдвиг ленты
    const index = Math.floor((half - x) / width);                // какой предмет под маркером
    if (index !== last) {
      track.children[last]?.classList.remove('cur');
      track.children[index]?.classList.add('cur');
      if (last !== -1) sound.play('tick');
      last = index;
    }
    requestAnimationFrame(frame);
  })();
}

function spin(demo) {
  if (spinning) return toast('Рулетка ещё крутится');
  if (!demo) {
    if (state.bal < currentCase.price) return toast('Не хватает монет — пополни баланс');
    state.bal -= currentCase.price;
    updateBalance();
  }

  const weights = caseWeights(currentCase);
  if (!weights.length) return toast('В этом кейсе пока нет скинов');

  spinning = true;
  setSpinButtons(true);
  $('#viewport').classList.remove('done', 'rare');
  setResult('Крутим…');

  const items = Array.from({ length: TRACK_LENGTH }, () => pickSkin(weights));
  const winner = items[WIN_INDEX];

  const track = $('#track');
  track.style.transition = 'none';
  track.style.transform = 'translateX(0)';
  track.innerHTML = items.map(skin => rouletteItem(skin)).join('');
  track.offsetWidth; // перезапуск анимации

  // Останавливаемся не ровно по центру предмета, а с небольшим случайным сдвигом (±30%)
  const width = itemWidth();
  const shift = WIN_INDEX * width + width / 2 - track.parentElement.clientWidth / 2 + (Math.random() * 0.6 - 0.3) * width;
  const spinMs = state.settings.fastSpin ? FAST_SPIN_MS : SPIN_MS;
  track.style.transition = `transform ${spinMs}ms cubic-bezier(.12,.7,.1,1)`;
  track.style.transform = `translateX(${-shift}px)`;

  sound.play('start');
  watchTrack(width);

  setTimeout(() => finishSpin(winner, demo), spinMs + 200);
}

function finishSpin(winner, demo) {
  spinning = false;
  setSpinButtons(false);
  if (!demo) { state.inv.push(winner.id); updateBalance(); }

  // Выигрышный предмет остаётся яркий, остальные гаснут, рамка светится цветом редкости
  const track = $('#track');
  [...track.children].forEach(el => el.classList.remove('cur'));
  track.children[WIN_INDEX].classList.add('win');

  const viewport = $('#viewport');
  viewport.style.setProperty('--rc', RARITY[winner.rarity].color);
  viewport.classList.add('done');
  viewport.classList.toggle('rare', isRare(winner));   // у аркан и легендарок рамка ещё и вспыхивает

  $('#result').innerHTML = revealHTML(winner, demo, state.inv.length - 1);
  sound.play(isRare(winner) ? 'rare' : 'win');
  toast(`${demo ? 'Демо: выпало' : 'Выпало:'} ${winner.weapon} | ${winner.name}`);
}

/* ============================================================
   7. ПРОМОКОДЫ И ДОНАТ
   ============================================================ */
function activatePromo() {
  const input = $('#promo-input');
  const code = input.value.trim().toUpperCase();
  if (!code) return toast('Введи промокод');

  const promo = PROMOCODES.find(p => p.code.toUpperCase() === code);
  if (!promo) return toast('Такого промокода нет');
  if (state.usedCodes.includes(code)) return toast('Этот промокод уже использован');

  state.usedCodes.push(code);
  state.bal += promo.coins;
  input.value = '';
  updateBalance();
  closeSide();
  toast(`Промокод принят: +${promo.coins}с`);
}

function renderPacks() {
  $('#packs').innerHTML = DONATE_PACKS.map((p, i) =>
    `<button class="pack ${i === selectedPack ? 'on' : ''}" data-pack="${i}"><b>${p.coins}с</b><small>${p.price} сомон</small></button>`
  ).join('');
  $('#pay-btn').textContent = `Перейти и оплатить ${DONATE_PACKS[selectedPack].price} сомон`;
}

function openDonate() {
  closeSide();
  renderPacks();
  openModal('donate-modal');
}

function pay() {
  const pack = DONATE_PACKS[selectedPack];
  if (DONATE_URL) {
    window.open(DONATE_URL, '_blank', 'noopener');
    return toast('Открыта страница оплаты');
  }
  state.bal += pack.coins;      // демо-режим
  updateBalance();
  closeModals();
  toast(`зачислено ${pack.coins}с`);
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

function openModal(id) { $('#' + id).classList.add('on'); }
function closeModals() {
  if (spinning) return toast('Дождись конца рулетки');
  $$('.modal').forEach(m => m.classList.remove('on'));
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
