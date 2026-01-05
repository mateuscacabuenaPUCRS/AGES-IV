import { SendEmailParams } from "./mail";

export abstract class QueueAdapter {
  abstract addJob(data: SendEmailParams): Promise<void>;
}
