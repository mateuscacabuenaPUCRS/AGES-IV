import { applyDecorators } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateFileResponse {
  @ApiProperty({
    description: "The key (filename or path) of the file in S3 storage."
  })
  @IsString()
  key: string;

  @ApiProperty({ description: "The public URL of the uploaded file." })
  @IsString()
  url: string;

  @ApiProperty({ description: "The MIME type of the file." })
  @IsString()
  contentType: string;

  @ApiProperty({ description: "The size of the file in bytes." })
  @IsNumber()
  size: number;
}

export class CreateFileDTO {
  @ApiProperty({
    description: "The file buffer containing the file data."
  })
  buffer: Buffer;

  @ApiProperty({
    description: "The MIME type of the uploaded file."
  })
  @IsString()
  mimetype: string;

  @ApiProperty({
    description: "The original name of the uploaded file."
  })
  @IsString()
  originalname: string;
}

export const CreateFileResponses = applyDecorators(
  ApiCreatedResponse({ description: "File created successfully" }),
  ApiOperation({ summary: "Upload a file" })
);
