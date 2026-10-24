'use client';

import { useState } from "react";
import {
    AlertTriangle,
    Boxes,
    Building2,
    Calendar,
    CheckCircle2,
    Edit2,
    Eye,
    Layers,
    Package,
    Sparkles,
    Tag,
    Trash2,
} from "lucide-react";
import Image from "next/image";
import { TMeta } from "@/types/global";
import { TColumn } from "@/types/table";
import AZTable from "@/components/shared/AZTable";
import AZModal from "@/components/shared/AZModal";
import UpdateProduct from "./UpdateProduct";


export type TProduct = {
    _id: string;
    title: string;
    brand?: string;
    thumbnail?: string;
    features?: string[];
    tags?: string[];
    department?: {
        _id: string;
        name: string;
        icon?: string;
    } | string;
    category?: {
        _id: string;
        name: string;
        icon?: string;
    } | string;
    variants?: any[];
    author?: {
        name: string;
        role: string;
    };
    isBestSeller?: boolean;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export interface ProductsTableProps {
    products?: TProduct[];
    meta?: TMeta;
    isLoading?: boolean;
    isError?: boolean;
    error?: unknown;
    refetch?: () => void;
    isFetching?: boolean;
    page?: number;
    limit?: number;
    onPageChange?: (page: number) => void;
    onViewProduct?: (product: TProduct) => void;
    onEditProduct?: (product: TProduct) => void;
    onDeleteProduct?: (productId: string, productTitle: string) => void;
}

const ProductsTable = ({
    products = [],
    meta,
    isLoading = false,
    isError = false,
    error,
    refetch,
    isFetching = false,
    page = 1,
    limit = 10,
    onPageChange,
    onViewProduct,
    onEditProduct,
    onDeleteProduct,
}: ProductsTableProps) => {
    const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);
    const [editingProduct, setEditingProduct] = useState<TProduct | null>(null);

    const handleView = (product: TProduct) => {
        if (onViewProduct) {
            onViewProduct(product);
        } else {
            setSelectedProduct(product);
        }
    };

    const columns: TColumn<TProduct>[] = [
        {
            header: "Product & Brand",
            accessor: (product) => {
                const isBest = Boolean(product.isBestSeller);
                return (
                    <div className="flex items-center gap-3 max-w-sm">
                        <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-white/15 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
                            {product.thumbnail ? (
                                <Image
                                    src={product.thumbnail}
                                    alt={product.title || "Product"}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                                    <Package className="w-5 h-5" />
                                </div>
                            )}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                            <div className="font-extrabold text-sm text-white flex items-center gap-1.5 truncate">
                                <span className="truncate">{product.title}</span>
                                {isBest && (
                                    <span className="shrink-0 px-1.5 py-0.5 rounded bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5">
                                        <Sparkles className="w-2.5 h-2.5" /> Best Seller
                                    </span>
                                )}
                            </div>
                            <div className="text-[12px] text-slate-400 flex items-center gap-1">
                                <Tag className="w-3 h-3 text-amber-400/80 shrink-0" />
                                <span className="truncate">{product.brand || "Unbranded"}</span>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Taxonomy & Category",
            accessor: (product) => {
                const deptName =
                    typeof product.department === "object" && product.department !== null
                        ? product.department.name
                        : "General Dept";

                const catName =
                    typeof product.category === "object" && product.category !== null
                        ? product.category.name
                        : "General Category";

                return (
                    <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-primary/90 shrink-0" />
                            <span>{deptName}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <Layers className="w-3 h-3 text-indigo-400/80 shrink-0" />
                            <span>{catName}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Variants & Tags",
            accessor: (product) => {
                const variantCount = Array.isArray(product.variants) ? product.variants.length : 0;
                const tags = Array.isArray(product.tags) ? product.tags : [];

                return (
                    <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                            <Boxes className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                            <span>{variantCount} SKU Variant{variantCount !== 1 ? "s" : ""}</span>
                        </div>
                        {tags.length > 0 ? (
                            <div className="flex items-center gap-1 flex-wrap max-w-[200px]">
                                {tags.slice(0, 2).map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                                {tags.length > 2 && (
                                    <span className="text-[10px] text-slate-500">
                                        +{tags.length - 2}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="text-[11px] text-slate-500 italic">No tags</span>
                        )}
                    </div>
                );
            },
        },
        {
            header: "Catalog Status",
            accessor: (product) => {
                const isDeleted = Boolean(product.isDeleted);
                return (
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-sm ${!isDeleted
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            }`}
                    >
                        {!isDeleted ? (
                            <>
                                <CheckCircle2 className="w-3 h-3" />
                                Active SKU
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="w-3 h-3" />
                                Inactive
                            </>
                        )}
                    </span>
                );
            },
        },
        {
            header: "Created Date",
            accessor: (product) => {
                const dateStr = product.createdAt
                    ? new Date(product.createdAt).toLocaleDateString("en-US", {
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
            accessor: (product) => (
                <div className="flex items-center gap-2">
                    {/* Quick View Details */}
                    <button
                        type="button"
                        onClick={() => handleView(product)}
                        title="View Details"
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-slate-300 hover:text-amber-400 transition-all duration-200 cursor-pointer"
                    >
                        <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Quick Edit */}
                    <button
                        type="button"
                        onClick={() => {
                            if (onEditProduct) {
                                onEditProduct(product);
                            } else {
                                setEditingProduct(product);
                            }
                        }}
                        title="Edit Product"
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-slate-300 hover:text-amber-400 transition-all duration-200 cursor-pointer"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Suspend / Delete Product */}
                    <button
                        type="button"
                        onClick={() => onDeleteProduct?.(product._id, product.title)}
                        title="Delete Product"
                        className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:border-rose-400/50 hover:bg-rose-500/20 text-rose-400 transition-all duration-200 cursor-pointer"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            ),
        },
    ];

    const totalCount = meta?.total ?? products.length;

    return (
        <>
            <AZTable
                title="Product Catalog Directory"
                subtitle="Master SKU registry, multi-attribute variants, category mapping, and promotional attributes."
                badgeText={totalCount}
                icon={<Package className="w-5 h-5 text-amber-400" />}
                data={products}
                columns={columns}
                keyExtractor={(product: TProduct) => product._id}
                isLoading={isLoading}
                isError={isError}
                errorMessage={(error as any)?.data?.message || "Failed to load product catalog records."}
                onRetry={refetch}
                onRefresh={refetch}
                isRefreshing={isFetching}
                searchPlaceholder="Search products by title, brand, tag..."
                emptyTitle="No Products Found"
                emptyMessage="No product items match your active search terms or applied filters."
                emptyIcon={<Package className="w-6 h-6 text-amber-400" />}
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

            {/* Quick View Modal */}
            <AZModal
                isOpen={Boolean(selectedProduct)}
                onClose={() => setSelectedProduct(null)}
                size="md"
                title={selectedProduct?.title || "Product Details"}
                description={selectedProduct?.brand ? `Brand: ${selectedProduct.brand}` : "Catalog listing specifications"}
                icon={<Package className="w-5 h-5 text-amber-400" />}
            >
                {selectedProduct && (
                    <div className="space-y-4 pt-1">
                        {/* Header preview card with image */}
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                            <div className="w-14 h-14 rounded-xl bg-slate-900 border border-white/15 flex items-center justify-center overflow-hidden shrink-0">
                                {selectedProduct.thumbnail ? (
                                    <Image
                                        src={selectedProduct.thumbnail}
                                        alt={selectedProduct.title || "Product"}
                                        width={56}
                                        height={56}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Package className="w-7 h-7 text-amber-400" />
                                )}
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-sm font-bold text-white truncate">{selectedProduct.title}</h4>
                                <p className="text-xs text-amber-400 font-bold flex items-center gap-1 mt-0.5">
                                    <Tag className="w-3 h-3" />
                                    {selectedProduct.brand || "Unbranded"}
                                </p>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-white/10">
                            <div>
                                <span className="text-slate-400 font-medium">Department</span>
                                <p className="font-bold text-white">
                                    {typeof selectedProduct.department === "object" && selectedProduct.department !== null
                                        ? selectedProduct.department.name
                                        : "General"}
                                </p>
                            </div>
                            <div>
                                <span className="text-slate-400 font-medium">Category</span>
                                <p className="font-bold text-white">
                                    {typeof selectedProduct.category === "object" && selectedProduct.category !== null
                                        ? selectedProduct.category.name
                                        : "General"}
                                </p>
                            </div>
                            <div>
                                <span className="text-slate-400 font-medium">Status</span>
                                <p className="font-bold">
                                    {!selectedProduct.isDeleted ? (
                                        <span className="text-emerald-400">Active Listing</span>
                                    ) : (
                                        <span className="text-rose-400">Archived / Inactive</span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <span className="text-slate-400 font-medium">Best Seller</span>
                                <p className="font-bold text-amber-300">
                                    {selectedProduct.isBestSeller ? "Yes ★" : "Standard"}
                                </p>
                            </div>
                        </div>

                        {/* Features if available */}
                        {selectedProduct.features && selectedProduct.features.length > 0 && (
                            <div className="pt-2 border-t border-white/10">
                                <span className="text-xs text-slate-400 font-semibold block mb-1.5">Key Highlights</span>
                                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                                    {selectedProduct.features.map((feat, idx) => (
                                        <li key={idx} className="truncate">{feat}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Tags */}
                        {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                            <div className="pt-2 border-t border-white/10">
                                <span className="text-xs text-slate-400 font-semibold block mb-1.5">Discovery Tags</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedProduct.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-amber-300 font-mono"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Close Action */}
                        <div className="pt-3 flex justify-end border-t border-white/10">
                            <button
                                type="button"
                                onClick={() => setSelectedProduct(null)}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                )}
            </AZModal>

            {/* Edit Product Modal */}
            <UpdateProduct
                isOpen={Boolean(editingProduct)}
                product={editingProduct}
                onClose={() => setEditingProduct(null)}
                refetch={refetch}
            />
        </>
    );
};

export default ProductsTable;
