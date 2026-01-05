import { DonorStatisticsData } from "@domain/repositories/metrics";
import { Gender } from "@domain/entities/gender-enum";
import { faker } from "@faker-js/faker";

export const createMockDonorSocialData = (
  override: Partial<DonorStatisticsData> = {}
): DonorStatisticsData => ({
  id: faker.string.uuid(),
  fullName: faker.person.fullName(),
  gender: faker.helpers.arrayElement(Object.values(Gender)),
  birthDate: faker.date.birthdate({ min: 18, max: 80, mode: "age" }),
  ...override
});

export const createMockDonorsSocialDataList = (
  count: number = 5,
  override: Partial<DonorStatisticsData> = {}
): DonorStatisticsData[] => {
  return Array.from({ length: count }, () =>
    createMockDonorSocialData(override)
  );
};
