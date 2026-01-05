import { useState, useEffect, useCallback } from "react";
import Button from "./button";
import CreateAdminModal from "./create-admin-modal";
import UserList from "./user-list.tsx";
import { PlusCircleIcon } from "lucide-react";
import { listAllAdmins } from "@/services/admin";
import { getAllDonors } from "@/services/donors.ts";

type FormData = {
  nome: string;
  nascimento: string;
  genero: string;
  cpf: string;
  telefone: string;
  email: string;
  foto?: string;
};

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dados: FormData) => void;
  initialData: FormData;
}

type UserRole = "admin" | "donor";

interface User {
  profileName: string;
  role: UserRole;
}

export default function ProfileSettingsModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ProfileSettingsModalProps) {
  const [formData, setFormData] = useState(initialData);
  const [isCreateAdminModalOpen, setIsCreateAdminModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) setFormData(initialData);
  }, [isOpen, initialData]);

  const handleConfirmar = () => {
    onSave(formData);
    onClose();
  };

  const handleOpenCreateAdminModal = () => {
    setIsCreateAdminModalOpen(true);
  };

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const [admins, donors] = await Promise.all([listAllAdmins(), getAllDonors()]);
      const mappedAdmins: User[] = admins.map((a) => ({
        id: a.id,
        profileName: a.fullName,
        role: "admin",
      }));
      const mappedDonors: User[] = donors.map((d) => ({
        id: d.id,
        profileName: d.fullName,
        role: "donor",
      }));
      setUsers([...mappedAdmins, ...mappedDonors]);
    } catch (e) {
      console.error("Falha ao carregar usuários:", e);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && !isCreateAdminModalOpen) {
      void loadUsers();
    }
  }, [isOpen, isCreateAdminModalOpen, loadUsers]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-[color:var(--overlay)] flex items-center justify-center z-60 px-2">
      <CreateAdminModal
        isModalOpen={isCreateAdminModalOpen}
        onClose={() => setIsCreateAdminModalOpen(false)}
      />

      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg mx-4 sm:mx-0 overflow-hidden">
        <h2 className="text-2xl font-bold text-[color:var(--primary-800)] m-4 text-left">
          Ajustes
        </h2>

        <div className="flex items-center justify-between bg-[#CCDFE5] py-3 px-4 font-semibold text-[#003B50]">
          <h3>Lista de usuários</h3>

          <Button variant="primary" size="icon" onClick={handleOpenCreateAdminModal}>
            <PlusCircleIcon className="h-8 w-8 text-white" />
          </Button>
        </div>

        {loading ? (
          <div className="p-6 text-center text-[var(--color-text-2)]">Carregando usuários...</div>
        ) : (
          <UserList users={users} />
        )}

        <div className="flex justify-center gap-1.5 sm:gap-3 py-1.5 sm:py-3 bg-[color:var(--primary-100)] rounded-b-xl">
          <Button
            variant="secondary"
            size="extraSmall"
            onClick={onClose}
            className="!px-2 !py-0.5 !text-[10px] !h-6 !min-h-0 sm:!px-6 sm:!py-2 sm:!text-sm sm:!h-auto"
          >
            Fechar
          </Button>
          <Button
            variant="primary"
            size="extraSmall"
            onClick={handleConfirmar}
            className="!px-2 !py-0.5 !text-[10px] !h-6 !min-h-0 sm:!px-6 sm:!py-2 sm:!text-sm sm:!h-auto"
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}
