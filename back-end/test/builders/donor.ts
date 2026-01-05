import { Donor } from "@domain/entities/donor";
import { Gender } from "@domain/entities/gender-enum";
import { UserRole } from "@domain/entities/user-role-enum";
import { DonorWithUser } from "@domain/repositories/donor";
import { faker } from "@faker-js/faker";

export const createMockDonor = (override: Partial<Donor> = {}): Donor => ({
  id: faker.string.uuid(),
  birthDate: faker.date.past({ years: 10 }),
  gender: faker.helpers.arrayElement(Object.values(Gender)),
  phone: faker.phone.number(),
  cpf: faker.string.numeric(11),
  ...override
});

export const createMockDonorWithUser = (
  override: Partial<DonorWithUser> = {}
): DonorWithUser => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: faker.helpers.arrayElement(Object.values(UserRole)),
  cpf: faker.string.numeric({ length: 11 }),
  birthDate: faker.date.birthdate(),
  fullName: faker.person.fullName(),
  gender: faker.helpers.arrayElement(Object.values(Gender)),
  phone: faker.phone.number(),
  createdAt: faker.date.past({ years: 10 }),
  updatedAt: new Date(),
  imageUrl: null,
  deletedAt: null,
  ...override
});
