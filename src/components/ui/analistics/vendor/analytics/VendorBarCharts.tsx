"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Layers,
  FolderTree,
  DollarSign,
  Package,
} from "lucide-react";

export interface TGroupSalesPoint {
  id: string;
  name: string;
  revenue: number;
  ordersCount: number;
}

interface VendorBarChartsProps {
  departmentSales: TGroupSalesPoint[];
  categorySales: TGroupSalesPoint[];
}

export const VendorBarCharts: React.FC<VendorBarChartsProps> = ({
  departmentSales = [],
  categorySales = [],
}) => {
  const [activeTab, setActiveTab] = useState<"departments" | "categories">("departments");

  const currentList = activeTab === "departments" ? departmentSales : categorySales;

  const maxRevenue = Math.max(...currentList.map((item) => item.revenue), 1);

  return (
    <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-7">
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent pointer-events-none" />

      <div className="space-y-6">
        {/* Header & Tab Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="space-y-0.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Taxonomy Breakdown
            </span>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <span>{activeTab === "departments" ? "Sales by Marketplace Department" : "Sales by Product Category"}</span>
            </h3>
          </div>

          <div className="join bg-white/5 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("departments")}
              className={`join-item px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "departments"
                  ? "bg-purple-500 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Departments ({departmentSales.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("categories")}
              className={`join-item px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "categories"
                  ? "bg-purple-500 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Categories ({categorySales.length})</span>
            </button>
          </div>
        </div>

        {/* Bar Chart Visual List */}
        {currentList.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No sales recorded across {activeTab} for the selected period.
          </div>
        ) : (
          <div className="space-y-4">
            {currentList.map((item, idx) => {
              const pct = Math.round((item.revenue / maxRevenue) * 100);
              return (
                <div key={item.id || idx} className="space-y-1.5 group">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200 group-hover:text-purple-300 transition-colors flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-slate-400">
                        {idx + 1}
                      </span>
                      <span>{item.name}</span>
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 text-[11px] hidden sm:inline">
                        {item.ordersCount} {item.ordersCount === 1 ? "order" : "orders"}
                      </span>
                      <strong className="text-emerald-400 font-extrabold text-sm">
                        ${item.revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </strong>
                    </div>
                  </div>

                  {/* Colored Horizontal Progress Bar */}
                  <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden border border-white/5 flex">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-amber-400 rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(4, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorBarCharts;
