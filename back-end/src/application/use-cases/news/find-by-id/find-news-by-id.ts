import { Injectable } from "@nestjs/common";
import { NewsRepository } from "@domain/repositories/news";
import { News } from "@domain/entities/news";
import { ExceptionsAdapter } from "@domain/adapters/exception";

@Injectable()
export class FindNewsByIdUseCase {
  constructor(
    private readonly newsRepository: NewsRepository,
    private readonly exceptionRepository: ExceptionsAdapter
  ) {}

  async execute(id: string): Promise<News> {
    const news = await this.newsRepository.findById(id);

    if (!news) {
      this.exceptionRepository.notFound({ message: "News not found" });
    }

    return news;
  }
}
