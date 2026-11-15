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
// Коды хранятся не открытым текстом, а в виде хэша (SHA-256), поэтому из кода сайта их не прочитать.
// hash — хэш кода, coins — награда. Регистр, пробелы и тире в коде не важны.
// Новые коды делает страница tools/codes.html: открой её в браузере, нажми «Сгенерировать»
// и вставь готовые строки сюда. Каждый код можно активировать один раз (на этом устройстве).
const PROMOCODES = [
  { hash: 'e250ca9f69ff4d8a4dee9c18f2b26199cc921a572aebc263a375ad0e6984de17', coins: 5 },
  { hash: '2b52a521cd0b5cba91468683ab51e88d31a4f21df613a5a081a91ba875eaaf84', coins: 5 },
  { hash: '599cd14885f97962aadc78ab318d234793698e45cbb810d296599ed12e347763', coins: 5 },
  { hash: 'fca82c94dcb31d1b4f1249d366f2c7a73ba13c22701e6ee3e7d85a344c3adb7f', coins: 5 },
  { hash: '11b0562cb472978cb96e66703a54b087c8f6b50a94f4fa72f13fac43fd057dbc', coins: 5 },
  { hash: '6c3f2a557e5b65cd05958911d06c1fc701fbb855c1776db52aaa325015bd4709', coins: 5 },
  { hash: 'c3838b6492b849af8ac465c4bab05c164dccb6fbb96f6a1ca3a9f654a55c9cce', coins: 5 },
  { hash: 'e8ce2f6c9fe4f7f4aed1974791f92c0e7fd62ef461714d24ec97976c58821dc9', coins: 5 },
  { hash: 'b3b84018786ea076d52d9bcb8058e0df09add6ef5b1e6532d653f3fd3cbc227d', coins: 5 },
  { hash: '6e7a5f5d18877deef770d9af24e2b8bc921e9b696a6ad44a374d967d396ec4a3', coins: 5 },
  { hash: '416458cb2de63dddeb1e052d137e2695db95b5d53f19588375e826668ebc2a15', coins: 5 },
  { hash: '9b4483373df6f0e4308f8256208ac746889abfbd15e9748cfcc3cc9fc5bb4494', coins: 5 },
  { hash: '47b830f044280f5d89b2dfba4d10eb1b007bcf250ce6cbf657e82601728bf640', coins: 5 },
  { hash: 'fe05d7efd33defe131f13db99223d15e4cd9dc8955bb239f1852f65ffe71cc5a', coins: 5 },
  { hash: '488fc33890952045d22b20f90e0d42ba0b609ea58937870184b7a0517cf2bf74', coins: 5 },
  { hash: '88067153f616fae6d5cf4c4da7b545b639ff78741354ff6eee9f0c34d9838ebe', coins: 5 },
  { hash: '00dcc9bf603333b914d722dab5d128de7f468c55dc46f623fe7b463af733c33f', coins: 5 },
  { hash: '3bb70caabc3ab3e5ccd91676d5c6108a13a4e42c61c16896ecc1a1fcbf05f8e7', coins: 5 },
  { hash: 'c5dc186712c0874e41e718dbe6533af5cf4bcc28f5b8c90125ec22c31b7be8ba', coins: 5 },
  { hash: 'acdc88ab5bf5d44f0fc376d80296c54a1164f29c339daf0377355cb08a10ede3', coins: 5 },
  
  
  { hash: 'ca9a88ef89ecd2064a64dec84247fbe2b3e9bc824f3690836cd20713d00cc8b1', coins: 12 },
  { hash: '108600995c2571542725c8c2830d6ca4c6015e35421dce77b49801630ae0a56e', coins: 12 },
  { hash: 'f79aa556a7367b471d71118c4cceab0bf482f1f3b11bda15f6134db954d0d90c', coins: 12 },
  { hash: 'b2ad6134ca617a4ea12575bbfa654569331232867268feeb28d81ac92cf2b76f', coins: 12 },
  { hash: '763180c03876f43d2643b8f7bf709711f38c5df26e7c0ad54a4c928a7224167a', coins: 12 },
  { hash: 'e1fce1c94272cd7330e0e49e658e9a58afebebe100fcd5366306c0dbc3e34632', coins: 12 },
  { hash: 'db56d8e0f1aedae932ddee71c7484fc58d06c5d76632b459e24cc58c4e8a987e', coins: 12 },
  { hash: 'dc3361f7ac32654809ded6a6cfd6ae8589ea7df9dc80eb2af5764d3e431452a6', coins: 12 },
  { hash: 'f91cb2eef497649e47fc2b3dcbf1b4cb73a341c7dce22514133d2d4dad32779e', coins: 12 },
  { hash: 'e293f0e4ebf24a969d02b06e473ba05e7bbc87193b4357db9482997a673bcd4f', coins: 12 },
  { hash: 'f3843719aee00d4887e38e4700262ab3d42f4f12c5811972ac7f377298c81bef', coins: 12 },
  { hash: '658e46f0785f49271493df1aa4e682e0a4affe527b56c26c9004a39836503bc2', coins: 12 },
  { hash: '0ad51381a55299ec649fa553269b5cd8749c64ce18ac705a109659deb41b3d6b', coins: 12 },
  { hash: '9b84aad168903adc6e782eed5d6f7444104edd94ca43be03df05c4b3ee771b38', coins: 12 },
  { hash: '5ffa22b61d153f905d6ce75d366224cca73a91b03736bae6c0a16ffdb8920911', coins: 12 },
  { hash: '605a6e4232db83330e7ca2a7a775be3f0d6d96357ab4fa51b403b87e04bd8383', coins: 12 },
  { hash: '8f7dfab36f5b15316cb9eaadb6cbe606713e7444417dbabdc14851ad0ba285e7', coins: 12 },
  { hash: '3000a63c4e0f5a7f80e79b9a624609f3170c261f0ea59bae42087e37dadb9d33', coins: 12 },
  { hash: 'e05578a72059aa46b18ed7ac5c6206889356f8948f66cedd0d04296ce582d8d6', coins: 12 },
  { hash: 'ad2416ee84aa6c880ed0f47a956a035a4df471f7a968e4bae50fc72717e6f0f1', coins: 12 },
  
  
  { hash: '63f669db4d2fce361535090a1f32cda95af264bd40c1b05c62a11396bb7184f3', coins: 25 },
  { hash: '01f1b46c65b0080a895160a38338facfa45e5231a7d7a3f5281751cd9d57b7d8', coins: 25 },
  { hash: 'bfad21b77223f5a0f2a0cee8d0f4cd627e86a545dcdce58b5e777c281ce5b947', coins: 25 },
  { hash: '1c9532788d312ee6f10c6d556b89ac93cf727ecc07b7a7126f53ea42456822b4', coins: 25 },
  { hash: '4977bb716bafea2a8e7e48c8d15f1f19034264b0267321ee9e0fe9f2b104bcc6', coins: 25 },
  { hash: '48e1e5755cda901762058206117d47106fb631abb18e7b1c776072839e043acc', coins: 25 },
  { hash: '5e5b001e70f65b918394ca57135dcff8ee1085cdd6afae6377b7c9d73b3958bd', coins: 25 },
  { hash: '76b2fdf95d68e3621f9c618656041745929d6e3b4581f20bfbcfd2784e96fd6e', coins: 25 },
  { hash: '4b2107752b0e696e88e7d7980639cbd6ebdefa2438d56c6c6b95dff4e98d3d9e', coins: 25 },
  { hash: '109541eb812ca6412fbac5d13a78436dcf6b4cde6fff402fa317035ac46e165b', coins: 25 },
  { hash: 'b8a4fc80b46d58294332956475c275e8d2894b8c19b11d38d157f86adac95bc8', coins: 25 },
  { hash: '75cfeaf4a926305e50ba37df7e53e5c2fea5c01af9262b25f2a0b5578a626c54', coins: 25 },
  { hash: '0e912679bbf1973d87042c6aee45053d40e2ed10a8df91c665cab4a84c6845c7', coins: 25 },
  { hash: 'de0ba297fc9544efc5ed088efdea1af67b5ab92eb1f19c41a6310866bd2766fa', coins: 25 },
  { hash: 'a3358177e0a9f710ba42f91192af320dd4a709c7556668b2fe78dd58967ad752', coins: 25 },
  { hash: '552dab26b1058bd754c612a11145fd686390a2cea024f31e17fc7e3c3df3d4fe', coins: 25 },
  { hash: '0736d5a731b09df26d9780c4f6dc4c7700028ab904f1ec1f396ce5470b693c5d', coins: 25 },
  { hash: '99164b514a6f485a454563edb839bdd27b657508e23d329e4836fee88737ce2c', coins: 25 },
  { hash: '72e9d74f8be283a39a022e41d7011713937d88a724a250e95e9c833e7f789a7b', coins: 25 },
  { hash: '07c47ce7180cbb664d6eff31bca22a9f53654963d07d2fa4cd2979d69f8a9eaa', coins: 25 },
  
  
  { hash: '1db3b6e6b1ebb095232f813d896e17f3d6372c9347d25e92bbb1ef3e6db1175c', coins: 35 },
  { hash: 'ca68dc730459bf5406df830f8a03e24285d585347d67126eb570e12f61e808f6', coins: 35 },
  { hash: '60bc127e32d43ace9de6c40cde15dac67ba12801e84153a0d99f459c45258508', coins: 35 },
  { hash: '4fccf8d70c80786f5bc5038ef7c5b9b46970ca8c3f6ed4b30c43281096d52fd5', coins: 35 },
  { hash: '9b6373cfd71341377087359fec116328e61e96fb0d7e1872e078c50828c0f5b2', coins: 35 },
  { hash: 'e5130da90d95420180d38c87dc062fb5d5579b2a663468e5e95922e3ddd8f18e', coins: 35 },
  { hash: '28a1d53753c992b9d5fb42b558b918aff4a0f1b68a6a4c9d0e9ba5e1e374d227', coins: 35 },
  { hash: '1da89d6710b36de5b1b887130c5740aa06d431b1de66d4375d18bc9bff94d7f2', coins: 35 },
  { hash: 'a92dcbe7e105e1ec3b4e08c66fc214a10a625e9929866a562c729dadcf6abb7e', coins: 35 },
  { hash: 'c661a14a08b614aef9e41758a7bf874bbae53548c26c8411c8c24a79bd7cae5d', coins: 35 },
  { hash: '2ae2540d4c90305d5e31b6abcf76b11afa25d2417b0b29f82d5b527822e8d40c', coins: 35 },
  { hash: 'd6863bdbd10f003e9468b4cd0b44aca0cd54745025d9cb9fbf2d9b39bc4d847e', coins: 35 },
  { hash: '78f2f79658717ca736b8812ddc22df5d55f3b05cba4493b8ac3ae68f6fab4f56', coins: 35 },
  { hash: '04479e03be7d1d84fd19ebc58db6c687a96defa0ea72c0f74d697f34f0ca88c5', coins: 35 },
  { hash: '4912d540aaffa195c92bdebd1b93e6c1e630daf39cfe36441343b79a749066b0', coins: 35 },
  { hash: 'de05b0f260f0f69f07252c38c028094f189dd74d93e9483ffe6fdbc23cf829db', coins: 35 },
  { hash: 'aa25dc22167069fe98e949a7eae50d85b3c4a378c5de85a5e481ccde25fdf1c7', coins: 35 },
  { hash: '4b3bc666a84f30ff8ffbfbeeca5cfa635689a051882dc6788e2d691fe055ce42', coins: 35 },
  { hash: 'edeeb659a2e75203ad19b50bfdad57770beeaf9c46c500a7ad5d1028bb58b32f', coins: 35 },
  { hash: '72b089c03acc4d3bd6111eccb253d6b1d69b13021ab8b41f7d815f5ae182cbba', coins: 35 },
  
  
  { hash: 'd998eb9cd1583742bfef6ab56bb2a5858bef522e6eb2d2bc6f12544e50aa3dab', coins: 75 },
  { hash: '3a71932c80d858c5128e85639407fe8ab7e13206c2757614000dfd9958bb6161', coins: 75 },
  { hash: '639fe65e8ca2536ff67f04a56263650cdd3b61b6975338abde03733280488a50', coins: 75 },
  { hash: '36065141e237afa9958f16a96eec12f3a57012a33bd68eae50a1a0a7159eeac1', coins: 75 },
  { hash: 'a66797ba30296abf79ecf76e59429c510861213de5dffa91db308a316f41d318', coins: 75 },
  { hash: 'c17e20e90f9dbf2ab223bf7217048f8d3388436b0bd9c677493626993d84bc8e', coins: 75 },
  { hash: '5fbe98b42c40224ceac657de6c95b84091a07b2b58929b1679f809dda4940fb9', coins: 75 },
  { hash: '5fca37cafb49c7f3ac7f45a2ea4fd2b28e571911681c2722d544bd460528f380', coins: 75 },
  { hash: '40e10041a80c07db6549c785ed67e363c0d4c3db82595eeb73700a301104d7f8', coins: 75 },
  { hash: '1979d0639fa95240b168cf427564e8815a2ae3f8950d814c7cbe729c3a6d57af', coins: 75 },
  { hash: '0dcd420b9dd376cd0d96427a28eb6f9a649a4f2ce6a1fdc3c75c2313c61c7933', coins: 75 },
  { hash: '8d15369016fff5244bd2c03aca43a9d5133c5fc3d85e6f3a823ffe6349dba719', coins: 75 },
  { hash: '2932827fbd81569a690c89278aaea8876b2d7cbb55525275aa28fde4e1e46616', coins: 75 },
  { hash: 'd490b8a4b20279778e89062821de457608e4176b072402e531fc667b0b028097', coins: 75 },
  { hash: '11a4b8219522703840a900f6f1942f5ea8f143cfe27d5a3fd1b71def6e394631', coins: 75 },
  { hash: '0df4d2887e8ced81bf2a05d499c0bffec7be9d5ae8cf8aabdcc56ba3580b4fda', coins: 75 },
  { hash: '84b68f08cc5b9416988dddf81bfbc5bbcc6a3bbba30f679a10fa1a858217e442', coins: 75 },
  { hash: 'a1690b6b4aab8d479adbda33ffabd67f9102d3726b92130828c6fbec5f1949c3', coins: 75 },
  { hash: '3dfd4bb2f02fb63178abdd8a9c7f08e269a7ff215a508041e2fca5fb0f012f80', coins: 75 },
  { hash: '9e4754f0b9e0f18a1b82b8b4e5ce803b167a4d41138d49510d8f51073f79b5b2', coins: 75 },
  
  
  { hash: 'a45a171d2c2bfd2a8128ca4be0cf5ffd59fda683a9ea448707bef15ed604a9eb', coins: 150 },
  { hash: '3d84c127fc0a09fdb8731d9559e20947904fd8f6cc243315d775310218106ff6', coins: 150 },
  { hash: '3bc8924522bb492a14d2cec7ff80814c5615394cc11ee1d8db9019331c3dc371', coins: 150 },
  { hash: '6dfe4c6f816a769e3b68065639b683dde6db45fc8b05360b75592140aac4f82e', coins: 150 },
  { hash: 'd153ddb2544f1e7e1a664ae6a03f6939a57622c7b1f6095c89866d72365c21df', coins: 150 },
  { hash: 'e1ae311498f8e6baadb45bfd6cb4aea8b3683ba480e127d05aa465effd8aaeb8', coins: 150 },
  { hash: '03b04559ca6f2e38123f5b2959fc4a271eb1a181b8acabacb62dd88377261814', coins: 150 },
  { hash: 'c3f344c0eeaa87181aaf5513bd40a3a76f22f8e5bbec1900960e01e5e400be84', coins: 150 },
  { hash: '395f4365786215c1d28c2ff1788841c73c708c2216a9d4b6f7e02ffe3bada4a7', coins: 150 },
  { hash: 'e2d552ae5d15293160b0f24350ffac72e57f1e98c7e1adfc1c6c9613cab430b7', coins: 150 },
  { hash: 'ce9299a7371e47f6a8686d8fdfa9b1fa829694f447475218e0ca101f964ade89', coins: 150 },
  { hash: 'cda3f5b562e57a51df643503b63d33fd51a5b0d1053d3c7989c038f418a11605', coins: 150 },
  { hash: '68bb8023e020b9770f1ca1be0af6461771295d2910187d096f136ccc5fa3a407', coins: 150 },
  { hash: 'e6ea2624873174e7739960f62f7b4c6502dc0c12376b572efa1d4ff4ec93eb07', coins: 150 },
  { hash: '162b33757a108af8641bb16d1f137f88513b11787c0f5b69cbd0a04c1c1bc44e', coins: 150 },
  { hash: '76e7bf0b8db752c2af80bed8e347982a865cde7890edf19dc1a09d6469c7b1ae', coins: 150 },
  { hash: '8d18b705d09c075ad115ab941b78af2d699bb53d47cb77810c0f1ce9a63e94c5', coins: 150 },
  { hash: '2bc295d092863cfe556d672bce4402904c381c70ac07067d641275afe8795c80', coins: 150 },
  { hash: '004afe69f0deec27219c185ddac5ea5f14230dbbfa12704d4b6ff0072e811de2', coins: 150 },
  { hash: 'e4dbb47789da95fa235d0f4ef036c541a1ac36832017aec30794c1da356aeb7c', coins: 150 },
];

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
  telegram: 'user_4133',
  methods: [
    { name: 'Карта',  details: '' },    // например: Корти Милли 0000 0000 0000 0000
    { name: 'Кошелёк', details: 'Alif 935304019' },   // например: Alif / DC Wallet +992 000 00 00 00
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

// --- Редкости ----------------------------------------------
// Шансы выпадения теперь свои у каждого кейса — см. ODDS и CASES ниже
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
//   rarity — c / u / r / e / l (см. RARITY выше)
//   hue    — цвет градиента 0–360 (виден, пока нет картинки)
//   image  — имя файла из папки assets/images/skins/ ('' = без картинки)
// Файл для кнопки «Установить» берётся по порядку: первый скин — assets/skins/1.zip, второй — 2.zip...
const IMAGES_ROOT = 'assets/images/';          // общие картинки: кейсы, баннер, окно
const IMAGES_DIR  = IMAGES_ROOT + 'skins/';    // картинки скинов

const SKIN_DATA = [
  { weapon: 'knife', name: 'Нож Керамбит Градиент', rarity: 'j', hue: 5, image: 'karambit-knife-fade.avif' },
  { weapon: 'knife', name: 'Нож Бабочка Синее море', rarity: 'l', hue: 5, image: 'butterfly-knife-blue-sea.avif' },
  { weapon: 'ak-47', name: 'AK-47 Неоновая революция', rarity: 'e', hue: 5, image: 'ak-47-neon-revolution.avif' },
  { weapon: 'deagle', name: 'Desert Eagle Блейз', rarity: 'r', hue: 5, image: 'deagle-blaze_3.jpg' },
  { weapon: 'awp', name: 'AWP Хайпер бист (beast)', rarity: 'e', hue: 5, image: 'awp-hyper-beast (1).jpg' },
  { weapon: 'knife', name: 'Керамбит зеленая мечта', rarity: 'l', hue: 5, image: 'karambit-green-dreamer.jpg' },
  { weapon: 'usp', name: 'USP - монстра (monstah)', rarity: 'r', hue: 5, image: 'usp-monstah.jpg' }
  
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
const CT_WEAPONS = ['m4a1', 'usp', 'awp', 'scout', 'knife'];
const FREE_CASE = ['ak-47']
const DEFAULT_CASE = ['ak-47', 'knife', 'm4a1', 'usp', 'awp', 'scout', 'glock', 'deagle', 'p90', 'knife']
const hasWeapon = (list, skin) => list.includes(skin.weapon.toLowerCase());

// Шансы редкостей (в «весах»: чем больше число, тем чаще выпадает). Это ОТНОСИТЕЛЬНЫЕ числа.
// Если в кейсе нет скинов какой-то редкости, её вес просто пропадает, остальные пересчитываются сами.
// Если в кейсе несколько скинов одной редкости, вес редкости делится между ними поровну.
// Чем дороже кейс, тем выше шанс редких скинов. Нет буквы — такая редкость в кейс не падает.
//   c — редкий, u — сверхредкий, r — эпический, e — аркана, l — легендарный, j — ультра
const ODDS = {
  free:    { c: 75, u: 18, r: 5,  e: 2 },
  cheap:   { c: 70, u: 20, r: 7,  e: 2.5, l: 0.5 },
  medium:  { c: 50, u: 28, r: 14, e: 6,   l: 1.8, j: 0.2 },
  rich:    { c: 25, u: 30, r: 24, e: 12,  l: 7,   j: 2 },
};

// image — картинка кейса из assets/images/ (нет файла — покажется номер)
// hue   — цвет свечения вокруг кейса (0–360)
// tag   — значок в углу карточки ('' = без значка)
// has   — какие скины лежат в кейсе
// odds  — шансы редкостей (см. ODDS выше)
// Кейс с ценой 0 — бесплатный: его можно открыть один раз в день.
const CASES = [
  { name: 'Кейс Бесплатный', price: 0,  image: 'case_1.jpg', hue: 2,   tag: 'FREE', has: s => hasWeapon(FREE_CASE, s),    odds: ODDS.free },
  { name: 'Кейс Бомжатник',  price: 5, image: 'case_1.jpg', hue: 210, tag: '',     has: s => hasWeapon(DEFAULT_CASE, s), odds: ODDS.cheap },
  { name: 'Кейс Среднечек',  price: 15, image: 'case_2.jpg', hue: 280, tag: '',     has: s => hasWeapon(DEFAULT_CASE, s), odds: ODDS.medium },
  { name: 'Кейс Богач',      price: 30, image: 'case_2.jpg', hue: 45,  tag: 'VIP',  has: () => true,                      odds: ODDS.rich },
];

// Скины, которые реально могут выпасть из кейса (лежат в нём и шанс их редкости больше нуля)
const caseSkins = c => SKINS.filter(s => c.has(s) && (c.odds[s.rarity] || 0) > 0);

// --- Бесплатный кейс: раз в день ---------------------------
// state.freeDay хранит дату последнего открытия ('2026-11-15'). Новый день по часам устройства — кейс снова доступен.
const isFree     = c => c.price === 0;
const caseLocked = c => isFree(c) && state.freeDay === todayKey();

// Сколько осталось до следующего дня: '5 ч 12 мин'
function timeToNextDay() {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const minutes = Math.max(1, Math.ceil((midnight - now) / 60000));
  return `${Math.floor(minutes / 60)} ч ${minutes % 60} мин`;
}

// Текст кнопки открытия кейса: цена, «бесплатно» или время до следующей попытки
const openLabel = c => caseLocked(c) ? `Через ${timeToNextDay()}` : isFree(c) ? 'Открыть бесплатно' : `Открыть за ${c.price}с`;

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
  freeDay: '',                     // дата последнего открытия бесплатного кейса
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

// --- Кейсы ---
function renderCases() {
  const items = CASES.map((c, k) => {
    const count = caseSkins(c).length;
    const button = count
      ? `<button class="p" data-action="open-case" data-id="${k}" ${caseLocked(c) ? 'disabled' : ''}>${openLabel(c)}</button>`
      : '<button type="button" disabled>Скоро</button>';
    return `
      <div class="case glass ${count ? '' : 'soon'}" style="--h:${c.hue}">
        ${c.tag ? `<span class="tag">${c.tag}</span>` : ''}
        <div class="crate">
          <img src="${IMAGES_ROOT}${c.image}" alt="${c.name}" loading="lazy" onerror="this.parentElement.textContent='${k + 1}'">
        </div>
        <h3>${c.name}</h3>
        <p>${count ? `${count} скинов${isFree(c) ? ', раз в день' : ''}` : 'Скины появятся скоро'}</p>
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

// Кнопки окна кейса: пока крутится рулетка, нет скинов или бесплатный кейс уже открыт сегодня — «Открыть» отключена
function updateGoButton() {
  const empty = !caseSkins(currentCase).length;
  $('#go').textContent = openLabel(currentCase);
  $('#go').disabled = spinning || empty || caseLocked(currentCase);
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
  $('#case-price').textContent = isFree(currentCase) ? 'FREE' : currentCase.price + 'с';
  $('#viewport').classList.remove('done', 'rare');
  showPreview(currentCase);
  setResult(caseLocked(currentCase) ? 'Бесплатный кейс уже открыт сегодня. Приходи завтра или попробуй демо' : 'Нажми «Открыть», чтобы запустить рулетку');
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
    if (caseLocked(currentCase)) return toast('Бесплатный кейс уже открыт сегодня');
    if (isFree(currentCase)) state.freeDay = todayKey();   // записываем сразу, чтобы нельзя было обойти обновлением страницы
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
  if (!demo && isFree(currentCase)) route();   // на странице под окном кнопка бесплатного кейса тоже блокируется

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
// Хэш кода: SHA-256 от кода без пробелов и тире, заглавными буквами
async function hashCode(code) {
  const bytes = new TextEncoder().encode(code.toUpperCase().replace(/[^A-Z0-9]/g, ''));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function activatePromo() {
  const input = $('#promo-input');
  const code = input.value.trim();
  if (!code) return toast('Введи промокод');
  if (!window.crypto?.subtle) return toast('Промокоды работают только на сайте с https');

  const hash = await hashCode(code);
  const promo = PROMOCODES.find(p => p.hash === hash);
  if (!promo) return toast('Такого промокода нет');
  if (state.usedCodes.includes(hash)) return toast('Этот промокод уже использован');

  state.usedCodes.push(hash);
  state.bal += promo.coins;
  input.value = '';
  updateBalance();
  closeSide();
  toast(`Промокод принят: +${promo.coins}с`);
}

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
