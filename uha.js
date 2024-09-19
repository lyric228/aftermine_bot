const {HttpProxyAgent} = require("http-proxy-agent");
const mineflayer = require("mineflayer");



const proxy = getRandomProxy();
const agent = new HttpProxyAgent(`http://${proxy}`);
const bot = mineflayer.createBot({
  host: host,
  port: port,
  username: nickname,
  agent: agent,
  auth: auth,
});

bot.once("spawn", () => {
  mainBotLoopsNoAd(bot, warp, chatWriting);
  // setInterval(() => sendMsg(bot, "/cc ss" + uhaText), 5 * 1000);  // 2.5 * 60 * 1000
});
setInterval(() => bot.chat("/cc ss" + uhaText), 15 * 1000);  // 2.5 * 60 * 1000

bot.on("spawn", () => handleSpawn(bot, portal, password));
bot.on("message", (message) => messagesMonitoring(message, bot, warp));
bot.on("forcedMove", () => tpWarp(bot, warp));
bot.on("error", (err) => bot.end(`An error has occurred ${err}`));
bot.on("end", (reason) => reconnectBot(nickname, portal, warp, reason));