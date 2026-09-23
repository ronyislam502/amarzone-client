"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Store,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import {
  useAllVendorsQuery,
  useDeleteVendorMutation,
} from "@/redux/features/vendor/vendorApi";
import { TVendor } from "@/types/vendor";
import { TColumn } from "@/src/types/table";
import AZTable from "../../../shared/AZTable";
import { TABLE_CARD_CN } from "@/src/lib/tableStyles";
import VendorsFilterBar, { VendorsFilterState } from "./VendorsFilterBar";
import VendorDetailsModal from "./VendorDetailsModal";
import UpdateVendorModal from "./UpdateVendorModal";
import { toast } from "react-toastify";
import { useDebounce } from "@/src/components/utilities/Debaounce";

export interface VendorsStatsData {
  totalVendors: number;
  activeVendors: number;
  newVendorsCount: number;
}

interface VendorsDataProps {
  onStatsChange?: (stats: VendorsStatsData) => void;
  registerExportHandler?: (handler: () => void) => void;
}

const LIMIT = 10;

const VendorsData = ({
  registerExportHandler,
}: VendorsDataProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL-driven query state
  const page = Number(searchParams.get("page")) || 1;
  const statusParam = searchParams.get("status") || "";
  const sortParam = searchParams.get("sort") || "";
  const countryParam = searchParams.get("country") || "";
  const urlSearch = searchParams.get("search") || "";

  // Local search input before debounce
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

  // Modal states
  const [selectedViewVendor, setSelectedViewVendor] = useState<TVendor | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedEditVendor, setSelectedEditVendor] = useState<TVendor | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const apiSort =
    sortParam === "name_asc"
      ? "name"
      : sortParam === "name_desc"
      ? "-name"
      : sortParam === "oldest"
      ? "createdAt"
      : "-createdAt";

  // Queries & Mutations
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAllVendorsQuery({
    search: urlSearch || undefined,
    page: String(page),
    limit: String(LIMIT),
    status: statusParam || undefined,
    sort: apiSort,
  });

  const [deleteVendor] = useDeleteVendorMutation();

  const vendors: TVendor[] = responseData?.data || [];
  const meta = responseData?.meta;

  // CSV Export logic
  const handleExportCsv = useCallback(() => {
    if (!vendors || vendors.length === 0) return;

    const headers = [
      "Vendor ID",
      "Store Name",
      "Email",
      "Phone",
      "Street",
      "State",
      "Country",
      "Postal Code",
      "Status",
      "Joined Date",
    ];

    const rows = vendors.map((v) => [
      `"${v._id}"`,
      `"${(v.name || "").replace(/"/g, '""')}"`,
      `"${(v.email || "").replace(/"/g, '""')}"`,
      `"${v.phone || ""}"`,
      `"${(v.address?.street || "").replace(/"/g, '""')}"`,
      `"${v.address?.state || ""}"`,
      `"${v.address?.country || ""}"`,
      `"${v.address?.postalCode || ""}"`,
      v.isDeleted ? "SUSPENDED" : "ACTIVE",
      v.createdAt ? new Date(v.createdAt).toISOString().slice(0, 10) : "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `vendors_directory_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [vendors]);

  useEffect(() => {
    registerExportHandler?.(handleExportCsv);
  }, [registerExportHandler, handleExportCsv]);

  const handleDeleteVendor = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove/suspend vendor "${name}"?`)) {
      return;
    }

    try {
      const res = await deleteVendor(id).unwrap();
      toast.success(res?.message || "Vendor removed/suspended successfully");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove vendor");
    }
  };

  const handleFilterChange = (newFilters: Partial<VendorsFilterState>) => {
    updateUrl({
      ...newFilters,
      page: 1,
    });
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    router.push(pathname);
  };

  // Table Columns Definition
  const columns: TColumn<TVendor>[] = [
    {
      header: "Store & Brand",
      accessor: (vendor) => (
        <div className="flex items-center gap-3 max-w-sm">
          <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-white/15 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
            {vendor.logo ? (
              <img
                src={vendor.logo}
                alt={vendor.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                {vendor.name?.charAt(0)?.toUpperCase() || "V"}
              </div>
            )}
          </div>
          <div className="space-y-0.5">
            <div className="font-extrabold text-xs text-white">
              {vendor.name}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Mail className="w-3 h-3 text-amber-400/80 shrink-0" />
              <span className="truncate max-w-[150px]">{vendor.email}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Business Phone",
      accessor: (vendor) => (
        <div className="text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
          <Phone className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
          <span>{vendor.phone || "No phone provided"}</span>
        </div>
      ),
    },
    {
      header: "Commercial Location",
      accessor: (vendor) => {
        const addr = vendor.address;
        if (!addr || (!addr.state && !addr.country && !addr.street)) {
          return (
            <span className="text-[11px] text-slate-500 italic">
              Address not specified
            </span>
          );
        }
        return (
          <div className="text-[11px] text-slate-300 max-w-[200px] truncate">
            <div className="flex items-center gap-1 text-slate-200 font-semibold truncate">
              <MapPin className="w-3 h-3 text-amber-400/80 shrink-0" />
              <span>
                {addr.state || ""}
                {addr.country ? ` (${addr.country})` : ""}
              </span>
            </div>
            {addr.street && (
              <div className="text-[10px] text-slate-400 truncate pl-4">
                {addr.street}
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: "Merchant Status",
      accessor: (vendor) => {
        const isSuspended = vendor.isDeleted;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-sm ${
              !isSuspended
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
            }`}
          >
            {!isSuspended ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                Authorized
              </>
            ) : (
              <>
                <AlertTriangle className="w-3 h-3" />
                Suspended
              </>
            )}
          </span>
        );
      },
    },
    {
      header: "Onboarding Date",
      accessor: (vendor) => {
        const dateStr = vendor.createdAt
          ? new Date(vendor.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "N/A";

        return (
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
            <span>{dateStr}</span>
          </div>
        );
      },
    },
    {
      header: "Actions",
      accessor: (vendor) => (
        <div className="flex items-center gap-2">
          {/* Quick View Details */}
          <button
            onClick={() => {
              setSelectedViewVendor(vendor);
              setIsViewModalOpen(true);
            }}
            title="View Details"
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-slate-300 hover:text-amber-400 transition-all duration-200"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Quick Edit Vendor */}
          <button
            onClick={() => {
              setSelectedEditVendor(vendor);
              setIsEditModalOpen(true);
            }}
            title="Edit Store Profile"
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-slate-300 hover:text-amber-400 transition-all duration-200"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {/* Suspend / Delete Vendor */}
          <button
            onClick={() => handleDeleteVendor(vendor._id, vendor.name)}
            title="Suspend Merchant"
            className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:border-rose-400/50 hover:bg-rose-500/20 text-rose-400 transition-all duration-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const currentFilters: VendorsFilterState = {
    status: statusParam,
    country: countryParam,
    sort: sortParam,
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <VendorsFilterBar
        filters={currentFilters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Main Table Card */}
      <div className={`${TABLE_CARD_CN} p-4 sm:p-6`}>
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />

        {/* Ambient background glow orbs */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-amber-500/15 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 right-1/4 w-56 h-56 bg-gradient-to-tl from-indigo-600/20 via-purple-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* High-tech dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10">
          <AZTable
            title="Merchant Storefronts"
            subtitle="Catalog of registered store partners, verified branding assets, and commercial locations."
            badgeText={meta?.total ?? vendors.length}
            icon={<Store className="w-5 h-5 text-amber-400" />}
            className="!bg-transparent !shadow-none !border-none text-slate-100"
            data={vendors}
            columns={columns}
            keyExtractor={(vendor) => vendor._id}
            isLoading={isLoading}
            isError={isError}
            errorMessage={(error as any)?.data?.message}
            onRetry={refetch}
            onRefresh={refetch}
            isRefreshing={isFetching}
            searchValue={searchTerm}
            onSearchChange={(val: string) => setSearchTerm(val)}
            searchPlaceholder="Search vendors by store name, email, phone, location..."
            emptyTitle="No Vendors Found"
            emptyMessage="No merchant storefronts match your active filters or search term."
            emptyIcon={<Store className="w-6 h-6 text-amber-400" />}
            pagination={{
              page,
              limit: LIMIT,
              total: meta?.total ?? vendors.length,
              onPageChange: (p) => updateUrl({ page: p }),
            }}
          />
        </div>
      </div>

      {/* Vendor Details Modal */}
      <VendorDetailsModal
        vendor={selectedViewVendor}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedViewVendor(null);
        }}
      />

      {/* Update Vendor Modal */}
      <UpdateVendorModal
        vendor={selectedEditVendor}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEditVendor(null);
        }}
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
};

export default VendorsData;
