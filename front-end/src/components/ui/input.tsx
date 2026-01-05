import cn from "@/utils/cn";
import * as React from "react";

type LabelPosition = "left" | "center" | "right";

type InputProps = React.ComponentProps<"input"> & {
  fullWidth?: boolean;
  label?: string;
  labelPosition?: LabelPosition;
  labelText?: string;
  helperText?: React.ReactNode;
  error?: string;
  RightIcon?: React.ReactNode;
  onClickRightIcon?: VoidFunction;
};

const Input = ({
  className,
  fullWidth = false,
  label,
  labelPosition = "left",
  labelText,
  helperText,
  error,
  id = "input-1",
  RightIcon,
  onClickRightIcon,
  ...props
}: InputProps) => {
  const hasError = !!error;
  const hasHelperText =
    helperText !== undefined && !(typeof helperText === "string" && helperText.trim().length === 0);
  const displayLabel = labelText || label;

  const descriptorId = hasError ? `${id}-error` : hasHelperText ? `${id}-helper` : undefined;

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
      {displayLabel && (
        <label htmlFor={id} className={getLabelClasses()}>
          {displayLabel}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          aria-invalid={hasError}
          aria-describedby={descriptorId}
          className={cn(
            "rounded-[6px] border border-[var(--color-components)]/30 bg-white px-3 py-2 text-sm text-black shadow-sm outline-none placeholder:text-[var(--color-components)]/50 focus:border-[var(--color-components)] focus:ring-1 focus:ring-[var(--color-components)]",
            fullWidth ? "w-full" : "w-80",
            hasError && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />

        {RightIcon && (
          <button
            type="button"
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-components)]/60 hover:text-[var(--color-components)] focus:outline-none focus:text-[var(--color-components)] transition-colors",
              onClickRightIcon && "cursor-pointer"
            )}
            onClick={onClickRightIcon}
          >
            {RightIcon}
          </button>
        )}
      </div>

      {hasError ? (
        <p id={descriptorId} className="text-red-600 text-sm text-left mt-1">
          {error}
        </p>
      ) : hasHelperText ? (
        <div
          id={descriptorId}
          className="text-gray-500 text-sm text-left flex justify-between mt-1"
        >
          {helperText}
        </div>
      ) : null}
    </div>
  );
};

export default Input;
