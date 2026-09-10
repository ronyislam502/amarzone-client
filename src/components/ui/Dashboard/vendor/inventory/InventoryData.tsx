"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  Layers,
  Eye,
  Edit2,
  Boxes,
  Tag,
  Trophy,
  Copy,
  Check,
  Truck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useGetMyInventoryQuery } from "@/src/redux/features/inventory/inventoryApi";
import { TInventory } from "@/src/types/inventory";
import { TColumn } from "@/src/types/table";
import AZTable from "../../../shared/AZTable";
import InventoryFilterBar, { InventoryFilterState } from "./InventoryFilterBar";
import UpdatePriceModal from "./UpdatePriceModal";
import UpdateStockModal from "./UpdateStockModal";
import InventoryDetailsModal from "./InventoryDetailsModal";
import { toast } from "react-toastify";
import { useDebounce } from "@/src/components/utilities/Debaounce";

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

const initialFilters: InventoryFilterState = {
  stockStatus: "",
  buyBox: "",
  sort: "",
};

const InventoryData = ({
  onStatsChange,
  registerExportHandler,
  isRefreshing = false,
}: InventoryDataProps) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [filters, setFilters] = useState<InventoryFilterState>(initialFilters);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [copiedAsin, setCopiedAsin] = useState<string | null>(null);

  // Modals state
  const [selectedInventory, setSelectedInventory] = useState<TInventory | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);

  // RTK Query: GET /inventories/my-inventory
  const { data: inventoryResponse, isLoading, isFetching, isError, refetch } =
    useGetMyInventoryQuery({
      search: debouncedSearch,
      page,
      limit,
    });

  const rawInventory: TInventory[] = useMemo(() => {
    return (inventoryResponse?.data as TInventory[]) || [];
  }, [inventoryResponse]);

  const meta = inventoryResponse?.meta || {
    page: 1,
    limit: 10,
    total: rawInventory.length,
    totalPage: 1,
  };

  // Client-side filtering & sorting
  const filteredInventory = useMemo(() => {
    let result = [...rawInventory];

    // Filter by stock status
    if (filters.stockStatus === "in_stock") {
      result = result.filter(
        (item) => item.seller?.isStock && (item.seller?.quantity || 0) > 0
      );
    } else if (filters.stockStatus === "low_stock") {
      result = result.filter(
        (item) =>
          (item.seller?.quantity || 0) > 0 && (item.seller?.quantity || 0) <= 5
      );
    } else if (filters.stockStatus === "out_of_stock") {
      result = result.filter(
        (item) => !item.seller?.isStock || (item.seller?.quantity || 0) === 0
      );
    }

    // Filter by Buy Box
    if (filters.buyBox === "winner") {
      result = result.filter((item) => item.seller?.isBuyBoxWinner);
    } else if (filters.buyBox === "non_winner") {
      result = result.filter((item) => !item.seller?.isBuyBoxWinner);
    }

    // Sort
    if (filters.sort === "price_asc") {
      result.sort(
        (a, b) => (a.seller?.price || 0) - (b.seller?.price || 0)
      );
    } else if (filters.sort === "price_desc") {
      result.sort(
        (a, b) => (b.seller?.price || 0) - (a.seller?.price || 0)
      );
    } else if (filters.sort === "qty_asc") {
      result.sort(
        (a, b) => (a.seller?.quantity || 0) - (b.seller?.quantity || 0)
      );
    } else if (filters.sort === "qty_desc") {
      result.sort(
        (a, b) => (b.seller?.quantity || 0) - (a.seller?.quantity || 0)
      );
    }

    return result;
  }, [rawInventory, filters]);

  const onStatsChangeRef = useRef(onStatsChange);
  useEffect(() => {
    onStatsChangeRef.current = onStatsChange;
  }, [onStatsChange]);

  // Report KPI stats
  useEffect(() => {
    if (!inventoryResponse?.data || !onStatsChangeRef.current) return;

    const items = (inventoryResponse.data as TInventory[]) || [];
    const inStockCount = items.filter(
      (item) => item.seller?.isStock && (item.seller?.quantity || 0) > 0
    ).length;
    const lowStockCount = items.filter(
      (item) => (item.seller?.quantity || 0) <= 5
    ).length;
    const buyBoxWinnersCount = items.filter(
      (item) => item.seller?.isBuyBoxWinner
    ).length;

    onStatsChangeRef.current({
      totalItems: inventoryResponse?.meta?.total ?? items.length,
      inStockCount,
      lowStockCount,
      buyBoxWinnersCount,
    });
  }, [inventoryResponse?.data, inventoryResponse?.meta?.total]);

  // CSV Export
  const handleExportCsv = () => {
    if (!filteredInventory || filteredInventory.length === 0) {
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

    const rows = filteredInventory.map((item) => [
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
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

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
  };

  const handleExportCsvRef = useRef(handleExportCsv);
  useEffect(() => {
    handleExportCsvRef.current = handleExportCsv;
  }, [filteredInventory]);

  useEffect(() => {
    if (registerExportHandler) {
      registerExportHandler(() => handleExportCsvRef.current());
    }
  }, [registerExportHandler]);

  const copyAsin = (asin: string) => {
    navigator.clipboard.writeText(asin);
    setCopiedAsin(asin);
    toast.info(`Copied ASIN: ${asin}`);
    setTimeout(() => setCopiedAsin(null), 2000);
  };

  // Table Columns
  const columns: TColumn<TInventory>[] = [
    {
      header: "Product / Variant",
      accessor: (item: TInventory) => {
        const product = item.variant?.product;
        const variant = item.variant;
        const img =
          variant?.images?.[0] ||
          product?.featuredImage ||
          product?.thumbnail ||
          "https://placehold.co/80x80?text=Item";

        return (
          <div className="flex items-center gap-3 max-w-sm">
            <div className="w-12 h-12 rounded-xl bg-base-200 border border-base-300 overflow-hidden shrink-0 flex items-center justify-center">
              <img
                src={img}
                alt={product?.title || "Variant"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/80x80?text=Item";
                }}
              />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="font-bold text-xs text-base-content line-clamp-1">
                {product?.title || "Product Listing"}
              </div>
              <div className="text-[11px] text-base-content/60 font-mono">
                SKU: {variant?.sku || "N/A"}
              </div>
              {variant?.attributes && variant.attributes.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap pt-0.5">
                  {variant.attributes.map((attr, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] px-1.5 py-0.5 rounded-md bg-base-200 font-semibold text-base-content/70"
                    >
                      {attr.type}: {attr.value}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      header: "ASIN",
      accessor: (item: TInventory) => (
        <button
          type="button"
          onClick={() => copyAsin(item.asin)}
          className="group flex items-center gap-1.5 font-mono text-xs font-bold text-accent hover:underline cursor-pointer"
          title="Click to copy ASIN"
        >
          <span>{item.asin}</span>
          {copiedAsin === item.asin ? (
            <Check className="w-3 h-3 text-success" />
          ) : (
            <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </button>
      ),
    },
    {
      header: "Price",
      accessor: (item: TInventory) => (
        <div className="flex items-center gap-1.5">
          <span className="font-black text-xs sm:text-sm text-base-content">
            ${Number(item.seller?.price || 0).toFixed(2)}
          </span>
          <button
            type="button"
            onClick={() => {
              setSelectedInventory(item);
              setIsPriceModalOpen(true);
            }}
            className="btn btn-xs btn-ghost btn-circle text-accent hover:bg-accent/10"
            title="Edit price"
          >
            <Tag className="w-3 h-3" />
          </button>
        </div>
      ),
    },
    {
      header: "Stock Level",
      accessor: (item: TInventory) => {
        const qty = item.seller?.quantity || 0;
        const isStock = item.seller?.isStock && qty > 0;

        return (
          <div className="flex items-center gap-2">
            <div>
              <span
                className={`badge badge-sm font-bold gap-1 ${
                  qty === 0
                    ? "badge-error text-white"
                    : qty <= 5
                    ? "badge-warning text-white"
                    : "badge-success text-white"
                }`}
              >
                {qty === 0 ? (
                  <XCircle className="w-3 h-3" />
                ) : qty <= 5 ? (
                  <AlertTriangle className="w-3 h-3" />
                ) : (
                  <CheckCircle2 className="w-3 h-3" />
                )}
                {qty} units
              </span>
              <div className="text-[10px] text-base-content/50 font-medium mt-0.5">
                {isStock ? "In Stock" : "Out of Stock"}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedInventory(item);
                setIsStockModalOpen(true);
              }}
              className="btn btn-xs btn-ghost btn-circle text-success hover:bg-success/10"
              title="Replenish stock"
            >
              <Boxes className="w-3 h-3" />
            </button>
          </div>
        );
      },
    },
    {
      header: "Buy Box",
      accessor: (item: TInventory) => {
        const isWinner = Boolean(item.seller?.isBuyBoxWinner);
        return isWinner ? (
          <span className="badge badge-primary badge-sm font-bold gap-1 shadow-xs">
            <Trophy className="w-3 h-3" /> Winner
          </span>
        ) : (
          <span className="badge badge-ghost badge-sm text-base-content/60 font-semibold">
            Competing
          </span>
        );
      },
    },
    {
      header: "Fulfillment",
      accessor: (item: TInventory) => (
        <div className="text-xs">
          <div className="font-bold text-base-content flex items-center gap-1">
            <Truck className="w-3 h-3 text-accent" />
            {item.seller?.fulfillmentBy || "Merchant"}
          </div>
          <div className="text-[10px] text-base-content/60">
            {item.seller?.shippingTime || 3} days transit
          </div>
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: (item: TInventory) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setSelectedInventory(item);
              setIsDetailsOpen(true);
            }}
            className="btn btn-xs btn-ghost btn-circle hover:bg-base-200 text-base-content/80"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedInventory(item);
              setIsPriceModalOpen(true);
            }}
            className="btn btn-xs btn-ghost btn-circle hover:bg-accent/10 text-accent"
            title="Edit Price"
          >
            <Tag className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedInventory(item);
              setIsStockModalOpen(true);
            }}
            className="btn btn-xs btn-ghost btn-circle hover:bg-success/10 text-success"
            title="Update Stock"
          >
            <Boxes className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <InventoryFilterBar
        search={search}
        onSearchChange={setSearch}
        filters={filters}
        onFilterChange={setFilters}
        onReset={() => {
          setSearch("");
          setFilters(initialFilters);
        }}
      />

      {/* Reusable AZTable */}
      <AZTable
        title="Live Inventory Catalog"
        subtitle="Manage stock units, live prices, and Buy Box competitiveness"
        badgeText={`${filteredInventory.length} SKU${filteredInventory.length !== 1 ? "s" : ""}`}
        icon={<Layers className="w-5 h-5 text-accent" />}
        data={filteredInventory}
        columns={columns}
        keyExtractor={(item) => item._id}
        isLoading={isLoading || isFetching}
        isError={isError}
        errorMessage="Failed to fetch your inventory from server. Please verify your connection."
        onRetry={refetch}
        emptyTitle="No Inventory Items Listed"
        emptyMessage="You have not listed any ASINs in your inventory yet. Click 'List New Item' to begin selling!"
        emptyIcon={<Layers className="w-10 h-10 text-base-content/30" />}
        pagination={{
          page,
          limit,
          total: meta.total || filteredInventory.length,
          onPageChange: (newPage) => setPage(newPage),
          onLimitChange: (newLimit) => {
            setLimit(newLimit);
            setPage(1);
          },
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
