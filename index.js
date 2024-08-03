const mineflayer = require("mineflayer");

// const adDefMsgOld = "!&c&lПривет, друг! Хочешь побывать в клане, где была великая история? Тогда тебе сюда -> /warp CH ! У нас есть: топовый кит для пвп, хороший кх и многое другое! Мы выдаём флай игрокам :3. Чего же ты ждёшь? Присоединяйся к нам!";
const adDefMsg = "!&c&lПривет, друг! Хочешь побывать в клане, где была великая история? Тогда тебе сюда -> /warp CH ! У нас есть: топовый кит для пвп, хороший кх и многое другое! Чего же ты ждёшь? Присоединяйся к нам!";
const blacklist = ["uzerchik", "Milaina", "Диего_санчез"];
const cheat_check = "[system]: Пожайлуста прекратите читерить или вы будете забанены!";


function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function handleSpawn(bot, password, portal) {
  setTimeout(() => {
    bot.chat(`/reg ${password}`);
    bot.chat(`/login ${password}`);
  }, 1000);

  setTimeout(() => {
    bot.chat(`/${portal}`);
  }, 1000);

  console.log(`${bot.username} has spawned`);
}

function invitePlayers(bot) {
  setInterval(() => {
    const closestPlayer = bot.nearestEntity(entity => entity.type === "player");
    if (closestPlayer && !blacklist.includes(closestPlayer.username)) {
      bot.chat(`/c invite ${closestPlayer.username}`);
    }
  }, getRandomNumber(1000, 15000));
}

function lookAtEntities(bot) {
  setInterval(() => {
    const closestPlayer = bot.nearestEntity(entity => entity.type === "player");
    if (closestPlayer) {
      let lookPosition = closestPlayer.position.offset(0, 1.6, 0)
      bot.lookAt(lookPosition);
    }
  }, 10);
}

function sendAdvertisements(bot, adMsg) {
  setInterval(() => {
    bot.chat("/clear");
    bot.chat(adMsg);
  }, getRandomNumber(150000, 180000));
}

function monitorPosition(bot, defCord, warp) {
  setInterval(() => {
    const { x, y, z } = bot.entity.position;
    if (x !== defCord[0] || y !== defCord[1] || z !== defCord[2]) {
      bot.chat(`/warp ${warp}`);
    }
  }, 1000);
}

function createBot(nickname, password, portal, warp, adMsg, defCord) {
  const bot = mineflayer.createBot({
    host: "mc.masedworld.net",
    port: 25565,
    username: nickname,
  });

  setTimeout(() => {
    bot.end();
  }, 60*60*1000);  // Рестарт бота раз в 1 час

  bot.on("spawn", () => handleSpawn(bot, password, portal));

  bot.once("spawn", () => {
    invitePlayers(bot);
    lookAtEntities(bot);
    sendAdvertisements(bot, adMsg);
    monitorPosition(bot, defCord, warp);
  });

  bot.on("message", (jsonMsg, position) => {
    const message = `[${position}]: ${jsonMsg.toString()}`;
    // console.log(message);  // Лог сообщений
    if (message.includes(cheat_check)) bot.end();
  });

  bot.on("error", (err) => console.log(err));

  bot.on("end", () => {
    console.log(`${nickname} - Reconnection...`);
    createBot(nickname, password, portal, warp, adMsg, defCord);
  });
}

createBot("Kemper1ng", "!afterHuila00pidor3svocvoRus", "s2", "CHbot1", adDefMsg, [9105.5, 169, 10104.5])
createBot("SCPbotSH", "!afterHuila00pidor3svocvoRus", "s3", "chbot", adDefMsg, [-4871.5, 109, -3179.5])
