import { User } from "@domain/entities/user";
import { UserRepository } from "@domain/repositories/user";

export class UserRepositoryStub implements UserRepository {
  findById(): Promise<User | null> {
    return;
  }
  async findByEmail(): Promise<User | null> {
    return;
  }
}
