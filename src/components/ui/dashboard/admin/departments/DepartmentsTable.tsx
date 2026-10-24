'use client';

import { useState } from "react";
import Image from "next/image";
import {
    AlertTriangle,
    Building2,
    Calendar,
    CheckCircle2,
    Edit2,
    Eye,
    Layers,
    Plus,
    Trash2,
} from "lucide-react";
import AddDepartment from "./AddDepartment";
import UpdateDepartment from "./UpdateDepartment";
import { TDepartment } from "@/types/department";
import { TColumn } from "@/types/table";
import { TMeta } from "@/types/global";
import AZTable from "@/components/shared/AZTable";


export interface DepartmentsTableProps {
    departments?: TDepartment[];
    meta?: TMeta;
    isLoading?: boolean;
    isError?: boolean;
    error?: unknown;
    refetch?: () => void;
    isFetching?: boolean;
    page?: number;
    limit?: number;
    onPageChange?: (page: number) => void;
    onViewDepartment?: (department: TDepartment) => void;
    onEditDepartment?: (department: TDepartment) => void;
    onDeleteDepartment?: (departmentId: string, departmentName: string) => void;
}

const DepartmentsTable = ({
    departments = [],
    meta,
    isLoading = false,
    isError = false,
    error,
    refetch,
    isFetching = false,
    page = 1,
    limit = 10,
    onPageChange,
    onViewDepartment,
    onEditDepartment,
    onDeleteDepartment,
}: DepartmentsTableProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<TDepartment | null>(null);

    const columns: TColumn<TDepartment>[] = [
        {
            header: "Department Profile",
            accessor: (department) => {
                return (
                    <div className="flex items-center gap-3 max-w-sm">
                        <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-white/15 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
                            {department.icon ? (
                                <Image
                                    src={department.icon}
                                    alt={department.name || "Department"}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                                    {department.name?.charAt(0)?.toUpperCase() || "D"}
                                </div>
                            )}
                        </div>
                        <div className="space-y-0.5">
                            <div className="font-extrabold text-lg text-white flex items-center gap-1.5">
                                <span>{department.name}</span>
                                <span className="px-1.5 py-0.5 rounded bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[9px] font-black uppercase tracking-wider">
                                    Division
                                </span>
                            </div>
                            <div className="text-[12px] text-slate-400 flex items-center gap-1">
                                <Layers className="w-3 h-3 text-amber-400/80 shrink-0" />
                                <span className="truncate max-w-[150px]">Catalog Section</span>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Taxonomy & Hierarchy",
            accessor: () => {
                return (
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg border shadow-sm bg-amber-400/10 border-amber-400/20 text-amber-400">
                            <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-md font-bold text-white">
                                Root Department
                            </div>
                            <div className="text-[10px] text-slate-400">
                                Primary Catalog Division
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Security Status",
            accessor: (department) => {
                const isSuspended = department.isDeleted;
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
            accessor: (department) => {
                const dateStr = department.createdAt
                    ? new Date(department.createdAt).toLocaleDateString("en-US", {
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
            accessor: (department) => (
                <div className="flex items-center gap-2">
                    {/* Quick View Details */}
                    <button
                        onClick={() => onViewDepartment?.(department)}
                        title="View Details"
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-slate-300 hover:text-amber-400 transition-all duration-200 cursor-pointer"
                    >
                        <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Quick Edit Department */}
                    <button
                        onClick={() => {
                            if (onEditDepartment) {
                                onEditDepartment(department);
                            } else {
                                setEditingDepartment(department);
                            }
                        }}
                        title="Edit Department"
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-slate-300 hover:text-amber-400 transition-all duration-200 cursor-pointer"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Suspend / Delete Department */}
                    <button
                        onClick={() => onDeleteDepartment?.(department._id, department.name)}
                        title="Delete Department"
                        className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:border-rose-400/50 hover:bg-rose-500/20 text-rose-400 transition-all duration-200 cursor-pointer"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            ),
        },
    ];

    const totalCount = meta?.total ?? departments.length;

    return (
        <div>
            <AZTable
                title="Department Taxonomy"
                subtitle="Catalog business divisions, category segregation, and system taxonomies."
                badgeText={totalCount}
                icon={<Building2 className="w-5 h-5 text-amber-400" />}
                data={departments}
                columns={columns}
                keyExtractor={(dept: TDepartment) => dept._id}
                isLoading={isLoading}
                isError={isError}
                errorMessage={(error as any)?.data?.message || "Failed to load department records."}
                onRetry={refetch}
                onRefresh={refetch}
                isRefreshing={isFetching}
                searchPlaceholder="Search departments by name..."
                emptyTitle="No Departments Found"
                emptyMessage="No department taxonomy records match your active filters or search query."
                emptyIcon={<Building2 className="w-6 h-6 text-amber-400" />}
                headerActions={
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="btn btn-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black border-none shadow-md shadow-amber-400/20 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Department</span>
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

            <AddDepartment
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                refetch={refetch}
            />
            <UpdateDepartment
                isOpen={Boolean(editingDepartment)}
                department={editingDepartment}
                onClose={() => setEditingDepartment(null)}
                refetch={refetch}
            />
        </div>
    );
};

export default DepartmentsTable;