import React from "react";

export interface DashboardOverviewSkeletonProps {
  showHero?: boolean;
  kpiCount?: number;
  showBanner?: boolean;
  chartsCount?: number;
  className?: string;
}

export const DashboardOverviewSkeleton: React.FC<DashboardOverviewSkeletonProps> = ({
  showHero = true,
  kpiCount = 5,
  showBanner = true,
  chartsCount = 3,
  className = "",
}) => {
  return (
    <div className={`space-y-6 animate-pulse ${className}`}>
      {/* Hero Overview Card Skeleton */}
      {showHero && (
        <div className="h-44 rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        </div>
      )}

      {/* KPI Stats Grid Skeleton */}
      {kpiCount > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: kpiCount }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 p-5 space-y-2"
            >
              <div className="h-3 w-20 bg-white/10 rounded-md" />
              <div className="h-6 w-28 bg-white/15 rounded-lg" />
              <div className="h-3 w-16 bg-white/5 rounded-md" />
            </div>
          ))}
        </div>
      )}

      {/* Action/Notice Banner Skeleton */}
      {showBanner && (
        <div className="h-28 rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10" />
      )}

      {/* Charts Grid Skeleton */}
      {chartsCount > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: chartsCount }).map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 p-5 space-y-3"
            >
              <div className="h-4 w-32 bg-white/10 rounded-md" />
              <div className="h-28 w-full bg-white/5 rounded-xl" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardOverviewSkeleton;
