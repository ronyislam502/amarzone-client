const AdminProfileSkeleton = () => {
  return (
    <div className="space-y-6 w-full pb-10 animate-pulse">
      {/* Hero Header Skeleton */}
      <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 shrink-0" />
          <div className="space-y-3 flex-1 w-full text-center sm:text-left">
            <div className="h-6 w-48 bg-white/10 rounded-lg mx-auto sm:mx-0" />
            <div className="h-4 w-64 bg-white/5 rounded-md mx-auto sm:mx-0" />
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <div className="h-5 w-24 bg-white/5 rounded-full" />
              <div className="h-5 w-28 bg-white/5 rounded-full" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-24 bg-white/10 rounded-xl" />
            <div className="h-10 w-28 bg-white/5 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((statSkeletonIndex) => (
          <div
            key={statSkeletonIndex}
            className="card bg-[#170d2f] border border-white/10 shadow-2xl p-5 rounded-2xl sm:rounded-3xl space-y-3"
          >
            <div className="h-3 w-24 bg-white/10 rounded" />
            <div className="h-7 w-32 bg-white/15 rounded" />
            <div className="h-3 w-36 bg-white/5 rounded" />
          </div>
        ))}
      </div>

      {/* Details Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card bg-[#170d2f] border border-white/10 shadow-2xl p-6 rounded-2xl sm:rounded-3xl space-y-6">
          <div className="h-5 w-40 bg-white/10 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-20 bg-white/5 rounded-xl" />
            <div className="h-20 bg-white/5 rounded-xl" />
            <div className="h-20 bg-white/5 rounded-xl" />
            <div className="h-20 bg-white/5 rounded-xl" />
          </div>
        </div>
        <div className="card bg-[#170d2f] border border-white/10 shadow-2xl p-6 rounded-2xl sm:rounded-3xl space-y-4">
          <div className="h-5 w-32 bg-white/10 rounded" />
          <div className="h-16 bg-white/5 rounded-xl" />
          <div className="h-16 bg-white/5 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default AdminProfileSkeleton;
