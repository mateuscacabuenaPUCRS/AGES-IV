import { PeriodMetricsDTO } from "@application/dtos/metrics/get-metrics";
import { faker } from "@faker-js/faker";

export const createMockPeriodMetrics = (
  override: Partial<PeriodMetricsDTO> = {}
): PeriodMetricsDTO => ({
  total_raised: faker.number.float({
    min: 1000,
    max: 10000,
    fractionDigits: 2
  }),
  new_donors: faker.number.int({ min: 1, max: 100 }),
  recurring_donations: faker.number.int({ min: 1, max: 50 }),
  total_donations: faker.number.int({ min: 1, max: 200 }),
  average_ticket: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
  ...override
});
