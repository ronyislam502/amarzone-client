import React from "react";
import TableSkeleton from "@/components/shared/TableSkeleton";

export const VendorTableSkeleton: React.FC = () => {
  return <TableSkeleton columns={6} rows={5} showAvatar={true} showActions={true} />;
};

export default VendorTableSkeleton;
