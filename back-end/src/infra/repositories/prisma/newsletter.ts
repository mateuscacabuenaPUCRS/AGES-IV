import { Injectable } from "@nestjs/common";
import { PrismaService } from "@infra/config/prisma";
import { Newsletter } from "@domain/entities/newsletter";
import {
  NewsletterRepository,
  CreateNewsletterParams
} from "@domain/repositories/newsletter";
import { NewsletterMapper } from "@infra/mappers/prisma/newsletter-mapper";

@Injectable()
export class PrismaNewsletterRepository implements NewsletterRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<Newsletter | null> {
    const newsletter = await this.prismaService.newsletter.findUnique({
      where: { email }
    });

    if (!newsletter) return null;

    return NewsletterMapper.toDomain(newsletter);
  }

  async create(data: CreateNewsletterParams): Promise<void> {
    await this.prismaService.newsletter.create({
      data
    });
  }

  async findAll(): Promise<Newsletter[]> {
    const newsletters = await this.prismaService.newsletter.findMany();
    return newsletters.map(NewsletterMapper.toDomain);
  }
}
