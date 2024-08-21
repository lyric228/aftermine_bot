const { HttpProxyAgent } = require("http-proxy-agent");
const mineflayer = require("mineflayer");
const readline = require("readline");
const fs = require("fs");


const adMsgs = [
  "!&c&lПривет, друг! Хочешь побывать в клане, где была великая история? Тогда тебе сюда -> /warp CH или /warp ChertHouse ! У нас есть: топовый кит для пвп, хороший кх и многое другое! Чего же ты ждёшь? Присоединяйся к нам!",
  "!&c&lПриветик! Хочешь с кайфом провести время, но не знаешь как? Тогда тебе подойдёт клан &4&lChert&0&lHouse &c&l! У нас ты найдёшь хороший кх, топовый кит и уважение клана. Чтоб вступить в клан пиши /warp CH или /warp ChertHouse",
  "!&c&lХочешь в крутой клан с многими плюшками? Тогда тебе нужен клан &4&lChert&0&lHouse&c&l ! У нас ты не только найдёшь топовый кит для пвп и хороший кх, но и дс сервер! А так же у нас открыт набор на модераторов! /warp CH или /warp ChertHouse"
];
const unterMsg = "/cc А вы знали, что афтердарк - хуйня? Глава у них школьник, который сосет хуй, а также персонал у них полная хуйня. Если вы не хотите быть хуеглотом, то смело оставайтесь у нас и получайте нашу поддержку.";
const defPassword = "!afterHuila00pidor3svocvoRus";
const allBotWarp = "nf9akf30k";
let blacklist = loadBlacklist();
let playerDeaths = loadDeaths()

// Функция для сохранения данных в черный список
function saveBlacklist(blacklist) {
  const text = blacklist.join("\n");
  fs.writeFileSync("blacklist.txt", text);
}

// Функция для загрузки данных из черного списка
function loadBlacklist() {
  try {
    const text = fs.readFileSync("blacklist.txt", "utf8");
    return text.split("\n");
  } catch (err) {
    if (err.code === "ENOENT") return [];
  }
}


// Функция для сохранения данных о смертях
function saveDeaths() {
  const jsonString = JSON.stringify(playerDeaths);
  fs.writeFileSync("deaths.json", jsonString);
}

// Функция для загрузки данных о смертях
function loadDeaths() {
  try {
    const jsonString = fs.readFileSync("deaths.json", "utf8");
    return JSON.parse(jsonString);
  } catch (err) {
    if (err.code === "ENOENT") return {};
  }
}

// Функция для изменения смертей по нику
function countDie(nickname) {
  if (playerDeaths[nickname] == null) {
    playerDeaths[nickname] = 0;
  }
  playerDeaths[nickname] += 1;
}

// Функция для записи логов клана в файл
function writeClanLog(text) {
  const date = new Date().toLocaleString();
  const logText = `${date}: ${text}\n`;
  fs.appendFile("ClanLog.txt", logText, (err) => {
    if (err) console.error(err);
  });
}

// Функция для генерации рандомного числа
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Функция для отправки сообщений в чат через консоль от лица бота
function consoleEnter(bot) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.setPrompt(">>> ");
  rl.prompt();
  rl.on("line", (input) => {
    bot._client.chat(input);
    rl.prompt();
  }).on("close", () => {
    console.log("Bye!");
    process.exit(0);
});
}

// Функция для форматирования текста из объекта ChatMessage в более удобный и читаемый вид
function extractTextFromChatMessage(chatMessage) {
  if (typeof chatMessage === "string") return chatMessage;

  return chatMessage.extra
    ? chatMessage.extra.map(extractTextFromChatMessage).join("")
    : chatMessage.text || "";
}

// Функция для получения случайного прокси из файла
function getRandomProxy() {
  const proxies = fs.readFileSync("./proxies.txt", "utf-8").split('\n').filter(line => line.trim() !== "");
  const randomIndex = getRandomNumber(0, adMsgs.length - 1)
  return proxies[randomIndex];
}

// Функция для логина и захода в портал при спавне бота
function handleSpawn(bot, portal, password) {
  setTimeout(() => {
    bot._client.chat(`/reg ${password}`);
    bot._client.chat(`/login ${password}`);
  }, 2000);

  setTimeout(() => {
    bot._client.chat(`/${portal}`);
  }, 2000);

  console.log(`${bot.username} has spawned`);
}

// Функция для приглашения ближайшего игрока в клан
function invitePlayers(bot) {
  setInterval(() => {
    try {
      const closestPlayer = bot.nearestEntity(entity => entity.type === "player");
      if (closestPlayer && !blacklist.includes(closestPlayer.username)) {
        bot._client.chat(`/c invite ${closestPlayer.username}`);
      }
    } catch (error) {
      bot.end("An error has occurred");
      console.log(error);
    }

  }, getRandomNumber(1000, 15000));
}

// Функция чтобы бот смотрел на ближайшего игрока
function lookAtEntities(bot) {
  setInterval(() => {
    const closestPlayer = bot.nearestEntity(entity => entity.type === "player");
    if (closestPlayer) {
      let lookPosition = closestPlayer.position.offset(0, 1.6, 0);
      bot.lookAt(lookPosition);
    }
  }, 100);
}

// Функция для рассылки рандомного сообщения рекламы клана в глобальный чат
function sendAdvertisements(bot) {
  setInterval(() => {
    bot._client.chat("/gm 1");
    bot._client.chat("/heal");
    bot.unequip("head");
    bot._client.chat("/clear");
    bot._client.chat(adMsgs[getRandomNumber(0, adMsgs.length - 1)]);

  }, getRandomNumber(2.5*60*1000, 3*60*1000));
}

// Функция с прочими циклами бота
function otherBotLoops(bot, warp, chatWriting) {
  setInterval(() =>  bot.end(), 60 * 60 * 1000);  // Рестарт бота раз в 1 час
  setInterval(() =>  bot._client.chat(`/warp ${warp}`), 3 * 60 * 1000);
  if (chatWriting) consoleEnter(bot);
}

// Функция для переподключения бота на сервер
function reconnectBot(nickname, portal, warp) {
  console.log(`${nickname} - Reconnection...`);
  createBot(nickname, portal, warp);
}

function setSkin(bot, skinName) {
  bot._client.chat(`/skin ${skinName}`);
}

// Функция для работы с сообщениями
function messagesMonitoring(message, bot) {
  let fullMessage = extractTextFromChatMessage(message);

  // console.log(fullMessage);  // Парсинг чата для дебага

  const matchLeave = fullMessage.match(/› (.*?) покинул клан\./);
  const matchJoin = fullMessage.match(/› (.*?) присоеденился к клану\./);
  const matchKdr = fullMessage.match(/игрока\s*(.*)/);


  if (matchJoin && matchJoin[1]) {
    const new_member = matchJoin[1];
    if (playerDeaths[new_member]) playerDeaths[new_member] = 0;
    bot._client.chat(`/cc Добро пожаловать в клан, ${new_member}! Обязательно вступи в наш дискорд, там много всего интересного! Ссылка на дискорд находится в /c infо`);
  }

  if (matchLeave && matchLeave[1]) {
    const leave_member = matchLeave[1];
    bot._client.chat(`/cc ${leave_member} выходит из клана, на штык его!`);
  }

  if (matchKdr && matchKdr[1]) {
    let killedPlayer = matchKdr[1];

    countDie(killedPlayer);
    const deathsCount = playerDeaths[killedPlayer]
    if (deathsCount >= 5) {
      bot._client.chat(`/c kick ${killedPlayer}`);
      blacklist.push(killedPlayer);
      saveBlacklist(blacklist);
    }
    saveDeaths();
  }

  if (fullMessage === "Пожайлуста прекратите читерить или вы будете забанены!") bot.end();
  if (fullMessage.startsWith("КЛАН:")) {
    if (fullMessage.includes(": afterdark")) bot._client.chat(unterMsg);
    writeClanLog(fullMessage);
  }
}

// Функция для создания бота
function createBot(nickname, portal, warp = allBotWarp, chatWriting = false, password = defPassword, host = "mc.masedworld.net", port = 25565) {
  const proxy = getRandomProxy();
  const agent = new HttpProxyAgent(`http://${proxy}`);
  const bot = mineflayer.createBot({
    host: host,
    port: port,
    username: nickname,
    agent: agent,
  });

  setInterval(() =>  bot.end(), 60 * 60 * 1000);  // Рестарт бота раз в 1 час
  setInterval(() =>  bot._client.chat(`/warp ${warp}`), 3 * 60 * 1000);
  if (chatWriting) consoleEnter(bot);

  bot.once("spawn", () => {
    invitePlayers(bot);
    lookAtEntities(bot);
    sendAdvertisements(bot);
    otherBotLoops(bot, warp, chatWriting);
    setSkin(bot, "0_Define_0");
  });

  bot.on("spawn", () => handleSpawn(bot, portal, password));
  bot.on("message", (message) => { messagesMonitoring(message, bot); });
  bot.on("forcedMove", () => bot._client.chat(`/warp ${warp}`));
  bot.on("error", (err) => bot.end(`An error has occurred ${err}`));
  bot.on("end", () => reconnectBot(nickname, portal, warp));
}

// Создание ботов
// createBot("AntiKemper1ng", "s7");
createBot("Kemper1ng", "s2");
// createBot("SCPbotSH", "s3");
// createBot("Alfhelm", "s5");
