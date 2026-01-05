import { UpdateDonorDTO } from "@application/dtos/donor/update";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { HashAdapter } from "@domain/adapters/hash";
import { DonorRepository } from "@domain/repositories/donor";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UpdateDonorUseCase {
  constructor(
    private readonly donorRepository: DonorRepository,
    private readonly hashService: HashAdapter,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute(id: string, params: UpdateDonorDTO): Promise<void> {
    const { birthDate, cpf, email, fullName, gender, password, phone } = params;

    const donor = await this.donorRepository.findByIdWithUser(id);

    if (!donor) {
      return this.exceptionService.notFound({
        message: "Donor not found"
      });
    }

    if (email && email !== donor.email) {
      const emailAlreadyUsed = await this.donorRepository.findByEmail(email);

      if (emailAlreadyUsed) {
        return this.exceptionService.conflict({
          message: "Email already used"
        });
      }
    }

    if (cpf && cpf !== donor.cpf) {
      const cpfAlreadyUsed = await this.donorRepository.findByCPF(cpf);

      if (cpfAlreadyUsed) {
        return this.exceptionService.conflict({
          message: "CPF already used"
        });
      }
    }

    if (birthDate && birthDate >= new Date()) {
      return this.exceptionService.badRequest({
        message: "Birth date must be before than today"
      });
    }

    let passwordHashed = donor.password;

    if (password) {
      passwordHashed = await this.hashService.generateHash(password);
    }

    await this.donorRepository.update(id, {
      birthDate,
      cpf,
      email,
      fullName,
      gender,
      password: passwordHashed,
      phone
    });
  }
}
