import { PaymentRepository } from "@domain/repositories/payment";

export class PaymentRepositoryStub implements PaymentRepository {
  create(): Promise<void> {
    return;
  }
}
