import { CampaignRepository } from "@domain/repositories/campaign";
import { CampaignRepositoryStub } from "@test/stubs/repositories/campaign";
import { SearchCampaignsUseCase } from "./search-campaigns";
import { PaginatedEntity } from "@domain/constants/pagination";
import { CampaignDetailsResponse } from "@domain/repositories/campaign";
import { CampaignStatus } from "@prisma/client";

describe("SearchCampaignsUseCase", () => {
  let sut: SearchCampaignsUseCase;
  let campaignRepository: CampaignRepository;

  beforeEach(() => {
    campaignRepository = new CampaignRepositoryStub();
    sut = new SearchCampaignsUseCase(campaignRepository);
  });

  it("should search campaigns with all filters", async () => {
    const searchParams = {
      page: 1,
      pageSize: 10,
      title: "Test Campaign",
      startDate: new Date("2025-01-01"),
      status: CampaignStatus.ACTIVE
    };

    const mockResponse: PaginatedEntity<CampaignDetailsResponse> = {
      data: [
        {
          id: "1",
          title: "Test Campaign",
          description: "Description",
          targetAmount: 1000,
          currentAmount: 500,
          achievementPercentage: 50,
          startDate: new Date("2025-01-01"),
          endDate: new Date("2025-12-31"),
          imageUrl: "http://example.com/image.jpg",
          status: CampaignStatus.ACTIVE,
          createdBy: "user-1",
          isRoot: false
        }
      ],
      total: 1,
      page: 1,
      lastPage: 1
    };

    jest
      .spyOn(campaignRepository, "findByTitleAndDateAndStatus")
      .mockResolvedValue(mockResponse);

    const result = await sut.execute(searchParams);

    expect(campaignRepository.findByTitleAndDateAndStatus).toHaveBeenCalledWith(
      searchParams.title,
      searchParams.startDate,
      searchParams.status,
      { page: searchParams.page, pageSize: searchParams.pageSize }
    );
    expect(result).toEqual(mockResponse);
  });

  it("should search campaigns with only title filter", async () => {
    const searchParams = {
      page: 1,
      pageSize: 10,
      title: "Test Campaign",
      startDate: undefined,
      status: undefined
    };

    const mockResponse: PaginatedEntity<CampaignDetailsResponse> = {
      data: [],
      total: 0,
      page: 1,
      lastPage: 0
    };

    jest
      .spyOn(campaignRepository, "findByTitleAndDateAndStatus")
      .mockResolvedValue(mockResponse);

    const result = await sut.execute(searchParams);

    expect(campaignRepository.findByTitleAndDateAndStatus).toHaveBeenCalledWith(
      searchParams.title,
      undefined,
      undefined,
      { page: searchParams.page, pageSize: searchParams.pageSize }
    );
    expect(result).toEqual(mockResponse);
  });

  it("should search campaigns with only date filter", async () => {
    const searchParams = {
      page: 1,
      pageSize: 10,
      title: undefined,
      startDate: new Date("2025-01-01"),
      status: undefined
    };

    const mockResponse: PaginatedEntity<CampaignDetailsResponse> = {
      data: [],
      total: 0,
      page: 1,
      lastPage: 0
    };

    jest
      .spyOn(campaignRepository, "findByTitleAndDateAndStatus")
      .mockResolvedValue(mockResponse);

    const result = await sut.execute(searchParams);

    expect(campaignRepository.findByTitleAndDateAndStatus).toHaveBeenCalledWith(
      undefined,
      searchParams.startDate,
      undefined,
      { page: searchParams.page, pageSize: searchParams.pageSize }
    );
    expect(result).toEqual(mockResponse);
  });

  it("should search campaigns with only status filter", async () => {
    const searchParams = {
      page: 1,
      pageSize: 10,
      title: undefined,
      startDate: undefined,
      status: CampaignStatus.FINISHED
    };

    const mockResponse: PaginatedEntity<CampaignDetailsResponse> = {
      data: [],
      total: 0,
      page: 1,
      lastPage: 0
    };

    jest
      .spyOn(campaignRepository, "findByTitleAndDateAndStatus")
      .mockResolvedValue(mockResponse);

    const result = await sut.execute(searchParams);

    expect(campaignRepository.findByTitleAndDateAndStatus).toHaveBeenCalledWith(
      undefined,
      undefined,
      searchParams.status,
      { page: searchParams.page, pageSize: searchParams.pageSize }
    );
    expect(result).toEqual(mockResponse);
  });

  it("should search campaigns without any filters", async () => {
    const searchParams = {
      page: 2,
      pageSize: 5,
      title: undefined,
      startDate: undefined,
      status: undefined
    };

    const mockResponse: PaginatedEntity<CampaignDetailsResponse> = {
      data: [],
      total: 0,
      page: 2,
      lastPage: 0
    };

    jest
      .spyOn(campaignRepository, "findByTitleAndDateAndStatus")
      .mockResolvedValue(mockResponse);

    const result = await sut.execute(searchParams);

    expect(campaignRepository.findByTitleAndDateAndStatus).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      { page: searchParams.page, pageSize: searchParams.pageSize }
    );
    expect(result).toEqual(mockResponse);
  });

  it("should handle different pagination parameters", async () => {
    const searchParams = {
      page: 3,
      pageSize: 20,
      title: "Search Term",
      startDate: undefined,
      status: undefined
    };

    const mockResponse: PaginatedEntity<CampaignDetailsResponse> = {
      data: [],
      total: 0,
      page: 3,
      lastPage: 0
    };

    jest
      .spyOn(campaignRepository, "findByTitleAndDateAndStatus")
      .mockResolvedValue(mockResponse);

    const result = await sut.execute(searchParams);

    expect(campaignRepository.findByTitleAndDateAndStatus).toHaveBeenCalledWith(
      searchParams.title,
      undefined,
      undefined,
      { page: 3, pageSize: 20 }
    );
    expect(result.page).toBe(3);
  });
});
