import { cn } from "@/lib/utils";
import { Category } from "react-iconly";
import { getUserAvatar } from "@/constant/defaultAvatar";

export type CampaignCardProfileCompactProps = {
  profileName: string;
  role: "donor" | "admin";
  onAction?: () => void;
  className?: string;
  showRole?: boolean;
  email?: string;
  memberSince?: Date;
  imageUrl?: string | null;
};

export function CampaignCardProfileCompact({
  profileName,
  role,
  onAction,
  className,
  showRole,
  email,
  memberSince,
  imageUrl,
}: CampaignCardProfileCompactProps) {
  const roleConfig = {
    donor: {
      long: "Doador",
      short: "Doador",
      bg: "bg-[var(--color-text-success)]",
      text: "text-[var(--color-text-1)]",
    },
    admin: {
      long: "Administrador",
      short: "Admin",
      bg: "bg-[var(--color-text-special-2)]",
      text: "text-[var(--color-text-1)]",
    },
  }[role];

  const handleActionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onAction?.();
    }
  };

  const formatMemberSince = (date?: Date) => {
    if (!date) return "";
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <article
      className={cn(
        "flex flex-row w-full items-center justify-between",
        "bg-[var(--color-background)] border border-[var(--color-components-2)]",
        "rounded-2xl p-3 sm:p-4 gap-2 sm:gap-3",
        "sm:cursor-default cursor-pointer",
        className
      )}
      aria-label={`Card perfil compacto ${profileName}`}
      onClick={() => {
        if (window.innerWidth < 640) {
          onAction?.();
        }
      }}
      onKeyDown={(e) => {
        if (window.innerWidth < 640) {
          handleActionKeyDown(e);
        }
      }}
      tabIndex={window.innerWidth < 640 ? 0 : undefined}
      role={window.innerWidth < 640 ? "button" : undefined}
    >
      {/* Left side: Avatar + Name/Email */}
      <div className="flex items-center min-w-0 flex-1">
        <div className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
          <img
            src={getUserAvatar(imageUrl)}
            alt={`Foto de ${profileName}`}
            className="h-full w-full rounded-full object-cover"
          />
        </div>

        <div className="flex flex-col min-w-0 flex-1 ml-2 sm:ml-3">
          <h3
            className="font-semibold text-[var(--color-brand-dark)] truncate text-sm sm:text-base lg:text-lg text-left"
            title={profileName}
          >
            {profileName}
          </h3>
          {memberSince && (
            <p className="text-[10px] sm:text-xs text-[var(--color-brand-dark)] opacity-70 mt-0.5 text-left">
              Membro desde {formatMemberSince(memberSince)}
            </p>
          )}
          {email && (
            <p
              className="text-[10px] sm:text-xs text-[var(--color-brand-dark)] opacity-70 truncate mt-0.5 text-left"
              title={email}
            >
              {email}
            </p>
          )}
        </div>
      </div>

      {/* Right side: Badge + Action button (fixed width container) */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {showRole && (
          <div
            className={cn(
              "font-semibold rounded-lg py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm text-center whitespace-nowrap flex-shrink-0",
              roleConfig.bg,
              roleConfig.text
            )}
          >
            <span className="sm:hidden">{roleConfig.short}</span>
            <span className="hidden sm:inline">{roleConfig.long}</span>
          </div>
        )}

        <div
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onAction?.();
          }}
          onKeyDown={handleActionKeyDown}
          className={cn(
            "inline-flex items-center justify-center text-sm font-semibold rounded-[10px] transition-colors shadow-sm hover:shadow-lg focus:outline-none cursor-pointer flex-shrink-0",
            "w-9 h-9 sm:w-11 sm:h-11",
            "bg-[#034d6b] hover:bg-[#023a50] text-white"
          )}
        >
          <Category set="bold" size="small" />
        </div>
      </div>
    </article>
  );
}
