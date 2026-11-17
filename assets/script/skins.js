/* ============================================================
   СКИНЫ: редкости, цены и список всех скинов сайта
   Подключается ПЕРВЫМ (до cases.js и script.js), здесь только данные — никакой логики.
   Чтобы добавить скин — скопируй строку в SKIN_DATA и поменяй значения.
   Кейсы (какие скины в каком кейсе лежат) настраиваются в cases.js.
   ============================================================ */

// --- Редкости ----------------------------------------------
// Шансы выпадения свои у каждого кейса — см. ODDS и CASES в cases.js
const RARITY = {
  c: { name: 'редкий',      color: '#9aa4b2' },
  u: { name: 'сверхредкий', color: '#4b8bff' },
  r: { name: 'эпический',   color: '#8b5cf6' },
  e: { name: 'аркана',      color: '#e11d1d' },
  l: { name: 'легендарный', color: '#ffb020' },
  j: { name: 'Ультра', color: '#ff2088' },
};
const BASE_PRICE = { c: 3, u: 5, r: 10, e: 15, l: 25, j: 50};

// --- Скины -------------------------------------------------
// Чтобы добавить скин — скопируй строку и поменяй значения.
//   weapon — оружие (по нему работает фильтр)
//   name   — название
//   rarity — c / u / r / e / l / j (см. RARITY выше)
//   hue    — цвет градиента 0–360 (виден, пока нет картинки)
//   image  — имя файла из папки assets/images/skins/ ('' = без картинки)
// Файл для кнопки «Установить» по умолчанию берётся по порядку: первый скин — assets/skins/1.zip, второй — 2.zip...
// Если вставляешь новый скин в СЕРЕДИНУ списка, порядок сдвинется — тогда впиши файл явно:
//   file: 'assets/skins/ak47-neon.zip'
// После скачивания скин исчезает из инвентаря (см. downloadSkin в script.js).
const IMAGES_ROOT = 'assets/images/';          // общие картинки: кейсы, баннер, окно
const IMAGES_DIR  = IMAGES_ROOT + 'skins/';    // картинки скинов

const SKIN_DATA = [
  { weapon: 'knife', name: 'Нож Керамбит Градиент', rarity: 'j', hue: 5, image: 'karambit-knife-fade.avif' },
  { weapon: 'knife', name: 'Нож Бабочка Синее море', rarity: 'l', hue: 5, image: 'butterfly-knife-blue-sea.avif' },
  { weapon: 'ak-47', name: 'AK-47 Неоновая революция', rarity: 'e', hue: 5, image: 'ak-47-neon-revolution.avif' },
  { weapon: 'deagle', name: 'Desert Eagle Блейз', rarity: 'r', hue: 5, image: 'deagle-blaze_3.jpg' },
  { weapon: 'awp', name: 'AWP Хайпер бист (beast)', rarity: 'e', hue: 5, image: 'awp-hyper-beast (1).jpg' },
  { weapon: 'knife', name: 'Керамбит зеленая мечта', rarity: 'l', hue: 5, image: 'karambit-green-dreamer.jpg' },
  { weapon: 'usp', name: 'USP - монстра (monstah)', rarity: 'r', hue: 5, image: 'usp-monstah.jpg' },
  { weapon: 'usp', name: 'USP - Азимов (Asimov)', rarity: 'u', hue: 5, image: 'usp-asiimov.jpg' },
  { weapon: 'ak-47', name: 'AK-47 кейс харденед', rarity: 'r', hue: 5, image: 'ak-47-case-hardened.jpg' }
  
  // { weapon: 'AK-47', name: 'AK-47 Огненный змей', rarity: 'l', hue: 25, image: 'ak47-fire.png' },
];

const SKINS = SKIN_DATA.map((data, id) => ({
  ...data,
  id,
  price: Math.round(BASE_PRICE[data.rarity] * (1 + (id % 5) * 0.12)),
  file: data.file || `assets/skins/${id + 1}.zip`,   // свой файл (file в SKIN_DATA) или по порядку
}));
