import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { User, Gender } from "@/contexts/UserContext";
import Modal from "@/components/ui/modal";
import Input from "./input";
import { Select } from "./select";
import { DatePicker } from "./Calendar/date-picker";
import { ROUTES } from "@/constant/routes";
import { Eye, EyeOff } from "lucide-react";
import { passwordRequirements } from "@/schemas/auth";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (dados: User) => void;
  initialData: User;
  onDeleteAccount?: () => Promise<void>;
  onUpdateAccount?: (userData: User) => Promise<void>;
}

const PasswordRequirements = ({ password }: { password: string }) => {
  const requirements = passwordRequirements;

  if (!password) {
    return null;
  }

  return (
    <div className="mt-2 mb-4 text-left">
      <ul className="space-y-1">
        {requirements.map((req) => {
          const isValid = req.test(password);
          return (
            <li
              key={req.label}
              className={`text-sm transition-colors ${isValid ? "text-green-600" : "text-red-600"}`}
            >
              {req.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default function EditUserModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  onDeleteAccount,
  onUpdateAccount,
}: EditUserModalProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<User>(initialData);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const isAdmin = initialData.role === "ADMIN";

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setNewPassword(""); // Reset password field when modal opens
      setPasswordError("");
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value as Gender }));
  };

  const handleConfirm = async () => {
    try {
      setIsSaving(true);
      setPasswordError("");

      // Validate password if it's been filled
      if (newPassword) {
        const isPasswordValid = passwordRequirements.every((requirement) =>
          requirement.test(newPassword)
        );

        if (!isPasswordValid) {
          setPasswordError("A senha não atende a todos os requisitos.");
          setIsSaving(false);
          return;
        }
      }

      // Add password to formData if provided
      const dataToUpdate = {
        ...formData,
        ...(newPassword && { password: newPassword }), // Only include password if filled
      };

      // If onUpdateAccount is provided, use it (API call)
      if (onUpdateAccount) {
        await onUpdateAccount(dataToUpdate);
      }

      // Call onSave if provided (for local state update)
      if (onSave) {
        onSave(dataToUpdate);
      }

      onClose();
    } catch (error) {
      console.error("Failed to update account:", error);
      alert("Falha ao atualizar a conta. Por favor, tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!onDeleteAccount) return;

    try {
      setIsDeleting(true);
      await onDeleteAccount();
      setShowDeleteModal(false);
      onClose();
      // Navigate to home after successful deletion
      navigate(ROUTES.home);
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Falha ao apagar a conta. Por favor, tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 px-2">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-lg mx-4 sm:mx-0">
        <h2 className="block text-left text-2xl font-bold text-[#005172] mb-4">Editar Perfil</h2>

        <div className="mb-4">
          <Input
            id="fullname"
            name="fullname"
            label="Nome"
            value={formData.fullname || ""}
            onChange={handleChange}
            fullWidth
          />
        </div>

        <div className="mb-4">
          <Input
            id="email"
            name="email"
            type="email"
            label="E-mail"
            value={formData.email || ""}
            onChange={handleChange}
            fullWidth
          />
        </div>

        <div className="mb-4">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            label="Nova Senha (deixe em branco para manter a atual)"
            placeholder="Digite uma nova senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            error={passwordError}
            RightIcon={
              showPassword ? (
                <EyeOff className="h-4 w-4 cursor-pointer" />
              ) : (
                <Eye className="h-4 w-4 cursor-pointer" />
              )
            }
            onClickRightIcon={() => setShowPassword((prev) => !prev)}
          />
          <PasswordRequirements password={newPassword} />
        </div>

        {!isAdmin && (
          <>
            <div className="mb-4">
              <DatePicker
                label="Data de Nascimento"
                value={formData.birthDate ? new Date(formData.birthDate) : undefined}
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    birthDate: date ?? undefined,
                  }))
                }
                fullWidth
              />
            </div>

            <div className="mb-4">
              <Select
                id="gender"
                label="Gênero"
                options={[
                  { value: "MALE", label: "Masculino" },
                  { value: "FEMALE", label: "Feminino" },
                  { value: "OTHER", label: "Outro" },
                ]}
                value={formData.gender || ""}
                onChange={handleGenderChange}
                fullWidth
                placeholder="Selecione um gênero"
              />
            </div>

            <div className="mb-4">
              <Input
                id="cpf"
                name="cpf"
                label="CPF"
                value={formData.cpf || ""}
                onChange={handleChange}
                fullWidth
              />
            </div>

            <div className="mb-4">
              <Input
                id="phone"
                name="phone"
                label="Telefone"
                value={formData.phone || ""}
                onChange={handleChange}
                fullWidth
              />
            </div>
          </>
        )}

        <div className="flex justify-center gap-4 mt-6">
          <button
            className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </button>

          <button
            className="px-6 py-2 bg-[#005172] text-white rounded-lg hover:bg-[#006b91] cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleConfirm}
            disabled={isSaving}
          >
            {isSaving ? "Salvando..." : "Confirmar"}
          </button>
        </div>

        {(!isAdmin || initialData.root) && (
          <div className="flex flex-col items-center mt-4">
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="text-[#D65E5E] text-sm underline hover:text-red-600 cursor-pointer"
              data-testid="delete-account-button"
            >
              Apagar minha conta
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        variant="delete-account"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
