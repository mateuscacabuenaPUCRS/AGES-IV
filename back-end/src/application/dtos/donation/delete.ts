import { applyDecorators } from "@nestjs/common";
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation
} from "@nestjs/swagger";

export const DeleteDonationResponses = applyDecorators(
  ApiNoContentResponse({
    description: "Donoation delete successfully"
  }),
  ApiNotFoundResponse({
    description: "Not found a donation with this id"
  }),
  ApiOperation({ summary: "Delete a donation by ID" })
);
