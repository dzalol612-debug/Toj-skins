/* ============================================================
   ИГРЫ: Краш, Блэкджек, Апгрейдер
   Файл подключается ПОСЛЕ script.js и пользуется его общими вещами:
   state (баланс, инвентарь), updateBalance, toast, sound, SKINS, rouletteItem, isRare, PAGES.
   Структура файла:
     1. Настройки игр        — меняй числа здесь
     2. Общее                — ставки, выплаты
     3. Краш
     4. Блэкджек
     5. Апгрейдер
     6. Подключение к сайту  — страницы и клики
   ============================================================ */

/* ============================================================
   1. НАСТРОЙКИ ИГР
   ============================================================ */
const MIN_BET = 1;                 // минимальная ставка, с
const MAX_BET = 1000000;               // максимальная ставка, с

// --- Краш ---
const CRASH_RTP     = 0.96;        // «отдача»: 0.96 = сайт оставляет себе 4%. Больше число — щедрее игра
const CRASH_MAX     = 20;          // максимальный множитель: выше ×20 раунд не растёт, он падает ровно на ×20
const CRASH_SPEED   = 0.15;        // как быстро растёт множитель (больше — быстрее)
const CRASH_HISTORY = 10;          // сколько прошлых результатов показывать

// --- Блэкджек ---
const BJ_BLACKJACK_PAYOUT = 1.5;   // блэкджек платит 3 к 2 (1.5)
const BJ_DECKS = 4;                // сколько колод в игре
const BJ_DEALER_DELAY = 700;       // пауза между картами дилера, мс

// --- Апгрейдер ---
const UPGRADE_RTP        = 0.95;   // шанс = сумма_цен_твоих / цена_цели × 95%
const UPGRADE_MAX_CHANCE = 75;     // шанс никогда не выше, % (даже если по формуле выходит больше)
const UPGRADE_MIN_CHANCE = 1;      // и не ниже, %
const UPGRADE_MAX_ITEMS  = 10;     // сколько своих скинов можно поставить за один раз
const UPGRADE_SPIN_MS    = 4000;   // длительность вращения стрелки

/* ============================================================
   2. ОБЩЕЕ: ставки и выплаты
   ============================================================ */
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Поле ставки с кнопками «Мин / ½ / ×2 / Макс». Нужно на странице одно, id="bet"
function betBox(value = 10) {
  return `
    <div class="bet">
      <label for="bet">Ставка, с</label>
      <div class="bet-row">
        <input id="bet" type="number" inputmode="numeric" min="${MIN_BET}" max="${MAX_BET}" value="${value}">
        <button data-bet="min" type="button">Мин</button>
        <button data-bet="half" type="button">½</button>
        <button data-bet="double" type="button">×2</button>
        <button data-bet="max" type="button">Макс</button>
      </div>
    </div>`;
}

function betButtons(e) {
  const mode = e.target.closest('[data-bet]')?.dataset.bet;
  if (!mode) return;
  const input = $('#bet');
  const bet = Math.floor(+input.value) || MIN_BET;
  const top = Math.min(MAX_BET, state.bal);
  const value = { min: MIN_BET, half: Math.floor(bet / 2), double: bet * 2, max: top }[mode];
  input.value = Math.max(MIN_BET, Math.min(value, top || MIN_BET));
}

// Списывает ставку из поля #bet. Возвращает ставку или 0, если что-то не так
function takeBet() {
  const bet = Math.floor(+$('#bet').value);
  if (!(bet >= MIN_BET)) { toast(`Минимальная ставка — ${MIN_BET}с`); return 0; }
  if (bet > MAX_BET)     { toast(`Максимальная ставка — ${MAX_BET}с`); return 0; }
  if (bet > state.bal)   { toast('Не хватает монет — пополни баланс'); return 0; }
  state.bal -= bet;
  updateBalance();
  return bet;
}

function payOut(amount) {
  state.bal += amount;
  updateBalance();
}

/* ============================================================
   3. КРАШ
   Множитель растёт каждую секунду. Нажми «Забрать», пока он не «упал».
   Точка краха выбирается случайно в момент ставки: point = RTP / (1 − random), но не выше CRASH_MAX (×20).
   ============================================================ */
const crash = { phase: 'idle', bet: 0, point: 1, mult: 1, start: 0, raf: 0, cashed: false, auto: 0, history: [] };
// phase: 'idle' — ждём ставку, 'running' — летит, 'crashed' — упал

function renderCrash() {
  $('#app').innerHTML = `
    <h1>Краш</h1>
    <p class="sub">Множитель растёт — забери выигрыш до того, как он упадёт.</p>
    <div class="game glass">
      <div class="crash-hist" id="crash-hist"></div>
      <div class="crash-view" id="crash-view" data-state="idle">
        <canvas id="crash-canvas"></canvas>
        <div class="crash-mult" id="crash-mult">1.00×</div>
        <div class="crash-msg" id="crash-msg">Сделай ставку и нажми «Поставить»</div>
      </div>
      <div class="game-ctrl">
        ${betBox()}
        <div class="bet">
          <label for="crash-auto">Авто-вывод на ×</label>
          <div class="bet-row"><input id="crash-auto" type="number" min="1.1" max="${CRASH_MAX}" step="0.1" placeholder="не обязательно (до ${CRASH_MAX})"></div>
        </div>
        <button class="p big" id="crash-btn" data-do="crash" type="button"></button>
      </div>
    </div>`;
  crashDraw();
  crashButton();
  crashHistory();
}

function crashClick() {
  if (crash.phase === 'running') return crashCashOut();

  const bet = takeBet();
  if (!bet) return;
  Object.assign(crash, {
    phase: 'running', bet, cashed: false, mult: 1, start: performance.now(),
    point: Math.min(CRASH_MAX, Math.max(1, CRASH_RTP / (1 - Math.random()))),   // 1.00 = мгновенный краш
    auto: +$('#crash-auto').value || 0,
  });
  $('#crash-view').dataset.state = 'running';
  crashMessage('Летим…');
  sound.play('start');
  crashButton();
  crash.raf = requestAnimationFrame(crashFrame);
}

function crashFrame(now) {
  if (crash.phase !== 'running') return;
  crash.mult = Math.exp(CRASH_SPEED * (now - crash.start) / 1000);
  // Авто-вывод проверяем ДО краха: так вывод ровно на максимуме (×20) тоже срабатывает
  if (crash.auto >= 1.01 && !crash.cashed && crash.mult >= crash.auto && crash.auto <= crash.point) crashCashOut(crash.auto);
  if (crash.mult >= crash.point) return crashEnd();

  const label = $('#crash-mult');
  if (label) label.textContent = crash.mult.toFixed(2) + '×';
  crashDraw();
  crashButton();
  crash.raf = requestAnimationFrame(crashFrame);
}

function crashCashOut(at = crash.mult) {
  if (crash.phase !== 'running' || crash.cashed) return;
  crash.cashed = true;
  const win = Math.floor(crash.bet * at);
  payOut(win);
  sound.play(at >= 10 ? 'rare' : 'win');
  crashMessage(`Забрал на ×${at.toFixed(2)}: +${win - crash.bet}с`);
  $('#crash-view').dataset.state = 'won';
  toast(`Выигрыш: ${win}с`);
}

function crashEnd() {
  cancelAnimationFrame(crash.raf);
  crash.phase = 'crashed';
  crash.mult = crash.point;
  crash.history = [crash.point, ...crash.history].slice(0, CRASH_HISTORY);

  const label = $('#crash-mult');
  if (label) label.textContent = crash.point.toFixed(2) + '×';
  if (!crash.cashed) crashMessage(`Краш! Ставка ${crash.bet}с сгорела`);
  const view = $('#crash-view');
  if (view) view.dataset.state = 'crash';
  crashDraw();
  crashButton();
  crashHistory();
}

// Ушёл со страницы во время полёта — раунд прерывается, несобранная ставка сгорает
function crashLeave() {
  if (crash.phase !== 'running') return;
  cancelAnimationFrame(crash.raf);
  crash.phase = 'idle';
}

function crashMessage(text) {
  const el = $('#crash-msg');
  if (el) el.textContent = text;
}

function crashButton() {
  const btn = $('#crash-btn');
  if (!btn) return;
  const running = crash.phase === 'running';
  btn.disabled = running && crash.cashed;
  btn.textContent = !running ? 'Поставить' : crash.cashed ? 'Ждём краш…' : `Забрать ${Math.floor(crash.bet * crash.mult)}с`;
}

function crashHistory() {
  const box = $('#crash-hist');
  if (!box) return;
  box.innerHTML = crash.history
    .map(m => `<span class="${m < 2 ? 'lo' : m < 10 ? 'mid' : 'hi'}">${m.toFixed(2)}×</span>`)
    .join('') || '<small>Здесь появятся прошлые раунды</small>';
}

// Рисуем график на canvas: кривая e^(speed·t), сетка и светящаяся точка на конце
function crashDraw() {
  const canvas = $('#crash-canvas');
  if (!canvas) return;
  const dpr = devicePixelRatio || 1, w = canvas.clientWidth, h = canvas.clientHeight;
  if (canvas.width !== Math.round(w * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
  const c = canvas.getContext('2d');
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.clearRect(0, 0, w, h);

  const seconds = Math.log(crash.mult) / CRASH_SPEED;                 // сколько секунд идёт раунд
  const maxSec = Math.max(6, seconds), maxMult = Math.max(2, crash.mult * 1.15);
  const x = s => 20 + (w - 40) * s / maxSec;
  const y = m => h - 20 - (h - 50) * (m - 1) / (maxMult - 1);

  c.strokeStyle = 'rgba(255,255,255,.06)';
  c.lineWidth = 1;
  for (let i = 1; i <= 4; i++) {
    const gy = h - 20 - (h - 50) * i / 4;
    c.beginPath(); c.moveTo(20, gy); c.lineTo(w - 20, gy); c.stroke();
  }

  const color = crash.phase === 'crashed' ? '#ff4d4d' : '#ff8a1f';
  c.beginPath();
  for (let i = 0; i <= 80; i++) {
    const s = seconds * i / 80;
    const px = x(s), py = y(Math.exp(CRASH_SPEED * s));
    i ? c.lineTo(px, py) : c.moveTo(px, py);
  }
  c.strokeStyle = color; c.lineWidth = 4; c.lineJoin = 'round';
  c.shadowColor = color; c.shadowBlur = 16;
  c.stroke();

  c.shadowBlur = 0;                                                   // заливка под линией
  c.lineTo(x(seconds), h - 20); c.lineTo(x(0), h - 20); c.closePath();
  const fill = c.createLinearGradient(0, 0, 0, h);
  fill.addColorStop(0, color + '55'); fill.addColorStop(1, color + '00');
  c.fillStyle = fill; c.fill();

  c.beginPath(); c.arc(x(seconds), y(crash.mult), 6, 0, 7);           // точка на конце
  c.fillStyle = '#fff'; c.shadowColor = color; c.shadowBlur = 14; c.fill();
}

/* ============================================================
   4. БЛЭКДЖЕК
   Набери 21 или ближе дилера, но не больше. Дилер берёт до 17.
   Победа платит 1 к 1, блэкджек — 3 к 2, ничья возвращает ставку.
   Можно: Взять, Стоп, Удвоить (одна карта и ставка ×2). Разделения пар нет.
   ============================================================ */
const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const bj = { deck: [], player: [], dealer: [], bet: 0, base: 10, phase: 'bet', msg: '', cls: '' };
// phase: 'bet' — ждём ставку, 'play' — ход игрока, 'dealer' — ходит дилер, 'done' — раунд окончен

function bjShuffled() {
  const deck = Array.from({ length: BJ_DECKS }, () => SUITS.flatMap(s => RANKS.map(r => ({ r, s })))).flat();
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function bjDraw() {
  if (bj.deck.length < 20) bj.deck = bjShuffled();
  const card = bj.deck.pop();
  card.fresh = true;            // новая карта — проиграем анимацию раздачи
  return card;
}

// Сумма очков: туз = 11, а если перебор — 1
function bjValue(hand) {
  let total = 0, aces = 0;
  for (const card of hand) {
    total += { A: 11, J: 10, Q: 10, K: 10 }[card.r] ?? +card.r;
    if (card.r === 'A') aces++;
  }
  while (total > 21 && aces--) total -= 10;
  return total;
}

const bjIsBlackjack = hand => hand.length === 2 && bjValue(hand) === 21;

function bjCard(card, hidden = false) {
  const html = `<div class="pc ${'♥♦'.includes(card.s) ? 'red' : ''} ${hidden ? 'back' : ''} ${card.fresh ? 'new' : ''}">${hidden ? '' : card.r}<i>${card.s}</i></div>`;
  card.fresh = false;
  return html;
}

function renderBlackjack() {
  $('#app').innerHTML = `
    <h1>Блэкджек</h1>
    <p class="sub">Набери 21 или ближе дилера. Блэкджек платит 3 к 2.</p>
    <div class="game glass" id="bj"></div>`;
  bjRender();
}

function bjRender() {
  const box = $('#bj');
  if (!box) return;
  const hideHole = bj.phase === 'play';
  const dealerScore = bj.dealer.length ? bjValue(hideHole ? [bj.dealer[0]] : bj.dealer) : '';
  const playing = bj.phase === 'play';
  const canDouble = playing && bj.player.length === 2 && state.bal >= bj.bet;

  const controls = (bj.phase === 'bet' || bj.phase === 'done')
    ? `<div class="game-ctrl">${betBox(bj.base)}<button class="p big" data-do="bj-deal" type="button">Раздать</button></div>`
    : `<div class="game-ctrl three">
         <button class="p big" data-do="bj-hit" type="button" ${playing ? '' : 'disabled'}>Взять</button>
         <button class="big" data-do="bj-stand" type="button" ${playing ? '' : 'disabled'}>Стоп</button>
         <button class="big" data-do="bj-double" type="button" ${canDouble ? '' : 'disabled'}>Удвоить</button>
       </div>`;

  box.innerHTML = `
    <div class="bj-table">
      <div class="bj-side">
        <span>Дилер <b>${dealerScore}</b></span>
        <div class="hand">${bj.dealer.map((c, i) => bjCard(c, hideHole && i === 1)).join('')}</div>
      </div>
      <div class="bj-msg ${bj.cls}">${bj.msg || (bj.phase === 'bet' ? 'Сделай ставку' : '')}</div>
      <div class="bj-side">
        <span>Ты <b>${bj.player.length ? bjValue(bj.player) : ''}</b>${bj.bet && bj.phase !== 'bet' ? ` · ставка ${bj.bet}с` : ''}</span>
        <div class="hand">${bj.player.map(c => bjCard(c)).join('')}</div>
      </div>
    </div>
    ${controls}`;
}

function bjDeal() {
  if (bj.phase === 'play' || bj.phase === 'dealer') return;
  const bet = takeBet();
  if (!bet) return;
  Object.assign(bj, { bet, base: bet, phase: 'play', msg: '', cls: '', player: [bjDraw(), bjDraw()], dealer: [bjDraw(), bjDraw()] });
  sound.play('start');
  if (bjIsBlackjack(bj.player) || bjIsBlackjack(bj.dealer)) return bjSettle();   // блэкджек — раунд сразу кончается
  bjRender();
}

function bjHit() {
  if (bj.phase !== 'play') return;
  bj.player.push(bjDraw());
  sound.play('tick');
  const score = bjValue(bj.player);
  if (score > 21) return bjSettle();
  if (score === 21) return bjStand();
  bjRender();
}

async function bjStand() {
  if (bj.phase !== 'play') return;
  bj.phase = 'dealer';
  bj.dealer[1].fresh = true;            // дилер открывает вторую карту
  bjRender();
  while (bjValue(bj.dealer) < 17) {
    await sleep(BJ_DEALER_DELAY);
    bj.dealer.push(bjDraw());
    sound.play('tick');
    bjRender();
  }
  await sleep(BJ_DEALER_DELAY / 1.5);
  bjSettle();
}

function bjDouble() {
  if (bj.phase !== 'play' || bj.player.length !== 2) return;
  if (state.bal < bj.bet) return toast('Не хватает монет, чтобы удвоить');
  state.bal -= bj.bet;
  bj.bet *= 2;
  updateBalance();
  bj.player.push(bjDraw());
  bjValue(bj.player) > 21 ? bjSettle() : bjStand();
}

// Подводим итог раунда и платим
function bjSettle() {
  bj.phase = 'done';
  const p = bjValue(bj.player), d = bjValue(bj.dealer);
  const pBJ = bjIsBlackjack(bj.player), dBJ = bjIsBlackjack(bj.dealer);
  let payout = 0, text = '', cls = 'lose';

  if (p > 21)               { text = 'Перебор — ты проиграл'; }
  else if (pBJ && !dBJ)     { payout = Math.floor(bj.bet * (1 + BJ_BLACKJACK_PAYOUT)); text = 'Блэкджек!'; cls = 'win'; }
  else if (dBJ && !pBJ)     { text = 'У дилера блэкджек'; }
  else if (d > 21 || p > d) { payout = bj.bet * 2; text = d > 21 ? 'Перебор у дилера — ты выиграл' : 'Ты выиграл'; cls = 'win'; }
  else if (p === d)         { payout = bj.bet; text = 'Ничья — ставка возвращена'; cls = 'push'; }
  else                      { text = 'Дилер выиграл'; }

  if (payout) payOut(payout);
  if (payout > bj.bet) sound.play(pBJ ? 'rare' : 'win');
  const diff = payout - bj.bet;
  bj.msg = `${text}${diff > 0 ? ` +${diff}с` : diff < 0 ? ` −${bj.bet}с` : ''}`;
  bj.cls = cls;
  bjRender();
}

/* ============================================================
   5. АПГРЕЙДЕР
   Ставишь один или НЕСКОЛЬКО своих скинов на один более дорогой.
   Шанс = сумма цен твоих скинов / цена цели × RTP, но не больше UPGRADE_MAX_CHANCE (75%).
   Выиграл — получаешь цель, проиграл — все поставленные скины сгорают.
   ============================================================ */
// from — НОМЕРА предметов в state.inv (можно выбрать несколько), to — id скина-цели
const up = { from: [], to: -1, busy: false };

// Сумма цен выбранных скинов
const upTotal = () => up.from.reduce((sum, index) => sum + SKINS[state.inv[index]].price, 0);

function upChance() {
  if (!up.from.length || up.to < 0) return 0;
  const raw = upTotal() / SKINS[up.to].price * 100 * UPGRADE_RTP;
  return Math.round(Math.min(UPGRADE_MAX_CHANCE, Math.max(UPGRADE_MIN_CHANCE, raw)) * 10) / 10;
}

function renderUpgrade() {
  if (!up.busy) { up.from = []; up.to = -1; }   // номера в инвентаре могли поменяться, пока ты был на другой странице

  $('#app').innerHTML = `
    <h1>Апгрейдер</h1>
    <p class="sub">Выбери один или несколько своих скинов и поставь их на один дорогой. Чем дороже цель, тем ниже шанс (максимум ${UPGRADE_MAX_CHANCE}%). Проигрыш — все поставленные скины сгорают.</p>
    <div class="up-layout">
      <section class="glass up-col">
        <h3>Твои предметы</h3>
        <div class="up-sum" id="up-sum"></div>
        <div class="up-list" id="up-from"></div>
      </section>

      <section class="glass up-mid">
        <div class="dial">
          <svg viewBox="0 0 200 200">
            <circle class="dial-bg" cx="100" cy="100" r="80"/>
            <circle class="dial-win" id="dial-win" cx="100" cy="100" r="80" pathLength="100" transform="rotate(-90 100 100)" stroke-dasharray="0 100"/>
          </svg>
          <div class="needle" id="needle"></div>
          <div class="dial-txt"><b id="up-chance">0%</b><small>шанс</small></div>
        </div>
        <button class="p big" id="up-btn" data-do="up-go" type="button">Апгрейд</button>
        <div class="up-msg" id="up-msg">Выбери свои предметы и цель</div>
      </section>

      <section class="glass up-col"><h3>Хочу получить</h3><div class="up-list" id="up-to"></div></section>
    </div>`;
  upRenderLists();
}

function upPickHTML(side, key, skin, selected) {
  return `<div class="up-pick ${selected ? 'on' : ''}" data-up="${side}" data-id="${key}">${rouletteItem(skin, `<small class="chance">${skin.price}с</small>`)}</div>`;
}

function upRenderLists() {
  // Левая колонка: все свои скины, выбранные подсвечены
  const mine = state.inv.map((id, index) => upPickHTML('from', index, SKINS[id], up.from.includes(index)));
  $('#up-from').innerHTML = mine.join('') || '<div class="empty">Инвентарь пуст — купи скин или открой кейс.</div>';

  // Над списком: сколько выбрано и на какую сумму
  $('#up-sum').innerHTML = up.from.length
    ? `<span>Выбрано: <b>${up.from.length}</b> · на <b>${upTotal()}с</b></span><button data-do="up-clear" type="button">Сбросить</button>`
    : `<span>Нажимай на скины, чтобы выбрать (до ${UPGRADE_MAX_ITEMS})</span>`;

  // Правая колонка: только то, что дороже ВСЕЙ выбранной суммы
  const total = upTotal();
  const targets = up.from.length ? SKINS.filter(s => s.price > total).sort((a, b) => a.price - b.price) : [];
  if (!targets.some(s => s.id === up.to)) up.to = -1;   // выбранная цель стала не подходить (сумма выросла)
  $('#up-to').innerHTML = !up.from.length ? '<div class="empty">Сначала выбери свои предметы.</div>'
    : targets.map(s => upPickHTML('to', s.id, s, up.to === s.id)).join('') || '<div class="empty">Дороже этой суммы ничего нет.</div>';

  const chance = upChance();
  $('#up-chance').textContent = chance + '%';
  $('#dial-win').setAttribute('stroke-dasharray', `${chance} 100`);
  $('#up-btn').disabled = !chance || up.busy;
}

function upPick(e) {
  const el = e.target.closest('[data-up]');
  if (!el || up.busy) return;

  if (el.dataset.up === 'from') {
    const index = +el.dataset.id;
    if (up.from.includes(index)) up.from = up.from.filter(i => i !== index);          // второй клик — снять выбор
    else if (up.from.length >= UPGRADE_MAX_ITEMS) return toast(`Можно выбрать не больше ${UPGRADE_MAX_ITEMS} скинов`);
    else up.from.push(index);
  } else {
    up.to = +el.dataset.id;
  }
  upRenderLists();
}

function upClear() {
  if (up.busy) return;
  up.from = [];
  up.to = -1;
  upRenderLists();
}

async function upSpin() {
  const chance = upChance();
  if (up.busy || !chance) return toast('Выбери свои предметы и цель');
  up.busy = true;
  $('#up-btn').disabled = true;

  const win = Math.random() * 100 < chance;
  const sources = up.from.map(index => SKINS[state.inv[index]]);
  const count = sources.length, target = SKINS[up.to];
  const lostText = count === 1 ? `${sources[0].name} сгорел` : `${count} скина сгорели`;

  // Результат записываем сразу, до анимации — перезагрузкой страницы его не отменить.
  // Удаляем с конца (от больших номеров к меньшим), чтобы номера остальных не сдвигались.
  [...up.from].sort((a, b) => b - a).forEach(index => state.inv.splice(index, 1));
  if (win) state.inv.push(target.id);
  updateBalance();

  // Стрелка останавливается в зелёном секторе при выигрыше и мимо него при проигрыше
  const stop = win ? Math.random() * chance : chance + Math.random() * (100 - chance);
  const needle = $('#needle');
  needle.style.transition = 'none';
  needle.style.transform = 'rotate(0deg)';
  needle.offsetWidth;
  needle.style.transition = `transform ${UPGRADE_SPIN_MS}ms cubic-bezier(.12,.7,.1,1)`;
  needle.style.transform = `rotate(${1800 + stop * 3.6}deg)`;
  sound.play('start');

  await sleep(UPGRADE_SPIN_MS + 200);
  up.busy = false;
  up.from = [];
  up.to = -1;
  sound.play(win ? (isRare(target) ? 'rare' : 'win') : 'tick');
  toast(win ? `Успех! Получено: ${target.name}` : `Не повезло: ${lostText}`);

  const msg = $('#up-msg');
  if (!msg) return;                       // ушёл со страницы
  msg.className = 'up-msg ' + (win ? 'win' : 'lose');
  msg.textContent = win ? `Успех! ${target.name} теперь у тебя` : `Не повезло — ${lostText}`;
  upRenderLists();
}

/* ============================================================
   6. ПОДКЛЮЧЕНИЕ К САЙТУ
   Новая игра = функция renderXxx + строка в PAGES + ссылка в меню (index.html)
   ============================================================ */
Object.assign(PAGES, { crash: renderCrash, blackjack: renderBlackjack, upgrade: renderUpgrade });

// Кнопки с data-do="..." запускают функции из этой таблицы
const GAME_ACTIONS = {
  'crash': crashClick,
  'bj-deal': bjDeal, 'bj-hit': bjHit, 'bj-stand': bjStand, 'bj-double': bjDouble,
  'up-go': upSpin, 'up-clear': upClear,
};

$('#app').addEventListener('click', e => {
  GAME_ACTIONS[e.target.closest('[data-do]')?.dataset.do]?.();
  betButtons(e);
  upPick(e);
});

addEventListener('hashchange', crashLeave);
route();   // перерисовать страницу: вдруг сайт открыли сразу по ссылке #crash
