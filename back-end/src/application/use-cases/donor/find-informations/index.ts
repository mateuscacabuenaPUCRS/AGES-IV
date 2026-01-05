import { FindDonorInformationsResponse } from "@application/dtos/donor/find-donor-informations";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { DonorRepository } from "@domain/repositories/donor";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindDonorInformationsUseCase {
  constructor(
    private readonly donorRepository: DonorRepository,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute(id: string): Promise<FindDonorInformationsResponse | void> {
    const donor = await this.donorRepository.findById(id);

    if (!donor) {
      return this.exceptionService.notFound({
        message: "Donor not found"
      });
    }

    return await this.donorRepository.findInformationsById(id);
  }
}
