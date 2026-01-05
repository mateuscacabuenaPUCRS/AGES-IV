import api from "./api";
import type { PageableResponse } from "./types";

export type CampaignStatus = "PENDING" | "ACTIVE" | "PAUSED" | "FINISHED" | "CANCELED";

export type CampaignAPI = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  createdBy: string;
  targetAmount: number;
  currentAmount: number;
  achievementPercentage: number;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  isRoot: boolean;
};

export type GetCampaignsParams = {
  page?: number;
  pageSize?: number;
  title?: string;
  startDate?: string;
  status?: CampaignStatus;
};

export async function getCampaigns(
  params?: GetCampaignsParams
): Promise<PageableResponse<CampaignAPI>> {
  try {
    const response = await api.get<PageableResponse<CampaignAPI>>("/campaigns", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export type UpdateCampaignParams = {
  title: string;
  description: string;
  // currentAmount?: number | null;
  targetAmount: number;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  status?: CampaignStatus;
  createdBy: string;
};

export async function updateCampaign(id: string, data: UpdateCampaignParams): Promise<void> {
  try {
    await api.patch(`/campaigns/${id}`, data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteCampaign(id: string): Promise<void> {
  try {
    await api.delete(`/campaigns/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export type CreateCampaignParams = {
  title: string;
  description: string;
  targetAmount: number;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  status: CampaignStatus;
  createdBy: string;
};

export async function createCampaign(data: CreateCampaignParams): Promise<void> {
  try {
    await api.post("/campaigns", data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateCampaignStatus(id: string, status: CampaignStatus): Promise<void> {
  try {
    await api.patch(`/campaigns/${id}/status`, { status });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export type DonorCampaignsAPI = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetAmount: string;
  currentAmount: string;
  startDate: string;
  endDate: string;
  status: string;
  createdBy: string;
  creatorName: string;
};

export async function getDonorCampaigns(page: number, pageSize: number) {
  const response = await api.get<PageableResponse<DonorCampaignsAPI>>(
    `/campaigns/donor/all-donations`,
    {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString(),
      },
    }
  );

  return response.data;
}

export async function getRootCampaign(): Promise<CampaignAPI | null> {
  try {
    const response = await api.get<CampaignAPI>("/campaigns/is-root");
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function setRootCampaign(id: string): Promise<void> {
  try {
    await api.patch(`/campaigns/${id}/is-root`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
