import type { DonorCampaignsAPI } from "@/services/campaigns";
import type { CampaignCard, SituationType } from "../types";

function toCampaignCard(campaign: DonorCampaignsAPI): CampaignCard {
  return {
    title: campaign.title,
    raised: Number(campaign.currentAmount),
    goal: Number(campaign.targetAmount),
    situation: campaign.status as SituationType,
    donationAmount: parseFloat(campaign.currentAmount),
    creatorName: campaign.creatorName,
  };
}

export const campaignAdapter = {
  toCampaignCard,
};
