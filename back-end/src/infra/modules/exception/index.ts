import { ExceptionsAdapter } from "@domain/adapters/exception";
import { ExceptionIntegration } from "@infra/integrations/exception";
import { Module } from "@nestjs/common";

@Module({
  providers: [
    {
      provide: ExceptionsAdapter,
      useClass: ExceptionIntegration
    }
  ],
  exports: [ExceptionsAdapter]
})
export class ExceptionModule {}
