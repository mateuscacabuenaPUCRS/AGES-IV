import {
  LoginDTO,
  LoginResponse,
  LoginResponses
} from "@application/dtos/auth/login";
import {
  SendPasswordResetTokenDTO,
  SendPasswordResetTokenResponse,
  SendPasswordResetTokenResponses
} from "@application/dtos/auth/send-password-reset-token";
import {
  VerifyCodeDTO,
  VerifyCodeResponses
} from "@application/dtos/auth/verify-code";
import { LoginUseCase } from "@application/use-cases/auth/login/login";
import { SendPasswordResetTokenUseCase } from "@application/use-cases/auth/send-password-reset-token";
import { VerifyCodeUseCase } from "@application/use-cases/auth/verify-code";
import { Body, Controller, Post } from "@nestjs/common";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly sendPasswordResetTokenUseCase: SendPasswordResetTokenUseCase,
    private readonly verifyCodeUseCase: VerifyCodeUseCase
  ) {}

  @Post("login")
  @LoginResponses
  async login(@Body() body: LoginDTO): Promise<LoginResponse | void> {
    return await this.loginUseCase.execute(body);
  }

  @Post("send-password-reset-token")
  @SendPasswordResetTokenResponses
  async sendPasswordResetToken(
    @Body() body: SendPasswordResetTokenDTO
  ): Promise<SendPasswordResetTokenResponse | void> {
    return await this.sendPasswordResetTokenUseCase.execute(body);
  }

  @Post("verify-code")
  @VerifyCodeResponses
  async verifyCode(@Body() body: VerifyCodeDTO): Promise<void> {
    return await this.verifyCodeUseCase.execute(body);
  }
}
