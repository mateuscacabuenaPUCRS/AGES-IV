import { ExceptionsAdapter } from "@domain/adapters/exception";
import { AdminRepository } from "@domain/repositories/admin";
import { Injectable } from "@nestjs/common";

export interface DeleteAdminParams {
  adminId: string;
  currentUserId: string;
}

@Injectable()
export class DeleteAdminUseCase {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute({ adminId, currentUserId }: DeleteAdminParams): Promise<void> {
    const adminToDelete = await this.adminRepository.findById(adminId);

    if (!adminToDelete) {
      return this.exceptionService.notFound({
        message: "Admin not found"
      });
    }

    const currentAdmin = await this.adminRepository.findById(currentUserId);

    if (!currentAdmin) {
      return this.exceptionService.notFound({
        message: "Current admin not found"
      });
    }

    if (!currentAdmin.root) {
      return this.exceptionService.forbidden({
        message: "Only root administrators can delete admins"
      });
    }

    await this.adminRepository.delete(adminId);
  }
}
