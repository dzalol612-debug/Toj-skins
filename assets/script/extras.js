/* ============================================================
   ДОПОЛНЕНИЯ: Главная, Пасс, Настройки, окно «Как установить»
   Файл подключается ПОСЛЕ script.js и пользуется его общими вещами:
   state, save, updateBalance, toast, sound, SKINS, CASES, skinCard, skinArt, showPopup, openModal, PAGES, route.
   Структура файла:
     1. Настройки           — тексты, баннеры, реклама, пасс. Меняй здесь
     2. Помощники           — мелкие функции
     3. Окно установки      — инструкция, которая выезжает по кнопке «Установить»
     4. Главная
     5. Пасс                — ежедневная награда
     6. Настройки игрока    — страница «Настройки»
     7. Подключение к сайту — страницы, клики, таймеры
   ============================================================ */

/* ============================================================
   1. НАСТРОЙКИ
   ============================================================ */

// --- Пасс --------------------------------------------------
// Раз в календарный день игрок может зайти и забрать награду. Пропуски не сбрасывают прогресс.
const PASS = {
  title:  'Ежедневный пасс',
  season: 1,       // номер сезона (просто надпись)
  days:   30,      // сколько дней в сезоне (клеточек на странице)
  reward: 1,      // награда за каждый день, с
  bonus:  {1:2,7:2, 14: 2, 21: 2, 28: 2},      // добавка к награде в отдельные дни, например { 7: 5, 14: 10, 30: 25 }
};
// Дни, которые рисуются «особенными» (с подарком): каждый 7-й и все, что есть в PASS.bonus
const isBigDay = day => day % 7 === 0 || day in PASS.bonus;

// --- Инструкция по установке -------------------------------
// Каждая строка — один шаг. Внутри можно писать HTML: <b>жирный</b>, <code>путь</code>.
const INSTALL_STEPS = [
  'Нажми <b>«Скачать архив»</b> ниже — файл сохранится в папку «Загрузки».',
  'Распакуй архив (WinRAR или 7-Zip: правая кнопка → «Извлечь»). Внутри обычно лежит папка <code>models</code>, иногда ещё <code>sound</code> и <code>sprites</code>.',
  'Открой папку игры и зайди в <code>cstrike</code>. С Steam это обычно <code>Steam\\steamapps\\common\\Half-Life\\cstrike</code>, без Steam — папка, куда ты установил CS 1.6.',
  'Перетащи папки из архива в <code>cstrike</code> и согласись на <b>замену файлов</b>.',
  'Полностью закрой и снова запусти CS 1.6 — скин появится на оружии.',
];
const INSTALL_TIP = '💡 Перед заменой сделай копию папки <code>models</code> — так можно вернуть стандартные скины. На серверах с проверкой файлов (<code>sv_consistency</code>) чужие модели могут не работать.';

// --- Слайдер на главной ------------------------------------
// label — маленькая надпись, title/text — заголовок и описание, image — файл из assets/images/
// go — куда ведёт кнопка (#cases, #skins, #pass ...), hue — цвет подсветки 0–360
const SLIDE_MS = 5500;   // как часто слайды листаются сами
const HOME_SLIDES = [
  { label: 'Новинка', title: 'Открывай кейсы', text: 'Ножи, AK-47 и аркана. Шанс каждого скина виден под рулеткой.', image: 'case_1.jpg', hue: 210, button: 'К кейсам', go: '#cases' },
  { label: 'Каждый день', title: `+${PASS.reward}с за заход`, text: `Заходи на сайт ежедневно и забирай награду в пассе. ${PASS.days} дней — ${PASS.days * PASS.reward}с.`, image: 'case_2.jpg', hue: 45, button: 'Забрать награду', go: '#pass' },
  { label: 'Скины', title: 'Установка в один клик', text: 'Скачай архив и следуй короткой инструкции — скин будет в игре через минуту.', image: 'skins/karambit-knife-fade.avif', hue: 5, button: 'Смотреть скины', go: '#skins' },
];

// --- Реклама на главной ------------------------------------
// url пустой — блок показывается как «Свободное место». Укажи ссылку — блок станет кликабельным.
// image — файл из assets/images/ (необязательно)
const HOME_ADS = [
  { title: 'Твой баннер здесь', text: 'Размести рекламу на главной странице.', image: '',            url: '', hue: 200 },
  { title: 'Сервер CS 1.6',     text: 'Расскажи игрокам о своём сервере.',      image: 'case_1.jpg',  url: '', hue: 280 },
  { title: 'Магазин и услуги',  text: 'Пиши нам — оформим баннер под тебя.',   image: 'case_2.jpg',  url: '', hue: 45 },
];

// --- «Как это работает» ------------------------------------
const HOME_STEPS = [
  { icon: '💰', title: 'Пополни баланс', text: 'Забирай награду в пассе, вводи промокоды или пополни баланс.' },
  { icon: '🎁', title: 'Получи скин',    text: 'Купи скин в магазине или открой кейс — вдруг выпадет легендарка.' },
  { icon: '📥', title: 'Установи',       text: 'Нажми «Установить» в инвентаре и следуй короткой инструкции.' },
];

// --- Новости -----------------------------------------------
const HOME_NEWS = [
  { date: '15.11.2026', title: 'Ежедневный пасс',      text: `Заходи каждый день и получай по ${PASS.reward}с.` },
  { date: '15.11.2026', title: 'Продажа скинов',       text: `Скин из инвентаря можно продать за ${Math.round(SELL_RATE * 100)}% его цены.` },
  { date: '15.11.2026', title: 'Новые игры',           text: 'На сайте появились Краш, Блэкджек и Апгрейдер.' },
];

// --- Частые вопросы ----------------------------------------
const HOME_FAQ = [
  { q: 'Как установить скин?',        a: 'Открой «Инвентарь» и нажми «Установить» у нужного скина. Появится окно с короткой инструкцией и кнопкой скачивания.' },
  { q: 'Как работает пасс?',           a: `Раз в день на странице «Пасс» нажимаешь «Забрать» и получаешь ${PASS.reward}с. Если пропустил день — ничего не сгорает, прогресс продолжится.` },
  { q: 'За сколько можно продать скин?', a: `За ${Math.round(SELL_RATE * 100)}% от цены покупки. Кнопка «Продать» есть в инвентаре и сразу после открытия кейса.` },
  { q: 'Где взять промокод?',          a: 'Введи его в поле «Ключ-промокод» в меню (на телефоне — через ☰) и нажми «Активировать». Каждый код работает один раз.' },
  { q: 'Пропадёт ли мой прогресс?',    a: 'Данные хранятся в браузере на этом устройстве. Если чистишь данные браузера — сначала сохрани код на странице «Настройки».' },
];

/* ============================================================
   2. ПОМОЩНИКИ
   ============================================================ */
const pad = n => String(n).padStart(2, '0');

// Защита от «ломающих» символов — нужна везде, где в HTML вставляется текст игрока (ник)
const esc = text => String(text).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

// Сегодняшний день по часам устройства: '2026-11-15'
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Заголовок раздела на главной. link — необязательная ссылка справа
const section = (title, link = '') => `<h2 class="sec"><span>${title}</span>${link}</h2>`;

/* ============================================================
   3. ОКНО УСТАНОВКИ
   Кнопка «Установить» (в инвентаре и после открытия кейса) вызывает openInstall(id).
   Если игрок выключил инструкцию в настройках — архив скачивается сразу.
   ============================================================ */
let installId = -1;

function openInstall(id) {
  if (!state.settings.installGuide) return downloadSkin(id);

  const skin = SKINS[id];
  installId = id;
  $('#install-title').textContent = `${skin.weapon} | ${skin.name}`;
  $('#install-art').innerHTML = skinArt(skin, false);
  $('#install-steps').innerHTML = INSTALL_STEPS.map(step => `<li>${step}</li>`).join('');
  $('#install-tip').innerHTML = INSTALL_TIP;
  openModal('install-modal');
}

/* ============================================================
   4. ГЛАВНАЯ
   Страница собирается из маленьких функций — каждая возвращает один блок.
   Убрать блок = удалить его строку в renderHome().
   ============================================================ */
const home = { slide: 0, paused: false };

function renderHome() {
  $('#app').innerHTML = `
    ${homeSlider()}
    ${homeTop()}
    ${section('Популярные кейсы', '<a href="#cases">Все кейсы →</a>')}
    ${homeCases()}
    ${section('Лучшие скины', '<a href="#skins">Все скины →</a>')}
    <div class="grid">${homeBestSkins()}</div>
    ${section('Партнёры')}
    ${homeAds()}
    ${section('Как это работает')}
    ${homeSteps()}
    ${section('Новости')}
    ${homeNews()}
    ${section('Частые вопросы')}
    ${homeFaq()}`;

  homeSliderEvents();
}

// --- Слайдер ---
function homeSlider() {
  const slides = HOME_SLIDES.map((s, i) => `
    <div class="hs-slide ${i === home.slide ? 'on' : ''}" style="--h:${s.hue}">
      <div class="hs-text">
        <span class="hs-label">${s.label}</span>
        <h2>${s.title}</h2>
        <p>${s.text}</p>
        <button class="p big" data-go="${s.go}" type="button">${s.button}</button>
      </div>
      <div class="hs-img"><img src="${IMAGES_ROOT}${s.image}" alt="" onerror="this.remove()"></div>
    </div>`).join('');
  const dots = HOME_SLIDES.map((s, i) =>
    `<button class="hs-dot ${i === home.slide ? 'on' : ''}" data-slide="${i}" type="button" aria-label="Слайд ${i + 1}"></button>`
  ).join('');

  return `
    <section class="hs glass" id="hs">
      ${slides}
      <button class="hs-arrow prev" data-do="slide-prev" type="button" aria-label="Назад">‹</button>
      <button class="hs-arrow next" data-do="slide-next" type="button" aria-label="Вперёд">›</button>
      <div class="hs-dots">${dots}</div>
    </section>`;
}

// Показать слайд номер i (по кругу). Страница не перерисовывается — меняются только классы.
function showSlide(i) {
  const count = HOME_SLIDES.length;
  home.slide = (i + count) % count;
  $$('.hs-slide').forEach((el, k) => el.classList.toggle('on', k === home.slide));
  $$('.hs-dot').forEach((el, k) => el.classList.toggle('on', k === home.slide));
}

// Пауза при наведении мыши и свайп пальцем на телефоне
function homeSliderEvents() {
  const box = $('#hs');
  let startX = 0;
  box.addEventListener('mouseenter', () => { home.paused = true; });
  box.addEventListener('mouseleave', () => { home.paused = false; });
  box.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) showSlide(home.slide + (dx < 0 ? 1 : -1));
  });
}

// --- Приветствие, награда дня и цифры ---
function homeTop() {
  const info = passInfo();
  const nick = state.settings.nick;
  const total = state.inv.reduce((sum, id) => sum + SKINS[id].price, 0);

  const daily = info.canClaim
    ? `<p>Сегодня тебя ждёт <b>+${info.reward}с</b> · день ${info.next} из ${PASS.days}</p>
       <button class="p big" data-do="pass-claim" type="button">Забрать +${info.reward}с</button>`
    : `<p>Награда на сегодня получена ✓</p>
       <p class="timer">Следующая через <b id="pass-timer">${passTimeLeft()}</b></p>`;

  return `
    <div class="home-top">
      <section class="daily glass">
        <small>Ежедневная награда</small>
        <h2>${nick ? `Привет, ${esc(nick)}!` : 'Добро пожаловать!'}</h2>
        ${daily}
      </section>
      <div class="tiles">
        <div class="tile glass"><b>${state.bal}с</b><small>баланс</small></div>
        <div class="tile glass"><b>${state.inv.length}</b><small>скинов в инвентаре</small></div>
        <div class="tile glass"><b>${total}с</b><small>стоимость инвентаря</small></div>
        <div class="tile glass"><b>${info.done}/${PASS.days}</b><small>дней в пассе</small></div>
      </div>
    </div>`;
}

// --- Кейсы: компактные карточки, кнопка открывает окно рулетки прямо отсюда ---
function homeCases() {
  const items = CASES.map((c, k) => {
    const count = SKINS.filter(c.has).length;
    return `
      <div class="mc glass" style="--h:${c.hue}">
        <img src="${IMAGES_ROOT}${c.image}" alt="" loading="lazy" onerror="this.remove()">
        <div class="mc-info">
          <b>${c.name}</b>
          <small>${count ? `${count} скинов` : 'скоро'}</small>
        </div>
        ${count
          ? `<button class="p" data-action="open-case" data-id="${k}" type="button">${c.price}с</button>`
          : '<button disabled type="button">Скоро</button>'}
      </div>`;
  }).join('');
  return `<div class="mini-cases">${items}</div>`;
}

// --- Самые дорогие скины (до 4 штук) ---
function homeBestSkins() {
  return SKINS.slice()
    .sort((a, b) => b.price - a.price)
    .slice(0, 4)
    .map(s => skinCard(s, `<button class="p" data-action="buy" data-id="${s.id}" type="button">Купить</button>`))
    .join('');
}

// --- Реклама ---
function homeAds() {
  const items = HOME_ADS.map(ad => {
    const inner = `
      ${ad.image ? `<img src="${IMAGES_ROOT}${ad.image}" alt="" loading="lazy" onerror="this.remove()">` : ''}
      <span class="ad-tag">${ad.url ? 'Реклама' : 'Свободное место'}</span>
      <b>${ad.title}</b>
      <span>${ad.text}</span>`;
    return ad.url
      ? `<a class="ad glass" style="--h:${ad.hue}" href="${ad.url}" target="_blank" rel="noopener sponsored">${inner}</a>`
      : `<div class="ad glass free" style="--h:${ad.hue}">${inner}</div>`;
  }).join('');
  return `<div class="ads">${items}</div>`;
}

// --- Шаги, новости, вопросы ---
function homeSteps() {
  return `<div class="how">${HOME_STEPS.map((s, i) => `
    <div class="how-item glass">
      <span class="how-num">${i + 1}</span>
      <div class="how-ic">${s.icon}</div>
      <b>${s.title}</b>
      <p>${s.text}</p>
    </div>`).join('')}</div>`;
}

function homeNews() {
  return `<div class="news">${HOME_NEWS.map(n => `
    <div class="news-item glass">
      <span class="news-date">${n.date}</span>
      <div><b>${n.title}</b><p>${n.text}</p></div>
    </div>`).join('')}</div>`;
}

function homeFaq() {
  return `<div class="faq">${HOME_FAQ.map(f => `
    <details class="glass"><summary>${f.q}</summary><p>${f.a}</p></details>`).join('')}</div>`;
}

/* ============================================================
   5. ПАСС
   state.pass = { day: сколько наград забрано, last: дата последней награды }
   Награду можно забрать один раз за календарный день. Когда все дни сезона пройдены,
   следующая награда начинает сезон заново.
   ============================================================ */
const passReward = day => PASS.reward + (PASS.bonus[day] || 0);
const passCanClaim = () => state.pass.last !== todayKey();
let passFx = 0;   // номер клетки, которую только что забрали (для анимации)

// Всё, что нужно знать о пассе прямо сейчас
function passInfo() {
  const canClaim = passCanClaim();
  // Сезон закончился и наступил новый день — клетки «обнуляются»
  const done = (state.pass.day >= PASS.days && canClaim) ? 0 : state.pass.day;
  const next = Math.min(done + 1, PASS.days);
  return { canClaim, done, next, reward: passReward(next) };
}

function passClaim() {
  const info = passInfo();
  if (!info.canClaim) return toast('Сегодняшняя награда уже получена');

  state.pass.day = info.next;
  state.pass.last = todayKey();
  state.bal += info.reward;
  passFx = info.next;
  updateBalance();
  passDot();
  sound.play(isBigDay(info.next) ? 'rare' : 'win');
  toast(`+${info.reward}с · день ${info.next} из ${PASS.days}`);
  route();   // перерисовать страницу (пасс или главную)
}

// Сколько осталось до следующего дня: '05:12:33'
function passTimeLeft() {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const sec = Math.max(0, Math.floor((midnight - now) / 1000));
  return `${pad(Math.floor(sec / 3600))}:${pad(Math.floor(sec % 3600 / 60))}:${pad(sec % 60)}`;
}

// Красная точка у пункта «Пасс» в меню, когда награда ждёт
function passDot() {
  $$('nav a[data-page="pass"]').forEach(a => a.classList.toggle('dot', passCanClaim()));
}

function passTile(day, info) {
  const status = day <= info.done ? 'done'
               : day === info.next ? (info.canClaim ? 'today' : 'tomorrow')
               : 'locked';
  const label = { done: 'Получено', today: 'Забрать', tomorrow: 'Завтра', locked: '🔒' }[status];
  const icon = isBigDay(day) ? '<i class="chest">🎁</i>' : '<i class="coin">с</i>';
  const action = status === 'today' ? 'data-do="pass-claim"' : '';

  return `
    <div class="pd ${status} ${isBigDay(day) ? 'big' : ''} ${day === passFx ? 'fresh' : ''}" ${action}>
      <small>День ${day}</small>
      <div class="pd-ic">${icon}</div>
      <b>+${passReward(day)}с</b>
      <span class="pd-st">${label}</span>
    </div>`;
}

function renderPass() {
  const info = passInfo();
  const earned = Array.from({ length: info.done }, (_, i) => passReward(i + 1)).reduce((a, b) => a + b, 0);
  const everything = Array.from({ length: PASS.days }, (_, i) => passReward(i + 1)).reduce((a, b) => a + b, 0);
  const percent = Math.round(info.done / PASS.days * 100);

  const claim = info.canClaim
    ? `<button class="p big" data-do="pass-claim" type="button">Забрать +${info.reward}с</button>`
    : `<div class="pass-wait"><b>${info.done >= PASS.days ? 'Сезон пройден!' : 'Награда получена ✓'}</b>
         <small>Следующая через <span id="pass-timer">${passTimeLeft()}</span></small></div>`;

  $('#app').innerHTML = `
    <section class="pass-hero glass">
      <div>
        <span class="hs-label">Сезон ${PASS.season}</span>
        <h1>${PASS.title}</h1>
        <p class="sub">Заходи каждый день и забирай награду. Пропустил день — прогресс не сгорает.</p>
      </div>
      <div class="pass-claim">${claim}</div>
    </section>

    <section class="pass-progress glass">
      <div class="pass-stats">
        <div><b>${info.done}/${PASS.days}</b><small>дней пройдено</small></div>
        <div><b>${earned}с</b><small>получено</small></div>
        <div><b>${everything - earned}с</b><small>ещё можно забрать</small></div>
      </div>
      <div class="pbar"><div class="pbar-fill" style="width:${percent}%"></div></div>
    </section>

    <div class="pass-grid">
      ${Array.from({ length: PASS.days }, (_, i) => passTile(i + 1, info)).join('')}
    </div>`;

  passFx = 0;
}

/* ============================================================
   6. НАСТРОЙКИ ИГРОКА
   Каждый переключатель — элемент с data-set="имя". Обработчик в конце файла
   сам кладёт значение в state.settings[имя]. Чтобы добавить настройку:
   1) строка в SETTINGS_DEFAULT (script.js), 2) строка в renderSettings, 3) использовать её в коде.
   ============================================================ */

// Применяет настройки, которые влияют на оформление
function applySettings() {
  document.body.classList.toggle('no-anim', state.settings.noAnim);
  sound.updateButton();
}

// Строка с переключателем
const switchRow = (key, title, text, checked) => `
  <label class="set-row">
    <div><b>${title}</b><small>${text}</small></div>
    <span class="switch"><input type="checkbox" data-set="${key}" ${checked ? 'checked' : ''}><i></i></span>
  </label>`;

function renderSettings() {
  const s = state.settings;

  $('#app').innerHTML = `
    <h1>Настройки</h1>
    <p class="sub">Всё сохраняется на этом устройстве.</p>

    <div class="set">
      <section class="set-card glass">
        <h3>Профиль</h3>
        <div class="set-row">
          <div><b>Ник</b><small>Показывается на главной странице</small></div>
          <input type="text" data-set="nick" maxlength="16" placeholder="Твой ник" value="${esc(s.nick)}" autocomplete="off">
        </div>
      </section>

      <section class="set-card glass">
        <h3>Звук</h3>
        ${switchRow('sound', 'Звуки на сайте', 'Рулетка, покупки, награды', !state.muted)}
        <div class="set-row">
          <div><b>Громкость</b><small id="vol-text">${Math.round(s.volume * 100)}%</small></div>
          <input type="range" data-set="volume" min="0" max="100" step="5" value="${Math.round(s.volume * 100)}">
        </div>
      </section>

      <section class="set-card glass">
        <h3>Игра</h3>
        ${switchRow('installGuide', 'Инструкция при установке', 'Окно с шагами перед скачиванием скина', s.installGuide)}
        ${switchRow('confirmSell', 'Подтверждать продажу', 'Спрашивать перед тем, как продать скин', s.confirmSell)}
        ${switchRow('fastSpin', 'Быстрое открытие кейсов', 'Рулетка крутится меньше', s.fastSpin)}
      </section>

      <section class="set-card glass">
        <h3>Оформление</h3>
        ${switchRow('noAnim', 'Отключить анимации', 'Без свечения и плавающих элементов — удобно на слабых телефонах', s.noAnim)}
        <div class="set-row">
          <div><b>Баннер под шапкой</b><small>Вернуть баннер, если ты его закрыл</small></div>
          <button data-do="banner-reset" type="button">Показать</button>
        </div>
      </section>

      <section class="set-card glass">
        <h3>Данные</h3>
        <div class="set-block">
          <b>Сохранить прогресс</b>
          <small>Скопируй код и сохрани его. Им можно восстановить баланс и инвентарь на другом устройстве.</small>
          <textarea id="save-code" readonly rows="3"></textarea>
          <button data-do="copy-save" type="button">Скопировать код</button>
        </div>
        <div class="set-block">
          <b>Загрузить прогресс</b>
          <small>Вставь сюда код. Текущий прогресс будет заменён.</small>
          <textarea id="import-code" rows="3" placeholder="Вставь код сохранения"></textarea>
          <button data-do="import-save" type="button">Загрузить</button>
        </div>
        <div class="set-row">
          <div><b>Сбросить всё</b><small>Баланс, инвентарь, пасс и настройки вернутся к началу</small></div>
          <button class="danger" data-do="reset-all" type="button">Сбросить</button>
        </div>
      </section>
    </div>`;

  $('#save-code').value = makeSaveCode();
}

// Игрок поменял настройку (клик по переключателю, движение ползунка, ввод ника)
function settingChanged(e) {
  const el = e.target.closest('[data-set]');
  if (!el) return;
  // Ползунок реагирует сразу, всё остальное — когда игрок закончил (событие change)
  if (e.type === 'input' && el.type !== 'range') return;

  const key = el.dataset.set;
  if (key === 'sound')       state.muted = !el.checked;
  else if (key === 'volume') { state.settings.volume = el.value / 100; $('#vol-text').textContent = el.value + '%'; }
  else if (key === 'nick')   { state.settings.nick = el.value.trim().slice(0, 16); toast('Ник сохранён'); }
  else                       state.settings[key] = el.checked;

  save();
  applySettings();
  if (key === 'volume' && e.type === 'change') sound.play('tick');   // даём услышать новую громкость
}

// --- Сохранение и загрузка прогресса кодом ---
// Код — это сохранение в JSON, превращённое в base64 (нормально работает и с русским текстом).
function makeSaveCode() {
  const bytes = new TextEncoder().encode(JSON.stringify(state));
  let binary = '';
  bytes.forEach(b => { binary += String.fromCharCode(b); });
  return btoa(binary);
}

function readSaveCode(code) {
  const bytes = Uint8Array.from(atob(code.trim()), ch => ch.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function copySave() {
  const box = $('#save-code');
  box.select();
  (navigator.clipboard ? navigator.clipboard.writeText(box.value) : Promise.reject())
    .catch(() => document.execCommand('copy'))   // запасной вариант для старых браузеров
    .finally(() => toast('Код скопирован'));
}

function importSave() {
  let data;
  try { data = readSaveCode($('#import-code').value); } catch (e) { data = null; }
  if (!data || typeof data.bal !== 'number' || !Array.isArray(data.inv)) return toast('Код не подошёл — проверь, что скопировал его целиком');

  showPopup({
    title: 'Загрузить прогресс?',
    text: 'Текущий баланс и инвентарь будут заменены данными из кода.',
    button: 'Загрузить',
    onClick: () => {
      Object.assign(state, {
        bal: Math.max(0, Math.floor(data.bal)),
        inv: data.inv.filter(id => Number.isInteger(id) && SKINS[id]),   // выбрасываем несуществующие скины
        usedCodes: Array.isArray(data.usedCodes) ? data.usedCodes : [],
        muted: !!data.muted,
        closedBanner: data.closedBanner || '',
        settings: { ...SETTINGS_DEFAULT, ...data.settings },
        pass: { day: 0, last: '', ...data.pass },
      });
      state.pass.day = Math.min(PASS.days, Math.max(0, Math.floor(+state.pass.day) || 0));
      updateBalance();
      applySettings();
      renderBanner();
      passDot();
      route();
      toast('Прогресс загружен');
    },
  });
}

function resetAll() {
  showPopup({
    title: 'Сбросить всё?',
    text: 'Баланс, инвентарь, пасс и настройки будут удалены. Вернуть их нельзя.',
    button: 'Сбросить',
    onClick: () => {
      try { localStorage.removeItem('cs16'); } catch (e) {}
      location.reload();
    },
  });
}

/* ============================================================
   7. ПОДКЛЮЧЕНИЕ К САЙТУ
   Новая страница = функция renderXxx + строка в PAGES + ссылка в меню (index.html)
   ============================================================ */
Object.assign(PAGES, { home: renderHome, pass: renderPass, settings: renderSettings });

// Кнопки с data-do="..." запускают функции из этой таблицы
const EXTRA_ACTIONS = {
  'pass-claim':   passClaim,
  'slide-prev':   () => showSlide(home.slide - 1),
  'slide-next':   () => showSlide(home.slide + 1),
  'banner-reset': () => { state.closedBanner = ''; save(); renderBanner(); toast('Баннер снова показан'); },
  'copy-save':    copySave,
  'import-save':  importSave,
  'reset-all':    resetAll,
};

$('#app').addEventListener('click', e => {
  EXTRA_ACTIONS[e.target.closest('[data-do]')?.dataset.do]?.();

  const go = e.target.closest('[data-go]');        // кнопка-ссылка: data-go="#cases"
  if (go) location.hash = go.dataset.go;

  const dot = e.target.closest('[data-slide]');    // точка под слайдером
  if (dot) showSlide(+dot.dataset.slide);
});

$('#app').addEventListener('change', settingChanged);
$('#app').addEventListener('input', settingChanged);

$('#install-download').addEventListener('click', () => downloadSkin(installId));

// Таймеры: слайдер листается сам, а таймер пасса идёт каждую секунду
setInterval(() => { if ($('#hs') && !home.paused) showSlide(home.slide + 1); }, SLIDE_MS);

let knownDay = todayKey();
setInterval(() => {
  if (todayKey() !== knownDay) {                   // наступил новый день — награда снова доступна
    knownDay = todayKey();
    passDot();
    if (['home', 'pass'].includes(location.hash.slice(1) || DEFAULT_PAGE)) route();
  }
  const timer = $('#pass-timer');
  if (timer) timer.textContent = passTimeLeft();
}, 1000);

applySettings();
passDot();
route();   // перерисовать страницу: теперь главная и пасс уже существуют
