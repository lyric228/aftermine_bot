import {appendFile, existsSync, mkdirSync, readFileSync, writeFileSync} from "fs";
import {adMsgs, admins, unterMsgs, commandsMsgs} from "./cfg.mjs";
import {BotPanelServer} from "./server/server.mjs";
import {HttpProxyAgent} from "http-proxy-agent";
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


export function startBot(options) {
  const nickname = options.nickname || "Kemper1ng";
  const portal = options.portal || "s2";
  const host = options.host || "ru.masedworld.net";
  const warp = options.warp || "n930gkh1r";
  const password = options.password || "!afterHuila00pidor3svocvoRus";
  const hideErrors = options.hideErrors || false;
  const auth = options.auth || false;
  const closeTimeout = options.closeTimeout || 5*60*1000;
  const proxy = options.proxy || getRandomProxy();
  const visname = options.name || "Lyric";
  const skinname = options.skin || "zxclyric";
  const version = options.version || "1.20.4";
  return new Bot(nickname, portal, warp, hideErrors, password, host, proxy, closeTimeout, visname, skinname, auth, version);
}


export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export function getRandomProxy() {
  const proxies = readFileSync("server/data/proxy.txt", "utf-8").split("\n").filter(line => line.trim() !== "");
  return proxies[getRandomNumber(0, proxies.length)];
}


class Bot {
  constructor(nickname, portal, warp, hideErrors, password, host, proxy, closeTimeout, visname, skinname, auth, version) {
    botCount++;
    if (botCount === 1) {
      blacklist = this.loadBlacklist();
      playerDeaths = this.loadDeaths();
    }
    if (botList.length <= botCount) botList.push(this.nickname);
    this.answerMessages = {
      "afterdar": unterMsgs["afterdark"],
      "worte": unterMsgs["wortex"],
      "goldligh": unterMsgs["goldlight"],
      "blyyet": unterMsgs["blyyeti"],
      "helltea": unterMsgs["hellteam"],
      "krist": unterMsgs["kristl"],

      "#команды": commandsMsgs["commandList"],
      "#списокботов": commandsMsgs["botList"],
      "#союзы": commandsMsgs["allies"],
      "#враги": commandsMsgs["enemies"],
      "#функции": commandsMsgs["functions"],
      "#версиибота": commandsMsgs["versions"][parseInt(this.currentArg)],
    };
    this.adminAnswerMessages = {
      "#чс": () => {
        const curUser = this.currentArg;
        if (!blacklist.includes(this.currentArg)) {
          blacklist.push(curUser);
          this.sendMsg(`/c kick ${curUser}`);
          this.saveBlacklist();
          this.sendLocalMsg(`Игрок ${curUser} добавлен в ЧС!`);
          blacklist = this.loadBlacklist();
        } else this.sendLocalMsg(`Игрок ${curUser} уже в ЧС!`);
      },
      "#анчс": () => {
        const curUser = this.currentArg;
        if (blacklist.includes(curUser)) {
          blacklist = blacklist.filter(item => item !== curUser);
          this.sendMsg(`/c invite ${curUser}`);
          this.saveBlacklist();
          this.sendLocalMsg(`Игрок ${curUser} удален из ЧС!`);
        } else this.sendLocalMsg(`Игрока ${curUser} нету в ЧС!`);
      },
      "#чат": () => {
        this.sendMsg(this.allArgs.join(" "));
      },
      "#админ": () => {
        const curUser = this.currentArg;
        if (!admins.includes(curUser)) {
          admins.push(curUser);
          this.sendLocalMsg(`Теперь ${curUser} админ!`);
        } else this.sendLocalMsg(`${curUser} уже админ!`);
      },
      "#анадмин": () => {
        const curUser = this.currentArg;
        if (admins.includes(curUser)) {
          admins[admins.indexOf(curUser)] = "";
          this.sendLocalMsg(`Теперь ${curUser} не админ!`);
        } else this.sendLocalMsg(`${curUser} и так не админ!`);
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
    this.version = version;
    this.curServer = host.split(".")[1];
    this.closeTimeout = closeTimeout;
    this.currentArg = "";
    this.allArgs = [];
    this.lastUser = "";
    this.checkChat = false;
    this.checkSwingArm = false;
    this.inviteEnabled = false;
    this.agent = new HttpProxyAgent(`http://${getRandomProxy()}`);
    this.bot = mf.createBot({
      username: this.nickname,
      host: this.host,
      agent: this.agent,
      version: this.version,
      auth: this.auth,
      hideErrors: this.hideErrors,
      closeTimeout: this.closeTimeout,
    });
    this.bot.on("end", (reason) => this.reconnectBot(reason));
    this.bot.on("spawn", () => this.handleSpawn());

    setTimeout(() => {
        this.bot.on("entitySpawn", (entity) => this.handleNearestInvite(entity));
        this.bot.on("entityMoved", () => this.lookAtNearestPlayer());
        this.bot.on("message", (message) => this.messagesMonitoring(message));
        this.bot.on("forcedMove", () => this.tpWarp());
        this.bot.on("entityEffect", () => this.handleEffect());
        this.bot.on("respawn", () => this.antiTrap());
        this.bot.on("blockUpdate", (oldState) => this.handleBlockChange(oldState));
        this.bot.on("entitySwingArm", (entity) => this.swingArmTrigger(entity));
        this.bot.inventory.on("updateSlot", () => this.clearInventory());
        this.setSkin();
        this.setName();
        this.setGlow();
        this.tpWarp();
        this.botLoops();
        this.fly();
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
    new this.constructor(this.nickname, this.portal, this.warp, this.hideErrors,this.password, this.host, this.proxy, this.closeTimeout, this.name, this.skin, this.auth, this.version);
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
    this.sendMsg("/head remove")
    this.sendMsg("/clearinventory");
  }

  // Циклы для бота
  botLoops() {
    this.invitePlayers();  // Приглашение ближайшего игрока
    this.sendAdvertisements();  // Отправка рекламы
    this.autoRestart();  // Рестарт бота раз в час
    this.ramClearInterval();  // Очистка оперативной памяти
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

  // Функция для приглашения ближайшего игрока в клан
  invitePlayers() {
    this.inviteEnabled = true;
    this.invitePlayersInterval = setInterval(() => {
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
    setInterval(() => this.clearRam(), 5 * 60 * 1000);
  }

  // Функция для обхода всех трапок / антитрапка +
  antiTrap() {
    if (this.bot.game.dimension !== "overworld") this.bot.respawn();
  }

  // Функция для рассылки рандомного сообщения рекламы клана в глобальный чат
  sendAdvertisements() {
    if (this.curServer === "cheatmine") setInterval(() => this.sendAdMsg(), getRandomNumber(60*1000, 1.5*60*1000));
    else setInterval(() => this.sendAdMsg(), getRandomNumber(2.5*60*1000, 3*60*1000));
    setInterval(() => this.sendMsg(commandsMsgs["discord"]), getRandomNumber(60*1000, 2*60*1000));
  }

  // Функция для отправки рекламного сообщения
  sendAdMsg() {
    this.sendMsg(adMsgs[getRandomNumber(0, adMsgs.length - 1)]);
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
  handleBlockChange(oldState) {
    if (oldState.name !== "air") {
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

  // Функция для полёта бота
  fly() {
    this.sendMsg("/gm 1");
    this.bot.creative.startFlying();
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
    if (this.checkSwingArm && (!admins.includes(entity.username) && (!botList.includes(entity.username)) && (entity.type === "player"))) {
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
    const matchKdr = textMessage.match(/(.*?) убил игрока (.*)/);

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

    } else if (matchKdr && matchKdr[1]) {
      let killedPlayer = matchKdr[2];
      if (botList.includes(killedPlayer) || admins.includes(killedPlayer) || killedPlayer === this.nickname) return;
      if (typeof playerDeaths[killedPlayer] !== "number") playerDeaths[killedPlayer] = 0;
      playerDeaths[killedPlayer] += 1;
      const deathsCount = playerDeaths[killedPlayer]
      if (deathsCount > 4) {
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
        if (containsKey) {
          if (typeof this.adminAnswerMessages[command] === "function") this.adminAnswerMessages[command]();
          else this.sendMsg(this.adminAnswerMessages[command]);
        }
      } else if (command === "#invite") this.sendMsg(`/c invite ${username}`);
    }

    if (lowTextMessage.startsWith("клан:")) {
      this.currentArg = cmdMessages[4];
      this.lastUser = cmdMessages[2];
      const curCommand = cmdMessages[3].toLowerCase();
      for (const command in this.answerMessages) {
        if (command.includes(curCommand)) {
          this.sendMsg(this.answerMessages[command]);
          break;
        }
      }
      if (this.lastUser === this.nickname) return;
      this.writeLog(textMessage, "ClanLog");
    }
    else if (textMessage.startsWith("[ɢ]")) this.writeLog(textMessage, "GlobalLog");
    else if (textMessage.startsWith("[ʟ]")) this.writeLog(textMessage, "LocalLog");
    else if (textMessage === "Пожайлуста прекратите читерить или вы будете забанены!") this.bot.end("Freeze troll");
  }
}
