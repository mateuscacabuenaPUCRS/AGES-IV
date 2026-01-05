import CampaignCard from "@/components/ui/campaignCard/campaignCard";
import { Pagination } from "@/components/ui/Pagination";
import type { CampaignDonation } from "../types";

interface ProfileCampaignsProps {
  campaigns: CampaignDonation[];
  currentPage: number;
  totalPages: number;
  isViewingAnotherProfile: boolean;
  onPageChange: (page: number) => void;
}

export function ProfileCampaigns({
  campaigns,
  currentPage,
  totalPages,
  isViewingAnotherProfile,
  onPageChange,
}: ProfileCampaignsProps) {
  return (
    <div className="flex-1 flex flex-col gap-3 items-start">
      <h3 className="text-sm font-semibold text-[#005172]">Campanhas que apoiou</h3>

      <div className="flex flex-col gap-3 w-full min-h-[200px]">
        {campaigns.length > 0 ? (
          campaigns.map((campaign, index) => (
            <CampaignCard
              key={index}
              {...campaign}
              variant="compact"
              situation="recurring"
              className="border border-[#005172] rounded-lg text-sm p-3"
            />
          ))
        ) : (
          <div className="w-full mx-auto py-8 bg-blue-100 text-[#005172] text-center font-medium border border-[#005172] rounded-lg">
            {isViewingAnotherProfile ? "Este usuário" : "Você"} ainda não apoia nenhuma campanha.
          </div>
        )}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
