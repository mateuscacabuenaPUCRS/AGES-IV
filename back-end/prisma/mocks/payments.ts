import { faker } from "@faker-js/faker";
import { Prisma, PaymentStatus, PaymentMethod } from "@prisma/client";

export const paymentsMock: (
  donationIds: string[]
) => Prisma.PaymentCreateInput[] = (donationIds: string[]) => {
  const payments: Prisma.PaymentCreateInput[] = [];

  const statusDistribution = [
    ...Array(560).fill(PaymentStatus.CONFIRMED),
    ...Array(10).fill(PaymentStatus.PENDING),
    ...Array(10).fill(PaymentStatus.FAILED),
    ...Array(10).fill(PaymentStatus.REFUNDED),
    ...Array(10).fill(PaymentStatus.CANCELED)
  ];

  const shuffledStatuses = faker.helpers.shuffle(statusDistribution);

  donationIds.forEach((donationId, index) => {
    const status = shuffledStatuses[index];
    const paymentMethod = faker.helpers.arrayElement([
      PaymentMethod.PIX,
      PaymentMethod.BANK_SLIP,
      PaymentMethod.CREDIT_CARD
    ]);

    const amount = faker.number.float({ min: 10, max: 500, fractionDigits: 2 });

    let paidAt: Date | undefined = undefined;
    if (status === PaymentStatus.CONFIRMED) {
      paidAt = faker.date.between({ from: "2025-01-01", to: "2025-10-07" });
    }

    payments.push({
      paymentMethod: paymentMethod,
      status: status,
      amount: amount,
      paidAt: paidAt,
      donation: {
        connect: { id: donationId }
      }
    });
  });

  return payments;
};
