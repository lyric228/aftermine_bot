const mineflayer = require("mineflayer");


const AdMsg = "!&lПривет , на связи клан &e&lTranquility! &e&lПриглашаем вас к нам ! &e&l/warp TQ &f&lлибо &e&l/warp Tranquility! &f&lИдеальный кит , &f&lи отзывчивая администрация! Приходите к нам , и будьте в топе с нами! &e&lTranquility!";


function handleSpawn(bot, portal, password) {
  // Функция для логина и захода в портал при спавне бота
  setTimeout(() => {
    bot.chat(`/reg ${password}`);
    bot.chat(`/login ${password}`);
  }, 2000);

  setTimeout(() => {
    bot.chat(`/${portal}`);
  }, 2000);

  console.log(`${bot.username} has spawned`);
}

function invitePlayers(bot) {
  // Функция для приглашения ближайшего игрока в клан
  setInterval(() => {
    const closestPlayer = bot.nearestEntity(entity => entity.type === "player");
    if (closestPlayer != null) bot.chat(`/c invite ${closestPlayer.username}`);
  }, 20000);
}

function lookAtEntities(bot) {
  // Функция чтобы бот смотрел на ближайшего игрока
  setInterval(() => {
    const closestPlayer = bot.nearestEntity(entity => entity.type === "player");
    if (closestPlayer) {
      let lookPosition = closestPlayer.position.offset(0, 1.6, 0);
      bot.lookAt(lookPosition);
    }
  }, 100);
}

function sendAdvertisements(bot) {
  // Функция для рассылки рандомного сообщения рекламы клана в глобальный чат
  setInterval(() => {
    bot.chat(AdMsg);
  }, 150000);
}


function createBot(nickname, portal, warp, password) {
  // Функция для создания бота
  const bot = mineflayer.createBot({
    host: "mc.masedworld.net",
    port: 25565,
    username: nickname,
  });

  setInterval(() =>  bot.chat(`/warp ${warp}`), 30 * 1000);  // Авто тп на варп раз в пол минуты (30 - кол-во секунд перед каждым тп)
  bot.on("spawn", () => handleSpawn(bot, portal, password));

  bot.once("spawn", () => {
    invitePlayers(bot);
    lookAtEntities(bot);
    sendAdvertisements(bot);
  });
  bot.on("error", (err) => console.log(err));  // Вывод ошибок
  bot.on("end", () => {  // Авто переподключение бота
    console.log(`${nickname} - Reconnection...`);
    createBot(nickname, portal, warp);
  });
}

// Создание бота
createBot("тута ник бота", "s5", "Bot_Tq", "тута пароль от акка бота");
// nickname - ник бота
// portal - портал куда заходит бот (пример: s2 - второе выживание, эпсилон, s3 - третье выживание, неон и тд)
// warp - warp на котором должен быть бот всегда, если не указан, то бот будет в любой точке
