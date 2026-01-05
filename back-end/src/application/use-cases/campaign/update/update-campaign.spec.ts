import { ExceptionsAdapter } from "@domain/adapters/exception";
import { CampaignRepository } from "@domain/repositories/campaign";
import { createMockCampaign } from "@test/builders/campaign";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { CampaignRepositoryStub } from "@test/stubs/repositories/campaign";
import {
  UpdateCampaignUseCase,
  UpdateCampaignStatusUseCase
} from "./update-campaign";
import { CampaignStatus } from "@prisma/client";

describe("UpdateCampaignUseCase", () => {
  let sut: UpdateCampaignUseCase;
  let campaignRepository: CampaignRepository;
  let exceptionService: ExceptionsAdapter;

  beforeEach(() => {
    campaignRepository = new CampaignRepositoryStub();
    exceptionService = new ExceptionsServiceStub();
    sut = new UpdateCampaignUseCase(campaignRepository, exceptionService);
  });

  it("should throw an error when campaign is not found", async () => {
    const campaignId = "non-existent-id";
    const updateData = {
      title: "Updated Campaign"
    };

    jest.spyOn(exceptionService, "notFound");
    jest.spyOn(campaignRepository, "findById").mockResolvedValue(null);

    await sut.execute(campaignId, updateData);

    expect(campaignRepository.findById).toHaveBeenCalledWith(campaignId);
    expect(exceptionService.notFound).toHaveBeenCalledWith({
      message: "Campaign not found"
    });
  });

  it("should throw error when start date is not a valid Date object", async () => {
    const mockCampaign = createMockCampaign();
    const updateData = {
      startDate: "invalid-date" as unknown as Date
    };

    jest.spyOn(campaignRepository, "findById").mockResolvedValue(mockCampaign);
    jest.spyOn(exceptionService, "badRequest");

    await sut.execute(mockCampaign.id, updateData);

    expect(exceptionService.badRequest).toHaveBeenCalledWith({
      message: "Start date must be a valid Date object"
    });
  });

  it("should throw error when end date is not a valid Date object", async () => {
    const mockCampaign = createMockCampaign();
    const updateData = {
      endDate: "invalid-date" as unknown as Date
    };

    jest.spyOn(campaignRepository, "findById").mockResolvedValue(mockCampaign);
    jest.spyOn(exceptionService, "badRequest");

    await sut.execute(mockCampaign.id, updateData);

    expect(exceptionService.badRequest).toHaveBeenCalledWith({
      message: "End date must be a valid Date object"
    });
  });

  it("should throw error when end date is before or equal to start date", async () => {
    const mockCampaign = createMockCampaign({
      startDate: new Date("2025-01-01")
    });

    const updateData = {
      endDate: new Date("2024-12-31")
    };

    jest.spyOn(campaignRepository, "findById").mockResolvedValue(mockCampaign);
    jest.spyOn(exceptionService, "badRequest");

    await sut.execute(mockCampaign.id, updateData);

    expect(exceptionService.badRequest).toHaveBeenCalledWith({
      message: "Campaign ending date must be after the starting date"
    });
  });

  it("should throw error when end date is before new start date", async () => {
    const mockCampaign = createMockCampaign();
    const updateData = {
      startDate: new Date("2025-12-01"),
      endDate: new Date("2025-11-30")
    };

    jest.spyOn(campaignRepository, "findById").mockResolvedValue(mockCampaign);
    jest.spyOn(exceptionService, "badRequest");

    await sut.execute(mockCampaign.id, updateData);

    expect(exceptionService.badRequest).toHaveBeenCalledWith({
      message: "Campaign ending date must be after the starting date"
    });
  });

  it("should throw error when target amount is less than or equal to 0", async () => {
    const mockCampaign = createMockCampaign();
    const updateData = {
      targetAmount: -100
    };

    jest.spyOn(campaignRepository, "findById").mockResolvedValue(mockCampaign);
    jest.spyOn(exceptionService, "badRequest");

    await sut.execute(mockCampaign.id, updateData);

    expect(exceptionService.badRequest).toHaveBeenCalledWith({
      message: "Target amount must be greater than 0"
    });
  });

  it("should update campaign with partial data", async () => {
    const mockCampaign = createMockCampaign();
    const updateData = {
      title: "Updated Title Only"
    };

    jest.spyOn(campaignRepository, "findById").mockResolvedValue(mockCampaign);
    jest.spyOn(campaignRepository, "update");

    await sut.execute(mockCampaign.id, updateData);

    expect(campaignRepository.update).toHaveBeenCalledWith(mockCampaign.id, {
      title: "Updated Title Only",
      description: undefined,
      imageUrl: undefined,
      targetAmount: undefined,
      currentAmount: undefined,
      startDate: undefined,
      endDate: undefined
    });
  });
});

describe("UpdateCampaignStatusUseCase", () => {
  let sut: UpdateCampaignStatusUseCase;
  let campaignRepository: CampaignRepository;
  let exceptionService: ExceptionsAdapter;

  beforeEach(() => {
    campaignRepository = new CampaignRepositoryStub();
    exceptionService = new ExceptionsServiceStub();
    sut = new UpdateCampaignStatusUseCase(campaignRepository, exceptionService);
  });

  it("should throw error when status is invalid", async () => {
    const mockCampaign = createMockCampaign();
    const updateData = {
      status: "INVALID_STATUS" as unknown as CampaignStatus
    };

    jest.spyOn(campaignRepository, "findById").mockResolvedValue(mockCampaign);
    jest.spyOn(exceptionService, "badRequest");

    await sut.execute(mockCampaign.id, updateData);

    expect(exceptionService.badRequest).toHaveBeenCalledWith({
      message: `Status must be one of: ${Object.values(CampaignStatus).join(", ")}`
    });
  });

  it("should update campaign status successfully", async () => {
    const mockCampaign = createMockCampaign();
    const updateData = {
      status: CampaignStatus.FINISHED
    };

    jest.spyOn(campaignRepository, "findById").mockResolvedValue(mockCampaign);
    jest.spyOn(campaignRepository, "update");

    await sut.execute(mockCampaign.id, updateData);

    expect(campaignRepository.update).toHaveBeenCalledWith(mockCampaign.id, {
      status: CampaignStatus.FINISHED
    });
  });

  it("should handle all valid campaign statuses", async () => {
    const mockCampaign = createMockCampaign();

    for (const status of Object.values(CampaignStatus)) {
      const updateData = { status };

      jest
        .spyOn(campaignRepository, "findById")
        .mockResolvedValue(mockCampaign);
      jest.spyOn(campaignRepository, "update");

      await sut.execute(mockCampaign.id, updateData);

      expect(campaignRepository.update).toHaveBeenCalledWith(mockCampaign.id, {
        status
      });
    }
  });

  it("should not update when status is undefined", async () => {
    const mockCampaign = createMockCampaign();
    const updateData = {
      status: undefined
    };

    jest.spyOn(campaignRepository, "findById").mockResolvedValue(mockCampaign);
    jest.spyOn(campaignRepository, "update");
    jest.spyOn(exceptionService, "badRequest");

    await sut.execute(mockCampaign.id, updateData);

    expect(campaignRepository.update).toHaveBeenCalledWith(mockCampaign.id, {
      status: undefined
    });
    expect(exceptionService.badRequest).not.toHaveBeenCalled();
  });
});
