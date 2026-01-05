import { FindAllDonorsResponse } from "@application/dtos/donor/find-all";
import { DonorDetails } from "@application/dtos/donor/find-by-id";
import { PaginationDTO } from "@application/dtos/utils/pagination";
import { DonorRepository } from "@domain/repositories/donor";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllDonorsUseCase {
  constructor(private readonly donorRepository: DonorRepository) {}

  async execute({
    page,
    pageSize
  }: PaginationDTO): Promise<FindAllDonorsResponse> {
    const result = await this.donorRepository.findAll({
      page,
      pageSize
    });

    const mappedData = await Promise.all(
      result.data.map(async (d: DonorDetails) => {
        const totalDonated =
          await this.donorRepository.totalAmountDonatedByDonorId(d.id);
        return {
          ...d,
          totalDonated
        };
      })
    );

    const mapped: FindAllDonorsResponse = {
      ...result,

      data: mappedData
    };

    return mapped;
  }
}
