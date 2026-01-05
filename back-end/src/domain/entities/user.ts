import { UserRole } from "./user-role-enum";

export class User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  imageUrl?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
