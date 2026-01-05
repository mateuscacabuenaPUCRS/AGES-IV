import { Newsletter } from "@domain/entities/newsletter";

export type CreateNewsletterParams = {
  email: string;
};

export abstract class NewsletterRepository {
  abstract create(params: CreateNewsletterParams): Promise<void>;
  abstract findByEmail(email: string): Promise<Newsletter | null>;
  abstract findAll(): Promise<Newsletter[]>;
}
