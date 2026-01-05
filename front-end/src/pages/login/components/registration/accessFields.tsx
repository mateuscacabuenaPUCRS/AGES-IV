import { useState, useEffect } from "react";
import { useFormValidation } from "@/hooks/useFormValidation";
import FormContainer from "../shared/FormContainer";
import FormActions from "../shared/FormActions";
import StepIndicator from "../shared/StepIndicator";
import AccessFormFields, { type AccessFormData } from "./AccessFormFields";
import { passwordRequirements } from "@/schemas/auth";

interface AccessFieldsProps {
  onBack: () => void;
  onRegister: (data: AccessFormData) => void | Promise<string | boolean | undefined>;
  errorApi?: (data: string) => string;
}

const initialForm: AccessFormData = {
  email: "",
  password: "",
  confirmPassword: "",
};

const validationRules = {
  email: (value: string) => {
    if (!value.trim()) return "E-mail é obrigatório";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "E-mail inválido";
    return null;
  },
  password: (value: string) => {
    if (!value.trim()) return "Senha é obrigatória";

    const isPasswordValid = passwordRequirements.every((requirement) => requirement.test(value));

    if (!isPasswordValid) {
      return "A senha não atende a todos os requisitos.";
    }

    return null;
  },
  confirmPassword: (value: string) => {
    if (!value.trim()) return "Confirmação de senha é obrigatória";
    return null;
  },
};

export default function AccessFields({ onBack, onRegister }: AccessFieldsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { form, errors, updateField, validateForm, setErrors } = useFormValidation(
    initialForm,
    validationRules
  );

  useEffect(() => {
    const confirm = form.confirmPassword;
    const rules = validationRules as unknown as Record<string, (v: unknown) => string | null>;
    if (!confirm) {
      const err = rules.confirmPassword(confirm as unknown);
      setErrors((prev) => ({ ...prev, confirmPassword: err ?? undefined }));
      return;
    }

    if (form.password !== confirm) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Senhas não coincidem" }));
    } else {
      const err = rules.confirmPassword(confirm as unknown);
      setErrors((prev) => ({ ...prev, confirmPassword: err ?? undefined }));
    }
  }, [form.password, form.confirmPassword, setErrors]);

  const handleRegister = async () => {
    const isFormValid = validateForm();
    if (form.password !== form.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Senhas não coincidem",
      }));
      return;
    }
    if (!isFormValid) return;
    setIsLoading(true);
    try {
      const result = await onRegister(form);

      if (typeof result === "string") {
        setErrors((prev) => ({
          ...prev,
          api: result,
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        api: "Não foi possível conectar ao servidor. Tente novamente mais tarde...",
      }));
      console.error("Erro no cadastro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, label: "Dados Pessoais", isActive: false, isCompleted: true },
    { number: 2, label: "Dados de Acesso", isActive: true, isCompleted: false },
  ];

  return (
    <FormContainer>
      <AccessFormFields form={form} errors={errors} onChange={updateField} disabled={isLoading} />
      <StepIndicator steps={steps} />
      <FormActions
        primaryAction={{
          label: isLoading ? "Cadastrando..." : "Cadastrar",
          onClick: handleRegister,
          variant: "confirm",
          disabled:
            isLoading ||
            !Object.entries(validationRules).every(([key, rule]) => {
              const value = (form as unknown as Record<string, unknown>)[key];
              return (rule as (v: unknown) => string | null)(value) === null;
            }) ||
            form.password !== form.confirmPassword,
          testId: "register-submit",
        }}
        secondaryAction={{
          label: "Voltar",
          onClick: onBack,
          variant: "tertiary",
          disabled: isLoading,
          testId: "register-back",
        }}
      />
    </FormContainer>
  );
}
