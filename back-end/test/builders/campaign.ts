import { Campaign, CampaignStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { Decimal } from "@prisma/client/runtime/library";

export const createMockCampaign = (
  override: Partial<Campaign> = {}
): Campaign => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence(3),
  description: faker.lorem.paragraph(),
  targetAmount: new Decimal(
    faker.number.float({ min: 1000, max: 50000, fractionDigits: 2 })
  ),
  currentAmount: new Decimal(
    faker.number.float({ min: 0, max: 1000, fractionDigits: 2 })
  ),
  startDate: faker.date.future(),
  endDate: faker.date.future({ years: 1 }),
  imageUrl: faker.image.url(),
  status: faker.helpers.arrayElement(Object.values(CampaignStatus)),
  createdBy: faker.string.uuid(),
  isRoot: false,
  ...override
});
