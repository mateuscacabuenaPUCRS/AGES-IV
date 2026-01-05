import {
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  PrismaHealthIndicator,
  HealthCheckResult,
  HealthCheck
} from "@nestjs/terminus";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@infra/config/prisma";
import { HealthError, HealthReport } from "@domain/adapters/health";

@Injectable()
export class HealthUseCase {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly prismaService: PrismaService,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator
  ) {}

  @HealthCheck()
  async execute(): Promise<HealthReport> {
    try {
      const result: HealthCheckResult = await this.health.check([
        () =>
          this.http.pingCheck("http", "https://www.google.com", {
            timeout: 3000
          }),
        () => this.prismaHealth.pingCheck("database", this.prismaService),
        () => this.memory.checkHeap("memory_heap", 300 * 1024 * 1024),
        () => this.memory.checkRSS("memory_rss", 512 * 1024 * 1024),
        () =>
          this.disk.checkStorage("storage", {
            thresholdPercent: 0.85,
            path: "/"
          })
      ]);

      return {
        status: result.status,
        info: result.info,
        error: result.error,
        details: result.details,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      const healthError = error as HealthError;
      return {
        status: "error",
        error: healthError.response,
        timestamp: new Date().toISOString()
      };
    }
  }
}
