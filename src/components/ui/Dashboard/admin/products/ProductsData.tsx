"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ShoppingBag,
  Eye,
  Edit2,
  Flame,
  Star,
  PlusCircle,
  Download,
  Building2,
  Layers,
  Boxes,
  Plus,
} from "lucide-react";
import { useAllProductsQuery } from "@/redux/features/product/productApi";
import { TProduct } from "@/src/types/product";
import { TColumn } from "@/src/types/table";
import AZTable from "../../../shared/AZTable";
import ProductsFilterBar, { ProductsFilterState } from "./ProductsFilterBar";
import ProductDetailsModal from "./ProductDetailsModal";
import UpdateProductModal from "./UpdateProductModal";
import CreateProductModal from "./CreateProductModal";
import CreateVariantModal from "./CreateVariantModal";

export interface ProductsStatsData {
  totalProducts: number;
  totalVariants: number;
  bestSellerCount: number;
  avgRating: number;
}

interface ProductsDataProps {
  onStatsChange?: (stats: ProductsStatsData) => void;
  isCreateOpen?: boolean;
  setIsCreateOpen?: (isOpen: boolean) => void;
  registerExportHandler?: (handler: () => void) => void;
}

const initialFilters: ProductsFilterState = {
  department: "",
  category: "",
  sort: "",
};

const ProductsData = ({
  onStatsChange,
  isCreateOpen: externalIsCreateOpen,
  setIsCreateOpen: externalSetIsCreateOpen,
  registerExportHandler,
}: ProductsDataProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ProductsFilterState>(initialFilters);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modal states
  const [internalIsCreateOpen, setInternalIsCreateOpen] = useState(false);
  const isCreateOpen = externalIsCreateOpen ?? internalIsCreateOpen;
  const setIsCreateOpen = externalSetIsCreateOpen ?? setInternalIsCreateOpen;

  const [selectedViewProduct, setSelectedViewProduct] = useState<TProduct | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedEditProduct, setSelectedEditProduct] = useState<TProduct | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedVariantProduct, setSelectedVariantProduct] = useState<TProduct | null>(null);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

  // Query products with active parameters (no inventory parameter)
  const queryArgs = useMemo(() => {
    return {
      search: searchTerm.trim() || undefined,
      page: String(page),
      limit: String(limit),
      department: filters.department || undefined,
      category: filters.category || undefined,
      sort: filters.sort || undefined,
    };
  }, [searchTerm, page, limit, filters]);

  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAllProductsQuery(queryArgs);

  const products: TProduct[] = responseData?.data || [];
  const meta = responseData?.meta;

  // Compute summary stats (Products, Variants, Best Sellers, Avg Rating - NO inventory stats)
  useEffect(() => {
    if (products && onStatsChange) {
      const variantsTotal = products.reduce(
        (acc, p) => acc + (p.variants?.length || 0),
        0
      );
      const bestSellersTotal = products.filter((p) => p.isBestSeller).length;
      const ratingSum = products.reduce((acc, p) => acc + (p.averageRating || 5), 0);
      const avg = products.length > 0 ? ratingSum / products.length : 4.8;

      onStatsChange({
        totalProducts: meta?.total ?? products.length,
        totalVariants: variantsTotal,
        bestSellerCount: bestSellersTotal,
        avgRating: avg,
      });
    }
  }, [products, meta?.total, onStatsChange]);

  // CSV Export logic without inventory information
  const handleExportCsv = () => {
    if (!products || products.length === 0) return;

    const headers = [
      "Product ID",
      "Title",
      "Brand",
      "Department",
      "Category",
      "Base Price ($)",
      "Best Seller",
      "Avg Rating",
      "Review Count",
      "Variants Count",
    ];

    const rows = products.map((p) => [
      `"${p._id}"`,
      `"${(p.title || "").replace(/"/g, '""')}"`,
      `"${(p.brand || "").replace(/"/g, '""')}"`,
      `"${p.department?.name || "General"}"`,
      `"${p.category?.name || "Uncategorized"}"`,
      p.minPrice ?? 0,
      p.isBestSeller ? "YES" : "NO",
      p.averageRating ?? 0,
      p.reviewCount ?? 0,
      p.variants?.length ?? 0,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `admin_products_catalog_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Register export handler with parent
  useEffect(() => {
    if (registerExportHandler) {
      registerExportHandler(handleExportCsv);
    }
  }, [registerExportHandler, products]);

  const handleFilterChange = (newFilters: Partial<ProductsFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setSearchTerm("");
    setPage(1);
  };

  // Columns definition: Products & Variants ONLY, NO INVENTORY
  const columns: TColumn<TProduct>[] = [
    {
      header: "Product Item",
      accessor: (prod) => {
        const thumb =
          prod.variants?.[0]?.thumbnail ||
          (prod as any).thumbnail ||
          "";

        return (
          <div className="flex items-center gap-3 max-w-sm">
            <div className="w-12 h-12 rounded-xl bg-base-200 border border-base-300 flex items-center justify-center shrink-0 overflow-hidden relative">
              {thumb ? (
                <img
                  src={thumb}
                  alt={prod.title}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <ShoppingBag className="w-5 h-5 text-base-content/40" />
              )}
            </div>
            <div className="min-w-0 space-y-0.5">
              <div
                className="font-extrabold text-xs text-base-content line-clamp-1 hover:text-primary transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedViewProduct(prod);
                  setIsViewModalOpen(true);
                }}
              >
                {prod.title}
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="badge badge-ghost badge-xs font-bold text-primary px-1.5 py-0.5">
                  {prod.brand || "Generic"}
                </span>
                {prod.isBestSeller && (
                  <span className="badge badge-warning badge-xs font-extrabold gap-0.5 px-1.5 py-0.5">
                    <Flame className="w-2.5 h-2.5 fill-warning text-warning" />
                    Best Seller
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Taxonomy",
      accessor: (prod) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-[11px] font-bold text-base-content/80">
            <Building2 className="w-3 h-3 text-warning shrink-0" />
            <span className="truncate max-w-[130px]">
              {prod.department?.name || "General"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-base-content/60">
            <Layers className="w-2.5 h-2.5 text-info shrink-0" />
            <span className="truncate max-w-[130px]">
              {prod.category?.name || "Uncategorized"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Product Variants",
      accessor: (prod) => {
        const variants = prod.variants || [];
        const variantCount = variants.length;

        return (
          <div className="space-y-1 max-w-[200px]">
            <div className="flex items-center gap-1.5">
              <span className="badge badge-secondary badge-sm font-bold gap-1">
                <Boxes className="w-3 h-3" />
                {variantCount} {variantCount === 1 ? "Variant" : "Variants"}
              </span>
            </div>

            {/* Display attributes for available variants */}
            {variantCount > 0 ? (
              <div className="flex flex-wrap gap-1">
                {variants.slice(0, 3).map((v, idx) => (
                  <span
                    key={v._id || idx}
                    className="badge badge-neutral badge-xs font-medium text-[10px]"
                  >
                    {v.attributes?.map((a) => `${a.type}: ${a.value}`).join(", ") ||
                      `SKU: ${v.sku || "N/A"}`}
                  </span>
                ))}
                {variantCount > 3 && (
                  <span className="text-[10px] text-base-content/60 font-bold">
                    +{variantCount - 3} more
                  </span>
                )}
              </div>
            ) : (
              <span className="text-[10px] text-base-content/50 italic">
                No variants added
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: "Rating",
      accessor: (prod) => (
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 text-warning font-black text-xs">
            <Star className="w-3.5 h-3.5 fill-warning" />
            <span>{(prod.averageRating || 5).toFixed(1)}</span>
          </div>
          <span className="text-[10px] text-base-content/50">
            ({prod.reviewCount || 0})
          </span>
        </div>
      ),
    },
    {
      header: "Actions",
      align: "right",
      accessor: (prod) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            title="View Details & Variants"
            onClick={() => {
              setSelectedViewProduct(prod);
              setIsViewModalOpen(true);
            }}
            className="btn btn-ghost btn-xs font-bold text-info gap-1 hover:bg-info/10 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </button>

          <button
            type="button"
            title="Add Product Variant"
            onClick={() => {
              setSelectedVariantProduct(prod);
              setIsVariantModalOpen(true);
            }}
            className="btn btn-ghost btn-xs font-bold text-secondary gap-1 hover:bg-secondary/10 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Variant</span>
          </button>

          <button
            type="button"
            title="Edit Product"
            onClick={() => {
              setSelectedEditProduct(prod);
              setIsEditModalOpen(true);
            }}
            className="btn btn-ghost btn-xs font-bold text-primary gap-1 hover:bg-primary/10 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Search & Dynamic Filter Toolbar */}
      <ProductsFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Main Products AZTable */}
      <AZTable
        title="Master Product Catalog"
        subtitle="Catalog specifications and variant attributes. Inventory allocation is managed separately."
        badgeText={meta?.total ?? products.length}
        icon={<ShoppingBag className="w-5 h-5 text-primary" />}
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
        searchPlaceholder="Search master products by title, brand, tag..."
        headerActions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={products.length === 0}
              className="btn btn-outline btn-sm gap-1.5 font-bold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="btn btn-primary btn-sm gap-1.5 font-bold shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        }
        emptyTitle="No Products Found"
        emptyMessage="No products match your active search and filter criteria."
        emptyIcon={<ShoppingBag className="w-6 h-6" />}
        emptyAction={
          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn btn-xs btn-outline font-bold"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="btn btn-xs btn-primary font-bold gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add First Product
            </button>
          </div>
        }
        pagination={{
          page,
          limit,
          total: meta?.total ?? products.length,
          onPageChange: (p) => setPage(p),
          onLimitChange: (l) => {
            setLimit(l);
            setPage(1);
          },
        }}
      />

      {/* Product Details Modal (without inventory) */}
      <ProductDetailsModal
        product={selectedViewProduct}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedViewProduct(null);
        }}
      />

      {/* Update Product Modal */}
      <UpdateProductModal
        product={selectedEditProduct}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEditProduct(null);
        }}
        onSuccess={() => {
          refetch();
        }}
      />

      {/* Create Product Modal (matches departmentcreate onSubmit pattern) */}
      <CreateProductModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => {
          refetch();
        }}
      />

      {/* Create Variant Modal */}
      <CreateVariantModal
        product={selectedVariantProduct}
        isOpen={isVariantModalOpen}
        onClose={() => {
          setIsVariantModalOpen(false);
          setSelectedVariantProduct(null);
        }}
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
};

export default ProductsData;
