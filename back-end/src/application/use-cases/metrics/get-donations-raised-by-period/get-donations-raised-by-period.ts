import {
  DonationsRaisedByPeriodResponse,
  GetDonationsRaisedByPeriodDTO
} from "@application/dtos/metrics/get-donations-raised-by-period";
import { MetricsRepository } from "@domain/repositories/metrics";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class GetDonationsRaisedByPeriodUseCase {
  constructor(
    private readonly donationsRaisedByPeriodRepository: MetricsRepository
  ) {}

  async execute({
    startDate,
    endDate
  }: GetDonationsRaisedByPeriodDTO): Promise<DonationsRaisedByPeriodResponse> {
    if (startDate > endDate) {
      throw new BadRequestException("Start date must be before end date");
    }

    const donationsRaisedByPeriod =
      await this.donationsRaisedByPeriodRepository.findDonationsRaisedByPeriod(
        startDate,
        endDate
      );

    return {
      rangeDate: donationsRaisedByPeriod.rangeDate,
      daily: donationsRaisedByPeriod?.daily,
      weekly: donationsRaisedByPeriod?.weekly,
      monthly: donationsRaisedByPeriod?.monthly
    };
  }
}
