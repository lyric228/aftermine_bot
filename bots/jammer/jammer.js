import { HttpProxyAgent } from "http-proxy-agent";
import { createBot } from "mineflayer";
import { readFileSync } from "fs";


export function startBanCM(options) {
  const nickname = options.nickname || "ChertHouse0";
  const portal = options.portal || "s2";
  const host = options.host || "ru.cheatmine.net";
  const warp = options.warp || "AfterDark";
  const password = options.password || "!afterHuila00pidor3svocvoRus";
  const agent = new HttpProxyAgent(`http://${getRandomProxy()}`);
  return new Bot(nickname, portal, warp, password, host, agent);
}


export function startBanMW(options) {
  const nickname = options.nickname || "ChertHouse0";
  const portal = options.portal || "s2";
  const host = options.host || "ru.masedworld.net";
  const warp = options.warp || "AfterDark";
  const password = options.password || "!afterHuila00pidor3svocvoRus";
  const agent = new HttpProxyAgent(`http://${getRandomProxy()}`);
  return new Bot(nickname, portal, warp, password, host, agent);
}


function getRandomProxy() {
  const proxies = readFileSync("../../server/data/proxy.txt", "utf-8").split("\n").filter(line => line.trim() !== "");
  const randomIndex = Math.floor(Math.random() * proxies.length);
  return proxies[randomIndex];
}


class Bot {
  constructor(nickname, portal, warp, password, host, agent) {
    this.password = password;
    this.nickname = nickname;
    this.portal = portal;
    this.warp = warp;
    this.host = host;
    this.agent = agent;
    this.bot = createBot({
      username: this.nickname,
      host: this.host,
      agent: this.agent,
    });
    this.bot.on("end", (reason) => this.reconnectBot(reason));
    setInterval(() => this.bot.end("Restart"), 60 * 1000);
  }

  // Функция для переподключения бота
  reconnectBot(reason) {
    if (reason === "socketClosed") setTimeout(() => {}, 15000);
    else console.log(`${this.nickname} - Reconnection... (${reason})`);
    this.agent = new HttpProxyAgent(`http://${getRandomProxy()}`);
    new this.constructor(this.nickname, this.portal, this.warp,this.password, this.host, this.agent);
  }

  // Функция для полной остановки и удаления экземпляра бота
  deleteBot() {
    this.bot.end("Disabled by admin.");
    delete this;
  }
}
