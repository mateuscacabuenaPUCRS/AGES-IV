import type { DonorDonation } from "@/services/donors";
import type { DonorDonationsAPI } from "@/services/donations";
import type { CampaignDonation } from "../types";

export function transformDonations(donationsData: DonorDonation[]): DonorDonationsAPI[] {
  return (donationsData || []).map((donation) => ({
    id: donation.id,
    amount: parseFloat(donation.amount) || 0,
    periodicity: donation.periodicity,
    campaignId: donation.campaignId,
    campaignName: donation.campaign?.title || "Doação Direta",
    campaignCreatedBy:
      donation.campaign?.user?.fullName || donation.campaign?.createdBy || "Fundação",
    createdAt: donation.createdAt,
    donorId: donation.donorId,
  }));
}

export function extractUniqueCampaigns(donationsData: DonorDonation[]): CampaignDonation[] {
  const campaignsMap = new Map<string, CampaignDonation>();

  donationsData.forEach((donation) => {
    if (donation.campaign && !campaignsMap.has(donation.campaignId)) {
      campaignsMap.set(donation.campaignId, {
        title: donation.campaign.title,
        creatorName: donation.campaign.user?.fullName || donation.campaign.createdBy || "Fundação",
        raised: parseFloat(donation.campaign.currentAmount) || 0,
        goal: parseFloat(donation.campaign.targetAmount) || 0,
        situation: "recurring" as const,
        donationAmount: parseFloat(donation.amount) || 0,
      });
    }
  });

  return Array.from(campaignsMap.values());
}
