import Input from "@/components/ui/input";
import React from "react";
import { passwordRequirements } from "@/schemas/auth";

interface AccessFormData {
  email: string;
  password: string;
  confirmPassword: string;
  api?: string;
}

interface AccessFormFieldsProps {
  form: AccessFormData;
  errors: Partial<Record<keyof AccessFormData, string>>;
  onChange: (field: keyof AccessFormData, value: string) => void;
  disabled?: boolean;
}

const PasswordRequirements = ({ password }: { password: string }) => {
  const requirements = passwordRequirements;

  if (!password) {
    return null;
  }

  return (
    <div className="-mt-2 mb-4 text-left">
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

export default function AccessFormFields({
  form,
  errors,
  onChange,
  disabled,
}: AccessFormFieldsProps) {
  const handleChange =
    (field: keyof AccessFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(field, e.target.value);
    };

  return (
    <>
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
        disabled={disabled}
        data-testid="register-email"
      />

      <Input
        id="password"
        name="password"
        label="Senha"
        placeholder="Digite sua senha"
        type="password"
        value={form.password}
        onChange={handleChange("password")}
        fullWidth
        error={errors.password}
        disabled={disabled}
        data-testid="register-password"
      />

      <PasswordRequirements password={form.password} />

      <Input
        id="confirmPassword"
        name="confirmPassword"
        label="Confirmar Senha"
        placeholder="Confirme sua senha"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange("confirmPassword")}
        fullWidth
        error={errors.confirmPassword}
        disabled={disabled}
        data-testid="register-confirm-password"
      />

      <p className="text-red-500 mt-2 -mb-4">{errors.api}</p>
    </>
  );
}

export type { AccessFormData };
