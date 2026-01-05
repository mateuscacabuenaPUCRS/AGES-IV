import { Newsletter } from "@domain/entities/newsletter";
import { faker } from "@faker-js/faker/.";

export const createMockNewsletter = (
  override: Partial<Newsletter> = {}
): Newsletter => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  createdAt: faker.date.recent(),
  ...override
});
