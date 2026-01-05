import { ApiOkResponse, ApiOperation, ApiProperty } from "@nestjs/swagger";
import { PaginationEntityDTO } from "../utils/pagination";
import { DonationDetails } from "./find-by-id";
import { applyDecorators } from "@nestjs/common";

export class FindAllDonationsResponse extends PaginationEntityDTO {
  @ApiProperty({
    description: "Donation",
    type: [DonationDetails]
  })
  data: DonationDetails[];
}

export const FindAllDonationsResponses = applyDecorators(
  ApiOkResponse({
    description: "All donations",
    type: FindAllDonationsResponse
  }),
  ApiOperation({ summary: "Find all donations" })
);
