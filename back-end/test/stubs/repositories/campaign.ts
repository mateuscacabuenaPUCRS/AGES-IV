import { PaginatedEntity } from "@domain/constants/pagination";
import { Campaign } from "@prisma/client";
import {
  CampaignRepository,
  CampaignDetailsResponse,
  CampaignDonorDetailsResponse
} from "@domain/repositories/campaign";

export class CampaignRepositoryStub implements CampaignRepository {
  findByDonorId(): Promise<PaginatedEntity<CampaignDonorDetailsResponse>> {
    return;
  }
  async create(): Promise<void> {
    return;
  }

  async findById(): Promise<Campaign | null> {
    return;
  }

  async findByTitleAndDateAndStatus(): Promise<
    PaginatedEntity<CampaignDetailsResponse>
  > {
    return;
  }

  async update(): Promise<void> {
    return;
  }

  async delete(): Promise<void> {
    return;
  }

  async findRootCampaign(): Promise<Campaign> {
    return;
  }

  async updateIsRoot(id: string, isRoot: boolean): Promise<void> {
    return;
  }
}
