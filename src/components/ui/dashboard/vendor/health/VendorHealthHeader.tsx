"use client";

import React from "react";
import {
    ShieldCheck,
    AlertTriangle,
    ShieldAlert,
    Ban,
    Clock,
    Sparkles,
} from "lucide-react";
import { TAccountHealthStatus } from "@/types/health";
import AZHeader from "@/components/shared/AZHeader";

export interface HealthHeaderProps {
    status?: TAccountHealthStatus;
    calculatedAt?: string | Date;
    isFetching?: boolean;
    onRefresh?: () => void;
}

const HealthHeader: React.FC<HealthHeaderProps> = ({
    status = "HEALTHY",
    calculatedAt,
    isFetching = false,
    onRefresh,
}) => {
    const getStatusBadge = () => {
        switch (status) {
            case "HEALTHY":
                return {
                    icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
                    label: "Healthy Standing",
                    badgeClass: "badge-success bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
                };
            case "AT_RISK":
                return {
                    icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
                    label: "At Risk (Review SLAs)",
                    badgeClass: "badge-warning bg-amber-500/10 border-amber-500/30 text-amber-300",
                };
            case "CRITICAL":
                return {
                    icon: <ShieldAlert className="w-4 h-4 text-orange-400" />,
                    label: "Critical Attention Required",
                    badgeClass: "badge-error bg-orange-500/10 border-orange-500/30 text-orange-300",
                };
            case "SUSPENDED":
                return {
                    icon: <Ban className="w-4 h-4 text-rose-400" />,
                    label: "Account Suspended",
                    badgeClass: "badge-error bg-rose-500/20 border-rose-500/40 text-rose-300",
                };
            default:
                return {
                    icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
                    label: "Healthy Standing",
                    badgeClass: "badge-success bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
                };
        }
    };

    const currentBadge = getStatusBadge();

    const formattedDate = calculatedAt
        ? new Date(calculatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "Recently evaluated";

    return (
        <AZHeader
            badgeLabel="Vendor Performance"
            badgeIcon={<Sparkles className="w-3.5 h-3.5" />}
            statusLabel="Live SLA Engine"
            title="Account"
            highlightTitle="Health & Compliance"
            description="Monitor your marketplace compliance metrics, fulfill customer orders within strict SLA thresholds, and keep your seller rating above 850 to unlock Amazon Buy Box privileges."
            onRefresh={onRefresh}
            isRefreshing={isFetching}
            actions={
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Dynamic Standing Badge */}
                    <span
                        className={`badge badge-outline gap-1.5 font-bold text-xs px-3 py-2.5 h-auto ${currentBadge.badgeClass}`}
                    >
                        {currentBadge.icon}
                        {currentBadge.label}
                    </span>

                    {/* Last Evaluated Timestamp */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="hidden sm:inline">Last evaluated:</span>
                        <span className="font-semibold text-slate-300">{formattedDate}</span>
                    </div>
                </div>
            }
        />
    );
};

export default HealthHeader;
