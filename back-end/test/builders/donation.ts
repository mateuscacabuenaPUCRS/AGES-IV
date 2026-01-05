import { Donation } from "@domain/entities/donation";
import { Periodicity } from "@domain/entities/periodicity-enum";
import { faker } from "@faker-js/faker";

export const createMockDonation = (
  override: Partial<Donation> = {}
): Donation => ({
  id: faker.string.uuid(),
  amount: faker.number.float({ min: 100, max: 1000, fractionDigits: 2 }),
  periodicity: faker.helpers.arrayElement(Object.values(Periodicity)),
  campaignId: faker.string.uuid(),
  donorId: faker.string.uuid(),
  createdAt: faker.date.recent(),
  ...override
});
