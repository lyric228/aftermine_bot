import {
  admins,
  adMsgs,
  commandsMsgs,
  LogRootPath, PublicName, PublicPassword,
  PublicSkin, PublicTimeOut, PublicVersion, PublicWarp,
  unterMsgs,
} from "../../cfg.mjs";
import {blacklist, botList, botsObj, getRandomProxy, playerDeaths} from "../../index.mjs";
import {saveBlacklist, loadBlacklist, saveDeaths} from "../../index.mjs";
import {appendFile, existsSync, mkdirSync, writeFileSync} from "fs";
import {randInt} from "../functions/functions.mjs";
import {HttpProxyAgent} from "http-proxy-agent";
import {EventEmitter} from "events";
import * as mf from "mineflayer";
import {tbot} from "../bot.mjs";


export class MainBot extends EventEmitter {
  constructor(options, server, port = null) {
    super();
    if (!botList.includes(this.nickname)) botList.push(this.nickname);
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
          saveBlacklist();
          this.sendLocalMsg(`Игрок ${curUser} добавлен в ЧС!`);
          blacklist = loadBlacklist();
        } else this.sendLocalMsg(`Игрок ${curUser} уже в ЧС!`);
      },
      "#анчс": () => {
        const curUser = this.currentArg;
        if (blacklist.includes(curUser)) {
          blacklist = blacklist.filter(item => item !== curUser);
          this.sendMsg(`/c invite ${curUser}`);
          saveBlacklist();
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
      "#рекконект": () => {
        this.sendLocalMsg(`Рестарт!`);
        this.bot.end("Reconnect by admin.");
      },
    }
    this.rgInfo = {
      name: "",
      owners: [],
      members: [],
    };
    this.spawnCount = 0;
    this.nickname = options.nickname;
    this.portal = options.portal;
    this.options = options;
    this.closeTimeout = PublicTimeOut;
    this.password = PublicPassword;
    this.version = PublicVersion;
    this.warp = PublicWarp;
    this.skin = PublicSkin;
    this.name = PublicName;
    this.port = port;
    this.host = `ru.${server}.net`;
    this.curServer = server;
    this.lastUser = "";
    this.currentArg = "";
    this.allArgs = [];
    this.checkChat = false;
    this.checkSwingArm = false;
    this.agent = new HttpProxyAgent(`http://${getRandomProxy()}`);
    this.botOptions = this.port === null ? {
      username: this.nickname,
      host: this.host,
      port: this.port,
      agent: this.agent,
      version: this.version,
      closeTimeout: this.closeTimeout,
    } : {
      username: this.nickname,
      host: this.host,
      agent: this.agent,
      version: this.version,
      closeTimeout: this.closeTimeout,
    };
    this.bot = mf.createBot(this.botOptions);
    this.bot.setMaxListeners(1000);
    this.setMaxListeners(1000);
    this.bot.on("end", (reason) => this.reconnectBot(reason));
    this.bot.on("spawn", () => {
      // TODO: Доделать базовый класс ботов для майна
      // TODO: Написать баг фиксы для инвентаря и тд
      // TODO: Сделать пакет фильтр против капчи на puppeteer
      // TODO: Переписать всех ботов под заготовку
      this.spawnCount++;
      this.handleSpawn();
      if (this.spawnCount === 2) {
        this.bot.on("entitySpawn", (entity) => this.handleNearestInvite(entity));
        this.bot.on("entityMoved", (entity) => this.lookAtNearestPlayer(entity));
        this.bot.on("message", (message) => this.messagesMonitoring(message));
        this.bot.on("forcedMove", () => this.antiTrap());
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
      }
    });
  }

  // Функция для логина бота
  handleSpawn() {
    this.sendMsg(`/reg ${this.password}`);
    this.sendMsg(`/login ${this.password}`);
    this.sendMsg(`/${this.portal}`);
    console.log(`${this.nickname} has spawned`)
    this.antiTrap();
  }

  // Функция для переподключения бота
  reconnectBot(reason) {
    reason = reason.toString();
    if ((reason.includes("AggregateError")) || (reason.includes("ECONNRESET"))) return;
    console.log(`${this.nickname} - Reconnection... (${reason})`);
    saveBlacklist();
    saveDeaths();
    delete this;
    botsObj[this.curServer][this.portal] = new MWBot(this.options);
  }

  // Функция для отправки сообщений с try/catch
  sendMsg(msg) {
    try {
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
    setTimeout(() => this.sendMsg("/clear"), 100);
  }

  // Циклы для бота
  botLoops() {
    this.invitePlayers();  // Приглашение ближайшего игрока
    this.sendAdvertisements();  // Отправка рекламы
    this.autoReconnect();  // Рестарт бота раз в пол часа
  }

  // Функция для записи логов в файл
  writeLog(text, path) {
    const date = new Date().toLocaleString();
    const logText = `[${date}]: ${text}\n`;
    const fullPath = `${LogRootPath}/${this.curServer}/${this.portal}/${path}.txt`;
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
    setInterval(() => {
      const closestPlayer = this.bot.nearestEntity(entity => entity.type === "player");
      if (closestPlayer && !blacklist.includes(closestPlayer.username)) this.sendMsg(`/c invite ${closestPlayer.username}`);
    }, randInt(10000, 30000));
  }

  // Функция для авто рестарта бота
  autoReconnect() {
    setInterval(() => this.bot.end("Restart"), 30 * 60 * 1000);
  }

  // Функция для полной остановки и удаления экземпляра бота
  deleteBot() {
    this.bot.end("Disabled by admin.");
    delete this;
  }

  // Функция для обхода всех трапок / антитрапка +
  antiTrap() {
    this.bot.respawn();
    setTimeout(() => this.tpWarp(), 500);
  }

  // Функция для рассылки рандомного сообщения рекламы клана в глобальный чат
  sendAdvertisements() {}

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
    if (this.isPlayer(entity)) this.sendMsg(`/c invite ${entity.username}`);
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
    if (this.checkSwingArm && !(admins.includes(entity.username) && !(botList.includes(entity.username)) && (this.isPlayer(entity) && !(this.rgInfo.name === "__global__")))) {
      if (this.rgInfo.name === "__global__") return;
      this.checkSwingArm = false;
      if (this.rgInfo.members.includes(entity.username)) {
        this.sendMsg(`/rg removemember ${this.rgInfo.name} ${entity.username}`);
      } else if (this.rgInfo.owners.includes(entity.username)) {
        this.sendMsg(`/rg removeowner ${this.rgInfo.name} ${entity.username}`);
      }
      const msgLog = `Player ${entity.username} has broke the block on ${this.portal}! Rg info: ${this.rgInfo.name} | ${this.rgInfo.members} | ${this.rgInfo.owners}`;
      this.emit("grieflog", msgLog);
      this.writeLog(msgLog, "GriefLog");
    }
  }

  // Функция для проверки игрок ли entity
  isPlayer(entity) {
    return entity.type === "player";
  }

  // Функция для работы с сообщениями
  messagesMonitoring(message) {
    this.textMessage = message.getText(null);
    this.username = "";
    this.cmdMessages = this.textMessage.split(" ");
  }

  enableGLog() {
    this.on("grieflog", (message) => {
      try {
        tbot.emit("log", message, "rg")
      } catch (err) {}
    });
  }

  disableGLog() {
    try {
      this.removeListener("grieflog", () => {});
    } catch (err) {}
  }

  enableCLog() {
    this.on("chatlog", (message) => {
      try {
        tbot.emit("log", `[${this.portal}] [${new Date().toLocaleString()}] ${message}`, "chat", this.portal)
      } catch (err) {}
    });
  }

  disableCLog() {
    try {
      this.removeListener("chatlog", () => {});
    } catch (err) {}
  }

  autoEnable(field) {
    field === "chat" ? this.enableCLog() : this.enableGLog();
  }

  autoDisable(field) {
    field === "chat" ? this.disableCLog() : this.disableGLog();
  }
}
