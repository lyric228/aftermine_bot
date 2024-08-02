const mineflayer = require('mineflayer');

const adDefMsg = '!&c&lПривет, друг! Хочешь побывать в клане, где была великая история? Тогда тебе сюда -> /warp CH ! У нас есть: топовый кит для пвп, хороший кх и многое другое! Мы выдаём флай игрокам :3. Чего же ты ждёшь? Присоединяйся к нам!';
const adDefMsg2 = "!&c&lПривет, друг! Хочешь побывать в клане, где была великая история? Тогда тебе сюда -> /warp CH ! У нас есть: топовый кит для пвп, хороший кх и многое другое! Чего же ты ждёшь? Присоединяйся к нам!";
const blacklist = ["uzerchik", "Milaina"];


function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function handleSpawn(bot, password, portal) {
  setTimeout(() => {
    bot.chat(`/reg ${password}`);
    bot.chat(`/login ${password}`);
  }, 1000);

  setTimeout(() => {
    bot.chat(`/${portal}`);
  }, 1000);

  console.log(`${bot.username} has spawned`);
}

function invitePlayers(bot) {
  setInterval(() => {
    const closestPlayer = bot.nearestEntity();
    if (closestPlayer && closestPlayer.type === 'player' && !blacklist.includes(closestPlayer.username)) {
      bot.chat(`/c invite ${closestPlayer.username}`);
    }
  }, 10000);
}

function lookAtEntities(bot) {
  setInterval(() => {
    const entity = bot.nearestEntity();
    // const nearestPlayer = bot.nearestEntity(bot.players, { maxDistance: 16 });
    if (entity) {
      const lookPosition = entity.type === 'player' ? entity.position.offset(0, 1.6, 0) : entity.position;
      bot.lookAt(lookPosition);
    }
  }, 10);
}

function sendAdvertisements(bot, sendAd, adMsg) {
  setInterval(() => {
    if (sendAd) {
      bot.chat(adMsg);
    }
    bot.chat('/clear');
  }, getRandomNumber(160000, 200000));
}

function monitorPosition(bot, defCord, warp) {
  setInterval(() => {
    const { x, y, z } = bot.entity.position;
    if (x !== defCord[0] || y !== defCord[1] || z !== defCord[2]) {
      bot.chat(`/warp ${warp}`);
    }
  }, 1000);
}

function createBot(nickname, password, portal, warp, sendAd, adMsg, defCord) {
  const bot = mineflayer.createBot({
    host: 'mc.masedworld.net',
    port: 25565,
    username: nickname,
  });

  bot.on('spawn', () => handleSpawn(bot, password, portal));
  bot.once('spawn', () => {
    invitePlayers(bot);
    lookAtEntities(bot);
    sendAdvertisements(bot, sendAd, adMsg);
    monitorPosition(bot, defCord, warp);
  });

  bot.on('error', (err) => console.log(err));
  bot.on('end', () => {
    console.log(`${nickname} - Reconnection...`);
    createBot(nickname, password, portal, warp, sendAd, adMsg, defCord);
  });
}

createBot("Kemper1ng", "!afterHuila00pidor3svocvoRus", "s2", "botch", true, adDefMsg, [-4871.5, 109, -3179.5])
createBot("SCPbotSH", "!afterHuila00pidor3svocvoRus", "s3", "chbot", true, adDefMsg2, [-4871.5, 109, -3179.5])
