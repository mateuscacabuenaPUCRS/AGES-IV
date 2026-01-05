import {
  ApiCreatedResponse,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional
} from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsDate
} from "class-validator";
import { Type } from "class-transformer";
import { applyDecorators } from "@nestjs/common";

export class CreateNewsDto {
  @ApiProperty({
    description: "News title (minimum 3 and maximum 128 characters)",
    example: "Winter Campaign Launched"
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(128)
  title: string;

  @ApiProperty({
    description: "Full news description (maximum 2048 characters)",
    example: "Complete description of the news..."
  })
  @IsString()
  @MinLength(3)
  @MaxLength(2048)
  description: string;

  @ApiPropertyOptional({
    description: "Publication date in YYYY-MM-DD format (date-only)",
    example: "2025-08-27"
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @ApiPropertyOptional({
    description: "Location where the news took place",
    example: "Porto Alegre/RS"
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  location?: string;

  @ApiPropertyOptional({
    description: "External URL related to the news",
    example: "https://example.com/news"
  })
  @IsOptional()
  @IsUrl({ require_protocol: true, require_tld: true })
  url?: string;
}
export const CreateNewsResponses = applyDecorators(
  ApiCreatedResponse({
    description: "News created successfully"
  }),
  ApiOperation({ summary: "Create a News" })
);
