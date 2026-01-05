import { DonationResultDto } from "@application/dtos/donor/find-donations-by-donor-id";
import {
  PaginationParams,
  PaginatedEntity
} from "@domain/constants/pagination";
import { Donor } from "@domain/entities/donor";
import {
  CreateDonorParams,
  DonorDetailsResponse,
  DonorInformationsResponse,
  DonorMailsResponse,
  DonorRepository,
  DonorWithBirthdayParams,
  DonorWithUser,
  UpdateDonorParams
} from "@domain/repositories/donor";
import { PrismaService } from "@infra/config/prisma";
import { DonorMapper } from "@infra/mappers/prisma/donor-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaDonorRepository implements DonorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findInformationsById(id: string): Promise<DonorInformationsResponse> {
    const donor = await this.prisma.donor.findUnique({
      where: {
        id,
        user: {
          deletedAt: null
        }
      },
      include: {
        user: {
          select: {
            createdAt: true
          }
        },
        donation: {
          where: {
            campaign: {
              isNot: null
            }
          },
          include: {
            campaign: {
              select: {
                title: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 3
        }
      }
    });

    return {
      id: donor.id,
      campaignsTitles: donor.donation.map(
        (donation) => donation.campaign.title
      ),
      createdAt: donor.user.createdAt
    };
  }

  async findAllDonorsMails(): Promise<DonorMailsResponse[]> {
    const donors = await this.prisma.donor.findMany({
      select: {
        user: {
          select: {
            email: true,
            fullName: true
          }
        }
      },
      where: {
        user: {
          deletedAt: null
        }
      }
    });

    return donors.map((donor) => ({
      email: donor.user.email,
      fullName: donor.user.fullName
    }));
  }

  async findAllDonorsWithBirthday({
    day,
    month
  }: DonorWithBirthdayParams): Promise<DonorMailsResponse[]> {
    return await this.prisma.$queryRaw<DonorMailsResponse[]>`
      SELECT u.email, u.full_name as "fullName"
      FROM donors d
      INNER JOIN users u ON d.id = u.id
      WHERE EXTRACT(DAY FROM d.birth_date) = ${day}
        AND EXTRACT(MONTH FROM d.birth_date) = ${month}
        AND u.deleted_at IS NULL
    `;
  }

  async findByIdWithUser(id: string): Promise<DonorWithUser | null> {
    const donor = await this.prisma.donor.findUnique({
      where: {
        id,
        user: {
          deletedAt: null
        }
      },
      include: {
        user: true
      }
    });

    if (!donor) {
      return null;
    }

    return {
      id: donor.id,
      email: donor.user.email,
      password: donor.user.password,
      role: donor.user.role,
      cpf: donor.cpf,
      birthDate: donor.birthDate,
      imageUrl: donor.user.imageUrl,
      fullName: donor.user.fullName,
      gender: donor.gender,
      phone: donor.phone,
      createdAt: donor.user.createdAt,
      updatedAt: donor.user.updatedAt,
      deletedAt: donor.user.deletedAt
    };
  }

  async findAll({
    page,
    pageSize
  }: PaginationParams): Promise<PaginatedEntity<DonorDetailsResponse>> {
    const { donors, total } = await this.prisma.$transaction(async (tx) => {
      const donors = await tx.donor.findMany({
        where: {
          user: {
            deletedAt: null
          }
        },
        include: {
          user: {
            select: {
              email: true,
              fullName: true,
              createdAt: true
            }
          }
        },
        skip: (page - 1) * pageSize,
        take: pageSize
      });

      const total = await tx.donor.count({
        where: {
          user: {
            deletedAt: null
          }
        }
      });

      return {
        donors,
        total
      };
    });

    return {
      data: donors.map((donor) => ({
        id: donor.id,
        email: donor.user.email,
        birthDate: donor.birthDate,
        cpf: donor.cpf,
        fullName: donor.user.fullName,
        gender: donor.gender,
        phone: donor.phone,
        createdAt: donor.user.createdAt
      })),
      page,
      lastPage: Math.ceil(total / pageSize),
      total
    };
  }
  async findByEmail(email: string): Promise<Donor | null> {
    const donor = await this.prisma.donor.findFirst({
      where: {
        user: {
          email
        }
      }
    });

    if (!donor) {
      return null;
    }

    return DonorMapper.toDomain(donor);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id
      },
      data: {
        deletedAt: new Date()
      }
    });
  }

  async findById(id: string): Promise<Donor | null> {
    const donor = await this.prisma.donor.findUnique({
      where: {
        id,
        user: {
          deletedAt: null
        }
      }
    });

    if (!donor) {
      return null;
    }

    return DonorMapper.toDomain(donor);
  }

  async findByCPF(cpf: string): Promise<Donor | null> {
    const donor = await this.prisma.donor.findUnique({
      where: {
        cpf,
        user: {
          deletedAt: null
        }
      }
    });

    if (!donor) {
      return null;
    }

    return DonorMapper.toDomain(donor);
  }

  async create({
    birthDate,
    cpf,
    fullName,
    gender,
    phone,
    email,
    password,
    role
  }: CreateDonorParams): Promise<void> {
    await this.prisma.user.create({
      data: {
        fullName,
        email,
        password,
        role,
        donor: {
          create: {
            birthDate,
            cpf,
            gender,
            phone
          }
        }
      }
    });
  }

  async update(id: string, params: UpdateDonorParams): Promise<void> {
    const {
      email,
      password,
      fullName,
      birthDate,
      gender,
      phone,
      cpf,
      imageUrl
    } = params;

    await this.prisma.donor.update({
      where: { id },
      data: {
        birthDate,
        gender,
        phone,
        cpf,
        user: {
          update: {
            email,
            password,
            fullName,
            imageUrl
          }
        }
      }
    });
  }

  async totalAmountDonatedByDonorId(donorId: string): Promise<number> {
    const result = await this.prisma.donation.aggregate({
      _sum: {
        amount: true
      },
      where: {
        donorId
      }
    });

    return Number(result._sum.amount || 0);
  }

  async findAllDonationsByDonorId(donorId: string) {
    const result = await this.prisma.donation.findMany({
      where: {
        donorId
      },
      include: {
        campaign: {
          include: {
            user: {
              select: {
                fullName: true
              }
            }
          }
        },
        payment: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return result;
  }
}
