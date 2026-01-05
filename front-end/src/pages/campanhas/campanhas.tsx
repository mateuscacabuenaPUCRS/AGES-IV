import CampaignCard from "@/components/ui/campaignCard/campaignCard";
import Plus from "@/assets/Plus.png";
import { useState, useEffect } from "react";
import CampaignModal from "./components/CampaignModal";
import EditCampaignModal from "@/components/campaign/EditCampaignModal";
import DeleteCampaignModal from "@/components/campaign/DeleteCampaignModal";
import AdminCreateCampaignModal from "@/components/campaign/AdminCreateCampaignModal";
import DonorCreateCampaignModal from "@/components/campaign/DonorCreateCampaignModal";
import ApproveCampaignModal from "@/components/campaign/ApproveCampaignModal";
import { useUser } from "@/hooks/useUser";
import {
  getCampaigns,
  updateCampaign,
  deleteCampaign,
  createCampaign,
  updateCampaignStatus,
  type CampaignAPI,
} from "@/services/campaigns";
import { getUserDonations } from "@/services/donations";
import { SearchBar } from "@/components/ui/search-bar";
import { useSearchParams } from "react-router-dom";
import { ArrowUpDown } from "lucide-react";
import CampaignCardSkeleton from "@/skeletons/campaign-card-skeleton";
import type { CampaignBase } from "@/types/Campaign";
import { Pagination } from "@/components/ui/Pagination";
import { format } from "date-fns";

type CampaignData = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  createdBy: string;
  targetAmount: number;
  currentAmount: number;
  achievementPercentage: number;
  status: "PENDING" | "ACTIVE" | "PAUSED" | "FINISHED" | "CANCELED";
};

type CampaignWithSituation = CampaignAPI & {
  situation: "approved" | "pending" | "rejected" | "recurring" | "finished" | "paused";
};

const Campanhas = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignData | null>(null);
  const [selectedCampaignToEdit, setSelectedCampaignToEdit] = useState<CampaignBase | null>(null);
  const [selectedCampaignToApprove, setSelectedCampaignToApprove] = useState<CampaignBase | null>(
    null
  );
  const [campaignToDelete, setCampaignToDelete] = useState<CampaignWithSituation | null>(null);
  const [deleteFromEditModal, setDeleteFromEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [campaigns, setCampaigns] = useState<CampaignWithSituation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useUser();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams, sortOrder]);

  useEffect(() => {
    const fetchData = async () => {
      const MIN_LOADING_TIME = 500;
      const startTime = Date.now();

      try {
        setLoading(true);

        const searchTerm = searchParams.get("search") || undefined;

        const campaignsResponse = await getCampaigns({
          page: currentPage,
          pageSize: 10,
          title: searchTerm,
        });

        setTotalPages(campaignsResponse.lastPage);

        let donatedCampaignIds = new Set<string>();
        if (user?.role === "DONOR") {
          try {
            const donationsResponse = await getUserDonations({ pageSize: 1000 });
            donatedCampaignIds = new Set(
              donationsResponse.data
                .filter((d) => d.periodicity !== "CANCELED")
                .map((d) => d.campaignId)
            );
          } catch (error) {
            console.error("Erro ao buscar doações:", error);
          }
        }

        let filteredCampaigns = campaignsResponse.data.map((campaign): CampaignWithSituation => {
          let situation: "approved" | "pending" | "rejected" | "recurring" | "finished" | "paused" =
            "approved";

          if (campaign.status === "PENDING") {
            situation = "pending";
          } else if (campaign.status === "CANCELED") {
            situation = "rejected";
          } else if (campaign.status === "FINISHED") {
            situation = "finished";
          } else if (campaign.status === "PAUSED") {
            situation = "paused";
          } else if (campaign.status === "ACTIVE") {
            if (user?.role === "DONOR" && donatedCampaignIds.has(campaign.id)) {
              situation = "recurring";
            } else {
              situation = "approved";
            }
          }

          return {
            ...campaign,
            situation,
          };
        });

        if (sortOrder === "oldest") {
          filteredCampaigns = filteredCampaigns.reverse();
        }

        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

        await new Promise((resolve) => setTimeout(resolve, remainingTime));

        setCampaigns(filteredCampaigns);
      } catch (error) {
        console.error("Erro ao buscar campanhas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, searchParams, sortOrder, currentPage]);

  const handleOpenCampaignModal = (campaign: CampaignAPI) => {
    const campaignData: CampaignData = {
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      imageUrl: campaign.imageUrl,
      createdBy: campaign.createdBy,
      targetAmount: campaign.targetAmount,
      currentAmount: campaign.currentAmount,
      achievementPercentage: campaign.achievementPercentage,
      status: campaign.status,
    };
    setSelectedCampaign(campaignData);
    setIsCampaignModalOpen(true);
  };

  const handleOpenEditModal = (campaign: CampaignAPI) => {
    const campaignBase: CampaignBase & { startDate?: string; endDate?: string } = {
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      targetValue: campaign.targetAmount,
      image: campaign.imageUrl ? { url: campaign.imageUrl, name: "" } : undefined,
      ...(campaign.startDate && { startDate: campaign.startDate }),
      ...(campaign.endDate && { endDate: campaign.endDate }),
    };
    setSelectedCampaignToEdit(campaignBase);

    const fullCampaign = campaigns.find((c) => c.id === campaign.id);
    if (fullCampaign) {
      setCampaignToDelete(fullCampaign);
    }
    setIsEditModalOpen(true);
  };

  const handleOpenApproveModal = (campaign: CampaignAPI) => {
    const campaignBase: CampaignBase & {
      startDate?: string;
      endDate?: string;
      authorName?: string;
    } = {
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      targetValue: campaign.targetAmount,
      image: campaign.imageUrl ? { url: campaign.imageUrl, name: "" } : undefined,
      authorName: campaign.createdBy,
      ...(campaign.startDate && { startDate: campaign.startDate }),
      ...(campaign.endDate && { endDate: campaign.endDate }),
    };
    setSelectedCampaignToApprove(campaignBase);
    setIsApproveModalOpen(true);
  };

  const handleApproveCampaign = async () => {
    if (!selectedCampaignToApprove) return;

    try {
      await updateCampaignStatus(selectedCampaignToApprove.id!, "ACTIVE");
      setIsApproveModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao aprovar campanha:", error);
      alert("Erro ao aprovar campanha. Tente novamente.");
    }
  };

  const handleRejectCampaign = async () => {
    if (!selectedCampaignToApprove) return;

    try {
      await updateCampaignStatus(selectedCampaignToApprove.id!, "CANCELED");
      setIsApproveModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao rejeitar campanha:", error);
      alert("Erro ao rejeitar campanha. Tente novamente.");
    }
  };

  const handleSaveEditedCampaign = async (data: {
    id: string;
    title: string;
    description: string;
    targetValue: number;
    endDate: Date;
    image?: File | null;
  }) => {
    try {
      const originalCampaign = campaigns.find((c) => c.id === data.id);
      if (!originalCampaign || !user) {
        throw new Error("Campanha ou usuário não encontrado");
      }

      const imageUrl =
        data.image instanceof File ? originalCampaign.imageUrl : originalCampaign.imageUrl;

      await updateCampaign(data.id, {
        title: data.title,
        description: data.description,
        targetAmount: data.targetValue,
        startDate: originalCampaign.startDate,
        endDate: format(data.endDate, "yyyy-MM-dd") + "T12:00:00.000Z",
        imageUrl: imageUrl || undefined,
        status: originalCampaign.status,
        createdBy: user.id,
      });

      window.location.reload();
    } catch (error) {
      console.error("Erro ao salvar campanha:", error);
      alert("Erro ao salvar campanha. Tente novamente.");
    }
  };

  const handleDeleteRequest = () => {
    setIsEditModalOpen(false);
    setDeleteFromEditModal(true);
    setIsDeleteConfirmOpen(true);
  };

  const handleFinishCampaign = async () => {
    if (!selectedCampaignToEdit?.id) return;

    try {
      await updateCampaignStatus(selectedCampaignToEdit.id, "FINISHED");
      setIsEditModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao finalizar campanha:", error);
      alert("Erro ao finalizar campanha. Tente novamente.");
    }
  };

  const handleOpenDeleteModal = (campaign: CampaignWithSituation) => {
    setCampaignToDelete(campaign);
    setDeleteFromEditModal(false);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!campaignToDelete) return;

    try {
      setIsDeleting(true);
      await deleteCampaign(campaignToDelete.id);
      setIsDeleteConfirmOpen(false);
      setIsEditModalOpen(false);
      setDeleteFromEditModal(false);

      window.location.reload();
    } catch (error) {
      console.error("Erro ao excluir campanha:", error);
      alert("Erro ao excluir campanha. Tente novamente.");
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (isDeleting) return;

    setIsDeleteConfirmOpen(false);
    if (deleteFromEditModal) {
      setIsEditModalOpen(true);
    }
    setDeleteFromEditModal(false);
  };

  const handleCreateCampaign = async (data: {
    title: string;
    description: string;
    targetValue: number;
    startDate: Date;
    endDate: Date;
    image?: File | null;
  }) => {
    if (!user) return;

    try {
      const imageUrl = undefined;

      await createCampaign({
        title: data.title,
        description: data.description,
        targetAmount: data.targetValue,
        startDate: format(data.startDate, "yyyy-MM-dd") + "T12:00:00.000Z",
        endDate: format(data.endDate, "yyyy-MM-dd") + "T12:00:00.000Z",
        imageUrl,
        status: user.role === "ADMIN" ? "ACTIVE" : "PENDING",
        createdBy: user.id,
      });

      window.location.reload();
    } catch (error) {
      console.error("Erro ao criar campanha:", error);
      alert("Erro ao criar campanha. Tente novamente.");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-[var(--color-bg-campaingn)] p-4 sm:p-8 min-h-screen flex flex-col gap-6">
      <section className="flex justify-center items-center gap-2 sm:gap-4">
        <div className="w-full">
          <SearchBar />
        </div>

        <button
          onClick={() => setSortOrder(sortOrder === "recent" ? "oldest" : "recent")}
          className="min-h-10 min-w-10 px-2 sm:px-4 bg-[var(--color-text-special-2)] text-white flex items-center justify-center gap-2 rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md hover:opacity-90 flex-shrink-0"
          title={sortOrder === "recent" ? "Ordenar por mais antigos" : "Ordenar por mais recentes"}
          data-testid="sort-button"
        >
          <ArrowUpDown className="h-4 w-4" />
          <span className="text-sm font-medium hidden sm:inline whitespace-nowrap">
            {sortOrder === "recent" ? "Mais recentes" : "Mais antigos"}
          </span>
        </button>

        {user && (
          <div
            role="button"
            className="min-h-10 min-w-10 bg-[var(--color-text-special-2)] flex items-center justify-center rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md hover:opacity-90 flex-shrink-0"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <img src={Plus} alt="Plus Icon" className="h-4 w-4" />
          </div>
        )}
      </section>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 10 }).map((_, index) => (
            <CampaignCardSkeleton key={index} />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-white text-lg">Nenhuma campanha encontrada</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                variant="list"
                title={campaign.title}
                raised={campaign.currentAmount}
                goal={campaign.targetAmount}
                creatorName={campaign.createdBy}
                startDate={campaign.startDate}
                endDate={campaign.endDate}
                situation={campaign.situation}
                isAdmin={user?.role === "ADMIN"}
                onAction={() => {
                  if (user?.role === "ADMIN") {
                    if (campaign.situation === "pending") {
                      handleOpenApproveModal(campaign);
                    } else if (campaign.situation === "rejected") {
                      handleOpenDeleteModal(campaign);
                    } else {
                      handleOpenEditModal(campaign);
                    }
                  } else {
                    handleOpenCampaignModal(campaign);
                  }
                }}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="mt-4"
          />
        </>
      )}

      {selectedCampaign && (
        <CampaignModal
          open={isCampaignModalOpen}
          onOpenChange={setIsCampaignModalOpen}
          campaign={selectedCampaign}
        />
      )}

      <EditCampaignModal
        open={isEditModalOpen && !isDeleting}
        onOpenChange={setIsEditModalOpen}
        campaign={selectedCampaignToEdit}
        onSave={handleSaveEditedCampaign}
        onDeleteRequest={handleDeleteRequest}
        onFinishCampaign={handleFinishCampaign}
        isAdmin={user?.role === "ADMIN"}
      />

      {campaignToDelete && (
        <DeleteCampaignModal
          open={isDeleteConfirmOpen}
          onOpenChange={(open) => {
            if (!open) {
              handleCancelDelete();
            }
          }}
          onConfirm={handleConfirmDelete}
          campaignTitle={campaignToDelete.title}
        />
      )}

      <ApproveCampaignModal
        open={isApproveModalOpen}
        onOpenChange={setIsApproveModalOpen}
        campaign={selectedCampaignToApprove}
        onApprove={handleApproveCampaign}
        onReject={handleRejectCampaign}
      />

      {user?.role === "ADMIN" ? (
        <AdminCreateCampaignModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSubmit={handleCreateCampaign}
        />
      ) : (
        <DonorCreateCampaignModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSubmit={handleCreateCampaign}
        />
      )}
    </div>
  );
};

export default Campanhas;
