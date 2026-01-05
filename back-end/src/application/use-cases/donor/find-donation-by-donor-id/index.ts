import { ExceptionsAdapter } from "@domain/adapters/exception";
import { DonorRepository } from "@domain/repositories/donor";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindDonationByDonorIdUseCase {
  constructor(
    private readonly donorRepository: DonorRepository,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute(donorId: string) {
    const donor = await this.donorRepository.findById(donorId);

    if (!donor) {
      return this.exceptionService.notFound({
        message: "Donor not found"
      });
    }

    return await this.donorRepository.findAllDonationsByDonorId(donorId);
  }
}
