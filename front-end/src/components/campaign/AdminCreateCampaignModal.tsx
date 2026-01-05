import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FormStep } from "./steps";
import { createCampaignSchema } from "@/schemas/campaign";
import { z } from "zod";

interface AdminCreateCampaignModalProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: (data: {
    title: string;
    description: string;
    targetValue: number;
    startDate: Date;
    endDate: Date;
    image?: File | null;
  }) => Promise<void> | void;
}

const currencyMask = (value: string) => {
  const digits = value.replace(/\D/g, "");
  const number = (parseInt(digits, 10) || 0) / 100;
  return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export const AdminCreateCampaignModal: React.FC<AdminCreateCampaignModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    targetValue: "",
    imageName: "" as string | null,
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
  });
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [, setErrors] = React.useState<Record<string, string>>({});

  function resetAll() {
    setForm({
      title: "",
      description: "",
      targetValue: "",
      imageName: "",
      startDate: undefined,
      endDate: undefined,
    });
    setImageFile(null);
    setErrors({});
  }
  function handleChange(field: string, value: string) {
    if (field === "targetValue") value = currencyMask(value);
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleDateChange(field: "startDate" | "endDate", value: Date | undefined) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleImage(file: File | null) {
    setImageFile(file);
    setForm((f) => ({ ...f, imageName: file?.name || "" }));
  }
  function validateForm() {
    try {
      const parsed = createCampaignSchema.parse({
        title: form.title,
        description: form.description,
        targetValue: Number(form.targetValue.replace(/[^0-9,-]/g, "").replace(",", ".")),
        image: imageFile ?? null,
      });
      return parsed;
    } catch (e) {
      if (e instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        e.issues.forEach((i) => {
          if (i.path[0]) fieldErrors[i.path[0] as string] = i.message;
        });
        setErrors(fieldErrors);
      }
      return null;
    }
  }

  async function handleSubmit() {
    const parsed = validateForm();
    if (!parsed) return;

    if (!form.startDate || !form.endDate) {
      alert("As datas são obrigatórias");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startDateOnly = new Date(form.startDate);
    startDateOnly.setHours(0, 0, 0, 0);

    if (startDateOnly < tomorrow) {
      alert("A data de início deve ser no mínimo amanhã");
      return;
    }
    const endDateOnly = new Date(form.endDate);
    endDateOnly.setHours(0, 0, 0, 0);

    if (endDateOnly < tomorrow) {
      alert("A data de término deve ser no mínimo amanhã");
      return;
    }

    if (endDateOnly <= startDateOnly) {
      alert("A data de término deve ser posterior à data de início");
      return;
    }

    await onSubmit({
      title: parsed.title,
      description: parsed.description,
      targetValue: parsed.targetValue,
      startDate: form.startDate,
      endDate: form.endDate,
      image: imageFile ?? null,
    });
    resetAll();
    onOpenChange(false);
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(o: boolean) => {
        if (!o) resetAll();
        onOpenChange(o);
      }}
    >
      <DialogContent className="bg-white border-none max-w-3xl" showCloseButton={false}>
        <DialogTitle className="text-2xl font-semibold text-[var(--color-components)]">
          Nova Campanha
        </DialogTitle>
        <FormStep
          form={form}
          onChange={handleChange}
          onDateChange={handleDateChange}
          onImageSelect={handleImage}
          onNext={handleSubmit}
          showDates={true}
          isEditMode={false}
          submitLabel="Criar"
        />
      </DialogContent>
    </Dialog>
  );
};
export default AdminCreateCampaignModal;
