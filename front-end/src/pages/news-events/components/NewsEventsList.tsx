import { CampaignCardEventAndNews } from "@/components/ui/campaignCard/campaingCardEventAndNews";
import type { NewsAPI } from "@/services/news";
import type { EventAPI } from "@/services/events";

export type NewsEventItem = {
  id: string;
  title: string;
  date: Date;
  type: "event" | "news";
  originalData: NewsAPI | EventAPI;
};

interface NewsEventsListProps {
  items: NewsEventItem[];
  onDelete: (item: NewsEventItem) => void;
  onEdit: (item: NewsEventItem) => void;
}

export function NewsEventsList({ items, onDelete, onEdit }: NewsEventsListProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {items.map((item) => (
        <CampaignCardEventAndNews
          key={item.id}
          title={item.title}
          date={item.date}
          type={item.type}
          onDelete={() => onDelete(item)}
          onEdit={() => onEdit(item)}
        />
      ))}
    </div>
  );
}



