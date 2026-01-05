import api from "./api";
import type { PageableResponse } from "./types";

export type Periodicity = "MONTHLY" | "QUARTERLY" | "SEMI_ANNUAL" | "YEARLY" | "CANCELED";

export type DonationAPI = {
  id: string;
  campaignId: string;
  donorId: string;
  amount: number;
  periodicity: Periodicity | null;
  createdAt: string;
};

export type DonorDonationsAPI = {
  amount: number;
  campaignCreatedBy: string;
  campaignId?: string;
  createdAt: string;
  donorId?: string;
  id: string;
  periodicity: Periodicity | null;
  campaignName: string;
};

export type GetDonationsParams = {
  page?: number;
  pageSize?: number;
};

export async function getUserDonations(
  params?: GetDonationsParams
): Promise<PageableResponse<DonationAPI>> {
  try {
    const response = await api.get<PageableResponse<DonationAPI>>("/donations", {
      params,
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getDonorDonations(page: number, pageSize: number) {
  const response = await api.get<PageableResponse<DonorDonationsAPI>>("/donations", {
    params: {
      page: page.toString(),
      pageSize: pageSize.toString(),
    },
  });

  return response.data;
}

export async function updateDonation(donation: DonorDonationsAPI): Promise<void> {
  const response = await api.patch(`/donations/${donation.id}`, {
    amount: donation.amount,
    campaignId: donation.campaignId,
    donorId: donation.donorId,
    periodicity: donation.periodicity,
  } as DonorDonationsAPI);
  return response.data;
}

export type CreateDonationParams = {
  amount: number;
  paymentMethod: "PIX" | "BANK_SLIP" | "CREDIT_CARD";
  periodicity?: Periodicity | null;
  campaignId?: string;
  donorId?: string;
};

export async function createDonation(data: CreateDonationParams): Promise<DonationAPI> {
  try {
    const response = await api.post<DonationAPI>("/donations", data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
