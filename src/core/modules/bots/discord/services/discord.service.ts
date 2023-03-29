import { Injectable } from '@nestjs/common';
import Discord, { IntentsBitField, Message } from "discord.js";
import { ChatGptService } from "../../../neuralNetworks/chat-gpt/chat-gpt.service";
import { DISCORD_BOT_TOKEN } from "../../../../models/constants/tokens";

@Injectable()
export class DiscordService {
  private readonly allowChannel = ['1089990266305396946', '1080025217113522207', '1080219185507995669']
  constructor(private chatGptService: ChatGptService) {
    const init = this.initialize();
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

    client.on("messageCreate", async (message: Message<boolean>) => {
      try {
        if (!this.allowChannel.includes(message.channelId)) return;
        if (message.author.bot) return;
        const command = message.content

        if (command === "ping") {
          const timeTaken = Date.now() - message.createdTimestamp;
          return message.reply(`{system} ping: ${timeTaken}ms.`);
        }

        if (command === "help") {
          return message.reply('{system} Список доступных команд:\n' +
            'help - список команд\n' +
            'getContext - получить текущий контекст\n' +
            'clearContext - удалить текущий контекст' +
            '\n\n' +
            'Системные сообщения не относящиеся к сообщениям бота помечаются {system} в начале сообщения')
        }

        if (command === "getContext") {
          if (this.chatGptService.contextLength) {
            return message.reply(`{system} Контекст бота (${this.chatGptService.contextLength} сообщений)\n` + this.chatGptService.context);
          }
            return message.reply(`{system} Контекст пуст`)
        }

        if (command === 'clearContext') {
          this.chatGptService.clearContext();
          return message.reply('{system}: Контекст очищен')
        }

        // ответ gpt
        const answer = await this.chatGptService.chat(command);
        return message.reply(answer);
      } catch (error) {
        return message.reply(`{system} Ошибка выполнения\n${error}`);
      }
    })

    await client.login(DISCORD_BOT_TOKEN);
  }
}
