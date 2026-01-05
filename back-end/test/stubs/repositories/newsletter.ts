import { NewsletterRepository } from "@domain/repositories/newsletter";
import { Newsletter } from "@domain/entities/newsletter";

export class NewsletterRepositoryStub implements NewsletterRepository {
  async findByEmail(email: string): Promise<Newsletter | null> {
    return {
      id: "1",
      email,
      createdAt: new Date()
    };
  }

  async create(): Promise<void> {
    return null;
  }

  async findAll(): Promise<Newsletter[]> {
    return [];
  }
}
