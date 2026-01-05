import { CampaignStatus } from "@prisma/client";

export class Campaing {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  startDate: Date;
  endDate: Date;
  imageUrl: string;
  status: CampaignStatus;
  createdBy: string;
  adminId: string;
  isRoot: boolean;
}
