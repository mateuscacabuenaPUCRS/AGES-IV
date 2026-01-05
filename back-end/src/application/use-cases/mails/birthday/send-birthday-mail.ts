import { QueueAdapter } from "@domain/adapters/queue";
import { birthdayTemplate } from "@domain/email-templates/email-template";
import { DonorRepository } from "@domain/repositories/donor";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SendBirthdayMailUseCase {
  constructor(
    private readonly queueIntegration: QueueAdapter,
    private readonly donorRepository: DonorRepository
  ) {}

  async execute(): Promise<void> {
    const date = new Date();

    const donors = await this.donorRepository.findAllDonorsWithBirthday({
      day: date.getDate(),
      month: date.getMonth()
    });

    const title = "Feliz Aniversário";

    for (const donor of donors) {
      await this.queueIntegration.addJob({
        to: donor.email,
        subject: title,
        body: birthdayTemplate(title, donor.fullName)
      });
    }
  }
}
