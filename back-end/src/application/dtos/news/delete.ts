import { applyDecorators } from "@nestjs/common";
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation
} from "@nestjs/swagger";

export const DeleteNewsResponses = applyDecorators(
  ApiNoContentResponse({
    description: "News deleted successfully"
  }),
  ApiNotFoundResponse({
    description: "News not found"
  }),
  ApiOperation({ summary: "Delete a news item by ID" })
);
