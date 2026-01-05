import { Injectable } from "@nestjs/common";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { NewsletterRepository } from "@domain/repositories/newsletter";
import {
  CreateNewsletterDto,
  CreateNewsletterResponse
} from "@application/dtos/newsletter/create";

@Injectable()
export class CreateNewsletterUseCase {
  constructor(
    private readonly newsletterRepository: NewsletterRepository,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(dto: CreateNewsletterDto): Promise<CreateNewsletterResponse> {
    const { email } = dto;
    const existingSubscription =
      await this.newsletterRepository.findByEmail(email);

    if (existingSubscription) {
      this.exception.conflict({
        message: "Email já inscrito na newsletter"
      });
    }

    await this.newsletterRepository.create({ email });

    return {
      message: "Inscrição realizada com sucesso"
    };
  }
}
