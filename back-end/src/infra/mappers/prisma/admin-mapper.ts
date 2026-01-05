import { Admin } from "@domain/entities/admin";

export class AdminMapper {
  static toDomain(admin: Admin): Admin {
    return {
      id: admin.id,
      root: admin.root
    };
  }
}
