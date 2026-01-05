import { Event } from "@domain/entities/event";
import { Events as PrismaEvents } from "@prisma/client";

export class EventMapper {
  static toDomain(event: PrismaEvents): Event {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      dateStart: event.dateStart,
      dateEnd: event.dateEnd,
      location: event.location,
      url: event.url,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    };
  }
}
