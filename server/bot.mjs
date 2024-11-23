import {
  LogsKeyboard,
  MultiPanelMenu,
  MultiPanelOther,
  PanelMenuKeyboard,
  PortalMenuKeyboardCM, PortalMenuKeyboardMB, PortalMenuKeyboardMP,
  PortalMenuKeyboardMW,
  ServerMenuKeyboard,
} from "./config/keyboards.mjs";
import {botsObj, botsObjData, startByServer} from "../index.mjs";
import {_admins, _DEFAULT_TOKEN} from "./config/cfg.mjs";
import {dateDiff} from "./functions/functions.mjs";
import TelegramBot from "node-telegram-bot-api";
import {EventEmitter} from "events";
import {DB} from "./db/db.mjs";
import {rename} from "fs";


export class TBot extends EventEmitter {
  call;
  data;
  chat;
  msg;
  constructor(options) {
    super();
    this.options = options || {};
    this.admins = this.options.admins || _admins;
    this.id = 6237798050;
    this.curSenders = [];
    this.args = [];
    this.token = this.options.token || _DEFAULT_TOKEN;
    this.db = new DB();
    this.db.createTable();
    this.bot = new TelegramBot(this.token, { polling: true });
    this.bot.on("error", (err) => console.log(err));
    this.commands();
    this.callbackCommands();
    this.messageEvents();
    console.log("Start!");
  }

  sendMessage(message) {
    try {
      return this.bot.sendMessage(this.id, message).then(function(resp) {}).catch(function(error) {});
    } catch (err) {}
  }

  sendInlineKBMessage(message, keyboard) {
    try {
      return this.bot.sendMessage(this.id, message, {
        reply_markup: JSON.stringify({inline_keyboard: keyboard}),
      });
    } catch (err) {}
  }

  onCommand(command, callback, options = null) {
    this.bot.onText(new RegExp(command), async (msg) => {
      try {
        if (this.admins.includes(msg.chat.id)) {
          this.msg = msg;
          this.id = this.msg.chat.id;
          this.db.id = this.id;
          this.db.createUser();
          if (options?.args > 0) {
            if (options.args > 0) {
              if (!options.argErrMsg) options.argErrMsg = `Ошибка аргументов!\nНужно ${options.args}, когда передано ${this.args.length}!`;
              this.args = this.msg.text.split(" ").slice(1);
              if (this.args.length === options.args) return callback();
              return await this.sendMessage(options.argErrMsg);
            }
          }
          return callback();
        }
        await this.sendMessage("Неуполномоченный!");
      } catch (err) {
        console.log(err);
      }
    });
  }

  commands() {
    this.bot.on("message", async (msg) => {
      const status = this.db.getData("status");
      if (status === "none") return;
      this.msg = msg;
      this.id = this.msg.chat.id;
      this.db.id = this.id;
      this.db.createUser();
      this.emit(status, msg);
      this.clearStatus();
    });
    this.onCommand("/start", async () => await this.sendMessage(`Привет, ${this.msg.from.first_name}!\nЭто админ панель великого лурика!\nЖми /menu и админь!`));
    this.onCommand("/menu", async () => await this.sendInlineKBMessage(`😭 Выбери сервер 😭`, ServerMenuKeyboard));
    this.onCommand("/set", async () => {
      const field = this.args[0].includes("chat") ? "chat" : "rg";
      const value = parseInt(this.args[1]) > 0 ? 1 : 0;
      this.db.updateData(field, value);
      const bot = botsObj[this.db.getData("server")][this.db.getData("portal")].bot;
      if (!bot) return await this.sendMessage("Сначала включите этого бота!");
      value === 1 ? bot.autoEnable(field) : bot.autoDisable(field);
      await this.sendMessage(`Теперь ${field} изменён на ${value}!`);
    }, { args: 2, argErrMsg: "Пользование:\n/set \<\chat/rg> <1/0>\n\nchat/rg/packets - 2 вида логов, чат и рг\n1/0 - включить/выключить\nДля какого бота будут включены логи зависит от последнего выбранного бота." });
  }


  callbackCommands() {
    this.bot.on("callback_query", async (call) => {
      try {
        this.call = call;
        this.id = this.call.from.id
        this.db.id = this.id;
        this.db.createUser();
        this.emit(call.data);
      } catch (err) {
        console.log(err);
      }
    });

    this.on("log", async (sendMsg, type, portal) => {
      if (this.db.getData("portal") === portal) {
        this.curSenders = this.db.getAllWhere("tgid", type, 1);
        for (const element of this.curSenders) {
          this.id = element["tgid"];
          await this.sendMessage(sendMsg);
        }
      }
    });

    this.on("sendmsg", async () => {
      if (this.getBotObj().status) {
        await this.sendMessage("Отправьте сообщение!");
        this.setStatus("chat");
      }
    });

    this.on("masedworld", async () => {
      this.sendInlineKBMessage(`👀 Выбери сервер 👀`, PortalMenuKeyboardMW);
      this.db.updateData("server", "masedworld");
    });

    this.on("cheatmine", async () => {
      this.sendInlineKBMessage(`👀 Выбери сервер 👀`, PortalMenuKeyboardCM);
      this.db.updateData("server", "cheatmine");
    });

    this.on("mineblaze", async () => {
      this.sendInlineKBMessage(`👀 Выбери сервер 👀`, PortalMenuKeyboardMB);
      this.db.updateData("server", "mineblaze");
    });

    this.on("multipanel", async () => {
      this.sendInlineKBMessage(`👀 Выбери действие 👀`, PortalMenuKeyboardMP);
    });

    this.on("s1", async () => this.setPortal("s1"));
    this.on("s2", async () => this.setPortal("s2"));
    this.on("s3", async () => this.setPortal("s3"));
    this.on("s4", async () => this.setPortal("s4"));
    this.on("s5", async () => this.setPortal("s5"));
    this.on("s6", async () => this.setPortal("s6"));
    this.on("s7", async () => this.setPortal("s7"));
    this.on("s8", async () => this.setPortal("s8"));
    this.on("s9", async () => this.setPortal("s9"));
    this.on("s10", async () => this.setPortal("s10"));

    this.on("enable", async () => {
      if (!this.getBotObj().status) {
        this.setBotObjField("bot", this.getObjData());
        this.setBotObjField("time", new Date());
        this.setBotObjField("status", true);
      }
    });

    this.on("disable", async () => {
      if (this.getBotObj().status) {
        this.getBotObj().bot.deleteBot();
        this.setBotObjField("bot", null);
        this.setBotObjField("time", new Date());
        this.setBotObjField("status", false);
      }
    });

    this.on("multimw", async () => {
      this.db.updateData("server", "masedworld");
      this.sendInlineKBMessage(`👀 Выбери действие 👀`, MultiPanelMenu);
    });

    this.on("multicm", async () => {
      this.db.updateData("server", "cheatmine");
      this.sendInlineKBMessage(`👀 Выбери действие 👀`, MultiPanelMenu);
    });

    this.on("multimb", async () => {
      this.db.updateData("server", "mineblaze");
      this.sendInlineKBMessage(`👀 Выбери действие 👀`, MultiPanelMenu);
    });

    this.on("multiother", async () => {
      this.sendInlineKBMessage(`👀 Выбери действие 👀`, MultiPanelOther);
    });

    this.on("logs", async () => {
      this.sendInlineKBMessage(`👀 Выбери действие 👀`, LogsKeyboard);
    });

    this.on("sendmsgall", async () => {
      await this.sendMessage("Напишите сообщение:");
      this.setStatus("postmsgall");
    });

    this.on("enableall", async () => {
      await this.sendMessage("Включаю всех ботов...");
      const server = this.db.getData("server");
      for (let i = 0; i < botsObj[server].length; i++) {
        const portal = `s${i + 1}`;
        if (botsObj[server][portal].status) continue;
        this.setBotObjField("bot", botsObjData[server][portal](), portal);
        this.setBotObjField("time", new Date(), portal);
        this.setBotObjField("status", true, portal);
        botsObj[server][portal].bot = startByServer(server);
      }
      await this.sendMessage("Все боты включены!");
    });

    this.on("disableall", async () => {
      await this.sendMessage("Выключаю всех ботов...");
      const server = this.db.getData("server");
      for (let i = 0; i < botsObj[server].length; i++) {
        const portal = `s${i + 1}`;
        if (botsObj[server][portal].status) {
          this.setBotObjField("time", new Date());
          botsObj[server][portal].bot.deleteBot();
          this.setBotObjField("bot", null);
          this.setBotObjField("status", false, portal);
        }
      }
      await this.sendMessage("Все боты выключены!");
    });

    this.bot.on("document", async (msg) => {
      this.msg = msg;
      this.emit("document");
    });

    this.on("downloadbl", async () => this.sendFile("server/data/blacklist.txt"));

    this.on("downloaddeaths", async () => this.sendFile("server/data/deaths.json"));

    this.on("uploadbl", async () => await this.fileUploader("blacklist.txt"));

    this.on("uploaddeaths", async () => await this.fileUploader("deaths.json"));

    this.on("downloadgllog", async () => this.sendFile(`server/logs/${this.db.getData("server")}/${ this.db.getData("portal")}/GlobalLog.txt`));

    this.on("downloadllog", async () => this.sendFile(`server/logs/${this.db.getData("server")}/${ this.db.getData("portal")}/LocalLog.txt`));

    this.on("downloadgrlog", async () => this.sendFile(`server/logs/${this.db.getData("server")}/${ this.db.getData("portal")}/GriefLog.txt`));

    this.on("downloadcllog", async () => this.sendFile(`server/logs/${this.db.getData("server")}/${ this.db.getData("portal")}/ClanLog.txt`));


    this.on("uploadgllog", async () => await this.fileUploader("GlobalLog.txt", `server/logs/${this.db.getData("server")}/${ this.db.getData("portal")}`));

    this.on("uploadllog", async () => await this.fileUploader("LocalLog.txt", `server/logs/${this.db.getData("server")}/${ this.db.getData("portal")}`));

    this.on("uploadgrlog", async () => await this.fileUploader("GriefLog.txt", `server/logs/${this.db.getData("server")}/${ this.db.getData("portal")}`));

    this.on("uploadcllog", async () => await this.fileUploader("ClanLog.txt", `server/logs/${this.db.getData("server")}/${ this.db.getData("portal")}`));
  }
  messageEvents() {
    this.onStatus("chat", async () => {
      const curBot = this.getBotObj();
      if (curBot) {
        curBot.bot.sendMsg(this.msg.text);
        await this.sendMessage(`Отправлено сообщение: ${this.msg.text}`);
      } else await this.sendMessage("Запустите бота!");
    });

    this.onStatus("postmsgall", async () => {
      const server = this.db.getData("server");
      for (let i = 0; i < botsObj[server].length; i++) {
        const portal = `s${i + 1}`;
        if (botsObj[server][portal].bot) botsObj[server][portal].bot.sendMsg(this.msg.text);
      }
      await this.sendMessage(`На ${server.toUpperCase()} отправлено сообщение: ${this.msg.text}`);
    });
  }

  setStatus(status) {
    this.db.updateData("status", status);
  }

  clearStatus() {
    this.setStatus("none");
  }

  onStatus(event, callback) {
    this.on(event, (msg) => {
      this.msg = msg;
      this.id = this.msg.chat.id;
      this.db.id = this.id;
      this.db.createUser();
      callback();
    });
  }

  setPortal(portal) {
    this.db.updateData("portal", portal);
    const curTime = dateDiff(this.getBotObj().time);
    this.sendInlineKBMessage(`Онлайн: ${curTime.d}д. ${curTime.h}ч. ${curTime.m}м. ${curTime.s}с.\n`, PanelMenuKeyboard);
  }

  getBotObj() {
    return botsObj[this.db.getData("server")][this.db.getData("portal")];
  }

  setBotObjField(field, obj, portal = this.db.getData("portal"), server = this.db.getData("server")) {
    botsObj[server][portal][field] = obj;
  }

  getObjData() {
    return botsObjData[this.db.getData("server")][this.db.getData("portal")]();
  }

  sendFile(path) {
    try {
      return this.bot.sendDocument(this.id, path, {}, {contentType: "application/octet-stream"});
    } catch (err) {}
  }

  async fileUploader(filename, path = "server/data") {
    await this.sendMessage("Отправьте файл!");
    const callback = async () => {
      try {
        if (this.msg.document) {
          await this.bot.downloadFile(this.msg.document.file_id, path).then((value) => rename(`${value}`, `${path}/${filename}`, () => {
          }));
          await this.sendMessage("Файл успешно загружен!")
        }
        this.removeListener("document", callback);
      } catch (err) {}
    }
    this.on("document", callback);
  }
}


export let tbot = new TBot();
