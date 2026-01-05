import { QueueAdapter } from "@domain/adapters/queue";
import { newYearTemplate } from "@domain/email-templates/email-template";
import { DonorRepository } from "@domain/repositories/donor";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SendNewYearMailUseCase {
  constructor(
    private readonly queueIntegration: QueueAdapter,
    private readonly donorRepository: DonorRepository
  ) {}

  async execute(): Promise<void> {
    const donors = await this.donorRepository.findAllDonorsMails();

    const title = "Feliz Ano Novo";

    const year = new Date().getFullYear();

    for (const donor of donors) {
      await this.queueIntegration.addJob({
        to: donor.email,
        subject: title,
        body: newYearTemplate(title, donor.fullName, year)
      });
    }
  }
}
