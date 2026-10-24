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
    FolderTree,
    Layers,
    Plus,
    Trash2,
} from "lucide-react";
import AddCategory from "./AddCategory";
import UpdateCategory from "./UpdateCategory";
import { TCategory } from "@/types/category";
import { TMeta } from "@/types/global";
import { TColumn } from "@/types/table";
import AZTable from "@/components/shared/AZTable";

export interface CategoriesTableProps {
    categories?: TCategory[];
    meta?: TMeta;
    isLoading?: boolean;
    isError?: boolean;
    error?: unknown;
    refetch?: () => void;
    isFetching?: boolean;
    page?: number;
    limit?: number;
    onPageChange?: (page: number) => void;
    onViewCategory?: (category: TCategory) => void;
    onEditCategory?: (category: TCategory) => void;
    onDeleteCategory?: (categoryId: string, categoryName: string) => void;
}

const CategoriesTable = ({
    categories = [],
    meta,
    isLoading = false,
    isError = false,
    error,
    refetch,
    isFetching = false,
    page = 1,
    limit = 10,
    onPageChange,
    onViewCategory,
    onEditCategory,
    onDeleteCategory,
}: CategoriesTableProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<TCategory | null>(null);

    const columns: TColumn<TCategory>[] = [
        {
            header: "Category Profile",
            accessor: (category) => {
                return (
                    <div className="flex items-center gap-3 max-w-sm">
                        <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-white/15 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
                            {category.icon ? (
                                <Image
                                    src={category.icon || "https://res.cloudinary.com/dkk9lvbtf/image/upload/v1785693062/amarzone_fnnw8s.png"}
                                    alt={category.name || "Category"}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                    {category.name?.charAt(0)?.toUpperCase() || "C"}
                                </div>
                            )}
                        </div>
                        <div className="space-y-0.5">
                            <div className="font-extrabold text-lg text-white flex items-center gap-1.5">
                                <span>{category.name}</span>
                                <span className="px-1.5 py-0.5 rounded bg-primary/15 border border-primary/30 text-primary text-[9px] font-black uppercase tracking-wider">
                                    Category
                                </span>
                            </div>
                            <div className="text-[12px] text-slate-400 flex items-center gap-1">
                                <Layers className="w-3 h-3 text-primary/80 shrink-0" />
                                <span className="truncate max-w-[150px]">Product Taxonomy</span>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Parent Department",
            accessor: (category) => {
                const department = typeof category.department === "object"
                    ? category.department
                    : null;
                const departmentName = department?.name || "Assigned Division";
                const departmentIcon = department?.icon;

                return (
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-900/80 border border-white/15 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
                            {departmentIcon ? (
                                <Image
                                    src={departmentIcon}
                                    alt={departmentName}
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                                    <Building2 className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white flex items-center gap-1.5">
                                <span>{departmentName}</span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                                Parent Taxonomy Division
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Catalog Status",
            accessor: (category) => {
                const isSuspended = category.isDeleted;
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
                                Active Catalog
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="w-3 h-3" />
                                Deactivated
                            </>
                        )}
                    </span>
                );
            },
        },
        {
            header: "Created Date",
            accessor: (category) => {
                const dateStr = category.createdAt
                    ? new Date(category.createdAt).toLocaleDateString("en-US", {
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
            accessor: (category) => (
                <div className="flex items-center gap-2">
                    {/* Quick View Details */}
                    <button
                        onClick={() => onViewCategory?.(category)}
                        title="View Details"
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-primary/10 text-slate-300 hover:text-primary transition-all duration-200 cursor-pointer"
                    >
                        <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Quick Edit Category */}
                    <button
                        onClick={() => {
                            if (onEditCategory) {
                                onEditCategory(category);
                            } else {
                                setEditingCategory(category);
                            }
                        }}
                        title="Edit Category"
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-primary/10 text-slate-300 hover:text-primary transition-all duration-200 cursor-pointer"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Category */}
                    <button
                        onClick={() => onDeleteCategory?.(category._id, category.name)}
                        title="Delete Category"
                        className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:border-rose-400/50 hover:bg-rose-500/20 text-rose-400 transition-all duration-200 cursor-pointer"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            ),
        },
    ];

    const totalCount = meta?.total ?? categories.length;

    return (
        <div>
            <AZTable
                title="Category Taxonomy"
                subtitle="Classified catalog divisions, category hierarchies, and product taxonomies."
                badgeText={totalCount}
                icon={<FolderTree className="w-5 h-5 text-primary" />}
                data={categories}
                columns={columns}
                keyExtractor={(cat: TCategory) => cat._id}
                isLoading={isLoading}
                isError={isError}
                errorMessage={(error as any)?.data?.message || "Failed to load category records."}
                onRetry={refetch}
                onRefresh={refetch}
                isRefreshing={isFetching}
                searchPlaceholder="Search categories by name..."
                emptyTitle="No Categories Found"
                emptyMessage="No category taxonomy records match your active filters or search query."
                emptyIcon={<FolderTree className="w-6 h-6 text-primary" />}
                headerActions={
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="btn btn-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black border-none shadow-md shadow-amber-400/20 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Category</span>
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

            <AddCategory
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                refetch={refetch}
            />

            <UpdateCategory
                isOpen={Boolean(editingCategory)}
                category={editingCategory}
                onClose={() => setEditingCategory(null)}
                refetch={refetch}
            />
        </div>
    );
};

export default CategoriesTable;
