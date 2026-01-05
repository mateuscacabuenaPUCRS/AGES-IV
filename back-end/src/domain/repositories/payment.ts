import { Transaction } from "@domain/adapters/transaction";
import { Payment } from "@domain/entities/payment";

export type CreatePaymentParams = Omit<Payment, "id">;

export abstract class PaymentRepository {
  abstract create(params: CreatePaymentParams, tx?: Transaction): Promise<void>;
}
