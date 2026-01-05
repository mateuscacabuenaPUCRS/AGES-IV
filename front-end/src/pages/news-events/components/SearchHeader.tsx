import { SearchBar } from "@/components/ui/search-bar";
import PlusIcon from "@/assets/Plus.png";
import { ArrowUpDown } from "lucide-react";

interface SearchHeaderProps {
  sortOrder: "recent" | "oldest";
  onSortChange: () => void;
  onCreateClick: () => void;
}

export function SearchHeader({ sortOrder, onSortChange, onCreateClick }: SearchHeaderProps) {
  return (
    <div className="flex w-full items-center gap-2 sm:gap-4 my-5">
      <div className="flex-1">
        <SearchBar />
      </div>

      <button
        onClick={onSortChange}
        className="min-h-10 min-w-10 px-2 sm:px-4 bg-[var(--color-text-special-2)] text-white flex items-center justify-center gap-2 rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md hover:opacity-90 flex-shrink-0"
        title={sortOrder === "recent" ? "Ordenar por mais antigos" : "Ordenar por mais recentes"}
        data-testid="sort-button"
      >
        <ArrowUpDown className="h-4 w-4" />
        <span className="text-sm font-medium hidden sm:inline whitespace-nowrap">
          {sortOrder === "recent" ? "Mais recentes" : "Mais antigos"}
        </span>
      </button>

      <div
        role="button"
        className="min-h-10 min-w-10 bg-[var(--color-text-special-2)] flex items-center justify-center rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md hover:opacity-90 flex-shrink-0"
        onClick={onCreateClick}
        data-testid="create-button"
      >
        <img src={PlusIcon} alt="Plus Icon" className="h-4 w-4" />
      </div>
    </div>
  );
}
