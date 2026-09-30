import React from "react";

export interface ReviewListSkeletonProps {
  count?: number;
  className?: string;
}

export const ReviewListSkeleton: React.FC<ReviewListSkeletonProps> = ({
  count = 3,
  className = "space-y-4",
}) => {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="space-y-2 p-4 bg-slate-50 border border-slate-200/60 rounded-xl animate-pulse"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200" />
            <div className="h-4 bg-slate-200 rounded w-1/4" />
          </div>
          <div className="h-3 bg-slate-200 rounded w-1/3" />
          <div className="h-12 bg-slate-200 rounded w-full" />
        </div>
      ))}
    </div>
  );
};

export default ReviewListSkeleton;
