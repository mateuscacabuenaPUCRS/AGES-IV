import { CampaignDetails } from "@application/dtos/campaign/find-by-id";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { CampaignRepository } from "@domain/repositories/campaign";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindCampaignByIdUseCase {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute(id: string): Promise<CampaignDetails | void> {
    const campaign = await this.campaignRepository.findById(id);

    if (!campaign) {
      return this.exceptionService.notFound({
        message: "Campaign not found"
      });
    }
    return {
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      imageUrl: campaign.imageUrl,
      createdBy: campaign.createdBy,
      targetAmount: campaign.targetAmount.toNumber(),
      currentAmount: campaign.currentAmount.toNumber(),
      achievementPercentage:
        (campaign.currentAmount.toNumber() / campaign.targetAmount.toNumber()) *
        100,
      status: campaign.status,
      isRoot: campaign.isRoot
    };
  }
}
