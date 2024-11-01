import { HttpProxyAgent } from "http-proxy-agent";
import { createBot } from "mineflayer";
import { readFileSync } from "fs";
import { MWBan } from "./mw.js";
import { CMBan } from "./cm.js";


let botList = [];


export function startBanAll() {
  for (const player of MWBan) ban({nickname: player});
  for (const player of CMBan) ban({nickname: player, host: "ru.cheatmine.net"});
}


export function stopBanAll() {
  for (const player in botList) unban(player)
  botList = [];
}


function ban(options) {
  const nickname = options.nickname || "ChertHouse";
  const host = options.host || "ru.masedworld.net";
  const agent = new HttpProxyAgent(`http://${getRandomProxy()}`);
  botList.push(new Bot(nickname, host, agent));
}


function unban(nickname) {
  for (const i in botList) {
    if (botList[i].nickname === nickname) {
      botList[i] = null;
      return;
    }
  }
}


function getRandomProxy() {
  const proxies = readFileSync("proxy.txt", "utf-8").split("\n").filter(line => line.trim() !== "");
  const randomIndex = Math.floor(Math.random() * proxies.length);
  return proxies[randomIndex];
}


class Bot {
  constructor(nickname, host, agent) {
    this.nickname = nickname;
    this.host = host;
    this.agent = agent;
    this.bot = createBot({
      username: this.nickname,
      host: this.host,
    });
    this.bot.on("error", () => {});
    this.bot.on("end", () => this.reconnectBot());
    setInterval(() => this.bot.end("Restart"), 60 * 1000);
  }

  // Функция для переподключения бота
  reconnectBot() {
    this.agent = new HttpProxyAgent(`http://${getRandomProxy()}`);
    new this.constructor(this.nickname, this.host, this.agent, this.version);
  }
}


startBanAll();
