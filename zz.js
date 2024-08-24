const mineflayer = require("mineflayer");


function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function extractTextFromChatMessage(chatMessage) {
  // Функция для извлечения текста из объекта ChatMessage
  if (typeof chatMessage === "string") return chatMessage;

  return chatMessage.extra
    ? chatMessage.extra.map(extractTextFromChatMessage).join("")
    : chatMessage.text || "";
}

function handleSpawn(bot, portal, password) {
  setTimeout(() => {
    sendMsg(bot,`/reg ${password}`);
    sendMsg(bot,`/login ${password}`);
  }, 2000);

  setTimeout(() => {
    sendMsg(bot,`/${portal}`);
    console.log(`${bot.username} has spawned`);
  }, 2000);
}


function invitePlayers(bot) {
  setInterval(() => {
      const closestPlayer = bot.nearestEntity(entity => entity.type === "player");
      if (closestPlayer) sendMsg(bot, `/c invite ${closestPlayer.username}`);
  }, getRandomNumber(1000, 15000));
}


function lookAtEntities(bot) {
  setInterval(() => lookAtNearestPlayer(bot), 100);
}

function sendAdvertisements(bot) {
  setInterval(() => {
    sendMsg(bot, "&5&LПривет мой дорогой друг!&F&L Хочешь попасть в крутой клан, но не можешь определиться? Тогда тебе к нам. У нас есть отличный кит для Пвп, красивый спавн и добрая администрация.. &5&lНаш варп /warp KRISTL Мы ждем именно тебя!!!");
  }, getRandomNumber(2.5*60*1000, 3*60*1000));
}

function getNearestPlayer(bot) {
  return bot.nearestEntity(entity => entity.type === "player");
}

function lookAtNearestPlayer(bot, closestPlayer = getNearestPlayer(bot)) {
  if (closestPlayer) {
    const lookPosition = closestPlayer.position.offset(0, 1.6, 0);
    bot.lookAt(lookPosition);
  }
}

function sendMsg(bot, msg) {
  try {
    bot._client.chat(msg);
  } catch (error) {
    console.log("Error!");
  }
}

function reconnectBot(nickname, portal, warp) {
  console.log(`${nickname} - Reconnection...`);
  createBot(nickname, portal, warp);
}

// Функция для создания бота
function createBot(nickname, portal, host = "mc.masedworld.net", port = 25565, password = "angel123tt") {
  const bot = mineflayer.createBot({
    host: host,
    port: port,
    username: nickname,
  });

  bot.once("spawn", () => {
    invitePlayers(bot);
    lookAtEntities(bot);
    sendAdvertisements(bot);
  });

  bot.on("spawn", () => handleSpawn(bot, portal, password));
  bot.on("error", (err) => bot.end(`An error has occurred ${err}`));
  bot.on("end", () => reconnectBot(nickname, portal));
  bot.on(("message"), (message) => console.log(extractTextFromChatMessage(message)));
}

// Создание ботов
createBot("angel123tt", "s2");
