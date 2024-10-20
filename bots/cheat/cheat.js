import { HttpProxyAgent } from "http-proxy-agent";
import { createBot } from "mineflayer";
import { readFileSync } from "fs";


export function startBot(options) {
  const nickname = options.nickname || "ChertHouse0";
  const portal = options.portal || "s2";
  const host = options.host || "ru.cheatmine.net";
  const warp = options.warp || "AfterDark";
  const password = options.password || "!afterHuila00pidor3svocvoRus";
  const agent = new HttpProxyAgent(`http://${getRandomProxy()}`);
  return new Bot(nickname, portal, warp, password, host, agent);
}


export function getRandomProxy() {
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
      closeTimeout: 5 * 60 * 1000,
    });
    let spawnTrigger = this.bot.on("spawn", () => this.handleSpawn());
    this.bot.on("end", (reason) => this.reconnectBot(reason));
    this.bot.on("error", (err) => this.bot.end(err.name))
    this.bot.on("death", () => this.bot.respawn());
    this.bot.on("respawn", () =>  this.tpWarp());
    setTimeout(() => {
      spawnTrigger = this.bot.on("spawn", () => this.tpWarp());
      setInterval(() =>  this.tpWarp(), 1000);
    }, 5000)
  }

  // Функция для логина бота
  handleSpawn() {
    this.sendMsg(`/reg ${this.password}`);
    this.sendMsg(`/login ${this.password}`);
    this.sendMsg(`/${this.portal}`);
    console.log(`${this.nickname} has spawned`)
  }

  // Функция для переподключения бота
  reconnectBot(reason) {
    console.log(`${this.nickname} - Reconnection... (${reason})`);
    new this.constructor(this.nickname, this.portal, this.warp,this.password, this.host, this.agent);
  }

  // Функция для отправки сообщений с try/catch
  sendMsg(msg) {
    try {
      this.bot.chat(msg);
    } catch (error) {}
  }

  // Функция для телепортации на варп с try/catch
  tpWarp(warp = this.warp) {
    try {
      this.sendMsg(`/warp ${warp}`);
    } catch (error) {}
  }

  // Функция для полной остановки и удаления экземпляра бота
  deleteBot() {
    this.bot.end("Disabled by admin.");
    delete this;
  }
}
