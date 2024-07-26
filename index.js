const mineflayer = require('mineflayer');
const { mineflayer: mineflayerViewer } = require('prismarine-viewer')

const bot = mineflayer.createBot({
  host: 'mc.masedworld.net',
  port: 25565,
  username: 'WunderwaffeMaus'
});


function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


bot.on('spawn', () => {
  setTimeout(() => {
    bot.chat('/login 5hshAfter1Pidorasi!l!0j5');
  }, 1000);
  console.log('Bot has spawned');
  setTimeout(() => {
    bot.chat('/s4');
  }, 1000);
});
bot.once('spawn', () => {
  setInterval(() => {
    const closestPlayer = bot.nearestEntity();
    bot.chat("/c invite " + closestPlayer.username);
  }, getRandomNumber(1000, 60000))  // Таймаут 1-60 секунд перед приглашением ближайшего чела в клан

  setInterval(() => {
    const entity = bot.nearestEntity()
    if (entity !== null) {
      if (entity.type === 'player') {
        bot.lookAt(entity.position.offset(0, 1.6, 0))
      } else if (entity.type === 'mob') {
        bot.lookAt(entity.position)
      }
    }
  }, 10)

  setInterval(() => {
     // bot.chat('! текст для рассылки')
     bot.chat('/clear')
  }, getRandomNumber(240000, 480000))  // Таймаут 4-8 минут
});
