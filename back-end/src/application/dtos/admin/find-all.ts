import {
  ApiOkResponse,
  ApiProperty,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiOperation
} from "@nestjs/swagger";
import { PaginationEntityDTO } from "../utils/pagination";
import { applyDecorators } from "@nestjs/common";
import { AdminDetails } from "./find-by-id";

export class FindAllAdminsResponse extends PaginationEntityDTO {
  @ApiProperty({
    description: "Admins",
    type: [AdminDetails]
  })
  data: AdminDetails[];
}

export const FindAllAdminsResponses = applyDecorators(
  ApiOkResponse({
    description: "All admins",
    type: FindAllAdminsResponse
  }),
  ApiUnauthorizedResponse({
    description: "Unauthorized - Invalid or missing token"
  }),
  ApiForbiddenResponse({
    description: "Forbidden - Only admins can view admin list"
  }),
  ApiOperation({ summary: "Find all administrators" })
);
