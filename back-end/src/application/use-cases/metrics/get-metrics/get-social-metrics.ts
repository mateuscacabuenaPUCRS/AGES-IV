import { Injectable } from "@nestjs/common";
import { MetricsRepository } from "@domain/repositories/metrics";
import { GetSocialMetricsResponseDTO } from "@application/dtos/metrics/get-social-metrics";

@Injectable()
export class GetSocialMetricsUseCase {
  constructor(private readonly metricsRepository: MetricsRepository) {}

  async execute(
    startDate: Date,
    endDate: Date
  ): Promise<GetSocialMetricsResponseDTO> {
    return await this.metricsRepository.getSocialMetrics(startDate, endDate);
  }
}
