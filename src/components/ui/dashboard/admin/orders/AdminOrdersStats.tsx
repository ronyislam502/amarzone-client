'use client';

import AZStats, { TAZStat } from "@/components/shared/AZStats";
import { useAllOrdersQuery } from "@/redux/features/order/orderApi";
import { TMeta } from "@/types/global";
import { TOrder } from "@/types/order";
import {
    ShoppingBag,
    Clock,
    Truck,
    CheckCircle2,
} from "lucide-react";

export interface OrdersStatsProps {
    totalOrders?: number;
    pendingOrders?: number;
    inTransitOrders?: number;
    deliveredOrders?: number;
    orders?: TOrder[];
    isLoading?: boolean;
    meta?: TMeta;
}

const AdminOrdersStats = ({
    totalOrders,
    pendingOrders,
    inTransitOrders,
    deliveredOrders,
    orders: initialOrders,
    isLoading: propIsLoading,
    meta: propMeta,
}: OrdersStatsProps = {}) => {
    // Skip redundant network query if data is already provided by parent (OrdersData)
    const shouldSkip = Boolean(initialOrders !== undefined && propIsLoading !== undefined);
    const { data: ordersData, isLoading: queryLoading } = useAllOrdersQuery({}, { skip: shouldSkip });

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

    const computedFulfillmentRate =
        computedTotal > 0
            ? `${((computedDelivered / computedTotal) * 100).toFixed(1)}%`
            : "100%";

    const stats: TAZStat[] = [
        {
            label: "Total Orders",
            value: isLoading ? "—" : computedTotal,
            description: "Marketplace volume",
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
            label: "Pending Orders",
            value: isLoading ? "—" : computedPending,
            description: "Awaiting processing",
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
            label: "In Transit",
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
            label: "Fulfilled Orders",
            value: isLoading ? "—" : computedDelivered,
            description: `${computedFulfillmentRate} completion rate`,
            descriptionIcon: (
                <span className="text-emerald-400">✓</span>
            ),
            icon: <CheckCircle2 className="w-6 h-6" />,
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

export default AdminOrdersStats;
