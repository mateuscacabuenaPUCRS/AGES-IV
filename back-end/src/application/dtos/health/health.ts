import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export const HealthCheckResponses = applyDecorators(
  ApiOperation({ summary: "Check system health" }),
  ApiResponse({
    status: 200,
    description: "System is healthy"
  }),
  ApiResponse({
    status: 503,
    description: "System is unhealthy"
  })
);
