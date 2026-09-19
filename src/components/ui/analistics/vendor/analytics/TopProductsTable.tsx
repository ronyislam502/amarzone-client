"use client";

import React from "react";
import Image from "next/image";
import {
  Trophy,
  Package,
  DollarSign,
  TrendingUp,
  Tag,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

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

interface TopProductsTableProps {
  products?: TTopSellingProductItem[];
}

export const TopProductsTable: React.FC<TopProductsTableProps> = ({
  products = [],
}) => {
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
      <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center text-xs font-bold">
        {index + 1}
      </span>
    );
  };

  return (
    <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-7">
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="space-y-0.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Product Performance
            </span>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Top-Selling Products & Revenue Leaders</span>
            </h3>
          </div>
          <Link
            href="/vendor/inventory"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Manage Inventory</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No product sales recorded for this date range.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm w-full text-slate-200">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-[11px] uppercase tracking-wider font-extrabold">
                  <th className="w-12 text-center">Rank</th>
                  <th>Product Details</th>
                  <th>ASIN / SKU</th>
                  <th className="text-right">Units Sold</th>
                  <th className="text-right">Avg Price</th>
                  <th className="text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((p, idx) => (
                  <tr key={p.id || idx} className="hover:bg-white/5 transition-colors">
                    <td className="text-center">{getRankBadge(idx)}</td>
                    <td>
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
                        <div className="max-w-md">
                          <p className="font-bold text-white text-xs line-clamp-1">
                            {p.title}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            Fulfillment: Merchant
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="space-y-0.5 text-xs font-mono">
                        <div className="text-amber-300/90 font-semibold text-[11px]">
                          {p.asin || "N/A"}
                        </div>
                        <div className="text-slate-400 text-[10px]">
                          {p.sku || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="text-right font-black text-white text-sm">
                      {p.unitsSold}
                    </td>
                    <td className="text-right text-slate-300 font-semibold text-xs">
                      ${p.avgPrice.toFixed(2)}
                    </td>
                    <td className="text-right font-black text-emerald-400 text-sm">
                      ${p.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopProductsTable;
