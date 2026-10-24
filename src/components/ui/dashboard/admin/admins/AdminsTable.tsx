'use client';


import {
    AlertTriangle,
    Calendar,
    CheckCircle2,
    Edit2,
    Eye,
    Mail,
    Phone,
    Plus,
    Shield,
    ShieldAlert,
    Trash2,
    UserCheck,
} from "lucide-react";
import Image from "next/image";
import CreateAdmin from "./CreateAdmin";
import { useState } from "react";
import { TAdmin } from "@/types/admin";
import { TMeta } from "@/types/global";
import { TColumn } from "@/types/table";
import AZTable from "@/components/shared/AZTable";

export interface AdminsTableProps {
    admins?: TAdmin[];
    meta?: TMeta;
    isLoading?: boolean;
    isError?: boolean;
    error?: unknown;
    refetch?: () => void;
    isFetching?: boolean;
    page?: number;
    limit?: number;
    onPageChange?: (page: number) => void;
    onViewAdmin?: (admin: TAdmin) => void;
    onEditAdmin?: (admin: TAdmin) => void;
    onDeleteAdmin?: (adminId: string, adminName: string) => void;
}

const AdminsTable = ({
    admins = [],
    meta,
    isLoading = false,
    isError = false,
    error,
    refetch,
    isFetching = false,
    page = 1,
    limit = 10,
    onPageChange,
    onViewAdmin,
    onEditAdmin,
    onDeleteAdmin,
}: AdminsTableProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<TAdmin | null>(null);

    const columns: TColumn<TAdmin>[] = [
        {
            header: "Admin Profile",
            accessor: (admin) => {
                const role =
                    typeof admin.user === "object" ? admin.user?.role : undefined;
                const isSuper = role === "super_admin" || role === "SUPER_ADMIN";

                return (
                    <div className="flex items-center gap-3 max-w-sm">
                        <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-white/15 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
                            {admin.avatar ? (
                                <Image
                                    src={admin.avatar}
                                    alt={admin.name || "Admin"}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                                    {admin.name?.charAt(0)?.toUpperCase() || "A"}
                                </div>
                            )}
                        </div>
                        <div className="space-y-0.5">
                            <div className="font-extrabold text-lg text-white flex items-center gap-1.5">
                                <span>{admin.name}</span>
                                {isSuper && (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[9px] font-black uppercase tracking-wider">
                                        Super
                                    </span>
                                )}
                            </div>
                            <div className="text-[12px] text-slate-400 flex items-center gap-1">
                                <Mail className="w-3 h-3 text-amber-400/80 shrink-0" />
                                <span className="truncate max-w-[150px]">{admin.email}</span>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Authorization & Role",
            accessor: (admin) => {
                const roleStr =
                    typeof admin.user === "object"
                        ? admin.user?.role || "ADMIN"
                        : "ADMIN";
                const isSuper =
                    roleStr === "super_admin" || roleStr === "SUPER_ADMIN";

                return (
                    <div className="flex items-center gap-2">
                        <div
                            className={`p-1.5 rounded-lg border shadow-sm ${isSuper
                                ? "bg-amber-400/10 border-amber-400/20 text-amber-400"
                                : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                }`}
                        >
                            {isSuper ? (
                                <ShieldAlert className="w-4 h-4" />
                            ) : (
                                <Shield className="w-4 h-4" />
                            )}
                        </div>
                        <div>
                            <div className="text-md font-bold text-white">
                                {isSuper ? "Super Administrator" : "Platform Admin"}
                            </div>
                            <div className="text-[10px] text-slate-400">
                                {isSuper ? "Full Root Privileges" : "Standard Operations"}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Phone Contact",
            accessor: (admin) => (
                <div className="text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
                    <Phone className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
                    <span>{admin.phone || "No phone linked"}</span>
                </div>
            ),
        },
        {
            header: "Security Status",
            accessor: (admin) => {
                const isSuspended = admin.isDeleted;
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
                                Active Staff
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="w-3 h-3" />
                                Revoked / Off
                            </>
                        )}
                    </span>
                );
            },
        },
        {
            header: "Onboarded Date",
            accessor: (admin) => {
                const dateStr = admin.createdAt
                    ? new Date(admin.createdAt).toLocaleDateString("en-US", {
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
            accessor: (admin) => (
                <div className="flex items-center gap-2">
                    {/* Quick View Details */}
                    <button
                        onClick={() => onViewAdmin?.(admin)}
                        title="View Details"
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-slate-300 hover:text-amber-400 transition-all duration-200 cursor-pointer"
                    >
                        <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Quick Edit Admin */}
                    <button
                        onClick={() => {
                            if (onEditAdmin) {
                                onEditAdmin(admin);
                            } else {
                                setEditingAdmin(admin);
                            }
                        }}
                        title="Edit Administrator"
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-slate-300 hover:text-amber-400 transition-all duration-200 cursor-pointer"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Suspend / Delete Admin */}
                    <button
                        onClick={() => onDeleteAdmin?.(admin._id, admin.name)}
                        title="Revoke Privileges"
                        className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:border-rose-400/50 hover:bg-rose-500/20 text-rose-400 transition-all duration-200 cursor-pointer"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            ),
        },
    ];

    const totalCount = meta?.total ?? admins.length;

    return (
        <div>
            <AZTable
                title="Administrator Roster"
                subtitle="Platform security operators, system maintainers, and super administrators."
                badgeText={totalCount}
                icon={<UserCheck className="w-5 h-5 text-amber-400" />}
                data={admins}
                columns={columns}
                keyExtractor={(admin: TAdmin) => admin._id}
                isLoading={isLoading}
                isError={isError}
                errorMessage={(error as any)?.data?.message || "Failed to load administrator records."}
                onRetry={refetch}
                onRefresh={refetch}
                isRefreshing={isFetching}
                searchPlaceholder="Search admins by name, email, phone..."
                emptyTitle="No Administrators Found"
                emptyMessage="No administrative accounts match your active filters or search query."
                emptyIcon={<UserCheck className="w-6 h-6 text-amber-400" />}
                headerActions={
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="btn btn-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black border-none shadow-md shadow-amber-400/20 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Admin</span>
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
            <CreateAdmin
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                refetch={refetch}
            />
        </div>
    );
};

export default AdminsTable;