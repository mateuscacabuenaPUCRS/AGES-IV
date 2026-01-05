import { EventDetails } from "@application/dtos/event/find-by-id";
import {
  PaginatedEntity,
  PaginationParams
} from "@domain/constants/pagination";
import { Event } from "@domain/entities/event";

export interface CreateEventParams {
  title: string;
  description: string;
  dateStart: Date;
  dateEnd: Date;
  location: string;
  url: string;
}

export interface UpdateEventParams {
  title?: string;
  description?: string;
  dateStart?: Date;
  dateEnd?: Date;
  location?: string;
  url?: string;
}

export interface EventDetailsResponse {
  id: string;
  title: string;
  description: string;
  dateStart: Date;
  dateEnd: Date;
  location: string;
  url: string;
}

export abstract class EventRepository {
  abstract findByTitle(title: string): Promise<Event | null>;
  abstract findByTitleAndDate(
    title: string,
    dateStart: Date
  ): Promise<Event | null>;
  abstract create(params: CreateEventParams): Promise<void>;
  abstract findById(id: string): Promise<Event | null>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(
    params: PaginationParams
  ): Promise<PaginatedEntity<EventDetails>>;
  abstract update(id: string, params: UpdateEventParams): Promise<void>;
}
