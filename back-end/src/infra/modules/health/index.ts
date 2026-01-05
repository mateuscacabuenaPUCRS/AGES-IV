import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HttpModule } from "@nestjs/axios";
import { HealthController } from "@infra/controllers/health/health";
import { PrismaService } from "@infra/config/prisma";
import { HealthUseCase } from "@application/use-cases/health/health";
import { PingController } from "@infra/controllers/health/ping";
import { PingUseCase } from "@application/use-cases/health/ping";

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController, PingController],
  providers: [PrismaService, HealthUseCase, PingUseCase]
})
export class HealthModule {}
