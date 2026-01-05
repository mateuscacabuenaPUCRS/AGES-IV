import type { CampaignStatus } from "@/types/Campaign";
import api from "../api";

// Note: Este endpoint retorna gender em minúsculo (male/female/other)
// diferente do endpoint geral que retorna em maiúsculo (MALE/FEMALE/OTHER)
export const CampaignGender = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
} as const;

export type CampaignGender = (typeof CampaignGender)[keyof typeof CampaignGender];

export const CampaignGenderLabel: Record<CampaignGender, string> = {
  male: "Masculino",
  female: "Feminino",
  other: "Outro",
};

export type GenderDistribution = {
  gender: CampaignGender;
  count: number;
};

export type AgeDistribution = {
  ageRange: string;
  count: number;
};

export type DonorsCampaignSocialDataResponse = {
  campaign: {
    description: string;
    targetAmount: number;
    currentAmount: number;
    percentage: number;
    startDate: Date;
    endDate: Date;
    imageUrl: string;
    campaignStatus: CampaignStatus;
  };
  genderDistribution: GenderDistribution[];
  ageDistribution: AgeDistribution[];
};

export async function getDonorsCampaignSocialData(
  id: string
): Promise<DonorsCampaignSocialDataResponse> {
  const response = await api.get(`/metrics/campaigns/${id}/social-data`);

  return {
    campaign: {
      description: response.data.campaign.description,
      targetAmount: response.data.campaign.targetAmount,
      currentAmount: response.data.campaign.currentAmount,
      percentage: response.data.campaign.percentage,
      startDate: new Date(response.data.campaign.startDate),
      endDate: new Date(response.data.campaign.endDate),
      imageUrl: response.data.campaign.imageUrl,
      campaignStatus: response.data.campaign.campaignStatus,
    },
    genderDistribution: response.data.genderDistribution.map((item: GenderDistribution) => ({
      gender: item.gender as CampaignGender,
      count: item.count,
    })),
    ageDistribution: response.data.ageDistribution.map((item: AgeDistribution) => ({
      ageRange: item.ageRange,
      count: item.count,
    })),
  };
}
