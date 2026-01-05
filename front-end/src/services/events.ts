import api from "./api";
import type { PageableResponse } from "./types";

export type EventAPI = {
  id: string;
  title: string;
  description: string;
  location: string;
  url?: string;
  dateStart: string;
  dateEnd: string;
  createdAt: string;
  updatedAt: string;
};

export type GetEventsParams = {
  page?: number;
  pageSize?: number;
  title?: string;
};

export async function getEvents(params?: GetEventsParams): Promise<PageableResponse<EventAPI>> {
  try {
    const response = await api.get<PageableResponse<EventAPI>>("/events", {
      params,
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export type CreateEventData = Omit<EventAPI, "id" | "createdAt" | "updatedAt">;

export type UpdateEventData = {
  title: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  location: string;
  url?: string;
};

export async function createEvent(data: CreateEventData): Promise<EventAPI> {
  try {
    const response = await api.post<EventAPI>("/events", data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateEvent(id: string, data: UpdateEventData): Promise<EventAPI> {
  try {
    const response = await api.patch<EventAPI>(`/events/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    await api.delete(`/events/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
