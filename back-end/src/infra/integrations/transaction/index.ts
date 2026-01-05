import { Transaction, TransactionAdapter } from "@domain/adapters/transaction";
import { PrismaService } from "@infra/config/prisma";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaTransactionIntegration implements TransactionAdapter {
  constructor(private readonly prisma: PrismaService) {}

  async transaction<R>(fn: (tx: Transaction) => Promise<R>): Promise<R> {
    return this.prisma.$transaction(async (tx) => {
      return fn(tx as Transaction);
    }) as Promise<R>;
  }
}
