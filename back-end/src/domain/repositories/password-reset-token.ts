import { PasswordResetToken } from "@domain/entities/password-reset-token";

export type CreatePasswordResetTokenParams = Omit<
  PasswordResetToken,
  "id" | "createdAt"
>;

export abstract class PasswordResetTokenRepository {
  abstract create(params: CreatePasswordResetTokenParams): Promise<void>;
  abstract findByToken(token: string): Promise<PasswordResetToken | null>;
  abstract findByUserId(userId: string): Promise<PasswordResetToken | null>;
  abstract deleteManyByUserId(userId: string): Promise<void>;
}
