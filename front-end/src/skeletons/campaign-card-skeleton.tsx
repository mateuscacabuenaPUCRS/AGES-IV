export default function CampaignCardSkeleton() {
  return (
    <article className="flex flex-col md:flex-row w-full bg-white border border-[#e6e8eb] rounded-2xl p-4 md:p-5 items-start md:items-center justify-between gap-3 animate-pulse">
      {/* Column 1: Icon + Title/Creator */}
      <div className="flex items-start gap-2 flex-shrink-0 min-w-0 w-full md:w-[320px]">
        <div className="h-6 w-6 flex-shrink-0 mt-0.5 bg-gray-200 rounded-full" />
        <div className="flex flex-col items-start min-w-0 flex-1 gap-2">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-2/3 mt-1" />
        </div>
      </div>

      {/* Column 2: Values + Progress Bar */}
      <div className="flex flex-col flex-1 min-w-0 justify-center gap-2">
        <div className="flex justify-between items-center gap-1.5">
          <div className="h-6 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full" />
      </div>

      {/* Column 3: Action Button */}
      <div className="flex-shrink-0 flex items-center">
        <div className="min-w-[44px] h-10 sm:h-11 md:h-12 bg-gray-200 rounded-[10px]" />
      </div>
    </article>
  );
}
