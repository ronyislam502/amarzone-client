import React from "react";

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  showAvatar?: boolean;
  showActions?: boolean;
  title?: string;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 6,
  showHeader = true,
  showAvatar = true,
  showActions = true,
  title,
  className = "",
}) => {
  const rowArray = Array.from({ length: rows });
  const colCount = Math.max(1, columns);

  return (
    <div className={`card bg-base-100 shadow-xl border border-base-200 animate-pulse ${className}`}>
      <div className="card-body">
        {/* Header Skeleton */}
        {showHeader && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-base-200 gap-4">
            <div className="space-y-2">
              {title ? (
                <div className="h-6 font-extrabold text-base text-base-content/80 flex items-center gap-2">
                  <div className="w-5 h-5 bg-base-300 rounded-md"></div>
                  <span>{title}</span>
                </div>
              ) : (
                <div className="h-6 w-48 bg-base-300 rounded-md"></div>
              )}
              <div className="h-3 w-64 bg-base-200 rounded-md"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-44 sm:w-64 bg-base-200 rounded-lg"></div>
              <div className="h-8 w-8 bg-base-300 rounded-lg shrink-0"></div>
            </div>
          </div>
        )}

        {/* Table Skeleton */}
        <div className="overflow-x-auto pt-2">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                {Array.from({ length: colCount }).map((_, idx) => (
                  <th key={idx}>
                    <div className="h-4 w-20 sm:w-24 bg-base-300 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowArray.map((_, rIdx) => (
                <tr key={rIdx}>
                  {Array.from({ length: colCount }).map((_, cIdx) => {
                    // First column with Avatar + Text
                    if (cIdx === 0 && showAvatar) {
                      return (
                        <td key={cIdx}>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-base-300 shrink-0"></div>
                            <div className="space-y-1">
                              <div className="h-4 w-28 bg-base-300 rounded"></div>
                              <div className="h-3 w-20 bg-base-200 rounded"></div>
                            </div>
                          </div>
                        </td>
                      );
                    }

                    // Last column with Action Buttons
                    if (cIdx === colCount - 1 && showActions) {
                      return (
                        <td key={cIdx} className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="h-7 w-14 bg-base-300 rounded-md"></div>
                            <div className="h-7 w-14 bg-base-200 rounded-md"></div>
                          </div>
                        </td>
                      );
                    }

                    // Middle data columns
                    return (
                      <td key={cIdx}>
                        <div
                          className={`h-4 bg-base-200 rounded ${cIdx % 2 === 0 ? "w-28" : "w-20"
                            }`}
                        ></div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;
