import { Injectable } from "@nestjs/common";
import { NewsRepository } from "@domain/repositories/news";
import { ExceptionsAdapter } from "@domain/adapters/exception";

@Injectable()
export class DeleteNewsUseCase {
  constructor(
    private readonly repo: NewsRepository,
    private readonly exceptions: ExceptionsAdapter
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repo.findById(id);

    if (!existing) {
      this.exceptions.notFound({ message: "News not found" });
      return;
    }

    await this.repo.delete(id);
  }
}
