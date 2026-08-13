import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  /** Current active page (1-based) */
  page: number;
  /** Total number of items across all pages */
  total: number;
  /** Number of items displayed per page */
  limit: number;
  /** Callback triggered when a user changes page */
  onPageChange: (newPage: number) => void;
  /** Optional callback triggered when limit per page changes */
  onLimitChange?: (newLimit: number) => void;
  /** Preset options for items per page dropdown (default: [5, 10, 20, 50]) */
  limitOptions?: number[];
  /** Custom container class */
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  total,
  limit,
  onPageChange,
  onLimitChange,
  limitOptions = [5, 10, 20, 50],
  className = "",
}) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const startItem = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  // Generate page numbers with ellipsis
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-base-200 text-xs ${className}`}>
      {/* Entries Info & Per Page Selector */}
      <div className="flex items-center gap-3 text-base-content/70 font-medium">
        <span>
          Showing <strong className="text-base-content font-bold">{startItem}</strong> to{" "}
          <strong className="text-base-content font-bold">{endItem}</strong> of{" "}
          <strong className="text-base-content font-bold">{total}</strong> entries
        </span>

        {onLimitChange && (
          <div className="flex items-center gap-1.5 ml-2">
            <span>Per page:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="select select-bordered select-xs font-bold focus:outline-none focus:border-primary"
            >
              {limitOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* DaisyUI Join Pagination Control */}
      <div className="join">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="join-item btn btn-sm btn-outline border-base-300 font-bold gap-1 px-2.5 disabled:bg-base-200/50"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page Buttons */}
        {pages.map((p, idx) => {
          if (p === "...") {
            return (
              <button
                key={`ellipsis-${idx}`}
                disabled
                className="join-item btn btn-sm btn-disabled bg-base-200/40 text-base-content/40 border-base-300 cursor-default"
              >
                ...
              </button>
            );
          }

          const isCurrent = p === currentPage;
          return (
            <button
              key={`page-${p}`}
              type="button"
              onClick={() => onPageChange(p as number)}
              className={`join-item btn btn-sm font-bold min-w-8 ${
                isCurrent
                  ? "btn-primary shadow-sm"
                  : "btn-outline border-base-300 hover:bg-base-200"
              }`}
            >
              {p}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="join-item btn btn-sm btn-outline border-base-300 font-bold gap-1 px-2.5 disabled:bg-base-200/50"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
