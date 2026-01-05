import { SendEmailParams } from "@domain/adapters/mail";
import { QueueAdapter } from "@domain/adapters/queue";
import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";

export const QUEUE_NAME = "email";
export const QUEUE_JOB_NAME = "send-email";

@Injectable()
export class QueueIntegration implements QueueAdapter {
  private readonly attempts: number = Number(process.env.QUEUE_ATTEMPTS) || 5;
  private readonly delayBetweenAttempts: number =
    Number(process.env.QUEUE_DELAY_BETWEEN_ATTEMPTS) || 10_000;

  constructor(@InjectQueue(QUEUE_NAME) private readonly queue: Queue) {}

  async addJob(data: SendEmailParams): Promise<void> {
    await this.queue.add(QUEUE_JOB_NAME, data, {
      attempts: this.attempts,
      backoff: { type: "exponential", delay: this.delayBetweenAttempts }
    });
  }
}
