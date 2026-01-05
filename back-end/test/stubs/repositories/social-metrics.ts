import { SocialMetricsRepository } from "@domain/repositories/social-metrics";
import { GetSocialMetricsResponseDTO } from "@application/dtos/metrics/get-social-metrics";

export class SocialMetricsRepositoryStub implements SocialMetricsRepository {
  async getSocialMetrics(): Promise<GetSocialMetricsResponseDTO> {
    return {
      genderDistribution: [
        { gender: "male", count: 120 },
        { gender: "female", count: 150 },
        { gender: "other", count: 10 }
      ],
      ageDistribution: [
        { ageRange: "18-25", count: 50 },
        { ageRange: "26-35", count: 80 },
        { ageRange: "36-50", count: 90 },
        { ageRange: "50+", count: 60 }
      ]
    };
  }
}
