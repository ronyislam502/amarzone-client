import React from "react";

export interface VendorHealthSkeletonProps {
  metricsCount?: number;
  className?: string;
}

export const VendorHealthSkeleton: React.FC<VendorHealthSkeletonProps> = ({
  metricsCount = 4,
  className = "",
}) => {
  return (
    <div className={`space-y-6 animate-pulse ${className}`}>
      {/* Account Score Gauge Skeleton */}
      <div className="h-64 bg-[#170d2f]/70 border border-white/10 rounded-2xl sm:rounded-3xl p-6 relative overflow-hidden" />

      {/* Core SLA Metrics Cards Grid Skeleton */}
      {metricsCount > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: metricsCount }).map((_, i) => (
            <div
              key={i}
              className="h-44 bg-[#170d2f]/70 border border-white/10 rounded-2xl p-5 space-y-3"
            >
              <div className="h-3 w-28 bg-white/10 rounded" />
              <div className="h-8 w-20 bg-white/15 rounded-lg" />
              <div className="h-3 w-36 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Compliance / Violations List Skeleton */}
      <div className="h-56 bg-[#170d2f]/70 border border-white/10 rounded-2xl sm:rounded-3xl" />
    </div>
  );
};

export default VendorHealthSkeleton;
