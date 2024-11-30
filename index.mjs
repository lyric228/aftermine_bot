import {BlacklistPath, DeathsPath, ProxyPath} from "./cfg.mjs";
import {randInt} from "./server/functions/functions.mjs";
import {MWBot} from "./server/bots/masedworld.js";
import {CMBot} from "./server/bots/cheatmine.js";
import {MBBot} from "./server/bots/mineblaze.js";
import {readFileSync, writeFileSync} from "fs";
import cache from "memory-cache";


export let playerDeaths;
export let blacklist;
export let botList = [];
export const botsObjData = {
  "masedworld": {
    "s1": () => { return startBotMW({nickname: "VectorKemper1ng", portal: "s1"}) },
    "s2": () => { return startBotMW({nickname: "Kemper1ng", portal: "s2"}) },
    "s3": () => { return startBotMW({nickname: "NeoKemper1ng", portal: "s3"}) },
    "s4": () => { return startBotMW({nickname: "SCPbotSH", portal: "s4"}) },
    "s5": () => { return startBotMW({nickname: "Alfhelm", portal: "s5"}) },
    "s6": () => { return startBotMW({nickname: "QuaKemper1ng", portal: "s6"}) },
    "s7": () => { return startBotMW({nickname: "AntiKemper1ng", portal: "s7"}) },
    "s8": () => { return startBotMW({nickname: "Temper1ng", portal: "s8"}) },
  },
  "cheatmine": {
    "s1": () => { return startBotCM({nickname: "Tramp2024", portal: "s1"}) },
    "s2": () => { return startBotCM({nickname: "Ryfkin228", portal: "s2"}) },
  },
  "mineblaze": {
    "s1": () => { return startBotMB({nickname: "lohkgwg1", portal: "s1"}) }, // lohkgwg1 s1
    "s2": () => { return startBotMB({nickname: "TARAKAN2149", portal: "s2"}) }, // TARAKAN2149 s2
    "s3": () => { return startBotMB({}) }, // Vkabababa s3
    "s4": () => { return startBotMB({}) }, // __IRISHKA__ s4
    "s5": () => { return startBotMB({}) }, // TYTSFS s5
    "s6": () => { return startBotMB({}) }, // s6
    "s7": () => { return startBotMB({}) }, // KoTiK_B_KeDaX s7
    "s8": () => { return startBotMB({}) }, // s8
    "s9": () => { return startBotMB({}) }, // s9
    "s10": () => { return startBotMB({}) }, // s10
  },
};
export let botsObj = {
  "masedworld": {
    "s1": { bot: null, time: null, online: false },
    "s2": { bot: null, time: null, online: false },
    "s3": { bot: null, time: null, online: false },
    "s4": { bot: null, time: null, online: false },
    "s5": { bot: null, time: null, online: false },
    "s6": { bot: null, time: null, online: false },
    "s7": { bot: null, time: null, online: false },
    "s8": { bot: null, time: null, online: false },
  },
  "cheatmine": {
    "s1": { bot: null, time: null, online: false },
    "s2": { bot: null, time: null, online: false },
  },
  "mineblaze": {
    "s1": { bot: null, time: null, online: false },
    "s2": { bot: null, time: null, online: false },
    "s3": { bot: null, time: null, online: false },
    "s4": { bot: null, time: null, online: false },
    "s5": { bot: null, time: null, online: false },
    "s6": { bot: null, time: null, online: false },
    "s7": { bot: null, time: null, online: false },
    "s8": { bot: null, time: null, online: false },
    "s9": { bot: null, time: null, online: false },
    "s10": { bot: null, time: null, online: false },
  },
};
loadBlacklist();
loadDeaths();
setInterval(() => cache.clear(), 5 * 60 * 1000);

// Функция для сохранения данных в черный список
export function saveBlacklist() {
  blacklist.sort(() => Math.random() - 0.5);
  writeFileSync(BlacklistPath, blacklist.join("\n"));
}

// Функция для загрузки данных из черного списка
export function loadBlacklist() {
  try {
    blacklist = readFileSync(BlacklistPath).toString().split("\n");
  } catch (err) {
    if (err.code === "ENOENT") blacklist = [];
  }
}

// Функция для сохранения данных о смертях
export function saveDeaths() {
  const jsonDeaths = JSON.stringify(playerDeaths);
  writeFileSync(DeathsPath, jsonDeaths);
}

// Функция для загрузки данных о смертях
export function loadDeaths() {
  try {
    playerDeaths = JSON.parse(readFileSync(DeathsPath).toString());
  } catch (err) {
    if (err.code === "ENOENT") playerDeaths = {};
  }
}


export function startByServer(server, options) {
  try {
    const functions = {
      "masedworld": () => { return startBotMW(options) },
      "cheatmine": () => { return startBotCM(options) },
      "mineblaze": () => { return startBotMB(options) },
    }
    return functions[server]();
  } catch (err) {
    console.log(err);
  }
}


export function startBotMW(options) {
  options.nickname = options.nickname || "Kemper1ng";
  options.portal = options.portal || "s2";
  return new MWBot(options);
}


export function startBotCM(options) {
  options.nickname = options.nickname || "Tramp2024";
  options.portal = options.portal || "s1";
  return new CMBot(options);
}


export function startBotMB(options) {
  options.nickname = options.nickname || "lohkgwg1";
  options.portal = options.portal || "s1";
  return new MBBot(options);
}


export function getRandomProxy() {
  const proxies = readFileSync(ProxyPath, "utf-8").split("\n").filter(line => line.trim() !== "");
  return proxies[randInt(0, proxies.length)];
}
