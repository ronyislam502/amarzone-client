import React from "react";

export interface NotificationListSkeletonProps {
  count?: number;
  className?: string;
}

export const NotificationListSkeleton: React.FC<NotificationListSkeletonProps> = ({
  count = 4,
  className = "p-4 space-y-3",
}) => {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-12 rounded-xl bg-white/5 border border-white/5 animate-pulse"
        />
      ))}
    </div>
  );
};

export default NotificationListSkeleton;
