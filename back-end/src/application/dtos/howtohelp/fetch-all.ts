import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { HowToHelpDetails } from "./fetch-by-id";

export class FetchAllHowToHelpDTO {
  id: string;
  title: string;
  description: string;
  updatedAt: Date;
}

export const FetchAllHowToHelpResponses = applyDecorators(
  ApiOkResponse({
    description: "All how to help entries",
    type: [HowToHelpDetails]
  }),
  ApiOperation({ summary: "Fetch all how to help entries" })
);
