import { QueueAdapter } from "@domain/adapters/queue";
import { Module, Global } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { QUEUE_NAME, QueueIntegration } from "@infra/integrations/queue";
import { BullModule } from "@nestjs/bullmq";
import { EmailProcessor } from "@infra/workers/email";
import { MailModule } from "../mail";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT ?? 6379),
        password: process.env.REDIS_PASS
      }
    }),
    BullModule.registerQueue({ name: QUEUE_NAME }),
    MailModule
  ],
  providers: [
    EmailProcessor,
    {
      provide: QueueAdapter,
      useClass: QueueIntegration
    }
  ],
  exports: [QueueAdapter, BullModule]
})
export class QueueModule {}
