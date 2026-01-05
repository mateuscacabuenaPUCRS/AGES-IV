import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-[8px] min-h-[24px] px-[8px] py-[3px] border text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-white hover:bg-primary/90",
        orange: "border-transparent bg-[var(--color-text-special-2)] text-white hover:opacity-90",
        blue: "border-transparent bg-[var(--color-components-2)] text-white hover:opacity-90",
        blueDark: "border-transparent bg-[var(--color-components)] text-white hover:opacity-90",
        destructive:
          "bg-[var(--color-text-warning)] hover:bg-[var(--color-text-error)] text-[var(--color-background)]",
        outline:
          "bg-transparent text-[var(--color-components)] border border-[var(--color-components)] hover:bg-[color-mix(in_srgb,var(--color-components)_15%,transparent)]",
      },
      size: {
        sm: "",
        md: "text-[13px]",
        lg: "text-sm",
      },
      shape: {
        pill: "",
        counter: "px-[8px] py-[3px] min-w-[24px] justify-center",
      },
      truncate: {
        false: "",
        true: "max-w-[12rem] overflow-hidden text-ellipsis whitespace-nowrap",
      },
    },
    defaultVariants: { variant: "default", size: "sm", shape: "pill", truncate: false },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  ariaLabel?: string;
  count?: number;
  maxCount?: number;
}

export function Badge({
  className,
  variant,
  size,
  shape,
  truncate,
  leftIcon,
  rightIcon,
  ariaLabel,
  children,
  count,
  maxCount = 20,
  ...props
}: BadgeProps) {
  const isIconOnly = !children && (leftIcon || rightIcon);

  let content = children;
  if (typeof count === "number") {
    content = count > maxCount ? `${maxCount}+` : count.toString();
  }

  const isCounterCircle = shape === "counter" && typeof count === "number" && count <= maxCount;

  return (
    <span
      className={cn(
        badgeVariants({ variant, size, shape, truncate }),
        isCounterCircle ? "rounded-full aspect-square px-0 py-0 min-w-[24px]" : "",
        isIconOnly ? "inline-flex items-center justify-center" : "",
        className
      )}
      aria-label={isIconOnly ? ariaLabel : undefined}
      role="status"
      {...props}
    >
      {leftIcon ? <span className="shrink-0 inline-flex">{leftIcon}</span> : null}
      {content ? <span className={truncate ? "min-w-0" : undefined}>{content}</span> : null}
      {rightIcon ? <span className="shrink-0 inline-flex">{rightIcon}</span> : null}
    </span>
  );
}
