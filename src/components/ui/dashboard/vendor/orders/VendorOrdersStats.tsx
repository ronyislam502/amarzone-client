'use client';

import AZStats, { TAZStat } from "@/components/shared/AZStats";
import { useMyOrdersQuery } from "@/redux/features/order/orderApi";
import { TMeta } from "@/types/global";
import { TOrder } from "@/types/order";
import {
    ShoppingBag,
    Clock,
    Truck,
    DollarSign,
} from "lucide-react";

export interface VendorOrdersStatsProps {
    totalOrders?: number;
    pendingOrders?: number;
    inTransitOrders?: number;
    deliveredOrders?: number;
    orders?: TOrder[];
    isLoading?: boolean;
    meta?: TMeta;
}

const VendorOrdersStats = ({
    totalOrders,
    pendingOrders,
    inTransitOrders,
    deliveredOrders,
    orders: initialOrders,
    isLoading: propIsLoading,
    meta: propMeta,
}: VendorOrdersStatsProps = {}) => {
    // Skip redundant network query if data is already provided by parent (VendorOrdersData)
    const shouldSkip = Boolean(initialOrders !== undefined && propIsLoading !== undefined);
    const { data: ordersData, isLoading: queryLoading } = useMyOrdersQuery({}, { skip: shouldSkip });

    const isLoading = propIsLoading !== undefined ? propIsLoading : queryLoading;
    const orders = initialOrders || (ordersData?.data as TOrder[] | undefined) || [];
    const meta = propMeta || ordersData?.meta;

    const computedTotal = totalOrders ?? meta?.total ?? orders.length;

    const computedPending =
        pendingOrders ??
        orders.filter((order) => {
            const status = (order.status || "").toUpperCase();
            return status === "PENDING" || status === "UNSHIPPED";
        }).length;

    const computedInTransit =
        inTransitOrders ??
        orders.filter((order) => {
            const status = (order.status || "").toUpperCase();
            return status === "SHIPPED" || status === "IN_TRANSIT" || status === "OUT_OF_DELIVERY";
        }).length;

    const computedDelivered =
        deliveredOrders ??
        orders.filter((order) => {
            const status = (order.status || "").toUpperCase();
            return status === "DELIVERED";
        }).length;

    const computedRevenue = orders.reduce((sum, o) => {
        const amount = Number(o.vendorAmount ?? (o.totalPrice ? o.totalPrice - (o.commission || 0) : 0));
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const stats: TAZStat[] = [
        {
            label: "Total Store Orders",
            value: isLoading ? "—" : computedTotal,
            description: "Merchant order volume",
            descriptionIcon: (
                <span className="text-amber-400">↗︎</span>
            ),
            icon: <ShoppingBag className="w-6 h-6" />,
            lineColor: "via-amber-400/60",
            glowColor: "from-amber-500/20",
            valueColor: "text-amber-400",
            iconWrapperColor: "bg-amber-400/10",
            iconBorderColor: "border-amber-400/20",
            iconColor: "text-amber-400",
        },
        {
            label: "Awaiting Dispatch",
            value: isLoading ? "—" : computedPending,
            description: "Ready for packaging",
            descriptionIcon: <span className="text-amber-300">●</span>,
            icon: <Clock className="w-6 h-6" />,
            lineColor: "via-amber-400/60",
            glowColor: "from-amber-500/20",
            valueColor: "text-amber-300",
            iconWrapperColor: "bg-amber-500/10",
            iconBorderColor: "border-amber-500/20",
            iconColor: "text-amber-300",
        },
        {
            label: "In Transit / Shipped",
            value: isLoading ? "—" : computedInTransit,
            description: "Active logistics dispatches",
            descriptionIcon: <span className="text-sky-400">⚡</span>,
            icon: <Truck className="w-6 h-6" />,
            lineColor: "via-sky-400/60",
            glowColor: "from-sky-500/20",
            valueColor: "text-sky-400",
            iconWrapperColor: "bg-sky-500/10",
            iconBorderColor: "border-sky-500/20",
            iconColor: "text-sky-400",
        },
        {
            label: "Net Store Revenue",
            value: isLoading ? "—" : `$${computedRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            description: `${computedDelivered} fulfilled orders`,
            descriptionIcon: (
                <span className="text-emerald-400">✓</span>
            ),
            icon: <DollarSign className="w-6 h-6" />,
            lineColor: "via-emerald-400/60",
            glowColor: "from-emerald-500/20",
            valueColor: "text-emerald-400",
            iconWrapperColor: "bg-emerald-500/10",
            iconBorderColor: "border-emerald-500/20",
            iconColor: "text-emerald-400",
        },
    ];

    return <AZStats stats={stats} />;
};

export default VendorOrdersStats;
