export class PasswordResetToken {
  id: string;
  token: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
}
