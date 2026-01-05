import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty
} from "@nestjs/swagger";

export class VerifyCodeDTO {
  @ApiProperty({
    description: "User ID",
    example: "123e4567-e89b-12d3-a456-426614174000"
  })
  userId: string;

  @ApiProperty({
    description: "Token to verify",
    example: "123456"
  })
  token: string;
}

export const VerifyCodeResponses = applyDecorators(
  ApiNoContentResponse({
    description: "Code verified successfully"
  }),
  ApiNotFoundResponse({
    description: "User not found"
  }),
  ApiBadRequestResponse({
    description: "Invalid token"
  }),
  ApiOperation({ summary: "Verify a code" })
);
