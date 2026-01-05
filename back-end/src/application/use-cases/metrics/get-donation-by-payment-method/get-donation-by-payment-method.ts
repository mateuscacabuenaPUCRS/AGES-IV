import {
  GetDonationByPaymentMethodAndDateDTO,
  DonationByPaymentMethodAndDateResponse
} from "@application/dtos/metrics/get-donation-by-payment-method";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { MetricsRepository } from "@domain/repositories/metrics";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GetDonationByPaymentMethodAndDateUseCase {
  constructor(
    private readonly totalDonationAmountByPaymentMethodAndDateRepository: MetricsRepository,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute({
    startDate,
    endDate
  }: GetDonationByPaymentMethodAndDateDTO): Promise<DonationByPaymentMethodAndDateResponse> {
    const totalDonationAmountByPaymentMethodAndDate =
      await this.totalDonationAmountByPaymentMethodAndDateRepository.findByDateDonationByPaymentMethod(
        startDate,
        endDate
      );

    return {
      rangeDate: totalDonationAmountByPaymentMethodAndDate.rangeDate,
      data: totalDonationAmountByPaymentMethodAndDate.totalDonationAmountByPaymentMethodAmount
    };
  }
}
