import { applyDecorators } from "@nestjs/common";
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty
} from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SendPasswordResetTokenDTO {
  @ApiProperty({
    description: "User email",
    example: "john.doe@example.com"
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class SendPasswordResetTokenResponse {
  @ApiProperty({
    description: "Unique identifier of the password reset token",
    example: "123e4567-e89b-12d3-a456-426614174000"
  })
  id: string;

  @ApiProperty({
    description: "Full name of the user",
    example: "John Doe"
  })
  fullName: string;

  @ApiProperty({
    description: "Email of the user",
    example: "john.doe@example.com"
  })
  email: string;
}

export const SendPasswordResetTokenResponses = applyDecorators(
  ApiOkResponse({
    description: "Password reset token sent successfully",
    type: SendPasswordResetTokenResponse
  }),
  ApiNotFoundResponse({
    description: "User not found"
  }),
  ApiOperation({ summary: "Send a password reset token" })
);
