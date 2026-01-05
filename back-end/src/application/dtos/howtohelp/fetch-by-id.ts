import { applyDecorators } from "@nestjs/common";
import {
  ApiProperty,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiOperation
} from "@nestjs/swagger";

export class HowToHelpDetails {
  @ApiProperty({
    description: "How to help ID",
    example: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6"
  })
  id: string;

  @ApiProperty({
    description: "Title of how to help",
    example: "Support Our Cause"
  })
  title: string;

  @ApiProperty({
    description: "Description of how to help",
    example: "You can support us by volunteering or donating."
  })
  description: string;

  @ApiProperty({
    description: "Last updated at",
    example: "2024-01-01T12:00:00Z"
  })
  updatedAt: Date;
}

export const FetchHowToHelpByIdResponses = applyDecorators(
  ApiOkResponse({
    description: "How to help entry found by ID",
    type: HowToHelpDetails
  }),
  ApiNotFoundResponse({
    description: "No how to help entry found with this ID"
  }),
  ApiOperation({ summary: "Fetch a how to help entry by ID" })
);
