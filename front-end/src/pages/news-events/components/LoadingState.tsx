import NewsEventCardSkeleton from "@/skeletons/news-event-card-skeleton";

interface LoadingStateProps {
  count?: number;
}

export function LoadingState({ count = 10 }: LoadingStateProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {Array.from({ length: count }).map((_, index) => (
        <NewsEventCardSkeleton key={index} />
      ))}
    </div>
  );
}



