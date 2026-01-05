export default function NewsEventCardSkeleton() {
  return (
    <article className="flex flex-row w-full bg-white border border-[#e6e8eb] rounded-xl overflow-hidden h-28 items-stretch animate-pulse">
      <div className="w-28 h-full flex-shrink-0 bg-gray-200" />

      <div className="flex-1 flex flex-col justify-center px-4 py-3 gap-2">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="flex items-center gap-2 mt-1">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-5 bg-gray-200 rounded-xl w-16" />
        </div>
      </div>

      <div className="flex items-center gap-2 pr-4">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-200" />
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-200" />
      </div>
    </article>
  );
}
