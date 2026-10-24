'use client';

import AZStats, { TAZStat } from "@/components/shared/AZStats";
import { useMyOrdersQuery } from "@/redux/features/order/orderApi";
import { TMeta } from "@/types/global";
import { TOrder } from "@/types/order";
import {
    ShoppingBag,
    Truck,
    CheckCircle2,
    DollarSign,
} from "lucide-react";

export interface CustomerOrdersStatsProps {
    totalOrders?: number;
    inTransitOrders?: number;
    deliveredOrders?: number;
    totalSpent?: number;
    orders?: TOrder[];
    isLoading?: boolean;
    meta?: TMeta;
}

const CustomerOrdersStats = ({
    totalOrders,
    inTransitOrders,
    deliveredOrders,
    totalSpent,
    orders: initialOrders,
    isLoading: propIsLoading,
    meta: propMeta,
}: CustomerOrdersStatsProps = {}) => {
    // Skip redundant network query if data is already provided by parent (CustomerOrdersData)
    const shouldSkip = Boolean(initialOrders !== undefined && propIsLoading !== undefined);
    const { data: ordersData, isLoading: queryLoading } = useMyOrdersQuery({}, { skip: shouldSkip });

    const isLoading = propIsLoading !== undefined ? propIsLoading : queryLoading;
    const orders = initialOrders || (ordersData?.data as TOrder[] | undefined) || [];
    const meta = propMeta || ordersData?.meta;

    const computedTotal = totalOrders ?? meta?.total ?? orders.length;

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

    const computedSpent = totalSpent ?? orders.reduce((sum, o) => {
        const amount = Number(o.totalPrice || 0);
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const stats: TAZStat[] = [
        {
            label: "Total Orders",
            value: isLoading ? "—" : computedTotal,
            description: "Lifetime purchases",
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
            label: "On The Way",
            value: isLoading ? "—" : computedInTransit,
            description: "In transit with carrier",
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
            label: "Delivered Items",
            value: isLoading ? "—" : computedDelivered,
            description: "Completed deliveries",
            descriptionIcon: <span className="text-emerald-400">✓</span>,
            icon: <CheckCircle2 className="w-6 h-6" />,
            lineColor: "via-emerald-400/60",
            glowColor: "from-emerald-500/20",
            valueColor: "text-emerald-400",
            iconWrapperColor: "bg-emerald-500/10",
            iconBorderColor: "border-emerald-500/20",
            iconColor: "text-emerald-400",
        },
        {
            label: "Total Spent",
            value: isLoading ? "—" : `$${computedSpent.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            description: "All-time order volume",
            descriptionIcon: (
                <span className="text-indigo-400">★</span>
            ),
            icon: <DollarSign className="w-6 h-6" />,
            lineColor: "via-indigo-400/60",
            glowColor: "from-indigo-500/20",
            valueColor: "text-indigo-300",
            iconWrapperColor: "bg-indigo-500/10",
            iconBorderColor: "border-indigo-500/20",
            iconColor: "text-indigo-400",
        },
    ];

    return <AZStats stats={stats} />;
};

export default CustomerOrdersStats;
