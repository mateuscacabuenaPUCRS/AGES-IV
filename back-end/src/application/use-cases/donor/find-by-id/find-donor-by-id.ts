import { DonorDetails } from "@application/dtos/donor/find-by-id";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { DonorRepository } from "@domain/repositories/donor";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindDonorByIdUseCase {
  constructor(
    private readonly donorRepository: DonorRepository,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute(id: string): Promise<DonorDetails | void> {
    const donor = await this.donorRepository.findByIdWithUser(id);

    if (!donor) {
      return this.exceptionService.notFound({
        message: "Donor not found"
      });
    }

    const totalAmountDonated =
      await this.donorRepository.totalAmountDonatedByDonorId(id);

    return {
      id: donor.id,
      email: donor.email,
      cpf: donor.cpf,
      birthDate: donor.birthDate,
      fullName: donor.fullName,
      gender: donor.gender,
      phone: donor.phone,
      imageUrl: donor.imageUrl ?? null,
      createdAt: donor.createdAt,
      totalDonated: totalAmountDonated
    };
  }
}
