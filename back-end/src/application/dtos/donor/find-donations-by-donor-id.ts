import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiProperty } from "@nestjs/swagger";

class DonationCampaignUserDto {
  @ApiProperty()
  fullName: string;
}

class DonationCampaignDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  targetAmount: string;

  @ApiProperty()
  currentAmount: string;

  @ApiProperty()
  startDate: string;

  @ApiProperty()
  endDate: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty({ type: () => DonationCampaignUserDto })
  user: DonationCampaignUserDto;
}

class DonationPaymentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  paymentMethod: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  amount: string;

  @ApiProperty()
  paidAt: string;

  @ApiProperty()
  donationId: string;
}

export class DonationResultDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: string;

  @ApiProperty({ nullable: true })
  periodicity: string | null;

  @ApiProperty()
  donorId: string;

  @ApiProperty()
  campaignId: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty({ type: () => DonationCampaignDto })
  campaign: DonationCampaignDto;

  @ApiProperty({ type: () => [DonationPaymentDto] })
  payment: DonationPaymentDto[];
}

export const FindDonationsByDonorIdResponses = applyDecorators(
  ApiOkResponse({
    description: "Donations found successfully",
    type: DonationResultDto,
    isArray: true
  }),
  ApiOperation({ summary: "Find donations by donor ID" })
);
