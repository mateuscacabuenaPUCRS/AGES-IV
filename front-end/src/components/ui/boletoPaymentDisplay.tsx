import { useState } from "react";
import { Copy, Check } from "lucide-react";
import Button from "./button";

interface BoletoPaymentDisplayProps {
  boletoCode: string;
  barcodeImageUrl: string;
}

const BoletoPaymentDisplay = ({ boletoCode, barcodeImageUrl }: BoletoPaymentDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(boletoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    alert("Iniciando download do boleto em PDF...");
  };

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="font-semibold text-gray-700">Pague com o código de barras abaixo</p>

      <img
        src={barcodeImageUrl}
        alt="Código de barras do boleto"
        className="w-full h-20 object-contain"
      />

      <p className="text-sm text-gray-600">Ou copie o código e pague no seu app de banco:</p>

      <div className="w-full p-2 border rounded-lg bg-gray-50 flex items-center gap-2">
        <p className="flex-grow text-left text-xs text-gray-500 truncate font-mono">{boletoCode}</p>
        <Button size="icon" variant="secondary" onClick={handleCopy}>
          {copied ? <Check className="text-green-500" /> : <Copy />}
        </Button>
      </div>

      <Button variant="secondary" size="small" onClick={handleExport} className="w-auto px-4 mt-2">
        Exportar boleto
      </Button>
    </div>
  );
};

export default BoletoPaymentDisplay;
