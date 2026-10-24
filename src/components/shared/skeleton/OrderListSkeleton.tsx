import React from "react";

export interface OrderListSkeletonProps {
  count?: number;
  itemHeightClassName?: string;
  className?: string;
}

export const OrderListSkeleton: React.FC<OrderListSkeletonProps> = ({
  count = 3,
  itemHeightClassName = "h-16",
  className = "p-4 space-y-3",
}) => {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${itemHeightClassName} rounded-xl bg-white/5 border border-white/5 animate-pulse`}
        />
      ))}
    </div>
  );
};

export default OrderListSkeleton;
