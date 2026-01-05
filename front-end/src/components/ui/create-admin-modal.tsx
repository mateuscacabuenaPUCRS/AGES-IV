import { useState } from "react";
import Modal from "@/components/ui/modal";
import Input from "./input";
import { createAdmin, type CreateAdmin } from "@/services/admin";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

interface CreateAdminModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  isCurrentUserRoot?: boolean;
}

export default function CreateAdminModal({ isModalOpen, onClose, onSuccess, isCurrentUserRoot = false }: CreateAdminModalProps) {
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [serviceResponse, setServiceResponse] = useState<{
    status: number;
    message: string[];
  } | null>(null);
  const [formData, setFormData] = useState<CreateAdmin>({
    email: "",
    password: "",
    fullName: "",
    root: false,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isModalOpen) return null;

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      fullName: "",
      root: false,
    });
    setConfirmPassword("");
    setPasswordError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "confirmPassword") {
      setConfirmPassword(value);
      if (formData.password && value) {
        setPasswordError(formData.password !== value ? "As senhas não coincidem" : "");
      } else {
        setPasswordError("");
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === "password" && confirmPassword) {
        setPasswordError(value !== confirmPassword ? "As senhas não coincidem" : "");
      }
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await createAdmin(formData);
      if (response.status === 201) {
        setIsResponseModalOpen(true);
        setServiceResponse(response);
        resetForm();
        // Call onSuccess callback to refresh the user list
        onSuccess?.();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data.message);
        setIsResponseModalOpen(true);
        setServiceResponse({ status: error.response.status, message: error.response.data.message });
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 px-2">
        <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-lg mx-4 sm:mx-0">
          <h2 className="block text-left text-2xl font-bold text-[#005172] mb-4">
            Criar Administrador
          </h2>
          <div className="mb-4">
            <Input
              id="fullname"
              name="fullName"
              label="Nome completo"
              value={formData.fullName || ""}
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
              label="Senha"
              value={formData.password || ""}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              fullWidth
              RightIcon={
                showPassword ? (
                  <EyeOff className="h-4 w-4 cursor-pointer" />
                ) : (
                  <Eye className="h-4 w-4 cursor-pointer" />
                )
              }
              onClickRightIcon={() => setShowPassword((prev) => !prev)}
            />
          </div>
          <div className="mb-4">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              label="Confirmar Senha"
              value={confirmPassword}
              onChange={handleChange}
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              RightIcon={
                showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 cursor-pointer" />
                ) : (
                  <Eye className="h-4 w-4 cursor-pointer" />
                )
              }
              onClickRightIcon={() => setShowConfirmPassword((prev) => !prev)}
            />
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>
          <div className="flex flex-col gap-2 mb-4 items-start">
            <p className="block mb-1 text-sm font-medium text-[var(--color-components)]">Principal</p>
            {!isCurrentUserRoot && (
              <p className="text-xs text-gray-500 mb-1">
                Apenas administradores principais podem criar outros administradores principais
              </p>
            )}
            <div className="flex gap-6">
              <label className={`flex items-center gap-2 ${isCurrentUserRoot ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
                <div className="relative flex items-center justify-center">
                  <input
                    type="radio"
                    name="principal"
                    checked={formData.root === true}
                    onChange={() => isCurrentUserRoot && setFormData((prev) => ({ ...prev, root: true }))}
                    className="sr-only"
                    disabled={!isCurrentUserRoot}
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      formData.root ? "border-[#005172] bg-[#005172]" : "border-gray-300 bg-white"
                    }`}
                  >
                    {formData.root && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                </div>
                <span className="text-sm text-gray-700">Sim</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative flex items-center justify-center">
                  <input
                    type="radio"
                    name="principal"
                    checked={formData.root === false}
                    onChange={() => setFormData((prev) => ({ ...prev, root: false }))}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      !formData.root ? "border-[#005172] bg-[#005172]" : "border-gray-300 bg-white"
                    }`}
                  >
                    {!formData.root && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                </div>
                <span className="text-sm text-gray-700">Não</span>
              </label>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-12">
            <button
              className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 cursor-pointer transition-colors duration-200"
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Cancelar
            </button>

            <button
              className={`px-6 py-2 rounded-lg transition-colors duration-200 ${
                passwordError ||
                !formData.fullName ||
                !formData.email ||
                !formData.password ||
                !confirmPassword
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-[#005172] text-white hover:bg-[#006b91] cursor-pointer"
              }`}
              onClick={handleConfirm}
              disabled={
                passwordError !== "" ||
                !formData.fullName ||
                !formData.email ||
                !formData.password ||
                !confirmPassword
              }
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isResponseModalOpen}
        onClose={() => setIsResponseModalOpen(false)}
        title={
          serviceResponse && serviceResponse.status === 201
            ? "Sucesso"
            : serviceResponse &&
                serviceResponse.message?.length &&
                serviceResponse.message.length > 1
              ? `${serviceResponse.message.length} erros encontrados`
              : "Erro"
        }
      >
        <div className="flex flex-col justify-between gap-12 items-center w-full">
          <div className="flex flex-col gap-2">
            {serviceResponse?.status === 201 ? (
              <p>Administrador{formData.root ? " principal " : " comum "}criado com sucesso!</p>
            ) : (
              serviceResponse?.message.map((message) => <p key={message}>{message}</p>)
            )}
          </div>
          <button
            className="px-6 py-2 bg-[#005172] text-white rounded-lg hover:bg-[#006b91] cursor-pointer transition-colors duration-200 w-1/2"
            onClick={() => {
              setIsResponseModalOpen(false);
              if (serviceResponse?.status === 201) {
                onClose();
              }
            }}
          >
            Fechar
          </button>
        </div>
      </Modal>
    </>
  );
}
