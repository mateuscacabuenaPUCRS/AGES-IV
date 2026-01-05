import { CreateDonorDTO } from "@application/dtos/donor/create";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { HashAdapter } from "@domain/adapters/hash";
import { UserRole } from "@domain/entities/user-role-enum";
import { DonorRepository } from "@domain/repositories/donor";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateDonorUseCase {
  constructor(
    private readonly donorRepository: DonorRepository,
    private readonly hashService: HashAdapter,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute({
    birthDate,
    cpf,
    email,
    fullName,
    gender,
    password,
    phone
  }: CreateDonorDTO): Promise<void> {
    const emailAlreadyUsed = await this.donorRepository.findByEmail(email);

    if (emailAlreadyUsed) {
      return this.exceptionService.conflict({
        message: "Email already used"
      });
    }

    const cpfAlreadyUsed = await this.donorRepository.findByCPF(cpf);

    if (cpfAlreadyUsed) {
      return this.exceptionService.conflict({
        message: "CPF already used"
      });
    }

    if (birthDate >= new Date()) {
      return this.exceptionService.badRequest({
        message: "Birth date must be before than today"
      });
    }

    const passwordHashed = await this.hashService.generateHash(password);

    await this.donorRepository.create({
      email,
      password: passwordHashed,
      role: UserRole.DONOR,
      birthDate,
      cpf,
      fullName,
      gender,
      phone
    });
  }
}
