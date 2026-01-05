import { applyDecorators } from "@nestjs/common";
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty
} from "@nestjs/swagger";
import { IsString, IsNumber } from "class-validator";

export class FindFileByIdResponse {
  @ApiProperty({
    description: "Signed URL to be used on image source tag."
  })
  @IsString()
  url: string;

  @ApiProperty({
    description: "The expiration time (in seconds) for the file URL.",
    example: 3600
  })
  @IsNumber()
  expires: number;
}

export const FindFileByIdResponseDecorator = applyDecorators(
  ApiOkResponse({
    description: "File founded with this id",
    type: FindFileByIdResponse
  }),
  ApiNotFoundResponse({
    description: "Not found a file with this id"
  }),
  ApiOperation({ summary: "Find a file by ID" })
);
