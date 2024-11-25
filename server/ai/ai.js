import {getCurrentDate, splitStringIntoList} from "../functions/functions.mjs";
import {AiStartMessage, AiToken, formatedPortals, formatedServers} from "../../cfg.mjs";
import {HfInference} from "@huggingface/inference";
import {EventEmitter} from "events";
import {botsObj} from "../../index.mjs";


export class Ai extends EventEmitter{
	answerCheck;
	completion;
	answer;
	constructor() {
		super();
		this.client = new HfInference(AiToken);
		this.canAnswer = true;
		this.messages = [
			{
				role: "system",
				content: AiStartMessage,
			}
		];
		setInterval(() => this.resetMessages(), 30 * 60 * 1000);
		this.on("aiAnswer", (answer, server, portal) => this.aiAnswer(answer, server, portal));
	}

	async getAnswer(question, botData) {
		try {
			if (question.trim() === "") return;
			this.messages.push({
				role: "system",
				content: `Your current nickname: ${botData.nickname}.
				Your current portal: ${formatedPortals[botData.server][botData.portal]}.
				Your current server: ${formatedServers[botData.server]}.
				Your current interlocutor: ${botData.player}.
				Current time: ${getCurrentDate()}.`,
			},
			{
				role: "user",
				content: question,
			});
			this.completion = await this.client.chatCompletion({
				model: "Qwen/Qwen2.5-72B-Instruct",
				messages: this.messages,
				max_tokens: 1024,
				temperature: 0.1,
			});
			this.answer = this.completion.choices[0].message.content;
			this.messages.push({
				role: "assistant",
				content: this.answer,
			});
			this.answerCheck = setInterval(() => {
				if (typeof this.answer === "string") {
					clearInterval(this.answerCheck);
					this.emit("aiAnswer", this.answer, botData.server, botData.portal);
					this.canAnswer = true;
				}
			}, 1000);
		} catch (err) {
			this.canAnswer = true;
			console.log(err);
		}
	}

	resetMessages() {
		this.messages = [
			{
				role: "system",
				content: AiStartMessage,
			}
		];
	}

	aiAnswer(answer, server, portal) {
		const strs = splitStringIntoList(answer);
    setTimeout(() => {
      for (let i = 0; i < strs.length; i++) {
        setTimeout(() => {
					if (botsObj[server][portal].bot === null)
          botsObj[server][portal].bot.sendMsg(`/cc ${strs[i]}`);
        }, i * 1000);
      }
    }, 1000);
  }
}


export const ai = new Ai();
