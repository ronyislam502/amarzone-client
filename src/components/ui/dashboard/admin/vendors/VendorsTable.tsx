'use client';

import AZTable from "@/components/shared/AZTable";
import { TMeta } from "@/types/global";
import { TColumn } from "@/types/table";
import { TVendor } from "@/types/vendor";
import {
    AlertTriangle,
    Calendar,
    CheckCircle2,
    Edit2,
    Eye,
    Mail,
    MapPin,
    Phone,
    Store,
    Trash2,
} from "lucide-react";
import Image from "next/image";

export interface VendorsTableProps {
    vendors?: TVendor[];
    meta?: TMeta;
    isLoading?: boolean;
    isError?: boolean;
    error?: unknown;
    refetch?: () => void;
    isFetching?: boolean;
    page?: number;
    limit?: number;
    onPageChange?: (page: number) => void;
    onViewVendor?: (vendor: TVendor) => void;
    onEditVendor?: (vendor: TVendor) => void;
    onDeleteVendor?: (vendorId: string, vendorName: string) => void;
}

const VendorsTable = ({
    vendors = [],
    meta,
    isLoading = false,
    isError = false,
    error,
    refetch,
    isFetching = false,
    page = 1,
    limit = 10,
    onPageChange,
    onViewVendor,
    onEditVendor,
    onDeleteVendor,
}: VendorsTableProps) => {

    const columns: TColumn<TVendor>[] = [
        {
            header: "Store & Brand",
            accessor: (vendor) => (
                <div className="flex items-center gap-3 max-w-sm">
                    <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-white/15 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
                        {vendor.logo ? (
                            <Image
                                src={vendor?.logo}
                                alt={vendor.name || "Vendor"}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                                {vendor.name?.charAt(0)?.toUpperCase() || "V"}
                            </div>
                        )}
                    </div>
                    <div className="space-y-0.5">
                        <div className="font-extrabold text-sm text-white">
                            {vendor.name}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-amber-400/80 shrink-0" />
                            <span className="truncate max-w-[150px]">{vendor.email}</span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: "Business Phone",
            accessor: (vendor) => (
                <div className="text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
                    <Phone className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
                    <span>{vendor.phone || "No phone provided"}</span>
                </div>
            ),
        },
        {
            header: "Commercial Location",
            accessor: (vendor) => {
                const addr = vendor.address;
                if (!addr || (!addr.state && !addr.country && !addr.street)) {
                    return (
                        <span className="text-[11px] text-slate-500 italic">
                            Address not specified
                        </span>
                    );
                }
                return (
                    <div className="text-[11px] text-slate-300 max-w-[200px] truncate">
                        <div className="flex items-center gap-1 text-slate-200 font-semibold truncate">
                            <MapPin className="w-3 h-3 text-amber-400/80 shrink-0" />
                            <span>
                                {addr.state || ""}
                                {addr.country ? ` (${addr.country})` : ""}
                            </span>
                        </div>
                        {addr.street && (
                            <div className="text-[10px] text-slate-400 truncate pl-4">
                                {addr.street}
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            header: "Merchant Status",
            accessor: (vendor) => {
                const isSuspended = vendor.isDeleted;
                return (
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-sm ${!isSuspended
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            }`}
                    >
                        {!isSuspended ? (
                            <>
                                <CheckCircle2 className="w-3 h-3" />
                                Authorized
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="w-3 h-3" />
                                Suspended
                            </>
                        )}
                    </span>
                );
            },
        },
        {
            header: "Onboarding Date",
            accessor: (vendor) => {
                const dateStr = vendor.createdAt
                    ? new Date(vendor.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })
                    : "N/A";

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
            accessor: (vendor) => (
                <div className="flex items-center gap-2">
                    {/* Quick View Details */}
                    <button
                        onClick={() => onViewVendor?.(vendor)}
                        title="View Details"
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-slate-300 hover:text-amber-400 transition-all duration-200 cursor-pointer"
                    >
                        <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Quick Edit Vendor */}
                    <button
                        onClick={() => onEditVendor?.(vendor)}
                        title="Edit Store Profile"
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-slate-300 hover:text-amber-400 transition-all duration-200 cursor-pointer"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Suspend / Delete Vendor */}
                    <button
                        onClick={() => onDeleteVendor?.(vendor._id, vendor.name)}
                        title="Suspend Merchant"
                        className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:border-rose-400/50 hover:bg-rose-500/20 text-rose-400 transition-all duration-200 cursor-pointer"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            ),
        },
    ];

    const totalCount = meta?.total ?? vendors.length;

    return (
        <AZTable
            title="Vendors Directory"
            subtitle="Registered merchant storefronts, partner accounts, and vendor governance."
            badgeText={totalCount}
            icon={<Store className="w-5 h-5 text-amber-400" />}
            data={vendors}
            columns={columns}
            keyExtractor={(vendor: TVendor) => vendor._id}
            isLoading={isLoading}
            isError={isError}
            errorMessage={(error as any)?.data?.message || "Failed to load vendors list."}
            onRetry={refetch}
            onRefresh={refetch}
            isRefreshing={isFetching}
            searchPlaceholder="Search vendors by store name, email, phone, location..."
            emptyTitle="No Vendors Found"
            emptyMessage="No merchant storefronts match your active filters or search criteria."
            emptyIcon={<Store className="w-6 h-6 text-amber-400" />}
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
    );
};

export default VendorsTable;