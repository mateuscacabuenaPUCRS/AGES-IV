import { GetSocialMetricsResponseDTO } from "@application/dtos/metrics/get-social-metrics";

export abstract class SocialMetricsRepository {
  abstract getSocialMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<GetSocialMetricsResponseDTO>;
}
