"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/Calendar/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type LabelPosition = "left" | "center" | "right";

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  fromYear?: number;
  toYear?: number;
  fullWidth?: boolean;
  label?: string;
  labelPosition?: LabelPosition;
  error?: string;
  id?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecione uma data",
  className,
  fullWidth = false,
  label,
  labelPosition = "left",
  error,
  id = "date-picker-1",
}: DatePickerProps) {
  const hasError = !!error;

  const getLabelClasses = () => {
    const baseClasses = "block mb-1 text-sm font-medium text-[var(--color-components)]";

    const positionClasses = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    };

    return cn(baseClasses, positionClasses[labelPosition]);
  };
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className={getLabelClasses()}>
          {label}
        </label>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            id={id}
            className={cn(
              "flex items-center justify-between rounded-lg border border-[var(--color-components)]/30 bg-white px-3 py-2 text-sm text-black shadow-sm outline-none focus:border-[var(--color-components)] focus:ring-1 focus:ring-[var(--color-components)] transition duration-150",
              fullWidth ? "w-full" : "w-80",
              hasError && "border-red-500 focus:border-red-500 focus:ring-red-500",
              className
            )}
          >
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 text-[var(--color-components)]/60" />
              <span className={value ? "text-black" : "text-[var(--color-components)]/50"}>
                {value ? format(value, "P", { locale: ptBR }) : placeholder}
              </span>
            </div>
            <ChevronDownIcon className="ml-2 h-4 w-4 text-[var(--color-components)]/60" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto max-w-[min(450px,calc(100vw-2rem))] p-0 bg-white shadow-lg rounded-xl overflow-hidden"
          sideOffset={8}
        >
          <div className="overflow-auto max-h-[80vh]">
            <Calendar
              mode="single"
              selected={value}
              showOutsideDays={true}
              onSelect={onChange}
              autoFocus
              locale={ptBR}
              captionLayout="dropdown"
            />
          </div>
        </PopoverContent>
      </Popover>

      {hasError && <p className="text-red-600 text-sm text-left mt-1">{error}</p>}
    </div>
  );
}
