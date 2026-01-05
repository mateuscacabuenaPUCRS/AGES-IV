import { TransactionAdapter } from "@domain/adapters/transaction";
import { PrismaService } from "@infra/config/prisma";
import { PrismaTransactionIntegration } from "@infra/integrations/transaction";
import { Module } from "@nestjs/common";

@Module({
  providers: [
    PrismaService,
    {
      useClass: PrismaTransactionIntegration,
      provide: TransactionAdapter
    }
  ],
  exports: [TransactionAdapter]
})
export class TransactionModule {}
