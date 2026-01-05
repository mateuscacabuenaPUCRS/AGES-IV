import { PaginationNavigation } from "./PaginationNavigation";
import { PaginationContent } from "./PaginationContent";
import { PaginationItem } from "./PaginationItem";
import { PaginationLink } from "./PaginationLink";
import { PaginationPrevious } from "./PaginationPrevious";
import { PaginationNext } from "./PaginationNext";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Standard pagination component for use in the entire application.
 *
 * @param currentPage - Current page (starts at 1)
 * @param totalPages - Total pages
 * @param onPageChange - Callback called when the page changes
 * @param className - Additional CSS classes for the container
 *
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={currentPage}
 *   totalPages={10}
 *   onPageChange={(page) => setCurrentPage(page)}
 * />
 * ```
 */
export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getVisiblePages = (): number[] => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage === 1) {
      return [1, 2, 3];
    }

    // Se estiver na penúltima ou última página, mostrar as 3 últimas páginas
    if (currentPage >= totalPages - 1) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }

    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const visiblePages = getVisiblePages();

  return (
    <PaginationNavigation className={className}>
      <PaginationContent className="gap-2">
        <PaginationItem>
          <PaginationPrevious
            size="sm"
            onClick={currentPage === 1 ? undefined : () => onPageChange(currentPage - 1)}
            className={cn(
              "px-3 py-1 text-xs h-7 w-fit rounded-full transition-colors",
              currentPage === 1
                ? "bg-white text-[#F68537] border-[#F68537] cursor-not-allowed"
                : "bg-[#F68537] text-white border-[#F68537]"
            )}
          >
            Anterior
          </PaginationPrevious>
        </PaginationItem>

        {visiblePages.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              size="icon"
              onClick={() => onPageChange(pageNumber)}
              isActive={currentPage === pageNumber}
              className={`px-3 py-1 border rounded-full transition-colors ${
                currentPage === pageNumber
                  ? "bg-white text-[#F68537] border-[#F68537]"
                  : "bg-[#F68537] text-white border-[#F68537]"
              }`}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            size="sm"
            onClick={currentPage === totalPages ? undefined : () => onPageChange(currentPage + 1)}
            className={cn(
              "px-3 py-1 text-xs h-7 w-fit rounded-full transition-colors",
              currentPage === totalPages
                ? "bg-white text-[#F68537] border-[#F68537] cursor-not-allowed"
                : "bg-[#F68537] text-white border-[#F68537]"
            )}
          >
            Próximo
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </PaginationNavigation>
  );
}
