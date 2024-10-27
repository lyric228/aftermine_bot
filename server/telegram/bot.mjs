import {startBanAll, stopBanAll} from "../../bots/blocker/blocker.mjs";
import TelegramBot from "node-telegram-bot-api"


class Bot {
  constructor(options) {
    this.options = options || {};
    this.admins = this.options.admins || [
      6237798050,
      7097521215,
      5011500698,
      7137241219,
    ];
    this.msg = null;
    this.chatId = null;
    this.args = [];
    this.host = "ru.masedworld.net";
    this.token = this.options.token || "7958835984:AAFkbm4oUzsjZKiLUntCYxYovF_Tzh3R0qI";
    this.bot = new TelegramBot(this.token, {polling: true});
    this.main();
    console.log("Start!");
  }

  sendMessage(message, id = this.chatId) {
    return this.bot.sendMessage(id, message);
  }

  onCommand(command, callback, args = 0) {
    this.bot.onText(new RegExp(command), (msg) => {
      this.msg = msg;
      this.chatId = this.msg.chat.id;
      this.args = this.msg.text.split(" ").slice(1);
      if (this.admins.includes(this.chatId)) {
        if (this.args.length === args) callback();
        else this.sendMessage(`Ошибка аргументов!\nНужно ${args}, когда передано ${this.args.length}!`);
      }
      else this.sendMessage("Неуполномоченный!");
    });
  }

  main() {
    this.onCommand("/start", () => {
      this.sendMessage(`Привет, ${this.msg.from.first_name}!\nЭто админ панель великого лурика!\nЧтобы посмотреть все команды напиши /commands`);
    });

    this.onCommand("/commands", () => {
      this.sendMessage("Вот все команды бота!\n" +
        "/ban\n" +
        "/unban\n" +
        "/masedworld\n" +
        "/cheatmine\n");
    });

    this.onCommand("/ban", () => {
      this.sendMessage("Начинаю блокировку!");
      startBanAll();
    });

    this.onCommand("/unban", () => {
      this.sendMessage("Останавливаю блокировку!");
      stopBanAll();
    });
  }
}


new Bot();
