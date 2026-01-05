import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Divider from "@/components/ui/divider";
import type { LoginInput } from "@/schemas/auth";
import { loginSchema } from "@/schemas/auth";
import { login } from "@/services/auth";
import { useUser } from "@/hooks/useUser";
import ForgotPasswordModal from "../ForgotPasswordModal";

import { Eye, EyeOff } from "lucide-react";

export default function LoginContent({ onRegisterClick }: { onRegisterClick: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [form, setForm] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleChange = (field: keyof LoginInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
    setApiError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as keyof LoginInput] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(form);
      setUser(user);

      if (user.role === "ADMIN") {
        navigate("/dashboard");
      } else if (user.role === "DONOR") {
        navigate("/");
      } else {
        navigate("/perfil");
      }
    } catch (error) {
      console.error(error);
      setApiError("Email ou senha incorretos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto my-4 w-full text-center">
      <form noValidate onSubmit={handleSubmit} className="space-y-2">
        <div className="my-8 flex flex-col gap-4">
          <Input
            id="email"
            name="email"
            label="E-mail"
            placeholder="Digite seu e-mail"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            fullWidth
            error={errors.email}
            data-testid="login-email"
          />

          <Input
            id="senha"
            name="password"
            label="Senha"
            placeholder="Digite sua senha"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange("password")}
            fullWidth
            error={errors.password}
            RightIcon={showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            onClickRightIcon={() => setShowPassword((prev) => !prev)}
            data-testid="login-password"
          />

          <div className="mt-[-12px] flex space-between w-full text-sm justify-between items-center">
            <button
              type="button"
              onClick={() => setIsForgotPasswordOpen(true)}
              className="text-[var(--color-components)] border-[var(--color-components)] focus:ring-[var(--color-components)] underline cursor-pointer text-sm"
              data-testid="forgot-password-button"
            >
              Esqueceu sua senha?
            </button>
            <div>
              {apiError && (
                <p className=" text-sm text-red-600" data-testid="login-error">
                  {apiError}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            variant="confirm"
            className="w-full"
            disabled={isLoading}
            data-testid="login-submit"
          >
            {isLoading ? "Carregando..." : "Entrar"}
          </Button>

          <Divider text="ou" variant="secondary" className="mt-1" />

          <Button
            type="button"
            variant="primary"
            data-testid="register-button"
            className="w-full"
            onClick={onRegisterClick}
          >
            Cadastre-se
          </Button>
        </div>
      </form>

      <ForgotPasswordModal open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen} />
    </div>
  );
}
