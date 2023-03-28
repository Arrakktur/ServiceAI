import { Module } from "@nestjs/common";
import { DiscordController } from "./controllers/discord.controller";
import { DiscordService } from "./services/discord.service";
import { ChatGptModule } from "../../neuralNetworks/chat-gpt/chat-gpt.module";
@Module({
  controllers: [DiscordController],
  providers: [DiscordService],
  imports: [ChatGptModule],
  exports: [DiscordService]
})
export class DiscordBotModule {
}
