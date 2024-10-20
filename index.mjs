import {appendFile, existsSync, mkdirSync, readFileSync, writeFileSync} from "fs";
import {BotPanelServer} from "./server/server.mjs";
import {HttpProxyAgent} from "http-proxy-agent";
import {createInterface} from "readline";
import {freemem, totalmem} from "os";
import cache from "memory-cache";
import * as mf from "mineflayer";


let playerDeaths = {};
let blacklist = [];
let botList = [];
let botCount = 0;
export const server = new BotPanelServer();
export const botsObjData = {
  "masedworld": {
    "s1": () => { return startBot({nickname: "VectorKemper1ng", portal: "s1"}) },
    "s2": () => { return startBot({nickname: "Kemper1ng", portal: "s2"}) },
    "s3": () => { return startBot({nickname: "NeoKemper1ng", portal: "s3"}) },
    "s4": () => { return startBot({nickname: "SCPbotSH", portal: "s4"}) },
    "s5": () => { return startBot({nickname: "Alfhelm", portal: "s5"}) },
    "s6": () => { return startBot({nickname: "QuaKemper1ng", portal: "s6"}) },
    "s7": () => { return startBot({nickname: "AntiKemper1ng", portal: "s7"}) },
    "s8": () => { return startBot({nickname: "Temper1ng", portal: "s8"}) },
  },
  "cheatmine": {
    "s1": () => { return startBot({nickname: "musulmango14", portal: "s1", host: "ru.cheatmine.net"}) },
    "s2": () => { return startBot({nickname: "musulmango88", portal: "s2", host: "ru.cheatmine.net"}) },
  }
};
export let botsObj = {
  "masedworld": {
    "s1": { bot: null, timer: "0д 0ч 0м 0с", startTime: null, interval: null },
    "s2": { bot: null, timer: "0д 0ч 0м 0с", startTime: null, interval: null },
    "s3": { bot: null, timer: "0д 0ч 0м 0с", startTime: null, interval: null },
    "s4": { bot: null, timer: "0д 0ч 0м 0с", startTime: null, interval: null },
    "s5": { bot: null, timer: "0д 0ч 0м 0с", startTime: null, interval: null },
    "s6": { bot: null, timer: "0д 0ч 0м 0с", startTime: null, interval: null },
    "s7": { bot: null, timer: "0д 0ч 0м 0с", startTime: null, interval: null },
    "s8": { bot: null, timer: "0д 0ч 0м 0с", startTime: null, interval: null },
  },
  "cheatmine": {
    "s1": { bot: null, timer: "0д 0ч 0м 0с", startTime: null, interval: null },
    "s2": { bot: null, timer: "0д 0ч 0м 0с", startTime: null, interval: null },
  },
};
const shameBoard = [
  "ziklichniy",
  "pavel_чото_там",
  "cph4peezzz",
  "forltop_W",
  "BOZZIinSNG",
];
const admins = [
  "zxclyric",
  "KoTiK_B_KeDaH_",
  "BogSupnogoDnya",
  "makleia",
  "ryfed_pc",
];


export function startBot(options) {
  const nickname = options.nickname || "Kemper1ng";
  const portal = options.portal || "s2";
  const host = options.host || "ru.masedworld.net";
  const warp = options.warp || "n930gkh1r";
  const password = options.password || "!afterHuila00pidor3svocvoRus";
  const chatWriting = options.chatWriting || false;
  const hideErrors = options.hideErrors || false;
  const auth = options.auth || false;
  const closeTimeout = options.closeTimeout || 5*60*1000;
  const proxy = options.proxy || getRandomProxy();
  const visname = options.name || "Lyric";
  const skinname = options.skin || "zxclyric";
  const inviteEnabled = options.inviteEnabled || false;
  return new Bot(nickname, portal, warp, chatWriting, hideErrors, password, host, proxy, closeTimeout, visname, skinname, auth, inviteEnabled);
}


export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export function getRandomProxy() {
  const proxies = readFileSync("server/data/proxy.txt", "utf-8").split("\n").filter(line => line.trim() !== "");
  return proxies[getRandomNumber(0, proxies.length)];
}


class Bot {
  constructor(nickname, portal, warp, chatWriting, hideErrors, password, host, proxy, closeTimeout, visname, skinname, auth, inviteEnabled) {
    botCount++;
    if (botCount === 1) {
      blacklist = this.loadBlacklist();
      playerDeaths = this.loadDeaths();
    }
    if (botList.length <= botCount) botList.push(this.nickname);
    this.adMsgs = [
      "!&fПривет, друг! Хочешь побывать в &cклане&f, где была великая история? Тогда тебе сюда -> &c/warp CH&f ! У нас есть: &bтоповый кит для пвп&f, &eхороший кх &fи многое другое! Чего же ты ждёшь? &d&nПрисоединяйся к нам!",
      "!&fПриветик! Хочешь с &dкайфом &fпровести время, но не знаешь как? Тогда тебе подойдёт &cклан &4&lChert&0&lHouse &f! У нас ты найдёшь &eхороший кх&f, &bтоповый кит &fи &nуважение клана&f. Чтоб вступить в клан пиши &c/warp CH",
      "!&fХочешь в &dкрутой клан &fс многими &eплюшками? Тогда тебе нужен клан &4&lChert&0&lHouse&f ! У нас ты не только найдёшь &bтоповый кит для пвп&f и&e хороший кх&f, но и дс сервер! А так же у нас открыт набор на модераторов! &c/warp CH",
      "!&fИщешь &aотличный клан &fс &eкрутыми возможностями&f? Тогда тебе подходит клан &4&lChert&0&lHouse &f! &bТоповый кит&f, &6функциональный бот&f, всё это ты найдёшь на &c/warp ch&f . Заинтересовало? Ждём именно тебя!",
      "!&eТоповый кх&f, &bахеренный кит&f, &6функциональный бот&f, всё это есть в клане &4&lChetrt&0&lHouse&f! Ощути весь кайф в &cнашем клане&f, побывай в нашем &aдс сервере &fи не только! Просто напиши в лс боту #invite ! &7(/warp ch)",
      "!&fКу! Хочешь попасть в стафф &cклана&f, но тебя &c&nникто не берёт&f? Спешу тебя обрадовать, у нас открыт набор на &bмодеров&f, &c&lПВПШЕРОВ&f и других должностей! Берём даже с &eмалым опытом&f. Не упусти шанс стать частью нашей &aкоманды&f. &c/warp ch",
    ];
    this.unterMsgs = {
      "afterdark": "/cc А вы знали, что афтердарк - хуйня? Глава у них школьник, который сосет хуй, а также персонал у них полная хуйня. Если вы не хотите быть хуеглотом, то смело оставайтесь у нас и получайте нашу поддержку.",
      "wortex": "/cc А вы знали, что клан вортекс - сборище даунов? Глава у них нихуя не умеет,  а их уебанские игроки готовы отсосать за клан). Не будь как они, будь как мы (самыми крутыми)!",
      "goldlight": "/cc А вы знали, что GoldLight - клан хохлов? Глава у них каждый день на киеве глотает бомбы и ракеты в ротик, а люди из их клана готовы ебаться за афтердарк))). Не будь салом, стань ёбырём (как наш клан).",
      "blyyeti": "/cc А вы знали, что клан BlyYety - клан одних хелперов с ебучими правами? Глава у них сосал хуй у всех кланов, менендес хавал хуи на каждом шагу, а Rooli шлюха, которая готова отсосать у соника. Не будь как они, оставайся у нас и всё будет заебись!",
      "hellteam": "/cc А вы знали, что клан HellTeam - клан ебанных лицемерских пидоров, которые затерялись где то на дне альфы. А еще вы знали то, что глава их пиздабол и думает то, что он топ 1 с читами. Не будь пидорасами как они будь крутыми как мы)",
      "kristl": "/cc А вы знали, что клан KRISTL - клан ублюдков? Глава у них школьник, которому 12 лет, а их мелкие ебанаты готовы отсосать за клан)) Кристл настолько скатились, что даже на альфе не могут топ 1 занять) Не будь уебаном, будь сигмой как мы!",
    };
    this.commandsMsgs = {
      "commandList": () => { return `/cc &eСписок доступных команд&f - #Команды , #ЧёрныйСписок , #ФункцииБота , #Союзы , #Враги , #ДоскаПозора , #СписокБотов , #ВерсииБота. &bКоманды писать в клан чат.&f` },
      "botList": () => `/cc &c1&f. &bKemper1ng&f. &32&f. &bAntiKemper1ng&f. &a3&f. &2Alfhelm&f. &64&f. &eVectorKemper1ng&f. &d5&f. &1SCPbotSH&f. &26&f. &3QuaKemper1ng&f. &97&f. &cNeoKemper1ng&f. &58&f. Temper1ng.`,
      "allies": () => `/cc &fНаши союзы на &cданный момент&f: &1PEPSICO&f , &eLaEspada &f, &4афтедаркхуета&f.`,
      "enemies": () => `/cc &fНаши &cвраги&f: У нас нет врагов! `,
      "functions": () => `/cc &aФункции&f нашего бота: &cАнтиТп&f, &bПриглашение в клан&f, &eАнти Слив КДР&f , &dРеклама в чате &f, &3АвтоРекконект &f(каждый час), &0Чёрный Список&f, &eЗащита от фризтрола&f, &aЗащита от убийств и эффектов&f, &lКоманды в клан чате &f.`,
      "shame": () => `/cc 1. - ${shameBoard[0]} 2. - ${shameBoard[1]} 3. - ${shameBoard[2]} 4. - ${shameBoard[3]} 5. - ${shameBoard[4]}`,
      "blacklist": () => `/cc &fЧёрный список: 1. ${blacklist[blacklist.length-1]} 2. ${blacklist[blacklist.length-2]} 3. ${blacklist[blacklist.length-3]} 4. ${blacklist[blacklist.length-4]} 5. ${blacklist[blacklist.length-5]} 6. ${blacklist[blacklist.length-6]} 7. ${blacklist[blacklist.length-7]} 8. ${blacklist[blacklist.length-8]}`,
      "discord": () => `/cc &fХочешь быть всегда в курсе что и где происходит в клане? Тогда тебе нужен наш &cклановый дискорд сервер&f! У нас есть новости, наборы, ивенты и тд! Заинтересовало? Пиши мне - kotik16f`,
      "versions": () => [
        `/cc Alpha 0.01 - Добавлены функции Инвайта в клан, Пиар, Заход на сервер и прочие базовые функции. Alpha 0.02 - Добавлена функция AntiTp. Alpha 0.03 - Добавлен второй бот.`,
        `/cc Beta 0.1 - Добавлен третий бот Alfhelm. Beta 0.2 - Добавлен прокси, Добавлен черный список. Beta 0.5 - Добавлена оптимизация на АнтиТп, добавлены все боты.`,
        `/cc Beta 0.6 - Ответ на плевок. Beta 0.7 - Небольшие изменения. Beta 0.8 - обновлен черный список, ClanLog, смерти. Beta 0.9 - небольшие изменения. Release 1.0 - Добавлена анти-трапка.`,
        `/cc Release 1.1 - Исправлено множество ошибок, а также прочие небольшие изменения.`,
      ],
    };
    this.answerMessages = {
      "afterdar": this.unterMsgs["afterdark"],
      "worte": this.unterMsgs["wortex"],
      "goldligh": this.unterMsgs["goldlight"],
      "blyyet": this.unterMsgs["blyyeti"],
      "helltea": this.unterMsgs["hellteam"],
      "krist": this.unterMsgs["kristl"],

      "#команды": this.commandsMsgs["commandList"](),
      "#списокботов": this.commandsMsgs["botList"](),
      "#союзы": this.commandsMsgs["allies"](),
      "#враги": this.commandsMsgs["enemies"](),
      "#функции": this.commandsMsgs["functions"](),
      "#доска": this.commandsMsgs["shame"](),
      "#чс": this.commandsMsgs["blacklist"](),
      "#версиибота": this.commandsMsgs["versions"]()[this.currentArg],
    }
    this.adminAnswerMessages = {
      "#чс": () => {
        if (!blacklist.includes(this.currentArg)) {
          blacklist.push(this.currentArg);
          this.saveBlacklist();
          this.sendLocalMsg(`Игрок ${this.currentArg} добавлен в ЧС!`);
          blacklist = this.loadBlacklist();
        } else this.sendLocalMsg(`Игрок ${this.currentArg} уже в ЧС!`);
      },
      "#анчс": () => {
        const curUser = this.currentArg;
        if (blacklist.includes(curUser)) {
          blacklist = blacklist.filter(item => item !== curUser);
          this.saveBlacklist();
          this.sendLocalMsg(`Игрок ${curUser} удален из ЧС!`);
        } else this.sendLocalMsg(`Игрока ${curUser} нету в ЧС!`);
      },
      "#дп": () => {
        const index = this.allArgs[1]-1;
        shameBoard[index] = this.currentArg;
        this.sendLocalMsg(`Игрок ${this.currentArg} теперь на ${this.allArgs[1]} месте на доске позора!`);
      },
      "#чат": () => {
        this.sendMsg(this.allArgs.join(" "));
      },
      "#админ": () => {
        if (admins.includes(this.currentArg)) {
          admins.push(this.currentArg);
          this.sendLocalMsg(`Теперь ${this.currentArg} админ!`);
        } else this.sendLocalMsg(`${this.currentArg} уже админ!`);
      },
      "#ОЗУ": () => {
        this.sendLocalMsg(`Очищаю ОЗУ...`);
        this.clearRam(false);
      },
      "#рекконект": () => {
        this.sendLocalMsg(`Рестарт!`);
        this.bot.end("Reconnect by admin.");
      },
      "#инвайт": () => {
        if (this.inviteEnabled) {
          this.sendLocalMsg(`Инвайты выключены!`);
          this.inviteEnabled = false;
          clearInterval(this.invitePlayersInterval);
        } else {
          this.sendLocalMsg(`Инвайты включены!`);
          this.invitePlayers();
        }
      },
    }
    this.rgInfo = {
      name: "",
      owners: [],
      members: [],
    };
    this.chatWriting = chatWriting;
    this.hideErrors = hideErrors;
    this.password = password;
    this.nickname = nickname;
    this.portal = portal;
    this.warp = warp;
    this.skin = skinname;
    this.name = visname;
    this.host = host;
    this.auth = auth;
    this.proxy = proxy;
    this.curServer = host;
    this.closeTimeout = closeTimeout;
    this.inviteEnabled = inviteEnabled;
    this.currentArg = "";
    this.allArgs = [];
    this.lastUser = "";
    this.checkChat = false;
    this.checkSwingArm = false;
    this.agent = new HttpProxyAgent(`http://${getRandomProxy()}`);
    this.bot = mf.createBot({
      username: this.nickname,
      host: this.host,
      agent: this.agent,
      auth: this.auth,
      hideErrors: this.hideErrors,
      closeTimeout: this.closeTimeout,
    });
    this.bot.on("end", (reason) => this.reconnectBot(reason));
    this.bot.on("error", (error) => this.bot.end(error.name));
    this.bot.on("spawn", () => this.handleSpawn());

    setTimeout(() => {
        this.bot.on("entitySpawn", (entity) => this.handleNearestInvite(entity));
        this.bot.on("entityMoved", () => this.lookAtNearestPlayer());
        this.bot.on("message", (message) => this.messagesMonitoring(message));
        this.bot.on("forcedMove", () => this.tpWarp());
        this.bot.on("entityEffect", () => this.handleEffect());
        this.bot.on("respawn", () => this.antiTrap());
        this.bot.on("blockUpdate", (oldState, newState) => this.handleBlockChange(oldState, newState));
        this.bot.on("entitySwingArm", (entity) => this.swingArmTrigger(entity));
        this.setSkin();
        this.setName();
        this.setGlow();
        this.tpWarp();
        this.consoleEnter();
        this.botLoops();
      }, 3000);
  }

  // Функция для логина бота
  handleSpawn() {
    this.sendMsg(`/reg ${this.password}`);
    this.sendMsg(`/login ${this.password}`);
    this.sendMsg(`/${this.portal}`);
    console.log(`${this.nickname} has spawned`)
  }

  // Функция для переподключения бота
  reconnectBot(reason) {
    reason = reason.toString();
    if ((reason.includes("AggregateError")) || (reason.includes("ECONNRESET"))) return;
    console.log(`${this.nickname} - Reconnection... (${reason})`);
    botCount--;
    this.saveBlacklist();
    this.saveDeaths();
    new this.constructor(this.nickname, this.portal, this.warp, this.chatWriting, this.hideErrors,this.password, this.host, this.proxy, this.closeTimeout, this.name, this.skin, this.auth, this.inviteEnabled);
  }

  // Функция для отправки сообщений с try/catch
  sendMsg(msg) {
    try {
      if (typeof msg === "function") msg = msg();
      this.bot.chat(msg);
    } catch (error) {}
  }

  // Функция для отправки личных сообщений с try/catch
  sendLocalMsg(msg, user = this.lastUser) {
    try {
      this.bot.chat(`/m ${user} ${msg}`);
    } catch (error) {}
  }

  // Функция для телепортации на варп с try/catch
  tpWarp(warp = this.warp) {
    try {
      this.sendMsg(`/warp ${warp}`);
    } catch (error) {}
  }

  // Функция для полной очистки инвентаря
  clearInventory() {
    this.sendMsg("/head remove");
    this.sendMsg("/clear");
  }

  // Циклы для бота
  botLoops() {
    this.invitePlayers();  // Приглашение ближайшего игрока
    this.sendAdvertisements();  // Отправка рекламы
    this.autoRestart();  // Рестарт бота раз в час
    this.ramClearInterval();  // Очистка оперативной памяти
    this.antiPumpkin();  // Анти-тыква
  }

  // Функция для очистки оперативной памяти
  clearRam(check = true) {
    if (check) {
      const freeMemory = freemem();
      const totalMemory = totalmem();
      if (!(freeMemory / totalMemory < 0.2)) return;
    }
    cache.clear();
  }

  // Функция для сохранения данных в черный список
  saveBlacklist() {
    blacklist.sort(() => Math.random() - 0.5);
    writeFileSync("server/data/blacklist.txt", blacklist.join("\n"));
  }

  // Функция для загрузки данных из черного списка
  loadBlacklist() {
    try {
      const data = readFileSync("server/data/blacklist.txt").toString();
      return data.split("\n");
    } catch (error) {
      if (error.code === "ENOENT") return []
    }
  }

  // Функция для сохранения данных о смертях
  saveDeaths() {
    const jsonDeaths = JSON.stringify(playerDeaths);
    writeFileSync("server/data/deaths.json", jsonDeaths);
  }

  // Функция для загрузки данных о смертях
  loadDeaths() {
    try {
      const jsonString = readFileSync("server/data/deaths.json");
      return JSON.parse(jsonString.toString());
    } catch (error) { if (error.code === "ENOENT") return {}; }
  }

  // Функция для изменения смертей по нику
  countDie() {
    if (playerDeaths[this.nickname] == null) playerDeaths[this.nickname] = 0;
    playerDeaths[this.nickname] += 1;
  }

  // Функция для записи логов в файл
  writeLog(text, path) {
    const date = new Date().toLocaleString();
    const logText = `[${date}]: ${text}\n`;
    const fullPath = `server/logs/${this.curServer}/${this.portal}/${path}.txt`;
    appendFile(fullPath, logText, (error) => {
      if (!error) return;
      if (error.code === "ENOENT") {
        const pathParts = fullPath.split("/");
        let currentPath = "";
        for (let i = 0; i < pathParts.length - 1; i++) {
          currentPath += pathParts[i] + "/";
          if (!existsSync(currentPath)) mkdirSync(currentPath);
        }
        writeFileSync(fullPath, logText);
      }
    });
  }

  // Функция для отправки сообщений в чат через консоль от лица бота
  consoleEnter() {
    if (this.chatWriting) {
      const rl = createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.setPrompt(">>> ");
      rl.prompt();
      rl.on("line", (input) => {
        this.sendMsg(input);
        rl.prompt();
      }).on("close", () => {
        console.log("Bye!");
        process.exit(0);
      });
    }
  }

  // Функция для приглашения ближайшего игрока в клан
  invitePlayers() {
    this.inviteEnabled = true;
    this.invitePlayersInterval = setInterval(() => {
      if (typeof this.bot.nearestEntity !== "function") return;
      const closestPlayer = this.bot.nearestEntity(entity => entity.type === "player");
      if (closestPlayer && !blacklist.includes(closestPlayer.username)) this.sendMsg(`/c invite ${closestPlayer.username}`);
    }, getRandomNumber(10000, 30000));
  }

  // Функция для авто рестарта бота раз в час
  autoRestart() {
    setInterval(() => this.bot.end("Restart"), 60 * 60 * 1000);  // Рестарт бота раз в час
  }

  // Функция для полной остановки и удаления экземпляра бота
  deleteBot() {
    this.bot.end("Disabled by admin.");
    delete this;
  }

  // Функция для очистки оперативной памяти с интервалом и телепортом на варп
  ramClearInterval() {
    setInterval(() => {
      this.tpWarp();
      this.clearRam();
    }, 5 * 60 * 1000);
  }

  // Функция для очистки инвентаря
  antiPumpkin() {
    setInterval(() => this.clearInventory(), 60 * 1000);
  }

  // Функция для обхода всех трапок / антитрапка +
  antiTrap() {
    if (this.bot.game.dimension !== "overworld") {
      this.reconnectBot("Trapped!");
      this.bot.respawn();
    } else this.tpWarp();
  }

  // Функция для рассылки рандомного сообщения рекламы клана в глобальный чат
  sendAdvertisements() {
    if (this.curServer === "cheatmine") setInterval(() => this.sendMsg(this.adMsgs[getRandomNumber(0, this.adMsgs.length - 1)]), getRandomNumber(60*1000, 1.5*60*1000));
    else setInterval(() => this.sendMsg(this.adMsgs[getRandomNumber(0, this.adMsgs.length - 1)]), getRandomNumber(2.5*60*1000, 3*60*1000));
    setInterval(() => this.sendMsg(this.commandsMsgs["discord"]()), getRandomNumber(60*1000, 2*60*1000));
  }

  // Функция, чтоб получить ближайшего игрока
  getNearestPlayer() {
    return this.bot.nearestEntity(entity => entity.type === "player");
  }

  // Функция чтобы бот смотрел на ближайшего игрока
  lookAtNearestPlayer(closestPlayer = this.getNearestPlayer()) {
    if (closestPlayer) {
      const lookPosition = closestPlayer.position.offset(0, 1.6, 0);
      return this.bot.lookAt(lookPosition);
    }
  }

  // Функция для контроля эффектов у бота
  handleEffect() {
    this.sendMsg("/heal");
    this.tpWarp();
  }

  // Функция для просмотра
  handleBlockChange(oldState, newState) {
    if (oldState.name !== "air" && newState.name === "air") {
      this.checkChat = true;
      this.sendMsg("/rg i");
    }
  }

  // Отправка инвайта ближайшему игроку при спавне
  handleNearestInvite(entity) {
    if (entity.type === "player") this.sendMsg(`/c invite ${entity.username}`);
  }

  // Функция для установки скина
  setSkin(skin = this.skin) {
    this.sendMsg(`/skin ${skin}`);
  }

  // Функция для установки ника
  setName(name = this.name) {
    this.sendMsg(`/nickname ${name}`);
  }

  // Функция для свечения бота
  setGlow() {
    this.sendMsg("/glow on");
  }

  // Функция для парсинга информации о регионе
  parseRegionInfo(rgMessage) {
    const result = {
      name: "",
      owners: [],
      members: [],
    };
    for (const line of rgMessage.split("\n")) {
      if (line.includes("Владельцы: ")) {
        result.owners = line.replace("Владельцы: ", "").split(", ");
      } else if (line.includes("Участники: ")) {
        result.members = line.replace("Участники: ", "").split(", ");
      } else if (line.includes("Регион: ")) {
        result.name = line.replace("Регион: ", "").split(" ")[0];
      }
    }
    return result;
  }

  // Функция для удаления игрока из региона если он ломает блоки
  swingArmTrigger(entity) {
    if (this.checkSwingArm && (!admins.includes(entity.username)) && (entity.type === "player")) {
      if (this.rgInfo.name === "__global__") return;
      this.checkSwingArm = false;
      if (this.rgInfo.members.includes(entity.username)) {
        this.sendMsg(`/rg removemember ${this.rgInfo.name} ${entity.username}`);
      } else if (this.rgInfo.owners.includes(entity.username)) {
        this.sendMsg(`/rg removeowner ${this.rgInfo.name} ${entity.username}`);
      }
      const msgLog = `Player ${entity.username} has broke the block! Rg info: ${this.rgInfo.name} | ${this.rgInfo.members} | ${this.rgInfo.owners}`;
      this.writeLog(msgLog, "GriefLog");
    }
  }

  // Функция для работы с сообщениями
  messagesMonitoring(message) {
    let textMessage = message.getText(null);
    let username = "";
    let cmdMessages = textMessage.split(" ");
    let lowTextMessage = textMessage.toLowerCase();
    if (textMessage === " ") return;
    console.log(textMessage);

    if (this.checkChat) {
      this.rgInfo = this.parseRegionInfo(textMessage);
      this.checkChat = false;
      this.checkSwingArm = true;
    }

    if (textMessage.startsWith("[ʟ]") || textMessage.startsWith("[ɢ]")) {
      try {
        username = message.json.extra[0].clickEvent.value.split(" ")[1];
      } catch (error) {
        return error;
      }
      const index = cmdMessages.indexOf("⇨");
      if (index !== -1) {
        cmdMessages[index-1] = username;
        textMessage = cmdMessages.join(" ");
      }
    }

    if (this.portal === server.currentBot && this.curServer === server.currentBotPanel) {
      const date = new Date().toLocaleString();
      const msgLog = `[${date}] ${textMessage}\n`;
      server.io.emit("updateChat", msgLog);
    }

    const matchLeave = textMessage.match(/› (.*?) покинул клан\./);
    const matchJoin = textMessage.match(/› (.*?) присоеденился к клану\./);
    const matchCmd = (this.curServer === "masedworld") ? textMessage.match(/^›\[(.*?) -> я] (.*)$/) : textMessage.match(/^›\[(.*?) -> я] (.*)$/);
    // [*[[Король] musulmango14 -> я] #command
    // const matchCmd = textMessage.match(/^›\[(.*?) -> я] (.*)$/);
    const matchInvite = textMessage.match(/›\[(.*?) ->/);
    // Пример const variable = (условие) ? 'true' : 'false';

    if (matchJoin && matchJoin[1]) {
      const newMember = matchJoin[1];
      if (blacklist.includes(newMember)) {
        this.sendMsg(`/c kick ${newMember}`);
        return;
      }
      if (playerDeaths[newMember]) playerDeaths[newMember] = 0;
      this.sendMsg(`/cc Добро пожаловать в клан, ${newMember}! Обязательно вступи в наш дискорд, там много всего интересного! Если хочешь вступить в наш дискорд сервер, то пиши мне - kotik16f`);

    } else if (matchLeave && matchLeave[1]) {
      const leaveMember = matchLeave[1];
      this.sendMsg(`/cc ${leaveMember} выходит из клана, ОБОССАТЬ И НА МОРОЗ!`);

    } else if (matchInvite && matchInvite[1] && lowTextMessage.includes("#invite")) {
      const invitePlayer = matchInvite[1];
      this.sendMsg(`/c invite ${invitePlayer}`);

    }
    if (cmdMessages[1] === "убил" && cmdMessages[2] === "игрока" && cmdMessages.length === 4) {
      let killedPlayer = cmdMessages[3];
      if (botList.includes(killedPlayer) || admins.includes(killedPlayer) || killedPlayer === this.nickname) return;
      this.countDie(killedPlayer);
      const deathsCount = playerDeaths[killedPlayer]
      if (deathsCount > 4 && !admins.includes(killedPlayer)) {
        this.sendMsg(`/c kick ${killedPlayer}`);
        blacklist.push(killedPlayer);
        this.saveBlacklist();
      }
      this.saveDeaths();
    }

    if (matchCmd && matchCmd[1]) {
      const username = matchCmd[1];
      const messages = matchCmd[2].split(" ");
      const command = messages[0];
      this.allArgs = messages.slice(1);
      this.currentArg = this.allArgs[0];
      this.lastUser = username;
      if ((admins.includes(username))) {
        const keys = Object.keys(this.adminAnswerMessages);
        const containsKey = keys.some(key => key.includes(command));
        if (containsKey) this.adminAnswerMessages[command]();
      }
    }

    if (lowTextMessage.startsWith("клан:")) {
      this.currentArg = cmdMessages[4];
      this.lastUser = cmdMessages[2];
      const curCommand = cmdMessages[3].toLowerCase();
      for (const command in this.answerMessages) {
        if (curCommand.includes(command)) {
          this.sendMsg(this.answerMessages[command]);
          break;
        }
      }
      this.writeLog(textMessage, "ClanLog");
    }
    else if (textMessage.startsWith("[ɢ]")) this.writeLog(textMessage, "GlobalLog");
    else if (textMessage.startsWith("[ʟ]")) this.writeLog(textMessage, "LocalLog");
    else if (textMessage === "Пожайлуста прекратите читерить или вы будете забанены!") this.bot.end("Freeze troll");
  }
}
