import { Periodicity } from "@domain/entities/periodicity-enum";
import { applyDecorators } from "@nestjs/common";
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty
} from "@nestjs/swagger";

export class DonationDetails {
  @ApiProperty({
    description: "Unique identifier of the donor",
    example: "123e4567-e89b-12d3-a456-426614174000"
  })
  id: string;

  @ApiProperty({
    description: "Donation amount",
    example: 100.0
  })
  amount: number;

  @ApiProperty({
    description: "Donation periodicity (e.g., monthly)",
    example: Periodicity.MONTHLY
  })
  periodicity?: Periodicity;

  @ApiProperty({
    description: "Campaign ID (optional)",
    example: "campaign123"
  })
  campaignId?: string;

  @ApiProperty({
    description: "Unique identifier of the donor",
    example: "123e4567-e89b-12d3-a456-426614174000"
  })
  donorId?: string;

  @ApiProperty({
    description: "Donation creation date",
    example: "2023-01-01T00:00:00Z"
  })
  createdAt: Date;
}

export const FindDonationByIdResponses = applyDecorators(
  ApiOkResponse({
    description: "Donation founded with this id",
    type: DonationDetails
  }),
  ApiNotFoundResponse({
    description: "Not found a donation with this id"
  }),
  ApiOperation({ summary: "Find a donation by ID" })
);
