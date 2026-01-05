import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiProperty } from "@nestjs/swagger";
import { PaymentMethod } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate } from "class-validator";

export class GetDonationByPaymentMethodAndDateDTO {
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

export class RangeDatePaymentMethodAmount {
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

export class DonationByPaymentMethodAmount {
  @ApiProperty({
    description: "Payment method",
    enum: PaymentMethod
  })
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: "Total amount",
    type: Number
  })
  totalAmount: number;

  @ApiProperty({
    description: "Total quantity",
    type: Number
  })
  totalQuantity: number;
}

export class DonationByPaymentMethodAndDateResponse {
  @ApiProperty({
    description: "Range date",
    type: RangeDatePaymentMethodAmount
  })
  rangeDate: RangeDatePaymentMethodAmount;

  @ApiProperty({
    description: "Donation amount by payment method and date",
    type: DonationByPaymentMethodAmount
  })
  data: DonationByPaymentMethodAmount[];
}

export const GetDonationByPaymentMethodAndDateResponses = applyDecorators(
  ApiOkResponse({
    description: "Get donation amount by payment method",
    type: DonationByPaymentMethodAndDateResponse
  }),
  ApiOperation({ summary: "Get donation amount by payment method" })
);
