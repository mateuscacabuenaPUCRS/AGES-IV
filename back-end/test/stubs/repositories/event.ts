import { EventDetails } from "@application/dtos/event/find-by-id";
import { PaginatedEntity } from "@domain/constants/pagination";
import { Event } from "@domain/entities/event";
import { EventRepository } from "@domain/repositories/event";

export class EventRepositoryStub implements EventRepository {
  async update(): Promise<void> {
    return;
  }
  findByURL(): Promise<Event | null> {
    return;
  }
  findByTitle(): Promise<Event | null> {
    return;
  }
  findByTitleAndDate(): Promise<Event | null> {
    return;
  }
  create(): Promise<void> {
    return;
  }
  findById(): Promise<Event | null> {
    return;
  }
  delete(): Promise<void> {
    return;
  }
  findAll(): Promise<PaginatedEntity<EventDetails>> {
    return;
  }
}
