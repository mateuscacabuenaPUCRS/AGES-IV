import { ExceptionsAdapter } from "@domain/adapters/exception";
import { CampaignRepository } from "@domain/repositories/campaign";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeleteCampaignUseCase {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute(id: string): Promise<void> {
    const campaign = await this.campaignRepository.findById(id);

    if (!campaign) {
      return this.exceptionService.notFound({
        message: "Campaign not found"
      });
    }

    await this.campaignRepository.delete(id);
  }
}
