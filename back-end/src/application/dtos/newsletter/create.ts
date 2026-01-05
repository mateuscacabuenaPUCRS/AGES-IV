import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateNewsletterDto {
  @ApiProperty({
    example: "user@mail.com",
    description: "Email para inscrição na newsletter"
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export interface CreateNewsletterResponse {
  message: string;
}
