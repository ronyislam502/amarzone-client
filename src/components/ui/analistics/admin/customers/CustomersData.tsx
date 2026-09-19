"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Users,
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
  useAllCustomersQuery,
  useDeleteCustomerMutation,
} from "@/redux/features/customer/customerApi";
import { TCustomer } from "@/types/customer";
import { TColumn } from "@/src/types/table";
import AZTable from "../../../shared/AZTable";
import CustomersFilterBar, { CustomersFilterState } from "./CustomersFilterBar";
import CustomerDetailsModal from "./CustomerDetailsModal";
import UpdateCustomerModal from "./UpdateCustomerModal";
import { toast } from "react-toastify";
import { useDebounce } from "@/src/components/utilities/Debaounce";

export interface CustomersStatsData {
  totalCustomers: number;
  activeCustomers: number;
  verifiedProfiles: number;
}

interface CustomersDataProps {
  onStatsChange?: (stats: CustomersStatsData) => void;
  registerExportHandler?: (handler: () => void) => void;
}

const LIMIT = 10;

const CustomersData = ({
  registerExportHandler,
}: CustomersDataProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL-driven query state
  const page = Number(searchParams.get("page")) || 1;
  const statusParam = searchParams.get("status") || "";
  const sortParam = searchParams.get("sort") || "";
  const countryParam = searchParams.get("country") || "";
  const urlSearch = searchParams.get("search") || "";

  // Local search input state before debounce
  const [search, setSearch] = useState(urlSearch);
  const debouncedSearch = useDebounce(search, 500);

  // Sync debounced search with URL
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
  const [selectedViewCustomer, setSelectedViewCustomer] = useState<TCustomer | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedEditCustomer, setSelectedEditCustomer] = useState<TCustomer | null>(null);
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
  } = useAllCustomersQuery({
    search: urlSearch || undefined,
    page: String(page),
    limit: String(LIMIT),
    status: statusParam || undefined,
    sort: apiSort,
  });

  const [deleteCustomer] = useDeleteCustomerMutation();

  const customers: TCustomer[] = responseData?.data || [];
  const meta = responseData?.meta;

  // CSV Export logic
  const handleExportCsv = useCallback(() => {
    if (!customers || customers.length === 0) return;

    const headers = [
      "Customer ID",
      "Customer Name",
      "Email",
      "Phone",
      "Street",
      "State",
      "Country",
      "Postal Code",
      "Status",
      "Registered Date",
    ];

    const rows = customers.map((c) => [
      `"${c._id}"`,
      `"${(c.name || "").replace(/"/g, '""')}"`,
      `"${(c.email || "").replace(/"/g, '""')}"`,
      `"${c.phone || ""}"`,
      `"${(c.address?.street || "").replace(/"/g, '""')}"`,
      `"${c.address?.state || ""}"`,
      `"${c.address?.country || ""}"`,
      `"${c.address?.postalCode || ""}"`,
      c.isDeleted ? "SUSPENDED" : "ACTIVE",
      c.createdAt ? new Date(c.createdAt).toISOString().slice(0, 10) : "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `customers_directory_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [customers]);

  useEffect(() => {
    registerExportHandler?.(handleExportCsv);
  }, [registerExportHandler, handleExportCsv]);

  const handleDeleteCustomer = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to suspend customer account "${name}"?`)) {
      return;
    }

    try {
      const res = await deleteCustomer(id).unwrap();
      if (res.success) {
        toast.success(`Customer "${name}" suspended successfully`);
        refetch();
      } else {
        toast.error(res.message || "Failed to suspend customer");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to suspend customer account");
    }
  };

  const handleFilterChange = (newFilters: Partial<CustomersFilterState>) => {
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
  const columns: TColumn<TCustomer>[] = [
    {
      header: "Customer",
      accessor: (customer) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0 shadow-sm font-black text-sm">
            {customer.name?.charAt(0).toUpperCase() || "C"}
          </div>
          <div>
            <div className="font-extrabold text-xs text-white">
              {customer.name}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
              <Mail className="w-3 h-3 text-amber-400/80 shrink-0" />
              <span>{customer.email}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Contact & Phone",
      accessor: (customer) => (
        <div className="text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
          <Phone className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
          <span>{customer.phone || "No phone provided"}</span>
        </div>
      ),
    },
    {
      header: "Shipping Destination",
      accessor: (customer) => {
        const addr = customer.address;
        if (!addr || (!addr.state && !addr.country && !addr.street)) {
          return (
            <span className="text-[11px] text-slate-500 italic">
              Address not set
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
      header: "Status",
      accessor: (customer) => {
        const isSuspended = customer.isDeleted;
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
                Active
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
      header: "Joined Date",
      accessor: (customer) => {
        const dateStr = customer.createdAt
          ? new Date(customer.createdAt).toLocaleDateString("en-US", {
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
      accessor: (customer) => (
        <div className="flex items-center gap-2">
          {/* Quick View */}
          <button
            onClick={() => {
              setSelectedViewCustomer(customer);
              setIsViewModalOpen(true);
            }}
            title="View Details"
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-slate-300 hover:text-amber-400 transition-all duration-200"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Quick Edit */}
          <button
            onClick={() => {
              setSelectedEditCustomer(customer);
              setIsEditModalOpen(true);
            }}
            title="Edit Customer"
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-slate-300 hover:text-amber-400 transition-all duration-200"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {/* Delete / Suspend */}
          <button
            onClick={() => handleDeleteCustomer(customer._id, customer.name)}
            title="Suspend Account"
            className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:border-rose-400/50 hover:bg-rose-500/20 text-rose-400 transition-all duration-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const currentFilters: CustomersFilterState = {
    status: statusParam,
    country: countryParam,
    sort: sortParam,
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <CustomersFilterBar
        filters={currentFilters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        searchTerm={search}
        onSearchChange={(val) => setSearch(val)}
      />

      {/* Main Table Card */}
      <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-4 sm:p-6">
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />

        {/* Ambient background glow orbs */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-amber-500/15 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 right-1/4 w-56 h-56 bg-gradient-to-tl from-indigo-600/20 via-purple-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* High-tech dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10">
          <AZTable
            title="Registered Customer Directory"
            subtitle="Consumer accounts, verified default shipping destinations, and engagement standing."
            badgeText={meta?.total ?? customers.length}
            icon={<Users className="w-5 h-5 text-amber-400" />}
            className="!bg-transparent !shadow-none !border-none text-slate-100"
            data={customers}
            columns={columns}
            keyExtractor={(customer) => customer._id}
            isLoading={isLoading}
            isError={isError}
            errorMessage={(error as any)?.data?.message}
            onRetry={refetch}
            onRefresh={refetch}
            isRefreshing={isFetching}
            searchValue={search}
            onSearchChange={(val) => setSearch(val)}
            searchPlaceholder="Search customers by name, email, phone, country..."
            emptyTitle="No Customers Found"
            emptyMessage="No customer accounts match your active filters or search query."
            emptyIcon={<Users className="w-6 h-6 text-amber-400" />}
            pagination={{
              page,
              limit: LIMIT,
              total: meta?.total ?? customers.length,
              onPageChange: (p) => updateUrl({ page: p }),
            }}
          />
        </div>
      </div>

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        customer={selectedViewCustomer}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedViewCustomer(null);
        }}
      />

      {/* Update Customer Modal */}
      <UpdateCustomerModal
        customer={selectedEditCustomer}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEditCustomer(null);
        }}
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
};

export default CustomersData;
