import { EnvConfig } from "@infra/config/env";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DonorModule } from "../donor";
import { DonationModule } from "../donation";
import { AuthModule } from "../auth";
import { EventModule } from "../event";
import { AdminModule } from "../admin";
import { MailModule } from "../mail";
import { FileModule } from "../file";
import { NewsModule } from "../news";
import { MetricsModule } from "../metrics";
import { CampaignModule } from "../campaign";
import { NewsletterModule } from "../newsletter";
import { QueueModule } from "../queue";
import { HealthModule } from "../health";
import { AutomaticMailsModule } from "../automatic-mails";
import { ScheduleModule } from "@nestjs/schedule";
import { HowToHelpModule } from "../how-to-help";
import { DatabaseModule } from "../database";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => EnvConfig.validate(process.env)]
    }),
    DatabaseModule,
    DonorModule,
    DonationModule,
    AuthModule,
    EventModule,
    AdminModule,
    NewsModule,
    MetricsModule,
    FileModule,
    MailModule,
    CampaignModule,
    NewsletterModule,
    QueueModule,
    HealthModule,
    AutomaticMailsModule,
    HowToHelpModule
  ]
})
export class AppModule {}
