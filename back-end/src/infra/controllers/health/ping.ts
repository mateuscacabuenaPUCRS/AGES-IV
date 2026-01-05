import { PingResponses } from "@application/dtos/health/ping";
import { PingResponse, PingUseCase } from "@application/use-cases/health/ping";
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@Controller("ping")
@ApiTags("Ping")
export class PingController {
  constructor(private readonly pingUseCase: PingUseCase) {}

  @Get()
  @PingResponses
  async execute(): Promise<PingResponse> {
    return this.pingUseCase.execute();
  }
}
