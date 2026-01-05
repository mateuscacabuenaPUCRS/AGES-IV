import { Module } from "@nestjs/common";
import { DatabaseModule } from "@infra/modules/database";
import { ExceptionModule } from "@infra/modules/exception";
import { NewsletterController } from "@infra/controllers/newsletter";
import { CreateNewsletterUseCase } from "@application/use-cases/newsletter/create/create-newsletter";
import { ExportExcelUseCase } from "@application/use-cases/newsletter/export-excel/export-excel";

@Module({
  imports: [DatabaseModule, ExceptionModule],
  controllers: [NewsletterController],
  providers: [CreateNewsletterUseCase, ExportExcelUseCase]
})
export class NewsletterModule {}
