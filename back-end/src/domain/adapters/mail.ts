export interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
}

export abstract class MailAdapter {
  abstract sendMail(mail: SendEmailParams): Promise<void>;
}
