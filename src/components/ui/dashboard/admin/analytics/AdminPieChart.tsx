"use client";

import { useMemo } from "react";
import { CreditCard, ShoppingBag } from "lucide-react";
import { TStatusCountPoint } from "@/types/dashboard";
import AZPieChart, { TPieChartTab } from "@/components/shared/chart/AZPieChart";

export interface AdminPieChartProps {
    orderStatusData?: TStatusCountPoint[];
    paymentStatusData?: TStatusCountPoint[];
}

export const AdminPieChart: React.FC<AdminPieChartProps> = ({
    orderStatusData = [],
    paymentStatusData = [],
}) => {
    const tabs: TPieChartTab[] = useMemo(() => {
        return [
            {
                key: "orders",
                label: "Orders",
                icon: <ShoppingBag className="w-3.5 h-3.5" />,
                centerTitle: "Total Orders",
                emptyMessage: "No transaction or order status changes found in the selected range.",
                data: orderStatusData.map((item) => ({
                    id: item.status,
                    label: item.status,
                    value: item.count,
                })),
            },
            {
                key: "payments",
                label: "Payments",
                icon: <CreditCard className="w-3.5 h-3.5" />,
                centerTitle: "Total Payments",
                emptyMessage: "No payment transaction events found in the selected range.",
                data: paymentStatusData.map((item) => ({
                    id: item.status,
                    label: item.status,
                    value: item.count,
                })),
            },
        ];
    }, [orderStatusData, paymentStatusData]);

    return (
        <AZPieChart
            tabs={tabs}
            defaultTab="orders"
            title="Status Distribution"
            subtitle="Real breakdown proportions by stage and settlement status."
            legendLayout="list"
        />
    );
};

export default AdminPieChart;
