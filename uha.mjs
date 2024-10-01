import { readFileSync, writeFileSync, appendFile } from "fs";
import { HttpProxyAgent } from "http-proxy-agent";
import { createInterface } from "readline";
import { createBot } from "mineflayer";


let blacklist = loadBlacklist();
let playerDeaths = loadDeaths()
const shameBoard = [
  "forltop_W",
  ".",
  ".",
  ".",
  ".",
]
const adMsg = "!&fПрисоединяйтесь к клану &d&luUha! &fМы - &aдружная &fи &dотзывчивая &fкоманда, готовая помочь вам в любой &2проблеме! &fУ нас есть &1сильные &fи &eопытные &fигроки, планирующие победить всех врагов и добраться до самых вершин в &6PvP. &d&l/warp uUha";
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
  "allies": "/cc &fНаши союзы на &cданный момент&f: &1PEPSICO&f , &eLaEspada &f.",
  "enemies": "/cc &fНаши &cвраги&f: У нас нет врагов! ",
  "functions": "/cc &aФункции&f нашего бота: &cАнтиТп&f, &bПриглашение в клан&f, &eАнти Слив КДР&f , &dРеклама в чате &f, &3АвтоРекконект &f(каждый час), &0Чёрный Список&f, &eЗащита от фризтрола&f, &aЗащита от убийств и эффектов&f, &lКоманды в клан чате &f.",
  "shame": `/cc 1. - ${shameBoard[0]} 2. - ${shameBoard[1]} 3. - ${shameBoard[2]} 4. - ${shameBoard[3]} 5. - ${shameBoard[4]}`,
  "blacklist": `/cc &fЧёрный список: 1. ${blacklist[blacklist.length-1]} 2. ${blacklist[blacklist.length-2]} 3. ${blacklist[blacklist.length-3]} 4. ${blacklist[blacklist.length-4]} 5. ${blacklist[blacklist.length-5]} 6. ${blacklist[blacklist.length-6]} 7. ${blacklist[blacklist.length-7]} 8. ${blacklist[blacklist.length-8]}`,
  "versions": {
    "1": "/cc Alpha 0.01 - Добавлены функции Инвайта в клан, Пиар, Заход на сервер и прочие базовые функции. Alpha 0.02 - Добавлена функция AntiTp. Alpha 0.03 - Добавлен второй бот.",
    "2": "/cc Beta 0.1 - Добавлен третий бот Alfhelm. Beta 0.2 - Добавлен прокси, Добавлен черный список. Beta 0.5 - Добавлена оптимизация на АнтиТп, добавлены все боты.",
    "3": "/cc Beta 0.6 - Ответ на плевок. Beta 0.7 - Небольшие изменения. Beta 0.8 - обновлен черный список, ClanLog, смерти. Beta 0.9 - небольшие изменения. Release 1.0 - Добавлена анти-трапка.",
    "4": "/cc Release 1.1 - Исправлено множество ошибок, а также прочие небольшие изменения.",
  }
}

// Функция для сохранения данных в черный список
function saveBlacklist(blacklist) {
  const text = blacklist.join("\n");
  blacklist.sort(() => Math.random() - 0.5);
  writeFileSync("blacklist.txt", text);
}

// Функция для загрузки данных из черного списка
function loadBlacklist() {
  try {
    const text = readFileSync("blacklist.txt", "utf8");
    return text.split("\n");
  } catch (err) {
    if (err.code === "ENOENT") return [];
  }
}

// Функция для сохранения данных о смертях
function saveDeaths() {
  const jsonString = JSON.stringify(playerDeaths);
  writeFileSync("deaths.json", jsonString);
}

// Функция для загрузки данных о смертях
function loadDeaths() {
  try {
    const jsonString = readFileSync("deaths.json", "utf8");
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
  appendFile(`UuhaLogs/${path}`, logText, (err) => { if (err) console.error(err) });
}

// Функция для генерации рандомного числа
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Функция для отправки сообщений в чат через консоль от лица бота
function consoleEnter(bot) {
  const rl = createInterface({
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
  const proxies = readFileSync("./proxies.txt", "utf-8").split("\n").filter(line => line.trim() !== "");
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
    sendMsg(bot, adMsg);
  }, getRandomNumber(2.5*60*1000, 3*60*1000));
}

// Функция с прочими циклами бота
function otherBotLoops(bot, warp, chatWriting) {
  setInterval(() => bot.end("Restart"), 60 * 60 * 1000);  // Рестарт бота раз в час
  setInterval(() => tpWarp(bot, warp), 10 * 60 * 1000);  // Телепорт бота раз в 10 минут
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
  createBotUha(nickname, portal, warp);
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

  // if (fullMessage.startsWith("› В вас плюнул") || fullMessage.startsWith("› В вас смачно плюнул")) sendMsg(bot, "/spit");
  if (fullMessage === "Пожайлуста прекратите читерить или вы будете забанены!") bot.end();
  if (lowTextMessage.startsWith("клан:")) {
    if (lowTextMessage.includes("afterdar")) sendMsg(bot, unterMsgs["afterdark"]);
    else if (lowTextMessage.includes("worte")) sendMsg(bot, unterMsgs["wortex"]);
    else if (lowTextMessage.includes("goldligh")) sendMsg(bot, unterMsgs["goldlight"]);
    else if (lowTextMessage.includes("blyyet")) sendMsg(bot, unterMsgs["blyyeti"]);
    else if (lowTextMessage.includes("helltea")) sendMsg(bot, unterMsgs["hellteam"]);
    else if (lowTextMessage.includes("krist")) sendMsg(bot, unterMsgs["kristl"]);

    if (lowTextMessage.includes(("#команд"))) sendMsg(bot, commandsMsgs["commandList"]);
    else if (lowTextMessage.includes(("#союз"))) sendMsg(bot, commandsMsgs["allies"]);
    else if (lowTextMessage.includes(("#враг"))) sendMsg(bot, commandsMsgs["enemies"]);
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
  else if (fullMessage.startsWith("[ʟ]")) writeLog(fullMessage, "LocalLog.txt");
}

// Функция для создания бота
export function createBotUha(nickname, portal, warp, chatWriting = false, password, host = "mc.masedworld.net", port = 25565, auth = "offline") {
  const proxy = getRandomProxy();
  const agent = new HttpProxyAgent(`http://${proxy}`);
  const bot = createBot({
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
