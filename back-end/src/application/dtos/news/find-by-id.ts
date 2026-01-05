import { applyDecorators } from "@nestjs/common";
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty
} from "@nestjs/swagger";

export class NewsDetails {
  @ApiProperty({
    description: "Unique identifier of the news",
    example: "123e4567-e89b-12d3-a456-426614174000"
  })
  id: string;

  @ApiProperty({
    description: "News title",
    example: "Winter Campaign Launched"
  })
  title: string;

  @ApiProperty({
    description: "Full news description",
    example: "Complete description of the news..."
  })
  description: string;

  @ApiProperty({
    description: "Publication date in YYYY-MM-DD format (date-only)",
    example: "2025-08-27"
  })
  date: Date;

  @ApiProperty({
    description: "Location where the news took place",
    example: "Porto Alegre/RS"
  })
  location?: string;

  @ApiProperty({
    description: "External URL related to the news",
    example: "https://example.com/news"
  })
  url?: string;
}

export const FindNewsByIdResponses = applyDecorators(
  ApiOkResponse({
    description: "News found with this id",
    type: NewsDetails
  }),
  ApiNotFoundResponse({
    description: "Not found a news with this id"
  }),
  ApiOperation({ summary: "Find a news by ID" })
);
