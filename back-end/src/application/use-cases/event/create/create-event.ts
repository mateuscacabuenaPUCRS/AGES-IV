import { CreateEventDTO } from "@application/dtos/event/create";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { EventRepository } from "@domain/repositories/event";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateEventUseCase {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute({
    title,
    description,
    location,
    dateStart,
    dateEnd,
    url
  }: CreateEventDTO): Promise<void> {
    const existingEvent = await this.eventRepository.findByTitleAndDate(
      title,
      dateStart
    );

    if (existingEvent) {
      return this.exceptionService.conflict({
        message: "Event with this title and date already exists"
      });
    }

    if (dateStart < new Date()) {
      return this.exceptionService.badRequest({
        message: "Event starting date must be in the future"
      });
    }

    if (dateEnd < dateStart) {
      return this.exceptionService.badRequest({
        message: "Event ending date must be after or the starting date"
      });
    }

    await this.eventRepository.create({
      title,
      description,
      location,
      dateStart,
      dateEnd,
      url
    });
  }
}
