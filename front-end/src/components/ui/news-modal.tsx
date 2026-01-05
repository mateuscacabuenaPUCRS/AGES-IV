import { useState, useEffect } from "react";
import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import excluir1 from "@/assets/excluir1.jpg";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type NewsData = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  url?: string;
};

type NewsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  news: NewsData;
};

export default function NewsModal({ open, onOpenChange, news }: NewsModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageUrl = excluir1;

  const formattedDate = format(new Date(news.date), "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  useEffect(() => {
    if (!open) {
      setImageLoaded(false);
      return;
    }

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true);
  }, [open, imageUrl]);

  return (
    <Modal
      variant="custom"
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={news.title}
      description=""
      footer={
        <div className="w-full -mt-4">
          <div className="relative w-full h-40 mb-4">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-2xl" />
            )}
            <img
              src={imageUrl}
              alt={news.title}
              className={`w-full h-40 object-cover rounded-2xl transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="eager"
            />
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-center gap-2 text-[13px]">
              <span className="font-semibold text-[var(--color-components)]">Data:</span>
              <span className="text-[var(--color-text-2)]">{formattedDate}</span>
            </div>
            {news.location && (
              <div className="flex items-center gap-2 text-[13px]">
                <span className="font-semibold text-[var(--color-components)]">Local:</span>
                <span className="text-[var(--color-text-2)]">{news.location}</span>
              </div>
            )}
          </div>

          <p className="text-[13px] leading-relaxed text-[var(--color-text-2)] mb-4 whitespace-pre-line">
            {news.description}
          </p>

          <div className="flex flex-col gap-2">
            {news.url ? (
              <Button
                variant="quaternary"
                size="large"
                className="w-full"
                onClick={() => {
                  window.open(
                    "https://www.paodospobres.org.br/noticias/",
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
              >
                Ler notícia completa
              </Button>
            ) : null}
            <Button
              variant="tertiary"
              size="large"
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              Fechar
            </Button>
          </div>
        </div>
      }
    />
  );
}
