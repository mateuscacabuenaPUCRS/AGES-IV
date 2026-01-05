import { MailAdapter, SendEmailParams } from "@domain/adapters/mail";
import { QUEUE_NAME } from "@infra/integrations/queue";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Job } from "bullmq";

@Processor(QUEUE_NAME, { concurrency: 2 })
@Injectable()
export class EmailProcessor extends WorkerHost {
  constructor(private readonly mail: MailAdapter) {
    super();
  }

  async process(job: Job<SendEmailParams>): Promise<void> {
    const data = job.data;

    await this.mail.sendMail({
      to: data.to,
      subject: data.subject,
      body: data.body
    });
  }
}
