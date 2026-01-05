import { HealthIndicatorResult } from "@nestjs/terminus";

export interface HealthReport {
  status: string;
  info?: Record<string, HealthIndicatorResult>;
  error?: Record<string, HealthIndicatorResult>;
  details?: Record<string, HealthIndicatorResult>;
  timestamp: string;
}

export interface HealthError {
  response?: Record<string, HealthIndicatorResult>;
}
