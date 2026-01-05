import { applyDecorators } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiProperty,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { CampaignStatus } from "@prisma/client";

import {
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsUrl,
  Min,
  Max,
  IsNotEmpty,
  IsEnum,
  IsDate
} from "class-validator";
import { Type } from "class-transformer";

export class CreateCampaignDto {
  @ApiProperty({
    description: "Campaign title",
    example: "Campaign good cause"
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "Campaign description",
    example: "Campaign for a good cause"
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: "Target amount to be raised (in BRL)",
    example: 5000,
    minimum: 0.01,
    maximum: 9999999999.99
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Min(0.01)
  @Max(9999999999.99)
  @IsNotEmpty()
  targetAmount: number;

  @ApiProperty({
    description: "Campaign start date",
    example: new Date("2025-01-15"),
    required: false
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiProperty({
    description: "Campaign end date",
    example: new Date("2025-12-31"),
    required: false
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiProperty({
    description: "Campaign image URL",
    example: "https://example.com/campaign-image.jpg",
    required: false
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({
    description: "Campaign status",
    example: CampaignStatus.PENDING,
    required: false
  })
  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @ApiProperty({
    description: "User ID responsible for creating the campaign",
    example: "cm1a2b3c4d5e6f7g8h9i0j1k",
    required: true
  })
  @IsNotEmpty()
  @IsString()
  createdBy: string;
}

export const CreateCampaignResponses = applyDecorators(
  ApiCreatedResponse({
    description: "Campaign created successfully"
  }),
  ApiUnauthorizedResponse({
    description: "Unauthorized - Invalid or missing token"
  }),
  ApiOperation({ summary: "Create a new campaign" })
);
