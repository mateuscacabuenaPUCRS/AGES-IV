import {
  PaginatedEntity,
  PaginationParams
} from "@domain/constants/pagination";
import { UserRole } from "@domain/entities/user-role-enum";
import { Admin, User } from "@prisma/client";

export interface CreateAdminParams {
  email: string;
  fullName: string;
  password: string;
  role: UserRole;
  root: boolean;
}

export interface UpdateAdminParams {
  email?: string;
  fullName?: string;
  password?: string;
  imageUrl?: string;
  root?: boolean;
}

export interface AdminDetailsResponse {
  id: string;
  fullName: string;
  email: string;
  imageUrl: string;
  root: boolean;
}

export interface AdminWithUser extends User, Omit<Admin, "id"> {}

export abstract class AdminRepository {
  abstract create(params: CreateAdminParams): Promise<void>;
  abstract findByEmail(email: string): Promise<Admin | null>;
  abstract findAll(
    params: PaginationParams
  ): Promise<PaginatedEntity<AdminDetailsResponse>>;
  abstract findById(id: string): Promise<Admin | null>;
  abstract findByIdWithUser(id: string): Promise<AdminWithUser | null>;
  abstract update(id: string, params: UpdateAdminParams): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
