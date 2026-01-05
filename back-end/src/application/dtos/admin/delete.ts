import { applyDecorators } from "@nestjs/common";
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiOperation
} from "@nestjs/swagger";

export const DeleteAdminResponses = applyDecorators(
  ApiNoContentResponse({
    description: "Admin delete successfully"
  }),
  ApiNotFoundResponse({
    description: "Not found a admin with this id"
  }),
  ApiUnauthorizedResponse({
    description: "Unauthorized - Invalid or missing token"
  }),
  ApiForbiddenResponse({
    description: "Forbidden - Only admins can delete other admins"
  }),
  ApiOperation({ summary: "Delete an administrator by ID" })
);
