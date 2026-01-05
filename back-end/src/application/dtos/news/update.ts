import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  PartialType
} from "@nestjs/swagger";
import { CreateNewsDto } from "./create";
import { applyDecorators } from "@nestjs/common";

export class UpdateNewsDto extends PartialType(CreateNewsDto) {}

export const UpdateNewsResponses = applyDecorators(
  ApiNoContentResponse({
    description: "News updated successfully"
  }),
  ApiNotFoundResponse({
    description: "News not found"
  }),
  ApiOperation({ summary: "Update a news item by ID" })
);
