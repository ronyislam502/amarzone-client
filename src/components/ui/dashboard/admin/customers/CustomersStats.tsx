'use client';

import React from "react";
import AZStats, { TAZStat } from "@/components/shared/AZStats";
import { useAllCustomersQuery } from "@/redux/features/customer/customerApi";
import { TCustomer } from "@/types/customer";
import { TMeta } from "@/types/global";
import {
    Users,
    CheckCircle2,
    MapPin,
    ShieldCheck,
} from "lucide-react";

export interface CustomersStatsProps {
    totalCustomers?: number;
    activeCustomers?: number;
    withAddressCount?: number;
    healthRate?: string;
    customers?: TCustomer[];
    isLoading?: boolean;
    meta?: TMeta;
}

const CustomersStats = ({
    totalCustomers,
    activeCustomers,
    withAddressCount,
    healthRate,
    customers: initialCustomers,
    isLoading: propIsLoading,
    meta: propMeta,
}: CustomersStatsProps = {}) => {
    // Skip redundant network query if data is already provided by parent (CustomersData)
    const shouldSkip = Boolean(initialCustomers !== undefined && propIsLoading !== undefined);
    const { data: customersData, isLoading: queryLoading } = useAllCustomersQuery({}, { skip: shouldSkip });

    const isLoading = propIsLoading !== undefined ? propIsLoading : queryLoading;
    const customers = initialCustomers || (customersData?.data as TCustomer[] | undefined) || [];
    const meta = propMeta || customersData?.meta;

    const computedTotal = totalCustomers ?? meta?.total ?? customers.length;
    const computedActive =
        activeCustomers ??
        customers.filter((customer) => {
            const isSuspended = customer.isDeleted;
            const status = typeof customer.user === "object" ? customer.user?.status : undefined;
            return !isSuspended && status !== "blocked" && status !== "inactive";
        }).length;

    const computedWithAddress =
        withAddressCount ??
        customers.filter((customer) => {
            const addr = customer.address;
            return Boolean(addr && (addr.street || addr.state || addr.country || addr.postalCode));
        }).length;

    const computedHealthRate =
        healthRate ??
        (computedTotal > 0
            ? `${((computedActive / computedTotal) * 100).toFixed(1)}%`
            : "100%");

    const stats: TAZStat[] = [
        {
            label: "Total Customers",
            value: isLoading ? "—" : computedTotal,
            description: "Registered consumer accounts",
            descriptionIcon: (
                <span className="text-emerald-400">↗︎</span>
            ),
            icon: <Users className="w-6 h-6" />,
            lineColor: "via-amber-400/60",
            glowColor: "from-amber-500/20",
            valueColor: "text-amber-400",
            iconWrapperColor: "bg-amber-400/10",
            iconBorderColor: "border-amber-400/20",
            iconColor: "text-amber-400",
        },
        {
            label: "Active Accounts",
            value: isLoading ? "—" : computedActive,
            description: "Unrestricted shopping profiles",
            descriptionIcon: <span>●</span>,
            icon: <CheckCircle2 className="w-6 h-6" />,
            lineColor: "via-emerald-400/60",
            glowColor: "from-emerald-500/20",
            valueColor: "text-emerald-400",
            iconWrapperColor: "bg-emerald-500/10",
            iconBorderColor: "border-emerald-500/20",
            iconColor: "text-emerald-400",
        },
        {
            label: "Delivery Profiles",
            value: isLoading ? "—" : computedWithAddress,
            description: "Verified shipping destinations",
            descriptionIcon: <span>📍</span>,
            icon: <MapPin className="w-6 h-6" />,
            lineColor: "via-amber-400/60",
            glowColor: "from-amber-500/20",
            valueColor: "text-amber-300",
            iconWrapperColor: "bg-amber-500/10",
            iconBorderColor: "border-amber-500/20",
            iconColor: "text-amber-300",
        },
        {
            label: "Account Health",
            value: isLoading ? "—" : computedHealthRate,
            description: "Active consumer ratio",
            descriptionIcon: (
                <span className="text-indigo-400">✓</span>
            ),
            icon: <ShieldCheck className="w-6 h-6" />,
            lineColor: "via-indigo-400/60",
            glowColor: "from-indigo-500/20",
            valueColor: "text-indigo-400",
            iconWrapperColor: "bg-indigo-500/10",
            iconBorderColor: "border-indigo-500/20",
            iconColor: "text-indigo-400",
        },
    ];

    return <AZStats stats={stats} />;
};

export default CustomersStats;