/* ============================================================
   КЕЙСЫ: список кейсов, шансы, страница «Кейсы» и рулетка
   Подключается ПОСЛЕ skins.js и ДО script.js.
   Здесь только объявления: всё, что трогает страницу ($, state, toast...), живёт в функциях
   и вызывается позже, когда script.js уже загружен.
   Структура файла:
     1. Настройки кейсов — состав, цены, шансы (меняй здесь)
     2. Рулетка          — длительность и размеры
     3. Страница «Кейсы» — карточки на всю ширину
     4. Рулетка          — шансы, прокрутка, результат
   ============================================================ */

/* ============================================================
   1. НАСТРОЙКИ КЕЙСОВ
   ============================================================ */
// --- Кейсы -------------------------------------------------
// Названия оружия пиши строчными буквами — так же, как в SKIN_DATA (weapon).
const T_WEAPONS  = ['ak-47', 'glock', 'deagle', 'p90', 'knife'];
const CT_WEAPONS = ['m4a1', 'usp', 'awp', 'scout', 'knife'];
const DEFAULT_CASE = ['ak-47', 'knife', 'm4a1', 'usp', 'awp', 'scout', 'glock', 'deagle', 'p90', 'knife']
const KNIFE_CASE = ['knife']
const AK47_CASE = ['ak-47']
const hasWeapon = (list, skin) => list.includes(skin.weapon.toLowerCase());

// Шансы редкостей (в «весах»: чем больше число, тем чаще выпадает). Это ОТНОСИТЕЛЬНЫЕ числа.
// Если в кейсе нет скинов какой-то редкости, её вес просто пропадает, остальные пересчитываются сами.
// Если в кейсе несколько скинов одной редкости, вес редкости делится между ними поровну.
// Чем дороже кейс, тем выше шанс редких скинов. Нет буквы — такая редкость в кейс не падает.
//   c — редкий, u — сверхредкий, r — эпический, e — аркана, l — легендарный, j — ультра
const ODDS = {
  cheap:   { c: 70, u: 20, r: 7,  e: 2.5, l: 0.5 },
  medium:  { c: 50, u: 28, r: 14, e: 6,   l: 1.8, j: 0.2 },
  rich:    { c: 25, u: 30, r: 24, e: 12,  l: 7,   j: 2 },
};

// image — картинка кейса из assets/images/ (нет файла — покажется номер)
// hue   — цвет свечения вокруг кейса (0–360)
// tag   — значок в углу карточки ('' = без значка)
// has   — какие скины лежат в кейсе
// odds  — шансы редкостей (см. ODDS выше)
const CASES = [
  { name: 'Кейс Бомжатник',  price: 9, image: 'case_1.jpg', hue: 210, tag: '',     has: s => hasWeapon(DEFAULT_CASE, s), odds: ODDS.cheap },
  { name: 'Кейс AK-47',  price: 14, image: 'case_4.jpg', hue: 280, tag: '',     has: s => hasWeapon(AK47_CASE, s), odds: ODDS.medium },
  { name: 'Кейс Среднечек',      price: 19, image: 'case_2.jpg', hue: 45,  tag: 'Выгодно',  has: () => true,                      odds: ODDS.rich },
  { name: 'Ножевой Кейс',  price: 24, image: 'case_5.jpg', hue: 280, tag: '',     has: s => hasWeapon(KNIFE_CASE, s), odds: ODDS.medium },
];

// Скины, которые реально могут выпасть из кейса (лежат в нём и шанс их редкости больше нуля)
const caseSkins = c => SKINS.filter(s => c.has(s) && (c.odds[s.rarity] || 0) > 0);

// Текст кнопки открытия кейса
const openLabel = c => `Открыть за ${c.price}с`;


/* ============================================================
   2. РУЛЕТКА: настройки
   ============================================================ */
// --- Рулетка -----------------------------------------------
// Ширину предмета код берёт из CSS сам (.it), так что на телефоне ничего не собьётся.
const TRACK_LENGTH = 60;     // сколько предметов в ленте
const WIN_INDEX    = 52;     // какой по счёту предмет остановится под маркером
const SPIN_MS      = 6000;   // длительность прокрутки
const FAST_SPIN_MS = 2500;   // длительность, если игрок включил «Быстрое открытие» в настройках

// Состояние окна кейса: какой кейс открыт и крутится ли сейчас рулетка
let currentCase = null;
let spinning = false;

/* ============================================================
   3. СТРАНИЦА «КЕЙСЫ»
   ============================================================ */
// --- Страница кейсов: одна карточка на всю ширину = один кейс ---
function renderCases() {
  const items = CASES.map((c, k) => {
    const count = caseSkins(c).length;
    const button = count
      ? `<button class="p" data-action="open-case" data-id="${k}">${openLabel(c)}</button>`
      : '<button type="button" disabled>Скоро</button>';
    return `
      <div class="case glass ${count ? '' : 'soon'}" style="--h:${c.hue}">
        ${c.tag ? `<span class="tag">${c.tag}</span>` : ''}
        <div class="crate">
          <img src="${IMAGES_ROOT}${c.image}" alt="${c.name}" loading="lazy" onerror="this.parentElement.textContent='${k + 1}'">
        </div>
        <div class="case-info">
          <h3>${c.name}</h3>
          <p>${count ? `${count} скинов` : 'Скины появятся скоро'}</p>
        </div>
        ${button}
      </div>`;
  }).join('');

  $('#app').innerHTML = `
    <h1>Кейсы</h1>
    <p class="sub">Открой кейс и смотри, что выпадет. Демо-режим ничего не списывает.</p>
    <div class="cases">${items}</div>`;
}

/* ============================================================
   4. РУЛЕТКА: шансы, прокрутка, результат
   ============================================================ */

// Шансы скинов внутри кейса: [{ skin, weight }, ...]
function caseWeights(c) {
  const skins = caseSkins(c);
  const perRarity = {};                                    // сколько скинов каждой редкости в кейсе
  skins.forEach(s => { perRarity[s.rarity] = (perRarity[s.rarity] || 0) + 1; });
  return skins.map(skin => ({ skin, weight: c.odds[skin.rarity] / perRarity[skin.rarity] }));
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

// Кнопки окна кейса: пока крутится рулетка или в кейсе нет скинов — «Открыть» отключена
function updateGoButton() {
  const empty = !caseSkins(currentCase).length;
  $('#go').textContent = openLabel(currentCase);
  $('#go').disabled = spinning || empty;
  $('#demo').disabled = spinning || empty;
}

// Текст в блоке результата («Нажми…», «Крутим…»)
function setResult(text) {
  $('#result').innerHTML = `<p class="rv-note">${text}</p>`;
}

// До запуска в ленте лежит предпросмотр — предметы кейса по кругу
function showPreview(c) {
  const list = caseSkins(c);
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
  $('#case-box').style.setProperty('--h', currentCase.hue);   // цвет свечения окна = цвет кейса
  $('#case-title').textContent = currentCase.name;
  $('#case-img').src = IMAGES_ROOT + currentCase.image;
  $('#case-price').textContent = currentCase.price + 'с';
  $('#viewport').classList.remove('done', 'rare');
  showPreview(currentCase);
  setResult('Нажми «Открыть», чтобы запустить рулетку');
  updateGoButton();
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
  updateGoButton();
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
  if (!demo) { state.inv.push(winner.id); updateBalance(); }
  updateGoButton();

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
