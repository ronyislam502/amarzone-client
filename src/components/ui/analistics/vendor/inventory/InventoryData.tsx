"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Layers,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
  Edit2,
  DollarSign,
  Package,
} from "lucide-react";
import { useGetMyInventoryQuery } from "@/src/redux/features/inventory/inventoryApi";
import { TInventory } from "@/src/types/inventory";
import { TColumn } from "@/src/types/table";
import AZTable from "../../../shared/AZTable";
import InventoryFilterBar, {
  InventoryFilterState,
} from "./InventoryFilterBar";
import UpdatePriceModal from "./UpdatePriceModal";
import UpdateStockModal from "./UpdateStockModal";
import InventoryDetailsModal from "./InventoryDetailsModal";
import { useDebounce } from "@/src/components/utilities/Debaounce";
import { toast } from "react-toastify";

export interface InventoryStatsData {
  totalItems: number;
  inStockCount: number;
  lowStockCount: number;
  buyBoxWinnersCount: number;
}

interface InventoryDataProps {
  onStatsChange?: (stats: InventoryStatsData) => void;
  registerExportHandler?: (handler: () => void) => void;
  isRefreshing?: boolean;
}

const LIMIT = 10;

const InventoryData = ({
  registerExportHandler,
  isRefreshing = false,
}: InventoryDataProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL-driven query state
  const page = Number(searchParams.get("page")) || 1;
  const sortParam = searchParams.get("sort") || "";
  const stockParam = searchParams.get("stockStatus") || "";
  const urlSearch = searchParams.get("search") || "";

  // Local search before debounce
  const [search, setSearch] = useState(urlSearch);
  const debouncedSearch = useDebounce(search, 400);
  const [copiedAsin, setCopiedAsin] = useState<string | null>(null);

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
  const [selectedInventory, setSelectedInventory] = useState<TInventory | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);

  const apiSort =
    sortParam === "price_asc"
      ? "seller.price"
      : sortParam === "price_desc"
      ? "-seller.price"
      : sortParam === "qty_asc"
      ? "seller.quantity"
      : sortParam === "qty_desc"
      ? "-seller.quantity"
      : "-createdAt";

  // RTK Query: GET /inventories/my-inventory
  const { data: inventoryResponse, isLoading, isFetching, isError, refetch } =
    useGetMyInventoryQuery({
      search: urlSearch || undefined,
      page: String(page),
      limit: String(LIMIT),
      sort: apiSort,
    });

  const inventoryList: TInventory[] = (inventoryResponse?.data as TInventory[]) || [];

  const meta = inventoryResponse?.meta || {
    page: 1,
    limit: LIMIT,
    total: inventoryList.length,
    totalPage: 1,
  };

  // CSV Export
  const handleExportCsv = useCallback(() => {
    if (!inventoryList || inventoryList.length === 0) {
      toast.warning("No inventory records to export");
      return;
    }

    const headers = [
      "ASIN",
      "SKU",
      "Product Title",
      "Listing Price (USD)",
      "Stock Quantity",
      "Stock Status",
      "Buy Box Winner",
      "Fulfillment Provider",
      "Shipping Days",
    ];

    const rows = inventoryList.map((item: TInventory) => [
      `"${item.asin || ""}"`,
      `"${item.variant?.sku || ""}"`,
      `"${(item.variant?.product?.title || "").replace(/"/g, '""')}"`,
      item.seller?.price || 0,
      item.seller?.quantity || 0,
      item.seller?.isStock && (item.seller?.quantity || 0) > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
      item.seller?.isBuyBoxWinner ? "YES" : "NO",
      `"${item.seller?.fulfillmentBy || ""}"`,
      item.seller?.shippingTime || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e: any[]) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `vendor_inventory_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [inventoryList]);

  useEffect(() => {
    registerExportHandler?.(handleExportCsv);
  }, [registerExportHandler, handleExportCsv]);

  const handleCopyAsin = (asin: string) => {
    navigator.clipboard.writeText(asin);
    setCopiedAsin(asin);
    toast.success(`Copied ASIN: ${asin}`);
    setTimeout(() => setCopiedAsin(null), 2000);
  };

  const handleFilterChange = (newFilters: InventoryFilterState) => {
    updateUrl({
      ...newFilters,
      page: 1,
    });
  };

  const handleResetFilters = () => {
    setSearch("");
    router.push(pathname);
  };

  // Columns definition
  const columns: TColumn<TInventory>[] = [
    {
      header: "Product & ASIN",
      accessor: (item) => {
        const title = item.variant?.product?.title || "Unknown Product";
        const brand = item.variant?.product?.brand || "";
        const img = item.variant?.images?.[0] || "/placeholder.png";

        return (
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-base-content/10 bg-base-200 shrink-0">
              <img
                src={img}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80";
                }}
              />
            </div>
            <div className="flex flex-col min-w-0 max-w-[200px] sm:max-w-xs">
              <span className="text-xs font-semibold text-base-content truncate" title={title}>
                {title}
              </span>
              {brand && (
                <span className="text-[10px] text-base-content/60 truncate uppercase tracking-wider">
                  {brand}
                </span>
              )}
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-mono font-medium text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                  {item.asin}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyAsin(item.asin)}
                  className="p-0.5 text-base-content/40 hover:text-base-content transition"
                  title="Copy ASIN"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Listing Price",
      accessor: (item) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-base-content">
            ${Number(item.seller?.price || 0).toFixed(2)}
          </span>
          <span className="text-[10px] text-base-content/50">
            Fulfillment: {item.seller?.fulfillmentBy || "FBM"}
          </span>
        </div>
      ),
    },
    {
      header: "Available Stock",
      accessor: (item) => {
        const qty = item.seller?.quantity || 0;
        const isStock = item.seller?.isStock && qty > 0;
        const isLow = qty <= 5 && qty > 0;

        return (
          <div className="flex flex-col">
            <span
              className={`text-xs font-bold ${
                !isStock
                  ? "text-error"
                  : isLow
                  ? "text-warning"
                  : "text-base-content"
              }`}
            >
              {qty} units
            </span>
            <span className="text-[10px] text-base-content/50">
              {!isStock ? "Out of Stock" : isLow ? "Low Reserve" : "In Stock"}
            </span>
          </div>
        );
      },
    },
    {
      header: "Buy Box Standing",
      accessor: (item) => {
        const isWinner = item.seller?.isBuyBoxWinner;
        return (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              isWinner
                ? "bg-success/15 text-success border border-success/30"
                : "bg-base-content/5 text-base-content/60 border border-base-content/10"
            }`}
          >
            {isWinner ? (
              <>
                <CheckCircle2 className="w-3 h-3" /> Winning
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3" /> Competing
              </>
            )}
          </span>
        );
      },
    },
    {
      header: "Actions",
      accessor: (item) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setSelectedInventory(item);
              setIsPriceModalOpen(true);
            }}
            className="btn btn-ghost btn-xs btn-square text-base-content/70 hover:text-accent hover:bg-accent/10"
            title="Adjust Price"
          >
            <DollarSign className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedInventory(item);
              setIsStockModalOpen(true);
            }}
            className="btn btn-ghost btn-xs btn-square text-base-content/70 hover:text-accent hover:bg-accent/10"
            title="Update Stock"
          >
            <Package className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedInventory(item);
              setIsDetailsOpen(true);
            }}
            className="btn btn-ghost btn-xs btn-square text-base-content/70 hover:text-accent hover:bg-accent/10"
            title="Full Details"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const currentFilters: InventoryFilterState = {
    stockStatus: stockParam,
    buyBox: "",
    sort: sortParam,
  };

  return (
    <div className="space-y-4">
      {/* Filter / Search Bar */}
      <InventoryFilterBar
        search={search}
        onSearchChange={(val: string) => setSearch(val)}
        filters={currentFilters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Reusable AZTable */}
      <AZTable
        title="Live Inventory Catalog"
        subtitle="Manage stock units, live prices, and Buy Box competitiveness"
        badgeText={`${meta.total || inventoryList.length} SKU${(meta.total || inventoryList.length) !== 1 ? "s" : ""}`}
        icon={<Layers className="w-5 h-5 text-accent" />}
        data={inventoryList}
        columns={columns}
        keyExtractor={(item: TInventory) => item._id}
        isLoading={isLoading || isFetching || isRefreshing}
        isError={isError}
        errorMessage="Failed to fetch your inventory from server. Please verify your connection."
        onRetry={refetch}
        emptyTitle="No Inventory Items Listed"
        emptyMessage="You have not listed any ASINs in your inventory yet. Click 'List New Item' to begin selling!"
        emptyIcon={<Layers className="w-10 h-10 text-base-content/30" />}
        pagination={{
          page,
          limit: LIMIT,
          total: meta.total || inventoryList.length,
          onPageChange: (newPage: number) => updateUrl({ page: newPage }),
        }}
      />

      {/* Modals */}
      <UpdatePriceModal
        isOpen={isPriceModalOpen}
        onClose={() => {
          setIsPriceModalOpen(false);
          setSelectedInventory(null);
        }}
        inventory={selectedInventory}
      />

      <UpdateStockModal
        isOpen={isStockModalOpen}
        onClose={() => {
          setIsStockModalOpen(false);
          setSelectedInventory(null);
        }}
        inventory={selectedInventory}
      />

      <InventoryDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedInventory(null);
        }}
        inventory={selectedInventory}
        onOpenPriceModal={() => setIsPriceModalOpen(true)}
        onOpenStockModal={() => setIsStockModalOpen(true)}
      />
    </div>
  );
};

export default InventoryData;
