import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiProperty } from "@nestjs/swagger";
import { PaginationEntityDTO } from "../utils/pagination";
import { CampaignDonorDetailsResponse } from "@domain/repositories/campaign";
import { CampaignStatus, Prisma } from "@prisma/client";

class CampaignDonorDetails implements CampaignDonorDetailsResponse {
  @ApiProperty({
    description: "Campaign ID",
    example: "123e4567-e89b-12d3-a456-426614174000"
  })
  id: string;

  @ApiProperty({
    description: "Campaign title",
    example: "Campaign good cause"
  })
  title: string;

  @ApiProperty({
    description: "Campaign description",
    example: "Campaign for a good cause"
  })
  description: string;

  @ApiProperty({
    description: "Campaign target amount",
    example: 1000.0
  })
  targetAmount: Prisma.Decimal;

  @ApiProperty({
    description: "Campaign current amount",
    example: 500.0
  })
  currentAmount: Prisma.Decimal;

  @ApiProperty({
    description: "Campaign image URL",
    example: "https://example.com/campaign-image.jpg"
  })
  imageUrl: string;

  @ApiProperty({
    description: "Campaign start date",
    example: "2025-01-01"
  })
  startDate: Date;

  @ApiProperty({
    description: "Campaign end date",
    example: "2025-01-01"
  })
  endDate: Date;

  @ApiProperty({
    description: "Campaign status",
    example: CampaignStatus.ACTIVE
  })
  status: CampaignStatus;

  @ApiProperty({
    description: "Campaign created by user ID",
    example: "123e4567-e89b-12d3-a456-426614174000"
  })
  createdBy: string;

  @ApiProperty({
    description: "Campaign creator name",
    example: "John Doe"
  })
  creatorName: string;

  @ApiProperty({
    description: "Indicates if the campaign is a root campaign",
    example: false
  })
  isRoot: boolean;
}

class CampaignDonorDetailsResponseDTO extends PaginationEntityDTO {
  @ApiProperty({
    description: "Campaigns",
    type: [CampaignDonorDetails]
  })
  data: CampaignDonorDetails[];
}

export const FindCampaignByDonorIdResponses = applyDecorators(
  ApiOkResponse({
    description: "Campaigns found successfully",
    type: CampaignDonorDetailsResponseDTO
  }),
  ApiOperation({ summary: "Find campaigns by donor ID" })
);
