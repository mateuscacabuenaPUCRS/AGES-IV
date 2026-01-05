import {
  SendEmailDTO,
  SendEmailResponseDecorator
} from "@application/dtos/mail/send";
import { QueueAdapter } from "@domain/adapters/queue";
import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Mail")
@Controller("mail")
export class MailController {
  constructor(private readonly queueIntegration: QueueAdapter) {}

  @Post("send")
  @SendEmailResponseDecorator
  async sendEmail(@Body() mail: SendEmailDTO): Promise<void> {
    await this.queueIntegration.addJob({
      to: mail.to,
      subject: mail.subject,
      body: mail.html
    });
  }
}
