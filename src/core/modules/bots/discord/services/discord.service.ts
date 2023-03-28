import { Injectable } from '@nestjs/common';
import Discord, { IntentsBitField } from "discord.js";
import { DISCORD_BOT_TOKEN } from "../constants/tokens";
import { ChatGptService } from "../../../neuralNetworks/chat-gpt/chat-gpt.service";

@Injectable()
export class DiscordService {
  private readonly allowChannel = ['1089990266305396946']
  constructor(private chatGptService: ChatGptService) {
    this.initialize();
  }

  async initialize(): Promise<void> {
    const Discord = require('discord.js');
    const client = new Discord.Client( {intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildBans,
        IntentsBitField.Flags.MessageContent,
      ]});

    client.on("messageCreate", async (message) => {
      if (!this.allowChannel.includes(message.channelId)) return;
      if (message.author.bot) return;
      const command = message.content

      if (command === "ping") {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
        return;
      }

      // ответ gpt
      const answer = await this.chatGptService.chat(command);
      message.reply(answer);
    })

    client.login(DISCORD_BOT_TOKEN);
    console.log('init bot');
  }
}
