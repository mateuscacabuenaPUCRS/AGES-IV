import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate } from "class-validator";
import { RaisedByPeriodDataItem } from "@domain/entities/metrics";

export class GetDonationsRaisedByPeriodDTO {
  @ApiProperty({
    description: "Start date",
    type: Date
  })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: "End date",
    type: Date
  })
  @Type(() => Date)
  @IsDate()
  endDate: Date;
}

export class RangeDate {
  @ApiProperty({
    description: "Start date",
    type: Date
  })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: "End date",
    type: Date
  })
  @Type(() => Date)
  @IsDate()
  endDate: Date;
}

export class RaisedByPeriodDataDTO {
  @ApiProperty({
    description: "Label for the period (date, week range, or month name)",
    type: String,
    examples: {
      daily: {
        summary: "Daily format",
        value: "2025-01-01"
      },
      weekly: {
        summary: "Weekly format",
        value: "Semana 1 (01/01 - 07/01)"
      },
      monthly: {
        summary: "Monthly format",
        value: "2025 - Janeiro"
      }
    }
  })
  label: string;

  @ApiProperty({
    description: "Amount raised in the period",
    type: Number,
    example: 1500.5
  })
  amount: number;
}

export class DailyDonationsResponse {
  @ApiProperty({
    description: "Daily donations data",
    type: [RaisedByPeriodDataDTO],
    example: [
      { label: "2025-01-01", amount: 150 },
      { label: "2025-01-02", amount: 220.5 },
      { label: "2025-01-03", amount: 0 },
      { label: "2025-01-04", amount: 90.75 }
    ]
  })
  data: RaisedByPeriodDataItem[];
}

export class WeeklyDonationsResponse {
  @ApiProperty({
    description: "Weekly donations data",
    type: [RaisedByPeriodDataDTO],
    example: [
      { label: "Semana 1 (01/01 - 07/01)", amount: 1200 },
      { label: "Semana 2 (08/01 - 14/01)", amount: 1800.5 },
      { label: "Semana 3 (15/01 - 21/01)", amount: 0 },
      { label: "Semana 4 (22/01 - 28/01)", amount: 1900.25 }
    ]
  })
  data: RaisedByPeriodDataItem[];
}

export class MonthlyDonationsResponse {
  @ApiProperty({
    description: "Monthly donations data",
    type: [RaisedByPeriodDataDTO],
    example: [
      { label: "2024 - Janeiro", amount: 0 },
      { label: "2024 - Fevereiro", amount: 0 },
      { label: "2025 - Janeiro", amount: 8500 },
      { label: "2025 - Fevereiro", amount: 7200.5 }
    ]
  })
  data: RaisedByPeriodDataItem[];
}

export class DonationsRaisedByPeriodResponse {
  @ApiProperty({
    description: "Date range for the query",
    type: RangeDate,
    example: {
      startDate: "2025-01-01T00:00:00.000Z",
      endDate: "2025-01-15T00:00:00.000Z"
    }
  })
  rangeDate: RangeDate;

  @ApiProperty({
    description:
      "Daily donations data - Only returned when period <= 31 days. Other fields will be undefined.",
    type: DailyDonationsResponse,
    required: false
  })
  daily?: DailyDonationsResponse;

  @ApiProperty({
    description:
      "Weekly donations data - Only returned when period is between 32-93 days. Other fields will be undefined.",
    type: WeeklyDonationsResponse,
    required: false
  })
  weekly?: WeeklyDonationsResponse;

  @ApiProperty({
    description:
      "Monthly donations data - Only returned when period >= 94 days. Other fields will be undefined.",
    type: MonthlyDonationsResponse,
    required: false
  })
  monthly?: MonthlyDonationsResponse;
}

export const GetDonationsRaisedByPeriodResponses = applyDecorators(
  ApiOkResponse({
    description:
      "Get donations raised by period with automatic grouping based on date range. Only one grouping type is returned at a time.",
    type: DonationsRaisedByPeriodResponse,
    example: {
      rangeDate: {
        startDate: "2025-01-01T00:00:00.000Z",
        endDate: "2025-01-15T00:00:00.000Z"
      },
      daily: {
        data: [
          { label: "2025-01-01", amount: 150 },
          { label: "2025-01-02", amount: 220.5 },
          { label: "2025-01-03", amount: 0 },
          { label: "2025-01-04", amount: 90.75 }
        ]
      },
      weekly: {
        data: [
          { label: "Semana 1 (01/01 - 07/01)", amount: 1200 },
          { label: "Semana 2 (08/01 - 14/01)", amount: 1800.5 },
          { label: "Semana 3 (15/01 - 21/01)", amount: 0 },
          { label: "Semana 4 (22/01 - 28/01)", amount: 1900.25 }
        ]
      },
      monthly: {
        data: [
          { label: "2024 - Janeiro", amount: 0 },
          { label: "2024 - Fevereiro", amount: 0 },
          { label: "2025 - Janeiro", amount: 8500 },
          { label: "2025 - Fevereiro", amount: 7200.5 }
        ]
      }
    }
  }),
  ApiOperation({
    summary: "Get donations raised by period"
  })
);
