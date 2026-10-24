import React from "react";

export interface OrderSummarySkeletonProps {
  barsCount?: number;
  className?: string;
}

export const OrderSummarySkeleton: React.FC<OrderSummarySkeletonProps> = ({
  barsCount = 4,
  className = "p-5 space-y-3",
}) => {
  return (
    <div className={className}>
      {Array.from({ length: barsCount }).map((_, i) => (
        <div
          key={i}
          className="h-8 rounded-lg bg-white/5 border border-white/5 animate-pulse"
        />
      ))}
    </div>
  );
};

export default OrderSummarySkeleton;
