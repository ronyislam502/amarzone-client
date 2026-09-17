"use client";

import { Boxes, CheckCircle2, AlertTriangle, Trophy, TrendingUp } from "lucide-react";

export interface InventoryStatsProps {
  totalItems?: number;
  inStockCount?: number;
  lowStockCount?: number;
  buyBoxWinnersCount?: number;
}

const InventoryStats = ({
  totalItems = 0,
  inStockCount = 0,
  lowStockCount = 0,
  buyBoxWinnersCount = 0,
}: InventoryStatsProps) => {
  const stockHealthPercent =
    totalItems > 0 ? Math.round((inStockCount / totalItems) * 100) : 0;
  const buyBoxRate =
    totalItems > 0 ? Math.round((buyBoxWinnersCount / totalItems) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Stat 1: Total Listed SKUs */}
      <div className="bg-base-100 p-5 rounded-2xl border border-base-200 shadow-sm flex items-center justify-between hover:border-accent/30 transition-all duration-200">
        <div>
          <div className="text-xs font-bold text-base-content/60 uppercase tracking-wider mb-1">
            Total Listed SKUs
          </div>
          <div className="text-2xl sm:text-3xl font-black text-base-content">
            {totalItems}
          </div>
          <div className="text-xs font-medium text-accent flex items-center gap-1 mt-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            Active vendor catalog
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
          <Boxes className="w-6 h-6" />
        </div>
      </div>

      {/* Stat 2: In-Stock Inventory */}
      <div className="bg-base-100 p-5 rounded-2xl border border-base-200 shadow-sm flex items-center justify-between hover:border-success/30 transition-all duration-200">
        <div>
          <div className="text-xs font-bold text-base-content/60 uppercase tracking-wider mb-1">
            In-Stock Items
          </div>
          <div className="text-2xl sm:text-3xl font-black text-success">
            {inStockCount}
          </div>
          <div className="text-xs font-medium text-success flex items-center gap-1 mt-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {stockHealthPercent}% fulfillment readiness
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center text-success shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>

      {/* Stat 3: Low & Out of Stock */}
      <div className="bg-base-100 p-5 rounded-2xl border border-base-200 shadow-sm flex items-center justify-between hover:border-warning/30 transition-all duration-200">
        <div>
          <div className="text-xs font-bold text-base-content/60 uppercase tracking-wider mb-1">
            Low / Out of Stock
          </div>
          <div className="text-2xl sm:text-3xl font-black text-warning">
            {lowStockCount}
          </div>
          <div className="text-xs font-medium text-warning flex items-center gap-1 mt-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            {lowStockCount > 0 ? "Requires restock action" : "All stocks healthy"}
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center text-warning shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
      </div>

      {/* Stat 4: Buy Box Winners */}
      <div className="bg-base-100 p-5 rounded-2xl border border-base-200 shadow-sm flex items-center justify-between hover:border-primary/30 transition-all duration-200">
        <div>
          <div className="text-xs font-bold text-base-content/60 uppercase tracking-wider mb-1">
            Buy Box Winners
          </div>
          <div className="text-2xl sm:text-3xl font-black text-primary">
            {buyBoxWinnersCount}
          </div>
          <div className="text-xs font-medium text-primary flex items-center gap-1 mt-1.5">
            <Trophy className="w-3.5 h-3.5" />
            {buyBoxRate}% current win rate
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
          <Trophy className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default InventoryStats;
