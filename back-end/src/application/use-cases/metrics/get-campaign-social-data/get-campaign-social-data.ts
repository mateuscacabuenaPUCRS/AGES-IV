import {
  CampaignSocialDataResponse,
  GenderDistribution,
  AgeDistribution,
  CampaignInfo
} from "@application/dtos/metrics/campaign-social-data";
import { CampaignRepository } from "@domain/repositories/campaign";
import {
  MetricsRepository,
  DonorStatisticsData
} from "@domain/repositories/metrics";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class GetCampaignSocialDataUseCase {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly metricsRepository: MetricsRepository
  ) {}

  async execute(campaignId: string): Promise<CampaignSocialDataResponse> {
    const campaign = await this.campaignRepository.findById(campaignId);
    if (!campaign) {
      throw new NotFoundException("Campaign not found");
    }

    const donorsData =
      await this.metricsRepository.getCampaignDonorsStatistics(campaignId);

    const genderDistribution = this.calculateGenderDistribution(donorsData);

    const ageDistribution = this.calculateAgeDistribution(donorsData);

    const targetAmount = Number(campaign.targetAmount);
    const currentAmount = Number(campaign.currentAmount);
    const percentage =
      targetAmount > 0
        ? Number(((currentAmount / targetAmount) * 100).toFixed(3))
        : 0;

    const campaignInfo: CampaignInfo = {
      description: campaign.description,
      targetAmount,
      currentAmount,
      percentage,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      imageUrl: campaign.imageUrl,
      campaignStatus: campaign.status
    };

    return {
      campaign: campaignInfo,
      genderDistribution,
      ageDistribution
    };
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  }

  private getAgeRange(age: number): string {
    if (age < 18) return "Under 18";
    if (age <= 25) return "18-25";
    if (age <= 35) return "26-35";
    if (age <= 50) return "36-50";
    return "50+";
  }

  private calculateGenderDistribution(
    donors: DonorStatisticsData[]
  ): GenderDistribution[] {
    const genderCounts = donors.reduce((acc, donor) => {
      const genderLower = donor.gender.toLowerCase();
      acc.set(genderLower, (acc.get(genderLower) || 0) + 1);
      return acc;
    }, new Map<string, number>());

    return Array.from(genderCounts.entries()).map(([gender, count]) => ({
      gender,
      count
    }));
  }

  private calculateAgeDistribution(
    donors: DonorStatisticsData[]
  ): AgeDistribution[] {
    const ageCounts = donors.reduce((acc, donor) => {
      const age = this.calculateAge(donor.birthDate);
      const ageRange = this.getAgeRange(age);
      acc.set(ageRange, (acc.get(ageRange) || 0) + 1);
      return acc;
    }, new Map<string, number>());

    return Array.from(ageCounts.entries()).map(([ageRange, count]) => ({
      ageRange,
      count
    }));
  }
}
