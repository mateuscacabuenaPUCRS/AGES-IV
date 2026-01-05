import { faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";

export const addressesMock: Prisma.AddressCreateInput[] = Array.from({
  length: 55
}).map((_, index) => ({
  street: faker.location.streetAddress(),
  number: faker.number.int({ min: 1, max: 9999 }).toString(),
  district: faker.location.county(),
  city: faker.location.city(),
  state: faker.location.state({ abbreviated: true }),
  postalCode: faker.location.zipCode("#####-###"),
  complement: faker.datatype.boolean() ? faker.lorem.words(2) : null,
  donor: {
    connect: {
      id: `donor-${index + 1}`
    }
  }
}));
