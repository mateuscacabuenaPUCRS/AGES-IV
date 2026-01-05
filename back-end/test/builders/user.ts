import { User } from "@domain/entities/user";
import { UserRole } from "@domain/entities/user-role-enum";
import { faker } from "@faker-js/faker";

export const createMockUser = (override: Partial<User> = {}): User => ({
  id: faker.string.uuid(),
  fullName: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.lorem.word({ length: 10 }),
  role: faker.helpers.arrayElement(Object.values(UserRole)),
  createdAt: faker.date.past({ years: 1 }),
  updatedAt: new Date(),
  deletedAt: null,
  ...override
});
