const mineflayer = require("mineflayer");

const cheatCheck = "[system]: Пожайлуста прекратите читерить или вы будете забанены!";
const adDefMsg1 = "!&c&lПривет, друг! Хочешь побывать в клане, где была великая история? Тогда тебе сюда -> /warp CH или /warp ChertHouse ! У нас есть: топовый кит для пвп, хороший кх и многое другое! Чего же ты ждёшь? Присоединяйся к нам!";
const adDefMsg2 = "!&c&lПриветик! Хочешь с кайфом провести время, но не знаешь как? Тогда тебе подойдёт клан &4&lChert&0&lHouse &c&l! У нас ты найдёшь хороший кх, топовый кит и уважение клана. Чтоб вступить в клан пиши /warp CH или /warp ChertHouse"
const adDefMsg3 = "!&c&lХочешь в крутой клан с многими плюшками? Тогда тебе нужен клан &4&lChert&0&lHouse&c&l ! У нас ты не только найдёшь топовый кит для пвп и хороший кх, но и дс сервер! А так же у нас открыт набор на модераторов! /warp CH или /warp ChertHouse"
const adMessages = [adDefMsg1, adDefMsg2, adDefMsg3];
const password = "!afterHuila00pidor3svocvoRus";
let blacklist = ["uzerchik", "Milaina", "Диего_санчез", "TimohaFriend638", "menvixss", "pro7070", "affa", "alibaba12", "ZLO_DEMON666"];
let lastKilledPlayer = "";
let lastKilledPlayerCount = 0;

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function handleSpawn(bot, portal) {
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
    bot.chat(adMsgs[getRandomNumber(0, adMsgs.length-1)]);
  }, getRandomNumber(140000, 180000));
}

function monitorPosition(bot, defCord, warp) {
  setInterval(() => {
    let botPos = bot.entity.position;
    console.log(botPos);
    if (botPos[0] !== defCord[0] || botPos[1] !== defCord[1] || botPos[2] !== defCord[2]) {
      bot.chat(`/warp ${warp}`);
    }
  }, 100);
}

function messagesMonitoring(position, jsonMsg, bot) {
  const message = `[${position}]: ${jsonMsg}`;
  console.log(message);  // Лог сообщений
  const matchLeave = message.match(/› (.*?) покинул клан\./);
  const matchJoin = message.match(/› (.*?) присоеденился к клану\./);
  const matchKdr = message.match(/убил игрока (\w+)/);
  if (matchJoin && matchJoin[1]) {
    const new_member = matchJoin[1];
    bot.chat(`/cc Добро пожаловать в клан, ${new_member}! Обязательно вступи в наш дискорд, там много всего интересного! Ссылка на дискорд находится в /c infо`);
  }
  if (matchLeave && matchLeave[1]) {
    const leave_member = matchLeave[1];
    bot.chat(`/cc ${leave_member} выходит из клана, на штык его!`);
  }
  if (matchKdr && matchKdr[1]) {
    const killedPlayer = matchKdr[1];
    console.log(killedPlayer);
    if (lastKilledPlayerCount >= 5) {
      bot.chat(`/c kick ${killedPlayer}`);
      blacklist.push(killedPlayer);
      lastKilledPlayerCount = 0;
      lastKilledPlayer = "";
    }
    if (killedPlayer === lastKilledPlayer) lastKilledPlayerCount++;
    else {
      lastKilledPlayer = killedPlayer
      lastKilledPlayerCount = 0;
    }
  }
  if (message.includes(cheatCheck)) bot.end();
}

function createBot(nickname, portal, warp, adMsgs, defCord) {
  const bot = mineflayer.createBot({
    host: "mc.masedworld.net",
    port: 25565,
    username: nickname,
  });

  setTimeout(() => {
    bot.end();
  }, 60*60*1000);  // Рестарт бота раз в 1 час

  bot.on("spawn", () => handleSpawn(bot, portal));

  bot.on("message", (jsonMsg, position ) => messagesMonitoring(position, jsonMsg, bot));

  bot.once("spawn", () => {
    invitePlayers(bot);
    lookAtEntities(bot);
    sendAdvertisements(bot, adMsgs);
    monitorPosition(bot, defCord, warp);
  });
  bot.on('error', (err) => console.log(err));
  bot.on('end', () => {
    console.log(`${nickname} - Reconnection...`);
    createBot(nickname, portal, warp, defCord);
  });
}
// [system]: ›~dj_mintyPryanik покончил жизнь самоубийством.
// [system]: playre_567890 убил игрока SadLyric111
//createBot("Kemper1ng", "s2", "nf9akf30k", adMessages, [9105.5, 169, 10104.5])
//createBot("SCPbotSH", "s3", "nf9akf30k", adMessages, [-4871.5, 109, -3179.5])
createBot("Alfhelm", "s7", "nf9akf30k", adMessages, [-10206.5, 159, -13028.5])
