import { Injectable } from '@nestjs/common';
import Discord, { IntentsBitField } from "discord.js";
import { ChatGptService } from "../../../neuralNetworks/chat-gpt/chat-gpt.service";
import { DISCORD_BOT_TOKEN } from "../../../../models/constants/tokens";

@Injectable()
export class DiscordService {
  private readonly allowChannel = ['1089990266305396946', '1080025217113522207', '1080219185507995669']
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
      try {
        if (!this.allowChannel.includes(message.channelId)) return;
        if (message.author.bot) return;
        const command = message.content

        if (command === "ping") {
          const timeTaken = Date.now() - message.createdTimestamp;
          message.reply(`{system} ping: ${timeTaken}ms.`);
          return;
        }

        if (command === "help") {
          message.reply('{system} Список доступных команд:\n' +
            'help - список команд\n' +
            'getContext - получить текущий контекст\n' +
            'clearContext - удалить текущий контекст' +
            '\n\n' +
            'Системные сообщения не относящиеся к сообщениям бота помечаются {system} в начале сообщения')
          return;
        }

        if (command === "getContext") {
          if (this.chatGptService.contextLength) {
            message.reply(`{system} Контекст бота (${this.chatGptService.contextLength} сообщений)\n` + this.chatGptService.context);
          } else {
            message.reply(`{system} Контекст пуст`)
          }
          return;
        }

        if (command === 'clearContext') {
          this.chatGptService.clearContext();
          message.reply('{system}: Контекст очищен')
          return;
        }

        // ответ gpt
        const answer = await this.chatGptService.chat(command);
        message.reply(answer);
      } catch (error) {
        message.reply(`{system} Ошибка выполнения\n${error}`);
      }
    })

    client.login(DISCORD_BOT_TOKEN);
    console.log('init bot');
  }
}
