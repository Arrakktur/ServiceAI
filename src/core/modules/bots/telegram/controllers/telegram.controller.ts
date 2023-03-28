import { Controller, Get, HttpStatus, Res } from "@nestjs/common";
import { TelegramService } from "../services/telegram.service";

@Controller('telegram')
export class TelegramController {

  constructor(private telegramService: TelegramService){}

  @Get()
  getBotDialog(@Res() res) {
    this.telegramService.botMessage();
    res.status(HttpStatus.OK).send("Bot service started");
  }
}
