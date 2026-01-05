import { ApiOkResponse, ApiOperation, ApiProperty } from "@nestjs/swagger";
import { PaginationEntityDTO } from "../utils/pagination";
import { NewsDetails } from "./find-by-id";
import { applyDecorators } from "@nestjs/common";

export class FindAllNewsDto extends PaginationEntityDTO {
  @ApiProperty({
    description: "News",
    type: [NewsDetails]
  })
  data: NewsDetails[];
}

export const FindAllNewsResponses = applyDecorators(
  ApiOkResponse({
    description: "All news items",
    type: FindAllNewsDto
  }),
  ApiOperation({ summary: "Find all news items" })
);
