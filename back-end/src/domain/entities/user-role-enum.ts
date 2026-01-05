export const UserRole = {
  ADMIN: "ADMIN",
  DONOR: "DONOR"
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
