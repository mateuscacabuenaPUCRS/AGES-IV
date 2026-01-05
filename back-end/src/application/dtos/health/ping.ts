import { applyDecorators } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ApiResponse } from "@nestjs/swagger/dist/decorators/api-response.decorator";

export const PingResponses = applyDecorators(
  ApiResponse({ status: 200, description: "Ping successful" }),
  ApiResponse({ status: 500, description: "Internal server error" }),
  ApiOperation({ summary: "Ping the server to check if it's alive" })
);
