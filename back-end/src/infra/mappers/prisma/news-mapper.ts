import { News } from "@domain/entities/news";
import { News as PrismaNews } from "@prisma/client";

export class NewsMapper {
  static toDomain(news: PrismaNews): News {
    return {
      id: news.id,
      title: news.title,
      description: news.description,
      date: news.date,
      location: news.location,
      url: news.url,
      createdAt: news.createdAt,
      updatedAt: news.updatedAt
    };
  }
}
