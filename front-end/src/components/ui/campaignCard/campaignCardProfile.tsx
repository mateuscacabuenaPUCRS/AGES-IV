import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatCurrency";
import Button from "../button";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

export type CampaignCardProfileProps = {
  raised: number;
  creatorName?: string;
  onAction?: () => void;
  className?: string;
  donorName: string;
  donorEmail: string;
  memberSince: string;
  campaigns: string[];
};

export function CampaignCardProfile({
  raised,
  className,
  donorName,
  donorEmail,
  memberSince = "DD/MM/AAAA",
  campaigns = [],
}: CampaignCardProfileProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [showAllCampaigns, setShowAllCampaigns] = useState(false);

  const displayedCampaigns = showAllCampaigns ? campaigns : campaigns.slice(0, 3);
  const hasMoreCampaigns = campaigns.length > 3;

  return (
    <article
      className={cn("w-full bg-white border border-[#e6e8eb] rounded-2xl", className)}
      role="group"
      aria-label={`Perfil do doador ${donorName ?? ""}`}
    >
      <div>
        <div
          className="flex gap-4 cursor-pointer relative p-4 items-center"
          onClick={() => setDetailsOpen((v) => !v)}
          id="profile-card-header"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setDetailsOpen((v) => !v);
            }
          }}
          aria-expanded={detailsOpen}
          aria-controls="profile-card-details"
        >
          <div>
            <div
              className="h-12 w-12 rounded-full bg-[#00d1d3] flex items-center justify-center text-white font-semibold"
              aria-hidden
            >
              {donorName
                ? donorName
                    .split(" ")
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join("")
                : "U"}
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 w-full">
            <div>
              <div className="text-left font-semibold text-[#034d6b]">
                {donorName ?? "Fulano De Tal"}
              </div>
              <div className="text-sm font-semibold text-[#6b7280]">
                {donorEmail ?? "email@email.com"}
              </div>
            </div>

            <div className="text-right">
              <div className="text-left text-lg font-bold text-[#034d6b]">
                {raised ? formatCurrency(raised) : "+0,00"}
              </div>
              <div className="text-sm text-left text-[#f68537] font-semibold">doados até agora</div>
            </div>
          </div>
          <div
            className={cn(
              "text-[#6b7280] transition-transform transform duration-200 content-center items-center justify-center",
              detailsOpen ? "rotate-180" : "rotate-0"
            )}
          >
            <ChevronDownIcon />
          </div>
        </div>

        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-in-out",
            detailsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
          id="profile-card-details"
          aria-hidden={!detailsOpen}
        >
          <div className="overflow-hidden rounded-b-2xl">
            <div className="text-[#005172] bg-[#DEDEDE] pb-4 pl-4 pr-4">
              <div className="flex flex-col mt-3 font-semibold text-[var(--color-text-muted)] w-full text-left pt-3">
                <div className="flex items-start gap-3 mb-3">
                  <div className="font-bold whitespace-nowrap leading-snug">
                    Campanhas <br /> recorrentes:
                  </div>
                  <ul className="list-disc list-inside text-sm font-normal">
                    {displayedCampaigns.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                    {hasMoreCampaigns && (
                      <li
                        className="text-[#007b83] cursor-pointer hover:underline font-semibold mt-1"
                        onClick={() => setShowAllCampaigns(!showAllCampaigns)}
                      >
                        {showAllCampaigns ? "Ver menos" : "Ver mais"}
                      </li>
                    )}
                  </ul>
                </div>
                <div className="flex mt-2 font-semibold items-center justify-between">
                  <div>Membro desde: {memberSince ?? "DD/MM/AAAA"}</div>
                  <div>
                    <Button
                      onClick={() => (window.location.href = "/perfil")}
                      variant="secondary"
                      size="small"
                    >
                      Visualizar perfil
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
