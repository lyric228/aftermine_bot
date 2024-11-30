import {adMsgs, commandsMsgs} from "../../cfg.mjs";
import {randInt} from "../functions/functions.mjs";
import {MainBot} from "./main.js";


export class MWBot extends MainBot {
  constructor(options) {
    super(options, "masedworld");
    this.matchCmdPattern = /›\[\s*(.*?)\s*->.*?]\s*(.*)/;
    this.matchKdrPattern = /(.*?) убил игрока (.*)/;
    this.matchLeavePattern = /› (.*) покинул клан\./;
    this.matchJoinPattern = /› (.*) присоеденился к клану\./;
  }

  sendAdvertisements() {
    super.sendAdvertisements();
    setInterval(() => this.sendMsg(adMsgs[randInt(0, adMsgs.length - 1)]), randInt(2.1*60*1000, 3*60*1000));
    setInterval(() => this.sendMsg(commandsMsgs["discord"]), randInt(60*1000, 2*60*1000));
  }

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
      else if (!this.textMessage.startsWith("КЛАН")) this.writeLog(this.textMessage, "SystemLog");
    }
  }
}
