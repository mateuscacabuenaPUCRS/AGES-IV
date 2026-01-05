import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  PartialType,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiOperation
} from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";
import { CreateAdminDto } from "./create";

export class UpdateAdminDto extends PartialType(CreateAdminDto) {}

export const UpdateAdminResponses = applyDecorators(
  ApiNoContentResponse({
    description: "Admin updated successfully"
  }),
  ApiNotFoundResponse({
    description: "Admin not found"
  }),
  ApiUnauthorizedResponse({
    description: "Unauthorized - Invalid or missing token"
  }),
  ApiForbiddenResponse({
    description: "Forbidden - Only admins can update other admins"
  }),
  ApiOperation({ summary: "Update an administrator by ID" })
);
