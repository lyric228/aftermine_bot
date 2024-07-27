const mineflayer = require('mineflayer');


function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const adDefMsg = '!&c&lПривет,друг! Хочешь побывать в клане, где была великая история? Тогда тебе сюда -> /warp CH ! У нас есть: топовый кит для пвп, хороший кх и многое другое! Мы выдаём флай игрокам :3. Чего же ты ждёшь? Присоединяйся к нам!'


function createBot(nickname, password, portal, warp, sendAd, adMsg) {
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
      bot.chat("/c invite " + closestPlayer.username);
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
    }, getRandomNumber(240000, 300000))



    setInterval(() => {
      let pos = bot.entity.position
      if (pos.x !== -4871.5 && pos.y !== 109 && pos.z !== -3179.5) {
        bot.chat('/warp ' + warp)
        // [ -4871.5, 109, -3179.5 ]
      }
    }, 1000)

  });


  bot.on('error', (err) => console.log(err))
  bot.on('end', () => {
    createBot(nickname, password, portal, warp, sendAd, adMsg);
    console.log("Reconnection...");
  });
}

// for (let i = 0; i < 10; i++) {
//   setTimeout(() => {console.log()}, 15000);
//   createBot("Waflya1233"+i, "!afterHuila00pidor3svocvoRus", "s2", "chbot", true, "")
// }
createBot("Kemper1ng", "!afterHuila00pidor3svocvoRus", "s2", "chbot", true, adDefMsg)
