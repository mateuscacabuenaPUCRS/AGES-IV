import {
  CampaignRepository,
  CreateCampaignParams,
  UpdateCampaignParams,
  CampaignDetailsResponse,
  CampaignDonorDetailsResponse
} from "@domain/repositories/campaign";
import { PrismaService } from "@infra/config/prisma";
import { CampaignMapper } from "@infra/mappers/prisma/campaign-mapper";
import { Injectable } from "@nestjs/common";
import { Campaign, CampaignStatus, Prisma } from "@prisma/client";
import {
  PaginatedEntity,
  PaginationParams
} from "@domain/constants/pagination";

@Injectable()
export class PrismaCampaignRepository implements CampaignRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByDonorId(
    donorId: string,
    params: PaginationParams
  ): Promise<PaginatedEntity<CampaignDonorDetailsResponse>> {
    const skip = (params.page - 1) * params.pageSize;

    const [campaigns, total] = await Promise.all([
      await this.prisma.campaign.findMany({
        where: {
          donation: {
            some: {
              donorId
            }
          }
        },
        include: {
          user: {
            select: {
              fullName: true
            }
          }
        },
        orderBy: {
          startDate: "desc"
        },
        skip,
        take: params.pageSize
      }),
      await this.prisma.campaign.count({
        where: {
          donation: {
            some: {
              donorId
            }
          }
        }
      })
    ]);

    return {
      data: campaigns.map(CampaignMapper.toDomainDonorDetails),
      page: params.page,
      lastPage: Math.ceil(total / params.pageSize),
      total
    };
  }

  async create(params: CreateCampaignParams): Promise<void> {
    await this.prisma.campaign.create({
      data: {
        title: params.title,
        description: params.description,
        targetAmount: params.targetAmount,
        startDate: params.startDate,
        endDate: params.endDate,
        imageUrl: params.imageUrl,
        createdBy: params.createdBy,
        status: params.status
      }
    });
  }

  async findById(id: string): Promise<Campaign | null> {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            donor: true,
            admin: true
          }
        }
      }
    });

    if (!campaign) {
      return null;
    }

    return CampaignMapper.toDomain(campaign);
  }

  async findByTitleAndDateAndStatus(
    title?: string,
    startDate?: Date,
    status?: CampaignStatus,
    params: PaginationParams = { page: 1, pageSize: 10 }
  ): Promise<PaginatedEntity<CampaignDetailsResponse>> {
    const { page, pageSize } = params;
    const offset = (page - 1) * pageSize;

    const where: Prisma.CampaignWhereInput = {};

    if (title) {
      where.title = {
        contains: title,
        mode: Prisma.QueryMode.insensitive
      };
    }

    if (startDate) {
      where.startDate = {
        gte: startDate
      };
    }

    if (status) {
      where.status = status;
    }

    const [campaigns, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        skip: offset,
        take: pageSize,
        include: {
          user: true
        },
        orderBy: {
          startDate: "desc"
        }
      }),
      this.prisma.campaign.count({ where })
    ]);

    const campaignDetails = campaigns.map((campaign) => ({
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      targetAmount: campaign.targetAmount.toNumber(),
      currentAmount: campaign.currentAmount.toNumber(),
      achievementPercentage:
        campaign.targetAmount.toNumber() > 0
          ? (campaign.currentAmount.toNumber() /
              campaign.targetAmount.toNumber()) *
            100
          : 0,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      imageUrl: campaign.imageUrl,
      status: campaign.status,
      createdBy: campaign.user.fullName,
      isRoot: campaign.isRoot
    }));

    return {
      data: campaignDetails,
      page,
      lastPage: Math.ceil(total / pageSize),
      total
    };
  }

  async update(id: string, params: UpdateCampaignParams): Promise<void> {
    await this.prisma.campaign.update({
      where: { id },
      data: params
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.campaign.delete({
      where: { id }
    });
  }

  async updateIsRoot(id: string, isRoot: boolean): Promise<void> {
    await this.prisma.campaign.update({
      where: { id },
      data: { isRoot }
    });
  }

  async findRootCampaign(): Promise<{
    id: string;
    title: string;
    description: string;
    targetAmount: Prisma.Decimal;
    currentAmount: Prisma.Decimal;
    porcentageAchieved: number;
    startDate: Date;
    endDate: Date;
    imageUrl: string;
    status: CampaignStatus;
    createdBy: string;
    isRoot: boolean;
  } | null> {
    const campaign = await this.prisma.campaign.findFirst({
      where: { isRoot: true },
      include: {
        user: {
          include: {
            donor: true,
            admin: true
          }
        }
      }
    });

    if (!campaign) {
      return null;
    }

    return {
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      targetAmount: campaign.targetAmount,
      currentAmount: campaign.currentAmount,
      porcentageAchieved:
        campaign.targetAmount.toNumber() > 0
          ? (campaign.currentAmount.toNumber() /
              campaign.targetAmount.toNumber()) *
            100
          : 0,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      imageUrl: campaign.imageUrl,
      status: campaign.status,
      createdBy: campaign.user.fullName,
      isRoot: campaign.isRoot
    };
  }
}
