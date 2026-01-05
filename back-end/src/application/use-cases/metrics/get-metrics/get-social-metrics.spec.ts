import { GetSocialMetricsUseCase } from "../../metrics/get-metrics/get-social-metrics";
import { MetricsRepository } from "@domain/repositories/metrics";
import { GetSocialMetricsResponseDTO } from "@application/dtos/metrics/get-social-metrics";
import { Gender } from "@prisma/client";

describe("GetSocialMetricsUseCase", () => {
  let getSocialMetricsUseCase: GetSocialMetricsUseCase;
  let metricsRepository: MetricsRepository;

  const mockResponse: GetSocialMetricsResponseDTO = {
    genderDistribution: [
      {
        gender: Gender.MALE,
        count: 50
      },
      {
        gender: Gender.FEMALE,
        count: 100
      },
      {
        gender: Gender.OTHER,
        count: 10
      }
    ],
    ageDistribution: [
      { ageRange: "18-25", count: 50 },
      { ageRange: "26-35", count: 80 },
      { ageRange: "36-50", count: 90 },
      { ageRange: "50+", count: 60 }
    ]
  };

  function makeMetricsRepository(): MetricsRepository {
    return {
      getSocialMetrics: jest.fn().mockResolvedValue(mockResponse)
    } as unknown as MetricsRepository;
  }

  beforeEach(() => {
    metricsRepository = makeMetricsRepository();
    getSocialMetricsUseCase = new GetSocialMetricsUseCase(metricsRepository);
  });

  it("should return social metrics (gender and age distributions)", async () => {
    const startDate = new Date("2025-01-01");
    const endDate = new Date("2025-12-31");

    const result = await getSocialMetricsUseCase.execute(startDate, endDate);

    expect(result).toEqual(mockResponse);
    expect(metricsRepository.getSocialMetrics).toHaveBeenCalledTimes(1);
    expect(metricsRepository.getSocialMetrics).toHaveBeenCalledWith(
      startDate,
      endDate
    );
  });
});
