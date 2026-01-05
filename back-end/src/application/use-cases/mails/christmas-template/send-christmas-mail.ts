import { QueueAdapter } from "@domain/adapters/queue";
import { christmasTemplate } from "@domain/email-templates/email-template";
import { DonorRepository } from "@domain/repositories/donor";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SendChristmasMailUseCase {
  constructor(
    private readonly queueIntegration: QueueAdapter,
    private readonly donorRepository: DonorRepository
  ) {}

  async execute(): Promise<void> {
    const donors = await this.donorRepository.findAllDonorsMails();

    const title = "Feliz Natal";

    for (const donor of donors) {
      await this.queueIntegration.addJob({
        to: donor.email,
        subject: title,
        body: christmasTemplate(title, donor.fullName)
      });
    }
  }
}
