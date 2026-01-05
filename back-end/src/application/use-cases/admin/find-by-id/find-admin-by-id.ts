import { AdminDetails } from "@application/dtos/admin/find-by-id";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { AdminRepository } from "@domain/repositories/admin";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAdminByIdUseCase {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute(id: string): Promise<AdminDetails | void> {
    const admin = await this.adminRepository.findByIdWithUser(id);

    if (!admin) {
      return this.exceptionService.notFound({
        message: "Admin not found"
      });
    }

    return {
      id: admin.id,
      fullName: admin.fullName,
      email: admin.email,
      root: admin.root,
      imageUrl: admin.imageUrl
    };
  }
}
