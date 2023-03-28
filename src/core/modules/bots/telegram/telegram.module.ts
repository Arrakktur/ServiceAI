import { Module } from '@nestjs/common';
import { TelegramService } from "./services/telegram.service";
import { TelegramController } from "./controllers/telegram.controller";
import { ChatGptModule } from "../../neuralNetworks/chat-gpt/chat-gpt.module";

@Module({
  providers: [TelegramService],
  imports: [ChatGptModule],
  exports: [TelegramService],
  controllers: [TelegramController]
})
export class TelegramModule {}
