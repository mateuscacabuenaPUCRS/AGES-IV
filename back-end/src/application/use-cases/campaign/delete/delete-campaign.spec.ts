import { ExceptionsAdapter } from "@domain/adapters/exception";
import { CampaignRepository } from "@domain/repositories/campaign";
import { createMockCampaign } from "@test/builders/campaign";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { CampaignRepositoryStub } from "@test/stubs/repositories/campaign";
import { DeleteCampaignUseCase } from "./delete-campaign";

describe("DeleteCampaignUseCase", () => {
  let sut: DeleteCampaignUseCase;
  let campaignRepository: CampaignRepository;
  let exceptionService: ExceptionsAdapter;

  beforeEach(() => {
    campaignRepository = new CampaignRepositoryStub();
    exceptionService = new ExceptionsServiceStub();
    sut = new DeleteCampaignUseCase(campaignRepository, exceptionService);
  });

  it("should throw an error when campaign is not found", async () => {
    const campaignId = "non-existent-id";

    jest.spyOn(exceptionService, "notFound");
    jest.spyOn(campaignRepository, "findById").mockResolvedValue(null);
    jest.spyOn(campaignRepository, "delete");

    await sut.execute(campaignId);

    expect(campaignRepository.findById).toHaveBeenCalledWith(campaignId);
    expect(exceptionService.notFound).toHaveBeenCalledWith({
      message: "Campaign not found"
    });
    expect(campaignRepository.delete).not.toHaveBeenCalled();
  });

  it("should delete campaign successfully when campaign exists", async () => {
    const mockCampaign = createMockCampaign();

    jest.spyOn(exceptionService, "notFound");
    jest.spyOn(campaignRepository, "findById").mockResolvedValue(mockCampaign);
    jest.spyOn(campaignRepository, "delete");

    await sut.execute(mockCampaign.id);

    expect(campaignRepository.findById).toHaveBeenCalledWith(mockCampaign.id);
    expect(campaignRepository.delete).toHaveBeenCalledWith(mockCampaign.id);
    expect(exceptionService.notFound).not.toHaveBeenCalled();
  });
});
