import { Test, TestingModule } from "@nestjs/testing";
import {
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  PrismaHealthIndicator,
  HealthCheckResult
} from "@nestjs/terminus";
import { PrismaService } from "@infra/config/prisma";
import { HealthReport } from "@domain/adapters/health";
import { HealthUseCase } from "./health";

describe("HealthUseCase", () => {
  let useCase: HealthUseCase;

  const mockHealthCheckService = { check: jest.fn() };
  const mockHttp = { pingCheck: jest.fn() };
  const mockMemory = { checkHeap: jest.fn(), checkRSS: jest.fn() };
  const mockDisk = { checkStorage: jest.fn() };
  const mockPrismaHealth = { pingCheck: jest.fn() };
  const mockPrismaService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthUseCase,
        { provide: HealthCheckService, useValue: mockHealthCheckService },
        { provide: HttpHealthIndicator, useValue: mockHttp },
        { provide: MemoryHealthIndicator, useValue: mockMemory },
        { provide: DiskHealthIndicator, useValue: mockDisk },
        { provide: PrismaHealthIndicator, useValue: mockPrismaHealth },
        { provide: PrismaService, useValue: mockPrismaService }
      ]
    }).compile();

    useCase = module.get<HealthUseCase>(HealthUseCase);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should return a successful health report", async () => {
    const mockResult: HealthCheckResult = {
      status: "ok",
      info: { test: { status: "up" } },
      error: {},
      details: {}
    };

    mockHealthCheckService.check.mockResolvedValue(mockResult);

    const report: HealthReport = await useCase.execute();

    expect(report.status).toBe("ok");
    expect(report.info).toHaveProperty("test");
    expect(report.timestamp).toBeDefined();
  });

  it("should return an error report when health check fails", async () => {
    const error = {
      response: { database: { status: "down", message: "DB not reachable" } }
    };
    mockHealthCheckService.check.mockRejectedValue(error);

    const report: HealthReport = await useCase.execute();

    expect(report.status).toBe("error");
    expect(report.error).toHaveProperty("database");
    expect(report.timestamp).toBeDefined();
  });
});
