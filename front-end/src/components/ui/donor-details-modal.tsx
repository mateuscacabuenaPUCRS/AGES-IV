import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { formatCPF, formatPhone } from "@/utils/formatters";
import { dateUtils } from "@/utils/dateUtils";
import type { DonorItem } from "@/services/donors";
import { deleteDonor } from "@/services/donors";
import { Edit, Delete } from "react-iconly";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

interface DonorDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  donor: DonorItem | null;
  onEdit?: () => void;
  onDelete?: () => void;
  onDeleteSuccess?: () => void;
}

const genderMapper = {
  MALE: "Masculino",
  FEMALE: "Feminino",
  OTHER: "Outro",
};

export function DonorDetailsModal({
  open,
  onOpenChange,
  donor,
  onEdit,
  onDelete,
  onDeleteSuccess,
}: DonorDetailsModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  if (!donor) return null;

  const handleViewProfile = () => {
    onOpenChange(false);
    navigate(`/perfil/${donor.id}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteDonor(donor.id);
      toast.success("Doador excluído com sucesso!");
      onDelete?.();
      onDeleteSuccess?.();
      onOpenChange(false);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Erro ao excluir doador:", error);
      toast.error("Erro ao excluir doador. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white p-6 rounded-xl max-w-md">
        <DialogTitle className="text-2xl font-bold text-[#005172] mb-6">
          Detalhes do Doador
        </DialogTitle>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-[#005172]">Nome Completo:</label>
            <p className="text-sm text-[#94A3B8] mt-1">{donor.fullName}</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#005172]">E-mail:</label>
            <p className="text-sm text-[#94A3B8] mt-1">{donor.email}</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#005172]">CPF:</label>
            <p className="text-sm text-[#94A3B8] mt-1">{formatCPF(donor.cpf)}</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#005172]">Telefone:</label>
            <p className="text-sm text-[#94A3B8] mt-1">{formatPhone(donor.phone)}</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#005172]">Data de Nascimento:</label>
            <p className="text-sm text-[#94A3B8] mt-1">
              {dateUtils.formatDate(new Date(donor.birthDate))}
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#005172]">Gênero:</label>
            <p className="text-sm text-[#94A3B8] mt-1">{genderMapper[donor.gender]}</p>
          </div>
        </div>

        {!showDeleteConfirm ? (
          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={handleViewProfile}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2A9D90] hover:bg-[#248276] text-white rounded-xl font-semibold transition-colors"
            >
              <User className="h-5 w-5" />
              Visualizar Perfil
            </button>
            <div className="flex gap-3">
              <button
                onClick={onEdit}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#005172] hover:bg-[#024561] text-white rounded-xl font-semibold transition-colors"
              >
                <Edit set="bold" size={20} />
                Editar
              </button>
              <button
                onClick={handleDeleteClick}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#D65E5E] hover:bg-[#c44f4f] text-white rounded-xl font-semibold transition-colors"
              >
                <Delete set="bold" size={20} />
                Excluir
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <div className="text-center bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800 font-medium">
                Tem certeza que deseja excluir este doador?
              </p>
              <p className="text-xs text-red-600 mt-1">Esta ação não pode ser desfeita.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#D65E5E] hover:bg-[#c44f4f] text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  "Excluindo..."
                ) : (
                  <>
                    <Delete set="bold" size={20} />
                    Confirmar Exclusão
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
