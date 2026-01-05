import { ExceptionsAdapter } from "@domain/adapters/exception";
import { CampaignRepository } from "@domain/repositories/campaign";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { CampaignRepositoryStub } from "@test/stubs/repositories/campaign";
import { CreateCampaignUseCase } from "./create-campaign";

describe("CreateCampaignUseCase", () => {
  let sut: CreateCampaignUseCase;
  let campaignRepository: CampaignRepository;
  let exceptionService: ExceptionsAdapter;

  beforeEach(() => {
    campaignRepository = new CampaignRepositoryStub();
    exceptionService = new ExceptionsServiceStub();
    sut = new CreateCampaignUseCase(campaignRepository, exceptionService);
  });

  it("should throw error when start date is not a valid Date object", async () => {
    jest.spyOn(exceptionService, "badRequest");

    await sut.execute({
      title: "Test Campaign",
      description: "Test Description",
      targetAmount: 1000,
      startDate: "invalid-date" as unknown as Date,
      endDate: new Date("2025-12-31"),
      imageUrl: "http://example.com/image.jpg",
      createdBy: "user-id"
    });

    expect(exceptionService.badRequest).toHaveBeenCalledWith({
      message: "Start date must be a valid Date object"
    });
  });

  it("should throw error when end date is not a valid Date object", async () => {
    jest.spyOn(exceptionService, "badRequest");

    await sut.execute({
      title: "Test Campaign",
      description: "Test Description",
      targetAmount: 1000,
      startDate: new Date("2025-10-01"),
      endDate: "invalid-date" as unknown as Date,
      imageUrl: "http://example.com/image.jpg",
      createdBy: "user-id"
    });

    expect(exceptionService.badRequest).toHaveBeenCalledWith({
      message: "End date must be a valid Date object"
    });
  });

  it("should throw error when start date is in the past", async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    jest.spyOn(exceptionService, "badRequest");

    await sut.execute({
      title: "Test Campaign",
      description: "Test Description",
      targetAmount: 1000,
      startDate: pastDate,
      endDate: new Date("2025-12-31"),
      imageUrl: "http://example.com/image.jpg",
      createdBy: "user-id"
    });

    expect(exceptionService.badRequest).toHaveBeenCalledWith({
      message: "Campaign starting date must be in the future"
    });
  });

  it("should throw error when end date is before or equal to start date", async () => {
    const startDate = new Date("2025-12-01");
    const endDate = new Date("2025-11-30");

    jest.spyOn(exceptionService, "badRequest");

    await sut.execute({
      title: "Test Campaign",
      description: "Test Description",
      targetAmount: 1000,
      startDate,
      endDate,
      imageUrl: "http://example.com/image.jpg",
      createdBy: "user-id"
    });

    expect(exceptionService.badRequest).toHaveBeenCalledWith({
      message: "Campaign ending date must be after the starting date"
    });
  });

  it("should throw error when target amount is less than or equal to 0", async () => {
    jest.spyOn(exceptionService, "badRequest");

    await sut.execute({
      title: "Test Campaign",
      description: "Test Description",
      targetAmount: 0,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
      imageUrl: "http://example.com/image.jpg",
      createdBy: "user-id"
    });

    expect(exceptionService.badRequest).toHaveBeenCalledWith({
      message: "Target amount must be greater than 0"
    });
  });

  it("should throw error when target amount is negative", async () => {
    jest.spyOn(exceptionService, "badRequest");

    await sut.execute({
      title: "Test Campaign",
      description: "Test Description",
      targetAmount: -100,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
      imageUrl: "http://example.com/image.jpg",
      createdBy: "user-id"
    });

    expect(exceptionService.badRequest).toHaveBeenCalledWith({
      message: "Target amount must be greater than 0"
    });
  });

  it("should create campaign successfully with valid data", async () => {
    const campaignData = {
      title: "Test Campaign",
      description: "Test Description",
      targetAmount: 1000,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
      imageUrl: "http://example.com/image.jpg",
      createdBy: "user-id"
    };

    jest.spyOn(campaignRepository, "create");

    await sut.execute(campaignData);

    expect(campaignRepository.create).toHaveBeenCalledWith({
      title: campaignData.title,
      description: campaignData.description,
      targetAmount: campaignData.targetAmount,
      startDate: campaignData.startDate,
      endDate: campaignData.endDate,
      imageUrl: campaignData.imageUrl,
      createdBy: campaignData.createdBy
    });
  });
});
