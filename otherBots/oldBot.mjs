import {appendFile, readFileSync, writeFileSync} from "fs";
import {HttpProxyAgent} from "http-proxy-agent";
import {createInterface} from "readline";
import {totalmem, freemem} from "os";
import {createBot} from "mineflayer";
import gc from "garbage-collector";
import {Storage} from "megajs";
import {startBot} from "../index.mjs";


const storage = await new Storage({
  email: "xhikzerox@gmail.com",
  password: "yakrutoy2801"
}).ready
let blacklist = loadBlacklist();
let playerDeaths = loadDeaths()
let botList = [];
const shameBoard = [
  "pavel чото там",
  "cph4peezzz",
  "forltop_W",
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
  "allies": "/cc &fНаши союзы на &cданный момент&f: &1PEPSICO&f , &eLaEspada &f, &4афтедаркхуета&f.",
  "enemies": "/cc &fНаши &cвраги&f: У нас нет врагов! ",
  "functions": "/cc &aФункции&f нашего бота: &cАнтиТп&f, &bПриглашение в клан&f, &eАнти Слив КДР&f , &dРеклама в чате &f, &3АвтоРекконект &f(каждый час), &0Чёрный Список&f, &eЗащита от фризтрола&f, &aЗащита от убийств и эффектов&f, &lКоманды в клан чате &f.",
  "shame": `/cc 1. - ${shameBoard[0]} 2. - ${shameBoard[1]} 3. - ${shameBoard[2]} 4. - ${shameBoard[3]} 5. - ${shameBoard[4]}`,
  "blacklist": `/cc &fЧёрный список: 1. ${blacklist[blacklist.length-1]} 2. ${blacklist[blacklist.length-2]} 3. ${blacklist[blacklist.length-3]} 4. ${blacklist[blacklist.length-4]} 5. ${blacklist[blacklist.length-5]} 6. ${blacklist[blacklist.length-6]} 7. ${blacklist[blacklist.length-7]} 8. ${blacklist[blacklist.length-8]}`,
  "discord": "/cc &fХочешь быть всегда в курсе что и где происходит в клане? Тогда тебе нужен наш &cклановый дискорд сервер&f! У нас есть новости, наборы, ивенты и тд! Заинтересовало? Пиши мне - kotik16f",
  "versions": [
    "/cc Alpha 0.01 - Добавлены функции Инвайта в клан, Пиар, Заход на сервер и прочие базовые функции. Alpha 0.02 - Добавлена функция AntiTp. Alpha 0.03 - Добавлен второй бот.",
    "/cc Beta 0.1 - Добавлен третий бот Alfhelm. Beta 0.2 - Добавлен прокси, Добавлен черный список. Beta 0.5 - Добавлена оптимизация на АнтиТп, добавлены все боты.",
    "/cc Beta 0.6 - Ответ на плевок. Beta 0.7 - Небольшие изменения. Beta 0.8 - обновлен черный список, ClanLog, смерти. Beta 0.9 - небольшие изменения. Release 1.0 - Добавлена анти-трапка.",
    "/cc Release 1.1 - Исправлено множество ошибок, а также прочие небольшие изменения.",
  ]
}
const admins = [
  "zxclyric",
  "Программист zxclyric",
  "KoTiK_B_KeDaH_ ",
  "BogSupnogoDnya",
  "makleia",
  "ryfed_pc",
]
const answerMessages = {
  "afterdar": unterMsgs["afterdark"],
  "worte": unterMsgs["wortex"],
  "goldligh": unterMsgs["goldlight"],
  "blyyet": unterMsgs["blyyeti"],
  "helltea": unterMsgs["hellteam"],
  "krist": unterMsgs["kristl"],

  "#команд": commandsMsgs["commandList"],
  "#списокбот": commandsMsgs["botList"],
  "#союз": commandsMsgs["allies"],
  "#враг": commandsMsgs["enemies"],
  "#функци": commandsMsgs["functions"],
  "#доска": commandsMsgs["shame"],
  "#чёрныйспис": commandsMsgs["blacklist"],
  "#черныйспис": commandsMsgs["blacklist"],
}
const multiAnswerMessages = {
  "#версиибота": (bot, num) => sendMsg(bot, commandsMsgs["versions"][num]),
}
const adminAnswerMessages = {
  "#логи": async (bot) => {
    sendMsg(bot, "/cc Отправляю логи на сервер...");
    await uploadDataToDisk();
    sendMsg(bot, `/cc Логи отправлены на сервер!`);
  },
  "#clearchat": async (bot) => {
    setTimeout(() => sendMsg(bot, "/clearchat"), 1000);
    sendMsg(bot, "/cc Чат очищен!");
  },
  // "": () => {},
}
const defPassword = "!afterHuila00pidor3svocvoRus";
const allBotWarp = "n930gkh1r";
const allBotSkin = "zxclyric";
const allBotName = "Lyric";


// Функция для очистки оперативной памяти
function clearRam() {
  const totalMem = totalmem();
  const freeMem = freemem();
  if (freeMem / totalMem < 0.2) gc();
}

// Функция для загрузки данных в файл
async function uploadFile(name, data) {
  const file = storage.find(name);
  await file.delete(true);
  await storage.upload(name, data).complete;
}

// Функция для интервального сохранения данных
async function uploadDataToDisk() {
  const tempBlacklist = readFileSync("data/blacklist.txt", "utf-8").split("\n");
  const tempDeaths = readFileSync("data/deaths.json", "utf-8");
  await uploadFile("blacklist.txt", tempBlacklist.toString());
  await uploadFile("deaths.json", tempDeaths.toString());
  await logSave();
}

// Функция для сохранения данных логов
async function logSave() {
  const tempClanLog = readFileSync("logs/ClanLog.txt", "utf-8");
  const tempGLog = readFileSync("logs/GlobalLog.txt", "utf-8");
  const tempLLog = readFileSync("logs/LocalLog.txt", "utf-8");
  await uploadFile("ClanLog.txt", tempClanLog.toString());
  await uploadFile("GlobalLog.txt", tempGLog.toString());
  await uploadFile("LocalLog.txt", tempLLog.toString());
}

// Функция для сохранения данных в черный список
function saveBlacklist() {
  blacklist.sort(() => Math.random() - 0.5);
  writeFileSync("data/blacklist.txt", blacklist.join("\n"));
}

// Функция для загрузки данных из черного списка
function loadBlacklist() {
  try {
    const data = readFileSync("data/blacklist.txt").toString();
    return data.split("\n");
  } catch (err) { if (err.code === "ENOENT") return [] }
}

// Функция для сохранения данных о смертях
function saveDeaths() {
  const jsonString = JSON.stringify(playerDeaths);
  writeFileSync("data/deaths.json", jsonString);
}

// Функция для загрузки данных о смертях
function loadDeaths() {
  try {
    const jsonString = readFileSync("data/deaths.json");
    return JSON.parse(jsonString.toString());
  } catch (err) { if (err.code === "ENOENT") return {} }
}

// Функция для изменения смертей по нику
function countDie(nickname) {
  if (playerDeaths[nickname] == null) playerDeaths[nickname] = 0;
  playerDeaths[nickname] += 1;
}

// Функция для записи логов в файл
function writeLog(text, path, portal, bot) {
  const date = new Date().toLocaleString();
  const logText = `${bot.entity.position} [${portal}] - ${date}: ${text}\n`;
  appendFile(`logs/${path}`, logText, (err) => { if (err) console.error(err) });
}

// Функция для генерации рандомного числа
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Функция для отправки сообщений в чат через консоль от лица бота
function consoleEnter(bot, chatWriting = false) {
  if (chatWriting) {
    const rl = createInterface({
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
  const proxies = readFileSync("data/proxies.txt", "utf-8").split("\n").filter(line => line.trim() !== "");
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
      bot.entitiesArray
      if (closestPlayer && !blacklist.toString().includes(closestPlayer.username)) sendMsg(bot, `/c invite ${closestPlayer.username}`);
  }, getRandomNumber(10000, 30000));
}

// Функция для рассылки рандомного сообщения рекламы клана в глобальный чат
function sendAdvertisements(bot) {
  setInterval(() => sendMsg(bot, adMsgs[getRandomNumber(0, adMsgs.length - 1)]), getRandomNumber(2.5*60*1000, 3*60*1000));
  setInterval(() => sendMsg(bot, commandsMsgs["discord"]), getRandomNumber(60*1000, 2*60*1000));
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

// Функция для контроля урона для бота
function handleDamage(bot, warp) {
  tpWarp(bot, warp);
  setTimeout(() => sendMsg(bot, "/gm 1"), 1000);
}

// Функция для контроля эффектов у бота
function handleEffect(bot, warp) {
  sendMsg(bot, "/heal");
  tpWarp(bot, warp);
}

// Отправка инвайта ближайшему игроку при спавне
function handleNearestInvite(bot, entity) {
  if (entity.type === "player") sendMsg(`/c invite ${entity.username}`);
}

// Функция для полной очистки инвентаря
function clearInventory(bot) {
  sendMsg(bot, "/head remove");
  sendMsg(bot, "/clear");
}

// Функция для очистки консоли с определенным интервалом
export function clearConsole(interval) {
  setInterval(() => console.clear(), interval*1000)
}

// Основные циклы для бота
function mainBotLoops(bot, chatWriting, warp) {
  invitePlayers(bot);  // Приглашение ближайшего игрока
  setSkin(bot);  // Установка скина
  setName(bot);  // Установка ника
  sendMsg(bot,"/gm 1");
  sendAdvertisements(bot);  // Отправка рекламы
  setInterval(() => bot.end("Restart"), 60 * 60 * 1000);  // Рестарт бота раз в час
  consoleEnter(bot, chatWriting);  // Активация консоли
  setInterval(() => { if (bot.game.dimension !== "overworld") tpWarp(bot, warp) }, 5 * 1000);  // Анти-трапка +
  setInterval(() => {
    tpWarp(bot, warp);
    clearRam();
  }, 5 * 60 * 1000);
}

// Функция для отправки сообщений с try/catch
function sendMsg(bot, msg) {
  try { bot.chat(msg) } catch (error) {}
}

// Функция для телепортации на варп с try/catch
function tpWarp(bot, warp) {
  try {
    sendMsg(bot, `/warp ${warp}`)
  } catch (error) {
    bot.end("An error has occurred while teleporting to warp");
  }
}

// Функция для переподключения бота на сервер
function reconnectBot(nickname, portal, warp, reason) {
  console.log(`${nickname} - Reconnection... (${reason})`);
  createBotCH(nickname, portal, warp);
}

// Функция для установки скина
function setSkin(bot, skinName = allBotSkin) {
  sendMsg(bot, `/skin ${skinName}`);
}
// Функция для установки ника
function setName(bot, nickname = allBotName) {
  sendMsg(bot, `/nickname ${nickname}`);
}

// Функция для работы с сообщениями
async function messagesMonitoring(message, position, bot, portal) {
  const fullMessage = extractTextFromChatMessage(message);
  const textMessage = message.getText();
  const lowTextMessage = textMessage.toLowerCase();

  // console.log(textMessage);  // Парсинг чата для дебага
  console.log(fullMessage.split(" "));

  const matchLeave = textMessage.match(/› (.*?) покинул клан\./);
  const matchJoin = textMessage.match(/› (.*?) присоеденился к клану\./);
  const matchKdr = textMessage.match(/игрока\s*(.*)/);
  const matchInvite = textMessage.match(/›\[(.*?) ->/);

  if (matchJoin && matchJoin[1]) {
    const newMember = matchJoin[1];
    if (playerDeaths[newMember]) playerDeaths[newMember] = 0;
    sendMsg(bot, `/cc Добро пожаловать в клан, ${newMember}! Обязательно вступи в наш дискорд, там много всего интересного! Если хочешь вступить в наш дискорд сервер, то пиши мне - kotik16f`);

  } else if (matchLeave && matchLeave[1]) {
    const leaveMember = matchLeave[1];
    sendMsg(bot, `/cc ${leaveMember} выходит из клана, ОБОССАТЬ И НА МОРОЗ!`);

  } else if (matchInvite && matchInvite[1] && lowTextMessage.includes("#invite")) {
    const invitePlayer = matchInvite[1];
    sendMsg(bot, `/c invite ${invitePlayer}`);

  } else if (matchKdr && matchKdr[1]) {
    let killedPlayer = matchKdr[1];
    countDie(killedPlayer);
    const deathsCount = playerDeaths[killedPlayer]
    if (deathsCount > 4 && bot.includes(killedPlayer)) {
      sendMsg(bot, `/c kick ${killedPlayer}`);
      blacklist.push(killedPlayer);
      saveBlacklist(blacklist);
    }
    saveDeaths();
  }

  if (fullMessage === "Пожайлуста прекратите читерить или вы будете забанены!") bot.end("Freeze troll");
  if (lowTextMessage.startsWith("клан:")) {
    for (const key in answerMessages) {
      console.log(`клан: ${key}`);
      if (lowTextMessage.startsWith(`клан: ${key}`)) {
        sendMsg(bot, answerMessages[key]);
        writeLog(fullMessage, "ClanLog.txt", portal, bot);
        break;
      }
    }
    for (const key in multiAnswerMessages) {
      if (lowTextMessage.includes(key)) {
        const regexp = new RegExp(`${key} (.*?)`, "g");
        const matchArg = textMessage.match(regexp);
        multiAnswerMessages[key](bot, matchArg[0]);
        break;
      }
    }
    for (const key in adminAnswerMessages) {
      for (const i in admins) {
        const admin = admins[i].toLowerCase();
        if (lowTextMessage.startsWith(`клан: ${admin}: ${key}`)) {
          const regexp = new RegExp(`клан: ${admin}: ${key}(.*?)`, "g");
          const matchArg = textMessage.match(regexp);
          if (matchArg && matchArg[0]) {
            await adminAnswerMessages[key](bot, matchArg[0]);
            break;
          }
          await adminAnswerMessages[key](bot);
          break;
        }
      }
    }
  }

  if (fullMessage.startsWith("[ɢ]")) writeLog(fullMessage, "GlobalLog.txt", portal, bot);
  else if (fullMessage.startsWith("[ʟ]")) writeLog(fullMessage, "LocalLog.txt", portal, bot);
}

// Функция для создания бота
export function createBotCH(nickname, portal, warp = allBotWarp, chatWriting = false, password = defPassword, host = "ru.masedworld.net", port = 25565, auth = "offline") {
  botList.push(nickname);
  const proxy = getRandomProxy();
  const agent = new HttpProxyAgent(`http://${proxy}`);
  const bot = createBot({
    host: host,
    port: port,
    username: nickname,
    agent: agent,
    auth: auth,
    // hideErrors: true,  // Включить при релизе
  });

  bot.on("spawn", () => handleSpawn(bot, portal, password));
  bot.on("error", (err) => bot.end(`An error has occurred ${err}`));
  bot.on("end", (reason) => reconnectBot(nickname, portal, warp, reason));

  setTimeout(() => {
    mainBotLoops(bot, chatWriting, warp);
    bot.on("entitySpawn", (entity) => handleNearestInvite(bot, entity));
    bot.on("entityMoved", () => lookAtNearestPlayer(bot));
    bot.on("message", async (message, position) => await messagesMonitoring(message, position, bot, portal));
    bot.on("forcedMove", () => tpWarp(bot, warp));
    bot.on("kicked", (reason) => reconnectBot(nickname, portal, warp, reason));
    bot.on("entityEffect", () => handleEffect(bot, warp));
    bot.on("respawn", () => handleDamage(bot, warp));
  }, 5 * 1000);  // Задержка в 5 секунд чтобы бот не вылетал из-за спама
}
