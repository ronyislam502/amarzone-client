import { Suspense } from "react";
import TableSkeleton from "../../../shared/skeleton/TableSkeleton";
import CustomersPage from "@/src/app/(dashboard)/admin/customers/page";

const CustomersTable = () => {
  return (
    <Suspense fallback={<TableSkeleton columns={6} rows={5} showAvatar={true} title="Customer Accounts" />}>
      <CustomersPage />
    </Suspense>
  );
};

export default CustomersTable;
