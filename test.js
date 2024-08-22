const { HttpProxyAgent } = require("http-proxy-agent");
const mineflayer = require("mineflayer");
const readline = require("readline");
const fs = require("fs");


let botList = [];


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


function generateRandomString(length = 10) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}


function getRandomProxy() {
  const proxies = fs.readFileSync('./proxies.txt', 'utf-8').split('\n').filter(line => line.trim() !== '');
  const randomIndex = Math.floor(Math.random() * proxies.length);
  return proxies[randomIndex];
}

function handleSpawn(bot, portal, password) {
  setTimeout(() => {
    bot.chat(`/reg ${password}`);
    bot.chat(`/login ${password}`);
  }, 1000);

  setTimeout(() => {
    bot.chat(`/${portal}`);
  }, 2000);

  console.log(`${bot.username} has spawned`);
  bot.chat("/warp jijih")  // Авто возвращение на варп при смерти
}


function clanAccept(bot) {
  setInterval(() => {
    bot.chat("/c accept");
    bot.chat("/warp ch");
  }, 21*60*1000);
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
  // console.log(extractedText);  // Парсинг чата для дебага

  if (extractedText.includes(`› ${bot.username} присоеденился к клану.`)) bot.end();
}


function createBot(nickname, portal, chatWriting = false, autoRec = false, listBot = false, clanBot = true) {
  const proxy = getRandomProxy();
  const agent = new HttpProxyAgent(`http://${proxy}`);
  const password = generateRandomString(10);

  const bot = mineflayer.createBot({
    host: "mc.masedworld.net",
    port: 25565,
    username: nickname,
    agent: agent,
  });
  setInterval(() => {bot.chat("/warp jijih")}, 60*1000);
  if (chatWriting) consoleEnter(bot);
  if (listBot) botList.push(bot);
  if (clanBot) clanAccept(bot);

  bot.on("spawn", () => handleSpawn(bot, portal, password));

  bot.on("error", (err) => console.error(`${nickname} encountered an error: ${err}`));

  bot.on("end", () => {
    if (!autoRec) console.log(`${nickname} - Leaved...`);
    else {
      console.log(`${nickname} - Reconnection...`);
      createBot(nickname, portal);
    }
  });

  bot.on("message", (message) => {messageHandler(message, bot)});
}


function createMultiBot(count, portal, clanBot, autoRec = false, multiSendMessage = false, nicknameLength = 8) {
  for (let i = 0; i < count; i++) {
    setTimeout( () => createBot(generateRandomString(nicknameLength), portal, false, autoRec, multiSendMessage, clanBot), 1000);
  }
}

function sendMultiMessages(botList, message) {
  for (let i = 0; i < botList.length; i++) {
    botList[i].chat(message);
  }
}


// Создание ботов
setTimeout(() => console.log(">>> "), 5000);
createMultiBot(5, "s2", true, false, false);
// setTimeout(() => console.log(">>> "), 15000);
// sendMultiMessages(botList, "!бубубубабабыабабба")
