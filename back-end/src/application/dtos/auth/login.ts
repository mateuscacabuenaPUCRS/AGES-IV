import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiProperty
} from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDTO {
  @ApiProperty({
    description: "User email",
    example: "johndoe@example.com"
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User password",
    example: "Senha@123"
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginResponse {
  @ApiProperty({
    description: "Access token",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoidXNlckBlbWFpbC5jb20iLCJyb2xlIjoiRE9OT1IiLCJpc3MiOiJhcGktcGFvLWRvcy1wb2JyZXMiLCJpYXQiOjE3MDMwMzcwNTYsImV4cCI6MTcwMzEyMzQ1Nn0.signature"
  })
  accessToken: string;
}

export const LoginResponses = applyDecorators(
  ApiCreatedResponse({
    description: "Successfully Login",
    type: LoginResponse
  }),
  ApiBadRequestResponse({
    description: "Invalid Credentials"
  }),
  ApiOperation({ summary: "User login" })
);
