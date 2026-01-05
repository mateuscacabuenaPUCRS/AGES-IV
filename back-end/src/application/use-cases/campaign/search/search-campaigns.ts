import {
  FindAllCampaignsDTO,
  FindAllCampaignsResponse
} from "@application/dtos/campaign/find-all";
import { CampaignRepository } from "@domain/repositories/campaign";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SearchCampaignsUseCase {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  async execute({
    page,
    pageSize,
    title,
    startDate,
    status
  }: FindAllCampaignsDTO): Promise<FindAllCampaignsResponse> {
    return await this.campaignRepository.findByTitleAndDateAndStatus(
      title,
      startDate,
      status,
      { page, pageSize }
    );
  }
}
