import { DonationResultDto } from "@application/dtos/donor/find-donations-by-donor-id";
import {
  PaginatedEntity,
  PaginationParams
} from "@domain/constants/pagination";
import { Donor } from "@domain/entities/donor";
import { Gender } from "@domain/entities/gender-enum";
import { User } from "@domain/entities/user";
import { UserRole } from "@domain/entities/user-role-enum";

export interface CreateDonorParams {
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
  birthDate: Date;
  gender: Gender;
  phone: string;
  cpf: string;
}

export interface UpdateDonorParams {
  email?: string;
  password?: string;
  fullName?: string;
  birthDate?: Date;
  gender?: Gender;
  phone?: string;
  cpf?: string;
  imageUrl?: string;
}

export interface DonorDetailsResponse {
  id: string;
  email: string;
  fullName: string;
  birthDate: Date;
  gender: Gender;
  phone: string;
  cpf: string;
}

export interface DonorWithUser extends User, Omit<Donor, "id"> {}

export interface DonorMailsResponse {
  email: string;
  fullName: string;
}

export interface DonorWithBirthdayParams {
  day: number;
  month: number;
}

export interface DonorInformationsResponse {
  id: string;
  campaignsTitles: string[];
  createdAt: Date;
}

export abstract class DonorRepository {
  abstract findByCPF(cpf: string): Promise<Donor | null>;
  abstract findByEmail(email: string): Promise<Donor | null>;
  abstract create(params: CreateDonorParams): Promise<void>;
  abstract findById(id: string): Promise<Donor | null>;
  abstract findByIdWithUser(id: string): Promise<DonorWithUser | null>;
  abstract findInformationsById(id: string): Promise<DonorInformationsResponse>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(
    params: PaginationParams
  ): Promise<PaginatedEntity<DonorDetailsResponse>>;
  abstract update(id: string, params: UpdateDonorParams): Promise<void>;
  abstract findAllDonorsMails(): Promise<DonorMailsResponse[]>;
  abstract findAllDonorsWithBirthday(
    params: DonorWithBirthdayParams
  ): Promise<DonorMailsResponse[]>;

  abstract totalAmountDonatedByDonorId(donorId: string): Promise<number>;

  abstract findAllDonationsByDonorId(donorId: string);
}
