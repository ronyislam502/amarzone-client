import { Suspense } from "react";
import TableSkeleton from "../../../shared/skeleton/TableSkeleton";
import VendorOrders from "@/src/app/(dashboard)/vendor/orders/page";

const OrdersTable = () => {
  return (
    <Suspense fallback={<TableSkeleton columns={7} rows={5} showAvatar={false} title="Store Orders" />}>
      <VendorOrders />
    </Suspense>
  );
};

export default OrdersTable;
