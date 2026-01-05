import { Periodicity } from "@prisma/client";

export class Donation {
  id: string;
  amount: number;
  periodicity?: Periodicity;
  campaignId?: string;
  donorId?: string;
  createdAt: Date;
}
