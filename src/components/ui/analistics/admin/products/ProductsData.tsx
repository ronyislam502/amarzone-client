"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
import { useDebounce } from "@/src/components/utilities/Debaounce";

export interface ProductsStatsData {
  totalProducts: number;
  totalVariants: number;
  bestSellerCount: number;
  avgRating: number;
}

export interface ProductsDataProps {
  onStatsChange?: (stats: ProductsStatsData) => void;
  registerExportHandler?: (handler: () => void) => void;
  registerCreateHandler?: (handler: (initialData?: any) => void) => void;
}

const LIMIT = 10;

const ProductsData: React.FC<ProductsDataProps> = ({
  registerExportHandler,
  registerCreateHandler,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL-driven query state
  const page = Number(searchParams.get("page")) || 1;
  const departmentParam = searchParams.get("department") || "";
  const categoryParam = searchParams.get("category") || "";
  const sortParam = searchParams.get("sort") || "";
  const urlSearch = searchParams.get("search") || "";

  // Local search before debounce
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const updateUrl = useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  useEffect(() => {
    if (debouncedSearch.trim() !== urlSearch) {
      updateUrl({ search: debouncedSearch.trim() || null, page: 1 });
    }
  }, [debouncedSearch, urlSearch, updateUrl]);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createInitialData, setCreateInitialData] = useState<any>(null);
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
    search: urlSearch || undefined,
    page: String(page),
    limit: String(LIMIT),
    department: departmentParam || undefined,
    category: categoryParam || undefined,
    sort: sortParam || undefined,
  });

  const products: TProduct[] = responseData?.data || [];
  const meta = responseData?.meta;

  // Register parent actions
  useEffect(() => {
    if (registerCreateHandler) {
      registerCreateHandler((initData?: any) => {
        if (initData) setCreateInitialData(initData);
        setIsCreateModalOpen(true);
      });
    }
  }, [registerCreateHandler]);

  // Export CSV handler
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
      p.isDeleted ? "Inactive" : "Active",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

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

  const handleFilterChange = (newFilters: Partial<ProductsFilterState>) => {
    updateUrl({
      ...newFilters,
      page: 1,
    });
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    router.push(pathname);
  };

  // Reusable Column Definitions
  const columns: TColumn<TProduct>[] = [
    {
      header: "Product Title & Brand",
      accessor: (p) => {
        const firstVariant = p.variants?.[0];
        const displayImage = firstVariant?.images?.[0] || "";

        return (
          <div className="flex items-center gap-3 max-w-sm">
            <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-white/15 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-5 h-5 text-slate-500" />
              )}
              {p.isBestSeller && (
                <div className="absolute top-1 right-1 bg-amber-400 text-slate-950 p-0.5 rounded-full shadow-sm">
                  <Flame className="w-2.5 h-2.5 fill-current" />
                </div>
              )}
            </div>
            <div className="space-y-0.5">
              <div className="font-extrabold text-xs text-white line-clamp-1">
                {p.title}
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                <span className="text-amber-400 font-bold uppercase tracking-wider">
                  {p.brand}
                </span>
                <span>•</span>
                <span className="text-slate-300">
                  {p.variants?.length || 0} variants
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Taxonomy",
      accessor: (p) => {
        const deptName =
          typeof p.department === "object"
            ? p.department?.name
            : p.department || "General";
        const catName =
          typeof p.category === "object"
            ? p.category?.name
            : p.category || "Unassigned";

        return (
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
              <span>{deptName}</span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-slate-500 shrink-0" />
              <span>{catName}</span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Features & Attributes",
      accessor: (p) => {
        const count = p.features?.length || 0;
        return (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <ListCheck className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
              <span>{count} Specifications</span>
            </div>
            {p.tags && p.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 max-w-xs">
                {p.tags.slice(0, 2).map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 font-medium"
                  >
                    #{t}
                  </span>
                ))}
                {p.tags.length > 2 && (
                  <span className="text-[9px] text-slate-500 font-bold self-center">
                    +{p.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: "Created By",
      accessor: (p) => (
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-slate-200">
            {p.author?.name || "System Administrator"}
          </div>
          <div className="text-[10px] text-amber-400/90 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 shrink-0" />
            <span>{p.author?.role || "SUPER_ADMIN"}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (p) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-sm ${
            !p.isDeleted
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
          }`}
        >
          <CheckCircle2 className="w-3 h-3" />
          {!p.isDeleted ? "Active" : "Archived"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (p) => (
        <div className="flex items-center gap-2">
          {/* Quick Details View */}
          <button
            type="button"
            onClick={() => {
              setSelectedProductDetails(p);
              setIsDetailsModalOpen(true);
            }}
            title="View Product Details"
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-slate-300 hover:text-amber-400 transition-all duration-200 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Quick Edit Base Details */}
          <button
            type="button"
            onClick={() => {
              setSelectedProductEdit(p);
              setIsEditModalOpen(true);
            }}
            title="Edit Base Metadata"
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-slate-300 hover:text-amber-400 transition-all duration-200 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {/* Add Variant to Product */}
          <button
            type="button"
            onClick={() => {
              setSelectedProductVariant(p);
              setIsVariantModalOpen(true);
            }}
            title="Add Variant"
            className="p-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20 hover:border-amber-400/40 hover:bg-amber-400/20 text-amber-400 transition-all duration-200 cursor-pointer"
          >
            <Boxes className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const currentFilters: ProductsFilterState = {
    department: departmentParam,
    category: categoryParam,
    sort: sortParam,
  };

  return (
    <div className="space-y-4">
      {/* FILTER & SEARCH TOOLBAR */}
      <ProductsFilterBar
        filters={currentFilters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        searchTerm={searchTerm}
        onSearchChange={(val) => setSearchTerm(val)}
      />

      {/* MAIN DATA TABLE CARD */}
      <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-4 sm:p-6">
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
            subtitle="Global parent product profiles, brand taxonomy, and SKU variations."
            badgeText={meta?.total ?? products.length}
            icon={<ShoppingBag className="w-5 h-5 text-amber-400" />}
            className="!bg-transparent !shadow-none !border-none text-slate-100"
            data={products}
            columns={columns}
            keyExtractor={(p) => p._id}
            isLoading={isLoading}
            isError={isError}
            errorMessage={(error as any)?.data?.message}
            onRetry={refetch}
            onRefresh={refetch}
            isRefreshing={isFetching}
            searchValue={searchTerm}
            onSearchChange={(val) => setSearchTerm(val)}
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
              limit: LIMIT,
              total: meta?.total || products.length,
              onPageChange: (p) => updateUrl({ page: p }),
            }}
          />
        </div>
      </div>

      {/* REUSABLE CREATE PRODUCT MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setCreateInitialData(null);
        }}
        size="lg"
        className="!bg-[#170d2f] !border-white/10 text-slate-100 shadow-2xl relative overflow-hidden rounded-3xl"
      >
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />
        <CreateProduct
          initialData={createInitialData}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            setCreateInitialData(null);
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
