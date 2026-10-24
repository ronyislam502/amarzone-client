'use client';

import { useState } from "react";
import {
    AlertTriangle,
    Calendar,
    CheckCircle2,
    Eye,
    Package,
    Scale,
    ShieldAlert,
    Store,
    User,
} from "lucide-react";
import { TDispute } from "@/types/dispute";
import { TMeta } from "@/types/global";
import { TColumn } from "@/types/table";
import AZTable from "@/components/shared/AZTable";
import DisputeResolveModal from "./DisputeResolveModal";

export interface DisputeTableProps {
    disputes?: TDispute[];
    meta?: TMeta;
    isLoading?: boolean;
    isError?: boolean;
    error?: unknown;
    refetch?: () => void;
    isFetching?: boolean;
    page?: number;
    limit?: number;
    onPageChange?: (page: number) => void;
    onViewDispute?: (dispute: TDispute) => void;
}

const DisputeTable = ({
    disputes = [],
    meta,
    isLoading = false,
    isError = false,
    error,
    refetch,
    isFetching = false,
    page = 1,
    limit = 10,
    onPageChange,
    onViewDispute,
}: DisputeTableProps) => {
    const [selectedDispute, setSelectedDispute] = useState<TDispute | null>(null);

    const handleView = (dispute: TDispute) => {
        if (onViewDispute) {
            onViewDispute(dispute);
        } else {
            setSelectedDispute(dispute);
        }
    };

    const columns: TColumn<TDispute>[] = [
        {
            header: "Dispute Case & Reason",
            accessor: (dispute) => {
                const orderId =
                    typeof dispute.order === "object" && dispute.order !== null
                        ? (dispute.order as any)._id || String(dispute.order)
                        : String(dispute.order || "");

                return (
                    <div className="flex items-center gap-3 max-w-sm">
                        <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-white/15 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
                            <ShieldAlert className="w-6 h-6 text-error" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                            <div className="font-extrabold text-sm text-white truncate flex items-center gap-1.5">
                                <span className="truncate">{dispute.reason}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                                <Package className="w-3 h-3 text-error shrink-0" />
                                <span>Order #{orderId.slice(-6).toUpperCase()}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-slate-500">Case #{dispute._id.slice(-6).toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Claimant (Customer)",
            accessor: (dispute) => {
                const customer = typeof dispute.customer === "object" && dispute.customer !== null
                    ? dispute.customer
                    : null;
                const name = (customer as any)?.name || (customer as any)?.email || "Customer";
                const email = (customer as any)?.email || "";

                return (
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-info/10 border border-info/20 flex items-center justify-center shrink-0 text-info">
                            <User className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{name}</p>
                            {email && (
                                <p className="text-[10px] text-slate-400 truncate">{email}</p>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Respondent (Vendor)",
            accessor: (dispute) => {
                const vendor = typeof dispute.vendor === "object" && dispute.vendor !== null
                    ? dispute.vendor
                    : null;
                const name = (vendor as any)?.name || (vendor as any)?.email || "Vendor Store";

                return (
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-warning/10 border border-warning/20 flex items-center justify-center shrink-0 text-warning">
                            <Store className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{name}</p>
                            <span className="text-[10px] text-slate-500">Merchant</span>
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Case Status",
            accessor: (dispute) => {
                const status = dispute.status;
                let badgeClass = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                let statusLabel = "Open Case";
                let Icon = AlertTriangle;

                if (status === "UNDER_REVIEW") {
                    badgeClass = "bg-sky-500/10 text-sky-400 border-sky-500/20";
                    statusLabel = "Under Review";
                    Icon = Scale;
                } else if (status === "RESOLVED") {
                    badgeClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                    statusLabel = "Resolved";
                    Icon = CheckCircle2;
                } else if (status === "REJECTED") {
                    badgeClass = "bg-rose-500/10 text-rose-400 border-rose-500/20";
                    statusLabel = "Rejected";
                    Icon = AlertTriangle;
                }

                return (
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-sm ${badgeClass}`}
                    >
                        <Icon className="w-3 h-3" />
                        <span>{statusLabel}</span>
                    </span>
                );
            },
        },
        {
            header: "Filed Date",
            accessor: (dispute) => {
                const dateStr = dispute.createdAt
                    ? new Date(dispute.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })
                    : "Recent";

                return (
                    <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{dateStr}</span>
                    </div>
                );
            },
        },
        {
            header: "Actions",
            accessor: (dispute) => (
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => handleView(dispute)}
                        title="Mediate Dispute"
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-error/40 hover:bg-error/10 text-slate-300 hover:text-error transition-all duration-200 cursor-pointer flex items-center gap-1 text-xs font-bold"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Mediate</span>
                    </button>
                </div>
            ),
        },
    ];

    const totalCount = meta?.total ?? disputes.length;

    return (
        <div>
            <AZTable
                title="Active Disputes"
                subtitle="Live order dispute escrow claims & arbitration tracking."
                badgeText={totalCount}
                icon={<ShieldAlert className="w-5 h-5 text-error" />}
                data={disputes}
                columns={columns}
                keyExtractor={(dispute: TDispute) => dispute._id}
                isLoading={isLoading}
                isError={isError}
                errorMessage={(error as any)?.data?.message || "Failed to load dispute records."}
                onRetry={refetch}
                onRefresh={refetch}
                isRefreshing={isFetching}
                searchPlaceholder="Search disputes by reason, customer or order..."
                emptyTitle="No Disputes Found"
                emptyMessage="All customer and vendor orders are settled without active mediation."
                emptyIcon={<ShieldAlert className="w-6 h-6 text-error" />}
                pagination={
                    onPageChange && meta && meta.total > 0
                        ? {
                            page,
                            limit,
                            total: meta.total,
                            onPageChange,
                        }
                        : undefined
                }
            />

            {/* Dispute Resolve / Mediation Modal */}
            <DisputeResolveModal
                isOpen={Boolean(selectedDispute)}
                dispute={selectedDispute}
                onClose={() => setSelectedDispute(null)}
                refetch={refetch}
            />
        </div>
    );
};

export default DisputeTable;
