import { createBot } from "mineflayer";
import { createInterface } from "readline";


const allBotWarp = "n930gkh1r";
const defPassword = "kristlKLANpidorasov1488";
const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const specialChars = "_";

// Функция, которая генерирует случайный ник
function generateNick() {
  const nickLength = Math.floor(Math.random() * (12 - 6)) + 6;  // Рандомная длина ника от 6 до 12 символов

  let nick = '';
  for (let i = 0; i < nickLength; i++) {
    const charType = Math.floor(Math.random() * 3);  // 0 - буква, 1 - цифра, 2 - спецсимвол
    if (charType === 0) {
      nick += letters[Math.floor(Math.random() * letters.length)];
    } else if (charType === 1) {
      nick += numbers[Math.floor(Math.random() * numbers.length)];
    } else {
      nick += specialChars[Math.floor(Math.random() * specialChars.length)];
    }
  }

  return nick;
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
    bot._client.chat(input);
    rl.prompt();
  }).on("close", () => {
    console.log("Bye!");
    process.exit(0);
  });
}

// Функция для логина и захода в портал при спавне бота
function handleSpawn(bot, portal, password) {
  sendMsg(bot,`/reg ${password}`);
  sendMsg(bot,`/login ${password}`);
  sendMsg(bot,`/${portal}`);
  console.log(`${bot.username} has spawned`);
}

// Основные циклы для бота
function mainBotLoops(bot, warp, chatWriting) {
  setInterval(() => tpWarp(bot, warp), 5 * 1000);
  setSkin(bot, "SadLyric111");
  if (chatWriting) consoleEnter(bot);
}

// Функция для отправки сообщений с try/catch
function sendMsg(bot, msg) {
  try {
    bot.chat(msg);
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

// Функция для установки скина
function setSkin(bot, skinName) {
  sendMsg(bot, `/skin ${skinName}`);
}

// Функция для работы с сообщениями
function messagesMonitoring(message, bot) {
  const textMessage = message.getText().toLowerCase();

  // console.log(textMessage);  // Парсинг чата для дебага

  if (textMessage.includes("принять приглашение:")) sendMsg(bot, "/c accept");
  if (textMessage.includes("присоеденился к клану.")) bot.end("Cheated!");
}

// Функция для создания бота
export function createBotCheat(nickname = generateNick(), portal = "s2", warp = allBotWarp, chatWriting = false, password = defPassword, host = "mc.masedworld.net", port = 25565, auth = "offline") {
  const bot = createBot({
    host: host,
    port: port,
    username: nickname,
    auth: auth,
  });

  bot.once("spawn", () => mainBotLoops(bot, warp, chatWriting));
  bot.on("spawn", () => handleSpawn(bot, portal, password));
  bot.on("message", (message) => messagesMonitoring(message, bot, warp));
  bot.on("forcedMove", () => tpWarp(bot, warp));
  bot.on("error", (err) => bot.end(`An error has occurred ${err}`));
}

// console.log(`
// createBotCheat(\"${generateNick()}\");
// createBotCheat(\"${generateNick()}\");
// createBotCheat(\"${generateNick()}\");
// createBotCheat(\"${generateNick()}\");
// createBotCheat(\"${generateNick()}\");
// createBotCheat(\"${generateNick()}\");
// createBotCheat(\"${generateNick()}\");
// createBotCheat(\"${generateNick()}\");
// createBotCheat(\"${generateNick()}\");
// createBotCheat(\"${generateNick()}\");
// NickName Generator
// `);
