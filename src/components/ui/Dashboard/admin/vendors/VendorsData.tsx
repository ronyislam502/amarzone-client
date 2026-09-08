"use client";

import { useState, useMemo, useEffect } from "react";
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
  Image as ImageIcon,
} from "lucide-react";
import {
  useAllVendorsQuery,
  useDeleteVendorMutation,
} from "@/redux/features/vendor/vendorApi";
import { TVendor } from "@/types/vendor";
import { TColumn } from "@/src/types/table";
import AZTable from "../../../shared/AZTable";
import VendorsFilterBar, { VendorsFilterState } from "./VendorsFilterBar";
import VendorDetailsModal from "./VendorDetailsModal";
import UpdateVendorModal from "./UpdateVendorModal";
import { toast } from "react-toastify";

export interface VendorsStatsData {
  totalVendors: number;
  activeVendors: number;
  newVendorsCount: number;
}

interface VendorsDataProps {
  onStatsChange?: (stats: VendorsStatsData) => void;
  registerExportHandler?: (handler: () => void) => void;
}

const initialFilters: VendorsFilterState = {
  status: "",
  country: "",
  sort: "",
};

const VendorsData = ({
  onStatsChange,
  registerExportHandler,
}: VendorsDataProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<VendorsFilterState>(initialFilters);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modal states
  const [selectedViewVendor, setSelectedViewVendor] = useState<TVendor | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedEditVendor, setSelectedEditVendor] = useState<TVendor | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Queries & Mutations
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAllVendorsQuery({
    search: searchTerm.trim() || undefined,
    page: String(page),
    limit: String(limit),
  });

  const [deleteVendor] = useDeleteVendorMutation();

  const rawVendors: TVendor[] = responseData?.data || [];
  const meta = responseData?.meta;

  // Filter and sort locally based on filter bar
  const vendors = useMemo(() => {
    let result = [...rawVendors];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (v) =>
          v.name?.toLowerCase().includes(q) ||
          v.email?.toLowerCase().includes(q) ||
          v.phone?.toLowerCase().includes(q) ||
          v.address?.country?.toLowerCase().includes(q)
      );
    }

    if (filters.status === "active") {
      result = result.filter((v) => !v.isDeleted);
    } else if (filters.status === "inactive") {
      result = result.filter((v) => v.isDeleted);
    }

    if (filters.country) {
      result = result.filter(
        (v) =>
          v.address?.country?.toLowerCase() === filters.country.toLowerCase()
      );
    }

    if (filters.sort === "name_asc") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (filters.sort === "name_desc") {
      result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    } else if (filters.sort === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.createdAt || "").getTime() -
          new Date(b.createdAt || "").getTime()
      );
    }

    return result;
  }, [rawVendors, searchTerm, filters]);

  // Compute stats to emit upward
  useEffect(() => {
    if (rawVendors && onStatsChange) {
      const activeCount = rawVendors.filter((v) => !v.isDeleted).length;
      onStatsChange({
        totalVendors: meta?.total ?? rawVendors.length,
        activeVendors: activeCount,
        newVendorsCount: rawVendors.length,
      });
    }
  }, [rawVendors, meta?.total, onStatsChange]);

  // CSV Export logic
  const handleExportCsv = () => {
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
  };

  useEffect(() => {
    if (registerExportHandler) {
      registerExportHandler(handleExportCsv);
    }
  }, [registerExportHandler, vendors]);

  const handleDeleteVendor = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove/suspend vendor "${name}"?`)) {
      return;
    }

    try {
      const res = await deleteVendor(id).unwrap();
      toast.success(res?.message || "Vendor removed successfully");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove vendor");
    }
  };

  // Table Columns Definition
  const columns: TColumn<TVendor>[] = [
    {
      header: "Merchant Storefront",
      accessor: (vendor) => (
        <div className="flex items-center gap-3 max-w-sm">
          <div className="w-12 h-12 rounded-xl bg-base-200 border border-base-300 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
            {vendor.logo ? (
              <img
                src={vendor.logo}
                alt={vendor.name}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <Store className="w-5 h-5 text-warning" />
            )}
          </div>
          <div className="min-w-0 space-y-0.5">
            <div
              className="font-extrabold text-xs text-base-content line-clamp-1 hover:text-warning transition-colors cursor-pointer"
              onClick={() => {
                setSelectedViewVendor(vendor);
                setIsViewModalOpen(true);
              }}
            >
              {vendor.name}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-base-content/60">
              <span className="badge badge-warning badge-xs font-bold px-1.5 py-0.5">
                Merchant
              </span>
              <span className="truncate max-w-[140px]">{vendor.email}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Contact Channels",
      accessor: (vendor) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-[11px] font-bold text-base-content/90">
            <Phone className="w-3 h-3 text-warning shrink-0" />
            <span className="truncate">{vendor.phone || "No phone"}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-base-content/60">
            <Mail className="w-3 h-3 text-base-content/40 shrink-0" />
            <a
              href={`mailto:${vendor.email}`}
              className="text-primary hover:underline truncate max-w-[140px]"
            >
              {vendor.email}
            </a>
          </div>
        </div>
      ),
    },
    {
      header: "Business Location",
      accessor: (vendor) => (
        <div className="space-y-0.5 text-xs max-w-[180px]">
          <div className="flex items-center gap-1 text-[11px] font-bold text-base-content/80 truncate">
            <MapPin className="w-3 h-3 text-info shrink-0" />
            <span className="truncate">
              {vendor.address?.street || "Street Unassigned"}
            </span>
          </div>
          <div className="text-[10px] text-base-content/60 pl-4 truncate">
            {[vendor.address?.state, vendor.address?.country]
              .filter(Boolean)
              .join(", ") || "Location unassigned"}
          </div>
        </div>
      ),
    },
    {
      header: "Storefront Branding",
      accessor: (vendor) => (
        <div className="flex items-center gap-2">
          {vendor.banner ? (
            <div className="w-16 h-8 rounded-lg overflow-hidden border border-base-300 relative group bg-base-200 shadow-sm">
              <img
                src={vendor.banner}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <span className="badge badge-ghost badge-xs text-[10px] text-base-content/40 gap-1">
              <ImageIcon className="w-2.5 h-2.5" /> No Banner
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (vendor) =>
        !vendor.isDeleted ? (
          <span className="badge badge-success badge-sm font-bold gap-1">
            <CheckCircle2 className="w-3 h-3" /> Active
          </span>
        ) : (
          <span className="badge badge-error badge-sm font-bold gap-1">
            <AlertTriangle className="w-3 h-3" /> Suspended
          </span>
        ),
    },
    {
      header: "Onboarded",
      accessor: (vendor) => (
        <div className="flex items-center gap-1 text-[11px] text-base-content/70">
          <Calendar className="w-3 h-3 text-base-content/40" />
          <span>
            {vendor.createdAt
              ? new Date(vendor.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "N/A"}
          </span>
        </div>
      ),
    },
    {
      header: "Actions",
      align: "right",
      accessor: (vendor) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            title="View Storefront Details"
            onClick={() => {
              setSelectedViewVendor(vendor);
              setIsViewModalOpen(true);
            }}
            className="btn btn-ghost btn-xs font-bold text-info gap-1 hover:bg-info/10 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </button>

          <button
            type="button"
            title="Edit Vendor Profile"
            onClick={() => {
              setSelectedEditVendor(vendor);
              setIsEditModalOpen(true);
            }}
            className="btn btn-ghost btn-xs font-bold text-warning gap-1 hover:bg-warning/10 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            title="Suspend / Delete Vendor"
            onClick={() => handleDeleteVendor(vendor._id, vendor.name)}
            className="btn btn-ghost btn-xs font-bold text-error hover:bg-error/10 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Search & Dynamic Filter Toolbar */}
      <VendorsFilterBar
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters((prev) => ({ ...prev, ...newFilters }));
          setPage(1);
        }}
        onReset={() => {
          setFilters(initialFilters);
          setSearchTerm("");
          setPage(1);
        }}
      />

      {/* Main Vendors AZTable */}
      <AZTable
        title="Verified Merchant Directory"
        subtitle="Catalog of registered store partners, verified branding assets, and commercial locations."
        badgeText={meta?.total ?? vendors.length}
        icon={<Store className="w-5 h-5 text-warning" />}
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
        onSearchChange={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        searchPlaceholder="Search vendors by store name, email, phone, location..."
        emptyTitle="No Vendors Found"
        emptyMessage="No merchant storefronts match your active filters or search term."
        emptyIcon={<Store className="w-6 h-6" />}
        pagination={{
          page,
          limit,
          total: meta?.total ?? vendors.length,
          onPageChange: (p) => setPage(p),
          onLimitChange: (l) => {
            setLimit(l);
            setPage(1);
          },
        }}
      />

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
