import {blacklist, botList, playerDeaths, saveBlacklist, saveDeaths} from "../../index.mjs";
import {admins, adMsgs, commandsMsgs} from "../../cfg.mjs";
import {randInt} from "../functions/functions.mjs";
import {MainBot} from "./main.js";


export class MWBot extends MainBot {
  constructor(options) {
    super(options, "masedworld", MWBot);
  }

  sendAdvertisements() {
    super.sendAdvertisements();
    setInterval(() => this.sendMsg(adMsgs[randInt(0, adMsgs.length - 1)]), randInt(2.1*60*1000, 3*60*1000));
    setInterval(() => this.sendMsg(commandsMsgs["discord"]), randInt(60*1000, 2*60*1000));
  }

  isIgnorableMessage() {
    super.isIgnorableMessage();

    return !!(this.textMessage === " " || this.textMessage.startsWith("› -------- ⦗Информация о регионе⦘ --------"));
  };

  processChatMessage() {
    super.processChatMessage();

    if (this.textMessage.startsWith("[ʟ]") || this.textMessage.startsWith("[ɢ]")) {
      try {
        this.username = this.message.json.extra[0].clickEvent.value.split(" ")[1];
      } catch (err) {}
      const index = this.cmdMessages.indexOf("⇨");

      if (index !== -1) {
        this.cmdMessages[index-1] = this.username;
        this.textMessage = this.cmdMessages.join(" ");
      }
      if (this.textMessage.startsWith("[ɢ]")) this.writeLog(this.textMessage, "GlobalLog");
      else if (this.textMessage.startsWith("[ʟ]")) this.writeLog(this.textMessage, "LocalLog");
    }
  }

  processKickMessage() {
    super.processKickMessage();

    if (this.textMessage === "Пожайлуста прекратите читерить или вы будете забанены!") this.bot.end("Freeze troll");
  }

  processJoinMessage() {
    super.processJoinMessage();
    const matchJoin = this.textMessage.match(/› (.*?) присоеденился к клану\./);

    if (matchJoin?.[1]) {
      const newMember = matchJoin[1];
      if (blacklist.includes(newMember) || (playerDeaths[newMember] && playerDeaths[newMember] > 4)) return this.sendMsg(`/c kick ${newMember}`);
      if (playerDeaths[newMember]) playerDeaths[newMember] = 0;
      this.sendMsg(`/cc Добро пожаловать в клан, ${newMember}! Обязательно вступи в наш дискорд, там много всего интересного! Если хочешь вступить в наш дискорд сервер, то пиши мне - kotik16f`);
    }
  }

  processLeaveMessage() {
    super.processLeaveMessage();
    const matchLeave = this.textMessage.match(/› (.*?) покинул клан\./);
    if (matchLeave?.[1]) this.sendMsg(`/cc ${matchLeave[1]} выходит из клана, ОБОССАТЬ И НА МОРОЗ!`);
  }

  processKdrMessage() {
    super.processKdrMessage();
    const matchKdr = this.textMessage.match(/(.*?) убил игрока (.*)/);

    if (matchKdr?.[1]) {
      let killedPlayer = matchKdr[2];
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
    }
  }

  processCommandMessage() {
    super.processCommandMessage();
    const matchCmd = this.textMessage.match(/^›\[(.*?) -> я] (.*)$/);
    if (matchCmd?.[1]) {
      let messages = matchCmd[2].split(" ");
      let username = matchCmd[1];
      let command = messages[0];
      this.allArgs = messages.slice(1);
      this.currentArg = this.allArgs[0];
      this.lastUser = username;

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
    }
  }
}
