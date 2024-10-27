import { createBot } from "mineflayer";


export function startPvpBot(options) {
  const nickname = options.nickname || "ChertHouse";
  const portal = options.portal || "s2";
  const host = options.host || "ru.masedworld.net";
  const warp = options.warp || "AfterDark";
  const password = options.password || "!afterHuila00pidor3svocvoRus";
  const target = options.target || "zxclyric";
  return new Bot(nickname, portal, warp, password, host, target);
}


class Bot {
  constructor(nickname, portal, warp, password, host, target) {
    this.password = password;
    this.nickname = nickname;
    this.portal = portal;
    this.warp = warp;
    this.host = host;
    this.targetNickname = target;
    this.version = "1.20.4";
    this.enemies = [];
    this.target = null;
    this.bot = createBot({
      username: this.nickname,
      host: this.host,
      version: this.version,
    });
    this.bot.on("end", (reason) => this.reconnectBot(reason));
    this.bot.on("entitySpawn", (entity) => {
      if (entity.type === "player" && entity.username === this.targetNickname) this.enemies.push(entity);
      this.bot.setControlState("jump", true);
    });
    this.bot.on("physicsTick", () => {
      if (this.enemies.length > 0) {
        this.target = this.enemies.find((enemy) => enemy.username === this.targetNickname);
        return this.bot.lookAt(this.target.position.offset(0, 1.6, 0));
      }
    });
    setInterval(() => {
      this.target = this.enemies.find((enemy) => enemy.username === this.targetNickname);
      this.bot.attack(this.target);
      // dodel
    }, 550);
  }

  // Функция для переподключения бота
  reconnectBot(reason) {
    console.log(`${this.nickname} - Reconnection... (${reason})`);
    new this.constructor(this.nickname, this.portal, this.warp,this.password, this.host, this.targetNickname);
  }

  // Функция для полной остановки и удаления экземпляра бота
  deleteBot() {
    this.bot.end("Disabled by admin.");
    delete this;
  }
}
