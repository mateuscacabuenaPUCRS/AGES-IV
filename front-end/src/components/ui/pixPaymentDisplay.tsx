import { useState } from "react";
import { Copy, Check } from "lucide-react";
import Button from "./button";

interface PixPaymentDisplayProps {
  pixCode: string;
  qrCodeImageUrl: string;
}

const PixPaymentDisplay = ({ pixCode, qrCodeImageUrl }: PixPaymentDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="font-semibold text-gray-700">Leia o QR code abaixo</p>

      <img
        src={qrCodeImageUrl}
        alt="QR Code para pagamento Pix"
        className="w-48 h-48 rounded-lg border bg-white p-2"
      />

      <p className="text-sm text-gray-600">Ou copie e pague através do código abaixo:</p>

      <div className="w-full p-2 border rounded-lg bg-gray-50 flex items-center gap-2">
        <p className="flex-grow text-left text-xs text-gray-500 truncate font-mono">{pixCode}</p>
        <Button size="icon" variant="secondary" onClick={handleCopy}>
          {copied ? <Check className="text-green-500" /> : <Copy />}
        </Button>
      </div>
    </div>
  );
};

export default PixPaymentDisplay;
