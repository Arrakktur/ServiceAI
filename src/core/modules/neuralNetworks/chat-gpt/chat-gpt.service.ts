import { Injectable } from "@nestjs/common";
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "../../../models/constants/tokens";
import { response } from "express";

@Injectable()
export class ChatGptService {
  private readonly configuration;
  private readonly maxCountContext = 5;
  private openai: OpenAIApi;
  private _context: ChatCompletionRequestMessage[] = [];
  private _systemRole = "";

  constructor() {
    this.configuration = new Configuration({
      apiKey: OPENAI_API_KEY
    });
    this.openai = new OpenAIApi(this.configuration);
  }

  async chat(message: string, name: string = "default"): Promise<string> {
    try {
      this.updateContext({ "role": ChatCompletionRequestMessageRoleEnum.User, "content": message, "name": name });
      const params = {
        model: "gpt-3.5-turbo",
        messages: this._context,
        temperature: 0.5
      };
      const completion = await this.openai.createChatCompletion(params);
      const response = completion.data.choices[0].message.content;
      this.updateContext({ "role": ChatCompletionRequestMessageRoleEnum.Assistant, "content": response, "name": name });
      return response;
    } catch (error) {
      return "Error: " + error.response.statusText;
    }
  }

  private updateContext(object: ChatCompletionRequestMessage): void {
    if (object.role === ChatCompletionRequestMessageRoleEnum.System) {
      this._context.unshift(object);
    } else {
      this._context.push(object);
    }
    if (this._context.length > this.maxCountContext) {
      // если у нас есть системная роль
      if (Boolean(this._context.find((object: ChatCompletionRequestMessage) => {
        return object.role === ChatCompletionRequestMessageRoleEnum.System;
      }))) {
        this._context.splice(1, 1);
      } else {
        this._context.splice(0, 1);
      }
    }
  }

  set systemRole(value: string) {
    this._systemRole = value;
    this.updateContext({ role: ChatCompletionRequestMessageRoleEnum.System, content: value, name: "default" });
  }

  get systemRole(): string {
    return this._systemRole;
  }

  get context(): string {
    let result = "";
    this._context.forEach((message: ChatCompletionRequestMessage) => {
      result += `${message.role === ChatCompletionRequestMessageRoleEnum.User ? "User: " : ""}`;
      result += `${message.role === ChatCompletionRequestMessageRoleEnum.Assistant ? "Chat: " : ""}`;
      result += `${message.role === ChatCompletionRequestMessageRoleEnum.System ? "System: " : ""}`;
      result += `${message.content}\n`;
    });
    return result;
  }

  get contextLength(): number {
    return this._context.length;
  }

  get maxContextLength(): number {
    return this.maxCountContext;
  }

  clearContext(): void {
    if (Boolean(this._systemRole.length)) {
      this._context = [{
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: this._systemRole,
        name: "default"
      }];
    } else {
      this._context = [];
    }
  }
}
