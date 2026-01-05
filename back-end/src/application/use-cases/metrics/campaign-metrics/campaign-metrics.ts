import { ExceptionsAdapter } from "@domain/adapters/exception";
import { CampaignRepository } from "@domain/repositories/campaign";
import { Injectable } from "@nestjs/common";
import { DonationRepository } from "@domain/repositories/donation";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { Campaing } from "@domain/entities/campaign";

interface PaymentComparison {
  paymentMethod: PaymentMethod;
  totalAmount: number;
  totalCount: number;
}

export interface CampaignWithMetrics extends Partial<Campaing> {
  paymentComparison: PaymentComparison[];
}

@Injectable()
export class CampaignMetricsUseCase {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly donationRepository: DonationRepository,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute(id: string): Promise<CampaignWithMetrics | void> {
    const campaign = await this.campaignRepository.findById(id);
    if (!campaign) {
      return this.exceptionService.notFound({
        message: "Campaign not found"
      });
    }

    const donations = await this.donationRepository.findAllByCampaign(id);

    const donationsWithConfirmedPayments = donations.map((donation) => ({
      ...donation,
      payment: donation.payment.filter(
        (payment) => payment.status === PaymentStatus.CONFIRMED
      )
    }));

    const donationsGroupedByPaymentMethod = donationsWithConfirmedPayments
      .filter((donation) => donation.payment.length > 0)
      .reduce((acc, donation) => {
        const paymentMethod = donation.payment[0].paymentMethod;
        if (!acc[paymentMethod]) {
          acc[paymentMethod] = [];
        }
        acc[paymentMethod].push(donation);
        return acc;
      }, {});

    const paymentMethods = Object.keys(donationsGroupedByPaymentMethod);

    const paymentMethodsWithMetrics: PaymentComparison[] = paymentMethods.map(
      (paymentMethod) => {
        const donations = donationsGroupedByPaymentMethod[paymentMethod];

        const totalAmount: number = donations.reduce(
          (acc, donation) => acc + donation.amount,
          0
        );

        const totalCount: number = donations.length;
        return {
          paymentMethod: paymentMethod as PaymentMethod,
          totalAmount,
          totalCount
        };
      }
    );

    const campaignWithMetrics = {
      ...campaign,
      paymentComparison: paymentMethodsWithMetrics,
      targetAmount: campaign.targetAmount.toNumber(),
      currentAmount: campaign.currentAmount.toNumber()
    };

    return campaignWithMetrics;
  }
}
