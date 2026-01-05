import { Injectable } from "@nestjs/common";
import { PrismaService } from "@infra/config/prisma";
import {
  GetMetricsResponseDTO,
  PeriodMetricsDTO
} from "@application/dtos/metrics/get-metrics";
import {
  MetricsRepository,
  DonorStatisticsData
} from "@domain/repositories/metrics";
import {
  GetSocialMetricsResponseDTO,
  RawAgeResult,
  RawGenderResult
} from "@application/dtos/metrics/get-social-metrics";
import { Prisma, PaymentMethod } from "@prisma/client";
import { TotalDonationAmountByPaymentMethodResponse } from "@domain/repositories/metrics";
import { DonationsRaisedByPeriodResponse } from "@application/dtos/metrics/get-donations-raised-by-period";
import { monthNames, RaisedByPeriodDataItem } from "@domain/entities/metrics";

@Injectable()
export class PrismaMetricsRepository implements MetricsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getMetrics(): Promise<GetMetricsResponseDTO> {
    const [last_30_days, last_365_days] = await Promise.all([
      this.getMetricsByPeriod(30),
      this.getMetricsByPeriod(365)
    ]);

    return { last_30_days, last_365_days };
  }

  private async getMetricsByPeriod(days: number): Promise<PeriodMetricsDTO> {
    type RawMetricsQueryResult = {
      total_raised: Prisma.Decimal | string | number;
      recurring_donations: number;
      total_donations: number;
      average_ticket: Prisma.Decimal | string | number;
      new_donors: number;
    };

    const result = await this.prisma.$queryRaw<RawMetricsQueryResult[]>(
      Prisma.sql`
        SELECT
          COALESCE(SUM(p.amount)::numeric, 0) AS total_raised,
          COUNT(DISTINCT CASE WHEN d.periodicity IS NOT NULL THEN d.id END)::int AS recurring_donations,
          COUNT(DISTINCT d.id)::int AS total_donations,
          COALESCE(AVG(p.amount)::numeric, 0) AS average_ticket,
          (
            SELECT COUNT(DISTINCT u.id)::int
            FROM users u
            JOIN donors don ON don.id = u.id
            JOIN donations d2 ON don.id = d2.donor_id
            JOIN payments p2 ON d2.id = p2.donation_id
            WHERE u.created_at >= NOW() - INTERVAL '1 day' * ${days}
              AND d2.created_at >= NOW() - INTERVAL '1 day' * ${days}
              AND p2.status = 'CONFIRMED'
          ) AS new_donors
        FROM donations d
        JOIN payments p ON d.id = p.donation_id
        WHERE d.created_at >= NOW() - INTERVAL '1 day' * ${days}
          AND p.status = 'CONFIRMED'
          AND d.donor_id IS NOT NULL
      `
    );

    const raw = result[0];

    return {
      total_raised: Number(raw.total_raised),
      recurring_donations: Number(raw.recurring_donations),
      total_donations: Number(raw.total_donations),
      average_ticket: Number(raw.average_ticket),
      new_donors: Number(raw.new_donors)
    };
  }
  async getSocialMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<GetSocialMetricsResponseDTO> {
    const genderRows = await this.prisma.$queryRaw<RawGenderResult[]>`
    SELECT 
      d.gender::text AS gender,
      COUNT(DISTINCT d.id)::int AS count
    FROM donors d
    JOIN users u ON u.id = d.id
    JOIN donations dn ON dn.donor_id = d.id
    WHERE u.deleted_at IS NULL
      AND dn.created_at BETWEEN ${startDate} AND ${endDate}
    GROUP BY d.gender
  `;

    const ageRows = await this.prisma.$queryRaw<RawAgeResult[]>`
    SELECT
      CASE 
        WHEN EXTRACT(YEAR FROM AGE(d.birth_date)) BETWEEN 18 AND 25 THEN '18-25'
        WHEN EXTRACT(YEAR FROM AGE(d.birth_date)) BETWEEN 26 AND 35 THEN '26-35'
        WHEN EXTRACT(YEAR FROM AGE(d.birth_date)) BETWEEN 36 AND 50 THEN '36-50'
        WHEN EXTRACT(YEAR FROM AGE(d.birth_date)) > 50 THEN '50+'
      END AS age_range,
      COUNT(DISTINCT d.id)::int AS count
    FROM donors d
    JOIN users u ON u.id = d.id
    JOIN donations dn ON dn.donor_id = d.id
    WHERE u.deleted_at IS NULL
      AND dn.created_at BETWEEN ${startDate} AND ${endDate}
    GROUP BY age_range
    ORDER BY age_range
  `;

    const genderDistribution = genderRows.map((g) => ({
      gender: g.gender,
      count: Number(g.count)
    }));

    const ageDistribution = ageRows.map((a) => ({
      ageRange: a.age_range,
      count: Number(a.count)
    }));

    return { genderDistribution, ageDistribution };
  }

  async getCampaignDonorsStatistics(
    campaignId: string
  ): Promise<DonorStatisticsData[]> {
    const donors = await this.prisma.donation.findMany({
      where: {
        campaignId: campaignId,
        donorId: { not: null }
      },
      select: {
        donor: {
          select: {
            id: true,
            user: {
              select: {
                fullName: true,
                deletedAt: true
              }
            },
            birthDate: true,
            gender: true
          }
        }
      },
      distinct: ["donorId"]
    });

    return donors
      .filter((donation) => donation.donor && donation.donor.user)
      .map((donation) => ({
        id: donation.donor!.id,
        fullName: donation.donor!.user.fullName,
        gender: donation.donor!.gender,
        birthDate: donation.donor!.birthDate
      }));
  }

  async findByDateDonationByPaymentMethod(
    startDate: Date,
    endDate: Date
  ): Promise<TotalDonationAmountByPaymentMethodResponse> {
    const totalDonationAmountByPaymentMethod = await this.prisma.$queryRaw<
      Array<{
        paymentMethod: string;
        totalAmount: number;
        totalQuantity: number;
      }>
    >(
      Prisma.sql`
        SELECT 
          payment_method as "paymentMethod",
          COALESCE(SUM(amount), 0)::FLOAT as "totalAmount",
          COUNT(id)::INTEGER as "totalQuantity"
        FROM payments 
        WHERE paid_at >= ${startDate}
          AND paid_at <= ${endDate}
          AND status = 'CONFIRMED'
        GROUP BY payment_method
      `
    );

    const formattedData = totalDonationAmountByPaymentMethod.map((item) => ({
      paymentMethod: item.paymentMethod as PaymentMethod,
      totalAmount: Number(item.totalAmount || 0),
      totalQuantity: item.totalQuantity
    }));

    return {
      rangeDate: {
        startDate,
        endDate
      },
      totalDonationAmountByPaymentMethodAmount: formattedData
    };
  }

  async findDonationsRaisedByPeriod(
    startDate: Date,
    endDate: Date
  ): Promise<DonationsRaisedByPeriodResponse> {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const rangeDate = { startDate, endDate };

    if (diffDays <= 31) {
      const dailyData = await this.getDailyDonations(startDate, endDate);
      return {
        rangeDate,
        daily: { data: dailyData }
      };
    } else if (diffDays <= 93) {
      const weeklyData = await this.getWeeklyDonations(startDate, endDate);
      return {
        rangeDate,
        weekly: { data: weeklyData }
      };
    } else {
      const monthlyData = await this.getMonthlyDonations(startDate, endDate);
      return {
        rangeDate,
        monthly: { data: monthlyData }
      };
    }
  }

  private async getDailyDonations(
    startDate: Date,
    endDate: Date
  ): Promise<RaisedByPeriodDataItem[]> {
    const result = await this.prisma.$queryRaw<
      Array<{ date: string; amount: string }>
    >(
      Prisma.sql`
        WITH date_series AS (
          SELECT generate_series(
            ${startDate}::date,
            ${endDate}::date,
            '1 day'::interval
          )::date as date
        )
        SELECT 
          ds.date::text as date,
          COALESCE(SUM(p.amount), 0)::DECIMAL as amount
        FROM date_series ds
        LEFT JOIN payments p ON DATE(p.paid_at) = ds.date 
          AND p.status = 'CONFIRMED'
        LEFT JOIN donations d ON d.id = p.donation_id
        GROUP BY ds.date
        ORDER BY ds.date
      `
    );

    return result.map((item) => ({
      label: item.date,
      amount: Number(item.amount || "0")
    }));
  }

  private async getWeeklyDonations(
    startDate: Date,
    endDate: Date
  ): Promise<RaisedByPeriodDataItem[]> {
    const result = await this.prisma.$queryRaw<
      Array<{
        week_start: string;
        week_end: string;
        amount: string;
      }>
    >(
      Prisma.sql`
        WITH week_series AS (
          SELECT generate_series(
            DATE_TRUNC('week', ${startDate}::date),
            DATE_TRUNC('week', ${endDate}::date),
            '1 week'::interval
          )::date as week_start_date
        )
        SELECT 
          TO_CHAR(ws.week_start_date, 'DD/MM') as week_start,
          TO_CHAR(ws.week_start_date + INTERVAL '6 days', 'DD/MM') as week_end,
          COALESCE(SUM(p.amount), 0)::DECIMAL as amount
        FROM week_series ws
        LEFT JOIN payments p ON DATE_TRUNC('week', p.paid_at) = ws.week_start_date
          AND p.paid_at >= ${startDate}
          AND p.paid_at <= ${endDate}
          AND p.status = 'CONFIRMED'
        LEFT JOIN donations d ON d.id = p.donation_id
        GROUP BY ws.week_start_date
        ORDER BY ws.week_start_date
      `
    );

    return result.map((item, index) => ({
      label: `Week ${index + 1} (${item.week_start} - ${item.week_end})`,
      amount: Number(item.amount || "0")
    }));
  }

  private async getMonthlyDonations(
    startDate: Date,
    endDate: Date
  ): Promise<RaisedByPeriodDataItem[]> {
    const result = await this.prisma.$queryRaw<
      Array<{
        month: number;
        year: number;
        amount: string;
      }>
    >(
      Prisma.sql`
        WITH month_series AS (
          SELECT generate_series(
            DATE_TRUNC('month', ${startDate}::date),
            DATE_TRUNC('month', ${endDate}::date),
            '1 month'::interval
          )::date as month_date
        )
        SELECT 
          EXTRACT(MONTH FROM ms.month_date)::INTEGER as month,
          EXTRACT(YEAR FROM ms.month_date)::INTEGER as year,
          COALESCE(SUM(p.amount), 0)::DECIMAL as amount
        FROM month_series ms
        LEFT JOIN payments p ON DATE_TRUNC('month', p.paid_at) = ms.month_date
          AND p.paid_at >= ${startDate}
          AND p.paid_at <= ${endDate}
          AND p.status = 'CONFIRMED'
        LEFT JOIN donations d ON d.id = p.donation_id
        GROUP BY ms.month_date, EXTRACT(MONTH FROM ms.month_date), EXTRACT(YEAR FROM ms.month_date)
        ORDER BY EXTRACT(YEAR FROM ms.month_date), EXTRACT(MONTH FROM ms.month_date)
      `
    );

    return result.map((item) => ({
      label: `${item.year} - ${monthNames[item.month - 1]}`,
      amount: Number(item.amount || "0")
    }));
  }
}
