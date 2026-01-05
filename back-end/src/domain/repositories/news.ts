import { News } from "@domain/entities/news";
import {
  PaginationParams,
  PaginatedEntity
} from "@domain/constants/pagination";

export type CreateNewsParams = {
  title: string;
  description: string;
  date?: Date | null;
  location?: string | null;
  url?: string | null;
};

export type UpdateNewsParams = Partial<CreateNewsParams>;

export abstract class NewsRepository {
  abstract findById(id: string): Promise<News | null>;
  abstract findAll(params: PaginationParams): Promise<PaginatedEntity<News>>;
  abstract create(params: CreateNewsParams): Promise<void>;
  abstract update(id: string, params: UpdateNewsParams): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
