import { applyDecorators } from "@nestjs/common";
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation
} from "@nestjs/swagger";

export const DeleteDonorResponses = applyDecorators(
  ApiNoContentResponse({
    description: "Donor delete successfully"
  }),
  ApiNotFoundResponse({
    description: "Not found a donor with this id"
  }),
  ApiOperation({ summary: "Delete a donor by ID" })
);
