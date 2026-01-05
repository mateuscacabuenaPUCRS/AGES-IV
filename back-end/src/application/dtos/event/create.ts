import { applyDecorators } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength
} from "class-validator";

export class CreateEventDTO {
  @ApiProperty({
    description: "Event title",
    example: "Campanha de Arrecadação de Alimentos"
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty({
    description: "Event description",
    example:
      "Evento para arrecadar alimentos não perecíveis para famílias carentes"
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  @ApiProperty({
    description: "Event location",
    example: "Rua das Flores, 123 - Centro, São Paulo/SP",
    required: true
  })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({
    description: "Event URL",
    example: "https://evento.com.br",
    required: false
  })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiProperty({
    description: "Starting date of th event",
    example: "2025-09-04T02:06:31.250Z"
  })
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  dateStart: Date;

  @ApiProperty({
    description: "Ending date of the event)",
    example: "2025-09-04T02:06:31.250Z"
  })
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  dateEnd: Date;
}

export const CreateEventResponses = applyDecorators(
  ApiCreatedResponse({
    description: "Event created successfully"
  }),
  ApiOperation({ summary: "Create a new event" })
);
