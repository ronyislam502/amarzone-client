"use client"

import OrdersBread from "@/src/components/ui/analistics/vendor/orders/OrdersBread";
import OrdersData, { TOrderStatusKey } from "@/src/components/ui/analistics/vendor/orders/OrdersData";
import OrdersHeader from "@/src/components/ui/analistics/vendor/orders/OrdersHeader";
import OrdersStats from "@/src/components/ui/analistics/vendor/orders/OrdersStats";
import { useState } from "react";

const CustomerOrders = () => {
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

export default CustomerOrders;