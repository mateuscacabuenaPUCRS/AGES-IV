import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full px-3 py-2 text-base md:text-sm",
          "bg-white text-black placeholder:text-gray-400",
          "border border-gray-300 shadow-sm",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "rounded-lg",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
