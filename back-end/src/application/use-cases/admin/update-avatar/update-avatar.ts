import { ExceptionsAdapter } from "@domain/adapters/exception";
import { AdminRepository } from "@domain/repositories/admin";
import { Injectable } from "@nestjs/common";
import { CreateFileDTO } from "@application/dtos/file/create";
import { CreateFileUseCase } from "../../file/create/create-file";

@Injectable()
export class UpdateAdminAvatarUseCase {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly exceptionService: ExceptionsAdapter,
    private readonly createFileUseCase: CreateFileUseCase
  ) {}

  async execute(id: string, file: CreateFileDTO): Promise<void> {
    const admin = await this.adminRepository.findByIdWithUser(id);

    if (!admin) {
      return this.exceptionService.notFound({
        message: "Admin not found"
      });
    }
    const avatar = await this.createFileUseCase.execute(file);
    await this.adminRepository.update(id, { imageUrl: avatar.url });
  }
}
