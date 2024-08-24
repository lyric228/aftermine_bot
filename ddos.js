const { HttpProxyAgent } = require("http-proxy-agent");
const mineflayer = require("mineflayer");
const fs = require("fs");


function getRandomProxy() {
  const proxies = fs.readFileSync('./proxies.txt', 'utf-8').split('\n').filter(line => line.trim() !== '');
  const randomIndex = Math.floor(Math.random() * proxies.length);
  return proxies[randomIndex];
}

function createBot(nickname, portal, chatWriting = false, autoRec = false, listBot = false, clanBot = true, tpWarp ="ch") {
  const proxy = getRandomProxy();
  const agent = new HttpProxyAgent(`http://${proxy}`);

  const bot = mineflayer.createBot({
    host: "mc.masedworld.net",
    port: 25565,
    username: nickname,
    agent: agent,
  });
  bot.on("end", () => {
    console.log(`${nickname} - Reconnection...`);
    createBot(nickname, portal);
  });
}

// Создание ботов
setTimeout(() => createBot("_Sea_Dragon_", "s2"), 5000);
