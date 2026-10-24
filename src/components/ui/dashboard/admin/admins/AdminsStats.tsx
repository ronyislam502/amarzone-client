'use client';

import AZStats, { TAZStat } from "@/components/shared/AZStats";
import { useAllAdminsQuery } from "@/redux/features/admin/adminApi";
import { TAdmin } from "@/types/admin";
import { TMeta } from "@/types/global";
import {
    UserCheck,
    ShieldCheck,
    CheckCircle2,
    Lock,
} from "lucide-react";

export interface AdminsStatsProps {
    totalAdmins?: number;
    activeAdmins?: number;
    superAdmins?: number;
    securityRate?: string;
    admins?: TAdmin[];
    isLoading?: boolean;
    meta?: TMeta;
}

const AdminsStats = ({
    totalAdmins,
    activeAdmins,
    superAdmins,
    securityRate,
    admins: initialAdmins,
    isLoading: propIsLoading,
    meta: propMeta,
}: AdminsStatsProps = {}) => {
    // Skip redundant network query if data is already provided by parent (AdminsData)
    const shouldSkip = Boolean(initialAdmins !== undefined && propIsLoading !== undefined);
    const { data: adminsData, isLoading: queryLoading } = useAllAdminsQuery({}, { skip: shouldSkip });

    const isLoading = propIsLoading !== undefined ? propIsLoading : queryLoading;
    const admins = initialAdmins || (adminsData?.data as TAdmin[] | undefined) || [];
    const meta = propMeta || adminsData?.meta;

    const computedTotal = totalAdmins ?? meta?.total ?? admins.length;
    const computedActive =
        activeAdmins ??
        admins.filter((admin) => {
            const isSuspended = admin.isDeleted;
            const status = typeof admin.user === "object" ? admin.user?.status : undefined;
            return !isSuspended && status !== "blocked" && status !== "inactive";
        }).length;

    const computedSuper =
        superAdmins ??
        admins.filter((admin) => {
            const role = typeof admin.user === "object" ? admin.user?.role : undefined;
            const normalized = role?.toLowerCase();
            return normalized === "super_admin";
        }).length;

    const computedSecurityRate =
        securityRate ??
        (computedTotal > 0
            ? `${((computedActive / computedTotal) * 100).toFixed(1)}%`
            : "100%");

    const stats: TAZStat[] = [
        {
            label: "Total Staff",
            value: isLoading ? "—" : computedTotal,
            description: "Administrative accounts",
            descriptionIcon: (
                <span className="text-emerald-400">↗︎</span>
            ),
            icon: <UserCheck className="w-6 h-6" />,
            lineColor: "via-amber-400/60",
            glowColor: "from-amber-500/20",
            valueColor: "text-amber-400",
            iconWrapperColor: "bg-amber-400/10",
            iconBorderColor: "border-amber-400/20",
            iconColor: "text-amber-400",
        },
        {
            label: "Active Admins",
            value: isLoading ? "—" : computedActive,
            description: "Operational & authorized",
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
            label: "Super Admins",
            value: isLoading ? "—" : computedSuper,
            description: "Full root system control",
            descriptionIcon: <span>★</span>,
            icon: <ShieldCheck className="w-6 h-6" />,
            lineColor: "via-amber-400/60",
            glowColor: "from-amber-500/20",
            valueColor: "text-amber-300",
            iconWrapperColor: "bg-amber-500/10",
            iconBorderColor: "border-amber-500/20",
            iconColor: "text-amber-300",
        },
        {
            label: "Compliance Rate",
            value: isLoading ? "—" : computedSecurityRate,
            description: "Verified session audit",
            descriptionIcon: (
                <span className="text-indigo-400">✓</span>
            ),
            icon: <Lock className="w-6 h-6" />,
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

export default AdminsStats;
