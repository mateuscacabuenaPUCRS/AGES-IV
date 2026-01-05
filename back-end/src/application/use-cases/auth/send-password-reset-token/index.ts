import {
  SendPasswordResetTokenDTO,
  SendPasswordResetTokenResponse
} from "@application/dtos/auth/send-password-reset-token";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { QueueAdapter } from "@domain/adapters/queue";
import { passwordResetTemplate } from "@domain/email-templates/email-template";
import { PasswordResetTokenRepository } from "@domain/repositories/password-reset-token";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";
import { randomBytes } from "node:crypto";

@Injectable()
export class SendPasswordResetTokenUseCase {
  constructor(
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
    private readonly userRepository: UserRepository,
    private readonly queueIntegration: QueueAdapter,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute({
    email
  }: SendPasswordResetTokenDTO): Promise<SendPasswordResetTokenResponse | void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return this.exceptionService.notFound({
        message: "User not found"
      });
    }

    const token = this.generateRandomCode();

    await this.passwordResetTokenRepository.create({
      userId: user.id,
      token,
      expiresAt: new Date(Date.now())
    });

    await this.queueIntegration.addJob({
      to: user.email,
      subject: "Redefinição de Senha",
      body: passwordResetTemplate({
        subject: "Redefinição de Senha",
        name: user.fullName,
        code: token
      })
    });

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName
    };
  }

  private generateRandomCode(): string {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";
    const LENGTH = 6;

    const bytes = randomBytes(LENGTH);

    for (let i = 0; i < LENGTH; i++) {
      code += characters[bytes[i] % characters.length];
    }

    return code;
  }
}
