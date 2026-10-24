'use client';

import AZStats, { TAZStat } from "@/components/shared/AZStats";
import { useAllDisputesQuery } from "@/redux/features/dispute/disputeApi";
import { TDispute } from "@/types/dispute";
import { TMeta } from "@/types/global";
import {
    ShieldAlert,
    CheckCircle2,
    AlertTriangle,
    Sparkles,
} from "lucide-react";

export interface DisputeStatsProps {
    totalDisputes?: number;
    openDisputes?: number;
    resolvedDisputes?: number;
    resolutionRate?: string;
    disputes?: TDispute[];
    isLoading?: boolean;
    meta?: TMeta;
}

const DisputeStats = ({
    totalDisputes,
    openDisputes,
    resolvedDisputes,
    resolutionRate,
    disputes: initialDisputes,
    isLoading: propIsLoading,
    meta: propMeta,
}: DisputeStatsProps = {}) => {
    // Skip duplicate query if parent (DisputeData) already provides data
    const shouldSkip = Boolean(initialDisputes !== undefined && propIsLoading !== undefined);
    const { data: disputesData, isLoading: queryLoading } = useAllDisputesQuery({}, { skip: shouldSkip });

    const isLoading = propIsLoading !== undefined ? propIsLoading : queryLoading;
    const rawData = disputesData?.data;
    const resolvedData: TDispute[] = Array.isArray(rawData)
        ? rawData
        : (rawData as any)?.data || [];

    const disputes = initialDisputes || resolvedData || [];
    const meta = propMeta || disputesData?.meta;

    const computedTotal = totalDisputes ?? meta?.total ?? disputes.length;

    const computedOpen =
        openDisputes ??
        disputes.filter((d) => d.status === "OPEN" || d.status === "UNDER_REVIEW").length;

    const computedResolved =
        resolvedDisputes ??
        disputes.filter((d) => d.status === "RESOLVED" || d.status === "REJECTED").length;

    const computedResolutionRate =
        resolutionRate ??
        (computedTotal > 0
            ? `${((computedResolved / computedTotal) * 100).toFixed(1)}%`
            : "100%");

    const stats: TAZStat[] = [
        {
            label: "Total Disputes",
            value: isLoading ? "—" : computedTotal,
            description: "Filed mediation cases",
            descriptionIcon: (
                <span className="text-rose-400">↗︎</span>
            ),
            icon: <ShieldAlert className="w-6 h-6" />,
            lineColor: "via-rose-500/60",
            glowColor: "from-rose-500/20",
            valueColor: "text-rose-400",
            iconWrapperColor: "bg-rose-500/10",
            iconBorderColor: "border-rose-500/20",
            iconColor: "text-rose-400",
        },
        {
            label: "Open / Under Review",
            value: isLoading ? "—" : computedOpen,
            description: "Pending arbitration",
            descriptionIcon: <span>●</span>,
            icon: <AlertTriangle className="w-6 h-6" />,
            lineColor: "via-amber-400/60",
            glowColor: "from-amber-500/20",
            valueColor: "text-amber-400",
            iconWrapperColor: "bg-amber-500/10",
            iconBorderColor: "border-amber-500/20",
            iconColor: "text-amber-400",
        },
        {
            label: "Resolved Cases",
            value: isLoading ? "—" : computedResolved,
            description: "Arbitrated & closed",
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
            label: "Resolution SLA",
            value: isLoading ? "—" : computedResolutionRate,
            description: "Case settlement efficiency",
            descriptionIcon: <span>★</span>,
            icon: <Sparkles className="w-6 h-6" />,
            lineColor: "via-cyan-400/60",
            glowColor: "from-cyan-500/20",
            valueColor: "text-cyan-400",
            iconWrapperColor: "bg-cyan-500/10",
            iconBorderColor: "border-cyan-500/20",
            iconColor: "text-cyan-400",
        },
    ];

    return (
        <AZStats
            stats={stats}
        />
    );
};

export default DisputeStats;
