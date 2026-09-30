import React from "react";

export interface AiScanSkeletonProps {
  className?: string;
}

export const AiScanSkeleton: React.FC<AiScanSkeletonProps> = ({
  className = "p-6 space-y-3 border-t border-white/10 animate-pulse",
}) => {
  return (
    <div className={className}>
      <div className="h-4 bg-white/10 rounded-lg w-3/4" />
      <div className="h-3 bg-white/10 rounded-lg w-1/2" />
      <div className="h-16 bg-white/10 rounded-xl w-full" />
      <div className="h-3 bg-white/10 rounded-lg w-2/3" />
    </div>
  );
};

export default AiScanSkeleton;
