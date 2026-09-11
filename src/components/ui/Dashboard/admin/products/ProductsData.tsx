"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ShoppingBag,
  Eye,
  Edit2,
  PlusCircle,
  CheckCircle2,
  Layers,
  Building2,
  Boxes,
  Flame,
  Image as ImageIcon,
  ListCheck,
  ShieldCheck,
} from "lucide-react";
import { useAllProductsQuery } from "@/redux/features/product/productApi";
import { TProduct } from "@/src/types/product";
import { TColumn } from "@/src/types/table";
import AZTable from "../../../shared/AZTable";
import Modal from "../../../shared/Modal";
import CreateProduct from "./CreateProductModal";
import UpdateProductModal from "./UpdateProductModal";
import ProductDetailsModal from "./ProductDetailsModal";
import CreateVariantModal from "./CreateVariantModal";
import ProductsFilterBar, { ProductsFilterState } from "./ProductsFilterBar";

export interface ProductsStatsData {
  totalProducts: number;
  totalVariants: number;
  bestSellerCount: number;
  avgRating: number;
}

export interface ProductsDataProps {
  onStatsChange?: (stats: ProductsStatsData) => void;
  registerExportHandler?: (handler: () => void) => void;
  registerCreateHandler?: (handler: () => void) => void;
}

const initialFilters: ProductsFilterState = {
  department: "",
  category: "",
  sort: "",
};

const ProductsData: React.FC<ProductsDataProps> = ({
  onStatsChange,
  registerExportHandler,
  registerCreateHandler,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ProductsFilterState>(initialFilters);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState<TProduct | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProductEdit, setSelectedProductEdit] = useState<TProduct | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProductVariant, setSelectedProductVariant] = useState<TProduct | null>(null);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

  // RTK Query: connects to router.get("/", ProductControllers.allProducts)
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAllProductsQuery({
    search: searchTerm,
    page: String(page),
    limit: String(limit),
    department: filters.department || undefined,
    category: filters.category || undefined,
    sort: filters.sort || undefined,
  });

  const products: TProduct[] = responseData?.data || [];
  const meta = responseData?.meta;

  // Register parent actions
  useEffect(() => {
    if (registerCreateHandler) {
      registerCreateHandler(() => setIsCreateModalOpen(true));
    }
  }, [registerCreateHandler]);

  // Export CSV handler (strictly TProduct & TVariants metadata, no inventory/pricing data)
  const handleExportCsv = useCallback(() => {
    if (!products.length) return;
    const headers = [
      "Title",
      "Brand",
      "Department",
      "Category",
      "Author Name",
      "Author Role",
      "Features Count",
      "Tags",
      "Variants Count",
      "Best Seller",
      "Status",
    ];
    const rows = products.map((p) => [
      `"${(p.title || "").replace(/"/g, '""')}"`,
      `"${(p.brand || "").replace(/"/g, '""')}"`,
      `"${(typeof p.department === "object" ? p.department?.name : p.department) || "General"}"`,
      `"${(typeof p.category === "object" ? p.category?.name : p.category) || "Unassigned"}"`,
      `"${p.author?.name || "Super Admin"}"`,
      `"${p.author?.role || "SUPER_ADMIN"}"`,
      p.features?.length || 0,
      `"${(p.tags || []).join(", ")}"`,
      p.variants?.length || 0,
      p.isBestSeller ? "Yes" : "No",
      p.isDeleted ? "Archived" : "Active",
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `products_catalog_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [products]);

  useEffect(() => {
    if (registerExportHandler) {
      registerExportHandler(handleExportCsv);
    }
  }, [registerExportHandler, handleExportCsv]);

  // Notify parent of stats
  useEffect(() => {
    if (onStatsChange && meta) {
      const totalVariants = products.reduce((acc, p) => acc + (p.variants?.length || 0), 0);
      const bestSellerCount = products.filter((p) => p.isBestSeller).length;
      // const ratings = products.map((p) => p.averageRating).filter(Boolean);
      // const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 4.8;
      const avgRating = 4.5

      onStatsChange({
        totalProducts: meta.total || products.length,
        totalVariants,
        bestSellerCount,
        avgRating,
      });
    }
  }, [products, meta, onStatsChange]);

  const handleFilterChange = (newFilters: Partial<ProductsFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setSearchTerm("");
    setPage(1);
  };

  // Columns definition strictly showing TProduct and TVariants data (no inventory/pricing data)
  const columns: TColumn<TProduct>[] = [
    {
      header: "Product Listing",
      accessor: (prod) => {
        const thumb =
          (prod as any).thumbnail ||
          prod.variants?.[0]?.thumbnail ||
          prod.variants?.[0]?.images?.[0];

        return (
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative">
              {thumb ? (
                <img
                  src={thumb}
                  alt={prod.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-5 h-5 text-slate-500" />
              )}
            </div>
            <div className="max-w-[220px] sm:max-w-xs">
              <div
                className="font-extrabold text-xs text-white truncate hover:text-amber-400 transition-colors cursor-pointer"
                title={prod.title}
                onClick={() => {
                  setSelectedProductDetails(prod);
                  setIsDetailsModalOpen(true);
                }}
              >
                {prod.title}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="font-bold text-amber-400/90 uppercase tracking-wider text-[10px]">
                  {prod.brand}
                </span>
                {prod.isBestSeller && (
                  <span className="badge badge-xs bg-orange-500/10 text-orange-400 border border-orange-500/30 gap-1 font-bold">
                    <Flame className="w-2.5 h-2.5 fill-orange-400" /> Best Seller
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Department / Category",
      accessor: (prod) => {
        const deptName =
          typeof prod.department === "object"
            ? prod.department?.name
            : prod.department || "General";
        const catName =
          typeof prod.category === "object"
            ? prod.category?.name
            : prod.category || "Unassigned";

        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-200">
              <Building2 className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="font-medium truncate max-w-[140px]">{deptName}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Layers className="w-3 h-3 text-sky-400 shrink-0" />
              <span className="truncate max-w-[140px]">{catName}</span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Features & Tags",
      accessor: (prod) => {
        const featCount = prod.features?.length || 0;
        const tags = prod.tags || [];

        return (
          <div className="space-y-1.5 max-w-[200px]">
            {/* Features summary */}
            <div className="flex items-center gap-1.5 text-xs text-slate-200">
              <ListCheck className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="font-semibold text-slate-200 text-xs">
                {featCount} {featCount === 1 ? "Feature" : "Features"}
              </span>
            </div>
            {/* Tags preview */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 3).map((t, idx) => (
                  <span
                    key={idx}
                    className="badge badge-xs bg-amber-400/10 text-amber-400 border border-amber-400/25 text-[9px] font-bold px-1.5 py-0.5"
                  >
                    #{t}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="text-[9px] text-slate-400 font-bold self-center">
                    +{tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: "SKU & Variants",
      accessor: (prod) => {
        const count = prod.variants?.length || 0;
        const firstVariant = prod.variants?.[0];

        return (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span
                className={`badge badge-sm font-bold gap-1 ${count > 0
                  ? "bg-amber-400/10 text-amber-400 border border-amber-400/30"
                  : "bg-white/5 text-slate-400 border border-white/10"
                  }`}
              >
                <Boxes className="w-3 h-3" />
                {count} {count === 1 ? "variant" : "variants"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedProductVariant(prod);
                  setIsVariantModalOpen(true);
                }}
                className="btn btn-ghost btn-xs text-[10px] text-amber-400 hover:bg-amber-400/10 font-bold px-1.5 rounded-lg cursor-pointer"
                title="Add SKU Variant"
              >
                + Add
              </button>
            </div>

            {/* TVariants fields preview: SKU, ASIN, Private Label, Attributes */}
            {firstVariant && (
              <div className="space-y-0.5 text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-slate-300 font-semibold text-[10px]">
                    SKU: {firstVariant.sku || "N/A"}
                  </span>
                  {firstVariant.isPrivateLevel && (
                    <span className="badge badge-xs bg-purple-500/15 border border-purple-500/30 text-purple-400 font-bold text-[9px] px-1">
                      Private Label
                    </span>
                  )}
                </div>
                {firstVariant.asin && (
                  <div className="font-mono text-slate-400 text-[9px]">
                    ASIN: {firstVariant.asin}
                  </div>
                )}
                {firstVariant.attributes && firstVariant.attributes.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {firstVariant.attributes.slice(0, 2).map((a, aIdx) => (
                      <span
                        key={aIdx}
                        className="text-[9px] px-1 py-0.2 rounded bg-white/5 border border-white/10 text-slate-300"
                      >
                        {a.type}: {a.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: "Author",
      accessor: (prod) => {
        const authorName = prod.author?.name || "Super Admin";
        const authorRole = prod.author?.role || "SUPER_ADMIN";
        const isSuper = String(authorRole).toUpperCase().includes("SUPER");

        return (
          <div className="space-y-0.5">
            <div className="font-bold text-xs text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate max-w-[120px]">{authorName}</span>
            </div>
            <div className="text-[10px]">
              <span
                className={`badge badge-xs font-semibold px-1.5 py-0.5 ${isSuper
                  ? "bg-amber-400/10 text-amber-400 border border-amber-400/30"
                  : "bg-indigo-400/10 text-indigo-300 border border-indigo-400/30"
                  }`}
              >
                {String(authorRole).replace(/_/g, " ")}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Status",
      accessor: (prod) =>
        prod.isDeleted ? (
          <span className="badge badge-error badge-outline bg-error/10 border-error/30 text-error badge-sm font-bold">
            Archived
          </span>
        ) : (
          <span className="badge badge-success badge-outline bg-success/10 border-success/30 text-success badge-sm font-bold gap-1">
            <CheckCircle2 className="w-3 h-3" /> Active
          </span>
        ),
    },
    {
      header: "Actions",
      align: "right",
      accessor: (prod) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => {
              setSelectedProductDetails(prod);
              setIsDetailsModalOpen(true);
            }}
            className="btn btn-ghost btn-xs text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 rounded-lg cursor-pointer transition-all"
            title="View Details"
          >
            <Eye className="w-3 h-3 text-sky-400" />
            <span className="hidden sm:inline">Details</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedProductEdit(prod);
              setIsEditModalOpen(true);
            }}
            className="btn btn-ghost btn-xs font-bold text-amber-400 gap-1 hover:bg-amber-400/10 border border-amber-400/20 hover:border-amber-400/40 rounded-lg cursor-pointer transition-all"
            title="Edit Product"
          >
            <Edit2 className="w-3 h-3" />
            <span className="hidden sm:inline">Edit</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedProductVariant(prod);
              setIsVariantModalOpen(true);
            }}
            className="btn btn-ghost btn-xs text-emerald-400 hover:bg-emerald-400/10 border border-emerald-400/20 hover:border-emerald-400/40 rounded-lg cursor-pointer transition-all"
            title="Add Variant"
          >
            <PlusCircle className="w-3 h-3" />
            <span className="hidden sm:inline">Variant</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <ProductsFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
      />

      {/* Main Products Directory Table */}
      <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl [&_.input]:bg-[#120824] [&_.input]:border-white/15 [&_.input]:text-slate-200 [&_.input]:placeholder:text-slate-500 [&_.input:focus]:border-amber-400 [&_thead_th]:text-slate-300 [&_thead_th]:bg-white/[0.03] [&_thead_th]:border-b [&_thead_th]:border-white/10 [&_tbody_tr]:border-b [&_tbody_tr]:border-white/5 [&_tbody_tr:hover]:bg-white/[0.05] [&_tbody_tr]:text-slate-200 [&_.border-base-200]:!border-white/10 [&_.border-base-300]:!border-white/10 [&_.card-title]:!text-white [&_p]:!text-slate-300 [&_.select]:bg-[#120824] [&_.select]:border-white/15 [&_.select]:text-slate-200 [&_.select]:focus:border-amber-400 [&_.join-item.btn-outline]:bg-white/5 [&_.join-item.btn-outline]:border-white/15 [&_.join-item.btn-outline]:text-slate-200 [&_.join-item.btn-outline:hover]:bg-white/10 [&_.join-item.btn-primary]:bg-amber-400 [&_.join-item.btn-primary]:text-slate-950 [&_.join-item.btn-primary]:border-amber-400 [&_strong]:text-amber-400 [&_.btn-square.btn-ghost]:border-white/15 [&_.btn-square.btn-ghost]:bg-white/5 [&_.btn-square.btn-ghost]:text-amber-400 [&_.badge-primary]:bg-amber-400 [&_.badge-primary]:text-slate-950 [&_.badge-primary]:border-none">
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />

        {/* Ambient background glow orbs */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-amber-500/15 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 right-1/4 w-56 h-56 bg-gradient-to-tl from-indigo-600/20 via-purple-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* High-tech dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10">
          <AZTable
            title="Product Master Catalog"
            subtitle="Central directory of all master listings and SKU configurations."
            badgeText={meta?.total || products.length}
            icon={<ShoppingBag className="w-5 h-5 text-amber-400" />}
            className="!bg-transparent !shadow-none !border-none text-slate-100"
            data={products}
            columns={columns}
            keyExtractor={(prod) => prod._id}
            isLoading={isLoading}
            isError={isError}
            errorMessage={(error as any)?.data?.message}
            onRetry={refetch}
            onRefresh={refetch}
            isRefreshing={isFetching}
            searchValue={searchTerm}
            onSearchChange={(val) => {
              setSearchTerm(val);
              setPage(1);
            }}
            searchPlaceholder="Search by title, brand, tags..."
            headerActions={
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="btn btn-sm gap-2 font-black shadow-lg shadow-amber-500/20 cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border-0 transition-all rounded-xl"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            }
            emptyTitle="No Products Found"
            emptyMessage="There are currently no products matching your active search or filters."
            emptyIcon={<ShoppingBag className="w-6 h-6 text-amber-400" />}
            pagination={{
              page: page,
              limit: limit,
              total: meta?.total || products.length,
              onPageChange: (p) => setPage(p),
              onLimitChange: (l) => {
                setLimit(l);
                setPage(1);
              },
            }}
          />
        </div>
      </div>

      {/* REUSABLE CREATE PRODUCT MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        size="lg"
        className="!bg-[#170d2f] !border-white/10 text-slate-100 shadow-2xl relative overflow-hidden rounded-3xl"
      >
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />
        <CreateProduct
          onSuccess={() => {
            setIsCreateModalOpen(false);
            refetch();
          }}
        />
      </Modal>

      {/* REUSABLE UPDATE PRODUCT MODAL */}
      <UpdateProductModal
        product={selectedProductEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProductEdit(null);
        }}
        onSuccess={() => {
          setIsEditModalOpen(false);
          setSelectedProductEdit(null);
          refetch();
        }}
      />

      {/* REUSABLE PRODUCT DETAILS MODAL */}
      <ProductDetailsModal
        product={selectedProductDetails}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedProductDetails(null);
        }}
      />

      {/* REUSABLE CREATE VARIANT MODAL */}
      <CreateVariantModal
        product={selectedProductVariant}
        isOpen={isVariantModalOpen}
        onClose={() => {
          setIsVariantModalOpen(false);
          setSelectedProductVariant(null);
        }}
        onSuccess={() => {
          setIsVariantModalOpen(false);
          setSelectedProductVariant(null);
          refetch();
        }}
      />
    </div>
  );
};

export default ProductsData;
export { ProductsData as ProductData };
