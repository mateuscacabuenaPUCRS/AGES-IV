import { EventDetails } from "@application/dtos/event/find-by-id";
import {
  PaginationParams,
  PaginatedEntity
} from "@domain/constants/pagination";
import { Event } from "@domain/entities/event";
import {
  CreateEventParams,
  EventRepository,
  UpdateEventParams
} from "@domain/repositories/event";
import { PrismaService } from "@infra/config/prisma";
import { EventMapper } from "@infra/mappers/prisma/event-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaEventRepository implements EventRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findById(id: string): Promise<Event | null> {
    const event = await this.prisma.events.findUnique({
      where: {
        id
      }
    });

    if (!event) {
      return null;
    }

    return EventMapper.toDomain(event);
  }

  async findAll({
    page,
    pageSize
  }: PaginationParams): Promise<PaginatedEntity<EventDetails>> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { events, total } = await this.prisma.$transaction(async (tx) => {
      const events = await tx.events.findMany({
        where: {
          dateStart: {
            gte: today
          }
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          dateStart: "asc"
        }
      });

      const total = await tx.events.count({
        where: {
          dateStart: {
            gte: today
          }
        }
      });

      return { events, total };
    });

    return {
      data: events.map(EventMapper.toDomain),
      page,
      lastPage: Math.ceil(total / pageSize),
      total
    };
  }
  async findByTitle(title: string): Promise<Event | null> {
    const event = await this.prisma.events.findFirst({
      where: {
        title
      }
    });

    if (!event) {
      return null;
    }

    return EventMapper.toDomain(event);
  }

  async findByTitleAndDate(
    title: string,
    dateStart: Date
  ): Promise<Event | null> {
    const event = await this.prisma.events.findFirst({
      where: {
        title,
        dateStart
      }
    });

    if (!event) {
      return null;
    }

    return EventMapper.toDomain(event);
  }

  async create({
    title,
    description,
    dateStart,
    dateEnd,
    location,
    url
  }: CreateEventParams): Promise<void> {
    await this.prisma.events.create({
      data: {
        title,
        description,
        dateStart,
        dateEnd,
        location,
        url
      }
    });
  }

  async update(id: string, params: UpdateEventParams): Promise<void> {
    const { title, description, dateStart, dateEnd, location, url } = params;

    await this.prisma.events.update({
      where: { id },
      data: {
        title,
        description,
        dateStart,
        dateEnd,
        location,
        url
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.events.delete({
      where: {
        id
      }
    });
  }
}
