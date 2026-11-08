import React from "react";

export interface ProductGridSkeletonProps {
  count?: number;
  limit?: number;
  gridClassName?: string;
  cardClassName?: string;
  className?: string;
}

export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({
  count = 12,
  limit,
}) => {
  const itemCount = limit ?? count;

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
      {Array.from({ length: itemCount }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse p-3 space-y-3">
          <div className="aspect-square bg-slate-100 rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200/40 to-transparent animate-shimmer" />
          </div>
          <div className="space-y-2 pt-1">
            <div className="h-3 bg-slate-100 rounded-md w-1/2" />
            <div className="h-4 bg-slate-100 rounded-md w-5/6" />
            <div className="h-3 bg-slate-100 rounded-md w-2/3" />
            <div className="h-6 bg-slate-100 rounded-md w-1/3 mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
