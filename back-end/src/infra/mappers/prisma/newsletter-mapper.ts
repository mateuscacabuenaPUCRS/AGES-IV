import { Newsletter } from "@domain/entities/newsletter";
import { Newsletter as PrismaNewsletter } from "@prisma/client";

export class NewsletterMapper {
  static toDomain(newsletter: PrismaNewsletter): Newsletter {
    return {
      id: newsletter.id,
      email: newsletter.email,
      createdAt: newsletter.createdAt
    };
  }
}
