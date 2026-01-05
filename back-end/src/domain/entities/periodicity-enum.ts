export const Periodicity = {
  MONTHLY: "MONTHLY",
  QUARTERLY: "QUARTERLY",
  SEMIANNUALLY: "SEMI_ANNUAL",
  YEARLY: "YEARLY",
  CANCELED: "CANCELED"
} as const;

export type Periodicity = (typeof Periodicity)[keyof typeof Periodicity];
