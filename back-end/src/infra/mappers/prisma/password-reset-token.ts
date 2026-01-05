import { PasswordResetToken } from "@domain/entities/password-reset-token";
import { PasswordResetToken as PrismaPasswordResetToken } from "@prisma/client";

export class PasswordResetTokenMapper {
  static toDomain(
    passwordResetToken: PrismaPasswordResetToken
  ): PasswordResetToken {
    return {
      id: passwordResetToken.id,
      token: passwordResetToken.token,
      userId: passwordResetToken.userId,
      createdAt: passwordResetToken.createdAt,
      expiresAt: passwordResetToken.expiresAt
    };
  }
}
