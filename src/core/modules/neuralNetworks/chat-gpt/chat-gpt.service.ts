import { Injectable } from "@nestjs/common";
import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "../../../models/constants/tokens";

@Injectable()
export class ChatGptService {
  private readonly configuration;
  private openai: OpenAIApi;
  private context = [];

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
      messages: this.context,
      temperature: 0.5
    });
    const response = completion.data.choices[0].message.content;
    this.updateContext({ "role": "assistant", "content": response });
    return response;
  }

  updateContext(object: { "role": string, "content": string }) {
    this.context.push(object);
    if (this.context.length > 10) {
      this.context.splice(0, 1);
    }
  }
}
