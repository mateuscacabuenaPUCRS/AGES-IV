export const PaymentMethod = {
  PIX: "PIX",
  BANK_SLIP: "BANK_SLIP",
  CREDIT_CARD: "CREDIT_CARD"
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
