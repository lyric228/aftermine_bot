const mineflayer = require("mineflayer");
const { HttpProxyAgent } = require("http-proxy-agent");
const fs = require("fs");
const password = "!afterHuila00pidor3svocvoRus";


function getRandomProxy() {
  // Функция для получения случайного прокси из файла
  const proxies = fs.readFileSync('./proxies.txt', 'utf-8').split('\n').filter(line => line.trim() !== '');
  const randomIndex = Math.floor(Math.random() * proxies.length);
  return proxies[randomIndex];
}

function handleSpawn(bot, portal) {
  // Функция для обработки спавна бота, то есть регистрации \ логина и захода в портал
  setTimeout(() => {
    bot.chat(`/reg ${password}`);
    bot.chat(`/login ${password}`);
  }, 1000);

  setTimeout(() => {
    bot.chat(`/${portal}`);
  }, 2000);

  console.log(`${bot.username} has spawned`);
}

function createBot(nickname, portal) {
  // Функция для создания бота
  const proxy = getRandomProxy();
  const agent = new HttpProxyAgent(`http://${proxy}`);
  const bot = mineflayer.createBot({
    host: "mc.masedworld.net",
    port: 25565,
    username: nickname,
    agent: agent,
  });

  setTimeout(() => {
    bot.end();
  }, 60 * 60 * 1000);  // Рестарт бота раз в 1 час

  bot.on("spawn", () => handleSpawn(bot, portal));

  bot.on("error", (err) => console.log(err));
  bot.on("end", () => {
    console.log(`${nickname} - Reconnection...`);
    createBot(nickname, portal);
  });
}

// Создание ботов
for (let i = 0; i < 20; i++) createBot(`zaziza${i}`, "s7");
