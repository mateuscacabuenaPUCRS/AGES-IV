import { Injectable } from "@nestjs/common";
import { CreateNewsDto } from "@application/dtos/news/create";
import { NewsRepository } from "@domain/repositories/news";

@Injectable()
export class CreateNewsUseCase {
  constructor(private readonly repo: NewsRepository) {}

  async execute(dto: CreateNewsDto): Promise<void> {
    await this.repo.create({
      title: dto.title,
      description: dto.description,
      date: dto.date ? new Date(dto.date) : null,
      location: dto.location ?? null,
      url: dto.url ?? null
    });
  }
}
