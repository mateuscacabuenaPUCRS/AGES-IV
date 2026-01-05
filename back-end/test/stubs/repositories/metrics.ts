import { MetricsRepository } from "@domain/repositories/metrics";
import {
  GetMetricsResponseDTO,
  PeriodMetricsDTO
} from "@application/dtos/metrics/get-metrics";
import {
  DonorStatisticsData,
  TotalDonationAmountByPaymentMethodResponse
} from "@domain/repositories/metrics";
import { Gender } from "@domain/entities/gender-enum";
import { GetSocialMetricsResponseDTO } from "@application/dtos/metrics/get-social-metrics";
import { DonationsRaisedByPeriodResponse } from "@application/dtos/metrics/get-donations-raised-by-period";
import { PaymentMethod } from "@prisma/client";

export class MetricsRepositoryStub implements MetricsRepository {
  async getMetrics(): Promise<GetMetricsResponseDTO> {
    const mockPeriodData: PeriodMetricsDTO = {
      total_raised: 50000,
      new_donors: 120,
      recurring_donations: 25,
      total_donations: 300,
      average_ticket: 166.67
    };

    return {
      last_30_days: {
        total_raised: 3000,
        new_donors: 10,
        recurring_donations: 3,
        total_donations: 15,
        average_ticket: 200
      },
      last_365_days: mockPeriodData
    };
  }

  async getCampaignDonorsStatistics(
    campaignId: string
  ): Promise<DonorStatisticsData[]> {
    if (campaignId === "empty-campaign") {
      return [];
    }
    return [
      {
        id: "donor-1",
        fullName: "João Silva",
        gender: Gender.MALE,
        birthDate: new Date("1990-05-15")
      },
      {
        id: "donor-2",
        fullName: "Maria Santos",
        gender: Gender.FEMALE,
        birthDate: new Date("1985-08-22")
      },
      {
        id: "donor-3",
        fullName: "Carlos Oliveira",
        gender: Gender.MALE,
        birthDate: new Date("1995-12-10")
      }
    ];
  }

  async getSocialMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<GetSocialMetricsResponseDTO> {
    if (
      startDate.toISOString().startsWith("2020-01-01") &&
      endDate.toISOString().startsWith("2020-01-31")
    ) {
      return {
        genderDistribution: [],
        ageDistribution: []
      };
    }

    return {
      genderDistribution: [
        { gender: Gender.MALE, count: 2 },
        { gender: Gender.FEMALE, count: 1 }
      ],
      ageDistribution: [
        { ageRange: "26-35", count: 1 },
        { ageRange: "36-50", count: 2 }
      ]
    };
  }
  async findByDateDonationByPaymentMethod(
    startDate: Date,
    endDate: Date
  ): Promise<TotalDonationAmountByPaymentMethodResponse> {
    return {
      rangeDate: {
        startDate,
        endDate
      },
      totalDonationAmountByPaymentMethodAmount: [
        {
          paymentMethod: PaymentMethod.PIX,
          totalAmount: 5000,
          totalQuantity: 25
        },
        {
          paymentMethod: PaymentMethod.CREDIT_CARD,
          totalAmount: 10000,
          totalQuantity: 15
        },
        {
          paymentMethod: PaymentMethod.BANK_SLIP,
          totalAmount: 3000,
          totalQuantity: 10
        }
      ]
    };
  }

  async findDonationsRaisedByPeriod(
    startDate: Date,
    endDate: Date
  ): Promise<DonationsRaisedByPeriodResponse> {
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const rangeDate = { startDate, endDate };

    if (diffDays <= 31) {
      return {
        rangeDate,
        daily: {
          data: [
            { label: "2025-01-01", amount: 150 },
            { label: "2025-01-02", amount: 220 },
            { label: "2025-01-03", amount: 0 },
            { label: "2025-01-04", amount: 90 }
          ]
        }
      };
    } else if (diffDays <= 93) {
      return {
        rangeDate,
        weekly: {
          data: [
            { label: "Semana 1 (01/01 - 07/01)", amount: 1200 },
            { label: "Semana 2 (08/01 - 14/01)", amount: 1800 },
            { label: "Semana 3 (15/01 - 21/01)", amount: 0 },
            { label: "Semana 4 (22/01 - 28/01)", amount: 1900 }
          ]
        }
      };
    } else {
      return {
        rangeDate,
        monthly: {
          data: [
            { label: "2024 - Janeiro", amount: 0 },
            { label: "2024 - Fevereiro", amount: 0 },
            { label: "2025 - Janeiro", amount: 8500 },
            { label: "2025 - Fevereiro", amount: 7200 }
          ]
        }
      };
    }
  }
}
