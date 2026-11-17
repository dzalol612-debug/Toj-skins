/* ============================================================
   ПРОМОКОДЫ: список кодов и их активация
   Подключается ДО script.js. Здесь два блока:
     1. PROMOCODES    — список кодов (сюда вставляешь новые строки)
     2. activatePromo — что происходит, когда игрок вводит код (пользуется state, toast, updateBalance из script.js)
   ============================================================ */

/* ============================================================
   1. СПИСОК КОДОВ
   ============================================================ */
// --- Промокоды ---------------------------------------------
// Коды хранятся не открытым текстом, а в виде хэша (SHA-256), поэтому из кода сайта их не прочитать.
// hash — хэш кода, coins — награда. Регистр, пробелы и тире в коде не важны.
// Новые коды делает страница tools/codes.html: открой её в браузере, нажми «Сгенерировать»
// и вставь готовые строки в массив ниже. Каждый код можно активировать один раз (на этом устройстве).
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

/* ============================================================
   2. АКТИВАЦИЯ
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
