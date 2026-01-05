import { getEvents, type EventAPI } from "@/services/events";
import { getNews, type NewsAPI } from "@/services/news";
import { useCallback, useEffect, useState } from "react";

export function useHome() {
  const [latestNews, setLatestNews] = useState<NewsAPI[]>([]);
  const [lastEvents, setLastEvents] = useState<EventAPI[]>([]);

  const fetchAllData = useCallback(async () => {
    await Promise.all([getLatestNews(), getFeaturedEvents()]);
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  async function getLatestNews() {
    const response = await getNews();

    if (response.data) {
      setLatestNews(response.data);
    }
  }

  async function getFeaturedEvents() {
    const LAST_EVENTS_PAGE_SIZE = 3;

    const response = await getEvents({ pageSize: LAST_EVENTS_PAGE_SIZE });

    if (response.data) {
      setLastEvents(response.data);
    }
  }

  return {
    latestNews,
    lastEvents,
  };
}
