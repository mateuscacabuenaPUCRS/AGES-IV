import { SendBirthdayMailUseCase } from "@application/use-cases/mails/birthday/send-birthday-mail";
import { SendChristmasMailUseCase } from "@application/use-cases/mails/christmas-template/send-christmas-mail";
import { SendNewYearMailUseCase } from "@application/use-cases/mails/new-year/send-new-year-maill";
import { SendSantoAntonioMailUseCase } from "@application/use-cases/mails/santo-antonio/send-santo-antonio-mail";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { QueueModule } from "../queue";
import { AutomaticMailsController } from "@infra/controllers/automatic-mails";

@Module({
  imports: [DatabaseModule, QueueModule],
  providers: [
    SendSantoAntonioMailUseCase,
    SendNewYearMailUseCase,
    SendBirthdayMailUseCase,
    SendChristmasMailUseCase
  ],
  controllers: [AutomaticMailsController]
})
export class AutomaticMailsModule {}
