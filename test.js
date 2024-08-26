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
    sendMsg(bot, input);
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
    sendMsg(bot, `/reg ${password}`);
    sendMsg(bot, `/login ${password}`);
  }, 1000);

  setTimeout(() => {
    sendMsg(bot, `/${portal}`);
  }, 2000);

  console.log(`${bot.username} has spawned`);
  sendMsg(bot, "/warp kristltrap")  // Авто возвращение на варп при смерти
}


function clanAccept(bot) {
  setInterval(() => {
    sendMsg(bot, "/c accept");
    sendMsg(bot, "/warp kristltrap");
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
  console.log(extractedText);  // Парсинг чата для дебага

  if (extractedText.includes(`› ${bot.username} присоеденился к клану.`)) bot.end();
}

function sendMsg(bot, msg) {
  try {
    bot.chat(msg);
  } catch (error) {
    console.log("Error!");
  }
}


function createBot(nickname, portal, chatWriting = false, autoRec = true, listBot = false, clanBot = true, tpWarp ="kristltrap") {
  let deaths = 0;
  let cname = generateRandomString(5);
  const proxy = getRandomProxy();
  const agent = new HttpProxyAgent(`http://${proxy}`);
  const password = generateRandomString(10);

  const bot = mineflayer.createBot({
    host: "mc.masedworld.net",
    port: 25565,
    username: nickname,
    agent: agent,
  });
  if (chatWriting) consoleEnter(bot);
  if (listBot) botList.push(bot);
  if (clanBot) clanAccept(bot);
  sendMsg(bot, `/c create ${cname}`)

  setInterval(() => {
    if (deaths >= 10) {
      setTimeout(() => sendMsg(bot, `/c create ${cname}`), 300);
      deaths = 0;
    }
  }, 300);
  setInterval(() => sendMsg(bot ,"/warp kristltrap"), 5000)

  bot.on("spawn", () => {
    deaths += 1
    handleSpawn(bot, portal, password);
    sendMsg(bot, `/warp kristltrap`);
  });

  bot.on("error", (err) => console.error(`${nickname} encountered an error: ${err}`));

  bot.on("end", () => createBot(nickname, portal));

  //bot.on("message", (message) => messageHandler(message, bot));
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
createBot("kristlsos11", "s2");
createBot("kristlsos22", "s2");
createBot("kristlsos33", "s2");
createBot("kristlsos44", "s2");
createBot("kristlsos55", "s2");
createBot("kristlsos66", "s2");
createBot("kristlsos77", "s2");
createBot("kristlsos88", "s2");
createBot("kristlsos99", "s2");
createBot("kristlsos00", "s2");
createBot("kristlsos111", "s2");
createBot("kristlsos222", "s2");
createBot("kristlsos333", "s2");
createBot("kristlsos444", "s2");
createBot("kristlsos555", "s2");
createBot("kristlsos666", "s2");
createBot("kristlsos777", "s2");
createBot("kristlsos888", "s2");
createBot("kristlsos999", "s2");
createBot("kristlsos000", "s2");
