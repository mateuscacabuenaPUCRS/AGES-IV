import { CampaignDonorDetailsResponse } from "@domain/repositories/campaign";
import { Campaign } from "@prisma/client";

interface CampaignDetailsWithUser extends Campaign {
  user: {
    fullName: string;
  };
}

export class CampaignMapper {
  static toDomain(campaign: Campaign): Campaign {
    return {
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      imageUrl: campaign.imageUrl,
      targetAmount: campaign.targetAmount,
      currentAmount: campaign.currentAmount,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      status: campaign.status,
      createdBy: campaign.createdBy,
      isRoot: campaign.isRoot
    };
  }

  static toDomainDonorDetails(
    campaignDetails: CampaignDetailsWithUser
  ): CampaignDonorDetailsResponse {
    return {
      id: campaignDetails.id,
      title: campaignDetails.title,
      description: campaignDetails.description,
      imageUrl: campaignDetails.imageUrl,
      targetAmount: campaignDetails.targetAmount,
      currentAmount: campaignDetails.currentAmount,
      startDate: campaignDetails.startDate,
      endDate: campaignDetails.endDate,
      status: campaignDetails.status,
      createdBy: campaignDetails.createdBy,
      creatorName: campaignDetails.user.fullName,
      isRoot: campaignDetails.isRoot
    };
  }
}
