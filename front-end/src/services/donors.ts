import api from "@/services/api";

export type DonorGender = "MALE" | "FEMALE" | "OTHER";

export interface DonorItem {
  id: string;
  fullName: string;
  email: string;
  birthDate: string;
  gender: DonorGender;
  phone: string;
  cpf: string;
  createdAt: string;
  totalDonated: number;
  imageUrl?: string;
}

export interface PaginatedDonors {
  data: DonorItem[];
  page: number;
  lastPage: number;
  total: number;
}

export async function getDonors(page = 1, pageSize = 50): Promise<PaginatedDonors> {
  const { data } = await api.get<PaginatedDonors>("/donors", {
    params: { page, pageSize },
  });
  return data;
}

export async function getAllDonors(maxPages = 5, pageSize = 50): Promise<DonorItem[]> {
  const items: DonorItem[] = [];
  let page = 1;
  for (let i = 0; i < maxPages; i++) {
    const res = await getDonors(page, pageSize);
    items.push(...res.data);
    if (page >= res.lastPage) break;
    page += 1;
  }
  return items;
}

export interface UpdateDonorData {
  email?: string;
  password?: string;
  fullName?: string;
  birthDate?: string;
  gender?: DonorGender;
  phone?: string;
  cpf?: string;
}

export async function updateDonor(id: string, data: UpdateDonorData): Promise<void> {
  await api.patch(`/donors/${id}`, data);
}

export async function deleteDonor(id: string): Promise<void> {
  await api.delete(`/donors/${id}`);
}

export async function getDonorById(id: string): Promise<DonorItem> {
  const { data } = await api.get<DonorItem>(`/donors/${id}`);
  return data;
}

export interface DonorDonation {
  id: string;
  amount: string;
  periodicity: "MONTHLY" | "QUARTERLY" | "SEMI_ANNUAL" | "YEARLY" | "CANCELED" | null;
  donorId: string;
  campaignId: string;
  createdAt: string;
  campaign?: {
    id: string;
    title: string;
    description: string;
    targetAmount: string;
    currentAmount: string;
    startDate: string;
    endDate: string;
    imageUrl: string;
    status: string;
    createdBy: string;
    user: {
      fullName: string;
    };
  };
  payment: Array<{
    id: string;
    paymentMethod: string;
    status: string;
    amount: string;
    paidAt: string;
    donationId: string;
  }>;
}

export async function getDonorDonations(
  donorId: string,
  page = 1,
  limit = 10
): Promise<DonorDonation[]> {
  const { data } = await api.get<DonorDonation[]>(`/donors/donations/${donorId}`, {
    params: { page, limit },
  });
  return data;
}

export async function updateDonorAvatar(id: string, file: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);

  await api.patch(`/donors/${id}/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
