import { CreateDonationDTO } from "@application/dtos/donation/create";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { DonationRepository } from "@domain/repositories/donation";
import { Injectable } from "@nestjs/common";
import { DonorRepository } from "@domain/repositories/donor";
import { CampaignRepository } from "@domain/repositories/campaign";
import { PaymentRepository } from "@domain/repositories/payment";
import { TransactionAdapter } from "@domain/adapters/transaction";
import { PaymentStatus } from "@domain/entities/payment-status-enum";

@Injectable()
export class CreateDonationUseCase {
  constructor(
    private readonly donationRepository: DonationRepository,
    private readonly donorRepository: DonorRepository,
    private readonly campaignRepository: CampaignRepository,
    private readonly exceptionService: ExceptionsAdapter,
    private readonly paymentRepository: PaymentRepository,
    private readonly transactionService: TransactionAdapter
  ) {}

  async execute(dto: CreateDonationDTO): Promise<void> {
    const { amount, periodicity, campaignId, paymentMethod, donorId } = dto;

    const numericAmount = Number(amount);

    let donor = null;

    if (donorId) {
      donor = await this.donorRepository.findById(donorId);

      if (!donor) {
        return this.exceptionService.notFound({
          message: "Donor not found"
        });
      }
    }

    let campaign = null;

    if (campaignId) {
      campaign = await this.campaignRepository.findById(campaignId);

      if (!campaign) {
        return this.exceptionService.notFound({
          message: "Campaign not found"
        });
      }
    }

    await this.transactionService.transaction(async (tx) => {
      const donation = await this.donationRepository.create(
        {
          amount: numericAmount,
          periodicity,
          campaignId,
          donorId
        },
        tx
      );

      await this.paymentRepository.create(
        {
          paymentMethod,
          status: PaymentStatus.CONFIRMED,
          amount: numericAmount,
          donationId: donation.id,
          paidAt: new Date()
        },
        tx
      );
    });

    const current = Number(campaign.currentAmount);

    await this.campaignRepository.update(campaignId, {
      currentAmount: current + numericAmount
    });
  }
}
