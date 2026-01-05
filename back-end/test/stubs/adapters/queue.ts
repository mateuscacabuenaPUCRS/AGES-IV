import { QueueAdapter } from "@domain/adapters/queue";

export class QueueIntegrationStub implements QueueAdapter {
  addJob(): Promise<void> {
    return;
  }
}
