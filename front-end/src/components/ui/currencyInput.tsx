import { Info } from "lucide-react";
import Button from "./button";
import React from "react";
import cn from "@/utils/cn";

interface CurrencyInputProps {
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
}

const CurrencyInput = ({ value, onValueChange, error }: CurrencyInputProps) => {
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    onValueChange(digits);
  };

  const formattedValue = React.useMemo(() => {
    const numberValue = parseInt(value, 10) / 100;
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
    }).format(numberValue || 0);
  }, [value]);

  return (
    <div className="flex flex-col gap-1" data-testid="currency-input">
      <label htmlFor="donation-value" className="text-sm font-medium">
        Digite o valor da sua doação
      </label>
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-[var(--color-components)]">R$</span>
        <input
          id="donation-value"
          type="text"
          inputMode="numeric"
          placeholder="0,00"
          value={formattedValue}
          onChange={handleValueChange}
          className={cn(
            "flex-grow p-2 border rounded-md focus:ring-2 focus:outline-none transition text-lg",
            error
              ? "border-red-500 focus:ring-red-500 text-red-600"
              : "border-[var(--color-border)] focus:ring-[var(--color-text-brand)]"
          )}
        />
        <Button
          variant="secondary"
          size="icon"
          onClick={() =>
            alert(
              "O valor é preenchido automaticamente da direita para a esquerda, começando pelos centavos."
            )
          }
        >
          <Info />
        </Button>
      </div>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CurrencyInput;
