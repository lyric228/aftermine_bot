const { HttpProxyAgent } = require("http-proxy-agent");
const mineflayer = require("mineflayer");
const fs = require("fs");


function getRandomProxy() {
  const proxies = fs.readFileSync('./proxies.txt', 'utf-8').split('\n').filter(line => line.trim() !== '');
  const randomIndex = Math.floor(Math.random() * proxies.length);
  return proxies[randomIndex];
}

function extractTextFromChatMessage(chatMessage) {
  if (typeof chatMessage === "string") return chatMessage;

  return chatMessage.extra
    ? chatMessage.extra.map(extractTextFromChatMessage).join("")
    : chatMessage.text || "";
}

// Функция для логина и захода в портал при спавне бота
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

function tpWarp(bot, warp) {
  try {
      sendMsg( bot, `/warp ${warp}`);
  } catch (error) {
      console.log("error");
  }
}

function sendMsg(bot, msg) {
  try {
    bot._client.chat(msg);
  } catch (error) {
    console.log("Error!");
  }
}

function createBot(nickname, portal, password) {
  const proxy = getRandomProxy();
  const agent = new HttpProxyAgent(`http://${proxy}`);

  const bot = mineflayer.createBot({
    host: "mc.masedworld.net",
    port: 25565,
    username: nickname,
    agent: agent,
  });
  bot.on("kicked", () => bot.end("Kicked"));
  bot.on("end", () => {
    console.log(`${nickname} - Reconnection...`);
    createBot(nickname, portal);
  });
  bot.on("spawn", () => {handleSpawn(bot, portal, password)})
  setInterval(() => {tpWarp(bot, "KRISTL")}, 1000);
  setInterval(() => {
    const neareat = bot.nearestEntity(entity => entity.type === "player");
    if (neareat != null) sendMsg(bot, `/c invite ${neareat.username}`);
  }, 7000);
  bot.on("message", (message) => console.log(extractTextFromChatMessage(message)))
}

// Создание ботов
setTimeout(() => createBot("SoulInsult_bоt", "s5", "!afterHuila00pidor3svocvoRus"), 5000);
