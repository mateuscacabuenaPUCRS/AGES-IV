import { Injectable } from "@nestjs/common";
import { MetricsRepository } from "@domain/repositories/metrics";
import { GetMetricsResponseDTO } from "@application/dtos/metrics/get-metrics";

@Injectable()
export class GetMetricsUseCase {
  constructor(private readonly metricsRepository: MetricsRepository) {}

  async execute(): Promise<GetMetricsResponseDTO> {
    return await this.metricsRepository.getMetrics();
  }
}
