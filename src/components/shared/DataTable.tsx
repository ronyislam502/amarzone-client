"use client";

import React from "react";
import TableSkeleton from "./TableSkeleton";
import Pagination, { PaginationProps } from "./Pagination";
import {
  Search,
  RefreshCw,
  AlertCircle,
  FolderOpen
} from "lucide-react";

export interface Column<T> {
  /** Column header title or element */
  header: React.ReactNode;
  /** Property key or render function to extract cell value */
  accessor: keyof T | ((row: T, index: number) => React.ReactNode);
  /** Optional custom cell alignment */
  align?: "left" | "center" | "right";
  /** Optional column header/cell custom className */
  className?: string;
}

export interface DataTableProps<T> {
  /** Column definitions */
  columns: Column<T>[];
  /** Array of data items */
  data: T[];
  /** Function to extract unique key for each row */
  keyExtractor: (item: T, index: number) => string | number;

  // Table Title & Header
  title?: string;
  subtitle?: string;
  badgeText?: string | number;
  icon?: React.ReactNode;

  // Controls & Toolbar
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  headerActions?: React.ReactNode;

  // States
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;

  // Empty State
  emptyTitle?: string;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  emptyAction?: React.ReactNode;

  // Pagination
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
    onLimitChange?: (limit: number) => void;
  };

  /** Custom container class */
  className?: string;
}

export const DataTable = <T,>({
  columns,
  data,
  keyExtractor,
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
  isLoading = false,
  isError = false,
  errorMessage = "Failed to load data from server.",
  onRetry,
  emptyTitle = "No Records Found",
  emptyMessage = "There are no records to display at this time.",
  emptyIcon,
  emptyAction,
  pagination,
  className = "",
}: DataTableProps<T>) => {
  // 1. Loading State
  if (isLoading) {
    return (
      <TableSkeleton
        columns={columns.length}
        rows={pagination?.limit || 5}
        title={title}
        className={className}
      />
    );
  }

  // 2. Error State
  if (isError) {
    return (
      <div className={`card bg-base-100 shadow-xl border border-error/20 ${className}`}>
        <div className="card-body">
          <div className="alert alert-error shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 shrink-0 text-error-content" />
              <div>
                <h3 className="font-bold text-sm">Error Loading Records</h3>
                <p className="text-xs opacity-90">{errorMessage}</p>
              </div>
            </div>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="btn btn-sm btn-ghost border border-error-content/30 gap-2 hover:bg-error-content/10 font-bold text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const showHeader = Boolean(title || onSearchChange || onRefresh || headerActions);

  return (
    <div className={`card bg-base-100 shadow-xl border border-base-200 ${className}`}>
      <div className="card-body">
        {/* Header Toolbar */}
        {showHeader && (
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
                    className={`w-4 h-4 text-base-content/70 ${
                      isRefreshing ? "animate-spin text-primary" : ""
                    }`}
                  />
                </button>
              )}

              {/* Extra Header Actions */}
              {headerActions}
            </div>
          </div>
        )}

        {/* Empty State */}
        {data.length === 0 ? (
          <div className="text-center py-12 space-y-3 bg-base-200/50 rounded-2xl border border-dashed border-base-300 my-2">
            <div className="w-12 h-12 rounded-full bg-base-300 flex items-center justify-center mx-auto text-base-content/50">
              {emptyIcon || <FolderOpen className="w-6 h-6" />}
            </div>
            <h3 className="font-extrabold text-sm text-base-content">{emptyTitle}</h3>
            <p className="text-xs text-base-content/60 max-w-sm mx-auto">
              {searchValue
                ? `No records matching "${searchValue}". Try clearing your search.`
                : emptyMessage}
            </p>
            {searchValue && onSearchChange ? (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="btn btn-xs btn-outline btn-primary font-bold mt-2"
              >
                Clear Search
              </button>
            ) : (
              emptyAction
            )}
          </div>
        ) : (
          /* Table Content */
          <div className="overflow-x-auto pt-2">
            <table className="table table-zebra w-full text-xs">
              <thead>
                <tr>
                  {columns.map((col, cIdx) => {
                    const alignClass =
                      col.align === "center"
                        ? "text-center"
                        : col.align === "right"
                        ? "text-right"
                        : "text-left";

                    return (
                      <th key={cIdx} className={`${alignClass} ${col.className || ""}`}>
                        {col.header}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rIdx) => (
                  <tr key={keyExtractor(row, rIdx)} className="hover">
                    {columns.map((col, cIdx) => {
                      const alignClass =
                        col.align === "center"
                          ? "text-center"
                          : col.align === "right"
                          ? "text-right"
                          : "text-left";

                      let content: React.ReactNode = null;
                      if (typeof col.accessor === "function") {
                        content = col.accessor(row, rIdx);
                      } else if (col.accessor) {
                        content = (row as any)[col.accessor];
                      }

                      return (
                        <td key={cIdx} className={`${alignClass} ${col.className || ""}`}>
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && data.length > 0 && (
          <Pagination
            page={pagination.page}
            limit={pagination.limit}
            total={pagination.total}
            onPageChange={pagination.onPageChange}
            onLimitChange={pagination.onLimitChange}
          />
        )}
      </div>
    </div>
  );
}

export default DataTable;
