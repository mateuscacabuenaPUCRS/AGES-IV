import { FindAllAdminsResponse } from "@application/dtos/admin/find-all";
import { PaginationDTO } from "@application/dtos/utils/pagination";
import { AdminRepository } from "@domain/repositories/admin";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllAdminsUseCase {
  constructor(private readonly adminRepository: AdminRepository) {}

  async execute({
    page,
    pageSize
  }: PaginationDTO): Promise<FindAllAdminsResponse> {
    return await this.adminRepository.findAll({
      page,
      pageSize
    });
  }
}
