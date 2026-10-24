import React from "react";

export interface DashboardAnalyticsSkeletonProps {
  kpiCount?: number;
  chartsCount?: number;
  className?: string;
}

export const DashboardAnalyticsSkeleton: React.FC<DashboardAnalyticsSkeletonProps> = ({
  kpiCount = 4,
  chartsCount = 2,
  className = "",
}) => {
  return (
    <div className={`space-y-6 animate-pulse ${className}`}>
      {/* KPI Stats Cards Skeleton */}
      {kpiCount > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: kpiCount }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-3 w-24 bg-white/10 rounded" />
                <div className="w-8 h-8 rounded-xl bg-white/5" />
              </div>
              <div className="h-7 w-28 bg-white/15 rounded-lg" />
              <div className="h-3 w-36 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Analytics Charts Grid Skeleton */}
      {chartsCount > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: chartsCount }).map((_, i) => (
            <div
              key={i}
              className="h-80 rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="h-4 w-40 bg-white/10 rounded" />
                <div className="h-6 w-20 bg-white/5 rounded-lg" />
              </div>
              <div className="h-56 w-full bg-white/5 rounded-2xl" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardAnalyticsSkeleton;
