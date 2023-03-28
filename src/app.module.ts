import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TelegramModule } from "./core/modules/bots/telegram/telegram.module";
import { ChatGptModule } from "./core/modules/neuralNetworks/chat-gpt/chat-gpt.module";
import { DiscordBotModule } from "./core/modules/bots/discord/discord.module";

@Module({
  imports: [TelegramModule, ChatGptModule, DiscordBotModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
