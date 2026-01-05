import api from "./api";
import type { PageableResponse } from "./types";

export type NewsAPI = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  url?: string;
};

export type GetNewsParams = {
  page?: number;
  pageSize?: number;
  title?: string;
};

export async function getNews(params?: GetNewsParams): Promise<PageableResponse<NewsAPI>> {
  try {
    const response = await api.get<PageableResponse<NewsAPI>>("/news", {
      params,
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export type CreateNewsData = Omit<NewsAPI, "id">;

export type UpdateNewsData = {
  title: string;
  description: string;
  date: string;
  location: string;
  url?: string;
};

export async function createNews(data: CreateNewsData): Promise<NewsAPI> {
  try {
    const response = await api.post<NewsAPI>("/news", data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateNews(id: string, data: UpdateNewsData): Promise<NewsAPI> {
  try {
    const response = await api.patch<NewsAPI>(`/news/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteNews(id: string): Promise<void> {
  try {
    await api.delete(`/news/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
