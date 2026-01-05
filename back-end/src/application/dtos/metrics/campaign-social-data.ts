import { Gender } from "@domain/entities/gender-enum";
import { CampaignStatus } from "@prisma/client";
import { applyDecorators } from "@nestjs/common";
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty
} from "@nestjs/swagger";

export class CampaignInfo {
  @ApiProperty({
    description: "Campaign description",
    example: "Campanha de Natal"
  })
  description: string;

  @ApiProperty({
    description: "Target amount for the campaign",
    example: 10000.0
  })
  targetAmount: number;

  @ApiProperty({
    description: "Current amount raised",
    example: 7500.5
  })
  currentAmount: number;

  @ApiProperty({
    description: "Achievement percentage",
    example: 75.005
  })
  percentage: number;

  @ApiProperty({
    description: "Campaign start date",
    example: "2025-08-01"
  })
  startDate: Date;

  @ApiProperty({
    description: "Campaign end date",
    example: "2025-12-25"
  })
  endDate: Date;

  @ApiProperty({
    description: "Campaign image URL",
    example: "https://example.com/campaign.jpg"
  })
  imageUrl: string;

  @ApiProperty({
    description: "Campaign status",
    example: "ACTIVE",
    enum: CampaignStatus
  })
  campaignStatus: CampaignStatus;
}

export class DonorSocialData {
  @ApiProperty({
    description: "Unique identifier of the donor",
    example: "123e4567-e89b-12d3-a456-426614174000"
  })
  id: string;

  @ApiProperty({
    description: "Full name of the donor",
    example: "João Silva Santos"
  })
  fullName: string;

  @ApiProperty({
    description: "Gender of the donor",
    example: "MALE",
    enum: Gender
  })
  gender: Gender;

  @ApiProperty({
    description: "Age range of the donor",
    example: "25-35"
  })
  ageRange: string;
}

export class GenderDistribution {
  @ApiProperty({
    description: "Gender type",
    example: "male"
  })
  gender: string;

  @ApiProperty({
    description: "Count of donors with this gender",
    example: 15
  })
  count: number;
}

export class AgeDistribution {
  @ApiProperty({
    description: "Age range",
    example: "26-35"
  })
  ageRange: string;

  @ApiProperty({
    description: "Count of donors in this age range",
    example: 8
  })
  count: number;
}

export class CampaignSocialDataResponse {
  @ApiProperty({
    description: "Campaign information",
    type: CampaignInfo
  })
  campaign: CampaignInfo;

  @ApiProperty({
    description: "Distribution of donors by gender",
    type: [GenderDistribution]
  })
  genderDistribution: GenderDistribution[];

  @ApiProperty({
    description: "Distribution of donors by age range",
    type: [AgeDistribution]
  })
  ageDistribution: AgeDistribution[];
}

export const GetCampaignSocialDataResponses = applyDecorators(
  ApiOkResponse({
    description: "Social data of donors for the campaign",
    type: CampaignSocialDataResponse
  }),
  ApiNotFoundResponse({
    description: "Campaign not found"
  }),
  ApiOperation({
    summary: "Get social data of donors for a campaign",
    description:
      "Returns demographic information about all donors (including deleted ones) who have donated to a specific campaign"
  })
);
