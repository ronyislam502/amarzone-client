"use client";

import { RefreshCw, Download, PlusCircle, Layers, Sparkles } from "lucide-react";
import Link from "next/link";

interface InventoryHeaderProps {
  onExportCsv?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const InventoryHeader = ({
  onExportCsv,
  onRefresh,
  isRefreshing = false,
}: InventoryHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-200 shadow-sm">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="badge badge-accent badge-soft font-bold text-xs gap-1 py-2 px-3">
            <Sparkles className="w-3 h-3" />
            Vendor Inventory Central
          </div>
          <div className="badge badge-outline text-xs font-semibold text-base-content/60">
            Live Marketplace Stock
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-base-content flex items-center gap-2.5">
          <Layers className="w-7 h-7 text-accent" />
          Inventory & Stock
        </h1>
        <p className="text-xs sm:text-sm text-base-content/70 max-w-2xl font-medium">
          Monitor your catalog offerings, adjust live pricing, replenish quantities, and optimize your Buy Box position.
        </p>
      </div>

      <div className="flex items-center flex-wrap gap-2.5">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="btn btn-sm btn-outline border-base-300 hover:border-accent hover:bg-accent/10 hover:text-accent gap-2 font-bold shadow-xs"
            title="Refresh Inventory"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-accent" : ""}`}
            />
            <span>{isRefreshing ? "Syncing..." : "Sync"}</span>
          </button>
        )}

        {onExportCsv && (
          <button
            onClick={onExportCsv}
            className="btn btn-sm btn-outline border-base-300 hover:border-info hover:bg-info/10 hover:text-info gap-2 font-bold shadow-xs"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        )}

        <Link
          href="/vendor/products/add"
          className="btn btn-sm btn-accent gap-2 font-bold shadow-md shadow-accent/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>List New Item</span>
        </Link>
      </div>
    </div>
  );
};

export default InventoryHeader;
