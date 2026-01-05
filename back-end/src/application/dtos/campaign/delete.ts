import { applyDecorators } from "@nestjs/common";
import {
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";

export const DeleteCampaignResponses = applyDecorators(
  ApiNoContentResponse({
    description: "Campaign deleted successfully"
  }),
  ApiNotFoundResponse({
    description: "Campaign not found with this id"
  }),
  ApiUnauthorizedResponse({
    description: "Unauthorized - Invalid or missing token"
  }),
  ApiForbiddenResponse({
    description: "Forbidden - Only admins can delete campaigns"
  }),
  ApiOperation({ summary: "Delete a campaign by ID" })
);
