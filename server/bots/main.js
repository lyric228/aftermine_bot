import {
  admins,
  commandsMsgs, formatedPortals, formatedServers,
  LogRootPath, PublicName, PublicPassword,
  PublicSkin, PublicTimeOut, PublicVersion, PublicWarp,
  unterMsgs,
} from "../../cfg.mjs";
import {blacklist, botList, botsObj, getRandomProxy, saveBlacklist, loadBlacklist, saveDeaths} from "../../index.mjs";
import {appendFile, existsSync, mkdirSync, writeFileSync} from "fs";
import {randInt, splitStringIntoList} from "../functions/functions.mjs";
import {HttpProxyAgent} from "http-proxy-agent";
import {EventEmitter} from "events";
import * as mf from "mineflayer";
import {tbot} from "../bot.mjs";
import {ai} from "../ai/ai.js";


export class MainBot extends EventEmitter {
  textMessage;
  cmdMessages;
  username;
  message;
  constructor(options, server, obj) {
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
      ".бот": () => {
        const ask = this.allArgs.join(" ");
        if (ask.trim() === "") return;
        ai.getAnswer(ask, {
          nickname: this.nickname,
          portal: formatedPortals[this.curServer][this.portal],
          server: formatedServers[this.curServer],
          player: this.lastUser,
        });
      },
    };
    this.adminAnswerMessages = {
      "#чс": () => {
        const curUser = this.currentArg;
        if (!blacklist.includes(this.currentArg)) {
          blacklist.push(curUser);
          this.sendMsg(`/c kick ${curUser}`);
          saveBlacklist();
          this.sendLocalMsg(`Игрок ${curUser} добавлен в ЧС!`);
          loadBlacklist();
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
        this.end("Reconnect by admin.");
      },
    }
    this.rgInfo = {
      name: "",
      owners: [],
      members: [],
    };
    this.spawnCount = 0;
    this.curClass = obj;
    this.nickname = options.nickname;
    this.portal = options.portal;
    this.options = options;
    this.closeTimeout = PublicTimeOut;
    this.password = PublicPassword;
    this.version = PublicVersion;
    this.warp = PublicWarp;
    this.skin = PublicSkin;
    this.name = PublicName;
    this.host = `ru.${server}.net`;
    this.curServer = server;
    this.lastUser = "";
    this.currentArg = "";
    this.allArgs = [];
    this.checkChat = false;
    this.checkSwingArm = false;
    this.agent = new HttpProxyAgent(`http://${getRandomProxy()}`);
    this.botOptions = {
      username: this.nickname,
      host: this.host,
      agent: this.agent,
      version: this.version,
      closeTimeout: this.closeTimeout,
      plugins: {
        anvil: false,
        book: false,
        boss_bar: false,
        breath: false,
        chest: false,
        command_block: false,
        craft: false,
        creative: true,
        physics: true,
        inventory: true,
        enchantment_table: false,
        experience: false,
        explosion: false,
        fishing: false,
        furnace: false,
        generic_place: false,
        painting: false,
        particle: false,
        place_block: false,
        place_entity: false,
        rain: false,
        ray_trace: false,
        scoreboard: false,
        sound: false,
        spawn_point: false,
        tablist: false,
        team: false,
        time: false,
        title: false,
        villager: false
      },
    };
    this.bot = mf.createBot(this.botOptions);
    this.bot.setMaxListeners(1000);
    this.setMaxListeners(1000);
    this.bot.on("end", (reason) => this.reconnectBot(reason));
    this.bot.on("spawn", () => {
      this.spawnCount++;
      this.handleSpawn();
      if (this.spawnCount === 2) {
        this.bot.on("entitySpawn", (entity) => this.spawnInvite(entity));
        this.bot.on("message", (message) => this.messagesMonitoring(message));
        this.bot.on("forcedMove", () => this.antiTrap());
        this.bot.on("entityEffect", () => this.handleEffect());
        this.bot.on("respawn", () => this.antiTrap());
        this.bot.on("blockUpdate", (oldState) => this.handleBlockChange(oldState));
        this.bot.on("entitySwingArm", (entity) => this.swingArmTrigger(entity));
        this.bot.inventory.on("updateSlot", () => this.clearInventory());
        ai.on("aiAnswer", (answer) => this.aiAnswer((answer)));
        this.invitePlayers();  // Приглашение ближайшего игрока
        this.sendAdvertisements();  // Отправка рекламы
        this.autoReconnect();  // Рестарт бота раз в пол часа
        this.lookAtNearestPlayer();  // Наблюдение за ближайшим игроком
        this.setSkin();  // Установка скина
        this.setName();  // Установка ника
        this.tpWarp();  // Телепортация на варп
        this.fly();  // Включение полёта
      }
    });
  };

  // Функция для ответа ИИ
  aiAnswer(answer) {
    const strings = splitStringIntoList(answer);
    for (const el of strings) this.sendMsg(`/cc ${el}`)
  }

  // Функция для логина бота
  handleSpawn() {
    this.sendMsg(`/reg ${this.password}`);
    this.sendMsg(`/login ${this.password}`);
    this.sendMsg(`/${this.portal}`);
    console.log(`${this.nickname} has spawned`)
    this.antiTrap();
  };

  // Функция для переподключения бота
  reconnectBot(reason) {
    console.log(`${this.nickname} - Reconnection... (${reason})`);
    saveBlacklist();
    saveDeaths();
    delete this.bot;
    botsObj[this.curServer][this.portal].bot = null;
    if (reason === "Disabled by admin.") return;
    botsObj[this.curServer][this.portal].bot = new this.curClass(this.options);
  };

  // Функция для отправки сообщений с try/catch
  sendMsg(msg) {
    try {
      this.bot.chat(msg);
    } catch (err) {}
  };

  // Функция для отправки личных сообщений с try/catch
  sendLocalMsg(msg, user = this.lastUser) {
    try {
      this.bot.chat(`/m ${user} ${msg}`);
    } catch (err) {}
  };

  // Функция для телепортации на варп с try/catch
  tpWarp(warp = this.warp) {
    try {
      this.sendMsg(`/warp ${warp}`);
    } catch (err) {}
  };

  // Функция для полной очистки инвентаря
  clearInventory() {
    this.sendMsg("/head remove")
    setTimeout(() => this.sendMsg("/clear"), 500);
  };

  // Функция для записи логов в файл
  writeLog(text, path) {
    const date = new Date().toLocaleString();
    const logText = `[${date}]: ${text}\n`;
    const fullPath = `${LogRootPath}/${this.curServer}/${this.portal}/${path}.txt`;
    appendFile(fullPath, logText, (err) => {
      if (!err) return;
      if (err.code === "ENOENT") {
        const pathParts = fullPath.split("/");
        let currentPath = "";
        for (let i = 0; i < pathParts.length - 1; i++) {
          currentPath += pathParts[i] + "/";
          if (!existsSync(currentPath)) mkdirSync(currentPath);
        }
        writeFileSync(fullPath, logText);
      }
    });
  };

  // Функция для приглашения ближайшего игрока в клан
  invitePlayers() {
    setInterval(() => {
      try {
        const closestPlayer = this.bot.nearestEntity(entity => entity.type === "player");
        if (closestPlayer && !blacklist.includes(closestPlayer.username)) this.sendMsg(`/c invite ${closestPlayer.username}`);
      } catch (err) {}
    }, randInt(10000, 30000));
  };

  // Функция для авто рестарта бота
  autoReconnect() {
    setInterval(() => this.end("Restart"), 30 * 60 * 1000);
  };

  // Функция для полной остановки и удаления экземпляра бота
  deleteBot() {
    this.end("Disabled by admin.");
  };

  // Функция для обхода всех трапок / антитрапка +
  antiTrap() {
    try {
      this.bot.respawn();
      this.tpWarp();
    } catch (err) {}
  };

  // Функция для обхода всех трапок / антитрапка +
  end(reason) {
    try {
      this.bot.end(reason);
      this.tpWarp();
    } catch (err) {
      this.end(reason);
    }
  };

  // Функция для рассылки рандомного сообщения рекламы клана в глобальный чат
  sendAdvertisements() {};

  // Функция чтобы бот смотрел на ближайшего игрока
  lookAtNearestPlayer() {
    setInterval(() => {
      try {
        const entity = this.bot.nearestEntity(entity => entity.type === "player");
        if (entity) return this.bot.lookAt(entity.position.offset(0, entity.height, 0), false);
      } catch (err) {}
    }, 100);
  };

  // Функция для контроля эффектов у бота
  handleEffect() {
    this.sendMsg("/heal");
    this.tpWarp();
  };

  // Функция для просмотра
  handleBlockChange(oldState) {
    if (oldState.name !== "air") {
      this.checkChat = true;
      this.sendMsg("/rg i");
    }
  };

  // Отправка инвайта ближайшему игроку при спавне
  spawnInvite(entity) {
    if (entity?.username) this.sendMsg(`/c invite ${entity.username}`);
  };

  // Функция для установки скина
  setSkin(skin = this.skin) {
    this.sendMsg(`/skin ${skin}`);
  };

  // Функция для установки ника
  setName(name = this.name) {
    this.sendMsg(`/nickname ${name}`);
  };

  // Функция для полёта бота
  fly() {
    this.sendMsg("/gm 1");
    this.bot.creative.startFlying();
  };

  // Функция для парсинга информации о регионе
  parseRegionInfo() {
    const result = {
      name: "",
      owners: [],
      members: [],
    };
    for (const line of this.textMessage.split("\n")) {
      if (line.includes("Владельцы: ")) result.owners = line.replace("Владельцы: ", "").split(", ");
      else if (line.includes("Участники: ")) result.members = line.replace("Участники: ", "").split(", ");
      else if (line.includes("Регион: ")) result.name = line.replace("Регион: ", "").split(" ")[0];
    }
    return result;
  };

  // Функция для удаления игрока из региона если он ломает блоки
  swingArmTrigger(entity) {
    if (this.checkSwingArm && !(admins.includes(entity.username) && !(botList.includes(entity.username)) && (this.isPlayer(entity) && (this.rgInfo.name !== "__global__")))) {
      if (this.rgInfo.name === "__global__") return this.antiTrap();
      if (this.rgInfo.members.includes(entity.username)) this.sendMsg(`/rg removemember ${this.rgInfo.name} ${entity.username}`);
      else if (this.rgInfo.owners.includes(entity.username)) this.sendMsg(`/rg removeowner ${this.rgInfo.name} ${entity.username}`);
      const msgLog = `${entity.username} сломал блок! Region:\n${this.rgInfo.name} | ${this.rgInfo.owners} | ${this.rgInfo.members}\n`;
      this.emit("grieflog", msgLog);
      this.writeLog(msgLog, "GriefLog");
    }
  };

  // Функция для проверки игрок ли entity
  isPlayer(entity) {
    try {
      return entity.type === "player";
    } catch (err) {
      return false;
    }
  };

  // Функция для работы с сообщениями
  messagesMonitoring(message) {
    this.message = message;
    this.textMessage = this.message.getText(null);
    this.cmdMessages = this.textMessage.split(" ");

    if (this.isIgnorableMessage()) return;

    this.processRegionInfo();
    this.processChatMessage();
    this.processClanMessage();
    this.processKickMessage();
    this.processJoinMessage();
    this.processLeaveMessage();
    this.processKdrMessage();
    this.processCommandMessage();

    this.emit("chatlog", this.textMessage);
  };

  isIgnorableMessage() {};

  processChatMessage() {};

  processClanMessage() {
    if (this.textMessage.startsWith("КЛАН:")) {
      const curCommand = this.cmdMessages[3].toLowerCase();
      this.currentArg = this.cmdMessages[4];
      this.lastUser = this.cmdMessages[2];
      this.allArgs = this.cmdMessages.slice(4);
      this.writeLog(this.textMessage, "ClanLog");
      if (curCommand.startsWith("#")) {
        if (Object.keys(this.answerMessages).includes(curCommand))this.sendMsg(this.answerMessages[curCommand]);
      } else if (curCommand.startsWith(".бот")) {
        if (typeof this.answerMessages[curCommand] === "function") {
          if (ai.canAnswer) {
            this.sendMsg("/cc Генерирую ответ...");
            this.answerMessages[curCommand]();
            ai.canAnswer = false;
            return;
          }
          this.sendMsg("/cc Бот занят, попробуйте через пару секунд.");
          return;
        }
      }
    }
  };

  processKickMessage() {};

  processJoinMessage() {};

  processLeaveMessage() {};

  processKdrMessage() {};

  processCommandMessage() {};

  processRegionInfo() {
    if (this.checkChat) {
      this.rgInfo = this.parseRegionInfo();
      this.checkChat = false;
      this.checkSwingArm = true;
    }
  };

  // Функция для включения гриф-лога
  enableGLog() {
    this.on("grieflog", (message) => {
      try {
        tbot.emit("log", message, "rg")
      } catch (err) {}
    });
  };

  // Функция для выключения гриф-лога
  disableGLog() {
    try {
      this.removeListener("grieflog", () => {});
    } catch (err) {}
  };

  // Функция для включения клан-лога
  enableCLog() {
    this.on("chatlog", (message) => {
      try {
        tbot.emit("log", `[${this.portal}] [${new Date().toLocaleString()}] ${message}`, "chat", this.portal)
      } catch (err) {}
    });
  };

  // Функция для выключения клан-лога
  disableCLog() {
    try {
      this.removeListener("chatlog", () => {});
    } catch (err) {}
  };

  // Функция для автоматического включения логов
  autoEnable(field) {
    const actions = {
      "chat": this.enableCLog,
      "rg": this.enableGLog,
    }
    actions[field]();
  };

  // Функция для автоматического выключения логов
  autoDisable(field) {
    const actions = {
      "chat": this.disableCLog,
      "rg": this.disableGLog,
    }
    actions[field]();
  };
}
