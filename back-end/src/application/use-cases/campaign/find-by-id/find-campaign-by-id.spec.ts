import { ExceptionsAdapter } from "@domain/adapters/exception";
import { CampaignRepository } from "@domain/repositories/campaign";
import { createMockCampaign } from "@test/builders/campaign";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { CampaignRepositoryStub } from "@test/stubs/repositories/campaign";
import { FindCampaignByIdUseCase } from "./find-campaing-by-id";
import { CampaignStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

describe("FindCampaignByIdUseCase", () => {
  let sut: FindCampaignByIdUseCase;
  let campaignRepository: CampaignRepository;
  let exceptionService: ExceptionsAdapter;

  beforeEach(() => {
    campaignRepository = new CampaignRepositoryStub();
    exceptionService = new ExceptionsServiceStub();
    sut = new FindCampaignByIdUseCase(campaignRepository, exceptionService);
  });

  it("should throw an error when campaign is not found", async () => {
    const campaignId = "non-existent-id";

    jest.spyOn(exceptionService, "notFound");
    jest.spyOn(campaignRepository, "findById").mockResolvedValue(null);

    await sut.execute(campaignId);

    expect(campaignRepository.findById).toHaveBeenCalledWith(campaignId);
    expect(exceptionService.notFound).toHaveBeenCalledWith({
      message: "Campaign not found"
    });
  });

  it("should return campaign details when campaign is found", async () => {
    const mockCampaign = createMockCampaign({
      id: "campaign-123",
      title: "Test Campaign",
      description: "Test Description",
      targetAmount: new Decimal(5000),
      currentAmount: new Decimal(2500),
      imageUrl: "http://example.com/image.jpg",
      status: CampaignStatus.ACTIVE,
      createdBy: "user-123"
    });

    jest.spyOn(exceptionService, "notFound");
    jest.spyOn(campaignRepository, "findById").mockResolvedValue(mockCampaign);

    const result = await sut.execute(mockCampaign.id);

    expect(campaignRepository.findById).toHaveBeenCalledWith(mockCampaign.id);
    expect(result).toEqual({
      id: mockCampaign.id,
      title: mockCampaign.title,
      description: mockCampaign.description,
      imageUrl: mockCampaign.imageUrl,
      createdBy: mockCampaign.createdBy,
      targetAmount: mockCampaign.targetAmount.toNumber(),
      currentAmount: mockCampaign.currentAmount.toNumber(),
      achievementPercentage:
        (mockCampaign.currentAmount.toNumber() /
          mockCampaign.targetAmount.toNumber()) *
        100,
      status: mockCampaign.status,
      isRoot: mockCampaign.isRoot
    });
    expect(exceptionService.notFound).not.toHaveBeenCalled();
  });

  it("should calculate achievement percentage correctly", async () => {
    const mockCampaign = createMockCampaign({
      targetAmount: new Decimal(1000),
      currentAmount: new Decimal(750)
    });

    jest.spyOn(campaignRepository, "findById").mockResolvedValue(mockCampaign);

    const result = await sut.execute(mockCampaign.id);

    expect(
      (result as { achievementPercentage: number })?.achievementPercentage
    ).toBe(75);
  });

  it("should handle zero current amount", async () => {
    const mockCampaign = createMockCampaign({
      targetAmount: new Decimal(1000),
      currentAmount: new Decimal(0)
    });

    jest.spyOn(campaignRepository, "findById").mockResolvedValue(mockCampaign);

    const result = await sut.execute(mockCampaign.id);

    expect(
      (result as { achievementPercentage: number })?.achievementPercentage
    ).toBe(0);
  });

  it("should handle achievement percentage over 100%", async () => {
    const mockCampaign = createMockCampaign({
      targetAmount: new Decimal(1000),
      currentAmount: new Decimal(1500)
    });

    jest.spyOn(campaignRepository, "findById").mockResolvedValue(mockCampaign);

    const result = await sut.execute(mockCampaign.id);

    expect(
      (result as { achievementPercentage: number })?.achievementPercentage
    ).toBe(150);
  });
});
