import { LoginUseCase } from "@application/use-cases/auth/login/login";
import { AuthController } from "@infra/controllers/auth";
import { Module } from "@nestjs/common";
import { ExceptionModule } from "../exception";
import { HashModule } from "../hash";
import { TokenModule } from "../token";
import { DatabaseModule } from "../database";
import { SendPasswordResetTokenUseCase } from "@application/use-cases/auth/send-password-reset-token";
import { VerifyCodeUseCase } from "@application/use-cases/auth/verify-code";
import { QueueModule } from "../queue";

@Module({
  imports: [
    DatabaseModule,
    ExceptionModule,
    HashModule,
    TokenModule,
    QueueModule
  ],
  controllers: [AuthController],
  providers: [LoginUseCase, SendPasswordResetTokenUseCase, VerifyCodeUseCase]
})
export class AuthModule {}
