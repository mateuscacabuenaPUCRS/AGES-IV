import { Injectable } from "@nestjs/common";
import { FindAllNewsDto } from "@application/dtos/news/find-all";
import { NewsRepository } from "@domain/repositories/news";
import { PaginationDTO } from "@application/dtos/utils/pagination";

@Injectable()
export class FindAllNewsUseCase {
  constructor(private readonly repo: NewsRepository) {}

  async execute({ page, pageSize }: PaginationDTO): Promise<FindAllNewsDto> {
    return await this.repo.findAll({ page, pageSize });
  }
}
