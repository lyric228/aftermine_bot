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
  const proxies = fs.readFileSync("./proxies.txt", "utf-8").split("\n").filter(line => line.trim() !== "");
  const randomIndex = getRandomNumber(0, adMsgs.length - 1)
  return proxies[randomIndex];
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

// Функция для приглашения ближайшего игрока в клан
function invitePlayers(bot) {
  setInterval(() => {
      const closestPlayer = bot.nearestEntity(entity => entity.type === "player");
      if (closestPlayer && !blacklist.includes(closestPlayer.username)) sendMsg(bot, `/c invite ${closestPlayer.username}`);
  }, getRandomNumber(1000, 15000));
}

// Функция чтобы бот смотрел на ближайшего игрока
function lookAtEntities(bot) {
  setInterval(() => lookAtNearestPlayer(bot), 100);
}

// Функция для рассылки рандомного сообщения рекламы клана в глобальный чат
function sendAdvertisements(bot) {
  setInterval(() => {
    sendMsg(bot,"/gm 1");
    sendMsg(bot,"/heal");
    // bot.unequip("head");
    sendMsg(bot,"/tptoggle disable");
    sendMsg(bot,"/clear");
    sendMsg(bot,adMsgs[getRandomNumber(0, adMsgs.length - 1)]);

  }, getRandomNumber(2.5*60*1000, 3*60*1000));
}

// Функция с прочими циклами бота
function otherBotLoops(bot, warp, chatWriting) {
  setInterval(() => bot.end("Restart"), 60 * 60 * 1000);  // Рестарт бота раз в час
  setInterval(() => tpWarp(bot, warp), 3 * 60 * 1000);  // Автотп на варп раз в 3 минуты
  // setInterval(() => sendMsg(bot, `/kiss ${getNearestPlayer(bot).username}`), 15 * 60 * 1000);  // Рандомные поцелуи ближайшему игроку раз в 15 минуты
  if (chatWriting) consoleEnter(bot);  // Активация консоли если нужно
}

// Функция, чтоб получить ближайшего игрока
function getNearestPlayer(bot) {
  return bot.nearestEntity(entity => entity.type === "player");
}

function lookAtNearestPlayer(bot, closestPlayer = getNearestPlayer(bot)) {
  if (closestPlayer) {
    const lookPosition = closestPlayer.position.offset(0, 1.6, 0);
    bot.lookAt(lookPosition);
  }
}

// Функция для отправки сообщений с try/catch
function sendMsg(bot, msg) {
  try {
    bot._client.chat(msg);
  } catch (error) {
    console.log("Error!");
  }
}

// Функция для телепортации на варп с try/catch
function tpWarp(bot, warp) {
  try {
      sendMsg(bot, `/warp ${warp}`);
  } catch (error) {
      bot.end("An error has occurred");
  }
}

// Функция для переподключения бота на сервер
function reconnectBot(nickname, portal, warp) {
  console.log(`${nickname} - Reconnection...`);
  createBot(nickname, portal, warp);
}

// Функция для установки скина
function setSkin(bot, skinName) {
  sendMsg(bot, `/skin ${skinName}`);
}

// Функция для работы с сообщениями
function messagesMonitoring(message, bot) {
  let fullMessage = extractTextFromChatMessage(message);

  // console.log(fullMessage);  // Парсинг чата для дебага

  const matchLeave = fullMessage.match(/› (.*?) покинул клан\./);
  const matchJoin = fullMessage.match(/› (.*?) присоеденился к клану\./);
  const matchKdr = fullMessage.match(/игрока\s*(.*)/);

  if (matchJoin && matchJoin[1]) {
    const newMember = matchJoin[1];
    if (playerDeaths[newMember]) playerDeaths[newMember] = 0;
    sendMsg(bot, `/cc Добро пожаловать в клан, ${newMember}! Обязательно вступи в наш дискорд, там много всего интересного! Вот ссылка на дискорд: https://discord.gg/SnjzDQfYZX`);
  }

  if (matchLeave && matchLeave[1]) {
    const leaveMember = matchLeave[1];
    sendMsg(bot, `/cc ${leaveMember} выходит из клана, на штык егo!`);
  }

  if (matchKdr && matchKdr[1]) {
    let killedPlayer = matchKdr[1];

    countDie(killedPlayer);
    const deathsCount = playerDeaths[killedPlayer]
    if (deathsCount >= 5) {
      sendMsg(bot,`/c kick ${killedPlayer}`);
      blacklist.push(killedPlayer);
      saveBlacklist(blacklist);
    }
    saveDeaths();
  }

  if (fullMessage.startsWith("› В вас плюнул") || fullMessage.startsWith("› В вас смачно плюнул")) sendMsg(bot, "/spit");
  if (fullMessage === "Пожайлуста прекратите читерить или вы будете забанены!") bot.end();
  if (fullMessage.startsWith("КЛАН:")) {
    if (fullMessage.includes(": afterdark")) sendMsg(bot, unterMsg);
    writeClanLog(fullMessage);
  }
}

// Функция для создания бота
function createBot(nickname, portal, chatWriting = false, warp = allBotWarp, password = defPassword, host = "mc.masedworld.net", port = 25565) {
  const proxy = getRandomProxy();
  const agent = new HttpProxyAgent(`http://${proxy}`);
  const bot = mineflayer.createBot({
    host: host,
    port: port,
    username: nickname,
    agent: agent,
  });

  bot.once("spawn", () => {
    invitePlayers(bot);
    lookAtEntities(bot);
    sendAdvertisements(bot);
    otherBotLoops(bot, warp, chatWriting);
    setSkin(bot, "0_Define_0");
    sendMsg(bot, "/kiss confirm off")
  });

  bot.on("spawn", () => handleSpawn(bot, portal, password));
  bot.on("message", (message) => messagesMonitoring(message, bot));
  bot.on("forcedMove", () => tpWarp(bot, warp));
  bot.on("error", (err) => bot.end(`An error has occurred ${err}`));
  bot.on("end", () => reconnectBot(nickname, portal, warp));
}

// Создание ботов
createBot("AntiKemper1ng", "s7");
createBot("Kemper1ng", "s2");
//createBot("SCPbotSH", "s3");
//createBot("Alfhelm", "s5");
//