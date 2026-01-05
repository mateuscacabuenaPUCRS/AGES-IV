import React from "react";
import Button from "./button";
import Input from "./input";

interface CreditCardFormProps {
  cardNumber: string;
  setCardNumber: (value: string) => void;
  cardName: string;
  setCardName: (value: string) => void;
  expiryDate: string;
  setExpiryDate: (value: string) => void;
  cvv: string;
  setCvv: (value: string) => void;
  disabled?: boolean;
  onSubmit: () => void;
}

const CreditCardForm = ({
  cardNumber,
  setCardNumber,
  cardName,
  setCardName,
  expiryDate,
  setExpiryDate,
  cvv,
  setCvv,
  disabled = false,
  onSubmit,
}: CreditCardFormProps) => {
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formattedValue = value.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(formattedValue);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvv(e.target.value.replace(/\D/g, "").slice(0, 3));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length > 2) {
      setExpiryDate(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setExpiryDate(value);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Número do cartão"
        placeholder="0000 0000 0000 0000"
        value={cardNumber}
        onChange={handleCardNumberChange}
        disabled={disabled}
        fullWidth
      />
      <Input
        label="Nome do titular"
        placeholder="Como impresso no cartão"
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
        disabled={disabled}
        fullWidth
      />

      <div className="flex gap-4 w-full">
        <div className="w-2/3">
          <Input
            label="Vencimento"
            placeholder="MM/AA"
            value={expiryDate}
            onChange={handleExpiryDateChange}
            disabled={disabled}
            fullWidth
          />
        </div>
        <div className="w-1/3">
          <Input
            label="CVV"
            placeholder="123"
            value={cvv}
            onChange={handleCvvChange}
            disabled={disabled}
            fullWidth
          />
        </div>
      </div>

      {!disabled && (
        <Button variant="confirm" size="small" onClick={onSubmit} className="self-end mt-2">
          Confirmar
        </Button>
      )}
    </div>
  );
};

export default CreditCardForm;
