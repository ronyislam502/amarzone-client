import React from "react";

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-6 px-4 md:px-8 max-w-[1500px] mx-auto animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex gap-2 mb-6">
        <div className="skeleton h-3 w-20 bg-slate-200"></div>
        <div className="skeleton h-3 w-4"></div>
        <div className="skeleton h-3 w-28 bg-slate-200"></div>
        <div className="skeleton h-3 w-4"></div>
        <div className="skeleton h-3 w-40 bg-slate-200"></div>
      </div>

      {/* Main 3-Column Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Gallery Skeleton (5 cols) */}
        <div className="lg:col-span-5 flex gap-4">
          <div className="flex flex-col gap-2 w-12 shrink-0">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton h-12 w-12 rounded border border-slate-200"></div>
            ))}
          </div>
          <div className="flex-1 h-[420px] skeleton rounded-lg bg-slate-100"></div>
        </div>

        {/* Center Column: Details Skeleton (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="skeleton h-7 w-full"></div>
          <div className="skeleton h-7 w-4/5"></div>
          <div className="skeleton h-4 w-32"></div>

          <div className="flex gap-3 items-center pt-2">
            <div className="skeleton h-4 w-24"></div>
            <div className="skeleton h-4 w-16"></div>
          </div>

          <div className="skeleton h-8 w-28 mt-4"></div>

          {/* Color Swatch Skeleton */}
          <div className="space-y-2 pt-4">
            <div className="skeleton h-4 w-36"></div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton h-16 w-16 rounded border"></div>
              ))}
            </div>
          </div>

          {/* Spec Table Skeleton */}
          <div className="space-y-2 pt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="skeleton h-4 w-24"></div>
                <div className="skeleton h-4 w-32"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Buy Box Skeleton (3 cols) */}
        <div className="lg:col-span-3">
          <div className="border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm bg-slate-50">
            <div className="skeleton h-8 w-24"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-3/4"></div>
            <div className="skeleton h-6 w-20"></div>

            <div className="skeleton h-10 w-full rounded-full"></div>
            <div className="skeleton h-10 w-full rounded-full"></div>

            <div className="border-t pt-4 space-y-2">
              <div className="skeleton h-3 w-full"></div>
              <div className="skeleton h-3 w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
