import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatters";
import { Progress } from "../progress";
import blueHeart from "@/assets/blueHeart.svg";
import orangeHeart from "@/assets/orangeHeart.svg";
import redHeart from "@/assets/redHeart.svg";
import greenHeart from "@/assets/greenHeart.svg";
import { Category } from "react-iconly";
import { Edit2, Eye, X } from "lucide-react";

export type CampaignCardListProps = {
  title: string;
  raised: number;
  goal: number;
  creatorName?: string;
  startDate?: string;
  endDate?: string;
  onAction?: () => void;
  className?: string;
  situation?: "approved" | "pending" | "rejected" | "recurring" | "finished" | "paused";
  progressPercent?: number;
  isAdmin?: boolean;
};

export function CampaignCardList(props: CampaignCardListProps) {
  const {
    situation,
    goal,
    raised,
    creatorName,
    title,
    className,
    progressPercent: percent = 0,
    onAction,
    startDate,
    endDate,
    isAdmin,
  } = props;

  const situationIcons: Record<
    "approved" | "pending" | "rejected" | "recurring" | "finished" | "paused",
    string
  > = {
    approved: blueHeart,
    pending: orangeHeart,
    rejected: redHeart,
    recurring: redHeart,
    finished: greenHeart, // Verde para concluída (sucesso)
    paused: orangeHeart, // Laranja para pausada (atenção)
  };

  return (
    <article
      className={cn(
        "flex flex-col lg:flex-row w-full bg-white border border-[#e6e8eb] rounded-2xl p-4 sm:p-5 lg:p-6 gap-4 lg:gap-6 items-stretch lg:items-center transition-shadow hover:shadow-md",
        className
      )}
      aria-label={`Card lista ${title}`}
    >
      {/* Column 1: Icon + Title/Creator */}
      <div className="flex items-start gap-2 sm:gap-3 flex-shrink-0 min-w-0 w-full lg:w-auto lg:flex-1 lg:max-w-[400px]">
        {situation && (
          <img
            src={situationIcons[situation]}
            alt=""
            className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0 mt-0.5"
          />
        )}
        <div className="flex flex-col items-start min-w-0 flex-1">
          <h3
            className="text-[#034d6b] text-lg sm:text-xl font-semibold text-left w-full overflow-hidden text-ellipsis line-clamp-2"
            title={title}
          >
            {title}
          </h3>
          {creatorName && (
            <p
              className={cn(
                "text-xs sm:text-sm text-left w-full overflow-hidden text-ellipsis whitespace-nowrap mt-0.5 font-medium",
                situation === "recurring" || situation === "rejected"
                  ? "bg-gradient-to-b from-[#FF4A4A] to-[#FF8787] bg-clip-text text-transparent"
                  : situation === "finished"
                    ? "bg-gradient-to-b from-[#16a34a] to-[#4ade80] bg-clip-text text-transparent"
                    : situation === "approved"
                      ? "bg-gradient-to-b from-[#456DFF] to-[#AABCFF] bg-clip-text text-transparent"
                      : situation === "paused"
                        ? "text-gray-600 font-semibold"
                        : "text-[#034d6b]"
              )}
              title={`por ${creatorName}`}
            >
              por {creatorName}
            </p>
          )}
          {startDate && endDate && (
            <p className="text-[10px] sm:text-xs text-[#6b7280] text-left mt-1">
              {formatDate(startDate)} até {formatDate(endDate)}
            </p>
          )}
        </div>
      </div>

      {/* Column 2: Values + Progress Bar */}
      <div className="flex flex-col flex-1 min-w-0 justify-center gap-2">
        <div className="flex flex-wrap justify-between items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold text-[#034d6b] whitespace-nowrap">
            {formatCurrency(raised)}
          </span>
          <span className="text-sm sm:text-base text-[#6b7280] whitespace-nowrap">
            de {formatCurrency(goal)}
          </span>
        </div>
        <div className="w-full">
          {situation === "approved" || situation === "recurring" ? (
            <Progress value={percent} variant="blue" size="large" />
          ) : situation === "finished" ? (
            <div className="flex items-center gap-2">
              <div className="w-full bg-[#e6e8eb] rounded-full overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-green-600 to-green-400 w-full rounded-full"></div>
              </div>
              <div className="text-center text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-green-600 to-green-500 rounded-full py-1 px-3 whitespace-nowrap shadow-md">
                Concluída
              </div>
            </div>
          ) : situation === "paused" ? (
            <div className="text-center text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-gray-500 to-gray-400 rounded-full py-1 px-3 w-fit shadow-md">
              Pausada
            </div>
          ) : situation === "rejected" ? (
            <div className="text-center text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 rounded-full py-1 px-3 w-fit shadow-md">
              Rejeitada
            </div>
          ) : (
            <div className="text-center text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#F6C337] to-[#E5B328] rounded-full py-1 px-3 w-fit shadow-md">
              Pendente Aprovação
            </div>
          )}
        </div>
      </div>

      {/* Column 3: Action Button */}
      <div className="flex-shrink-0 flex items-center justify-end lg:justify-center w-full lg:w-auto">
        <button
          type="button"
          onClick={onAction}
          className={cn(
            "inline-flex items-center justify-center text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer w-full sm:w-auto sm:min-w-[120px] lg:min-w-[44px] lg:w-12 h-11 sm:h-12 px-4 lg:px-0",
            situation === "pending"
              ? "bg-[#F6C337] hover:bg-[#E5B328] text-white focus:ring-[#F6C337]"
              : situation === "rejected"
                ? "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500"
                : situation === "finished"
                  ? "bg-green-600 hover:bg-green-700 text-white focus:ring-green-600"
                  : situation === "paused"
                    ? "bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500"
                    : "bg-[#034d6b] hover:bg-[#023a50] text-white focus:ring-[#034d6b]"
          )}
          aria-label={
            isAdmin
              ? situation === "pending"
                ? "Visualizar campanha pendente"
                : situation === "rejected"
                  ? "Excluir campanha rejeitada"
                  : "Editar campanha"
              : "Ver detalhes da campanha"
          }
        >
          {isAdmin ? (
            situation === "pending" ? (
              <>
                <Eye className="h-5 w-5 lg:block" />
                <span className="ml-2 lg:hidden">Visualizar</span>
              </>
            ) : situation === "rejected" ? (
              <>
                <X className="h-5 w-5 lg:block" />
                <span className="ml-2 lg:hidden">Excluir</span>
              </>
            ) : (
              <>
                <Edit2 className="h-5 w-5 lg:block" />
                <span className="ml-2 lg:hidden">Editar</span>
              </>
            )
          ) : situation === "pending" || situation === "rejected" ? (
            <>
              <Eye className="h-5 w-5 lg:block" />
              <span className="ml-2 lg:hidden">Ver detalhes</span>
            </>
          ) : (
            <>
              <Category set="bold" />
              <span className="ml-2 lg:hidden">Ver detalhes</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}
