const { HttpProxyAgent } = require("http-proxy-agent");
const mineflayer = require("mineflayer");
const readline = require("readline");
const fs = require("fs");


let blacklist = loadBlacklist();
let playerDeaths = loadDeaths()
const shameBoard = [
  "forltop_W",
  ".",
  ".",
  ".",
  ".",
]
const adMsgs = [
  "!&fПривет, друг! Хочешь побывать в &cклане&f, где была великая история? Тогда тебе сюда -> &c/warp CH&f ! У нас есть: &bтоповый кит для пвп&f, &eхороший кх &fи многое другое! Чего же ты ждёшь? &d&nПрисоединяйся к нам!",
  "!&fПриветик! Хочешь с &dкайфом &fпровести время, но не знаешь как? Тогда тебе подойдёт &cклан &4&lChert&0&lHouse &f! У нас ты найдёшь &eхороший кх&f, &bтоповый кит &fи &nуважение клана&f. Чтоб вступить в клан пиши &c/warp CH",
  "!&fХочешь в &dкрутой клан &fс многими &eплюшками? Тогда тебе нужен клан &4&lChert&0&lHouse&fl ! У нас ты не только найдёшь &bтоповый кит для пвп&f и&e хороший кх&f, но и дс сервер! А так же у нас открыт набор на модераторов! &c/warp CH",
  "!&fИщешь &aотличный клан &fс &eкрутыми возможностями&f? Тогда тебе подходит клан &4&lChert&0&lHouse &f! &bТоповый кит&f, &6функциональный бот&f, всё это ты найдёшь на &c/warp ch&f . Заинтересовало? Ждём именно тебя!",
  "!&eТоповый кх&f, &bахеренный кит&f, &6функциональный бот&f, всё это есть в клане &4&lChetrt&0&lHouse&f! Ощути весь кайф в &cнашем клане&f, побывай в нашем &aдс сервере &fи не только! Просто напиши в лс боту #invite ! &7(/warp ch)",
];
const unterMsgs = {
  "afterdark": "/cc А вы знали, что афтердарк - хуйня? Глава у них школьник, который сосет хуй, а также персонал у них полная хуйня. Если вы не хотите быть хуеглотом, то смело оставайтесь у нас и получайте нашу поддержку.",
  "wortex": "/cc А вы знали, что клан вортекс - сборище даунов? Глава у них нихуя не умеет,  а их уебанские игроки готовы отсосать за клан). Не будь как они, будь как мы (самыми крутыми)!",
  "goldlight": "/cc А вы знали, что GoldLight - клан хохлов? Глава у них каждый день на киеве глотает бомбы и ракеты в ротик, а люди из их клана готовы ебаться за афтердарк))). Не будь салом, стань ёбырём (как наш клан).",
  "blyyeti": "/cc А вы знали, что клан BlyYety - клан одних хелперов с ебучими правами? Глава у них сосал хуй у всех кланов, менендес хавал хуи на каждом шагу, а Rooli шлюха, которая готова отсосать у соника. Не будь как они, оставайся у нас и всё будет заебись!",
  "hellteam": "/cc А вы знали, что клан HellTeam - клан ебанных лицемерских пидоров, которые затерялись где то на дне альфы. А еще вы знали то, что глава их пиздабол и думает то, что он топ 1 с читами. Не будь пидорасами как они будь крутыми как мы)",
  "kristl": "/cc А вы знали, что клан KRISTL - клан ублюдков? Глава у них школьник, которому 12 лет, а их мелкие ебанаты готовы отсосать за клан)) Кристл настолько скатились, что даже на альфе не могут топ 1 занять) Не будь уебаном, будь сигмой как мы!",
}
const commandsMsgs = {
  "commandList": "/cc &eСписок доступных команд&f - #Команды , #ЧёрныйСписок , #ФункцииБота , #Союзы , #Враги , #ДоскаПозора , #СписокБотов , #ВерсииБота. &bКоманды писать в клан чат.&f",
  "botList": "/cc &c1&f. &bKemper1ng&f. &32&f. &bAntiKemper1ng&f. &a3&f. &2Alfhelm&f. &64&f. &eVectorKemper1ng&f. &d5&f. &1SCPbotSH&f. &26&f. &3QuaKemper1ng&f. &97&f. &cNeoKemper1ng&f. &58&f. Temper1ng.",
  "allies": "/cc &fНаши союзы на &cданный момент&f: &1PEPSICO&f , &eLaEspada &f.",
  "enemies": "/cc &fНаши &cвраги&f: У нас нет врагов! ",
  "functions": "/cc &aФункции&f нашего бота: &cАнтиТп&f, &bПриглашение в клан&f, &eАнти Слив КДР&f , &dРеклама в чате &f, &3АвтоРекконект &f(каждый час), &0Чёрный Список&f, &eЗащита от фризтрола&f, &aЗащита от убийств и эффектов&f, &lКоманды в клан чате &f.",
  "shame": `/cc 1. - ${shameBoard[0]} 2. - ${shameBoard[1]} 3. - ${shameBoard[2]} 4. - ${shameBoard[3]} 5. - ${shameBoard[4]}`,
  "blacklist": `/cc &fЧёрный список: 1. ${blacklist[blacklist.length-1]} 2. ${blacklist[blacklist.length-2]} 3. ${blacklist[blacklist.length-3]} 4. ${blacklist[blacklist.length-4]} 5. ${blacklist[blacklist.length-5]} 6. ${blacklist[blacklist.length-6]} 7. ${blacklist[blacklist.length-7]} 8. ${blacklist[blacklist.length-8]}`,
  "discord": "/cc &fХочешь быть всегда в курсе что и где происходит в клане? Тогда тебе нужен наш &cклановый дискорд сервер&f! У нас есть новости, наборы, ивенты и тд! Заинтересовало? Пиши мне - kotik16f",
  "versions": {
    "1": "/cc Alpha 0.01 - Добавлены функции Инвайта в клан, Пиар, Заход на сервер и прочие базовые функции. Alpha 0.02 - Добавлена функция AntiTp. Alpha 0.03 - Добавлен второй бот.",
    "2": "/cc Beta 0.1 - Добавлен третий бот Alfhelm. Beta 0.2 - Добавлен прокси, Добавлен черный список. Beta 0.5 - Добавлена оптимизация на АнтиТп, добавлены все боты.",
    "3": "/cc Beta 0.6 - Ответ на плевок. Beta 0.7 - Небольшие изменения. Beta 0.8 - обновлен черный список, ClanLog, смерти. Beta 0.9 - небольшие изменения. Release 1.0 - Добавлена анти-трапка.",
    "4": "/cc Release 1.1 - Исправлено множество ошибок, а также прочие небольшие изменения.",
  }
}
const defPassword = "!afterHuila00pidor3svocvoRus";
const allBotWarp = "n930gkh1r";

// Функция для сохранения данных в черный список
function saveBlacklist(blacklist) {
  const text = blacklist.join("\n");
  blacklist.sort(() => Math.random() - 0.5);
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
  if (playerDeaths[nickname] == null) playerDeaths[nickname] = 0;
  playerDeaths[nickname] += 1;
}

// Функция для записи логов в файл
function writeLog(text, path) {
  const date = new Date().toLocaleString();
  const logText = `${date}: ${text}\n`;
  fs.appendFile(`logs/${path}`, logText, (err) => { if (err) console.error(err) });
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
  const randomIndex = getRandomNumber(0, proxies.length - 1)
  return proxies[randomIndex];
}

// Функция для логина и захода в портал при спавне бота
function handleSpawn(bot, portal, password) {
  sendMsg(bot,`/reg ${password}`);
  sendMsg(bot,`/login ${password}`);
  sendMsg(bot,`/${portal}`);
  console.log(`${bot.username} has spawned`);
}

// Функция для приглашения ближайшего игрока в клан
function invitePlayers(bot) {
  setInterval(() => {
      const closestPlayer = bot.nearestEntity(entity => entity.type === "player");
      if (closestPlayer && (!blacklist.includes(closestPlayer.username || !blacklist.includes(closestPlayer.username.toLowerCase())))) sendMsg(bot, `/c invite ${closestPlayer.username}`);
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
    sendMsg(bot,"/tptoggle disable");
    // try {
    //   const promise = bot.creative.clearSlot(36);
    //   promise.then(() => { console.log("Cleared!") });
    // } catch (error) { console.log("Not cleared! ") }
    sendMsg(bot, adMsgs[getRandomNumber(0, adMsgs.length - 1)]);
  }, getRandomNumber(2.5*60*1000, 3*60*1000));
  setInterval(() => sendMsg(bot, commandsMsgs["discord"]), getRandomNumber(60*1000, 2*60*1000));
}

// Функция с прочими циклами бота
function otherBotLoops(bot, warp, chatWriting) {
  setInterval(() => bot.end("Restart"), 60 * 60 * 1000);  // Рестарт бота раз в час
  setInterval(() => tpWarp(bot, warp), 10 * 60 * 1000);  // Телепорт бота раз в 10 минут
  setInterval(() => sendMsg(bot, "/heal"), 65 * 1000);  // Хил бота раз в 10 минут
  if (chatWriting) consoleEnter(bot);  // Активация консоли если нужно
}

// Функция, чтоб получить ближайшего игрока
function getNearestPlayer(bot) {
  return bot.nearestEntity(entity => entity.type === "player");
}

// Функция чтобы бот смотрел на ближайшего игрока
function lookAtNearestPlayer(bot, closestPlayer = getNearestPlayer(bot)) {
  if (closestPlayer) {
    const lookPosition = closestPlayer.position.offset(0, 1.6, 0);
    bot.lookAt(lookPosition);
  }
}

// Функция для очистки консоли с определенным интервалом
function clearConsole(interval) {
  setInterval(() => console.clear(), interval*1000)
}

// Основные циклы для бота
function mainBotLoops(bot, warp, chatWriting) {
  invitePlayers(bot);
  lookAtEntities(bot);
  otherBotLoops(bot, warp, chatWriting);
  setSkin(bot, "SadLyric111");
  sendMsg(bot, "/kiss confirm off")
  sendAdvertisements(bot);
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
function reconnectBot(nickname, portal, warp, reason) {
  console.log(`${nickname} - Reconnection... (${reason})`);
  createBot(nickname, portal, warp);
}

// Функция для установки скина
function setSkin(bot, skinName) {
  sendMsg(bot, `/skin ${skinName}`);
}

// Функция для работы с сообщениями
function messagesMonitoring(message, bot, warp) {
  const fullMessage = extractTextFromChatMessage(message);
  if (fullMessage.includes("Перемещение на")) tpWarp(warp);
  const textMessage = message.getText();
  const lowTextMessage = textMessage.toLowerCase();

  // console.log(textMessage);  // Парсинг чата для дебага

  const matchLeave = textMessage.match(/› (.*?) покинул клан\./);
  const matchJoin = textMessage.match(/› (.*?) присоеденился к клану\./);
  const matchKdr = textMessage.match(/игрока\s*(.*)/);
  const matchInvite = textMessage.match(/›\[(.*?) ->/);

  if (matchJoin && matchJoin[1]) {
    const newMember = matchJoin[1];
    if (playerDeaths[newMember]) playerDeaths[newMember] = 0;
    sendMsg(bot, `/cc Добро пожаловать в клан, ${newMember}! Обязательно вступи в наш дискорд, там много всего интересного! Если хочешь вступить в наш дискорд сервер, то пиши мне - kotik16f`);
  }

  else if (matchLeave && matchLeave[1]) {
    const leaveMember = matchLeave[1];
    sendMsg(bot, `/cc ${leaveMember} выходит из клана, ОБОССАТЬ И НА МОРОЗ!`);
  }

  else if (matchInvite && matchInvite[1] && lowTextMessage.includes("#invite")) {
    const invitePlayer = matchInvite[1];
    sendMsg(bot, `/c invite ${invitePlayer}`);
  }

  else if (matchKdr && matchKdr[1]) {
    let killedPlayer = matchKdr[1];

    countDie(killedPlayer);
    const deathsCount = playerDeaths[killedPlayer]
    if (deathsCount > 4) {
      sendMsg(bot,`/c kick ${killedPlayer}`);
      blacklist.push(killedPlayer);
      saveBlacklist(blacklist);
    }
    saveDeaths();
  }

  if (fullMessage === "Пожайлуста прекратите читерить или вы будете забанены!") bot.end();
  if (lowTextMessage.startsWith("клан:")) {
    if (lowTextMessage.includes("afterdar")) sendMsg(bot, unterMsgs["afterdark"]);
    else if (lowTextMessage.includes("worte")) sendMsg(bot, unterMsgs["wortex"]);
    else if (lowTextMessage.includes("goldligh")) sendMsg(bot, unterMsgs["goldlight"]);
    else if (lowTextMessage.includes("blyyet")) sendMsg(bot, unterMsgs["blyyeti"]);
    else if (lowTextMessage.includes("helltea")) sendMsg(bot, unterMsgs["hellteam"]);
    else if (lowTextMessage.includes("krist")) sendMsg(bot, unterMsgs["kristl"]);

    if (lowTextMessage.includes(("#команд"))) sendMsg(bot, commandsMsgs["commandList"]);
    else if (lowTextMessage.includes(("#списокбото"))) sendMsg(bot, commandsMsgs["botList"]);
    else if (lowTextMessage.includes(("#союз"))) sendMsg(bot, commandsMsgs["allies"]);
    else if (lowTextMessage.includes(("#враг"))) sendMsg(bot, commandsMsgs["enemies"]);
    else if (lowTextMessage.includes(("#функци"))) sendMsg(bot, commandsMsgs["functions"]);
    else if (lowTextMessage.includes(("#доскапозор"))) sendMsg(bot, commandsMsgs["shame"]);
    else if ((lowTextMessage.includes(("#чёрныйсписо"))) || (lowTextMessage.includes(("#черныйсписо")))) sendMsg(bot, commandsMsgs["blacklist"]);
    else if (lowTextMessage.includes("#версиибота")) {
      if (lowTextMessage.includes("1")) sendMsg(bot, commandsMsgs["versions"]["1"]);
      else if (lowTextMessage.includes("2")) sendMsg(bot, commandsMsgs["versions"]["2"]);
      else if (lowTextMessage.includes("3")) sendMsg(bot, commandsMsgs["versions"]["3"]);
      else if (lowTextMessage.includes("4")) sendMsg(bot, commandsMsgs["versions"]["4"]);
    }

    writeLog(fullMessage, "ClanLog.txt");
  }

  else if (fullMessage.startsWith("[ɢ]")) writeLog(fullMessage, "GlobalLog.txt");
  else if (fullMessage.startsWith("[ʟ]")) writeLog(fullMessage, "LocalLog.txt");
}

// Функция для создания бота
function createBot(nickname, portal, warp = allBotWarp, chatWriting = false, password = defPassword, host = "mc.masedworld.net", port = 25565, auth = "offline") {
  const proxy = getRandomProxy();
  const agent = new HttpProxyAgent(`http://${proxy}`);
  const bot = mineflayer.createBot({
    host: host,
    port: port,
    username: nickname,
    agent: agent,
    auth: auth,
  });

  bot.once("spawn", () => mainBotLoops(bot, warp, chatWriting));

  bot.on("spawn", () => handleSpawn(bot, portal, password));
  bot.on("message", (message) => messagesMonitoring(message, bot, warp));
  bot.on("forcedMove", () => tpWarp(bot, warp));
  bot.on("error", (err) => bot.end(`An error has occurred ${err}`));
  bot.on("end", (reason) => reconnectBot(nickname, portal, warp, reason));
}

clearConsole(10*60);
// Создание ботов
//
createBot("VectorKemper1ng", "s1");
createBot("Kemper1ng", "s2");
//createBot("NeoKemper1ng", "s3");
createBot("SCPbotSH", "s4");
createBot("Alfhelm", "s5");
createBot("QuaKemper1ng", "s6");
// createBot("AntiKemper1ng", "s7");  // Бан на 3 дня до 1 октября
createBot("Temper1ng", "s8");
