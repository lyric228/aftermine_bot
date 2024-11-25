import {getCurrentDate} from "../functions/functions.mjs";
import {AiStartMessage, AiToken} from "../../cfg.mjs";
import {HfInference} from "@huggingface/inference";
import {EventEmitter} from "events";


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
	}

	async getAnswer(question, botData) {
		try {
			this.messages.push({
				role: "system",
				content: `Your current nickname: ${botData.nickname}.
				Your current portal: ${botData.portal}.
				Your current server: ${botData.server}.
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
					this.emit("aiAnswer", this.answer);
					this.canAnswer = true;
				}
			}, 1000);
		} catch (err) {
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
}


export const ai = new Ai();
