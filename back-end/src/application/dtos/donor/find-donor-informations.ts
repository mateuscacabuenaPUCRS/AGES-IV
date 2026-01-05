import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiProperty } from "@nestjs/swagger";

export class FindDonorInformationsResponse {
  @ApiProperty({
    description: "Unique identifier of the donor",
    example: "123e4567-e89b-12d3-a456-426614174000"
  })
  id: string;

  @ApiProperty({
    description: "Campaign titles",
    example: ["Campaign 1", "Campaign 2", "Campaign 3"]
  })
  campaignsTitles: string[];

  @ApiProperty({
    description: "Creation date",
    example: new Date()
  })
  createdAt: Date;
}

export const FindDonorInformationsResponses = applyDecorators(
  ApiOkResponse({
    description: "Donor informations found successfully",
    type: FindDonorInformationsResponse
  }),
  ApiOperation({ summary: "Find donor informations" })
);
