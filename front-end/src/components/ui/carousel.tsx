import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CarouselApi = UseEmblaCarouselType[1];
type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: CarouselApi;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
};

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel deve ser usado dentro de um <Carousel2 />");
  }
  return context;
}

type CarouselProps = React.HTMLAttributes<HTMLDivElement> & {
  opts?: Parameters<typeof useEmblaCarousel>[0];
};

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ opts, className, children, ...props }, ref) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
      align: "start",
      dragFree: true,
      ...opts,
    });

    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    React.useEffect(() => {
      if (!emblaApi) return;
      const onSelect = () => {
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
      };
      emblaApi.on("select", onSelect);
      emblaApi.on("reInit", onSelect);
      onSelect();
      return () => {
        emblaApi.off("select", onSelect);
        emblaApi.off("reInit", onSelect);
      };
    }, [emblaApi]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef: emblaRef,
          api: emblaApi,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div ref={ref} className={cn("relative group", className)} {...props}>
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { carouselRef } = useCarousel();

    return (
      <div ref={carouselRef} className="overflow-hidden">
        <div ref={ref} className={cn("flex gap-6 px-6 items-center", className)} {...props} />
      </div>
    );
  }
);
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("shrink-0", className)} {...props} />;
  }
);
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { scrollPrev, canScrollPrev } = useCarousel();
  return (
    <button
      ref={ref}
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      className={cn(
        "absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 p-2 shadow-md transition-opacity duration-300 disabled:opacity-0 group-hover:opacity-100 opacity-0",
        className
      )}
      {...props}
    >
      <ChevronLeft className="h-6 w-6 text-gray-800" />
    </button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { scrollNext, canScrollNext } = useCarousel();
    return (
      <button
        ref={ref}
        onClick={scrollNext}
        disabled={!canScrollNext}
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 p-2 shadow-md transition-opacity duration-300 disabled:opacity-0 group-hover:opacity-100 opacity-0",
          className
        )}
        {...props}
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </button>
    );
  }
);
CarouselNext.displayName = "CarouselNext";

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
