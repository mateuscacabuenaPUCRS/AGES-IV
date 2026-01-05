import * as React from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/button-shadcn";
import { buttonVariants } from "../button";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

export function PaginationLink({ className, isActive, size, ...props }: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "secondary" : "primary",
          size:
            size === "default"
              ? "medium"
              : size === "sm"
                ? "small"
                : size === "lg"
                  ? "large"
                  : size === "icon"
                    ? "icon"
                    : "medium",
        }),
        className
      )}
      {...props}
    />
  );
}
