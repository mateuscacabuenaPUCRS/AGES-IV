import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { deleteAdmin, type AdminItem } from "@/services/admin";
import { Delete } from "react-iconly";
import { useState } from "react";
import { toast } from "sonner";

interface AdminDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: AdminItem | null;
  isCurrentUserRoot: boolean;
  onDelete?: () => void;
  onDeleteSuccess?: () => void;
}

export function AdminDetailsModal({
  open,
  onOpenChange,
  admin,
  isCurrentUserRoot,
  onDelete,
  onDeleteSuccess,
}: AdminDetailsModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!admin) return null;

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteAdmin(admin.id);
      toast.success("Administrador excluído com sucesso!");
      onDelete?.();
      onDeleteSuccess?.();
      onOpenChange(false);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Erro ao excluir administrador:", error);
      toast.error("Erro ao excluir administrador. Tente novamente.");
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
          Detalhes do Administrador
        </DialogTitle>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-[#005172]">Nome Completo:</label>
            <p className="text-sm text-[#94A3B8] mt-1">{admin.fullName}</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#005172]">E-mail:</label>
            <p className="text-sm text-[#94A3B8] mt-1">{admin.email}</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#005172]">Tipo:</label>
            <div className="mt-2">
              <span
                className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  admin.root ? "bg-[#F68537] text-white" : "bg-[#005172] text-white"
                }`}
              >
                {admin.root ? "Principal" : "Comum"}
              </span>
            </div>
          </div>
        </div>

        {isCurrentUserRoot && !showDeleteConfirm && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleDeleteClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#D65E5E] hover:bg-[#c44f4f] text-white rounded-xl font-semibold transition-colors"
            >
              <Delete set="bold" size={20} />
              Excluir Administrador
            </button>
          </div>
        )}

        {!isCurrentUserRoot && (
          <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              Apenas administradores principais podem excluir outros administradores.
            </p>
          </div>
        )}

        {isCurrentUserRoot && showDeleteConfirm && (
          <div className="mt-6">
            <div className="text-center bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800 font-medium">
                Tem certeza que deseja excluir este administrador?
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
