import React from "react";

export const ProductPageSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6 animate-pulse select-none">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 bg-slate-200 rounded w-1/3" />

      {/* 3-Column Hero Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Column 1: Gallery */}
        <div className="lg:col-span-5 flex flex-col md:flex-row gap-4">
          <div className="flex md:flex-col gap-2 shrink-0">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-14 h-14 bg-slate-200 rounded-lg" />
            ))}
          </div>
          <div className="flex-1 h-[420px] bg-slate-200 rounded-2xl" />
        </div>

        {/* Column 2: Details */}
        <div className="lg:col-span-4 space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-8 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
          <div className="h-12 bg-slate-200 rounded w-3/4" />
          <div className="h-24 bg-slate-200 rounded w-full" />
          <div className="h-32 bg-slate-200 rounded w-full" />
        </div>

        {/* Column 3: Buy Box */}
        <div className="lg:col-span-3">
          <div className="h-[460px] bg-slate-200 rounded-2xl" />
        </div>
      </div>

      {/* Details Table Skeleton */}
      <div className="h-64 bg-slate-200 rounded-2xl" />
    </div>
  );
};

export default ProductPageSkeleton;
