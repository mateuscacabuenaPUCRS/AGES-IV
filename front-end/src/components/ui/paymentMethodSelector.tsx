import { QrCode, CreditCard, Barcode } from "lucide-react";
import cn from "@/utils/cn";

const paymentOptions = [
  { id: "Pix", label: "Pix", icon: QrCode },
  { id: "Crédito", label: "Crédito", icon: CreditCard },
  { id: "Boleto", label: "Boleto", icon: Barcode },
];

interface PaymentMethodSelectorProps {
  selectedValue: string;
  onSelect: (value: string) => void;
}

const PaymentMethodSelector = ({ selectedValue, onSelect }: PaymentMethodSelectorProps) => {
  return (
    <div className="flex justify-around items-center gap-4 py-2">
      {paymentOptions.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={cn(
            "flex flex-col items-center justify-center p-4 h-24 w-24 rounded-lg border-2 transition-all duration-200 ease-in-out",
            selectedValue === option.id
              ? "border-blue-800 bg-blue-50 scale-105"
              : "border-gray-300 bg-transparent hover:border-gray-400"
          )}
        >
          <option.icon className="h-8 w-8 text-gray-700 mb-2" />
          <span className="text-sm font-semibold text-gray-800">{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default PaymentMethodSelector;
