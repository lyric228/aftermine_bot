import { HttpProxyAgent } from "http-proxy-agent";
import { readFileSync, writeFileSync } from "fs";
import { createBot } from "mineflayer";


let botList = [];
let CMBanList = [];
let MWBanList = [];
let isListsLoaded = false;


function getData(name, separator = "\r\n") {
  return readFileSync(`server/data/${name}.txt`, "utf-8").split(separator).filter(line => line.trim() !== "");
}


function setData(name, data, separator = "\r\n") {
  writeFileSync(`/server/data/${name}.txt`, data.join(separator))
}


export function startBanAll() {
  if (!isListsLoaded) {
    CMBanList = getData("CMban");
    MWBanList = getData("MWban");
    isListsLoaded = true;
  }
  for (const player of MWBanList) ban({nickname: player});
  for (const player of CMBanList) ban({nickname: player});
}


export function stopBanAll() {
  for (const player in botList) unban(player)
  isListsLoaded = false;
  botList = [];
}


function ban(options) {
  const nickname = options.nickname || "ChertHouse";
  const version = options.version || "1.20.4";
  const host = options.host || "ru.masedworld.net";
  const agent = new HttpProxyAgent(`http://${getRandomProxy()}`);
  botList.push(new Bot(nickname, host, agent, version));
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
  const proxies = readFileSync("server/data/proxy.txt", "utf-8").split("\n").filter(line => line.trim() !== "");
  const randomIndex = Math.floor(Math.random() * proxies.length);
  return proxies[randomIndex];
}


class Bot {
  constructor(nickname, host, agent, version) {
    this.nickname = nickname;
    this.host = host;
    this.agent = agent;
    this.version = version;
    this.bot = createBot({
      username: this.nickname,
      host: this.host,
      agent: this.agent,
      version: this.version,
    });
    this.bot.on("error", () => {});
    this.bot.on("end", (reason) => this.reconnectBot(reason));
    setInterval(() => this.bot.end("Restart"), 60 * 1000);
  }

  // Функция для переподключения бота
  reconnectBot(reason) {
    if (reason !== "Restart") setTimeout(() => {
      this.agent = new HttpProxyAgent(`http://${getRandomProxy()}`);
    }, 5 * 1000);
    new this.constructor(this.nickname, this.host, this.agent, this.version);
  }
}
