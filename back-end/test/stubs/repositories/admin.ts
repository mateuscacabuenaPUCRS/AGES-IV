import { PaginatedEntity } from "@domain/constants/pagination";
import { Admin } from "@domain/entities/admin";
import {
  AdminDetailsResponse,
  AdminRepository,
  AdminWithUser
} from "@domain/repositories/admin";

export class AdminRepositoryStub implements AdminRepository {
  async update(): Promise<void> {
    return;
  }
  findByIdWithUser(): Promise<AdminWithUser | null> {
    return;
  }
  findAll(): Promise<PaginatedEntity<AdminDetailsResponse>> {
    return;
  }
  findByEmail(): Promise<Admin | null> {
    return;
  }
  findById(): Promise<Admin | null> {
    return;
  }
  delete(): Promise<void> {
    return;
  }
  create(): Promise<void> {
    return;
  }
}
