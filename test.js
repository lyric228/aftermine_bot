const mineflayer = require('mineflayer');


function handleSpawn(bot, password, portal) {
  setTimeout(() => {
    bot.chat(`/reg ${password}`);
    bot.chat(`/login ${password}`);
  }, 3000);

  setTimeout(() => {
    bot.chat(`/${portal}`);
  }, 3000);

  console.log(`${bot.username} has spawned`);
}

function monitorPosition(bot, defCord, warp) {
  setInterval(() => {
    const { x, y, z } = bot.entity.position;
    if (x !== defCord[0] || y !== defCord[1] || z !== defCord[2]) {
      bot.chat(`/warp ${warp}`);
      bot.chat('/c accept');
    }
  }, 1000);
}

function createBot(nickname, password, portal, warp, defCord) {
  const bot = mineflayer.createBot({
    host: 'mc.masedworld.net',
    port: 25565,
    username: nickname,
  });

  bot.on('spawn', () => handleSpawn(bot, password, portal));
  bot.once('spawn', () => {
    monitorPosition(bot, defCord, warp);
  });

  bot.on('error', (err) => console.log(err));
  bot.on('end', () => {
    console.log(`${nickname} - Reconnection...`);
    createBot(nickname, password, portal, warp, defCord);
  });
}

for (let i = 0; i < 3; i++) {
  createBot("evreiTupoi"+i, "!afterHuila00pidor3svocvoRus", "s4", "piska", [253.5, 83, 166.5]);
}
