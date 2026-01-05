import { ExceptionsAdapter } from "@domain/adapters/exception";
import { AdminRepository } from "@domain/repositories/admin";
import { Injectable } from "@nestjs/common";
import { UpdateAdminDto } from "@application/dtos/admin/update";
import { HashAdapter } from "@domain/adapters/hash";

@Injectable()
export class UpdateAdminUseCase {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly hashService: HashAdapter,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute(id: string, params: UpdateAdminDto): Promise<void> {
    const { email, password, root, fullName } = params;

    const admin = await this.adminRepository.findByIdWithUser(id);

    if (!admin) {
      return this.exceptionService.notFound({
        message: "Admin not found"
      });
    }

    if (email && email !== admin.email) {
      const emailAlreadyUsed = await this.adminRepository.findByEmail(email);

      if (emailAlreadyUsed) {
        return this.exceptionService.conflict({
          message: "Email already used"
        });
      }
    }

    const passwordHashed = password
      ? await this.hashService.generateHash(password)
      : admin.password;

    await this.adminRepository.update(id, {
      email,
      password: passwordHashed,
      root,
      fullName
    });
  }
}
