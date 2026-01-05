import { formatCurrency } from "@/utils/formatCurrency";
import cn from "@/utils/cn";
import { Progress } from "../progress";
import { CampaignCardCompact } from "./campaignCardCompact";
import blueHeart from "@/assets/blueHeart.svg";
import { CampaignCardHistoric } from "./campaignCardHistoric";
import { CampaignCardList } from "./campaignCardList";
import { CampaignCardProfileCompact } from "./campaingCardProfileCompact";
import { CampaignCardEventAndNews } from "./campaingCardEventAndNews";
import type { DonorDonationsAPI } from "@/services/donations";

export type CampaignCardProps = {
  title?: string;
  raised?: number;
  goal?: number;
  creatorName?: string;
  campaignCreator?: string;
  startDate?: string;
  endDate?: string;
  variant?:
    | "default"
    | "profile"
    | "compact"
    | "historic"
    | "list"
    | "profile_compact"
    | "event_news";
  onAction?: () => void;
  className?: string;
  situation?: "approved" | "pending" | "rejected" | "recurring" | "finished" | "paused";
  type?: "event" | "news"; // for "event_news"
  date?: Date;
  isAdmin?: boolean; // to indicate if the user is admin
  // profile (optional)
  role?: "donor" | "admin"; // for "profile_compact"
  donorName?: string;
  donorEmail?: string;
  donationAmount?: number;
  memberSince?: string;
  campaigns?: string[];
  lastDonation?: number;
  periodicity?: DonorDonationsAPI["periodicity"];
  imageUrl?: string | null;
};

export default function CampaignCard({
  title = "",
  raised = 3,
  goal = 0,
  creatorName,
  campaignCreator,
  startDate,
  endDate,
  variant = "default",
  className,
  donorName = "",
  lastDonation = 0,
  situation,
  role,
  periodicity,
  type,
  donationAmount,
  date = new Date(),
  isAdmin = false,
  onAction,
  imageUrl,
}: CampaignCardProps) {
  const percent = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

  // if (variant === "profile") {
  //   return (
  //     <CampaignCardProfile
  //       donorName={donorName}
  //       donorEmail={donorEmail}
  //       donationAmount={donationAmount}
  //       memberSince={memberSince}
  //       campaigns={campaigns}
  //       title={title}
  //       raised={raised}
  //       goal={goal}
  //       className={className}
  //       progressPercent={percent}
  //     />
  //   );
  // }

  if (variant === "compact") {
    return (
      <CampaignCardCompact
        situation={situation}
        goal={goal}
        raised={raised}
        creatorName={creatorName}
        title={title}
        className={className}
        progressPercent={percent}
        onAction={onAction}
      />
    );
  }

  if (variant === "historic") {
    return (
      <CampaignCardHistoric
        situation={situation}
        goal={goal}
        raised={raised}
        creatorName={campaignCreator || creatorName}
        title={title}
        className={className}
        lastDonation={lastDonation}
        donationAmount={donationAmount}
        periodicity={periodicity}
        onAction={onAction}
      />
    );
  }

  if (variant === "list") {
    return (
      <CampaignCardList
        situation={situation}
        goal={goal}
        raised={raised}
        creatorName={creatorName}
        startDate={startDate}
        endDate={endDate}
        title={title}
        className={className}
        progressPercent={percent}
        onAction={onAction}
        isAdmin={isAdmin}
      />
    );
  }

  if (variant === "profile_compact") {
    return (
      <CampaignCardProfileCompact
        profileName={donorName ?? "Usuário"}
        role={role ?? "donor"}
        className={className}
        imageUrl={imageUrl}
      />
    );
  }

  if (variant === "event_news") {
    return (
      <CampaignCardEventAndNews
        title={title}
        date={date as Date}
        type={type ?? "news"}
        className={className}
      />
    );
  }

  return (
    <article
      className={cn("w-full bg-white border border-[#e6e8eb] rounded-2xl p-4", className)}
      role="group"
      aria-label={`Card da campanha ${title}`}
    >
      <div className="flex flex-col gap-4 w-full">
        <div className="flex-1 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 justify-center">
              <div className="h-5 w-5 flex-shrink-0">
                <img src={blueHeart} alt="Coração azul" className="h-5 w-5" />
              </div>
              <h3
                className="text-3xl font-semibold text-[#034d6b] leading-tight overflow-hidden text-ellipsis whitespace-nowrap"
                title={title}
              >
                {title}
              </h3>
            </div>
            {creatorName && (
              <p
                className="mt-1 text-base text-[#f68537] font-semibold text-center overflow-hidden text-ellipsis whitespace-nowrap"
                title={`por ${creatorName}`}
              >
                por {creatorName}
              </p>
            )}
          </div>
          <div className="mt-4 items-center flex flex-col">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#034d6b] whitespace-nowrap">
                {formatCurrency(raised)}
              </span>
              <span className="text-base text-[#6b7280] whitespace-nowrap">
                de {formatCurrency(goal)}
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-6">
            <div className="w-full rounded-full bg-[#e6e8eb] overflow-hidden">
              <Progress value={percent} variant="blue" size="full" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
