import { Gender } from "@domain/entities/gender-enum";
import { applyDecorators } from "@nestjs/common";
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty
} from "@nestjs/swagger";

export class DonorDetails {
  @ApiProperty({
    description: "Unique identifier of the donor",
    example: "123e4567-e89b-12d3-a456-426614174000"
  })
  id: string;

  @ApiProperty({
    description: "Email address of the donor",
    example: "joao.silva@email.com"
  })
  email: string;

  @ApiProperty({
    description: "Full name of the donor",
    example: "João Silva Santos"
  })
  fullName: string;

  @ApiProperty({
    description: "Date of birth of the donor",
    example: "1990-05-15"
  })
  birthDate: Date;

  @ApiProperty({
    description: "Gender of the donor",
    example: "MALE"
  })
  gender: Gender;

  @ApiProperty({
    description: "Phone number of the donor",
    example: "(11) 99999-9999"
  })
  phone: string;

  @ApiProperty({
    description: "Image URL of the donor",
    example: "https://example.com/image.jpg"
  })
  imageUrl: string;

  @ApiProperty({
    description:
      "CPF (Brazilian individual taxpayer registration) of the donor",
    example: "123.456.789-00"
  })
  cpf: string;

  @ApiProperty({
    description: "Donor created at",
    example: "2025-01-01"
  })
  createdAt: Date;

  @ApiProperty({
    description: "Total amount donated by the donor",
    example: 1500.75
  })
  totalDonated: number;
}

export const FindDonorByIdResponses = applyDecorators(
  ApiOkResponse({
    description: "Donor founded with this id",
    type: DonorDetails
  }),
  ApiNotFoundResponse({
    description: "Not found a donor with this id"
  }),
  ApiOperation({ summary: "Find a donor by ID" })
);
