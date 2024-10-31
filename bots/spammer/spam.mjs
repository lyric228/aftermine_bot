import { HttpProxyAgent } from "http-proxy-agent";
import { createBot } from "mineflayer";
import { readFileSync } from "fs";


export function spam(options) {
  const nickname = options.nickname || "ChertHouse0";
  const portal = options.portal || "s2";
  const host = options.host || "ru.cheatmine.net";
  const password = options.password || "!afterHuila00pidor3svocvoRus";
  const agent = new HttpProxyAgent(`http://${getRandomProxy()}`);
  return new Bot(nickname, portal, password, host, agent);
}


export function getRandomProxy() {
  const proxies = readFileSync("../../server/data/proxy.txt", "utf-8").split("\n").filter(line => line.trim() !== "");
  const randomIndex = Math.floor(Math.random() * proxies.length);
  return proxies[randomIndex];
}


class Bot {
  constructor(nickname, portal, password, host, agent) {
    this.password = password;
    this.nickname = nickname;
    this.portal = portal;
    this.host = host;
    this.agent = agent;
    this.bot = createBot({
      username: this.nickname,
      host: this.host,
      agent: this.agent,
      version: "1.20.4",
      closeTimeout: 5 * 60 * 1000,
    });
    this.bot.on("spawn", () => this.handleSpawn());
    this.bot.on("end", (reason) => this.reconnectBot(reason));
    this.bot.on("error", (err) => this.bot.end(err.name))
    this.bot.on("death", () => this.bot.respawn());
  }

  handleSpawn() {
    this.sendMsg(`/reg ${this.password}`);
    this.sendMsg(`/login ${this.password}`);
    this.sendMsg(`/${this.portal}`);
    console.log(`${this.nickname} has spawned`)
  }

  reconnectBot(reason) {
    console.log(`${this.nickname} - Reconnection... (${reason})`);
    new this.constructor(this.nickname, this.portal, this.warp,this.password, this.host, this.agent);
  }

  sendMsg(msg) {
    try {
      this.bot.chat(msg);
    } catch (error) {}
  }

  deleteBot() {
    this.bot.end("Disabled by admin.");
    delete this;
  }
}
