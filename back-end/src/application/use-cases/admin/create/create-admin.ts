import { CreateAdminDto } from "@application/dtos/admin/create";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { HashAdapter } from "@domain/adapters/hash";
import { AdminRepository } from "@domain/repositories/admin";
import { Injectable } from "@nestjs/common";
import { UserRole } from "@prisma/client";

@Injectable()
export class CreateAdminUseCase {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly hashService: HashAdapter,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute({
    email,
    fullName,
    password,
    root
  }: CreateAdminDto): Promise<void> {
    const emailAlreadyUsed = await this.adminRepository.findByEmail(email);

    if (emailAlreadyUsed) {
      return this.exceptionService.conflict({
        message: "Email already used"
      });
    }

    const hashedPassword = await this.hashService.generateHash(password);

    await this.adminRepository.create({
      fullName,
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
      root
    });
  }
}
