import { ExceptionsAdapter } from "@domain/adapters/exception";
import { DonorRepository } from "@domain/repositories/donor";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeleteDonorUseCase {
  constructor(
    private readonly donorRepository: DonorRepository,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute(id: string): Promise<void> {
    const donor = await this.donorRepository.findById(id);

    if (!donor) {
      return this.exceptionService.notFound({
        message: "Donor not found"
      });
    }

    await this.donorRepository.delete(id);
  }
}
