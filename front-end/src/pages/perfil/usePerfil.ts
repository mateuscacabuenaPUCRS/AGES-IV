import { useEffect, useState } from "react";

import { getDonorCampaigns } from "@/services/campaigns";
import {
  getDonorDonations as getDonorDonationsService,
  updateDonation,
  type DonorDonationsAPI,
} from "@/services/donations";
import { deleteAccount, updateAccount } from "@/services/auth";
import type { RoleEnum, User } from "@/contexts/UserContext";
import type { CampaignDonation } from "./types";
import { campaignAdapter } from "./utils/campaignAdapter";

interface UsePerfilOptions {
  campaignsPage: number;
  campaignsPageSize: number;
  donationsPage: number;
  donationsPageSize: number;
  shouldLoadData?: boolean;
}

export function usePerfil({
  campaignsPage,
  campaignsPageSize,
  donationsPage,
  donationsPageSize,
  shouldLoadData = true,
}: UsePerfilOptions) {
  const [campaigns, setCampaigns] = useState<CampaignDonation[]>([]);
  const [campaignsTotalPages, setCampaignsTotalPages] = useState(0);
  const [donations, setDonations] = useState<DonorDonationsAPI[]>([]);
  const [donationsTotalPages, setDonationsTotalPages] = useState(0);

  useEffect(() => {
    if (shouldLoadData) {
      getCampaignDonations(campaignsPage, campaignsPageSize);
      getDonorDonations(donationsPage, donationsPageSize);
    }
  }, [campaignsPage, campaignsPageSize, donationsPage, donationsPageSize, shouldLoadData]);

  async function getCampaignDonations(campaignsPage: number, campaignsPageSize: number) {
    const response = await getDonorCampaigns(campaignsPage, campaignsPageSize);
    setCampaigns(response.data.map(campaignAdapter.toCampaignCard));
    setCampaignsTotalPages(Math.ceil(response.total / campaignsPageSize));
  }

  async function getDonorDonations(donationsPage: number, donationsPageSize: number) {
    const response = await getDonorDonationsService(donationsPage, donationsPageSize);
    setDonations(response.data);
    setDonationsTotalPages(Math.ceil(response.total / donationsPageSize));
  }

  async function handleDeleteAccount(userId: string, userRole: RoleEnum) {
    await deleteAccount(userId, userRole);
  }

  async function handleUpdateAccount(userId: string, userData: User) {
    await updateAccount(userId, userData);
  }

  async function handleCancelDonation(donation: DonorDonationsAPI) {
    const updatedDonation: DonorDonationsAPI = {
      ...donation,
      periodicity: "CANCELED",
    };
    await updateDonation(updatedDonation);
    // Só recarrega doações se os dados devem ser carregados
    if (shouldLoadData) {
      await getDonorDonations(donationsPage, donationsPageSize);
    }
  }

  return {
    campaigns,
    campaignsTotalPages,
    donations,
    donationsTotalPages,
    handleDeleteAccount,
    handleUpdateAccount,
    handleCancelDonation,
  };
}
