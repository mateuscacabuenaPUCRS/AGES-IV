import api from "../api";

export const PaymentMethod = {
  PIX: "PIX",
  CREDIT_CARD: "CREDIT_CARD",
  BANK_SLIP: "BANK_SLIP",
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const PaymentMethodLabel: Record<PaymentMethod, string> = {
  PIX: "PIX",
  CREDIT_CARD: "Cartão de Crédito",
  BANK_SLIP: "Boleto",
};

export type DonationsPaymentMethodData = {
  paymentMethod: PaymentMethod;
  totalAmount: number;
  totalQuantity: number;
};

export type DonationsPaymentMethodResponse = {
  rangeDate: {
    startDate: Date;
    endDate: Date;
  };
  data: DonationsPaymentMethodData[];
};

export async function getDonationsPaymentMethod(
  startDate: Date,
  endDate: Date
): Promise<DonationsPaymentMethodResponse> {
  const response = await api.get(`/metrics/donation/payment-method`, {
    params: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
  });
  return {
    rangeDate: {
      startDate: new Date(response.data.rangeDate.startDate),
      endDate: new Date(response.data.rangeDate.endDate),
    },
    data: response.data.data.map((item: DonationsPaymentMethodData) => ({
      paymentMethod: item.paymentMethod,
      totalAmount: item.totalAmount,
      totalQuantity: item.totalQuantity,
    })),
  };
}
