import React from "react";

export interface StatsCardSkeletonProps {
  count?: number;
  gridClassName?: string;
  cardHeightClassName?: string;
  className?: string;
}

export const StatsCardSkeleton: React.FC<StatsCardSkeletonProps> = ({
  count = 5,
  gridClassName = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3",
  cardHeightClassName = "h-[100px]",
  className = "",
}) => {
  return (
    <div className={`${gridClassName} ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${cardHeightClassName} rounded-2xl bg-[#170d2f] border border-white/10 p-4 space-y-2 animate-pulse`}
        >
          <div className="flex items-center justify-between">
            <div className="h-2.5 w-16 bg-white/10 rounded" />
            <div className="w-6 h-6 rounded-lg bg-white/5" />
          </div>
          <div className="h-6 w-20 bg-white/15 rounded-md" />
        </div>
      ))}
    </div>
  );
};

export default StatsCardSkeleton;
