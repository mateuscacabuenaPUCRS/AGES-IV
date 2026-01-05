import { GetMetricsUseCase } from "./get-metrics";
import { MetricsRepository } from "@domain/repositories/metrics";
import {
  GetMetricsResponseDTO,
  PeriodMetricsDTO
} from "@application/dtos/metrics/get-metrics";

describe("GetMetricsUseCase", () => {
  let getMetricsUseCase: GetMetricsUseCase;
  let metricsRepository: MetricsRepository;

  const mockMetrics30Days: PeriodMetricsDTO = {
    total_raised: 1000,
    new_donors: 10,
    recurring_donations: 5,
    total_donations: 15,
    average_ticket: 66.66
  };

  const mockMetrics365Days: PeriodMetricsDTO = {
    total_raised: 30000,
    new_donors: 200,
    recurring_donations: 100,
    total_donations: 350,
    average_ticket: 85.71
  };

  const mockResponse: GetMetricsResponseDTO = {
    last_30_days: mockMetrics30Days,
    last_365_days: mockMetrics365Days
  };

  beforeEach(() => {
    metricsRepository = {
      getMetrics: jest.fn().mockResolvedValue(mockResponse)
    } as unknown as MetricsRepository;

    getMetricsUseCase = new GetMetricsUseCase(metricsRepository);
  });

  it("should return metrics for last 30 and 365 days", async () => {
    const result = await getMetricsUseCase.execute();

    expect(result).toEqual(mockResponse);
    expect(metricsRepository.getMetrics).toHaveBeenCalledTimes(1);
  });
});
