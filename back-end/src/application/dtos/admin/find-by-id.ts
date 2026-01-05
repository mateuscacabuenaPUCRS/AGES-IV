import { applyDecorators } from "@nestjs/common";
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiOperation
} from "@nestjs/swagger";

export class AdminDetails {
  @ApiProperty({
    description: "Unique identifier of the admin",
    example: "123e4567-e89b-12d3-a456-426614174000"
  })
  id: string;

  @ApiProperty({
    description: "Full name of the admin",
    example: "John Doe"
  })
  fullName: string;

  @ApiProperty({
    description: "Email address of the admin",
    example: "admin@example.com"
  })
  email: string;

  @ApiProperty({
    description: "Image URL of the admin",
    example: "https://example.com/image.jpg"
  })
  imageUrl: string;

  @ApiProperty({
    description: "Is a root admin",
    example: true
  })
  root: boolean;
}

export const FindAdminByIdResponses = applyDecorators(
  ApiOkResponse({
    description: "Admin founded with this id",
    type: AdminDetails
  }),
  ApiNotFoundResponse({
    description: "Not found a admin with this id"
  }),
  ApiUnauthorizedResponse({
    description: "Unauthorized - Invalid or missing token"
  }),
  ApiForbiddenResponse({
    description: "Forbidden - Only admins can view admin details"
  }),
  ApiOperation({ summary: "Find an administrator by ID" })
);
