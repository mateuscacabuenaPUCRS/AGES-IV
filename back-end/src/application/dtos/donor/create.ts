import { formatCPF, IsCPF } from "@application/dtos/utils/is-cpf";
import { Gender } from "@domain/entities/gender-enum";
import { applyDecorators } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MinLength
} from "class-validator";

export class CreateDonorDTO {
  @ApiProperty({
    description: "Donor email",
    example: "john.doe@example.com"
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Donor password",
    example: "Senha@123"
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    description: "Donor full name",
    example: "John Doe"
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: "Donor birth date",
    example: "2025-12-31"
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  birthDate: Date;

  @ApiProperty({
    description: "Donor gender",
    example: Gender.MALE,
    enum: Object.values(Gender)
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({
    description: "Donor phone",
    example: "+5511999999999"
  })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    description: "Donor CPF",
    example: "12345678900"
  })
  @IsString()
  @IsNotEmpty()
  @IsCPF()
  @Transform(({ value }) => formatCPF(value))
  cpf: string;
}

export const CreateDonorResponses = applyDecorators(
  ApiCreatedResponse({
    description: "Donor created successfully"
  }),
  ApiOperation({ summary: "Create a new donor" })
);
