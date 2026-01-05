import { User } from "@domain/entities/user";
import { UserRepository } from "@domain/repositories/user";
import { PrismaService } from "@infra/config/prisma";
import { UserMapper } from "@infra/mappers/prisma/user-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        deletedAt: null
      }
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }
}
