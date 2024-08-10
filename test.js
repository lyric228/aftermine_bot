const mineflayer = require("mineflayer");
const { HttpProxyAgent } = require("http-proxy-agent");
const fs = require("fs");
const password = "!afterHuila00pidor3svocvoRus";


function getRandomProxy() {
  const proxies = fs.readFileSync('./proxies.txt', 'utf-8').split('\n').filter(line => line.trim() !== '');
  const randomIndex = Math.floor(Math.random() * proxies.length);
  return proxies[randomIndex];
}

function handleSpawn(bot, portal) {
  setTimeout(() => {
    bot.chat(`/reg ${password}`);
    bot.chat(`/login ${password}`);
  }, 1000);

  setTimeout(() => {
    bot.chat(`/${portal}`);
  }, 2000);

  console.log(`${bot.username} has spawned`);
  bot.chat("/warp huihui");
}


// function extractTextFromChatMessage(chatMessage) {
//   // Функция для извлечения текста из объекта ChatMessage
//   if (typeof chatMessage === 'string') return chatMessage;
//
//   return chatMessage.extra
//     ? chatMessage.extra.map(extractTextFromChatMessage).join('')
//     : chatMessage.text || '';
// }

function createBot(nickname, portal) {
  const proxy = getRandomProxy();
  const agent = new HttpProxyAgent(`http://${proxy}`);

  const bot = mineflayer.createBot({
    host: "mc.masedworld.net",
    port: 25565,
    username: nickname,
    agent: agent,
  });

  bot.on("spawn", () => handleSpawn(bot, portal));

  bot.on("error", (err) => console.error(`${nickname} encountered an error: ${err}`));

  bot.on("end", () => {
    console.log(`${nickname} - Reconnection...`);
    //createBot(nickname, portal);
  });

  // bot.on("message", (message) => {
  //   const extractedText = extractTextFromChatMessage(message);
  //   console.log("Received message:", extractedText);
  // });

  setTimeout(() => {
    bot.end();
  }, 60 * 60 * 1000);
}

// Создание ботов
createBot("CandyCrush2", "s3");
