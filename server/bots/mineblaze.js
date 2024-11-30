import {adMsgs, commandsMsgs} from "../../cfg.mjs";
import {randInt} from "../functions/functions.mjs";
import {MainBot} from "./main.js";


export class MBBot extends MainBot {
  constructor(options) {
    super(options, "mineblaze");
    this.matchCmdPattern = /\[(.*?)\s*->.*?]\s*(.*)/;
    this.matchKdrPattern = /убил\s*игрока\s*(.*)/;
    this.matchLeavePattern = /\|\s*(.*?)\s*покинул\s*клан\./;
    this.matchJoinPattern = /\|\s*(.*?)\s*присоеденился\s*к\s*клану\./;
  };

  sendAdvertisements() {
    super.sendAdvertisements();
    setInterval(() => this.sendMsg(adMsgs[randInt(0, adMsgs.length - 1)]), randInt(3.1*60*1000, 3.4*60*1000));
    setInterval(() => this.sendMsg(commandsMsgs["discordlink"]), randInt(60*1000, 2*60*1000));
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
      else if (!this.textMessage.startsWith("КЛАН")) this.writeLog(this.textMessage, "SystemLog");
    }
  };

  lookAtNearestPlayer() {
    super.lookAtNearestPlayer();

    setInterval(() => {
      try {
        const entity = this.bot.nearestEntity(entity => entity.type === "player");
        if (entity) return this.bot.lookAt(entity.position.offset(0, entity.height, 0), false);
      } catch (err) {}
    }, 100);
  };
}
