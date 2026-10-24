
import { TPaginationProps } from "@/types/paginate";
import { ChevronLeft, ChevronRight } from "lucide-react";



const AZPagination = ({
  page,
  total,
  limit,
  onPageChange,
  onLimitChange,
  limitOptions = [5, 10, 20, 50],
  className = "",
}: TPaginationProps) => {
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
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs ${className}`}>
      {/* Entries Info & Per Page Selector */}
      <div className="flex items-center gap-3 text-slate-400 font-medium">
        <span>
          Showing <strong className="text-white font-bold">{startItem}</strong> to{" "}
          <strong className="text-white font-bold">{endItem}</strong> of{" "}
          <strong className="text-white font-bold">{total}</strong> entries
        </span>

        {onLimitChange && (
          <div className="flex items-center gap-1.5 ml-2">
            <span>Per page:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="select select-bordered select-xs font-bold bg-white/5 border-white/10 text-slate-200 rounded-lg focus:outline-none focus:border-amber-400/50"
            >
              {limitOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-[#170d2f] text-slate-200">
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
          className="join-item btn btn-sm bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-400/30 text-slate-300 hover:text-white font-bold gap-1 px-2.5 disabled:bg-white/[0.02] disabled:text-slate-600 disabled:border-white/5"
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
                className="join-item btn btn-sm btn-disabled bg-white/[0.02] text-slate-500 border-white/5 cursor-default"
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
              className={`join-item btn btn-sm font-bold min-w-8 transition-all ${isCurrent
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black border-amber-400/50 shadow-md shadow-amber-500/20"
                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-400/30 text-slate-300 hover:text-white"
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
          className="join-item btn btn-sm bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-400/30 text-slate-300 hover:text-white font-bold gap-1 px-2.5 disabled:bg-white/[0.02] disabled:text-slate-600 disabled:border-white/5"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AZPagination;
