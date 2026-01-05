import { DonationDetails } from "@application/dtos/donation/find-by-id";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { DonationRepository } from "@domain/repositories/donation";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindDonationByIdUseCase {
  constructor(
    private readonly donationRepository: DonationRepository,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute(id: string, donorId: string): Promise<DonationDetails | void> {
    const donation = await this.donationRepository.findById(id);

    if (!donation) {
      return this.exceptionService.notFound({
        message: "Donation not found"
      });
    }

    if (donation.donorId !== donorId) {
      return this.exceptionService.forbidden({
        message: "You can only view your own donations"
      });
    }

    return {
      id: donation.id,
      amount: donation.amount,
      periodicity: donation.periodicity,
      campaignId: donation.campaignId,
      donorId: donation.donorId,
      createdAt: donation.createdAt
    };
  }
}
