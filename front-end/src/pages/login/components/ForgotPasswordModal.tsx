import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { formatCPF, unformatCPF, isValidCPF } from "@/utils/formatters";
import { getAllDonors, updateDonor } from "@/services/donors";
import { passwordRequirements } from "@/schemas/auth";
import { Eye, EyeOff } from "lucide-react";

interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "cpf" | "password" | "success";

const PasswordRequirements = ({ password }: { password: string }) => {
  if (!password) {
    return null;
  }

  return (
    <div className="-mt-2 mb-4 text-left">
      <ul className="space-y-1">
        {passwordRequirements.map((req) => {
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

export default function ForgotPasswordModal({ open, onOpenChange }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<Step>("cpf");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [donorId, setDonorId] = useState("");

  const resetAll = () => {
    setCpf("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setStep("cpf");
    setDonorId("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    resetAll();
    onOpenChange(false);
  };

  const validatePassword = (password: string): boolean => {
    return passwordRequirements.every((req) => req.test(password));
  };

  const handleCpfSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!cpf) {
      setError("Por favor, insira seu CPF");
      return;
    }

    const unformattedCpf = unformatCPF(cpf);

    if (!isValidCPF(unformattedCpf)) {
      setError("CPF inválido");
      return;
    }

    setIsLoading(true);
    try {
      const donors = await getAllDonors();
      const donor = donors.find((d) => unformatCPF(d.cpf) === unformattedCpf);

      if (!donor) {
        setError("CPF não encontrado. Este CPF não está vinculado a nenhuma conta.");
        return;
      }

      setDonorId(donor.id);
      setStep("password");
    } catch (err) {
      console.error(err);
      setError("Erro ao verificar CPF. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Por favor, insira uma senha");
      return;
    }

    if (!validatePassword(password)) {
      setError("A senha não atende aos requisitos de segurança");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setIsLoading(true);
    try {
      await updateDonor(donorId, { password });
      setStep("success");
    } catch (err) {
      console.error(err);
      setError("Erro ao atualizar senha. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o: boolean) => {
        if (!o) resetAll();
        onOpenChange(o);
      }}
    >
      <DialogContent className="bg-white border-none max-w-md" showCloseButton={true}>
        {step === "cpf" && (
          <div>
            <DialogTitle className="text-2xl font-semibold text-[var(--color-components)] mb-2">
              Recuperar Senha
            </DialogTitle>
            <p className="text-[var(--color-text-2)] mb-6">
              Digite seu CPF para verificar sua conta
            </p>

            <form onSubmit={handleCpfSubmit} className="space-y-4">
              <Input
                id="cpf"
                label="CPF"
                placeholder="000.000.000-00"
                type="text"
                value={cpf}
                onChange={(e) => setCpf(formatCPF(e.target.value))}
                fullWidth
                maxLength={14}
                error={error}
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="confirm" className="w-full" disabled={isLoading}>
                  {isLoading ? "Verificando..." : "Continuar"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {step === "password" && (
          <div>
            <DialogTitle className="text-2xl font-semibold text-[var(--color-components)] mb-2">
              Nova Senha
            </DialogTitle>
            <p className="text-[var(--color-text-2)] mb-6">Crie uma nova senha para sua conta</p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                id="password"
                label="Nova Senha"
                placeholder="Digite sua nova senha"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                RightIcon={
                  showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />
                }
                onClickRightIcon={() => setShowPassword((prev) => !prev)}
              />

              <PasswordRequirements password={password} />

              <Input
                id="confirmPassword"
                label="Confirmar Nova Senha"
                placeholder="Confirme sua nova senha"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                RightIcon={
                  showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />
                }
                onClickRightIcon={() => setShowConfirmPassword((prev) => !prev)}
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => setStep("cpf")}
                  disabled={isLoading}
                >
                  Voltar
                </Button>
                <Button type="submit" variant="confirm" className="w-full" disabled={isLoading}>
                  {isLoading ? "Atualizando..." : "Atualizar Senha"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {step === "success" && (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="bg-green-100 rounded-full p-3">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <DialogTitle className="text-2xl font-semibold text-[var(--color-components)] mb-2">
              Senha Atualizada!
            </DialogTitle>
            <p className="text-[var(--color-text-2)] mb-6">
              Sua senha foi atualizada com sucesso. Você já pode fazer login com sua nova senha.
            </p>

            <Button type="button" variant="confirm" className="w-full" onClick={handleClose}>
              Fazer Login
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
