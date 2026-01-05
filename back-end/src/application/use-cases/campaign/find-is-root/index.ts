import { CampaignRepository } from "@domain/repositories/campaign";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindIsRootCampaignUseCase {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  async execute() {
    const campaign = await this.campaignRepository.findRootCampaign();
    return campaign;
  }
}
