import { PrismaClient } from "@prisma/client";

export interface Transaction extends PrismaClient {}

export class WithTransaction {
  tx: Transaction;
}

export abstract class TransactionAdapter {
  abstract transaction<R>(fn: (tx: Transaction) => Promise<R>): Promise<R>;
}
