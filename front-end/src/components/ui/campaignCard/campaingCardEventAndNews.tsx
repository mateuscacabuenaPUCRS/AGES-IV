import { cn } from "@/lib/utils";
import excluir2 from "@/assets/excluir2.png";
import editIcon from "@/assets/editIcon.svg";
import { Delete } from "react-iconly";
import { dateUtils } from "@/utils/dateUtils";

export type CampaignCardEventAndNewsProps = {
  title: string;
  date: Date;
  type: "event" | "news";
  className?: string;
  onDelete?: () => void;
  onEdit?: () => void;
};

export function CampaignCardEventAndNews({
  title,
  date,
  type,
  className,
  onDelete,
  onEdit,
}: CampaignCardEventAndNewsProps) {
  const typeConfig = {
    event: { label: "Evento", color: "#24A254" },
    news: { label: "Notícia", color: "#F68537" },
  }[type];

  const formattedDate = date instanceof Date ? dateUtils.formatCompleteDate(date) : date;

  return (
    <article
      className={cn(
        "flex flex-row w-full bg-white border border-[#e6e8eb] rounded-xl overflow-hidden",
        "min-h-28 sm:h-28",
        "items-stretch",
        className
      )}
      aria-label={`Card ${typeConfig.label}: ${title}`}
      data-testid={`news-event-card-${type}`}
    >
      <div className="w-28 sm:w-32 h-full flex-shrink-0 relative">
        <img
          src={excluir2}
          alt="Imagem de fundo"
          className="h-full w-full object-cover opacity-80"
          style={{
            WebkitMaskImage: "linear-gradient(to right, black 60%, transparent 100%)",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskSize: "100% 100%",
            maskImage: "linear-gradient(to right, black 60%, transparent 100%)",
            maskRepeat: "no-repeat",
            maskSize: "100% 100%",
          }}
        />
      </div>

      <div className="flex-1 flex flex-col justify-center px-3 sm:px-4 py-3 overflow-hidden min-w-0">
        <h3
          className="text-base sm:text-2xl font-semibold text-[#034d6b] leading-snug sm:leading-tight text-left line-clamp-2 mb-1 sm:mb-0"
          title={title}
        >
          {title}
        </h3>
        <div className="flex items-center mt-1 sm:mt-2 flex-wrap gap-1.5 sm:gap-0">
          <span className="text-[10px] sm:text-xs font-medium" style={{ color: typeConfig.color }}>
            {formattedDate}
          </span>
          <span
            className="text-[9px] sm:text-sm text-white px-1.5 sm:px-2 py-0.5 rounded-xl sm:ml-8 whitespace-nowrap"
            style={{ backgroundColor: typeConfig.color }}
          >
            {typeConfig.label}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 pr-2 sm:pr-4">
        <button
          onClick={onDelete}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-[#D65E5E] hover:bg-[#c44f4f] transition flex-shrink-0"
          aria-label="Excluir"
          data-testid="delete-news-event-button"
        >
          <Delete set="light" primaryColor="#ffffff" size={20} />
        </button>

        <button
          onClick={onEdit}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-[#034d6b] hover:bg-[#023a50] transition flex-shrink-0"
          aria-label="Editar"
          data-testid="edit-news-event-button"
        >
          <img src={editIcon} alt="Editar" className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </article>
  );
}
