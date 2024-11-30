import {
  admins,
  commandsMsgs, FreezeTrollMsg,
  LogRootPath, PatternOptions, PublicName, PublicPassword,
  PublicSkin, PublicVersion, PublicWarp,
  unterMsgs,
} from "../../cfg.mjs";
import {
  blacklist,
  botList,
  getRandomProxy,
  saveBlacklist,
  loadBlacklist,
  saveDeaths,
  playerDeaths
} from "../../index.mjs";
import {appendFile, existsSync, mkdirSync, writeFileSync} from "fs";
import {randInt} from "../functions/functions.mjs";
import {HttpProxyAgent} from "http-proxy-agent";
import {EventEmitter} from "events";
import * as mf from "mineflayer";
import {tbot} from "../bot.mjs";
import {ai} from "../ai/ai.js";


export class MainBot extends EventEmitter {
  matchLeavePattern;
  matchJoinPattern;
  matchClanPattern;
  matchCmdPattern;
  matchKdrPattern;
  textMessage;
  cmdMessages;
  username;
  message;
  agent;
  constructor(options, server) {
    super();
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
      "бот": () => {
        const ask = this.allArgs.join(" ");
        if (ask.trim() === "") return;
        ai.getAnswer(ask, {
          nickname: this.nickname,
          portal: this.portal,
          server: this.curServer,
          player: this.lastUser,
        }).then(() => {});
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
    this.matchClanPattern = /^КЛАН: .*? (.*?): (.*)$/;
    this.endCount = 0;
    this.spawnCount = 0;
    this.nickname = options.nickname;
    this.portal = options.portal;
    this.options = options;
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
    this.botOptions = {
      username: this.nickname,
      host: this.host,
      agent: this.agent,
      version: this.version,
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
    this.START();
  };

  // Функция для старта бота
  START() {
    if (botList.includes(this.nickname)) return;
    botList.push(this.nickname);
    this.agent = new HttpProxyAgent(`http://${getRandomProxy()}`);
    this.bot = mf.createBot(this.botOptions);
    this.bot.setMaxListeners(1000);
    this.setMaxListeners(1000);
    this.bot.on("end", (reason) => this.reconnectBot(reason));
    this.bot.on("error", (err) => console.log(err));
    this.bot.on("spawn", () => {
      this.spawnCount++;
      this.handleSpawn();
      if (this.spawnCount === 2) {
        this.bot.inventory.on("updateSlot", () => this.clearInventory());
        this.bot.on("entitySpawn", (entity) => this.spawnInvite(entity));
        this.bot.on("message", (message) => this.messagesMonitoring(message));
        this.bot.on("forcedMove", () => this.antiTrap());
        this.bot.on("entityEffect", () => this.handleEffect());
        this.bot.on("respawn", () => this.antiTrap());
        this.lookAtNearestPlayer();  // Наблюдение за ближайшим игроком
        this.sendAdvertisements();  // Отправка рекламы
        this.setChatTriggers();  // Установка триггеров для чата
        this.invitePlayers();  // Приглашение ближайшего игрока
        this.autoReconnect();  // Рестарт бота раз в пол часа
        this.setSkin();  // Установка скина
        this.setName();  // Установка ника
        this.tpWarp();  // Телепортация на варп
        this.fly();  // Включение полёта
      }
    });
  }

  // Функция для логина бота
  handleSpawn() {
    this.sendMsg(`/reg ${this.password}`);
    this.sendMsg(`/login ${this.password}`);
    this.sendMsg(`/${this.portal}`);
    this.antiTrap();
    console.log(`${this.nickname} has spawned`)
  };

  // Функция для переподключения бота
  reconnectBot(reason = null) {
    try {
      if (reason === "Disabled by admin.") return;
      console.log(`${this.nickname} - Reconnection... (${reason})`);
      this.START();
    } catch (err) {
      console.log(err);
    }
  }

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
    const logText = `[${new Date().toLocaleString()}]: ${text}\n`;
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
    this.endCount++;
    if (this.endCount < 10) {
      try {
        this.bot.end(reason);
        this.endCount = 0;
      } catch (err) {}
    }
  };

  // Функция для рассылки рандомного сообщения рекламы клана в глобальный чат
  sendAdvertisements() {};

  // Функция чтобы бот смотрел на ближайшего игрока
  lookAtNearestPlayer() {};

  // Функция для контроля эффектов у бота
  handleEffect() {
    this.sendMsg("/heal");
    this.tpWarp();
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

  // Функция для работы с сообщениями
  messagesMonitoring(message) {
    this.message = message;
    this.textMessage = this.message.getText(null);
    this.cmdMessages = this.textMessage.split(" ");

    this.processChatMessage();

    if (this.textMessage.trim() !== "") this.emit("chatlog", this.textMessage);
  };

  setChatTriggers() {
    this.bot.addChatPattern("cmd", this.matchCmdPattern, PatternOptions);
    this.bot.addChatPattern("kdr", this.matchKdrPattern, PatternOptions);
    this.bot.addChatPattern("join", this.matchJoinPattern, PatternOptions);
    this.bot.addChatPattern("leave", this.matchLeavePattern, PatternOptions);

    this.bot.addChatPattern("cc", this.matchClanPattern, PatternOptions);
    this.bot.addChatPattern("ft", FreezeTrollMsg, PatternOptions);


    this.bot.on("chat:cmd", match => {
      match = match[0];
      let messages = match[1].split(" ");
      this.allArgs = messages.slice(1);
      this.currentArg = this.allArgs[0];
      this.lastUser = match[0];
      this.processCommandMessage(this.lastUser, messages[0]);
    });

    this.bot.on("chat:kdr", match => {
      const killedPlayer = match[0][1];
      if (botList.includes(killedPlayer) || admins.includes(killedPlayer)) return;
      if (typeof playerDeaths[killedPlayer] !== "number") playerDeaths[killedPlayer] = 0;
      playerDeaths[killedPlayer] += 1;
      const deathsCount = playerDeaths[killedPlayer]
      if (deathsCount > 4) {
        this.sendMsg(`/c kick ${killedPlayer}`);
        blacklist.push(killedPlayer);
        saveBlacklist();
      }
      saveDeaths();
    });

    this.bot.on("chat:join", match => {
      const user = match[0][0];
      if (blacklist.includes(user) || (playerDeaths[user] && playerDeaths[user] > 4)) return this.sendMsg(`/c kick ${user}`);
      if (typeof playerDeaths[user] !== "number") playerDeaths[user] = 0;
      this.sendMsg(`/cc Добро пожаловать в клан, ${user}! Обязательно вступи в наш дискорд, там много всего интересного! Если хочешь вступить в наш дискорд сервер, то пиши мне - kotik16f`);
    });

    this.bot.on("chat:leave", match => {
      this.sendMsg(`/cc ${match[0][0]} выходит из клана, ОБОССАТЬ И НА МОРОЗ!`);
    });

    this.bot.on("chat:cc", match => {
      match = match[0];
      const msg = match[1].split(" ");
      this.currentArg = msg[1];
      this.lastUser = match[0];
      this.allArgs = msg.slice(1);
      this.processClanMessage(msg[0].toLowerCase());
      this.writeLog(this.textMessage, "ClanLog");
    });

    this.bot.on("chat:ft", () => this.end("Freeze troll"));
  };

  processChatMessage() {};

  processClanMessage(cmd) {
    if (cmd.startsWith("#")) {
      if (Object.keys(this.answerMessages).includes(cmd))this.sendMsg(this.answerMessages[cmd]);
    } else if (cmd.includes("бот")) {
      if (typeof this.answerMessages[cmd] === "function") {
        if (ai.canAnswer) {
          this.sendMsg("/cc Генерирую ответ...");
          this.answerMessages[cmd]();
          ai.canAnswer = false;
          return;
        }
        this.sendMsg("/cc Бот занят, попробуйте через пару секунд.");
        return;
      }
    }
  };

  processCommandMessage(username, command) {
    if (admins.includes(username)) {
      if (Object.keys(this.adminAnswerMessages).includes(command)) {
        try {
          if (typeof this.adminAnswerMessages[command] === "function") {
            this.sendMsg(this.adminAnswerMessages[command]());
            return;
          }
          this.sendMsg(this.adminAnswerMessages[command]);
        } catch (err) {}
      }
    } else if (command === "#invite") this.sendMsg(`/c invite ${username}`);
  };

  // Функция для включения клан-лога
  enableLog() {
    this.on("chatlog", (message) => {
      try {
        tbot.emit("log", `[${this.portal}] [${new Date().toLocaleString()}] ${message}`, this.portal)
      } catch (err) {}
    });
  };

  // Функция для выключения клан-лога
  disableLog() {
    try {
      this.removeListener("chatlog", () => {});
    } catch (err) {}
  };
}
