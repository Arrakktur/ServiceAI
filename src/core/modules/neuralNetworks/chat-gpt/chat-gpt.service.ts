import { Injectable } from "@nestjs/common";
import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "../../../models/constants/tokens";

@Injectable()
export class ChatGptService {
  private readonly configuration;
  private openai: OpenAIApi;
  private _context = [];

  constructor() {
    this.configuration = new Configuration({
      apiKey: OPENAI_API_KEY
    });
    this.openai = new OpenAIApi(this.configuration);
  }

  async chat(message: string): Promise<string> {
    this.updateContext({ "role": "user", "content": message });
    const completion = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: this._context,
      temperature: 0.5
    });
    const response = completion.data.choices[0].message.content;
    this.updateContext({ "role": "assistant", "content": response });
    return response;
  }

  private updateContext(object: { "role": string, "content": string }): void {
    this._context.push(object);
    if (this._context.length > 10) {
      this._context.splice(0, 1);
    }
  }

  get context(): string {
    let result = '';
    this._context.forEach((message) => {
      result += `${message.role === 'user' ? 'User: ' : ''}`
      result += `${message.role === 'assistant' ? 'Chat: ' : ''}`
      result += `${message.content}\n`;
    })
    return result;
  }

  get contextLength(): number {
    return this._context.length;
  }

  clearContext(): void {
    this._context = [];
  }
}
