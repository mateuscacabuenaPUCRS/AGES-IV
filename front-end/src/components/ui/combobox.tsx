import React, { useState, useRef, useEffect, useCallback } from "react";
import cn from "@/utils/cn";

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

type LabelPosition = "left" | "center" | "right";

interface ComboboxProps {
  options: Option[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearchChange?: (search: string) => void;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  label?: string;
  labelPosition?: LabelPosition;
  error?: string;
  id?: string;
  onOpenChange?: (isOpen: boolean) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  placeholder = "Pesquise ou selecione uma opção",
  value,
  onChange,
  onSearchChange,
  className = "",
  disabled = false,
  fullWidth = false,
  label,
  labelPosition = "left",
  error,
  id = "combobox-1",
  onOpenChange,
  isLoading = false,
  emptyMessage = "Nenhum resultado encontrado",
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | undefined>(value);
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenState(false);
        setSearchTerm("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpenState]);

  useEffect(() => {
    if (onSearchChange) {
      const timeoutId = setTimeout(() => {
        onSearchChange(searchTerm);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, onSearchChange]);

  const handleSelect = (option: Option) => {
    if (option.disabled) return;
    setSelected(option.value);
    setOpenState(false);
    setSearchTerm("");
    onChange?.(option.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!open) {
      setOpenState(true);
    }
  };

  const selectedLabel = options.find((o) => o.value === selected)?.label;

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLabelClasses = () => {
    const baseClasses = "block mb-1 text-sm font-medium text-[var(--color-components)]";

    const positionClasses = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    };

    return cn(baseClasses, positionClasses[labelPosition]);
  };

  const displayValue = open ? searchTerm : selectedLabel || "";

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
        <div
          className={cn(
            "flex items-center justify-between rounded-lg border border-[var(--color-components)]/30 bg-white px-3 py-2 text-sm text-black shadow-sm outline-none focus-within:border-[var(--color-components)] focus-within:ring-1 focus-within:ring-[var(--color-components)] transition duration-150 w-full",
            open && "ring-1 ring-[var(--color-components)]",
            disabled && "bg-gray-200 text-gray-400 cursor-not-allowed",
            hasError && "border-red-500 focus-within:border-red-500 focus-within:ring-red-500"
          )}
        >
          <input
            ref={inputRef}
            type="text"
            id={id}
            className={cn(
              "flex-1 bg-transparent outline-none",
              !displayValue && "placeholder:text-[var(--color-components)]/50"
            )}
            placeholder={placeholder}
            value={displayValue}
            onChange={handleSearchChange}
            onFocus={() => !disabled && setOpenState(true)}
            disabled={disabled}
            autoComplete="off"
          />
          <button
            type="button"
            className="flex-shrink-0 ml-2"
            onClick={() => !disabled && setOpenState(!open)}
            disabled={disabled}
            aria-label="Toggle dropdown"
          >
            <svg
              className={cn(
                "text-[var(--color-components)]/60 transition-transform h-4 w-4",
                open && "rotate-180"
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {open && !disabled && (
          <ul
            className="absolute z-50 mt-1 w-full bg-white border border-[var(--color-components)]/30 rounded-lg shadow-lg max-h-60 overflow-y-auto py-1"
            role="listbox"
          >
            {isLoading ? (
              <li className="px-3 py-2 text-center text-[var(--color-components)]/50">
                Carregando...
              </li>
            ) : filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-center text-[var(--color-components)]/50">
                {emptyMessage}
              </li>
            ) : (
              filteredOptions.map((option) => (
                <li
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
              ))
            )}
          </ul>
        )}
      </div>

      {hasError && <p className="text-red-600 text-sm text-left mt-1">{error}</p>}
    </div>
  );
};
