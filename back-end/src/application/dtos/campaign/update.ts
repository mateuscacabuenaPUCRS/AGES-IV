import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiUnauthorizedResponse,
  PartialType
} from "@nestjs/swagger";
import { CreateCampaignDto } from "./create";
import { applyDecorators } from "@nestjs/common";
import { CampaignStatus } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {}

export class UpdateCampaignStatusDto {
  @ApiProperty({
    description: "Campaign status",
    example: CampaignStatus.ACTIVE,
    enum: CampaignStatus
  })
  @IsNotEmpty()
  @IsEnum(CampaignStatus)
  status: CampaignStatus;
}

export const UpdateCampaignResponses = applyDecorators(
  ApiNoContentResponse({
    description: "Campaign updated successfully"
  }),
  ApiNotFoundResponse({
    description: "Campaign not found with this id"
  }),
  ApiUnauthorizedResponse({
    description: "Unauthorized - Invalid or missing token"
  }),
  ApiOperation({ summary: "Update a campaign by ID" })
);

export const UpdateCampaignStatusResponses = applyDecorators(
  ApiNoContentResponse({
    description: "Campaign status updated successfully"
  }),
  ApiNotFoundResponse({
    description: "Campaign not found with this id"
  }),
  ApiUnauthorizedResponse({
    description: "Unauthorized - Invalid or missing token"
  }),
  ApiOperation({ summary: "Update a campaign status" })
);
