import {MainBot} from "./main.js";
import {adMsgs, commandsMsgs} from "../../cfg.mjs";
import {randInt} from "../functions/functions.mjs";


export class MWBot extends MainBot {
  constructor() {
    super();
  }

  sendAdvertisements() {
    super.sendAdvertisements();
    setInterval(() => this.sendMsg(adMsgs[randInt(0, adMsgs.length - 1)]), randInt(2.1*60*1000, 3*60*1000));
    setInterval(() => this.sendMsg(commandsMsgs["discord"]), randInt(60*1000, 2*60*1000));
  }
}
