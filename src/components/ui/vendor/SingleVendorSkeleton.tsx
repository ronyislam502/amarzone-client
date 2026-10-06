"use client";

import React from "react";

export const SingleVendorSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-pulse select-none">
      {/* Banner & Header Skeleton */}
      <div className="rounded-3xl overflow-hidden bg-white border border-slate-200">
        <div className="h-48 sm:h-64 md:h-80 bg-slate-200 w-full" />
        <div className="px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-16 sm:-mt-20">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl sm:rounded-3xl bg-slate-300 border-4 border-white shrink-0" />
            <div className="space-y-2 flex-1 text-center sm:text-left">
              <div className="h-7 w-48 sm:w-64 bg-slate-200 rounded-lg mx-auto sm:mx-0" />
              <div className="h-4 w-36 bg-slate-200 rounded mx-auto sm:mx-0" />
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-28 bg-slate-200 rounded-full" />
              <div className="h-10 w-32 bg-slate-200 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-100">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2"
              >
                <div className="h-4 w-16 bg-slate-200 rounded" />
                <div className="h-6 w-24 bg-slate-300 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="h-12 bg-white rounded-2xl border border-slate-200" />

      {/* Grid Content Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-3"
          >
            <div className="w-full aspect-square bg-slate-100 rounded-xl" />
            <div className="h-3 w-1/3 bg-slate-200 rounded" />
            <div className="h-4 w-5/6 bg-slate-200 rounded" />
            <div className="h-6 w-1/2 bg-slate-300 rounded mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleVendorSkeleton;
