import { faker } from "@faker-js/faker";
import { Prisma, Periodicity } from "@prisma/client";

export const donationsMock: (
  campaignIds: string[],
  donorIds: string[]
) => Prisma.DonationCreateInput[] = (
  campaignIds: string[],
  donorIds: string[]
) => {
  const donations: Prisma.DonationCreateInput[] = [];
  const donationsPerCampaign = 20;

  campaignIds.forEach((campaignId) => {
    for (let i = 0; i < donationsPerCampaign; i++) {
      const roundAmounts = [
        10, 20, 25, 30, 50, 75, 100, 150, 200, 250, 300, 500
      ];
      const shouldUseRoundAmount = faker.datatype.boolean({ probability: 0.8 });
      const amount = shouldUseRoundAmount
        ? faker.helpers.arrayElement(roundAmounts)
        : faker.number.float({ min: 10, max: 500, fractionDigits: 2 });

      const createdAt = faker.date.between({
        from: "2025-01-01",
        to: "2025-10-07"
      });

      const hasPeriodicity = faker.datatype.boolean({ probability: 0.3 });
      const periodicity = hasPeriodicity
        ? faker.helpers.arrayElement([
            Periodicity.MONTHLY,
            Periodicity.QUARTERLY,
            Periodicity.SEMI_ANNUAL,
            Periodicity.YEARLY
          ])
        : undefined;

      donations.push({
        amount: amount,
        periodicity: periodicity,
        createdAt: createdAt,
        campaign: {
          connect: { id: campaignId }
        },
        donor: {
          connect: { id: faker.helpers.arrayElement(donorIds) }
        }
      });
    }
  });

  return donations;
};
