import { ExceptionsAdapter } from "@domain/adapters/exception";
import { EventRepository } from "@domain/repositories/event";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeleteEventUseCase {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute(id: string): Promise<void> {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      return this.exceptionService.notFound({
        message: "Event not found"
      });
    }

    await this.eventRepository.delete(id);
  }
}
