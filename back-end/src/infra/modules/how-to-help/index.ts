import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { ExceptionModule } from "../exception";
import { UpdateHowToHelpUseCase } from "@application/use-cases/howtohelp/update";
import { HowToHelpController } from "@infra/controllers/howtohelp/how-to-help.controller";

@Module({
  imports: [DatabaseModule, ExceptionModule],
  controllers: [HowToHelpController],
  providers: [UpdateHowToHelpUseCase]
})
export class HowToHelpModule {}
