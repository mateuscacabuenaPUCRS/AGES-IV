import { Transaction, TransactionAdapter } from "@domain/adapters/transaction";

export class TransactionServiceStub implements TransactionAdapter {
  async transaction<R>(fn: (tx: Transaction) => Promise<R>): Promise<R> {
    const mockTx = {};
    return fn(mockTx as Transaction);
  }
}
