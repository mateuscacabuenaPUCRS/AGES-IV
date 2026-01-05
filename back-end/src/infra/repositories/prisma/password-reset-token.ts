import { PasswordResetToken } from "@domain/entities/password-reset-token";
import {
  PasswordResetTokenRepository,
  CreatePasswordResetTokenParams
} from "@domain/repositories/password-reset-token";
import { PrismaService } from "@infra/config/prisma";
import { PasswordResetTokenMapper } from "@infra/mappers/prisma/password-reset-token";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaPasswordResetTokenRepository
  implements PasswordResetTokenRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create({
    expiresAt,
    token,
    userId
  }: CreatePasswordResetTokenParams): Promise<void> {
    await this.prisma.passwordResetToken.create({
      data: {
        expiresAt,
        token,
        userId
      }
    });
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    const passwordResetToken = await this.prisma.passwordResetToken.findFirst({
      where: {
        token,
        user: {
          deletedAt: null
        }
      }
    });

    if (!passwordResetToken) return null;

    return PasswordResetTokenMapper.toDomain(passwordResetToken);
  }

  async findByUserId(userId: string): Promise<PasswordResetToken | null> {
    const passwordResetToken = await this.prisma.passwordResetToken.findFirst({
      where: {
        userId,
        user: {
          deletedAt: null
        }
      }
    });
    if (!passwordResetToken) return null;

    return PasswordResetTokenMapper.toDomain(passwordResetToken);
  }

  async deleteManyByUserId(userId: string): Promise<void> {
    await this.prisma.passwordResetToken.deleteMany({
      where: {
        userId,
        user: {
          deletedAt: null
        }
      }
    });
  }
}
