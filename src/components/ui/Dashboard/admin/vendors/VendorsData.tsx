"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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

  const onStatsChangeRef = useRef(onStatsChange);
  useEffect(() => {
    onStatsChangeRef.current = onStatsChange;
  }, [onStatsChange]);

  // Compute stats to emit upward
  useEffect(() => {
    if (!responseData?.data || !onStatsChangeRef.current) return;
    const items = (responseData.data as TVendor[]) || [];
    const activeCount = items.filter((v) => !v.isDeleted).length;
    onStatsChangeRef.current({
      totalVendors: meta?.total ?? items.length,
      activeVendors: activeCount,
      newVendorsCount: items.length,
    });
  }, [responseData?.data, meta?.total]);

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

  const handleExportCsvRef = useRef(handleExportCsv);
  useEffect(() => {
    handleExportCsvRef.current = handleExportCsv;
  }, [vendors]);

  useEffect(() => {
    if (registerExportHandler) {
      registerExportHandler(() => handleExportCsvRef.current());
    }
  }, [registerExportHandler]);

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
          <div className="w-12 h-12 rounded-xl bg-[#120824] border border-white/15 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
            {vendor.logo ? (
              <img
                src={vendor.logo}
                alt={vendor.name}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <Store className="w-5 h-5 text-amber-400" />
            )}
          </div>
          <div className="min-w-0 space-y-0.5">
            <div
              className="font-extrabold text-xs text-white line-clamp-1 hover:text-amber-400 transition-colors cursor-pointer"
              onClick={() => {
                setSelectedViewVendor(vendor);
                setIsViewModalOpen(true);
              }}
            >
              {vendor.name}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="badge badge-warning badge-xs font-black text-slate-950 px-1.5 py-0.5">
                Merchant
              </span>
              <span className="truncate max-w-[140px] text-slate-400">{vendor.email}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Contact Channels",
      accessor: (vendor) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-200">
            <Phone className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">{vendor.phone || "No phone"}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Mail className="w-3 h-3 text-slate-500 shrink-0" />
            <a
              href={`mailto:${vendor.email}`}
              className="text-amber-400/90 hover:underline truncate max-w-[140px]"
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
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-200 truncate">
            <MapPin className="w-3 h-3 text-sky-400 shrink-0" />
            <span className="truncate">
              {vendor.address?.street || "Street Unassigned"}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 pl-4 truncate">
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
            <div className="w-16 h-8 rounded-lg overflow-hidden border border-white/15 relative group bg-[#120824] shadow-sm">
              <img
                src={vendor.banner}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <span className="badge badge-outline border-white/15 text-[10px] text-slate-400 gap-1 bg-white/5">
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
          <span className="badge badge-success badge-outline bg-success/10 border-success/30 text-success badge-sm font-bold gap-1">
            <CheckCircle2 className="w-3 h-3" /> Active
          </span>
        ) : (
          <span className="badge badge-error badge-outline bg-error/10 border-error/30 text-error badge-sm font-bold gap-1">
            <AlertTriangle className="w-3 h-3" /> Suspended
          </span>
        ),
    },
    {
      header: "Onboarded",
      accessor: (vendor) => (
        <div className="flex items-center gap-1 text-[11px] text-slate-300">
          <Calendar className="w-3 h-3 text-slate-500" />
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
            className="btn btn-ghost btn-xs font-bold text-amber-400 gap-1 hover:bg-amber-400/10 border border-amber-400/20 hover:border-amber-400/40 rounded-lg cursor-pointer transition-all"
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
            className="btn btn-ghost btn-xs font-bold text-sky-400 gap-1 hover:bg-sky-400/10 border border-sky-400/20 hover:border-sky-400/40 rounded-lg cursor-pointer transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            title="Suspend / Delete Vendor"
            onClick={() => handleDeleteVendor(vendor._id, vendor.name)}
            className="btn btn-ghost btn-xs font-bold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 rounded-lg cursor-pointer transition-all"
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

      {/* Main Vendors Directory Table Container */}
      <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl [&_.input]:bg-[#120824] [&_.input]:border-white/15 [&_.input]:text-slate-200 [&_.input]:placeholder:text-slate-500 [&_.input:focus]:border-amber-400 [&_thead_th]:text-slate-300 [&_thead_th]:bg-white/[0.03] [&_thead_th]:border-b [&_thead_th]:border-white/10 [&_tbody_tr]:border-b [&_tbody_tr]:border-white/5 [&_tbody_tr:hover]:bg-white/[0.05] [&_tbody_tr]:text-slate-200 [&_.border-base-200]:!border-white/10 [&_.border-base-300]:!border-white/10 [&_.card-title]:!text-white [&_p]:!text-slate-300 [&_.select]:bg-[#120824] [&_.select]:border-white/15 [&_.select]:text-slate-200 [&_.select]:focus:border-amber-400 [&_.join-item.btn-outline]:bg-white/5 [&_.join-item.btn-outline]:border-white/15 [&_.join-item.btn-outline]:text-slate-200 [&_.join-item.btn-outline:hover]:bg-white/10 [&_.join-item.btn-primary]:bg-amber-400 [&_.join-item.btn-primary]:text-slate-950 [&_.join-item.btn-primary]:border-amber-400 [&_strong]:text-amber-400 [&_.btn-square.btn-ghost]:border-white/15 [&_.btn-square.btn-ghost]:bg-white/5 [&_.btn-square.btn-ghost]:text-amber-400 [&_.badge-primary]:bg-amber-400 [&_.badge-primary]:text-slate-950 [&_.badge-primary]:border-none">
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />

        {/* Ambient background glow orbs */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-amber-500/15 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 right-1/4 w-56 h-56 bg-gradient-to-tl from-indigo-600/20 via-purple-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* High-tech dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10">
          <AZTable
            title="Verified Merchant Directory"
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
            onSearchChange={(val) => {
              setSearchTerm(val);
              setPage(1);
            }}
            searchPlaceholder="Search vendors by store name, email, phone, location..."
            emptyTitle="No Vendors Found"
            emptyMessage="No merchant storefronts match your active filters or search term."
            emptyIcon={<Store className="w-6 h-6 text-amber-400" />}
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
