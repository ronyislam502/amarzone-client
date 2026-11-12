"use client";

import React from "react";
import { TPaginationProps } from "@/types/paginate";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AZPagination = ({
  page,
  total,
  limit,
  onPageChange,
  onLimitChange,
  limitOptions = [6, 12, 24, 48],
  className = "",
  theme = "dark",
}: TPaginationProps) => {
  const safeLimit = Math.max(1, limit || 12);
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const startItem = total === 0 ? 0 : (currentPage - 1) * safeLimit + 1;
  const endItem = Math.min(currentPage * safeLimit, total);

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
  const isLight = theme === "light";

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 select-none text-xs ${isLight
          ? "border-t border-slate-200/80 pt-4 text-slate-600"
          : "border-t border-white/10 pt-4 text-slate-400"
        } ${className}`}
    >
      {/* Entries Info & Per Page Selector */}
      <div className="flex items-center gap-3 font-medium flex-wrap">
        <span>
          Showing{" "}
          <strong className={isLight ? "text-slate-900 font-bold" : "text-white font-bold"}>
            {startItem}
          </strong>{" "}
          to{" "}
          <strong className={isLight ? "text-slate-900 font-bold" : "text-white font-bold"}>
            {endItem}
          </strong>{" "}
          of{" "}
          <strong className={isLight ? "text-slate-900 font-bold" : "text-white font-bold"}>
            {total}
          </strong>{" "}
          entries
        </span>

        {onLimitChange && (
          <div className="flex items-center gap-1.5 ml-2">
            <span>Per page:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className={`select select-bordered select-xs font-bold rounded-lg focus:outline-none ${isLight
                  ? "bg-slate-50 border-slate-300 text-slate-800 focus:border-amber-500"
                  : "bg-white/5 border-white/10 text-slate-200 focus:border-amber-400/50"
                }`}
            >
              {limitOptions.map((opt) => (
                <option
                  key={opt}
                  value={opt}
                  className={isLight ? "bg-white text-slate-900" : "bg-[#170d2f] text-slate-200"}
                >
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* DaisyUI Join Pagination Control */}
      <div className="join shadow-xs">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous Page"
          className={`join-item btn btn-sm font-bold gap-1 px-3 ${isLight
              ? "bg-white border-slate-300 hover:bg-slate-100 text-slate-700 hover:text-slate-900 disabled:bg-slate-50 disabled:text-slate-300 disabled:border-slate-200"
              : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-400/30 text-slate-300 hover:text-white disabled:bg-white/[0.02] disabled:text-slate-600 disabled:border-white/5"
            }`}
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
                className={`join-item btn btn-sm btn-disabled cursor-default ${isLight
                    ? "bg-white text-slate-400 border-slate-200"
                    : "bg-white/[0.02] text-slate-500 border-white/5"
                  }`}
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
              aria-label={`Page ${p}`}
              aria-current={isCurrent ? "page" : undefined}
              className={`join-item btn btn-sm font-bold min-w-8 transition-all ${isCurrent
                  ? isLight
                    ? "bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-black border-[#fcd200] shadow-xs"
                    : "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black border-amber-400/50 shadow-md shadow-amber-500/20"
                  : isLight
                    ? "bg-white border-slate-300 hover:bg-slate-100 text-slate-700 hover:text-slate-900"
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
          aria-label="Next Page"
          className={`join-item btn btn-sm font-bold gap-1 px-3 ${isLight
              ? "bg-white border-slate-300 hover:bg-slate-100 text-slate-700 hover:text-slate-900 disabled:bg-slate-50 disabled:text-slate-300 disabled:border-slate-200"
              : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-400/30 text-slate-300 hover:text-white disabled:bg-white/[0.02] disabled:text-slate-600 disabled:border-white/5"
            }`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AZPagination;
