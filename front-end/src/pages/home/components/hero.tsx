import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type HeroItem = {
  id?: string | number;
  imageUrl: string;
  title: string;
  description?: string;
  location?: string;
  date?: string;
  time?: string;
  imageAlt?: string;
  buttonLabel?: string;
  buttonLink?: string;
  overlayClassName?: string;
};

export type HeroProps = {
  items: HeroItem[];
  className?: string;
  showArrows?: boolean;
  showIndicators?: boolean;
};

export function Hero({ items, className, showArrows = true, showIndicators = true }: HeroProps) {
  const [index, setIndex] = React.useState(0);
  const count = items.length;

  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const userActionTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const startAutoplay = React.useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 6000);
  }, [count]);

  const resetAutoplay = React.useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (userActionTimeoutRef.current) clearTimeout(userActionTimeoutRef.current);
    userActionTimeoutRef.current = setTimeout(startAutoplay, 15000);
  }, [startAutoplay]);

  React.useEffect(() => {
    if (count <= 1) return;
    startAutoplay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (userActionTimeoutRef.current) clearTimeout(userActionTimeoutRef.current);
    };
  }, [count, startAutoplay]);

  const go = (dir: -1 | 1) => {
    setIndex((i) => {
      const next = i + dir;
      if (next < 0) return count - 1;
      if (next >= count) return 0;
      return next;
    });
    resetAutoplay();
  };

  const handleIndicatorClick = (newIndex: number) => {
    setIndex(newIndex);
    resetAutoplay();
  };

  const startX = React.useRef<number | null>(null);
  const startY = React.useRef<number | null>(null);
  const swiping = React.useRef(false);

  const onTouchStart: React.TouchEventHandler = (e) => {
    const t = e.touches[0];
    startX.current = t.clientX;
    startY.current = t.clientY;
    swiping.current = false;
  };

  const onTouchMove: React.TouchEventHandler = (e) => {
    if (startX.current == null || startY.current == null) return;
    const t = e.touches[0];
    const dx = t.clientX - startX.current;
    const dy = t.clientY - startY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
      swiping.current = true;
      e.preventDefault();
    }
  };

  const onTouchEnd: React.TouchEventHandler = (e) => {
    if (startX.current == null || startY.current == null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX.current;
    const dy = t.clientY - startY.current;
    const THRESHOLD = 40;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > THRESHOLD) {
      if (dx > 0) go(-1);
      else go(1);
    }
    startX.current = null;
    startY.current = null;
    swiping.current = false;
  };

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };

  return (
    <section
      aria-roledescription={count > 1 ? "carousel" : undefined}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={cn(
        "relative w-full h-[60svh] min-h-[480px] overflow-hidden bg-black group",
        className
      )}
    >
      <div className="absolute inset-0">
        {items.map((item, i) => {
          const visible = i === index;
          const hasInfo = !!(item.location || item.date || item.time);

          return (
            <article
              key={item.id ?? i}
              aria-roledescription="slide"
              aria-hidden={!visible}
              className={cn(
                "absolute inset-0 transition-opacity duration-300",
                visible ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              <img
                src={item.imageUrl}
                alt={item.imageAlt ?? ""}
                className="absolute inset-0 h-full w-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
                onError={() => console.warn("Falha ao carregar imagem:", item.imageUrl)}
              />
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/60",
                  item.overlayClassName
                )}
                aria-hidden
              />
              <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid h-full w-full items-center gap-4 sm:gap-6 md:grid-cols-12">
                  <div className="md:col-span-7 lg:col-span-8 max-w-xl self-center">
                    <h1 className="text-balance max-w-[22ch] sm:max-w-[26ch] lg:max-w-[30ch] text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white drop-shadow">
                      {item.title}
                    </h1>
                    {item.description && (
                      <p className="mt-3 max-w-2xl text-pretty text-sm/6 sm:text-base/7 md:text-lg/8 text-white px-4 py-2 inline-block bg-[#00D1D3]/90 rounded-lg ">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {hasInfo && (
                    <div className="md:col-span-5 lg:col-span-4 self-center">
                      <div className="ml-auto max-w-sm rounded-xl bg-[#00D1D3]/70 p-4 backdrop-blur-md shadow-lg">
                        <dl className="space-y-3 text-sm text-white">
                          {item.location && (
                            <div>
                              <div className="flex items-center gap-2">
                                <span aria-hidden className="inline-block h-5 w-5">
                                  <svg
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5 fill-none stroke-current"
                                  >
                                    <path
                                      d="M12 21s7-6.17 7-11a7 7 0 1 0-14 0c0 4.83 7 11 7 11Z"
                                      strokeWidth="1.5"
                                    />
                                    <circle cx="12" cy="10" r="2.5" strokeWidth="1.5" />
                                  </svg>
                                </span>
                                <dt className="font-medium">Local</dt>
                              </div>
                              <dd className="mt-1 pl-7 text-left text-white">{item.location}</dd>
                            </div>
                          )}

                          {item.date && (
                            <div>
                              <div className="flex items-center gap-2">
                                <span aria-hidden className="inline-block h-5 w-5">
                                  <svg
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5 fill-none stroke-current"
                                  >
                                    <rect
                                      x="3"
                                      y="4"
                                      width="18"
                                      height="18"
                                      rx="2"
                                      strokeWidth="1.5"
                                    />
                                    <path d="M8 2v4M16 2v4M3 10h18" strokeWidth="1.5" />
                                  </svg>
                                </span>
                                <dt className="font-medium">Data</dt>
                              </div>
                              <dd className="mt-1 pl-7 text-left text-white">{item.date}</dd>
                            </div>
                          )}

                          {item.time && (
                            <div>
                              <div className="flex items-center gap-2">
                                <span aria-hidden className="inline-block h-5 w-5">
                                  <svg
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5 fill-none stroke-current"
                                  >
                                    <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
                                    <path d="M12 7v5l3 2" strokeWidth="1.5" />
                                  </svg>
                                </span>
                                <dt className="font-medium">Horário</dt>
                              </div>
                              <dd className="mt-1 pl-7 text-left text-white">{item.time}</dd>
                            </div>
                          )}
                        </dl>
                      </div>

                      <div className="mt-4">
                        <Button
                          size="small"
                          variant="quaternary"
                          onClick={() => window.open(item.buttonLink!)}
                          data-testid="hero-event-button"
                        >
                          {item.buttonLabel}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {showArrows && count > 1 && (
        <div
          className={cn(
            "absolute inset-0 z-20 flex items-center justify-between px-2 md:px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          )}
        >
          <Button
            aria-label="Slide anterior"
            size="icon"
            variant="secondary"
            onClick={() => go(-1)}
            className="pointer-events-auto rounded-full bg-white/85 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/80 [@media(hover:none)]:opacity-100"
            data-testid="hero-prev-button"
          >
            <ChevronLeft className="h-5 w-5 text-gray-900" />
          </Button>

          <Button
            aria-label="Próximo slide"
            size="icon"
            variant="secondary"
            onClick={() => go(1)}
            className="pointer-events-auto rounded-full bg-white/85 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/80 [@media(hover:none)]:opacity-100"
            data-testid="hero-next-button"
          >
            <ChevronRight className="h-5 w-5 text-gray-900" />
          </Button>
        </div>
      )}

      {showIndicators && count > 1 && (
        <div className="hidden sm:pointer-events-none sm:absolute sm:bottom-4 sm:left-0 sm:right-0 sm:z-30 sm:flex sm:items-center sm:justify-center sm:gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              aria-label={`Ir para o slide ${i + 1}`}
              onClick={() => handleIndicatorClick(i)}
              className={cn(
                "pointer-events-auto h-2.5 w-2.5 rounded-full border border-white/70 transition",
                i === index ? "bg-white" : "bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
