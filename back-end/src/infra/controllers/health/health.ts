import { Controller, Get } from "@nestjs/common";
import { HealthCheck } from "@nestjs/terminus";
import { HealthUseCase } from "@application/use-cases/health/health";
import { HealthReport } from "@domain/adapters/health";
import { HealthCheckResponses } from "@application/dtos/health/health";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(private readonly healthUseCase: HealthUseCase) {}

  @Get()
  @HealthCheck()
  @HealthCheckResponses
  async execute(): Promise<HealthReport> {
    return this.healthUseCase.execute();
  }
}
