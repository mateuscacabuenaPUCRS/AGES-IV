import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiProperty } from "@nestjs/swagger";

export interface GetMetricsRequestDTO {
  periodInDays: number;
}

export class PeriodMetricsDTO {
  @ApiProperty({ example: 1000 })
  total_raised: number;

  @ApiProperty({ example: 10 })
  new_donors: number;

  @ApiProperty({ example: 5 })
  recurring_donations: number;

  @ApiProperty({ example: 15 })
  total_donations: number;

  @ApiProperty({ example: 66.66 })
  average_ticket: number;
}

export class GetMetricsResponseDTO {
  @ApiProperty({ type: PeriodMetricsDTO })
  last_30_days: PeriodMetricsDTO;

  @ApiProperty({ type: PeriodMetricsDTO })
  last_365_days: PeriodMetricsDTO;
}

export const FindGlobalMetricsResponse = applyDecorators(
  ApiOkResponse({
    description: "Global metrics for dashboard",
    type: GetMetricsResponseDTO
  }),
  ApiOperation({ summary: "Get global metrics for dashboard" })
);
