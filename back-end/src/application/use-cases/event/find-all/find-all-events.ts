import { FindAllEventsResponse } from "@application/dtos/event/find-all";
import { PaginationDTO } from "@application/dtos/utils/pagination";
import { EventRepository } from "@domain/repositories/event";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllEventsUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute({
    page,
    pageSize
  }: PaginationDTO): Promise<FindAllEventsResponse> {
    return await this.eventRepository.findAll({
      page,
      pageSize
    });
  }
}
