import { SendBirthdayMailUseCase } from "@application/use-cases/mails/birthday/send-birthday-mail";
import { SendChristmasMailUseCase } from "@application/use-cases/mails/christmas-template/send-christmas-mail";
import { SendNewYearMailUseCase } from "@application/use-cases/mails/new-year/send-new-year-maill";
import { SendSantoAntonioMailUseCase } from "@application/use-cases/mails/santo-antonio/send-santo-antonio-mail";
import { Controller, Post } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

@Controller("automatic-mails")
export class AutomaticMailsController {
  constructor(
    private readonly sendSantoAntonioMailUseCase: SendSantoAntonioMailUseCase,
    private readonly sendNewYearMailUseCase: SendNewYearMailUseCase,
    private readonly sendBirthdayMailUseCase: SendBirthdayMailUseCase,
    private readonly sendChristmasMailUseCase: SendChristmasMailUseCase
  ) {}

  @Cron("0 9 13 6 *", {
    timeZone: "America/Sao_Paulo"
  })
  @Post("send-santo-antonio-mail")
  async sendSantoAntonioMail(): Promise<void> {
    return await this.sendSantoAntonioMailUseCase.execute();
  }

  @Cron("0 9 1 1 *", {
    timeZone: "America/Sao_Paulo"
  })
  @Post("send-new-year-mail")
  async sendNewYearMail(): Promise<void> {
    return await this.sendNewYearMailUseCase.execute();
  }

  @Cron(CronExpression.EVERY_DAY_AT_5AM, {
    timeZone: "America/Sao_Paulo"
  })
  @Post("send-birthday-mail")
  async sendBirthdayMail(): Promise<void> {
    return await this.sendBirthdayMailUseCase.execute();
  }

  @Cron("0 9 25 12 *", {
    timeZone: "America/Sao_Paulo"
  })
  @Post("send-christmas-mail")
  async sendChristmasMail(): Promise<void> {
    return await this.sendChristmasMailUseCase.execute();
  }
}
