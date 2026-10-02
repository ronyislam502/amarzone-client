import React from "react";

export interface BadgeSkeletonProps {
  widthClassName?: string;
  heightClassName?: string;
  className?: string;
}

export const BadgeSkeleton: React.FC<BadgeSkeletonProps> = ({
  widthClassName = "w-24",
  heightClassName = "h-5",
  className = "bg-slate-100 rounded",
}) => {
  return (
    <div
      className={`${heightClassName} ${widthClassName} ${className} animate-pulse`}
    />
  );
};

export default BadgeSkeleton;
