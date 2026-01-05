import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import NewsItem from "@/components/ui/news-item";
import NewsModal from "@/components/ui/news-modal";
import type { NewsAPI } from "@/services/news";
import { getNewsImage } from "@/constant/defaultImages";

interface NewsProps {
  news: NewsAPI[];
}

export const News = ({ news }: NewsProps) => {
  const [selectedNews, setSelectedNews] = useState<NewsAPI | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewsClick = (newsItem: NewsAPI) => {
    setSelectedNews(newsItem);
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className="bg-[var(--color-components-2)] flex flex-col items-center 
    px-6 md:px-12 lg:px-24 
    pt-2 md:pt-4 lg:pt-6 
    pb-6 md:pb-12 lg:pb-24
    gap-10 h-full w-full"
      >
        <h2
          className="
      text-[var(--color-components)] font-manrope font-bold 
      text-3xl leading-[48px] tracking-[0.5px] 
      self-center md:self-start
      text-center md:text-start md:block hidden"
        >
          O QUE ACONTENCE NO PÃO DOS POBRES?
        </h2>
        <h2
          className="
      text-[var(--color-components)] font-manrope font-bold 
      text-3xl leading-[48px] tracking-[0.5px] 
      self-center md:self-start
      text-center md:text-start block md:hidden"
        >
          NOTÍCIAS:
        </h2>

        <Carousel
          className="w-full"
          opts={{
            align: "start",
            loop: false,
          }}
          data-testid="news-carousel"
        >
          <CarouselContent>
            {news.map((newsItem) => (
              <CarouselItem key={newsItem.id}>
                <NewsItem
                  imageUrl={getNewsImage(null)}
                  title={newsItem.title}
                  onClick={() => handleNewsClick(newsItem)}
                  data-testid={`news-card-${newsItem.id}`}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious data-testid="news-prev-button" />
          <CarouselNext data-testid="news-next-button" />
        </Carousel>
      </div>

      {selectedNews && (
        <NewsModal open={isModalOpen} onOpenChange={setIsModalOpen} news={selectedNews} />
      )}
    </>
  );
};
