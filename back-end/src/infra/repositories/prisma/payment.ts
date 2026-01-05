import { Transaction } from "@domain/adapters/transaction";
import {
  CreatePaymentParams,
  PaymentRepository
} from "@domain/repositories/payment";
import { PrismaService } from "@infra/config/prisma";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaPaymentRepository implements PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: CreatePaymentParams, tx?: Transaction): Promise<void> {
    const dbInstance = tx ?? this.prisma;

    await dbInstance.payment.create({
      data: {
        paymentMethod: params.paymentMethod,
        status: params.status,
        amount: params.amount,
        donationId: params.donationId,
        paidAt: params.paidAt
      }
    });
  }
}
