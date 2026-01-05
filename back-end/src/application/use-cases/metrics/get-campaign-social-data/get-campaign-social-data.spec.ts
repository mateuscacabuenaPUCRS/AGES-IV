import { CampaignRepository } from "@domain/repositories/campaign";
import { MetricsRepository } from "@domain/repositories/metrics";
import { createMockCampaign } from "@test/builders/campaign";
import { createMockDonorsSocialDataList } from "@test/builders/donor-social-data";
import { CampaignRepositoryStub } from "@test/stubs/repositories/campaign";
import { MetricsRepositoryStub } from "@test/stubs/repositories/metrics";
import { GetCampaignSocialDataUseCase } from "./get-campaign-social-data";
import { Gender } from "@domain/entities/gender-enum";
import { NotFoundException } from "@nestjs/common";

describe("GetCampaignSocialDataUseCase", () => {
  let sut: GetCampaignSocialDataUseCase;
  let campaignRepository: CampaignRepository;
  let metricsRepository: MetricsRepository;

  beforeEach(() => {
    campaignRepository = new CampaignRepositoryStub();
    metricsRepository = new MetricsRepositoryStub();
    sut = new GetCampaignSocialDataUseCase(
      campaignRepository,
      metricsRepository
    );
  });

  it("should throw an error when campaign is not found", async () => {
    const campaignId = "non-existent-id";

    jest.spyOn(campaignRepository, "findById").mockResolvedValue(null);

    await expect(sut.execute(campaignId)).rejects.toThrow(NotFoundException);
    expect(campaignRepository.findById).toHaveBeenCalledWith(campaignId);
  });

  it("should return social data with correct distributions when campaign has donors", async () => {
    const mockCampaign = createMockCampaign();
    const mockDonors = [
      ...createMockDonorsSocialDataList(3, {
        gender: Gender.MALE,
        birthDate: new Date("1990-01-01")
      }),
      ...createMockDonorsSocialDataList(2, {
        gender: Gender.FEMALE,
        birthDate: new Date("1985-01-01")
      })
    ];

    jest.spyOn(campaignRepository, "findById").mockResolvedValue(mockCampaign);
    jest
      .spyOn(metricsRepository, "getCampaignDonorsStatistics")
      .mockResolvedValue(mockDonors);

    const result = await sut.execute(mockCampaign.id);

    expect(campaignRepository.findById).toHaveBeenCalledWith(mockCampaign.id);
    expect(metricsRepository.getCampaignDonorsStatistics).toHaveBeenCalledWith(
      mockCampaign.id
    );

    expect(result.campaign).toBeDefined();
    expect(result.campaign.description).toBe(mockCampaign.description);
    expect(result.campaign.campaignStatus).toBe(mockCampaign.status);

    expect(result.genderDistribution).toHaveLength(2);
    const maleDistribution = result.genderDistribution.find(
      (g) => g.gender === "male"
    );
    const femaleDistribution = result.genderDistribution.find(
      (g) => g.gender === "female"
    );

    expect(maleDistribution?.count).toBe(3);
    expect(femaleDistribution?.count).toBe(2);

    expect(result.ageDistribution.length).toBeGreaterThan(0);
  });

  it("should return empty data when campaign has no donors", async () => {
    const mockCampaign = createMockCampaign();
    const emptyDonors = [];

    jest.spyOn(campaignRepository, "findById").mockResolvedValue(mockCampaign);
    jest
      .spyOn(metricsRepository, "getCampaignDonorsStatistics")
      .mockResolvedValue(emptyDonors);

    const result = await sut.execute(mockCampaign.id);

    expect(result.campaign).toBeDefined();
    expect(result.genderDistribution).toHaveLength(0);
    expect(result.ageDistribution).toHaveLength(0);
  });

  it("should correctly calculate age ranges", async () => {
    const mockCampaign = createMockCampaign();
    const mockDonors = [
      ...createMockDonorsSocialDataList(2, {
        birthDate: new Date("2000-01-01")
      }),
      ...createMockDonorsSocialDataList(3, {
        birthDate: new Date("1990-01-01")
      }),
      ...createMockDonorsSocialDataList(1, {
        birthDate: new Date("1980-01-01")
      })
    ];

    jest.spyOn(campaignRepository, "findById").mockResolvedValue(mockCampaign);
    jest
      .spyOn(metricsRepository, "getCampaignDonorsStatistics")
      .mockResolvedValue(mockDonors);

    const result = await sut.execute(mockCampaign.id);

    expect(result.ageDistribution).toHaveLength(3);

    const range18_25 = result.ageDistribution.find(
      (a) => a.ageRange === "18-25"
    );
    const range26_35 = result.ageDistribution.find(
      (a) => a.ageRange === "26-35"
    );
    const range36_50 = result.ageDistribution.find(
      (a) => a.ageRange === "36-50"
    );

    expect(range18_25?.count).toBe(2);
    expect(range26_35?.count).toBe(3);
    expect(range36_50?.count).toBe(1);
  });
});
