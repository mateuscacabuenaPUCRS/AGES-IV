import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatCurrency";
import { Progress } from "../progress";
import blueHeart from "@/assets/blueHeart.svg";
import orangeHeart from "@/assets/orangeHeart.svg";
import redHeart from "@/assets/redHeart.svg";
import greenHeart from "@/assets/greenHeart.svg";

export type CampaignCardCompactProps = {
  title: string;
  raised: number;
  goal: number;
  creatorName?: string;
  onAction?: () => void;
  className?: string;
  situation?: "approved" | "pending" | "rejected" | "recurring" | "finished" | "paused";
  progressPercent?: number;
};

export function CampaignCardCompact(props: CampaignCardCompactProps) {
  const {
    situation,
    raised,
    goal,
    creatorName,
    title,
    className,
    progressPercent: percent = 0,
  } = props;

  const situationIcon =
    situation === "approved"
      ? blueHeart
      : situation === "finished"
        ? greenHeart
        : situation === "pending" || situation === "paused"
          ? orangeHeart
          : situation === "recurring" || situation === "rejected"
            ? redHeart
            : null;

  return (
    <>
      <article
        className={cn(
          "flex flex-col w-full bg-white border border-[#e6e8eb] rounded-2xl p-5 gap-3",
          "md:flex-row md:items-center md:justify-between",
          className
        )}
        aria-label={`Card compacto ${title}`}
      >
        {/* Column 1: Icon + Title/Creator */}
        <div className="flex items-start gap-2 flex-shrink-0 min-w-0 w-full md:w-[280px]">
          {situationIcon && (
            <img src={situationIcon} alt="" className="h-6 w-6 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex flex-col items-start min-w-0 flex-1">
            <div
              className="text-[#034d6b] text-xl font-semibold w-full overflow-hidden text-ellipsis whitespace-nowrap text-left"
              title={title}
            >
              {title}
            </div>
            {creatorName && (
              <div
                className={cn(
                  "text-sm truncate font-medium",
                  situation === "recurring" || situation === "rejected"
                    ? "bg-gradient-to-b from-[#FF4A4A] to-[#FF8787] bg-clip-text text-transparent"
                    : situation === "finished"
                      ? "bg-gradient-to-b from-[#16a34a] to-[#4ade80] bg-clip-text text-transparent"
                      : situation === "approved"
                        ? "bg-gradient-to-b from-[#456DFF] to-[#AABCFF] bg-clip-text text-transparent"
                        : situation === "paused"
                          ? "text-gray-600 font-semibold"
                          : "text-[#f68537]"
                )}
              >
                por {creatorName}
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Values + Progress Bar */}
        <div className="flex flex-col flex-1 min-w-0 justify-center">
          <div className="flex justify-between items-baseline gap-1.5 mb-1">
            <span className="text-lg font-bold text-[#034d6b] whitespace-nowrap">
              {formatCurrency(raised)}
            </span>
            <span className="text-sm text-[#6b7280] whitespace-nowrap">
              de {formatCurrency(goal)}
            </span>
          </div>

          <div className="w-full">
            {situation === "approved" || situation === "recurring" ? (
              <Progress value={percent} variant="blue" size="large" />
            ) : situation === "finished" ? (
              <div className="flex items-center gap-1.5">
                <div className="w-full bg-[#e6e8eb] rounded-full overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-green-600 to-green-400 w-full rounded-full"></div>
                </div>
                <div className="text-center text-xs font-bold text-white bg-gradient-to-r from-green-600 to-green-500 rounded-full py-0.5 px-2 whitespace-nowrap shadow-md">
                  Concluída
                </div>
              </div>
            ) : situation === "paused" ? (
              <div className="text-center text-xs font-semibold text-white bg-gradient-to-r from-gray-500 to-gray-400 rounded-full py-0.5 px-2 w-full max-w-[120px] shadow-md">
                Pausada
              </div>
            ) : situation === "rejected" ? (
              <div className="text-center text-xs font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 rounded-full py-0.5 px-2 w-full max-w-[120px] shadow-md">
                Rejeitada
              </div>
            ) : (
              <div className="text-center text-xs font-semibold text-white bg-gradient-to-r from-[#F6C337] to-[#E5B328] rounded-full py-0.5 px-2 w-full max-w-[140px] shadow-md">
                Pendente Aprovação
              </div>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
