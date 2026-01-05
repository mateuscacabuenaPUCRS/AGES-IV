import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiProperty } from "@nestjs/swagger";
import { PaginationEntityDTO } from "../utils/pagination";
import { EventDetails } from "./find-by-id";

export class FindAllEventsResponse extends PaginationEntityDTO {
  @ApiProperty({
    description: "Events",
    type: [EventDetails]
  })
  data: EventDetails[];
}

export const FindAllEventsResponses = applyDecorators(
  ApiOkResponse({
    description: "All events",
    type: FindAllEventsResponse
  }),
  ApiOperation({ summary: "Find all events" })
);
