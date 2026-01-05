import { NewsRepository } from "@domain/repositories/news";
import { News } from "@domain/entities/news";
import { PaginatedEntity } from "@domain/constants/pagination";

export class NewsRepositoryStub implements NewsRepository {
  async findById(): Promise<News | null> {
    return;
  }

  async findAll(): Promise<PaginatedEntity<News>> {
    return;
  }

  async create(): Promise<void> {
    return;
  }

  async update(): Promise<void> {
    return;
  }

  async delete(): Promise<void> {
    return;
  }
}
