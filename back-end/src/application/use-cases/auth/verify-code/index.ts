import { VerifyCodeDTO } from "@application/dtos/auth/verify-code";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { PasswordResetTokenRepository } from "@domain/repositories/password-reset-token";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

@Injectable()
export class VerifyCodeUseCase {
  constructor(
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
    private readonly userRepository: UserRepository,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute({ userId, token }: VerifyCodeDTO): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return this.exceptionService.notFound({
        message: "User not found"
      });
    }

    const passwordResetToken =
      await this.passwordResetTokenRepository.findByToken(token);

    if (!passwordResetToken) {
      return this.exceptionService.badRequest({
        message: "Invalid token"
      });
    }

    if (passwordResetToken.userId !== user.id) {
      return this.exceptionService.badRequest({
        message: "Invalid token"
      });
    }

    if (passwordResetToken.expiresAt < new Date()) {
      return this.exceptionService.badRequest({
        message: "Invalid token"
      });
    }
  }
}
