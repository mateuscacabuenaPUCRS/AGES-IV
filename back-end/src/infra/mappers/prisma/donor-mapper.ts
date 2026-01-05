import { Donor } from "@domain/entities/donor";
import { Donor as PrismaDonor } from "@prisma/client";

export class DonorMapper {
  static toDomain(donor: PrismaDonor): Donor {
    return {
      id: donor.id,
      birthDate: donor.birthDate,
      gender: donor.gender,
      phone: donor.phone,
      cpf: donor.cpf
    };
  }
}
