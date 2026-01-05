import { UpdateCampaignDto } from "@application/dtos/campaign/update";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { CampaignRepository } from "@domain/repositories/campaign";
import { Injectable } from "@nestjs/common";
import { CampaignStatus } from "@prisma/client";

@Injectable()
export class UpdateCampaignUseCase {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute(id: string, params: UpdateCampaignDto): Promise<void> {
    const { title, description, targetAmount, startDate, endDate, imageUrl } =
      params;

    const campaign = await this.campaignRepository.findById(id);

    if (!campaign) {
      return this.exceptionService.notFound({
        message: "Campaign not found"
      });
    }

    if (startDate && !(startDate instanceof Date)) {
      return this.exceptionService.badRequest({
        message: "Start date must be a valid Date object"
      });
    }

    if (endDate && !(endDate instanceof Date)) {
      return this.exceptionService.badRequest({
        message: "End date must be a valid Date object"
      });
    }

    if (endDate && endDate <= (startDate ?? campaign.startDate)) {
      return this.exceptionService.badRequest({
        message: "Campaign ending date must be after the starting date"
      });
    }

    if (targetAmount && targetAmount <= 0) {
      return this.exceptionService.badRequest({
        message: "Target amount must be greater than 0"
      });
    }

    await this.campaignRepository.update(id, {
      title,
      description,
      imageUrl,
      targetAmount,
      startDate,
      endDate
    });
  }
}

@Injectable()
export class UpdateCampaignStatusUseCase {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute(id: string, params: UpdateCampaignDto): Promise<void> {
    const { status } = params;

    const campaign = await this.campaignRepository.findById(id);

    if (!campaign) {
      return this.exceptionService.notFound({
        message: "Campaign not found"
      });
    }

    if (status && !Object.values(CampaignStatus).includes(status)) {
      return this.exceptionService.badRequest({
        message: `Status must be one of: ${Object.values(CampaignStatus).join(", ")}`
      });
    }

    await this.campaignRepository.update(id, {
      status
    });
  }
}
