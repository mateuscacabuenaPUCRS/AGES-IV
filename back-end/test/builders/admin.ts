import { Admin } from "@domain/entities/admin";
import { AdminWithUser } from "@domain/repositories/admin";
import { UserRole } from "@domain/entities/user-role-enum";
import { faker } from "@faker-js/faker";

export const createMockAdmin = (override: Partial<Admin> = {}): Admin => ({
  id: faker.string.uuid(),
  root: faker.datatype.boolean(),
  ...override
});

export const createMockAdminWithUser = (
  override: Partial<AdminWithUser> = {}
): AdminWithUser => ({
  id: faker.string.uuid(),
  fullName: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.lorem.word({ length: 10 }),
  role: UserRole.ADMIN,
  root: faker.datatype.boolean(),
  createdAt: faker.date.past({ years: 1 }),
  updatedAt: new Date(),
  deletedAt: null,
  imageUrl: null,
  ...override
});
