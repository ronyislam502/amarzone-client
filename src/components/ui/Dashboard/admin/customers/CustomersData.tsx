"use client";

import { useState, useMemo, useEffect } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
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
    search: searchTerm.trim() || undefined,
    page,
    limit,
  });

  const [deleteCustomer] = useDeleteCustomerMutation();

  const rawCustomers: TCustomer[] = responseData?.data || [];
  const meta = responseData?.meta;

  // Filter and sort locally
  const customers = useMemo(() => {
    let result = [...rawCustomers];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
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
  }, [rawCustomers, searchTerm, filters]);

  // Compute stats to emit upward
  useEffect(() => {
    if (rawCustomers && onStatsChange) {
      const activeCount = rawCustomers.filter((c) => !c.isDeleted).length;
      const verifiedCount = rawCustomers.filter(
        (c) => c.phone && c.address?.street
      ).length;

      onStatsChange({
        totalCustomers: meta?.total ?? rawCustomers.length,
        activeCustomers: activeCount,
        verifiedProfiles: verifiedCount,
      });
    }
  }, [rawCustomers, meta?.total, onStatsChange]);

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

  useEffect(() => {
    if (registerExportHandler) {
      registerExportHandler(handleExportCsv);
    }
  }, [registerExportHandler, customers]);

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
          <div className="w-12 h-12 rounded-xl bg-base-200 border border-base-300 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
            {customer.avatar ? (
              <img
                src={customer.avatar}
                alt={customer.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-info/10 text-info flex items-center justify-center font-bold text-sm">
                {customer.name?.charAt(0)?.toUpperCase() || "C"}
              </div>
            )}
          </div>
          <div className="min-w-0 space-y-0.5">
            <div
              className="font-extrabold text-xs text-base-content line-clamp-1 hover:text-info transition-colors cursor-pointer"
              onClick={() => {
                setSelectedViewCustomer(customer);
                setIsViewModalOpen(true);
              }}
            >
              {customer.name}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-base-content/60">
              <span className="badge badge-info badge-xs font-bold text-white px-1.5 py-0.5">
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
          <div className="flex items-center gap-1 text-[11px] font-bold text-base-content/90">
            <Phone className="w-3 h-3 text-info shrink-0" />
            <span className="truncate">{customer.phone || "No phone listed"}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-base-content/60">
            <Mail className="w-3 h-3 text-base-content/40 shrink-0" />
            <a
              href={`mailto:${customer.email}`}
              className="text-primary hover:underline truncate max-w-[140px]"
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
          <div className="flex items-center gap-1 text-[11px] font-bold text-base-content/80 truncate">
            <MapPin className="w-3 h-3 text-success shrink-0" />
            <span className="truncate">
              {customer.address?.street || "Street Unassigned"}
            </span>
          </div>
          <div className="text-[10px] text-base-content/60 pl-4 truncate">
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
      header: "Registered",
      accessor: (customer) => (
        <div className="flex items-center gap-1 text-[11px] text-base-content/70">
          <Calendar className="w-3 h-3 text-base-content/40" />
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
            className="btn btn-ghost btn-xs font-bold text-info gap-1 hover:bg-info/10 cursor-pointer"
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
            className="btn btn-ghost btn-xs font-bold text-primary gap-1 hover:bg-primary/10 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            title="Suspend / Delete Account"
            onClick={() => handleDeleteCustomer(customer._id, customer.name)}
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
      {/* Search & Filter Toolbar */}
      <CustomersFilterBar
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

      {/* Main Customers AZTable */}
      <AZTable
        title="Registered Customer Directory"
        subtitle="Consumer accounts, verified default shipping destinations, and engagement standing."
        badgeText={meta?.total ?? customers.length}
        icon={<Users className="w-5 h-5 text-info" />}
        data={customers}
        columns={columns}
        keyExtractor={(customer) => customer._id}
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
        searchPlaceholder="Search customers by name, email, phone, country..."
        emptyTitle="No Customers Found"
        emptyMessage="No customer accounts match your active filters or search query."
        emptyIcon={<Users className="w-6 h-6" />}
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
