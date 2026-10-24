'use client';

import AZStats, { TAZStat } from "@/components/shared/AZStats";
import { useAllVendorsQuery } from "@/redux/features/vendor/vendorApi";
import { TMeta } from "@/types/global";
import { TVendor } from "@/types/vendor";
import {
    Store,
    CheckCircle2,
    AlertTriangle,
    ShieldCheck,
} from "lucide-react";

export interface VendorsStatsProps {
    totalVendors?: number;
    activeVendors?: number;
    suspendedVendors?: number;
    complianceRate?: string;
    vendors?: TVendor[];
    isLoading?: boolean;
    meta?: TMeta;
}

const VendorsStats = ({
    totalVendors,
    activeVendors,
    suspendedVendors,
    complianceRate,
    vendors: initialVendors,
    isLoading: propIsLoading,
    meta: propMeta,
}: VendorsStatsProps = {}) => {
    // Skip duplicate network query if parent (VendorsData) already provides data
    const shouldSkip = Boolean(initialVendors !== undefined && propIsLoading !== undefined);
    const { data: vendorsData, isLoading: queryLoading } = useAllVendorsQuery({}, { skip: shouldSkip });

    const isLoading = propIsLoading !== undefined ? propIsLoading : queryLoading;
    const vendors = initialVendors || (vendorsData?.data as TVendor[] | undefined) || [];
    const meta = propMeta || vendorsData?.meta;

    const computedTotal = totalVendors ?? meta?.total ?? vendors.length;

    const computedActive =
        activeVendors ??
        vendors.filter((vendor) => {
            const isSuspended = vendor.isDeleted;
            const status = typeof vendor.user === "object" ? vendor.user?.status : undefined;
            return !isSuspended && status !== "blocked" && status !== "inactive";
        }).length;

    const computedSuspended =
        suspendedVendors ??
        vendors.filter((vendor) => {
            const isSuspended = vendor.isDeleted;
            const status = typeof vendor.user === "object" ? vendor.user?.status : undefined;
            return isSuspended || status === "blocked" || status === "inactive";
        }).length;

    const computedComplianceRate =
        complianceRate ??
        (computedTotal > 0
            ? `${((computedActive / computedTotal) * 100).toFixed(1)}%`
            : "100%");

    const stats: TAZStat[] = [
        {
            label: "Total Merchants",
            value: isLoading ? "—" : computedTotal,
            description: "Registered storefronts",
            descriptionIcon: (
                <span className="text-emerald-400">↗︎</span>
            ),
            icon: <Store className="w-6 h-6" />,
            lineColor: "via-amber-400/60",
            glowColor: "from-amber-500/20",
            valueColor: "text-amber-400",
            iconWrapperColor: "bg-amber-400/10",
            iconBorderColor: "border-amber-400/20",
            iconColor: "text-amber-400",
        },
        {
            label: "Authorized Stores",
            value: isLoading ? "—" : computedActive,
            description: "Operational & active",
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
            label: "Suspended Stores",
            value: isLoading ? "—" : computedSuspended,
            description: "Restricted accounts",
            descriptionIcon: <span>⚠</span>,
            icon: <AlertTriangle className="w-6 h-6" />,
            lineColor: "via-rose-400/60",
            glowColor: "from-rose-500/20",
            valueColor: "text-rose-400",
            iconWrapperColor: "bg-rose-500/10",
            iconBorderColor: "border-rose-500/20",
            iconColor: "text-rose-400",
        },
        {
            label: "Approval Index",
            value: isLoading ? "—" : computedComplianceRate,
            description: "Active merchant ratio",
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

export default VendorsStats;
