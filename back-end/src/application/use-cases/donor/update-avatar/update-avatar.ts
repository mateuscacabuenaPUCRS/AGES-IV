import { ExceptionsAdapter } from "@domain/adapters/exception";
import { DonorRepository } from "@domain/repositories/donor";
import { Injectable } from "@nestjs/common";
import { CreateFileDTO } from "@application/dtos/file/create";
import { CreateFileUseCase } from "../../file/create/create-file";

@Injectable()
export class UpdateDonorAvatarUseCase {
  constructor(
    private readonly donorRepository: DonorRepository,
    private readonly exceptionService: ExceptionsAdapter,
    private readonly createFileUseCase: CreateFileUseCase
  ) {}

  async execute(id: string, file: CreateFileDTO): Promise<void> {
    const donor = await this.donorRepository.findByIdWithUser(id);

    if (!donor) {
      return this.exceptionService.notFound({
        message: "Donor not found"
      });
    }

    const avatar = await this.createFileUseCase.execute(file);

    await this.donorRepository.update(id, { imageUrl: avatar.url });
  }
}
