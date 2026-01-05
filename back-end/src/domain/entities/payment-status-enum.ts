export const PaymentStatus = {
  PENDING: "PENDING",
  AUTHORIZED: "AUTHORIZED",
  CONFIRMED: "CONFIRMED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
  CANCELED: "CANCELED"
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
