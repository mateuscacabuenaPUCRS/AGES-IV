import { DonorMailsResponse } from "@domain/repositories/donor";
import { faker } from "@faker-js/faker";

export const createDonorMail = (
  override: Partial<DonorMailsResponse> = {}
): DonorMailsResponse => ({
  email: faker.internet.email(),
  fullName: faker.person.fullName(),
  ...override
});
