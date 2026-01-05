import {
  ApiCreatedResponse,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional
} from "@nestjs/swagger";
import { IsString, IsEmail, Length } from "class-validator";
import { applyDecorators } from "@nestjs/common";

export class SendEmailDTO {
  @ApiProperty({ description: "Recipient(s) of the email" })
  @IsEmail()
  to: string;

  @ApiProperty({ description: "Subject of the email" })
  @IsString()
  @Length(1, 998)
  subject: string;

  @ApiPropertyOptional({ description: "HTML content of the email" })
  @IsString()
  html: string;
}

export const SendEmailResponseDecorator = applyDecorators(
  ApiCreatedResponse({
    description: "Email sent successfully"
  }),
  ApiOperation({ summary: "Send an email" })
);
