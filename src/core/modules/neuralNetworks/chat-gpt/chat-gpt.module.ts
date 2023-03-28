import { Module } from '@nestjs/common';
import { ChatGptService } from "./chat-gpt.service";
import { NecordModule } from "necord";

@Module({
  providers: [ChatGptService],
  exports: [ChatGptService],
})
export class ChatGptModule {}
