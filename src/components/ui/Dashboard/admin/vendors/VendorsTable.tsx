import { Suspense } from "react";
import TableSkeleton from "../../../shared/skeleton/TableSkeleton";
import VendorsPage from "@/src/app/(dashboard)/admin/vendors/page";

const VendorsTable = () => {
  return (
    <Suspense fallback={<TableSkeleton columns={6} rows={5} showAvatar={true} title="Merchant Storefronts" />}>
      <VendorsPage />
    </Suspense>
  );
};

export default VendorsTable;
