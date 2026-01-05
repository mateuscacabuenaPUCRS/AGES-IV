import {
  CampaignDonorDetailsResponse,
  CampaignRepository
} from "@domain/repositories/campaign";
import { CampaignRepositoryStub } from "@test/stubs/repositories/campaign";
import { FindCampaignByDonorIdUseCase } from ".";
import { Decimal } from "@prisma/client/runtime/library";
import { CampaignStatus } from "@prisma/client";

describe("FindCampaignByDonorIdUseCase", () => {
  let sut: FindCampaignByDonorIdUseCase;
  let campaignRepository: CampaignRepository;

  beforeEach(() => {
    campaignRepository = new CampaignRepositoryStub();
    sut = new FindCampaignByDonorIdUseCase(campaignRepository);
  });

  it("should return campaigns paginated for the donor", async () => {
    const donorId = "donor-id";
    const page = 1;
    const pageSize = 10;

    const mockCampaign: CampaignDonorDetailsResponse[] = [
      {
        id: "campaign-id",
        title: "campaign-title",
        description: "campaign-description",
        targetAmount: new Decimal("1000"),
        currentAmount: new Decimal("500"),
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-01-01"),
        status: CampaignStatus.ACTIVE,
        createdBy: "creator-id",
        creatorName: "creator-name",
        imageUrl: "image-url",
        isRoot: false
      }
    ];

    jest.spyOn(campaignRepository, "findByDonorId").mockResolvedValue({
      data: mockCampaign,
      page: 1,
      lastPage: 1,
      total: 0
    });

    const result = await sut.execute(donorId, { page, pageSize });

    expect(campaignRepository.findByDonorId).toHaveBeenCalledWith(donorId, {
      page,
      pageSize
    });

    expect(result).toEqual({
      data: mockCampaign,
      page: 1,
      lastPage: 1,
      total: 0
    });
  });
});
