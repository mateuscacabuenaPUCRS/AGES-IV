import { applyDecorators } from "@nestjs/common";
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty
} from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateHowToHelpDTO {
  @ApiProperty({ example: "Updated description for how to help." })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export const UpdateHowToHelpResponses = applyDecorators(
  ApiOkResponse({
    description: "How to help updated successfully"
  }),
  ApiNotFoundResponse({
    description: "How to help not found"
  }),
  ApiOperation({ summary: "Update a how to help by ID" })
);
