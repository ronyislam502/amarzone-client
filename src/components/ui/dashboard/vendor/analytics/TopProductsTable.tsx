"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Package,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import AZTable from "@/components/shared/AZTable";
import { TColumn } from "@/types/table";

export interface TTopSellingProductItem {
  id: string;
  title: string;
  thumbnail: string;
  asin?: string;
  sku?: string;
  unitsSold: number;
  totalRevenue: number;
  avgPrice: number;
}

export interface TopProductsTableProps {
  products?: TTopSellingProductItem[];
  isLoading?: boolean;
}

const TopProductsTable: React.FC<TopProductsTableProps> = ({
  products = [],
  isLoading = false,
}) => {
  const [searchValue, setSearchValue] = useState("");

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <span className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center text-xs font-black">
          🥇
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="w-6 h-6 rounded-full bg-slate-300/20 border border-slate-300/40 text-slate-200 flex items-center justify-center text-xs font-black">
          🥈
        </span>
      );
    }
    if (index === 2) {
      return (
        <span className="w-6 h-6 rounded-full bg-orange-400/20 border border-orange-400/40 text-orange-300 flex items-center justify-center text-xs font-black">
          🥉
        </span>
      );
    }
    return (
      <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center text-xs font-bold font-mono">
        {index + 1}
      </span>
    );
  };

  const filteredProducts = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    if (!searchValue.trim()) return list;
    const term = searchValue.toLowerCase();
    return list.filter((p) => {
      const title = (p.title || "").toLowerCase();
      const asin = (p.asin || "").toLowerCase();
      const sku = (p.sku || "").toLowerCase();
      return title.includes(term) || asin.includes(term) || sku.includes(term);
    });
  }, [products, searchValue]);

  const columns: TColumn<TTopSellingProductItem>[] = useMemo(
    () => [
      {
        header: "Rank",
        align: "center",
        className: "w-16",
        accessor: (_p, idx) => getRankBadge(idx),
      },
      {
        header: "Product Details",
        accessor: (p) => (
          <div className="flex items-center gap-3 py-1">
            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 overflow-hidden relative shrink-0 flex items-center justify-center">
              {p.thumbnail ? (
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="w-5 h-5 text-slate-500" />
              )}
            </div>
            <div className="max-w-md min-w-0">
              <p className="font-bold text-white text-xs line-clamp-1">
                {p.title}
              </p>
              <span className="text-[10px] text-slate-400">
                Fulfillment: Merchant
              </span>
            </div>
          </div>
        ),
      },
      {
        header: "ASIN / SKU",
        accessor: (p) => (
          <div className="space-y-0.5 text-xs font-mono">
            <div className="text-amber-300/90 font-semibold text-[11px]">
              {p.asin || "N/A"}
            </div>
            <div className="text-slate-400 text-[10px]">
              {p.sku || "N/A"}
            </div>
          </div>
        ),
      },
      {
        header: "Units Sold",
        align: "right",
        accessor: (p) => (
          <span className="font-black text-white text-sm font-mono">
            {Number(p.unitsSold || 0).toLocaleString()}
          </span>
        ),
      },
      {
        header: "Avg Price",
        align: "right",
        accessor: (p) => (
          <span className="text-slate-300 font-semibold text-xs font-mono">
            {formatCurrency(p.avgPrice || 0)}
          </span>
        ),
      },
      {
        header: "Total Revenue",
        align: "right",
        accessor: (p) => (
          <span className="font-black text-emerald-400 text-sm font-mono">
            {formatCurrency(p.totalRevenue || 0)}
          </span>
        ),
      },
      {
        header: "Action",
        align: "right",
        accessor: () => (
          <Link
            href="/vendor/inventory"
            className="btn btn-xs gap-1 font-bold text-amber-400 hover:text-slate-950 bg-amber-400/10 hover:bg-amber-400 border border-amber-400/20 rounded-lg transition-all"
          >
            <span>Stock</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        ),
      },
    ],
    []
  );

  return (
    <div className="w-full">
      <AZTable<TTopSellingProductItem>
        title="Top-Selling Products & Revenue Leaders"
        subtitle="Catalog listings driving top conversion volume and sales revenue."
        badgeText={products.length > 0 ? `${products.length} Products` : undefined}
        icon={<Trophy className="w-5 h-5 text-amber-400" />}
        data={filteredProducts}
        columns={columns}
        keyExtractor={(p, idx) => p.id || String(idx)}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search products by title, ASIN, SKU..."
        headerActions={
          <Link
            href="/vendor/inventory"
            className="btn btn-xs sm:btn-sm gap-1 text-amber-400 hover:bg-amber-400 hover:text-slate-950 font-bold border border-amber-400/30 rounded-xl transition-all"
          >
            <span>Manage Inventory</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        }
        emptyTitle="No Product Sales Recorded"
        emptyMessage="No product sales recorded for this date range. As orders come in, top revenue leaders will appear here."
        emptyIcon={<Package className="w-6 h-6 text-amber-400" />}
        emptyAction={
          <Link
            href="/vendor/inventory"
            className="btn btn-xs btn-outline border-amber-400/40 text-amber-300 hover:bg-amber-400 hover:text-slate-950 rounded-lg font-bold"
          >
            Manage Product Catalog
          </Link>
        }
        isLoading={isLoading}
        className="my-0"
      />
    </div>
  );
};

export default TopProductsTable;
