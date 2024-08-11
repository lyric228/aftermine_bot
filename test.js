const { HttpProxyAgent } = require("http-proxy-agent");
const mineflayer = require("mineflayer");
const readline = require("readline");
const fs = require("fs");


const password = "!afterHuila00pidor3svocvoRus";

function consoleEnter(bot) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.setPrompt(">>> ");
  rl.prompt();
  rl.on("line", (input) => {
    bot.chat(input);
    rl.prompt();
  }).on("close", () => {
    console.log("Bye!");
    process.exit(0);
});
}


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
}


function clanAccept(bot) {
  setTimeout(() => {
    setInterval(() => {
      bot.chat(`/c accept`);
      bot.chat(`/warp ch`);
    }, 2000);
  }, 15000);  // 22*60*1000
}


function extractTextFromChatMessage(chatMessage) {
  // Функция для извлечения текста из объекта ChatMessage
  if (typeof chatMessage === "string") return chatMessage;

  return chatMessage.extra
    ? chatMessage.extra.map(extractTextFromChatMessage).join("")
    : chatMessage.text || "";
}


function messageHandler(message, bot) {
  const extractedText = extractTextFromChatMessage(message);
  console.log(extractedText);  // Парсинг чата для дебага

  if (extractedText.includes(`› ${bot.username} присоеденился к клану.`)) {
    bot.end();
  }
}


function createBot(nickname, portal, chatWriting, autoRec) {
  const proxy = getRandomProxy();
  const agent = new HttpProxyAgent(`http://${proxy}`);

  const bot = mineflayer.createBot({
    host: "mc.masedworld.net",
    port: 25565,
    username: nickname,
    agent: agent,
  });

  if (chatWriting) consoleEnter(bot);
  clanAccept(bot);

  bot.on("spawn", () => handleSpawn(bot, portal));

  bot.on("error", (err) => console.error(`${nickname} encountered an error: ${err}`));

  bot.on("end", () => {
    console.log(`${nickname} - Reconnection...`);
    if (autoRec) createBot(nickname, portal);
  });

  bot.on("message", (message) => {messageHandler(message, bot)});

  setInterval(() => bot.end(), 60 * 60 * 1000);  // Рестарт бота раз в 1 час
}

// Создание ботов
createBot("CandyCrush2", "s3", false, false);
