import { PaymentMethod } from "./payment-method-enum";
import { PaymentStatus } from "./payment-status-enum";

export class Payment {
  id: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  amount?: number;
  paidAt?: Date;
  donationId: string;
}
