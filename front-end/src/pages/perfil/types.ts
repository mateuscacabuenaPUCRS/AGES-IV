export type SituationType = "approved" | "pending" | "rejected" | "recurring";

export type CampaignDonation = {
  title: string;
  creatorName: string;
  raised: number;
  goal: number;
  situation: SituationType;
  donationAmount: number;
};

export type CampaignCard = {
  raised: number;
  goal: number;
  situation: SituationType;
  donationAmount: number;
  title: string;
  creatorName: string;
};
