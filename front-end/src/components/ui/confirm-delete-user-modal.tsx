import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constant/routes";

interface ConfirmDeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteUserModal({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmDeleteUserModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleDelete = () => {
    onConfirm();
    navigate(ROUTES.home);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 px-2">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg mx-4 sm:mx-0">
        <h2 className="text-xl font-bold text-[#005172] mb-4 text-left">
          Confirma que deseja excluir a conta deste usuário?
        </h2>
        <p className="text-sm text-gray-700 mb-6 text-left">Esta ação não poderá ser desfeita.</p>

        <div className="flex justify-end gap-4">
          <button className="px-6 py-2 text-black font-semibold" onClick={onClose}>
            Cancelar
          </button>
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg" onClick={handleDelete}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
