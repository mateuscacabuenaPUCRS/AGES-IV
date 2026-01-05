import React, { useState, useRef, useEffect, useCallback } from "react";
import cn from "@/utils/cn";

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

type LabelPosition = "left" | "center" | "right";

interface SelectProps {
  options: Option[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  label?: string;
  labelPosition?: LabelPosition;
  error?: string;
  id?: string;
  onOpenChange?: (isOpen: boolean) => void;
}

export const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Selecione uma opção",
  value,
  onChange,
  className = "",
  disabled = false,
  fullWidth = false,
  label,
  labelPosition = "left",
  error,
  id = "select-1",
  onOpenChange,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | undefined>(value);
  const ref = useRef<HTMLDivElement>(null);

  const setOpenState = useCallback(
    (newOpenState: boolean) => {
      setOpen(newOpenState);
      onOpenChange?.(newOpenState);
    },
    [onOpenChange]
  );

  const hasError = !!error;

  useEffect(() => {
    setSelected(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenState(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpenState]);

  const handleSelect = (option: Option) => {
    if (option.disabled) return;
    setSelected(option.value);
    setOpenState(false);
    onChange?.(option.value);
  };

  const selectedLabel = options.find((o) => o.value === selected)?.label;

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
    <div className="w-full overflow-visible">
      {label && (
        <label htmlFor={id} className={getLabelClasses()}>
          {label}
        </label>
      )}

      <div
        ref={ref}
        className={cn(
          "relative",
          fullWidth ? "w-full" : "w-80",
          disabled ? "opacity-50 pointer-events-none" : "opacity-100 pointer-events-auto",
          className
        )}
      >
        <button
          type="button"
          id={id}
          data-testid={"select-" + id}
          className={cn(
            "flex items-center justify-between rounded-lg border border-[var(--color-components)]/30 bg-white px-3 py-2 text-sm text-black shadow-sm outline-none focus:border-[var(--color-components)] focus:ring-1 focus:ring-[var(--color-components)] transition duration-150 w-full",
            open && "ring-1 ring-[var(--color-components)]",
            disabled && "bg-gray-200 text-gray-400 cursor-not-allowed",
            hasError && "border-red-500 focus:border-red-500 focus:ring-red-500"
          )}
          onClick={() => !disabled && setOpenState(!open)}
          aria-haspopup="listbox"
          aria-expanded={open}
          disabled={disabled}
        >
          <span className={selectedLabel ? "text-black" : "text-[var(--color-components)]/50"}>
            {selectedLabel || placeholder}
          </span>
          <svg
            className={cn(
              "text-[var(--color-components)]/60 transition-transform h-4 w-4",
              open && "rotate-180"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && !disabled && (
          <ul
            className="absolute z-50 mt-1 w-full bg-white border border-[var(--color-components)]/30 rounded-lg shadow-lg max-h-60 overflow-y-auto py-1"
            role="listbox"
          >
            {options.map((option) => (
              <li
                data-testid={`select-option-${option.value}`}
                key={option.value}
                className={cn(
                  "px-3 py-2 cursor-pointer select-none flex items-center text-black hover:bg-[var(--color-components)]/10 transition",
                  option.disabled && "text-gray-300 cursor-not-allowed",
                  selected === option.value && "bg-[var(--color-components)]/10 font-semibold"
                )}
                aria-selected={selected === option.value}
                onClick={() => handleSelect(option)}
              >
                {selected === option.value && (
                  <svg
                    className="mr-2 h-4 w-4 text-[var(--color-components)]"
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
                )}
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {hasError && <p className="text-red-600 text-sm text-left mt-1">{error}</p>}
    </div>
  );
};
