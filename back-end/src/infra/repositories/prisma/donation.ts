import { Transaction } from "@domain/adapters/transaction";
import {
  PaginatedEntity,
  PaginationParams
} from "@domain/constants/pagination";
import { Donation } from "@domain/entities/donation";
import {
  CreateDonationParams,
  DonationDetailsResponse,
  DonationDetailsResponseWithPayment,
  DonationRepository,
  UpdateDonationParams
} from "@domain/repositories/donation";
import { PrismaService } from "@infra/config/prisma";
import { DonationMapper } from "@infra/mappers/prisma/donation-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaDonationRepository implements DonationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    params: CreateDonationParams,
    tx?: Transaction
  ): Promise<Donation> {
    const dbInstance = tx ?? this.prisma;

    const donation = await dbInstance.donation.create({
      data: {
        amount: params.amount,
        periodicity: params.periodicity,
        campaignId: params.campaignId,
        donorId: params.donorId
      }
    });

    return DonationMapper.toDomain(donation);
  }

  async findById(id: string): Promise<Donation | null> {
    const donation = await this.prisma.donation.findUnique({
      where: { id }
    });
    if (!donation) return null;
    return DonationMapper.toDomain(donation);
  }

  async findAllByCampaign(
    campaignId: string
  ): Promise<DonationDetailsResponseWithPayment[]> {
    const donations = await this.prisma.donation.findMany({
      where: {
        campaignId
      },
      include: {
        payment: true
      }
    });

    return donations.map(DonationMapper.toDomainWithPayment);
  }

  async findAllByDonor(
    { page, pageSize }: PaginationParams,
    donorId: string
  ): Promise<PaginatedEntity<DonationDetailsResponse>> {
    const [donations, total] = await Promise.all([
      this.prisma.donation.findMany({
        where: { donorId },
        include: {
          campaign: {
            select: {
              title: true,
              user: {
                select: {
                  fullName: true
                }
              }
            }
          }
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" }
      }),
      this.prisma.donation.count({ where: { donorId } })
    ]);

    return {
      data: donations.map((donation) => ({
        ...DonationMapper.toDomain(donation),
        campaignName: donation.campaign?.title ?? null,
        campaignCreatedBy: donation.campaign?.user?.fullName ?? null
      })),
      page,
      lastPage: Math.ceil(total / pageSize),
      total
    };
  }

  async update(id: string, params: UpdateDonationParams): Promise<void> {
    const { campaignId, donorId, ...rest } = params;
    await this.prisma.donation.update({
      where: { id },
      data: {
        ...rest,
        ...(campaignId !== undefined && {
          campaign: campaignId
            ? { connect: { id: campaignId } }
            : { disconnect: true }
        }),
        ...(donorId !== undefined && {
          donor: donorId ? { connect: { id: donorId } } : { disconnect: true }
        })
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.donation.delete({
      where: { id }
    });
  }
}
