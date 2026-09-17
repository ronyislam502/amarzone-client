"use client";

import { useState } from "react";
import OrdersBread from "@/src/components/ui/analistics/vendor/orders/OrdersBread";
import OrdersHeader from "@/src/components/ui/analistics/vendor/orders/OrdersHeader";
import OrdersData, { TOrderStatusKey } from "@/src/components/ui/analistics/vendor/orders/OrdersData";
import OrdersStats from "@/src/components/ui/analistics/vendor/orders/OrdersStats";

const VendorOrders = () => {
  const [activeStatus, setActiveStatus] = useState<TOrderStatusKey>("PENDING");

  return (
    <div className="space-y-6 w-full pb-10">
      {/* 1. Breadcrumbs */}
      <OrdersBread />

      {/* 2. Header */}
      <OrdersHeader />

      {/* 3. Status Statistics Cards */}
      <OrdersStats
        activeStatus={activeStatus}
        onStatusSelect={(status) => setActiveStatus(status as TOrderStatusKey)}
      />

      {/* 4. Order Data Table (AZTable) */}
      <OrdersData
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
      />
    </div>
  );
};

export default VendorOrders;

