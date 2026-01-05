import { Module, Global } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SESv2Client } from "@aws-sdk/client-sesv2";
import { MailAdapter } from "@domain/adapters/mail";
import { MailIntegration } from "@infra/integrations/mail";
import { MailController } from "@infra/controllers/mail";

@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  exports: [MailAdapter],
  controllers: [MailController],
  providers: [
    {
      provide: SESv2Client,
      useFactory: (cfg: ConfigService) =>
        new SESv2Client({
          region: cfg.get<string>("AWS_REGION") || "us-east-2"
        }),
      inject: [ConfigService]
    },
    {
      provide: MailAdapter,
      useClass: MailIntegration
    }
  ]
})
export class MailModule {}
