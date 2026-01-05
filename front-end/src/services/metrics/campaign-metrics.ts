import type { CampaignStatus } from "@/types/Campaign";
import api from "../api";
import type { PaymentMethod } from "./donations-payment-method";

type PaymentComparisonDTO = {
  paymentMethod: string;
  totalAmount: number;
  totalCount: number;
};

export type CampaignMetricsResponse = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetAmount: number;
  currentAmount: number;
  startDate: Date;
  endDate: Date;
  status: CampaignStatus;
  createdBy: string;
  paymentComparison: {
    paymentMethod: PaymentMethod;
    totalAmount: number;
    totalCount: number;
  }[];
};

export async function getCampaignMetrics(id: string): Promise<CampaignMetricsResponse> {
  const response = await api.get(`/metrics/campaigns/${id}/metrics`);
  return {
    id: response.data.id,
    title: response.data.title,
    description: response.data.description,
    imageUrl: response.data.imageUrl,
    targetAmount: response.data.targetAmount,
    currentAmount: response.data.currentAmount,
    startDate: new Date(response.data.startDate),
    endDate: new Date(response.data.endDate),
    status: response.data.status,
    createdBy: response.data.createdBy,
    paymentComparison: response.data.paymentComparison.map((payment: PaymentComparisonDTO) => ({
      paymentMethod: payment.paymentMethod as PaymentMethod,
      totalAmount: payment.totalAmount,
      totalCount: payment.totalCount,
    })),
  };
}
