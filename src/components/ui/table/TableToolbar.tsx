import React from "react";
import { Search, RefreshCw } from "lucide-react";

export interface DataTableToolbarProps {
  title?: string;
  subtitle?: string;
  badgeText?: string | number;
  icon?: React.ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  headerActions?: React.ReactNode;
}

const TableToolbar = ({
  title,
  subtitle,
  badgeText,
  icon,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search records...",
  onRefresh,
  isRefreshing = false,
  headerActions,
}: DataTableToolbarProps) => {
  const showHeader = Boolean(title || onSearchChange || onRefresh || headerActions);

  if (!showHeader) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-4">
      <div>
        {title && (
          <div className="flex items-center gap-2">
            <h2 className="card-title text-base font-extrabold flex items-center gap-2 text-white">
              {icon}
              <span>{title}</span>
            </h2>
            {badgeText !== undefined && (
              <span className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-black shadow-sm">
                {badgeText}
              </span>
            )}
          </div>
        )}
        {subtitle && (
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Search Bar */}
        {onSearchChange !== undefined && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchValue || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all"
            />
          </div>
        )}

        {/* Refresh Button */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh Table"
            className="btn btn-square btn-ghost btn-sm border border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-400/30 text-slate-300 hover:text-amber-400 rounded-xl transition-all"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin text-amber-400" : ""
                }`}
            />
          </button>
        )}

        {/* Extra Header Actions */}
        {headerActions}
      </div>
    </div>
  );
}

export default TableToolbar;
