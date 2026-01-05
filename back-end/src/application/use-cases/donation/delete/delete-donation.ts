import { Injectable } from "@nestjs/common";
import { DonationRepository } from "@domain/repositories/donation";
import { ExceptionsAdapter } from "@domain/adapters/exception";

@Injectable()
export class DeleteDonationUseCase {
  constructor(
    private readonly donationRepository: DonationRepository,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute(donationId: string, donorId: string): Promise<void> {
    const donation = await this.donationRepository.findById(donationId);

    if (!donation) {
      return this.exceptionService.notFound({ message: "Donation not found" });
    }

    if (donation.donorId !== donorId) {
      return this.exceptionService.forbidden({
        message: "You can only delete your own donations"
      });
    }

    await this.donationRepository.delete(donationId);
  }
}
