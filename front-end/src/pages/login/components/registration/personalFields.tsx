import { useFormValidation } from "@/hooks/useFormValidation";
import { isValidCPF, isValidPhone } from "@/utils/formatters";
import FormContainer from "../shared/FormContainer";
import FormActions from "../shared/FormActions";
import StepIndicator from "../shared/StepIndicator";
import PersonalFormFields, { type PersonalFormData } from "./PersonalFormFields";

interface PersonalFieldsProps {
  onCancel: () => void;
  onNext: (data: PersonalFormData) => void;
}

const initialForm: PersonalFormData = {
  nomeCompleto: "",
  dataNascimento: undefined,
  genero: "",
  cpf: "",
  telefone: "",
};

const validationRules = {
  nomeCompleto: (value: string) => {
    if (!value.trim()) return "Nome completo é obrigatório";
    if (value.trim().length < 3) return "Nome deve ter no mínimo 3 caracteres";
    return null;
  },
  dataNascimento: (value?: Date) => (!value ? "Data de nascimento é obrigatória" : null),
  genero: (value: string) => (!value ? "Gênero é obrigatório" : null),
  cpf: (value: string) => {
    if (!value.trim()) return "CPF é obrigatório";
    if (!isValidCPF(value)) return "CPF inválido";
    return null;
  },
  telefone: (value: string) => {
    if (!value.trim()) return "Telefone é obrigatório";
    if (!isValidPhone(value)) return "Telefone inválido";
    return null;
  },
};

export default function PersonalFields({ onCancel, onNext }: PersonalFieldsProps) {
  const { form, errors, updateField, validateForm } = useFormValidation(
    initialForm,
    validationRules
  );

  const handleNext = () => {
    if (validateForm()) {
      onNext(form);
    }
  };

  const isFormValid = Object.entries(validationRules).every(([key, rule]) => {
    const value = (form as unknown as Record<string, unknown>)[key];
    return (rule as (v: unknown) => string | null)(value) === null;
  });

  const steps = [
    { number: 1, label: "Dados Pessoais", isActive: true, isCompleted: false },
    { number: 2, label: "Dados de Acesso", isActive: false, isCompleted: false },
  ];

  return (
    <FormContainer>
      <PersonalFormFields form={form} errors={errors} onChange={updateField} />
      <StepIndicator steps={steps} />
      <FormActions
        primaryAction={{
          label: "Próximo",
          onClick: handleNext,
          disabled: !isFormValid,
          variant: "primary",
          testId: "register-next",
        }}
        secondaryAction={{
          label: "Cancelar",
          onClick: onCancel,
          variant: "tertiary",
          testId: "register-cancel",
        }}
      />
    </FormContainer>
  );
}
