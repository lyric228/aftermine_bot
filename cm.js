import {appendFile, readFileSync, writeFileSync} from "fs";
import {createInterface} from "readline";
import {freemem, totalmem} from "os";
import {createBot} from "mineflayer";
import gc from "garbage-collector";
import {Storage} from "megajs";


let botList = [];
let blacklist = [];
let playerDeaths = {};
let botCount = 0;
const storage = await new Storage({
  email: "xhikzerox@gmail.com",
  password: "yakrutoy2801"
}).ready



export function startBotCM(nickname, portal, host = "ru.cheatmine.net", warp = "n930gkh1r", chatWriting = false, hideErrors = false, password = "!afterHuila00pidor3svocvoRus") {
  return new BotCM(nickname, portal, warp, chatWriting, hideErrors, password, host);
}


class BotCM {
  constructor(nickname, portal, warp, chatWriting, hideErrors, password, host) {
    botCount++;
    blacklist = this.loadBlacklist();
    playerDeaths = this.loadDeaths();
    if (botList.length <= botCount) botList.push(this.nickname);
    this.shameBoard = [
      "ziklichniy",
      "pavel_чото_там",
      "cph4peezzz",
      "forltop_W",
      "BOZZIinSNG",
    ];
    this.adMsgs = [
      "!&fПривет, друг! Хочешь побывать в &cклане&f, где была великая история? Тогда тебе сюда -> &c/warp CH&f ! У нас есть: &bтоповый кит для пвп&f, &eхороший кх &fи многое другое! Чего же ты ждёшь? &d&nПрисоединяйся к нам!",
      "!&fПриветик! Хочешь с &dкайфом &fпровести время, но не знаешь как? Тогда тебе подойдёт &cклан &4&lChert&0&lHouse &f! У нас ты найдёшь &eхороший кх&f, &bтоповый кит &fи &nуважение клана&f. Чтоб вступить в клан пиши &c/warp CH",
      "!&fХочешь в &dкрутой клан &fс многими &eплюшками? Тогда тебе нужен клан &4&lChert&0&lHouse&fl ! У нас ты не только найдёшь &bтоповый кит для пвп&f и&e хороший кх&f, но и дс сервер! А так же у нас открыт набор на модераторов! &c/warp CH",
      "!&fИщешь &aотличный клан &fс &eкрутыми возможностями&f? Тогда тебе подходит клан &4&lChert&0&lHouse &f! &bТоповый кит&f, &6функциональный бот&f, всё это ты найдёшь на &c/warp ch&f . Заинтересовало? Ждём именно тебя!",
      "!&eТоповый кх&f, &bахеренный кит&f, &6функциональный бот&f, всё это есть в клане &4&lChetrt&0&lHouse&f! Ощути весь кайф в &cнашем клане&f, побывай в нашем &aдс сервере &fи не только! Просто напиши в лс боту #invite ! &7(/warp ch)",
    ];
    this.unterMsgs = {
      "afterdark": "/cc А вы знали, что афтердарк - хуйня? Глава у них школьник, который сосет хуй, а также персонал у них полная хуйня. Если вы не хотите быть хуеглотом, то смело оставайтесь у нас и получайте нашу поддержку.",
      "wortex": "/cc А вы знали, что клан вортекс - сборище даунов? Глава у них нихуя не умеет,  а их уебанские игроки готовы отсосать за клан). Не будь как они, будь как мы (самыми крутыми)!",
      "goldlight": "/cc А вы знали, что GoldLight - клан хохлов? Глава у них каждый день на киеве глотает бомбы и ракеты в ротик, а люди из их клана готовы ебаться за афтердарк))). Не будь салом, стань ёбырём (как наш клан).",
      "blyyeti": "/cc А вы знали, что клан BlyYety - клан одних хелперов с ебучими правами? Глава у них сосал хуй у всех кланов, менендес хавал хуи на каждом шагу, а Rooli шлюха, которая готова отсосать у соника. Не будь как они, оставайся у нас и всё будет заебись!",
      "hellteam": "/cc А вы знали, что клан HellTeam - клан ебанных лицемерских пидоров, которые затерялись где то на дне альфы. А еще вы знали то, что глава их пиздабол и думает то, что он топ 1 с читами. Не будь пидорасами как они будь крутыми как мы)",
      "kristl": "/cc А вы знали, что клан KRISTL - клан ублюдков? Глава у них школьник, которому 12 лет, а их мелкие ебанаты готовы отсосать за клан)) Кристл настолько скатились, что даже на альфе не могут топ 1 занять) Не будь уебаном, будь сигмой как мы!",
    };
    this.commandsMsgs = {
      "commandList": () => { return `/cc &eСписок доступных команд&f - #Команды , #ЧёрныйСписок , #ФункцииБота , #Союзы , #Враги , #ДоскаПозора , #СписокБотов , #ВерсииБота. &bКоманды писать в клан чат.&f` },
      "botList": () => `/cc &c1&f. &bKemper1ng&f. &32&f. &bAntiKemper1ng&f. &a3&f. &2Alfhelm&f. &64&f. &eVectorKemper1ng&f. &d5&f. &1SCPbotSH&f. &26&f. &3QuaKemper1ng&f. &97&f. &cNeoKemper1ng&f. &58&f. Temper1ng.`,
      "allies": () => `/cc &fНаши союзы на &cданный момент&f: &1PEPSICO&f , &eLaEspada &f, &4афтедаркхуета&f.`,
      "enemies": () => `/cc &fНаши &cвраги&f: У нас нет врагов! `,
      "functions": () => `/cc &aФункции&f нашего бота: &cАнтиТп&f, &bПриглашение в клан&f, &eАнти Слив КДР&f , &dРеклама в чате &f, &3АвтоРекконект &f(каждый час), &0Чёрный Список&f, &eЗащита от фризтрола&f, &aЗащита от убийств и эффектов&f, &lКоманды в клан чате &f.`,
      "shame": () => `/cc 1. - ${this.shameBoard[0]} 2. - ${this.shameBoard[1]} 3. - ${this.shameBoard[2]} 4. - ${this.shameBoard[3]} 5. - ${this.shameBoard[4]}`,
      "blacklist": () => `/cc &fЧёрный список: 1. ${blacklist[blacklist.length-1]} 2. ${blacklist[blacklist.length-2]} 3. ${blacklist[blacklist.length-3]} 4. ${blacklist[blacklist.length-4]} 5. ${blacklist[blacklist.length-5]} 6. ${blacklist[blacklist.length-6]} 7. ${blacklist[blacklist.length-7]} 8. ${blacklist[blacklist.length-8]}`,
      "discord": () => `/cc &fХочешь быть всегда в курсе что и где происходит в клане? Тогда тебе нужен наш &cклановый дискорд сервер&f! У нас есть новости, наборы, ивенты и тд! Заинтересовало? Пиши мне - kotik16f`,
      "versions": () => [
        `/cc Alpha 0.01 - Добавлены функции Инвайта в клан, Пиар, Заход на сервер и прочие базовые функции. Alpha 0.02 - Добавлена функция AntiTp. Alpha 0.03 - Добавлен второй бот.`,
        `/cc Beta 0.1 - Добавлен третий бот Alfhelm. Beta 0.2 - Добавлен прокси, Добавлен черный список. Beta 0.5 - Добавлена оптимизация на АнтиТп, добавлены все боты.`,
        `/cc Beta 0.6 - Ответ на плевок. Beta 0.7 - Небольшие изменения. Beta 0.8 - обновлен черный список, ClanLog, смерти. Beta 0.9 - небольшие изменения. Release 1.0 - Добавлена анти-трапка.`,
        `/cc Release 1.1 - Исправлено множество ошибок, а также прочие небольшие изменения.`,
      ]
    };
    this.admins = [
      "zxclyric",
      "KoTiK_B_KeDaH_",
      "BogSupnogoDnya",
      "makleia",
      "ryfed_pc",
      "Kemper1ng",
    ]
    this.answerMessages = {
      "afterdar": this.unterMsgs["afterdark"],
      "worte": this.unterMsgs["wortex"],
      "goldligh": this.unterMsgs["goldlight"],
      "blyyet": this.unterMsgs["blyyeti"],
      "helltea": this.unterMsgs["hellteam"],
      "krist": this.unterMsgs["kristl"],

      "#команды": this.commandsMsgs["commandList"](),
      "#списокботов": this.commandsMsgs["botList"](),
      "#союзы": this.commandsMsgs["allies"](),
      "#враги": this.commandsMsgs["enemies"](),
      "#функции": this.commandsMsgs["functions"](),
      "#доска": this.commandsMsgs["shame"](),
      "#чс": this.commandsMsgs["blacklist"](),
      "#версиибота": this.commandsMsgs["versions"]()[this.currentArg],
    }
    this.adminAnswerMessages = {
      "#логи": async () => {
        this.sendMsg(`/m ${this.lastUser} Отправляю логи на сервер...`);
        await this.uploadDataToDisk();
        this.sendMsg(`/m ${this.lastUser} Логи отправлены на сервер!`);
      },
      "#clearchat": async () => {
        setTimeout(() => this.sendMsg("/clearchat"), 1000);
        this.sendMsg(`/m ${this.lastUser} Чат очищен!`);
      },
      "#чс": async () => {
        const curUser = this.currentArg;
        if (!blacklist.includes(curUser)) {
          blacklist.push(curUser);
          this.saveBlacklist();
          this.sendMsg(`/m ${this.lastUser} Игрок ${curUser} добавлен в ЧС!`);
          blacklist = this.loadBlacklist();
        } else this.sendMsg(`/m ${this.lastUser} Игрок ${curUser} уже в ЧС!`);
      },
      "#анчс": async () => {
        const curUser = this.currentArg;
        if (blacklist.includes(curUser)) {
          blacklist = blacklist.filter(item => item !== curUser);
          this.saveBlacklist();
          this.sendMsg(`/m ${this.lastUser} Игрок ${curUser} удален из ЧС!`);
        } else this.sendMsg(`/m ${this.lastUser} Игрока ${curUser} нету в ЧС!`);
      },
      "#дп": async () => {
        const index = this.allArgs[1]-1;
        this.shameBoard[index] = this.currentArg;
        this.sendMsg(`/m ${this.lastUser} Игрок ${this.currentArg} теперь на ${this.allArgs[1]} месте на доске позора!`);
      },
      "#чат": async () => {
        this.sendMsg(this.allArgs.join(" "));
      },
    }
    this.chatWriting = chatWriting;
    this.hideErrors = hideErrors;
    this.password = password;
    this.nickname = nickname;
    this.portal = portal;
    this.warp = warp;
    this.skin = "zxclyric";
    this.name = "Lyric";
    this.host = host;
    this.auth = "offline";
    this.currentArg = "";
    this.allArgs = [];
    this.lastUser = "";
    this.storage = storage;
    this.bot = createBot({
      host: this.host,
      username: this.nickname,
      auth: this.auth,
      hideErrors: this.hideErrors,
    });
    this.bot.on("spawn", () => this.handleSpawn());
    this.bot.on("end", (reason) => this.reconnectBot(reason));
    this.bot.on("error", (error) => this.bot.end(`Error!\n\n${error}`));

    setTimeout(() => {
      this.tpWarp();
      this.consoleEnter();
      this.setSkin();
      this.setName();
      this.botLoops();
      this.bot.on("entitySpawn", (entity) => this.handleNearestInvite(entity));
      this.bot.on("entityMoved", () => this.lookAtNearestPlayer());
      this.bot.on("message", async (message) => await this.messagesMonitoring(message));
      this.bot.on("forcedMove", () => this.tpWarp());
      this.bot.on("kicked", (reason) => this.bot.end(reason));
      this.bot.on("entityEffect", () => this.handleEffect());
      this.bot.on("respawn", () => this.handleRespawn());
    }, 5 * 1000);  // Задержка в 5 секунд чтобы бот не вылетал из-за спама
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
    botCount--;
    this.saveBlacklist();
    this.saveDeaths();
    new this.constructor(this.nickname, this.portal, this.warp, this.chatWriting, this.hideErrors,this.password);
  }

  // Функция для отправки сообщений с try/catch
  sendMsg(msg) {
    try {
      if (typeof msg === "function") msg = msg();
      this.bot.chat(msg);
    } catch (error) {}
  }

  // Функция для телепортации на варп с try/catch
  tpWarp(warp = this.warp) {
    try {
      if (typeof warp === "function") warp = warp();
      this.sendMsg(`/warp ${warp}`);
    } catch (error) {}
  }

  // Функция для полной очистки инвентаря
  clearInventory() {
    this.sendMsg("/head remove");
    this.sendMsg("/clear");
  }

  // Циклы для бота
  botLoops() {
    this.invitePlayers();  // Приглашение ближайшего игрока
    this.sendAdvertisements();  // Отправка рекламы
    this.autoRestart();  // Рестарт бота раз в час
    this.dimensionChecker();  // Анти-трапка +
    this.ramClearInterval();  // Очистка оперативной памяти
    this.antiPumpkin();  // Анти-тыква
  }

  // Функция для очистки оперативной памяти
  clearRam() {
    const freeMemory = freemem();
    const totalMemory = totalmem();
    if (freeMemory / totalMemory < 0.2) gc();
  }

  // Функция для загрузки данных в файл
  async uploadFile(name, data) {
    try {
      const file = this.storage.find(name);
      await file.delete(true);
    } catch (error) { console.log("File can't be deleted!"); }
    try {
      await this.storage.upload(name, data).complete;
    } catch (error) { console.log("File can't be uploaded!"); }
  }

  // Функция для сохранения данных на мегу
  async uploadDataToDisk() {
    const tempBlacklist = readFileSync("data/blacklist.txt", "utf-8");
    const tempDeaths = readFileSync("data/deaths.json", "utf-8");
    await this.uploadFile("blacklist.txt", tempBlacklist.toString());
    await this.uploadFile("deaths.json", tempDeaths.toString());
    await this.logSave();
  }

  // Функция для сохранения данных логов
  async logSave() {
    const tempClanLog = readFileSync("logs/ClanLog.txt", "utf-8");
    const tempGLog = readFileSync("logs/GlobalLog.txt", "utf-8");
    const tempLLog = readFileSync("logs/LocalLog.txt", "utf-8");
    await this.uploadFile("ClanLog.txt", tempClanLog.toString());
    await this.uploadFile("GlobalLog.txt", tempGLog.toString());
    await this.uploadFile("LocalLog.txt", tempLLog.toString());
  }

  // Функция для сохранения данных в черный список
  saveBlacklist() {
    blacklist.sort(() => Math.random() - 0.5);
    writeFileSync("data/blacklist.txt", blacklist.join("\n"));
  }

  // Функция для загрузки данных из черного списка
  loadBlacklist() {
    try {
      const data = readFileSync("data/blacklist.txt").toString();
      return data.split("\n");
    } catch (error) {
      if (error.code === "ENOENT") return []
    }
  }

  // Функция для сохранения данных о смертях
  saveDeaths() {
    const jsonDeaths = JSON.stringify(playerDeaths);
    writeFileSync("data/deaths.json", jsonDeaths);
  }

  // Функция для загрузки данных о смертях
  loadDeaths() {
    try {
      const jsonString = readFileSync("data/deaths.json");
      return JSON.parse(jsonString.toString());
    } catch (error) {
      if (error.code === "ENOENT") return {};
    }
  }

  // Функция для изменения смертей по нику
  countDie() {
    if (playerDeaths[this.nickname] == null) playerDeaths[this.nickname] = 0;
    playerDeaths[this.nickname] += 1;
  }

  // Функция для записи логов в файл
  writeLog(text, path) {
    const date = new Date().toLocaleString();
    const logText = `${this.bot.entity.position} [CM:${this.portal}] - ${date}: ${text}\n`;
    appendFile(`logs/${path}`, logText, (err) => { if (err) console.error(err) });
  }

  // Функция для генерации рандомного числа
  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Функция для отправки сообщений в чат через консоль от лица бота
  consoleEnter() {
    if (this.chatWriting) {
      const rl = createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.setPrompt(">>> ");
      rl.prompt();
      rl.on("line", (input) => {
        this.sendMsg(input);
        rl.prompt();
      }).on("close", () => {
        console.log("Bye!");
        process.exit(0);
      });
    }
  }

  // Функция для приглашения ближайшего игрока в клан
  invitePlayers() {
    setInterval(() => {
        const closestPlayer = this.bot.nearestEntity(entity => entity.type === "player");
        if (closestPlayer && !blacklist.includes(closestPlayer.username)) this.sendMsg(`/c invite ${closestPlayer.username}`);
    }, this.getRandomNumber(10000, 30000));
  }

  // Функция для авто рестарта бота раз в час
  autoRestart() {
    setInterval(() => this.bot.end("Restart"), 60 * 60 * 1000);  // Рестарт бота раз в час
  }

  // Функция для очистки оперативной памяти с интервалом и телепортом на варп
  ramClearInterval() {
    setInterval(() => {
      this.tpWarp();
      this.clearRam();
    }, 5 * 60 * 1000);
  }

  // Функция для очистки инвентаря
  antiPumpkin() {
    setInterval(() => this.clearInventory(), 60 * 1000);
  }

  // Функция для проверки что бот находится в этом мире, иначе тп на варп
  dimensionChecker() {
    setInterval(() => {
      try { if (this.bot.game.dimension !== "overworld") this.tpWarp(); } catch (error) {this.bot.end("Trapped!");}
    }, 5 * 1000);  // Анти-трапка +
  }

  // Функция для рассылки рандомного сообщения рекламы клана в глобальный чат
  sendAdvertisements() {
    setInterval(() => this.sendMsg(this.adMsgs[this.getRandomNumber(0, this.adMsgs.length - 1)]), this.getRandomNumber(2*60*1000, 2.2*60*1000));
    setInterval(() => this.sendMsg(this.commandsMsgs["discord"]()), this.getRandomNumber(60*1000, 2*60*1000));
  }

  // Функция, чтоб получить ближайшего игрока
  getNearestPlayer() {
    return this.bot.nearestEntity(entity => entity.type === "player");
  }

  // Функция чтобы бот смотрел на ближайшего игрока
  lookAtNearestPlayer(closestPlayer = this.getNearestPlayer()) {
    if (closestPlayer) {
      const lookPosition = closestPlayer.position.offset(0, 1.6, 0);
      return this.bot.lookAt(lookPosition);
    }
  }

  // Функция для контроля урона для бота
  handleRespawn() {
    this.tpWarp();
    setTimeout(() => this.sendMsg("/gm 1"), 1000);
  }

  // Функция для контроля эффектов у бота
  handleEffect() {
    this.sendMsg("/heal");
    this.tpWarp();
  }

  // Отправка инвайта ближайшему игроку при спавне
  handleNearestInvite(entity) {
    if (entity.type === "player") this.sendMsg(`/c invite ${entity.username}`);
  }

  // Функция для установки скина
  setSkin() {
    this.sendMsg(`/skin ${this.skin}`);
  }

  // Функция для установки ника
  setName() {
    this.sendMsg(`/nickname ${this.name}`);
  }

  // Функция для работы с сообщениями
  async messagesMonitoring(message) {
    const textMessage = message.getText();
    const lowTextMessage = textMessage.toLowerCase();
    const cmdMessages = textMessage.split(" ");

    // console.log(textMessage);

    const matchLeave = textMessage.match(/› (.*?) покинул клан\./);
    const matchJoin = textMessage.match(/› (.*?) присоеденился к клану\./);
    const matchCmd = textMessage.match(/\[\[(.*?)] (.*?) -> .*?] (.*)/);
    const matchKdr = textMessage.match(/игрока\s*(.*)/);
    const matchInvite = textMessage.match(/›\[(.*?) ->/);

    if (matchJoin && matchJoin[1]) {
      const newMember = matchJoin[1];
      if (playerDeaths[newMember]) playerDeaths[newMember] = 0;
      this.sendMsg(`/cc Добро пожаловать в клан, ${newMember}! Обязательно вступи в наш дискорд, там много всего интересного! Если хочешь вступить в наш дискорд сервер, то пиши мне - kotik16f`);

    } else if (matchLeave && matchLeave[1]) {
      const leaveMember = matchLeave[1];
      this.sendMsg(`/cc ${leaveMember} выходит из клана, ОБОССАТЬ И НА МОРОЗ!`);

    } else if (matchInvite && matchInvite[1] && lowTextMessage.includes("#invite")) {
      const invitePlayer = matchInvite[1];
      this.sendMsg(`/c invite ${invitePlayer}`);

    } else if (matchKdr && matchKdr[1]) {
      let killedPlayer = matchKdr[1];
      this.countDie(killedPlayer);
      const deathsCount = playerDeaths[killedPlayer]
      if (deathsCount > 4 && !this.admins.includes(killedPlayer)) {
        this.sendMsg(`/c kick ${killedPlayer}`);
        blacklist.push(killedPlayer);
        this.saveBlacklist();
      }
      this.saveDeaths();
    }

    if (matchCmd && matchCmd[1]) {
      const username = matchCmd[2];
      const messages = matchCmd[3].split(" ");
      const command = messages[0];
      this.allArgs = messages.slice(1);
      this.currentArg = this.allArgs[0];
      this.lastUser = username;
      if ((this.admins.includes(username)) && (command in this.adminAnswerMessages)) await this.adminAnswerMessages[command]();
    }

    if (lowTextMessage.startsWith("клан:")) {
      this.currentArg = cmdMessages[4];
      this.lastUser = cmdMessages[2];
      const curCommand = cmdMessages[3].toLowerCase();
      for (const command in this.answerMessages) {
        if (curCommand.includes(command)) {
          this.sendMsg(this.answerMessages[command]);
          break;
        }
      }
      this.writeLog(textMessage, "ClanLog.txt");
    }
    else if (textMessage.startsWith("[ɢ]")) this.writeLog(textMessage, "GlobalLog.txt");
    else if (textMessage.startsWith("[ʟ]")) this.writeLog(textMessage, "LocalLog.txt");
    else if (textMessage === "Пожайлуста прекратите читерить или вы будете забанены!") this.bot.end("Freeze troll");
  }
}
