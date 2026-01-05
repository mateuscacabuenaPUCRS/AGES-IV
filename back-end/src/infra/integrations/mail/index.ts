import {
  EmailContent,
  SendEmailCommand,
  SendEmailRequest,
  SESv2Client
} from "@aws-sdk/client-sesv2";
import { MailAdapter, SendEmailParams } from "@domain/adapters/mail";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailIntegration implements MailAdapter {
  private readonly from: string = process.env.MAIL_FROM;
  private readonly defaultReplyTo?: string = process.env.MAIL_REPLY_TO;

  constructor(private readonly ses: SESv2Client) {}
  async sendMail({ body, subject, to }: SendEmailParams): Promise<void> {
    const content: EmailContent = {
      Simple: {
        Subject: { Data: subject, Charset: "UTF-8" },
        Body: { Html: { Data: body, Charset: "UTF-8" } }
      }
    };

    const input: SendEmailRequest = {
      FromEmailAddress: this.from,
      Destination: {
        ToAddresses: [to]
      },
      Content: content,
      ReplyToAddresses: [this.defaultReplyTo]
    };

    await this.ses.send(new SendEmailCommand(input));
  }
}
