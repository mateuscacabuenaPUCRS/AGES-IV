import { applyDecorators } from "@nestjs/common";
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty
} from "@nestjs/swagger";

export class DeleteFileResponse {
  @ApiProperty({
    example: true,
    description: "Indicates if the file was deleted successfully"
  })
  deleted: boolean;
}

export const DeleteFileResponseDecorator = applyDecorators(
  ApiNoContentResponse({
    description: "File deleted successfully"
  }),
  ApiNotFoundResponse({
    description: "Not found a file with this id"
  }),
  ApiOperation({ summary: "Delete a file by ID" })
);
