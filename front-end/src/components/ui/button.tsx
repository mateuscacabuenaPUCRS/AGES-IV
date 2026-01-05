import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import cn from "@/utils/cn";

// eslint-disable-next-line react-refresh/only-export-components
export const buttonVariants = cva(
  "cursor-pointer px-6 py-2 transition-all duration-300 ease-in-out font-semibold rounded-[10px] focus:outline-none focus:ring-offset-2 shadow-sm hover:shadow-md hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none inline-flex items-center justify-center text-sm [&>svg]:shrink-0 [&>svg]:pointer-events-none [&>svg]:h-5 [&>svg]:w-5",
  {
    variants: {
      variant: {
        primary: "bg-[var(--color-components)] text-[var(--color-text-1)]",
        secondary:
          "bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-brand)]",
        tertiary: "bg-[var(--color-text-2)] text-[var(--color-text-1)]",
        destructive: "bg-[var(--color-text-warning)] text-[var(--color-background)]",
        confirm: "bg-[var(--color-text-success)] text-[var(--color-background)]",
        quaternary: "bg-[var(--color-text-special)] text-[var(--color-background)]",
        quinary: "bg-[var(--color-text-special-2)] text-[var(--color-background)]",
        senary:
          "bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-3)]",
        septenary: "bg-[var(--color-text-1)] border-none text-[var(--color-text-3)]",
      },
      size: {
        extraSmall: "h-10 w-32",
        small: "h-12 w-48",
        medium: "h-12 w-60",
        large: "h-12 w-80",
        icon: "h-10 w-10 rounded-full text-gray-900",
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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, desactive = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, desactive, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

export default Button;

/*
COMO USAR??
Escolha o variant, o size e o texto do botão! Nesse molde:
<Button variant="_VARIANTE_" size="_TAMANHO_">_TEXTO_</Button>


EXEMPLOS:
<Button variant="primary" size="medium">Salvar</Button>
<Button variant="outline" size="large">Cancelar</Button>
<Button variant="secondary" size="small"> Cancelar</Button>
<Button variant="destructive" size="large">Excluir</Button>


Se quiser desativar o botão, use a prop `desactive`:
<Button variant="primary" size="large" desactive>

Se precisar, adicione uma função de clique ou outras props de botão:
<Button 
  onClick={() => alert('Clicou!')}
  variant="primary"
  size="medium"
  >Salvar</Button>
*/
