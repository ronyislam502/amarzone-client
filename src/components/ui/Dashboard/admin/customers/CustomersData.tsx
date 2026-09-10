"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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

const initialFilters: CustomersFilterState = {
  status: "",
  country: "",
  sort: "",
};

const CustomersData = ({
  onStatsChange,
  registerExportHandler,
}: CustomersDataProps) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [filters, setFilters] = useState<CustomersFilterState>(initialFilters);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modal states
  const [selectedViewCustomer, setSelectedViewCustomer] = useState<TCustomer | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedEditCustomer, setSelectedEditCustomer] = useState<TCustomer | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Queries & Mutations
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAllCustomersQuery({
    search: debouncedSearch.trim() || undefined,
    page,
    limit,
  });

  const [deleteCustomer] = useDeleteCustomerMutation();

  const rawCustomers: TCustomer[] = responseData?.data || [];
  const meta = responseData?.meta;

  // Filter and sort locally
  const customers = useMemo(() => {
    let result = [...rawCustomers];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.phone?.toLowerCase().includes(q) ||
          c.address?.country?.toLowerCase().includes(q)
      );
    }

    if (filters.status === "active") {
      result = result.filter((c) => !c.isDeleted);
    } else if (filters.status === "inactive") {
      result = result.filter((c) => c.isDeleted);
    }

    if (filters.country) {
      result = result.filter(
        (c) =>
          c.address?.country?.toLowerCase() === filters.country.toLowerCase()
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
  }, [rawCustomers, debouncedSearch, filters]);

  const onStatsChangeRef = useRef(onStatsChange);
  useEffect(() => {
    onStatsChangeRef.current = onStatsChange;
  }, [onStatsChange]);

  // Compute stats to emit upward
  useEffect(() => {
    if (!responseData?.data || !onStatsChangeRef.current) return;
    const items = (responseData.data as TCustomer[]) || [];
    const activeCount = items.filter((c) => !c.isDeleted).length;
    const verifiedCount = items.filter(
      (c) => c.phone && c.address?.street
    ).length;

    onStatsChangeRef.current({
      totalCustomers: meta?.total ?? items.length,
      activeCustomers: activeCount,
      verifiedProfiles: verifiedCount,
    });
  }, [responseData?.data, meta?.total]);

  // CSV Export logic
  const handleExportCsv = () => {
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
  };

  const handleExportCsvRef = useRef(handleExportCsv);
  useEffect(() => {
    handleExportCsvRef.current = handleExportCsv;
  }, [customers]);

  useEffect(() => {
    if (registerExportHandler) {
      registerExportHandler(() => handleExportCsvRef.current());
    }
  }, [registerExportHandler]);

  const handleDeleteCustomer = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to suspend customer account "${name}"?`)) {
      return;
    }

    try {
      const res = await deleteCustomer(id).unwrap();
      toast.success(res?.message || "Customer account suspended successfully");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to suspend customer account");
    }
  };

  // Table Columns Definition
  const columns: TColumn<TCustomer>[] = [
    {
      header: "Customer Profile",
      accessor: (customer) => (
        <div className="flex items-center gap-3 max-w-sm">
          <div className="w-12 h-12 rounded-xl bg-[#120824] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
            {customer.avatar ? (
              <img
                src={customer.avatar}
                alt={customer.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                {customer.name?.charAt(0)?.toUpperCase() || "C"}
              </div>
            )}
          </div>
          <div className="min-w-0 space-y-0.5">
            <div
              className="font-extrabold text-xs text-white line-clamp-1 hover:text-amber-400 transition-colors cursor-pointer"
              onClick={() => {
                setSelectedViewCustomer(customer);
                setIsViewModalOpen(true);
              }}
            >
              {customer.name}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="badge badge-warning badge-xs font-black text-slate-950 px-1.5 py-0.5">
                Shopper
              </span>
              <span className="truncate max-w-[140px]">{customer.email}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Contact Details",
      accessor: (customer) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-200">
            <Phone className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">{customer.phone || "No phone listed"}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
            <a
              href={`mailto:${customer.email}`}
              className="text-slate-300 hover:text-amber-400 hover:underline truncate max-w-[140px]"
            >
              {customer.email}
            </a>
          </div>
        </div>
      ),
    },
    {
      header: "Default Shipping Address",
      accessor: (customer) => (
        <div className="space-y-0.5 text-xs max-w-[180px]">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-200 truncate">
            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">
              {customer.address?.street || "Street Unassigned"}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 pl-4 truncate">
            {[customer.address?.state, customer.address?.country]
              .filter(Boolean)
              .join(", ") || "Location unassigned"}
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (customer) =>
        !customer.isDeleted ? (
          <span className="badge badge-sm font-bold gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Active
          </span>
        ) : (
          <span className="badge badge-sm font-bold gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3 h-3" /> Suspended
          </span>
        ),
    },
    {
      header: "Registered",
      accessor: (customer) => (
        <div className="flex items-center gap-1 text-[11px] text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {customer.createdAt
              ? new Date(customer.createdAt).toLocaleDateString("en-US", {
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
      accessor: (customer) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            title="View Profile Details"
            onClick={() => {
              setSelectedViewCustomer(customer);
              setIsViewModalOpen(true);
            }}
            className="btn btn-ghost btn-xs font-bold text-sky-400 gap-1 hover:bg-sky-500/10 border border-sky-500/20 hover:border-sky-500/40 rounded-lg cursor-pointer transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </button>

          <button
            type="button"
            title="Edit Customer Profile"
            onClick={() => {
              setSelectedEditCustomer(customer);
              setIsEditModalOpen(true);
            }}
            className="btn btn-ghost btn-xs font-bold text-amber-400 gap-1 hover:bg-amber-400/10 border border-amber-400/20 hover:border-amber-400/40 rounded-lg cursor-pointer transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            title="Suspend / Delete Account"
            onClick={() => handleDeleteCustomer(customer._id, customer.name)}
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
      {/* Search & Filter Toolbar */}
      <CustomersFilterBar
        searchTerm={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters((prev) => ({ ...prev, ...newFilters }));
          setPage(1);
        }}
        onReset={() => {
          setFilters(initialFilters);
          setSearch("");
          setPage(1);
        }}
      />

      {/* Main Customers AZTable Container */}
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
            onSearchChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            searchPlaceholder="Search customers by name, email, phone, country..."
            emptyTitle="No Customers Found"
            emptyMessage="No customer accounts match your active filters or search query."
            emptyIcon={<Users className="w-6 h-6 text-amber-400" />}
            pagination={{
              page,
              limit,
              total: meta?.total ?? customers.length,
              onPageChange: (p) => setPage(p),
              onLimitChange: (l) => {
                setLimit(l);
                setPage(1);
              },
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
