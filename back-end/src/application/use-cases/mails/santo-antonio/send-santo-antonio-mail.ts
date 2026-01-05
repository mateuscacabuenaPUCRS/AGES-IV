import { QueueAdapter } from "@domain/adapters/queue";
import { santoAntonioTemplate } from "@domain/email-templates/email-template";
import { DonorRepository } from "@domain/repositories/donor";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SendSantoAntonioMailUseCase {
  constructor(
    private readonly queueIntegration: QueueAdapter,
    private readonly donorRepository: DonorRepository
  ) {}

  async execute(): Promise<void> {
    const donors = await this.donorRepository.findAllDonorsMails();

    const title = "Feliz dia de Santo Antonio";

    for (const donor of donors) {
      await this.queueIntegration.addJob({
        to: donor.email,
        subject: title,
        body: santoAntonioTemplate(title, donor.fullName)
      });
    }
  }
}
