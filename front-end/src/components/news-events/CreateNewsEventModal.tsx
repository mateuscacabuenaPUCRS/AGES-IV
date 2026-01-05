import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Input from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Button from "@/components/ui/button";
import { DatePicker } from "@/components/ui/Calendar/date-picker";
import { TimePicker } from "@/components/ui/Calendar/time-picker";

const VALIDATION_RULES = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 128,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 2048,
} as const;

const DEFAULT_URLS = {
  NEWS: "https://www.paodospobres.org.br/noticias/",
  EVENT: "https://www.paodospobres.org.br/eventos/",
} as const;

interface CreateNewsEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (
    type: "news" | "event",
    data:
      | { title: string; description: string; date: string; location: string; url: string }
      | {
          title: string;
          description: string;
          dateStart: string;
          dateEnd: string;
          location: string;
          url: string;
        }
  ) => Promise<void> | void;
}

export const CreateNewsEventModal: React.FC<CreateNewsEventModalProps> = ({
  open,
  onOpenChange,
  onCreate,
}) => {
  const [selectedType, setSelectedType] = React.useState<"news" | "event">("news");
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    date: undefined as Date | undefined,
    dateStart: undefined as Date | undefined,
    dateEnd: undefined as Date | undefined,
    timeStart: "",
    timeEnd: "",
    location: "",
    url: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const config = {
    news: {
      title: "Criar Notícia",
      buttonColor: "bg-[#F68537] hover:bg-[#e5782e]",
      typeLabel: "Notícia",
    },
    event: {
      title: "Criar Evento",
      buttonColor: "bg-[#24A254] hover:bg-[#1e8a47]",
      typeLabel: "Evento",
    },
  }[selectedType];

  useEffect(() => {
    if (!open) {
      setSelectedType("news");
      setForm({
        title: "",
        description: "",
        date: undefined,
        dateStart: undefined,
        dateEnd: undefined,
        timeStart: "",
        timeEnd: "",
        location: "",
        url: "",
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open]);

  function handleChange(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) {
      setErrors((e) => ({ ...e, [field]: "" }));
    }
  }

  function handleTypeChange(type: "news" | "event") {
    setSelectedType(type);
    setForm((f) => ({ ...f, date: undefined, dateStart: undefined, dateEnd: undefined, timeStart: "", timeEnd: "" }));
    setErrors({});
  }

  function handleDateChange(field: "date" | "dateStart" | "dateEnd", value: Date | undefined) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) {
      setErrors((e) => ({ ...e, [field]: "" }));
    }
  }

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};

    if (form.title.length < VALIDATION_RULES.TITLE_MIN_LENGTH) {
      newErrors.title = `Título deve ter pelo menos ${VALIDATION_RULES.TITLE_MIN_LENGTH} caracteres`;
    }
    if (form.title.length > VALIDATION_RULES.TITLE_MAX_LENGTH) {
      newErrors.title = `Título deve ter no máximo ${VALIDATION_RULES.TITLE_MAX_LENGTH} caracteres`;
    }

    if (form.description.length < VALIDATION_RULES.DESCRIPTION_MIN_LENGTH) {
      newErrors.description = `Descrição deve ter pelo menos ${VALIDATION_RULES.DESCRIPTION_MIN_LENGTH} caracteres`;
    }
    if (
      selectedType === "news" &&
      form.description.length > VALIDATION_RULES.DESCRIPTION_MAX_LENGTH
    ) {
      newErrors.description = `Descrição deve ter no máximo ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} caracteres`;
    }

    if (selectedType === "news") {
      if (!form.date) {
        newErrors.date = "Data é obrigatória";
      }
    } else {
      // Get today's date as string for comparison
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      if (!form.dateStart) {
        newErrors.dateStart = "Data de início é obrigatória";
      } else if (form.dateStart) {
        const startDate = form.dateStart;
        const startDateStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`;

        if (startDateStr <= todayStr) {
          newErrors.dateStart = "Data de início deve ser a partir de amanhã";
        }
      }

      if (!form.dateEnd) {
        newErrors.dateEnd = "Data de término é obrigatória";
      }

      if (!form.timeStart) {
        newErrors.timeStart = "Horário de início é obrigatório";
      }

      if (!form.timeEnd) {
        newErrors.timeEnd = "Horário de término é obrigatório";
      }

      if (form.dateStart && form.dateEnd && !newErrors.dateStart && !newErrors.dateEnd) {
        const startDate = form.dateStart;
        const startDateStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`;

        const endDate = form.dateEnd;
        const endDateStr = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;

        if (endDateStr < startDateStr) {
          newErrors.dateEnd = "Data de término não pode ser anterior à data de início";
        }

        // Validar horários se as datas forem iguais
        if (endDateStr === startDateStr && form.timeStart && form.timeEnd && !newErrors.timeStart && !newErrors.timeEnd) {
          if (form.timeEnd <= form.timeStart) {
            newErrors.timeEnd = "Horário de término deve ser posterior ao horário de início";
          }
        }
      }
    }

    if (!form.location.trim()) {
      newErrors.location = "Local é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (selectedType === "news") {
        if (!form.date) {
          alert("Data é obrigatória");
          return;
        }
        await onCreate("news", {
          title: form.title,
          description: form.description,
          date: form.date.toISOString(),
          location: form.location,
          url: DEFAULT_URLS.NEWS,
        });
      } else {
        if (!form.dateStart || !form.dateEnd) {
          alert("Datas são obrigatórias");
          return;
        }
        // Combinar data e hora para criar ISO strings sem conversão de timezone
        const year = form.dateStart.getFullYear();
        const month = String(form.dateStart.getMonth() + 1).padStart(2, "0");
        const day = String(form.dateStart.getDate()).padStart(2, "0");
        const dateStartISO = `${year}-${month}-${day}T${form.timeStart}:00.000Z`;
        
        const yearEnd = form.dateEnd.getFullYear();
        const monthEnd = String(form.dateEnd.getMonth() + 1).padStart(2, "0");
        const dayEnd = String(form.dateEnd.getDate()).padStart(2, "0");
        const dateEndISO = `${yearEnd}-${monthEnd}-${dayEnd}T${form.timeEnd}:00.000Z`;

        await onCreate("event", {
          title: form.title,
          description: form.description,
          dateStart: dateStartISO,
          dateEnd: dateEndISO,
          location: form.location,
          url: DEFAULT_URLS.EVENT,
        });
      }
      onOpenChange(false);
    } catch (error) {
      console.error(`Erro ao criar ${selectedType === "news" ? "notícia" : "evento"}:`, error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-white border-none max-w-2xl max-h-[90vh] overflow-y-auto p-6"
        showCloseButton={false}
      >
        <DialogTitle className="text-2xl font-bold text-[#034d6b] mb-6">{config.title}</DialogTitle>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#034d6b] mb-1.5">
              Tipo <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange("news")}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                  selectedType === "news"
                    ? "bg-[#F68537] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Notícia
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("event")}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                  selectedType === "event"
                    ? "bg-[#24A254] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Evento
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#034d6b] mb-1.5">
              Título <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Digite o título"
              className={`w-full h-10 ${errors.title ? "border-red-500" : ""}`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#034d6b] mb-1.5">
              Descrição <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Digite a descrição"
              rows={3}
              className={`w-full resize-none ${errors.description ? "border-red-500" : ""}`}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {selectedType === "news" ? (
            <div>
              <label className="block text-sm font-semibold text-[#034d6b] mb-1.5">
                Data <span className="text-red-500">*</span>
              </label>
              <DatePicker
                id="news-date"
                placeholder="Selecione a data"
                value={form.date}
                onChange={(date) => handleDateChange("date", date)}
                fullWidth
                error={errors.date}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-[#034d6b] mb-1.5">
                    Data de Início <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    id="event-date-start"
                    placeholder="Selecione a data de início"
                    value={form.dateStart}
                    onChange={(date) => handleDateChange("dateStart", date)}
                    fullWidth
                    error={errors.dateStart}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#034d6b] mb-1.5">
                    Data de Término <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    id="event-date-end"
                    placeholder="Selecione a data de término"
                    value={form.dateEnd}
                    onChange={(date) => handleDateChange("dateEnd", date)}
                    fullWidth
                    error={errors.dateEnd}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-[#034d6b] mb-1.5">
                    Horário de Início <span className="text-red-500">*</span>
                  </label>
                  <TimePicker
                    id="event-time-start"
                    placeholder="00:00"
                    value={form.timeStart}
                    onChange={(time) => handleChange("timeStart", time)}
                    fullWidth
                    error={errors.timeStart}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#034d6b] mb-1.5">
                    Horário de Término <span className="text-red-500">*</span>
                  </label>
                  <TimePicker
                    id="event-time-end"
                    placeholder="00:00"
                    value={form.timeEnd}
                    onChange={(time) => handleChange("timeEnd", time)}
                    fullWidth
                    error={errors.timeEnd}
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-[#034d6b] mb-1.5">
              Local <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="Digite o local"
              className={`w-full h-10 ${errors.location ? "border-red-500" : ""}`}
            />
            {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
          </div>
        </div>

        <div className="pt-4 flex gap-2 justify-center">
          <Button
            variant="senary"
            size="small"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            variant="quaternary"
            size="small"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={config.buttonColor}
          >
            {isSubmitting ? "Criando..." : "Criar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewsEventModal;
