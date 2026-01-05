import { FindAllDonationsResponse } from "@application/dtos/donation/find-all";
import { PaginationDTO } from "@application/dtos/utils/pagination";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { DonationRepository } from "@domain/repositories/donation";
import { DonorRepository } from "@domain/repositories/donor";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllDonationsUseCase {
  constructor(
    private readonly donationRepository: DonationRepository,
    private readonly donorRepository: DonorRepository,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute(
    { page, pageSize }: PaginationDTO,
    donorId: string
  ): Promise<FindAllDonationsResponse | void> {
    const donor = await this.donorRepository.findById(donorId);

    if (!donor) {
      return this.exceptionService.notFound({
        message: "Donor not found"
      });
    }

    const donations = await this.donationRepository.findAllByDonor(
      {
        page,
        pageSize
      },
      donorId
    );
    return donations;
  }
}
