import { applyDecorators } from "@nestjs/common";
import {
  ApiQuery,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiBadRequestResponse
} from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Gender } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate } from "class-validator";

export type RawGenderResult = {
  gender: Gender;
  count: number;
};
export type RawAgeResult = {
  age_range: string;
  count: number;
};

export class GenderDistributionDTO {
  @ApiProperty({ example: "MALE" })
  gender: Gender;

  @ApiProperty({ example: 120 })
  count: number;
}

export class GetSocialMetricsDTO {
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

export class AgeDistributionDTO {
  @ApiProperty({ example: "18-25" })
  ageRange: string;

  @ApiProperty({ example: 50 })
  count: number;
}

export class GetSocialMetricsResponseDTO {
  @ApiProperty({ type: [GenderDistributionDTO] })
  genderDistribution: GenderDistributionDTO[];

  @ApiProperty({ type: [AgeDistributionDTO] })
  ageDistribution: AgeDistributionDTO[];
}
export const GetSocialMetricsResponses = applyDecorators(
  ApiQuery({
    name: "startDate",
    required: true,
    example: "2024-01-01",
    description: "Initial date of the interval"
  }),
  ApiQuery({
    name: "endDate",
    required: true,
    example: "2024-12-31",
    description: "Final date of the interval"
  }),

  ApiOkResponse({
    type: GetSocialMetricsResponseDTO,
    description:
      "Gender and age distribution of donors within the specified period"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal error while fetching social distribution"
  }),
  ApiBadRequestResponse({
    description:
      "Bad request. Possible causes: invalid date format, startDate after endDate"
  }),
  ApiOperation({
    summary: "Gender and age distribution of donors within the specified period"
  })
);
