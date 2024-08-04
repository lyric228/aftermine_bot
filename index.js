const mineflayer = require("mineflayer");

// const adDefMsgOld = "!&c&lПривет, друг! Хочешь побывать в клане, где была великая история? Тогда тебе сюда -> /warp CH ! У нас есть: топовый кит для пвп, хороший кх и многое другое! Мы выдаём флай игрокам :3. Чего же ты ждёшь? Присоединяйся к нам!";
const adDefMsg1 = "!&c&lПривет, друг! Хочешь побывать в клане, где была великая история? Тогда тебе сюда -> /warp CH ! У нас есть: топовый кит для пвп, хороший кх и многое другое! Чего же ты ждёшь? Присоединяйся к нам!";
const adDefMsg2 = "!&c&lПриветик! Хочешь с кайфом провести время, но не знаешь как? Тогда тебе подойдёт клан &4&lChert&0&lHouse &c&l! У нас ты найдёшь хороший кх, топовый кит и уважение клана. Чтоб вступить в клан пиши /warp CH"
const adDefMsg3 = "!&c&lХочешь в крутой клан с многими плюшками? Тогда тебе нужен клан &4&lChert&0&lHouse&c&l ! У нас ты не только найдёшь топовый кит для пвп и хороший кх, но и дс сервер! А так же у нас открыт набор на модераторов! /warp CH"
const adMessages = [adDefMsg1, adDefMsg2, adDefMsg3];
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

function sendAdvertisements(bot, adMsgs) {
  setInterval(() => {
    bot.chat("/clear");
    bot.chat(adMsgs[getRandomNumber(0, adMsgs.length)]);
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

function createBot(nickname, password, portal, warp, adMsgs, defCord) {
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
    sendAdvertisements(bot, adMsgs);
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
    createBot(nickname, password, portal, warp, adMsgs, defCord);
  });
}

createBot("Kemper1ng", "!afterHuila00pidor3svocvoRus", "s2", "CHbot1", adMessages, [9105.5, 169, 10104.5])
createBot("SCPbotSH", "!afterHuila00pidor3svocvoRus", "s3", "chbot", adMessages, [-4871.5, 109, -3179.5])
createBot("Alfhelm", "!afterHuila00pidor3svocvoRus", "s7", "chbot", adMessages, [-10206.5, 159, -13028.5])  // cords
