import { applyDecorators } from "@nestjs/common";
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty
} from "@nestjs/swagger";
import { CampaignStatus } from "@prisma/client";

export class CampaignDetails {
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
    example: "Campaign to raise money for a good cause"
  })
  description: string;

  @ApiProperty({
    description: "Campaign image URL",
    example: "https://example.com/campaign-image.jpg"
  })
  imageUrl: string;

  @ApiProperty({
    description: "Campaign created by",
    example: "John Doe"
  })
  createdBy: string;

  @ApiProperty({
    description: "Campaign target amount",
    example: 1000
  })
  targetAmount: number;

  @ApiProperty({
    description: "Campaign current amount",
    example: 500
  })
  currentAmount: number;

  @ApiProperty({
    description: "Campaign achievement percentage",
    example: 50
  })
  achievementPercentage: number;

  @ApiProperty({
    description: "Campaign status",
    example: CampaignStatus.ACTIVE
  })
  status: CampaignStatus;

  @ApiProperty({
    description: "Indicates if the campaign is a root campaign",
    example: false
  })
  isRoot: boolean;
}

export const FindCampaignByIdResponses = applyDecorators(
  ApiOkResponse({
    description: "Campaign found with this ID",
    type: CampaignDetails
  }),
  ApiNotFoundResponse({
    description: "No campaign found with this ID"
  }),
  ApiOperation({ summary: "Find a campaign by ID" })
);
