'use client';

import React, { useState } from "react";
import Image from "next/image";
import {
    AlertTriangle,
    Calendar,
    CheckCircle2,
    Edit2,
    Eye,
    Mail,
    MapPin,
    Phone,
    Plus,
    Trash2,
    Users,
} from "lucide-react";
import { TCustomer } from "@/types/customer";
import { TMeta } from "@/types/global";
import { TColumn } from "@/types/table";
import AZTable from "@/components/shared/AZTable";
import CustomerDetailsModal from "./CustomerDetailsModal";

export interface CustomersTableProps {
    customers?: TCustomer[];
    meta?: TMeta;
    isLoading?: boolean;
    isError?: boolean;
    error?: unknown;
    refetch?: () => void;
    isFetching?: boolean;
    page?: number;
    limit?: number;
    onPageChange?: (page: number) => void;
    onViewCustomer?: (customer: TCustomer) => void;
    onEditCustomer?: (customer: TCustomer) => void;
    onDeleteCustomer?: (customerId: string, customerName: string) => void;
}

const CustomersTable = ({
    customers = [],
    meta,
    isLoading = false,
    isError = false,
    error,
    refetch,
    isFetching = false,
    page = 1,
    limit = 10,
    onPageChange,
    onViewCustomer,
    onEditCustomer,
    onDeleteCustomer,
}: CustomersTableProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<TCustomer | null>(null);
    const [viewingCustomer, setViewingCustomer] = useState<TCustomer | null>(null);

    const columns: TColumn<TCustomer>[] = [
        {
            header: "Customer Profile",
            accessor: (customer: TCustomer) => {
                return (
                    <div className="flex items-center gap-3 max-w-sm">
                        <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-white/15 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
                            {customer.avatar ? (
                                <Image
                                    src={customer.avatar}
                                    alt={customer.name || "Customer"}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                                    {customer.name?.charAt(0)?.toUpperCase() || "C"}
                                </div>
                            )}
                        </div>
                        <div className="space-y-0.5">
                            <div className="font-extrabold text-lg text-white flex items-center gap-1.5">
                                <span>{customer.name}</span>
                            </div>
                            <div className="text-[12px] text-slate-400 flex items-center gap-1">
                                <Mail className="w-3 h-3 text-amber-400/80 shrink-0" />
                                <span className="truncate max-w-[170px]">{customer.email}</span>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Phone Contact",
            accessor: (customer: TCustomer) => (
                <div className="text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
                    <Phone className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
                    <span>{customer.phone || "No phone linked"}</span>
                </div>
            ),
        },
        {
            header: "Shipping Destination",
            accessor: (customer: TCustomer) => {
                const addr = customer.address;
                const formattedAddr = addr
                    ? [addr.street, addr.state, addr.country].filter(Boolean).join(", ")
                    : "";

                return (
                    <div className="text-[11px] text-slate-300 flex items-center gap-1.5 max-w-[200px] truncate">
                        <MapPin className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
                        <span className="truncate" title={formattedAddr || "No address on file"}>
                            {formattedAddr || "No address on file"}
                        </span>
                    </div>
                );
            },
        },
        {
            header: "Account Status",
            accessor: (customer: TCustomer) => {
                const isSuspended = customer.isDeleted;
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
                                Active Shopper
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="w-3 h-3" />
                                Suspended / Off
                            </>
                        )}
                    </span>
                );
            },
        },
        {
            header: "Registered Date",
            accessor: (customer: TCustomer) => {
                const dateStr = customer.createdAt
                    ? new Date(customer.createdAt).toLocaleDateString("en-US", {
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
            accessor: (customer: TCustomer) => (
                <div className="flex items-center gap-2">
                    {/* Quick View Details */}
                    <button
                        onClick={() => {
                            if (onViewCustomer) {
                                onViewCustomer(customer);
                            } else {
                                setViewingCustomer(customer);
                            }
                        }}
                        title="View Customer Profile"
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-slate-300 hover:text-amber-400 transition-all duration-200 cursor-pointer"
                    >
                        <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Quick Edit Customer */}
                    <button
                        onClick={() => {
                            if (onEditCustomer) {
                                onEditCustomer(customer);
                            } else {
                                setEditingCustomer(customer);
                            }
                        }}
                        title="Edit Customer"
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-slate-300 hover:text-amber-400 transition-all duration-200 cursor-pointer"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Suspend / Delete Customer */}
                    <button
                        onClick={() => onDeleteCustomer?.(customer._id, customer.name)}
                        title="Revoke / Suspend Customer"
                        className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:border-rose-400/50 hover:bg-rose-500/20 text-rose-400 transition-all duration-200 cursor-pointer"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            ),
        },
    ];

    const totalCount = meta?.total ?? customers.length;

    return (
        <div>
            <AZTable
                title="Customer Directory"
                subtitle="Registered retail shoppers, active consumers, and destination addresses."
                badgeText={totalCount}
                icon={<Users className="w-5 h-5 text-amber-400" />}
                data={customers}
                columns={columns}
                keyExtractor={(customer: TCustomer) => customer._id}
                isLoading={isLoading}
                isError={isError}
                errorMessage={(error as any)?.data?.message || "Failed to load customer records."}
                onRetry={refetch}
                onRefresh={refetch}
                isRefreshing={isFetching}
                searchPlaceholder="Search customers by name, email, phone..."
                emptyTitle="No Customers Found"
                emptyMessage="No customer accounts match your active filters or search query."
                emptyIcon={<Users className="w-6 h-6 text-amber-400" />}
                headerActions={
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="btn btn-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black border-none shadow-md shadow-amber-400/20 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Customer</span>
                    </button>
                }
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

            {/* View Customer Details Modal */}
            <CustomerDetailsModal
                isOpen={Boolean(viewingCustomer)}
                customer={viewingCustomer}
                onClose={() => setViewingCustomer(null)}
            />
        </div>
    );
};

export default CustomersTable;
