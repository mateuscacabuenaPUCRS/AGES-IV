import { faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";

export const newsletterMock: Prisma.NewsletterCreateInput[] = Array.from({
  length: 200
}).map(() => ({
  email: faker.internet.email()
}));
