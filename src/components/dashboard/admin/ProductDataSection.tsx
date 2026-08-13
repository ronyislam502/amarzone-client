"use client";

import React, { useState } from "react";
import { useAllProductsQuery } from "@/redux/features/product/productApi";
import DataTable, { Column } from "@/components/shared/DataTable";
import {
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Tag,
  DollarSign,
  Package,
  Layers,
  Sparkles
} from "lucide-react";

export const ProductDataSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAllProductsQuery({ search: searchTerm, page, limit });

  const products: any[] = responseData?.data || [];
  const meta = responseData?.meta;

  const columns: Column<any>[] = [
    {
      header: "Product Info",
      accessor: (prod) => (
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 h-10 rounded-xl bg-base-200 border border-base-300 flex items-center justify-center overflow-hidden">
              {prod.thumbnail ? (
                <img
                  src={prod.thumbnail}
                  alt={prod.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <ShoppingBag className="w-5 h-5 text-base-content/40" />
              )}
            </div>
          </div>
          <div>
            <div className="font-extrabold text-xs text-base-content max-w-[200px] truncate">
              {prod.name}
            </div>
            <div className="text-[10px] text-base-content/60 flex items-center gap-1">
              <Tag className="w-3 h-3 text-primary shrink-0" />
              <span>{prod.brand || "Generic Brand"}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: (prod) => {
        const catName =
          typeof prod.category === "object"
            ? prod.category?.name
            : prod.category || "General";
        return (
          <span className="badge badge-neutral badge-sm font-bold gap-1">
            <Layers className="w-3 h-3 text-info" />
            {catName}
          </span>
        );
      },
    },
    {
      header: "Price",
      accessor: (prod) => (
        <div className="font-mono font-bold text-xs text-success flex items-center gap-0.5">
          <DollarSign className="w-3.5 h-3.5 text-success/80" />
          <span>{prod.price !== undefined ? Number(prod.price).toFixed(2) : "0.00"}</span>
        </div>
      ),
    },
    {
      header: "Stock",
      accessor: (prod) => {
        const stock = prod.stock ?? prod.inventory ?? 0;
        return (
          <div className="flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-base-content/40" />
            <span
              className={`font-mono font-bold text-xs ${
                stock === 0
                  ? "text-error"
                  : stock < 10
                  ? "text-warning"
                  : "text-base-content/80"
              }`}
            >
              {stock} units
            </span>
          </div>
        );
      },
    },
    {
      header: "Status",
      accessor: (prod) => {
        const isDeleted = prod.isDeleted;
        const stock = prod.stock ?? prod.inventory ?? 0;

        if (isDeleted) {
          return <span className="badge badge-error badge-sm font-bold">Deleted</span>;
        }
        if (stock === 0) {
          return <span className="badge badge-warning badge-sm font-bold">Out of Stock</span>;
        }
        return (
          <span className="badge badge-success badge-sm font-bold gap-1">
            <CheckCircle2 className="w-3 h-3" /> Active
          </span>
        );
      },
    },
    {
      header: "Actions",
      align: "right",
      accessor: () => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            className="btn btn-ghost btn-xs font-bold text-primary gap-1"
          >
            <span>View</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      title="Product Catalog Data"
      subtitle="Comprehensive list of merchandise listings, stock availability, and prices."
      badgeText={meta?.total || products.length}
      icon={<ShoppingBag className="w-5 h-5 text-primary" />}
      data={products}
      columns={columns}
      keyExtractor={(prod) => prod._id || prod.id}
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
      searchPlaceholder="Search products..."
      emptyTitle="No Products Found"
      emptyMessage="There are currently no product items matching your query."
      emptyIcon={<ShoppingBag className="w-6 h-6" />}
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
  );
};

export default ProductDataSection;
