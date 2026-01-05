import { applyDecorators } from "@nestjs/common";
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation
} from "@nestjs/swagger";

export const DeleteEventResponses = applyDecorators(
  ApiNoContentResponse({
    description: "Event deleted successfully"
  }),
  ApiNotFoundResponse({
    description: "Event with this id was not found"
  }),
  ApiOperation({ summary: "Delete an event by ID" })
);
