import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import cn from "@/utils/cn";

const Accordion = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Root
    ref={ref}
    className={cn(
      "border-[var(--color-border)] rounded-[10px] divide-y divide-[var(--color-border)] divide-white",
      className
    )}
    {...props}
  />
));
Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn(className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const accordionVariants = cva(
  "px-6 py-3 font-semibold transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-brand)] focus-visible:ring-offset-2 shadow-sm inline-flex items-left text-sm select-none",
  {
    variants: {
      variant: {
        primary:
          "text-left bg-[var(--color-components)] text-[var(--color-text-1)] hover:scale-[1.01]",
        secondary:
          "text-left bg-[var(--color-background)] text-[var(--color-components)] hover:scale-[1.01]",
      },
      size: {
        small: "h-12 w-48",
        medium: "h-12 w-60",
        large: "h-12 w-80",
      },
      desactive: {
        true: "opacity-50 pointer-events-none",
        false: "opacity-100 pointer-events-auto",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  }
);

const accordionContentVariants = cva(
  "px-5 py-3 text-sm " +
    "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
  {
    variants: {
      variant: {
        primary: "text-left bg-[var(--color-components)] text-[var(--color-text-1)]",
        secondary: "text-left bg-[var(--color-background)] text-[var(--color-components)]",
      },
      desactive: {
        true: "opacity-50 pointer-events-none",
        false: "opacity-100 pointer-events-auto",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>,
    VariantProps<typeof accordionVariants> {}

const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, variant, size, desactive, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        accordionVariants({ variant, size, desactive }),
        "flex flex-1 items-center justify-between [&[data-state=open]>svg]:rotate-180 transform active:scale-[0.98] transition-transform duration-200 ease-in-out",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-300 ease-in-out" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

interface AccordionContentProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>,
    VariantProps<typeof accordionContentVariants> {}

const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, variant, desactive, onClick, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(accordionContentVariants({ variant, desactive }), className)}
    {...props}
  >
    <div onClick={onClick}>{children}</div>
  </AccordionPrimitive.Content>
));

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
