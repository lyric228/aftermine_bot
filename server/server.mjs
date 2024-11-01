import { botsObjData, botsObj } from "../index.mjs";
import { readFile, writeFile } from "fs";
import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import multer from "multer";


export class BotPanelServer {
  constructor() {
    this.app = express();
    this.http = createServer(this.app);
    this.io = new Server(this.http);
    this.currentBotPanel = "masedworld";
    this.currentBot = "s2";
    this.upload = multer({ dest: "./uploads/" });
  }

  init() {
    this.app.use(express.static("node_modules"));
    this.app.use(express.static("public"));
    this.app.use(express.static("style"));

    this.app.get("/", (req, res) => {
      res.sendFile("server/index/index.html", { root: "./" });
    });

    this.app.get("/downloadBlacklist", (req, res) => {
      res.download("server/data/blacklist.txt");
    });

    this.app.get("/downloadDeaths", (req, res) => {
      res.download("server/data/deaths.json");
    });

    this.app.get("/downloadClanLog", (req, res) => {
      res.download(`server/logs/${this.currentBotPanel}/${this.currentBot}/ClanLog.txt`);
    });

    this.app.get("/downloadGlobalLog", (req, res) => {
      res.download(`server/logs/${this.currentBotPanel}/${this.currentBot}/GlobalLog.txt`);
    });

    this.app.get("/downloadLocalLog", (req, res) => {
      res.download(`server/logs/${this.currentBotPanel}/${this.currentBot}/LocalLog.txt`);
    });

    this.app.get("/downloadGriefLog", (req, res) => {
      res.download(`server/logs/${this.currentBotPanel}/${this.currentBot}/GriefLog.txt`);
    });

    this.app.post("/uploadClanLog", this.upload.single("file"), (req, res) => {
      const file = req.file;
      const filePath = `server/logs/${this.currentBotPanel}/${this.currentBot}/ClanLog.txt`;
      this.readUploadedFile(file, filePath, res);
    });

    this.app.post("/uploadGlobalLog", this.upload.single("file"), (req, res) => {
      const file = req.file;
      const filePath = `server/logs/${this.currentBotPanel}/${this.currentBot}/GlobalLog.txt`;
      this.readUploadedFile(file, filePath, res);
    });

    this.app.post("/uploadGriefLog", this.upload.single("file"), (req, res) => {
      const file = req.file;
      const filePath = `server/logs/${this.currentBotPanel}/${this.currentBot}/GriefLog.txt`;
      this.readUploadedFile(file, filePath, res);
    });

    this.app.post("/uploadLocalLog", this.upload.single("file"), (req, res) => {
      const file = req.file;
      const filePath = `server/logs/${this.currentBotPanel}/${this.currentBot}/LocalLog.txt`;
      this.readUploadedFile(file, filePath, res);
    });

    this.app.post("/uploadBlacklist", this.upload.single("file"), (req, res) => {
      const file = req.file;
      const filePath = "server/data/blacklist.txt";
      this.readUploadedFile(file, filePath, res);
    });

    this.app.post("/uploadDeaths", this.upload.single("file"), (req, res) => {
      const file = req.file;
      const filePath = "server/data/deaths.json";
      this.readUploadedFile(file, filePath, res);
    });

    this.app.get("/mp", (req, res) => {
      res.sendFile("server/index/multi.html", { root: "./" });
    });

    this.app.get("/masedworld", (req, res) => {
      this.currentBotPanel = "masedworld";
      res.sendFile("server/index/masedworld.html", { root: "./" });
    });

    this.app.get("/cheatmine", (req, res) => {
      this.currentBotPanel = "cheatmine";
      res.sendFile("server/index/cheatmine.html", { root: "./" });
    });

    this.app.get("/masedworld/bots", (req, res) => {
      let bots = [];
      for (let i = 1; i <= 8; i++) bots.push(`s${i}`);
      res.json(bots);
    });

    this.app.get("/cheatmine/bots", (req, res) => {
      let bots = ["s1", "s2"];
      res.json(bots);
    });

    this.app.get("/selectBot/:bot", (req, res) => {
      this.currentBot = req.params.bot;
      res.sendFile("server/index/botpanel.html", { root: "./" });
    });

    this.io.on("connection", (socket) => {
      console.log("Client connected");
      try {
        if (botsObj[this.currentBotPanel][this.currentBot].bot !== null) this.activateTimer(socket);
        else socket.emit("discon");
      } catch (error) {
        if (error instanceof TypeError) return;
      }

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });

      socket.on("connectBot", () => {
        this.connectCurBot(socket);
      });

      socket.on("disconnectBot", () => {
        this.disconnectCurBot(socket);
      });

      socket.on("sendMessage", (message) => {
        if (!botsObj[this.currentBotPanel][this.currentBot].bot) return;
        botsObj[this.currentBotPanel][this.currentBot].bot.sendMsg(message);
      });

      socket.on("sendMessageMW", (message) => {
        this.currentBotPanel = "masedworld";
        for (let i = 1; i <= 8; i++) {
          this.currentBot = `s${i}`;
          if (botsObj[this.currentBotPanel][this.currentBot].bot) botsObj[this.currentBotPanel][this.currentBot].bot.sendMsg(message);
        }
      });

      socket.on("sendMessageCM", (message) => {
        this.currentBotPanel = "cheatmine";
        for (let i = 1; i <= 2; i++) {
          this.currentBot = `s${i}`;
          if (botsObj[this.currentBotPanel][this.currentBot].bot) botsObj[this.currentBotPanel][this.currentBot].bot.sendMsg(message);
        }
      });

      socket.on("connectBotMW", () => {
        const lastCurBot = this.currentBot;
        const lastCurBotPanel = this.currentBotPanel;
        this.currentBotPanel = "masedworld";
        for (let i = 1; i <= 8; i++) {
          this.currentBot = `s${i}`;
          this.connectCurBot(socket);
        }
        this.currentBotPanel = lastCurBotPanel;
        this.currentBot = lastCurBot;
      });

      socket.on("connectBotCM", () => {
        const lastCurBot = this.currentBot;
        const lastCurBotPanel = this.currentBotPanel;
        this.currentBotPanel = "cheatmine";
        for (let i = 1; i <= 2; i++) {
          this.currentBot = `s${i}`;
          this.connectCurBot(socket);
        }
        this.currentBotPanel = lastCurBotPanel;
        this.currentBot = lastCurBot;
      });

      socket.on("disconnectBotMW", () => {
        const lastCurBot = this.currentBot;
        const lastCurBotPanel = this.currentBotPanel;
        this.currentBotPanel = "masedworld";
        for (let i = 1; i <= 8; i++) {
          this.currentBot = `s${i}`;
          this.disconnectCurBot(socket);
        }
        this.currentBotPanel = lastCurBotPanel;
        this.currentBot = lastCurBot;
      });

      socket.on("disconnectBotCM", () => {
        const lastCurBot = this.currentBot;
        const lastCurBotPanel = this.currentBotPanel;
        this.currentBotPanel = "cheatmine";
        for (let i = 1; i <= 2; i++) {
          this.currentBot = `s${i}`;
          this.disconnectCurBot(socket);
        }
        this.currentBotPanel = lastCurBotPanel;
        this.currentBot = lastCurBot;
      });
    });

    this.http.listen(62331, () => {
      console.log("Server started on port 62331");
    });
  }

  activateTimer(socket) {
    socket.emit("con");
    botsObj[this.currentBotPanel][this.currentBot].timer = botsObj[this.currentBotPanel][this.currentBot].startTime;
    botsObj[this.currentBotPanel][this.currentBot].timerInterval = setInterval(() => {
      const currentTime = new Date();
      const diffTime = currentTime - botsObj[this.currentBotPanel][this.currentBot].startTime;
      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

      botsObj[this.currentBotPanel][this.currentBot].timer = `${days}д ${hours}ч ${minutes}м ${seconds}с`;
      if (days > 1000) {
        socket.emit("discon");
        clearInterval(botsObj[this.currentBotPanel][this.currentBot].timerInterval);
      }

      socket.emit("updateTimer", botsObj[this.currentBotPanel][this.currentBot].timer);
    }, 1000);
  }

  connectCurBot(socket) {
    if (botsObj[this.currentBotPanel][this.currentBot].bot !== null) return;
    botsObj[this.currentBotPanel][this.currentBot].bot = botsObjData[this.currentBotPanel][this.currentBot]();
    console.log(`Connecting bot ${this.currentBot}...`);
    if (botsObj[this.currentBotPanel][this.currentBot].startTime === null) botsObj[this.currentBotPanel][this.currentBot].startTime = new Date();
    this.activateTimer(socket);
  }

  disconnectCurBot(socket) {
    try {
      botsObj[this.currentBotPanel][this.currentBot].startTime = null;
      clearInterval(botsObj[this.currentBotPanel][this.currentBot].timerInterval);
      botsObj[this.currentBotPanel][this.currentBot].timer = "0д 0ч 0м 0с";
      socket.emit("updateTimer", botsObj[this.currentBotPanel][this.currentBot].timer);
      socket.emit("discon");
      botsObj[this.currentBotPanel][this.currentBot].bot.deleteBot();
      console.log(`Disconnecting bot ${this.currentBot}...`);
    } catch (error) {
      console.log(`Error while disconnecting bot ${this.currentBot}...`);
    }
  }

  readUploadedFile(file, filePath, res) {
    readFile(file.path, "utf8", (error, data) => {
      if (error) {
        console.error(error);
        res.status(500).send("Ошибка при чтении файла!");
      } else {
        writeFile(filePath, data, (error) => {
          if (error) {
            console.error(error);
            res.status(500).send("Ошибка при записи файла!");
          } else {
            res.send("Файл загружен успешно!");
          }
        });
      }
    });
  }
}
