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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-base-200 gap-4">
      <div>
        {title && (
          <div className="flex items-center gap-2">
            <h2 className="card-title text-base font-extrabold flex items-center gap-2">
              {icon}
              <span>{title}</span>
            </h2>
            {badgeText !== undefined && (
              <span className="badge badge-primary badge-sm font-bold">
                {badgeText}
              </span>
            )}
          </div>
        )}
        {subtitle && (
          <p className="text-xs text-base-content/70 mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Search Bar */}
        {onSearchChange !== undefined && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
            <input
              type="text"
              value={searchValue || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="input input-sm input-bordered w-full pl-9 text-xs focus:outline-none focus:border-primary"
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
            className="btn btn-square btn-ghost btn-sm border border-base-300"
          >
            <RefreshCw
              className={`w-4 h-4 text-base-content/70 ${isRefreshing ? "animate-spin text-primary" : ""
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
