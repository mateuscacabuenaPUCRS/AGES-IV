import { Donation } from "@domain/entities/donation";
import { DonationDetailsResponseWithPayment } from "@domain/repositories/donation";
import { Payment, Donation as PrismaDonation } from "@prisma/client";

export class DonationMapper {
  static toDomain(donation: PrismaDonation): Donation {
    return {
      id: donation.id,
      amount: Number(donation.amount),
      periodicity: donation.periodicity,
      campaignId: donation.campaignId,
      donorId: donation.donorId,
      createdAt: donation.createdAt
    };
  }

  static toDomainWithPayment(
    donation: PrismaDonation & { payment: Payment[] }
  ): DonationDetailsResponseWithPayment {
    return {
      id: donation.id,
      amount: Number(donation.amount),
      periodicity: donation.periodicity,
      campaignId: donation.campaignId,
      donorId: donation.donorId,
      createdAt: donation.createdAt,
      payment: donation.payment
    };
  }
}
