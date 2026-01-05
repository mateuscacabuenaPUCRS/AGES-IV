import {
  PaginatedEntity,
  PaginationParams
} from "@domain/constants/pagination";
import { Campaign, CampaignStatus } from "@prisma/client";

export interface CreateCampaignParams {
  title: string;
  description: string;
  targetAmount: number;
  startDate: Date;
  endDate: Date;
  imageUrl: string;
  status: CampaignStatus;
  createdBy: string;
}

export interface UpdateCampaignParams {
  title?: string;
  description?: string;
  targetAmount?: number;
  currentAmount?: number;
  startDate?: Date;
  endDate?: Date;
  imageUrl?: string;
  status?: CampaignStatus;
  createdBy?: string;
}

export interface CampaignDetailsResponse {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  achievementPercentage: number;
  startDate: Date;
  endDate: Date;
  imageUrl: string;
  status: CampaignStatus;
  createdBy: string;
  isRoot: boolean;
}

export interface CampaignDonorDetailsResponse extends Campaign {
  creatorName: string;
}

export abstract class CampaignRepository {
  abstract create(params: CreateCampaignParams): Promise<void>;
  abstract findById(id: string): Promise<Campaign | null>;
  abstract findByTitleAndDateAndStatus(
    title?: string,
    startDate?: Date,
    status?: CampaignStatus,
    params?: PaginationParams
  ): Promise<PaginatedEntity<CampaignDetailsResponse>>;
  abstract update(id: string, params: UpdateCampaignParams): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findByDonorId(
    donorId: string,
    params: PaginationParams
  ): Promise<PaginatedEntity<CampaignDonorDetailsResponse>>;

  abstract updateIsRoot(id: string, isRoot: boolean): Promise<void>;

  abstract findRootCampaign(): Promise<Campaign>;
}
