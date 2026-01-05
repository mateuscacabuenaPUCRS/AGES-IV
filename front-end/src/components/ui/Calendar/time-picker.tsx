"use client";

import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  placeholder?: string;
  className?: string;
  fullWidth?: boolean;
  label?: string;
  error?: string;
  id?: string;
}

export function TimePicker({
  value = "",
  onChange,
  placeholder = "Selecione o horário",
  className,
  fullWidth = false,
  label,
  error,
  id = "time-picker-1",
}: TimePickerProps) {
  const hasError = !!error;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block mb-1 text-sm font-medium text-[var(--color-components)]">
          {label}
        </label>
      )}

      <div className="relative">
        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-components)]/60 pointer-events-none" />
        <input
          type="time"
          id={id}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "flex items-center justify-between rounded-lg border border-[var(--color-components)]/30 bg-white pl-10 pr-3 py-2 text-sm text-black shadow-sm outline-none focus:border-[var(--color-components)] focus:ring-1 focus:ring-[var(--color-components)] transition duration-150",
            fullWidth ? "w-full" : "w-80",
            hasError && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
        />
      </div>

      {hasError && <p className="text-red-600 text-sm text-left mt-1">{error}</p>}
    </div>
  );
}

