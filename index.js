const mineflayer = require("mineflayer");
const { HttpProxyAgent } = require("http-proxy-agent");
const fs = require("fs");
const cheatCheck = "Пожайлуста прекратите читерить или вы будете забанены!";
const adMsgs = [
  "!&c&lПривет, друг! Хочешь побывать в клане, где была великая история? Тогда тебе сюда -> /warp CH или /warp ChertHouse ! У нас есть: топовый кит для пвп, хороший кх и многое другое! Чего же ты ждёшь? Присоединяйся к нам!",
  "!&c&lПриветик! Хочешь с кайфом провести время, но не знаешь как? Тогда тебе подойдёт клан &4&lChert&0&lHouse &c&l! У нас ты найдёшь хороший кх, топовый кит и уважение клана. Чтоб вступить в клан пиши /warp CH или /warp ChertHouse",
  "!&c&lХочешь в крутой клан с многими плюшками? Тогда тебе нужен клан &4&lChert&0&lHouse&c&l ! У нас ты не только найдёшь топовый кит для пвп и хороший кх, но и дс сервер! А так же у нас открыт набор на модераторов! /warp CH или /warp ChertHouse"
];
const password = "!afterHuila00pidor3svocvoRus";
const allBotWarp = "nf9akf30k"
let blacklist = ["uzerchik", "Milaina", "Диего_санчез", "TimohaFriend638", "0fansik", "menvixss", "pro7070", "affa", "alibaba12", "reizor", "IIe4e4Ka", "menesixx"];
let lastKilledPlayer = "";
let lastKilledPlayerCount = 0;

function getRandomNumber(min, max) {
  // Функция для генерации рандомного числа
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function extractTextFromChatMessage(chatMessage) {
  // Функция для извлечения текста из объекта ChatMessage
  if (typeof chatMessage === "string") return chatMessage;

  return chatMessage.extra
    ? chatMessage.extra.map(extractTextFromChatMessage).join("")
    : chatMessage.text || "";
}

function getRandomProxy() {
  // Функция для получения случайного прокси из файла
  const proxies = fs.readFileSync("./proxies.txt", "utf-8").split('\n').filter(line => line.trim() !== "");
  const randomIndex = Math.floor(Math.random() * proxies.length);
  return proxies[randomIndex];
}

function handleSpawn(bot, portal) {
  // Функция для обработки спавна бота, то есть регистрации \ логина и захода в портал
  setTimeout(() => {
    bot.chat(`/reg ${password}`);
    bot.chat(`/login ${password}`);
  }, 1000);

  setTimeout(() => {
    bot.chat(`/${portal}`);
  }, 2000);

  console.log(`${bot.username} has spawned`);
}

function invitePlayers(bot) {
  // Функция для приглашения ближайшего игрока в клан
  setInterval(() => {
    const closestPlayer = bot.nearestEntity(entity => entity.type === "player");
    if (closestPlayer && !blacklist.includes(closestPlayer.username)) {
      bot.chat(`/c invite ${closestPlayer.username}`);
    }
  }, getRandomNumber(1000, 15000));
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
    bot.chat("/clear");
    bot.chat(adMsgs[getRandomNumber(0, adMsgs.length - 1)]);
  }, getRandomNumber(140000, 160000));
}


function messagesMonitoring(message, bot) {
  let fullMessage = extractTextFromChatMessage(message);

  // console.log(fullMessage);  // Парсинг чата для дебага

  const matchLeave = fullMessage.match(/› (.*?) покинул клан\./);
  const matchJoin = fullMessage.match(/› (.*?) присоеденился к клану\./);
  const matchKdr = fullMessage.match(/убил игрока (\w+)/);


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
    if (lastKilledPlayerCount >= 5) {
      bot.chat(`/c kick ${killedPlayer}`);
      blacklist.push(killedPlayer);
      lastKilledPlayerCount = 0;
      lastKilledPlayer = "";
    }

    if (killedPlayer === lastKilledPlayer) lastKilledPlayerCount++;

    else {
      lastKilledPlayer = killedPlayer;
      lastKilledPlayerCount = 0;
    }
  }

  if (fullMessage === cheatCheck) bot.end();
}

function createBot(nickname, portal, warp) {
  // Функция для создания бота
  const proxy = getRandomProxy();
  const agent = new HttpProxyAgent(`http://${proxy}`);
  const bot = mineflayer.createBot({
    host: "mc.masedworld.net",
    port: 25565,
    username: nickname,
    agent: agent,
  });

  setTimeout(() =>  bot.end(), 60 * 60 * 1000);  // Рестарт бота раз в 1 час

  bot.on("spawn", () => handleSpawn(bot, portal));
  bot.on("message", (message) => { messagesMonitoring(message, bot); });

  bot.once("spawn", () => {
    invitePlayers(bot);
    lookAtEntities(bot);
    sendAdvertisements(bot);
  });
  bot.on("forcedMove", () => bot.chat(`/warp ${warp}`));
  bot.on("error", (err) => console.log(err));
  bot.on("end", () => {
    console.log(`${nickname} - Reconnection...`);
    createBot(nickname, portal, warp);
  });
}

// Создание ботов
createBot("Kemper1ng", "s2", allBotWarp);
createBot("SCPbotSH", "s3", allBotWarp);
createBot("AntiKemper1ng", "s7", allBotWarp);
createBot("Alfhelm", "s5", allBotWarp);
