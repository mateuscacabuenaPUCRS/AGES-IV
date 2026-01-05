import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiProperty } from "@nestjs/swagger";
import { PaymentMethod, CampaignStatus } from "@prisma/client";

export class CampaignPaymentMetricsResponse {
  @ApiProperty({
    description: "Payment method used for the transaction",
    enum: PaymentMethod,
    example: "PIX"
  })
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: "Total amount raised through this payment method",
    type: "number",
    format: "double",
    example: 7174.52
  })
  totalAmount: number;

  @ApiProperty({
    description:
      "Total number of confirmed transactions using this payment method",
    type: "integer",
    example: 3
  })
  totalCount: number;
}

export class CampaignMetricsResponse {
  @ApiProperty({
    description: "Unique campaign identifier",
    type: "string",
    format: "uuid",
    example: "cmgcct7vd0015hey5stb9rhwi"
  })
  id: string;

  @ApiProperty({
    description: "Campaign title",
    type: "string",
    example: "Education Infrastructure Fundraising Campaign"
  })
  title: string;

  @ApiProperty({
    description: "Detailed campaign description",
    type: "string",
    example:
      "Campaign focused on raising funds to improve educational infrastructure..."
  })
  description: string;

  @ApiProperty({
    description: "Campaign cover image URL",
    type: "string",
    format: "uri",
    example: "https://example.com/campaign-image.jpg",
    nullable: true
  })
  imageUrl?: string;

  @ApiProperty({
    description: "Campaign fundraising target amount in BRL",
    type: "number",
    format: "double",
    example: 84719.78
  })
  targetAmount: number;

  @ApiProperty({
    description: "Current amount raised by the campaign in BRL",
    type: "number",
    format: "double",
    example: 34799.71
  })
  currentAmount: number;

  @ApiProperty({
    description: "Campaign start date",
    type: "string",
    format: "date-time",
    example: "2024-04-17T00:00:00.000Z"
  })
  startDate: Date;

  @ApiProperty({
    description: "Campaign end date",
    type: "string",
    format: "date-time",
    example: "2025-08-26T00:00:00.000Z"
  })
  endDate: Date;

  @ApiProperty({
    description: "Current campaign status",
    enum: CampaignStatus,
    example: "ACTIVE"
  })
  status: CampaignStatus;

  @ApiProperty({
    description: "Unique identifier of the user who created the campaign",
    type: "string",
    format: "uuid",
    example: "cmgcct7v1000ahey568r2rdzw"
  })
  createdBy: string;

  @ApiProperty({
    description: "Performance comparison between payment methods",
    type: [CampaignPaymentMetricsResponse],
    example: [
      {
        paymentMethod: "PIX",
        totalAmount: 7174.52,
        totalCount: 3
      },
      {
        paymentMethod: "BANK_SLIP",
        totalAmount: 1891.04,
        totalCount: 1
      }
    ]
  })
  paymentComparison: CampaignPaymentMetricsResponse[];
}

export const CampaignPaymentMetricsResponses = applyDecorators(
  ApiOkResponse({
    description: "Campaign metrics with payment method performance analysis",
    type: CampaignMetricsResponse
  }),
  ApiOperation({ summary: "Get campaign metrics" })
);
