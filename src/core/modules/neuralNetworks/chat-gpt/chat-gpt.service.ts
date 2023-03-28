import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "../../../models/constants/tokens";

@Injectable()
export class ChatGptService {
  private readonly configuration;
  private openai: OpenAIApi;


  constructor(){
    this.configuration = new Configuration({
      apiKey: OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(this.configuration);
  }

  async chat(message: string): Promise<string> {
    const completion = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{'role': 'user', 'content': message}],
    });
    return completion.data.choices[0].message.content;
  }
}
