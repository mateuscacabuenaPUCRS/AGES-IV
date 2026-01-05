import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const progressVariants = cva("relative w-full overflow-hidden rounded-full bg-[#64748B33]", {
  variants: {
    size: {
      small: "h-1",
      medium: "h-2",
      large: "h-4",
      full: "h-4 w-full",
    },
  },
  defaultVariants: {
    size: "full",
  },
});

const indicatorVariants = cva("h-full w-full flex-1 transition-all rounded-full", {
  variants: {
    variant: {
      blue: "bg-[linear-gradient(90deg,#026E98,#005172)]",
      lightBlue: "bg-[var(--color-brand-light)]",
      cian: "bg-[var(--color-components-2)]",
    },
  },
  defaultVariants: {
    variant: "blue",
  },
});

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants>,
    VariantProps<typeof indicatorVariants> {}

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value, size, variant, ...props }, ref) => (
    <ProgressPrimitive.Root
      ref={ref}
      data-slot="progress"
      className={cn(progressVariants({ size, className }))}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(indicatorVariants({ variant }))}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };

/*
COMO USAR ??
Para usar a barra de progresso, tu passa um valor (value) que representa a 
porcentagem de preenchimento (de 0 a 100). Nesse Molde:

<Progress value={_VALOR_} variant="_VARIANTE_" size="_TAMANHO_" />

EXEMPLOS:
<Progress value={75} />
<Progress value={30} variant="blue" size="small" />
<Progress value={90} variant="lightBlue" size="large" />

Se precisar botar mais coisa como uma margem, tu pode usar a prop className:
<Progress value={50} className="mt-4" />
*/
