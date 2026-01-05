import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  PartialType
} from "@nestjs/swagger";
import { CreateDonorDTO } from "./create";
import { applyDecorators } from "@nestjs/common";

export class UpdateDonorDTO extends PartialType(CreateDonorDTO) {}

export const UpdateDonorResponses = applyDecorators(
  ApiNoContentResponse({
    description: "Donor updated successfully"
  }),
  ApiNotFoundResponse({
    description: "Donor not found"
  }),
  ApiOperation({ summary: "Update a donor by ID" })
);

export const UpdateDonorAvatarResponses = applyDecorators(
  ApiNoContentResponse({
    description: "Donor avatar updated successfully"
  }),
  ApiNotFoundResponse({
    description: "Donor not found"
  }),
  ApiOperation({ summary: "Update a donor avatar by ID" })
);
