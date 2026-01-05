import CampaignCard from "@/components/ui/campaignCard/campaignCard";
import { Pagination } from "@/components/ui/Pagination";
import type { DonorDonationsAPI } from "@/services/donations";

interface ProfileDonationsProps {
  donations: DonorDonationsAPI[];
  currentPage: number;
  totalPages: number;
  isViewingAnotherProfile: boolean;
  onPageChange: (page: number) => void;
  onCancelDonation?: (donation: DonorDonationsAPI) => void;
}

export function ProfileDonations({
  donations,
  currentPage,
  totalPages,
  isViewingAnotherProfile,
  onPageChange,
  onCancelDonation,
}: ProfileDonationsProps) {
  const activeDonations = donations.filter((donation) => donation.periodicity !== "CANCELED");

  return (
    <>
      <hr className="border-t border-[#266D88CC] mx-50 my-8" />
      <h2 className="text-2xl font-bold text-[#005172] mt-2 mb-4">Histórico de Doações</h2>

      <div className="mt-2 bg-white rounded-lg p-6 min-h-[580px] flex flex-col">
        <div className="flex flex-col gap-3 flex-1 w-full">
          {activeDonations.length > 0 ? (
            activeDonations.map((donation, index) => (
              <CampaignCard
                key={index}
                variant="historic"
                className="border border-[#005172] rounded-lg text-sm p-3"
                title={donation.campaignName}
                donationAmount={donation.amount}
                periodicity={donation.periodicity}
                campaignCreator={donation.campaignCreatedBy}
                onAction={
                  isViewingAnotherProfile || !onCancelDonation
                    ? undefined
                    : () => onCancelDonation(donation)
                }
              />
            ))
          ) : (
            <div className="w-full mx-auto mt-4 py-8 bg-blue-100 text-[#005172] text-center font-medium border border-[#005172] rounded-lg">
              {isViewingAnotherProfile
                ? "Este usuário ainda não realizou nenhuma doação."
                : "Você ainda não realizou nenhuma doação."}
            </div>
          )}
        </div>

        <div className="flex justify-center items-center gap-2 mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </>
  );
}
