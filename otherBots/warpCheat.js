import { createInterface } from "readline";
import { createBot } from "mineflayer";


const allBotWarp = "ch";
const defPassword = "!afterHuila00pidor3svocvoRus";
let tempWarp = "ch";


// Функция для логина и захода в портал при спавне бота
function handleSpawn(bot, portal, password) {
  sendMsg(bot,`/reg ${password}`);
  sendMsg(bot,`/login ${password}`);
  sendMsg(bot,`/${portal}`);
  console.log(`${bot.username} has spawned`);
}

// Основные циклы для бота
function mainBotLoops(bot, warp) {
  setTimeout(() => {
    console.log("Waiting...")
    setInterval(() => tpWarp(bot, warp), 1000);
    setInterval(() => {
      sendMsg(bot, `/setwarp ${tempWarp}`);
      tempWarp = `!${tempWarp}`;
    }, 150);
  }, 15 * 1000);
}

// Функция для отправки сообщений в чат через консоль от лица бота
function consoleEnter(bot) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.setPrompt(">>> ");
  rl.prompt();
  rl.on("line", (input) => {
    sendMsg(bot, input);
    rl.prompt();
  }).on("close", () => {
    console.log("Bye!");
    process.exit(0);
});
}

// Функция для отправки сообщений с try/catch
function sendMsg(bot, msg) {
  try {
    bot._client.chat(msg);
  } catch (error) {
    console.log("Error!");
  }
}

// Функция для телепортации на варп с try/catch
function tpWarp(bot, warp) {
  try {
      sendMsg(bot, `/warp ${warp}`);
  } catch (error) {
      bot.end("An error has occurred");
  }
}

// Функция для создания бота
function createBotCheat(nickname, chatWriting = false, portal = "s1", warp = allBotWarp, password = defPassword) {
  const bot = createBot({
    host: "mc.masedworld.net",
    port: 25565,
    username: nickname,
  });

  if (chatWriting) consoleEnter(bot);

  bot.once("spawn", () => mainBotLoops(bot, warp, chatWriting));
  bot.on("message", (message) => console.log(message.toString()));
  bot.on("spawn", () => handleSpawn(bot, portal, password));
  bot.on("end", () => createBotCheat(nickname, chatWriting, portal, warp, password));
  bot.on("error", (err) => bot.end(`An error has occurred ${err}`));
}

createBotCheat("NeoKemper1ng");
