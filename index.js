const mineflayer = require('mineflayer');


function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const adDefMsg = '!&c&lПривет, друг! Хочешь побывать в клане, где была великая история? Тогда тебе сюда -> /warp CH ! У нас есть: топовый кит для пвп, хороший кх и многое другое! Мы выдаём флай игрокам :3. Чего же ты ждёшь? Присоединяйся к нам!'
const adDefMsg2 = "!&c&lПривет, друг! Хочешь побывать в клане, где была великая история? Тогда тебе сюда -> /warp CH ! У нас есть: топовый кит для пвп, хороший кх и многое другое! Чего же ты ждёшь? Присоединяйся к нам!"
const blacklist = ["TheyTiom", "They_Tiom", "uzerchik"]


function createBot(nickname, password, portal, warp, sendAd, adMsg, defX, defY, defZ) {
  let bot = mineflayer.createBot({
    host: 'mc.masedworld.net',
    port: 25565,
    username: nickname,
  })



  bot.on('spawn', () => {
    setTimeout(() => {
      bot.chat('/reg ' + password);
      bot.chat('/login ' + password);
    }, 3000);

    setTimeout(() => {
      bot.chat("/" + portal);
    }, 3000);
    console.log('Bot has spawned');
  });


  bot.once('spawn', () => {
    setInterval(() => {
      let closestPlayer = bot.nearestEntity();
      if (closestPlayer !== null) {
        if (closestPlayer.type !== 'mob') {
          if (!(closestPlayer.username in blacklist)) {
            bot.chat("/c invite " + closestPlayer.username);
          }
        }
      }
    }, getRandomNumber(1000, 15000))


    setInterval(() => {
      let entity = bot.nearestEntity()
      if (entity !== null) {
        if (entity.type === 'player') {
          bot.lookAt(entity.position.offset(0, 1.6, 0))
        } else if (entity.type === 'mob') {
          bot.lookAt(entity.position)
        }
      }
    }, 10)


    setInterval(() => {
      if (sendAd === true) {
        bot.chat(adMsg)
      }
      bot.chat('/clear')
    }, getRandomNumber(160000, 200000))



    setInterval(() => {
      let pos = bot.entity.position
      if (pos.x !== defX || pos.y !== defY || pos.z !== defZ) {
        bot.chat('/warp ' + warp)
      }
    }, 10000)


  });


  bot.on('error', (err) => console.log(err))
  bot.on('end', () => {
    createBot(nickname, password, portal, warp, sendAd, adMsg);
    console.log("Reconnection...");
  });
}


createBot("Kemper1ng", "!afterHuila00pidor3svocvoRus", "s2", "chbot", true, adDefMsg, -4871.5, 109, -3179.5)
createBot("SCPbotSH", "!afterHuila00pidor3svocvoRus", "s4", "chbot", true, adDefMsg2, -4870.5, 109, -3178.5)
