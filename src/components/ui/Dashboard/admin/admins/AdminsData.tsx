"use client";

import { useState, useMemo, useEffect } from "react";
import {
  UserCheck,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  Calendar,
  Shield,
  ShieldCheck,
} from "lucide-react";
import {
  useAllAdminsQuery,
  useDeleteAdminMutation,
} from "@/redux/features/admin/adminApi";
import { TAdmin } from "@/types/admin";
import { TColumn } from "@/src/types/table";
import AZTable from "../../../shared/AZTable";
import AdminsFilterBar, { AdminsFilterState } from "./AdminsFilterBar";
import AdminDetailsModal from "./AdminDetailsModal";
import UpdateAdminModal from "./UpdateAdminModal";
import CreateAdminModal from "./CreateAdminModal";
import { toast } from "react-toastify";

export interface AdminsStatsData {
  totalAdmins: number;
  activeAdmins: number;
  superAdmins: number;
}

interface AdminsDataProps {
  onStatsChange?: (stats: AdminsStatsData) => void;
  registerExportHandler?: (handler: () => void) => void;
  registerCreateHandler?: (handler: () => void) => void;
}

const initialFilters: AdminsFilterState = {
  status: "",
  role: "",
  sort: "",
};

const AdminsData = ({
  onStatsChange,
  registerExportHandler,
  registerCreateHandler,
}: AdminsDataProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<AdminsFilterState>(initialFilters);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modal states
  const [selectedViewAdmin, setSelectedViewAdmin] = useState<TAdmin | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedEditAdmin, setSelectedEditAdmin] = useState<TAdmin | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Queries & Mutations
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAllAdminsQuery({
    search: searchTerm.trim() || undefined,
    page,
    limit,
  });

  const [deleteAdmin] = useDeleteAdminMutation();

  const rawAdmins: TAdmin[] = responseData?.data || [];
  const meta = responseData?.meta;

  // Filter and sort locally
  const admins = useMemo(() => {
    let result = [...rawAdmins];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (a) =>
          a.name?.toLowerCase().includes(q) ||
          a.email?.toLowerCase().includes(q) ||
          a.phone?.toLowerCase().includes(q)
      );
    }

    if (filters.status === "active") {
      result = result.filter((a) => !a.isDeleted);
    } else if (filters.status === "inactive") {
      result = result.filter((a) => a.isDeleted);
    }

    if (filters.role) {
      result = result.filter((a) => {
        const userRole =
          typeof a.user === "object" ? a.user?.role?.toLowerCase() : "";
        return userRole === filters.role.toLowerCase();
      });
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
  }, [rawAdmins, searchTerm, filters]);

  // Compute stats to emit upward
  useEffect(() => {
    if (rawAdmins && onStatsChange) {
      const activeCount = rawAdmins.filter((a) => !a.isDeleted).length;
      const superAdminCount = rawAdmins.filter((a) => {
        const role =
          typeof a.user === "object" ? a.user?.role?.toLowerCase() : "";
        return role === "super_admin";
      }).length;

      onStatsChange({
        totalAdmins: meta?.total ?? rawAdmins.length,
        activeAdmins: activeCount,
        superAdmins: superAdminCount,
      });
    }
  }, [rawAdmins, meta?.total, onStatsChange]);

  // Expose create modal handler to parent
  useEffect(() => {
    if (registerCreateHandler) {
      registerCreateHandler(() => setIsCreateModalOpen(true));
    }
  }, [registerCreateHandler]);

  // CSV Export logic
  const handleExportCsv = () => {
    if (!admins || admins.length === 0) return;

    const headers = [
      "Admin ID",
      "Full Name",
      "Email",
      "Phone",
      "Role",
      "Status",
      "Onboarded Date",
    ];

    const rows = admins.map((a) => {
      const role =
        typeof a.user === "object" ? a.user?.role || "ADMIN" : "ADMIN";
      return [
        `"${a._id}"`,
        `"${(a.name || "").replace(/"/g, '""')}"`,
        `"${(a.email || "").replace(/"/g, '""')}"`,
        `"${a.phone || ""}"`,
        `"${role}"`,
        a.isDeleted ? "SUSPENDED" : "ACTIVE",
        a.createdAt ? new Date(a.createdAt).toISOString().slice(0, 10) : "",
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `admins_directory_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (registerExportHandler) {
      registerExportHandler(handleExportCsv);
    }
  }, [registerExportHandler, admins]);

  const handleDeleteAdmin = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to suspend administrator account "${name}"?`)) {
      return;
    }

    try {
      const res = await deleteAdmin(id).unwrap();
      toast.success(res?.message || "Administrator account suspended successfully");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to suspend administrator account");
    }
  };

  // Table Columns Definition
  const columns: TColumn<TAdmin>[] = [
    {
      header: "Admin Profile",
      accessor: (admin) => {
        const role =
          typeof admin.user === "object" ? admin.user?.role : undefined;
        const isSuper = role === "super_admin" || role === "SUPER_ADMIN";

        return (
          <div className="flex items-center gap-3 max-w-sm">
            <div className="w-12 h-12 rounded-xl bg-base-200 border border-base-300 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
              {admin.avatar ? (
                <img
                  src={admin.avatar}
                  alt={admin.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm">
                  {admin.name?.charAt(0)?.toUpperCase() || "A"}
                </div>
              )}
            </div>
            <div className="min-w-0 space-y-0.5">
              <div
                className="font-extrabold text-xs text-base-content line-clamp-1 hover:text-secondary transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedViewAdmin(admin);
                  setIsViewModalOpen(true);
                }}
              >
                {admin.name}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-base-content/60">
                {isSuper ? (
                  <span className="badge badge-primary badge-xs font-bold text-white px-1.5 py-0.5">
                    Super Admin
                  </span>
                ) : (
                  <span className="badge badge-secondary badge-xs font-bold text-white px-1.5 py-0.5">
                    Admin
                  </span>
                )}
                <span className="truncate max-w-[140px]">{admin.email}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Contact Channels",
      accessor: (admin) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-[11px] font-bold text-base-content/90">
            <Phone className="w-3 h-3 text-secondary shrink-0" />
            <span className="truncate">{admin.phone || "No phone listed"}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-base-content/60">
            <Mail className="w-3 h-3 text-base-content/40 shrink-0" />
            <a
              href={`mailto:${admin.email}`}
              className="text-secondary hover:underline truncate max-w-[140px]"
            >
              {admin.email}
            </a>
          </div>
        </div>
      ),
    },
    {
      header: "Role & Privileges",
      accessor: (admin) => {
        const role =
          typeof admin.user === "object" ? admin.user?.role : undefined;
        const isSuper = role === "super_admin" || role === "SUPER_ADMIN";

        return (
          <div className="space-y-0.5 text-xs">
            <div className="flex items-center gap-1 font-bold">
              {isSuper ? (
                <Shield className="w-3.5 h-3.5 text-primary" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
              )}
              <span className={isSuper ? "text-primary font-black" : "text-base-content/90"}>
                {isSuper ? "Super Administrator" : "Platform Administrator"}
              </span>
            </div>
            <div className="text-[10px] text-base-content/60">
              {isSuper ? "Full Root Access" : "Standard Operations Access"}
            </div>
          </div>
        );
      },
    },
    {
      header: "Status",
      accessor: (admin) =>
        !admin.isDeleted ? (
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
      accessor: (admin) => (
        <div className="flex items-center gap-1 text-[11px] text-base-content/70">
          <Calendar className="w-3 h-3 text-base-content/40" />
          <span>
            {admin.createdAt
              ? new Date(admin.createdAt).toLocaleDateString("en-US", {
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
      accessor: (admin) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            title="View Profile Details"
            onClick={() => {
              setSelectedViewAdmin(admin);
              setIsViewModalOpen(true);
            }}
            className="btn btn-ghost btn-xs font-bold text-secondary gap-1 hover:bg-secondary/10 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </button>

          <button
            type="button"
            title="Edit Profile"
            onClick={() => {
              setSelectedEditAdmin(admin);
              setIsEditModalOpen(true);
            }}
            className="btn btn-ghost btn-xs font-bold text-primary gap-1 hover:bg-primary/10 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            title="Suspend Administrator"
            onClick={() => handleDeleteAdmin(admin._id, admin.name)}
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
      <AdminsFilterBar
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

      {/* Main Admins AZTable */}
      <AZTable
        title="Administrative Staff Directory"
        subtitle="Operational personnel, platform authorities, and verified administrative user credentials."
        badgeText={meta?.total ?? admins.length}
        icon={<UserCheck className="w-5 h-5 text-secondary" />}
        data={admins}
        columns={columns}
        keyExtractor={(admin) => admin._id}
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
        searchPlaceholder="Search admins by name, email, phone..."
        emptyTitle="No Administrators Found"
        emptyMessage="No administrative accounts match your active filters or search query."
        emptyIcon={<UserCheck className="w-6 h-6" />}
        pagination={{
          page,
          limit,
          total: meta?.total ?? admins.length,
          onPageChange: (p) => setPage(p),
          onLimitChange: (l) => {
            setLimit(l);
            setPage(1);
          },
        }}
      />

      {/* Admin Details Modal */}
      <AdminDetailsModal
        admin={selectedViewAdmin}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedViewAdmin(null);
        }}
      />

      {/* Update Admin Modal */}
      <UpdateAdminModal
        admin={selectedEditAdmin}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEditAdmin(null);
        }}
        onSuccess={() => {
          refetch();
        }}
      />

      {/* Create Admin Modal */}
      <CreateAdminModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
};

export default AdminsData;
