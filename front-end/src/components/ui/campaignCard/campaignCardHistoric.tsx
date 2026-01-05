import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatCurrency";
import blueHeart from "@/assets/blueHeart.svg";
import orangeHeart from "@/assets/orangeHeart.svg";
import redHeart from "@/assets/redHeart.svg";
import greenHeart from "@/assets/greenHeart.svg";
import cancelIcon from "@/assets/cancelIcon.svg";
import type { DonorDonationsAPI } from "@/services/donations";
import { useState } from "react";
import ConfirmCancelRecurringModal from "../confirm-cancel-recurring-modal";

export type CampaignCardHistoricProps = {
  title: string;
  raised: number;
  goal: number;
  creatorName?: string;
  className?: string;
  situation?: "approved" | "pending" | "rejected" | "recurring" | "finished" | "paused";
  lastDonation?: number;
  donationAmount?: number;
  periodicity?: DonorDonationsAPI["periodicity"];
  onAction?: () => void;
};

const periodicityMapper: Record<string, string> = {
  MONTHLY: "Mensal",
  QUARTERLY: "Trimestral",
  SEMI_ANNUAL: "Semestral",
  YEARLY: "Anual",
  CANCELED: "Cancelada",
};

export function CampaignCardHistoric(props: CampaignCardHistoricProps) {
  const { creatorName, title, className, donationAmount, periodicity, onAction } = props;

  const [showCancelModal, setShowCancelModal] = useState(false);

  const isRecurring = periodicity !== null && periodicity !== undefined;
  const displayLabel =
    periodicity && periodicity !== "CANCELED" ? periodicityMapper[periodicity] || "Única" : "Única";
  const displaySituation = isRecurring ? "recurring" : "approved";

  const gradientTextClass =
    displaySituation === "recurring"
      ? "bg-gradient-to-b from-[#FF4A4A] to-[#FF8787] bg-clip-text text-transparent"
      : "bg-gradient-to-b from-[#456DFF] to-[#AABCFF] bg-clip-text text-transparent";

  const renderIcon = () => {
    const map: Record<string, string | undefined> = {
      approved: blueHeart,
      finished: greenHeart,
      pending: orangeHeart,
      paused: orangeHeart,
      recurring: redHeart,
      rejected: redHeart,
    };
    const src = displaySituation ? map[displaySituation] : undefined;
    if (!src) return null;
    return (
      <div className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0">
        <img src={src} alt="" className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>
    );
  };

  return (
    <>
      <article
        className={cn(
          "w-full bg-white border border-[#e6e8eb] rounded-2xl",
          "p-3 sm:p-4 md:p-5",
          "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4",
          className
        )}
        aria-label={`Card histórico ${title}`}
      >
        {/* Left section: Icon + Title + Creator */}
        <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="flex-shrink-0">{renderIcon()}</div>
          <div className="flex flex-col items-start justify-center min-w-0 flex-1">
            <h3 className="text-[#034d6b] font-semibold text-left text-base sm:text-lg md:text-xl leading-tight truncate w-full">
              {title}
            </h3>
            {creatorName && (
              <p className="text-[#f68537] font-medium text-left text-xs sm:text-sm truncate w-full mt-1">
                por {creatorName}
              </p>
            )}
          </div>
        </div>

        {/* Right section: Periodicity + Amount + Cancel Button */}
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 md:gap-4 flex-shrink-0 ml-7 sm:ml-0">
          {/* Periodicity and Amount */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span
              className={cn(
                "text-sm sm:text-base md:text-lg font-semibold whitespace-nowrap",
                gradientTextClass
              )}
            >
              {displayLabel}
            </span>
            {donationAmount !== undefined && (
              <span
                className={cn(
                  "text-base sm:text-lg md:text-xl font-bold whitespace-nowrap",
                  gradientTextClass
                )}
              >
                +{formatCurrency(donationAmount ?? 0)}
              </span>
            )}
          </div>

          {/* Cancel Button */}
          {periodicity !== null && periodicity !== undefined && periodicity !== "CANCELED" && (
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className={cn(
                "inline-flex items-center justify-center rounded-lg transition-colors shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#D65E5E] focus:ring-offset-2",
                "w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11",
                "bg-[#D65E5E] hover:bg-[#c44f4f] text-white flex-shrink-0"
              )}
              aria-label="Cancelar doação recorrente"
            >
              <img
                src={cancelIcon}
                alt=""
                className="h-4 w-4 sm:h-[18px] sm:w-[18px] md:h-5 md:w-5"
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </article>

      <ConfirmCancelRecurringModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => {
          setShowCancelModal(false);
          onAction?.();
        }}
      />
    </>
  );
}
