import { User } from "@domain/entities/user";
import { User as PrismaUser } from "@prisma/client";

export class UserMapper {
  static toDomain(user: PrismaUser): User {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      password: user.password,
      imageUrl: user.imageUrl,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt
    };
  }
}
