import { Event } from "@domain/entities/event";
import { faker } from "@faker-js/faker";

export const createMockEvent = (override: Partial<Event> = {}): Event => ({
  id: faker.string.uuid(),
  title: faker.lorem.words(3),
  description: faker.lorem.paragraph(),
  location: faker.location.city(),
  dateStart: faker.date.future(),
  dateEnd: faker.date.future(),
  url: faker.internet.url(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...override
});
