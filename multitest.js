const mineflayer = require('mineflayer');


let i = 0
function next (nickname, password, portal, warp) {
  if (i < 3) {
    i++
    setTimeout(() => {
      const bot = createBot(nickname)
      bot.on('spawn', () => {
        setTimeout(() => {
          bot.chat('/reg ' + password);
          bot.chat('/login ' + password);
        }, 3000);

        setTimeout(() => {
          bot.chat("/" + portal);
        }, 3000);
        console.log(nickname + ' has spawned');
      });


    bot.once('spawn', () => {
      setInterval(() => {
        let pos = bot.entity.position  //-9070.5 63 8179.5
        if (pos.x !== -4870.5 || pos.y !== 108 || pos.z !== -3185.5) {
          bot.chat('/warp ' + warp)

          bot.chat('/c accept')
        }
      }, 1000)
    })


    bot.on('error', (err) => console.log(err))
    bot.on('end', () => {
      next(nickname, password, portal, warp);
      console.log(nickname + " - Reconnection...");
    });
    }, 1000)
  }
}

// process.argv[2]
// next("Adolfik00"+i, "!afterHuila00pidor3svocvoRus", "s2", "uch")
// next("sigma6969"+i, "!afterHuila00pidor3svocvoRus", "s2", "uch")
// next("CandyCrusher"+i, "!afterHuila00pidor3svocvoRus", "s2", "uch")
for (let i = 1; i <= 3; i++) {
  next("Korry1000deaths"+i, "!afterHuila00pidor3svocvoRus", "s4", "uch");
}


function createBot (nickname) {
  return mineflayer.createBot({
    host: "mc.masedworld.net",
    port: 25565,
    username: nickname,
  })
}


// Raccosik1 has spawned
// ShishkaPivo0 has spawned
// CandyCrush2 has spawned
// /setwarp piskasiska
