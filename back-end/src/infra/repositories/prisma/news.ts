import { Injectable } from "@nestjs/common";
import { PrismaService } from "@infra/config/prisma";
import { NewsMapper } from "@infra/mappers/prisma/news-mapper";

import {
  PaginationParams,
  PaginatedEntity
} from "@domain/constants/pagination";
import {
  CreateNewsParams,
  UpdateNewsParams,
  NewsRepository
} from "@domain/repositories/news";
import { News } from "@domain/entities/news";

@Injectable()
export class PrismaNewsRepository implements NewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<News | null> {
    const row = await this.prisma.news.findUnique({ where: { id } });
    if (!row) return null;
    return NewsMapper.toDomain(row);
  }

  async findAll({
    page,
    pageSize
  }: PaginationParams): Promise<PaginatedEntity<News>> {
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.news.findMany({
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      this.prisma.news.count()
    ]);

    const data: News[] = rows.map((r) => NewsMapper.toDomain(r));
    const lastPage = Math.ceil(total / pageSize);

    return { data, page, lastPage, total };
  }

  async create(params: CreateNewsParams): Promise<void> {
    await this.prisma.news.create({ data: params });
  }

  async update(id: string, params: UpdateNewsParams): Promise<void> {
    await this.prisma.news.update({
      where: { id },
      data: params
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.news.delete({ where: { id } });
  }
}
