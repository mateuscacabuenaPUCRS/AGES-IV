import { ApiOkResponse, ApiOperation, ApiProperty } from "@nestjs/swagger";
import { PaginationDTO, PaginationEntityDTO } from "../utils/pagination";
import { CampaignDetails } from "./find-by-id";
import { applyDecorators } from "@nestjs/common";
import { CampaignStatus } from "@prisma/client";
import { IsOptional, IsString, IsEnum, IsDate } from "class-validator";
import { Type } from "class-transformer";

export class FindAllCampaignsDTO extends PaginationDTO {
  @ApiProperty({
    description: "Filter by campaign title",
    example: "Christmas Campaign",
    required: false
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: "Filter by campaign start date",
    example: "2025-12-01",
    required: false
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiProperty({
    description: "Filter by campaign status",
    enum: CampaignStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @ApiProperty({
    description: "Filter by root campaigns",
    example: true,
    required: false
  })
  @IsOptional()
  isRoot?: boolean;
}

export class FindAllCampaignsResponse extends PaginationEntityDTO {
  @ApiProperty({
    description: "Campaigns",
    type: [CampaignDetails]
  })
  data: CampaignDetails[];
}

export const FindAllCampaignsResponses = applyDecorators(
  ApiOkResponse({
    description: "All campaigns",
    type: FindAllCampaignsResponse
  }),
  ApiOperation({ summary: "Find all campaigns" })
);
