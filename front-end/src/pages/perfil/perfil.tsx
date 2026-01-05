import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { useUser } from "@/hooks/useUser";
import { usePerfil } from "./usePerfil";
import { useAdminUsers } from "./hooks/useAdminUsers";
import { useDonorProfile } from "./hooks/useDonorProfile";
import { ROUTES } from "@/constant/routes";
import type { User } from "@/contexts/UserContext";
import type { DonorItem } from "@/services/donors";
import type { AdminItem } from "@/services/admin";
import { updateDonor } from "@/services/donors";

// Components
import { ProfileHeader } from "./components/ProfileHeader";
import { AdminUserList } from "./components/AdminUserList";
import { DonorProfileInfo } from "./components/DonorProfileInfo";
import { ProfileCampaigns } from "./components/ProfileCampaigns";
import { ProfileDonations } from "./components/ProfileDonations";
import EditUserModal from "@/components/ui/edit-user-modal";
import ConfirmLogoutModal from "@/components/ui/confirm-logout-modal";
import CreateAdminModal from "@/components/ui/create-admin-modal";
import { DonorDetailsModal } from "@/components/ui/donor-details-modal";
import { AdminDetailsModal } from "@/components/ui/admin-details-modal";
import { ResolutionWarningModal } from "@/components/ui/ResolutionWarningModal";
import ChangeAvatarModal from "@/components/ui/change-avatar-modal";

// Utils
import { donorToUser, userToUpdateDonorData, getDisplayProfile } from "./utils/profileHelpers";

const CAMPAIGNS_PAGE_SIZE = 4;

interface ProfileUser extends User {
  totalDonated: number;
  percentageAchieved: number;
}

export default function Perfil() {
  const navigate = useNavigate();
  const { id: donorId } = useParams<{ id?: string }>();
  const { user: currentUser, logout, setUser } = useUser();
  const isAdmin = currentUser?.role === "ADMIN";

  // Pagination state
  const [campaignsPageSize] = useState(CAMPAIGNS_PAGE_SIZE);
  const [currentCampaignsPage, setCurrentCampaignsPage] = useState(1);
  const [currentDonationsPage, setCurrentDonationsPage] = useState(1);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateAdminModalOpen, setIsCreateAdminModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDonorDetailsOpen, setIsDonorDetailsOpen] = useState(false);
  const [isAdminDetailsOpen, setIsAdminDetailsOpen] = useState(false);
  const [isDonorEditOpen, setIsDonorEditOpen] = useState(false);
  const [isChangeAvatarModalOpen, setIsChangeAvatarModalOpen] = useState(false);

  // Selected users for modals
  const [selectedDonor, setSelectedDonor] = useState<DonorItem | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminItem | null>(null);

  // Legacy state - kept for compatibility but data comes from currentUser
  const [dados, setDados] = useState<ProfileUser>({
    id: "1",
    role: "DONOR",
    accessToken: "fake-token-123",
    fullname: "Fulano de Tal",
    birthDate: new Date("1971-08-12"),
    gender: "MALE",
    cpf: "123.456.789-00",
    phone: "(51) 9 9999-8888",
    email: "fulanodetal@email.com.br",
    totalDonated: 2000,
    percentageAchieved: 75,
  });

  const shouldLoadData = !!currentUser && currentUser.role === "DONOR" && !donorId;

  // Custom hooks
  const {
    campaigns,
    campaignsTotalPages,
    donations,
    donationsTotalPages,
    handleDeleteAccount,
    handleUpdateAccount,
    handleCancelDonation,
  } = usePerfil({
    campaignsPage: currentCampaignsPage,
    campaignsPageSize: campaignsPageSize,
    donationsPage: currentDonationsPage,
    donationsPageSize: 10,
    shouldLoadData,
  });

  const adminUsers = useAdminUsers(isAdmin);

  const donorProfile = useDonorProfile(
    donorId,
    currentUser?.id,
    campaignsPageSize,
    currentCampaignsPage,
    currentDonationsPage
  );

  // Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token && !currentUser) {
      navigate(ROUTES.login);
    }
  }, [currentUser, navigate]);

  // Handlers
  const handleEditarConta = () => setIsEditModalOpen(true);
  const handleOpenCreateAdminModal = () => setIsCreateAdminModalOpen(true);
  const handleChangeAvatar = () => setIsChangeAvatarModalOpen(true);
  const handleAvatarSuccess = async () => {
    if (currentUser) {
      try {
        const { getDonor, getAdmin } = await import("@/services/auth");
        const updatedUser =
          currentUser.role === "DONOR"
            ? await getDonor(currentUser.id, currentUser.accessToken)
            : await getAdmin(currentUser.id, currentUser.accessToken);

        setUser(updatedUser);
      } catch (error) {
        console.error("Erro ao atualizar foto:", error);
        window.location.reload();
      }
    }
  };
  const handleSalvarPerfil = (updatedUser: User) => {
    setDados((prev) => ({ ...prev, ...updatedUser }));
  };

  const handleConfirmLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    navigate(ROUTES.login);
  };

  const handleAccountDeletion = async () => {
    if (!currentUser) return;
    await handleDeleteAccount(currentUser.id, currentUser.role);
    logout();
  };

  const handleAccountUpdate = async (updatedUser: User) => {
    if (!currentUser) return;

    try {
      await handleUpdateAccount(currentUser.id, updatedUser);
      setUser({ ...currentUser, ...updatedUser });
      setDados((prev) => ({ ...prev, ...updatedUser }));

      toast.success(
        isAdmin
          ? "Perfil de administrador atualizado com sucesso!"
          : "Perfil atualizado com sucesso!"
      );
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil. Tente novamente.");
      throw error;
    }
  };

  const handleEditDonor = () => {
    setIsDonorDetailsOpen(false);
    setIsDonorEditOpen(true);
  };

  const handleUpdateDonor = async (userData: User) => {
    if (!selectedDonor) return;

    try {
      const updateData = userToUpdateDonorData(userData);
      await updateDonor(selectedDonor.id, updateData);
      toast.success("Doador atualizado com sucesso!");
      adminUsers.fetchUsers();
      setIsDonorEditOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar doador:", error);
      toast.error("Erro ao atualizar doador. Tente novamente.");
      throw error;
    }
  };

  const handleUserClick = (user: (typeof adminUsers.users)[0]) => {
    if (user.type === "donor") {
      setSelectedDonor(user.data);
      setIsDonorDetailsOpen(true);
    } else {
      setSelectedAdmin(user.data);
      setIsAdminDetailsOpen(true);
    }
  };

  // Loading state
  if (donorProfile.isLoadingDonorProfile) {
    return (
      <div className="min-h-screen bg-[#2F5361] font-inter flex items-center justify-center">
        <div className="text-white text-xl">Carregando perfil...</div>
      </div>
    );
  }

  // Determine display data
  const displayProfile = getDisplayProfile(
    donorProfile.isViewingAnotherProfile,
    donorProfile.viewingDonorProfile,
    currentUser
  );

  const displayCampaigns = donorProfile.isViewingAnotherProfile
    ? donorProfile.viewingDonorCampaigns
    : campaigns;
  const displayDonations = donorProfile.isViewingAnotherProfile
    ? donorProfile.viewingDonorDonations
    : donations;
  const displayCampaignsTotalPages = donorProfile.isViewingAnotherProfile
    ? donorProfile.viewingDonorCampaignsTotalPages
    : campaignsTotalPages;
  const displayDonationsTotalPages = donorProfile.isViewingAnotherProfile
    ? donorProfile.viewingDonorDonationsTotalPages
    : donationsTotalPages;

  return (
    <div className="min-h-screen bg-[#2F5361] font-inter">
      {isAdmin && !donorProfile.isViewingAnotherProfile && (
        <ResolutionWarningModal minWidth={1024} />
      )}
      <div className="flex justify-center px-4 sm:px-6 lg:px-12 xl:px-8 py-8">
        <div className="w-full max-w-[2400px] bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-12 xl:p-16">
          {donorProfile.isViewingAnotherProfile && (
            <button
              onClick={() => navigate("/perfil")}
              className="mb-4 flex items-center gap-2 text-[#005172] hover:underline"
            >
              ← Voltar para meu perfil
            </button>
          )}

          <ProfileHeader
            imageUrl={
              donorProfile.isViewingAnotherProfile
                ? donorProfile.viewingDonorProfile?.imageUrl
                : currentUser?.imageUrl
            }
            fullname={displayProfile.fullname}
            email={displayProfile.email}
            isAdmin={isAdmin}
            isViewingAnotherProfile={donorProfile.isViewingAnotherProfile}
            onEditarConta={handleEditarConta}
            onOpenCreateAdmin={handleOpenCreateAdminModal}
            onLogout={() => setIsLogoutModalOpen(true)}
            onChangeAvatar={handleChangeAvatar}
          />

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 xl:gap-12">
            {isAdmin && !donorProfile.isViewingAnotherProfile ? (
              <AdminUserList
                users={adminUsers.users}
                currentPage={adminUsers.currentUsersPage}
                totalPages={adminUsers.usersTotalPages}
                loading={adminUsers.loadingUsers}
                userFilter={adminUsers.userFilter}
                onPageChange={adminUsers.setCurrentUsersPage}
                onFilterChange={adminUsers.setUserFilter}
                onUserClick={handleUserClick}
              />
            ) : (
              <>
                <DonorProfileInfo {...displayProfile} />
                <ProfileCampaigns
                  campaigns={displayCampaigns}
                  currentPage={currentCampaignsPage}
                  totalPages={displayCampaignsTotalPages}
                  isViewingAnotherProfile={donorProfile.isViewingAnotherProfile}
                  onPageChange={setCurrentCampaignsPage}
                />
              </>
            )}
          </div>

          {(!isAdmin || donorProfile.isViewingAnotherProfile) && (
            <ProfileDonations
              donations={displayDonations}
              currentPage={currentDonationsPage}
              totalPages={displayDonationsTotalPages}
              isViewingAnotherProfile={donorProfile.isViewingAnotherProfile}
              onPageChange={setCurrentDonationsPage}
              onCancelDonation={handleCancelDonation}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateAdminModal
        isModalOpen={isCreateAdminModalOpen}
        onClose={() => setIsCreateAdminModalOpen(false)}
        onSuccess={adminUsers.fetchUsers}
        isCurrentUserRoot={currentUser?.root ?? false}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSalvarPerfil}
        initialData={currentUser || dados}
        onDeleteAccount={handleAccountDeletion}
        onUpdateAccount={handleAccountUpdate}
      />

      <ConfirmLogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />

      <DonorDetailsModal
        open={isDonorDetailsOpen}
        onOpenChange={setIsDonorDetailsOpen}
        donor={selectedDonor}
        onEdit={handleEditDonor}
        onDeleteSuccess={adminUsers.fetchUsers}
      />

      <AdminDetailsModal
        open={isAdminDetailsOpen}
        onOpenChange={setIsAdminDetailsOpen}
        admin={selectedAdmin}
        isCurrentUserRoot={currentUser?.root ?? false}
        onDeleteSuccess={adminUsers.fetchUsers}
      />

      {selectedDonor && (
        <EditUserModal
          isOpen={isDonorEditOpen}
          onClose={() => setIsDonorEditOpen(false)}
          onSave={(updatedUser) => {
            const updatedDonor: DonorItem = {
              ...selectedDonor,
              fullName: updatedUser.fullname,
              email: updatedUser.email,
              birthDate:
                updatedUser.birthDate instanceof Date
                  ? updatedUser.birthDate.toISOString()
                  : updatedUser.birthDate || selectedDonor.birthDate,
              gender: updatedUser.gender || selectedDonor.gender,
              phone: updatedUser.phone || selectedDonor.phone,
              cpf: updatedUser.cpf || selectedDonor.cpf,
            };
            setSelectedDonor(updatedDonor);
          }}
          initialData={donorToUser(selectedDonor)}
          onUpdateAccount={handleUpdateDonor}
        />
      )}

      <ChangeAvatarModal
        isOpen={isChangeAvatarModalOpen}
        onClose={() => setIsChangeAvatarModalOpen(false)}
        donorId={currentUser?.id || ""}
        currentPhoto={currentUser?.imageUrl}
        onSuccess={handleAvatarSuccess}
      />
    </div>
  );
}
