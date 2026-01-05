import { CreateCampaignDto } from "@application/dtos/campaign/create";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { CampaignRepository } from "@domain/repositories/campaign";

import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateCampaignUseCase {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute({
    title,
    description,
    targetAmount,
    startDate,
    endDate,
    imageUrl,
    status,
    createdBy
  }: CreateCampaignDto): Promise<void> {
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

    if (startDate && startDate < new Date()) {
      return this.exceptionService.badRequest({
        message: "Campaign starting date must be in the future"
      });
    }

    if (startDate && endDate && endDate <= startDate) {
      return this.exceptionService.badRequest({
        message: "Campaign ending date must be after the starting date"
      });
    }

    if (targetAmount <= 0) {
      return this.exceptionService.badRequest({
        message: "Target amount must be greater than 0"
      });
    }

    await this.campaignRepository.create({
      title,
      description,
      targetAmount,
      startDate,
      endDate,
      status,
      imageUrl,
      createdBy
    });
  }
}
