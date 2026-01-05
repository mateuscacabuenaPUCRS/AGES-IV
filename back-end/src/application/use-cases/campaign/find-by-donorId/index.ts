import {
  PaginatedEntity,
  PaginationParams
} from "@domain/constants/pagination";
import {
  CampaignDonorDetailsResponse,
  CampaignRepository
} from "@domain/repositories/campaign";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindCampaignByDonorIdUseCase {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  async execute(
    donorId: string,
    params: PaginationParams
  ): Promise<PaginatedEntity<CampaignDonorDetailsResponse>> {
    return await this.campaignRepository.findByDonorId(donorId, {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 10
    });
  }
}
