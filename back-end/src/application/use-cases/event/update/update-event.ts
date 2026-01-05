import { UpdateEventDTO } from "@application/dtos/event/update";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { EventRepository } from "@domain/repositories/event";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UpdateEventUseCase {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute(id: string, params: UpdateEventDTO): Promise<void> {
    const { title, dateStart, dateEnd, location, description } = params;

    const event = await this.eventRepository.findById(id);

    if (!event) {
      return this.exceptionService.notFound({
        message: "Event not found"
      });
    }

    if (title && title !== event.title) {
      const eventWithTitle = await this.eventRepository.findByTitleAndDate(
        title,
        dateStart
      );
      if (eventWithTitle) {
        return this.exceptionService.conflict({
          message: "Event title for date already used"
        });
      }
    }

    if (dateStart && dateStart < new Date()) {
      return this.exceptionService.badRequest({
        message: "Event starting date must be today or in the future"
      });
    }

    if (dateEnd && dateEnd < (dateStart ?? event.dateStart)) {
      return this.exceptionService.badRequest({
        message: "Event ending date must be after the starting date"
      });
    }

    await this.eventRepository.update(id, {
      title,
      dateStart,
      dateEnd,
      location,
      description
    });
  }
}
