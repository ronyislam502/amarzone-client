"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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

  const onStatsChangeRef = useRef(onStatsChange);
  useEffect(() => {
    onStatsChangeRef.current = onStatsChange;
  }, [onStatsChange]);

  // Compute stats to emit upward
  useEffect(() => {
    if (!responseData?.data || !onStatsChangeRef.current) return;
    const items = (responseData.data as TAdmin[]) || [];
    const activeCount = items.filter((a) => !a.isDeleted).length;
    const superAdminCount = items.filter((a) => {
      const role =
        typeof a.user === "object" ? a.user?.role?.toLowerCase() : "";
      return role === "super_admin";
    }).length;

    onStatsChangeRef.current({
      totalAdmins: meta?.total ?? items.length,
      activeAdmins: activeCount,
      superAdmins: superAdminCount,
    });
  }, [responseData?.data, meta?.total]);

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

  const handleExportCsvRef = useRef(handleExportCsv);
  useEffect(() => {
    handleExportCsvRef.current = handleExportCsv;
  }, [admins]);

  useEffect(() => {
    if (registerExportHandler) {
      registerExportHandler(() => handleExportCsvRef.current());
    }
  }, [registerExportHandler]);

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
            <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-white/15 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
              {admin.avatar ? (
                <img
                  src={admin.avatar}
                  alt={admin.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                  {admin.name?.charAt(0)?.toUpperCase() || "A"}
                </div>
              )}
            </div>
            <div className="min-w-0 space-y-0.5">
              <div
                className="font-extrabold text-xs text-white line-clamp-1 hover:text-amber-400 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedViewAdmin(admin);
                  setIsViewModalOpen(true);
                }}
              >
                {admin.name}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                {isSuper ? (
                  <span className="badge badge-warning badge-xs font-black text-slate-950 px-1.5 py-0.5 shadow">
                    Super Admin
                  </span>
                ) : (
                  <span className="badge badge-outline border-amber-400/40 text-amber-400 badge-xs font-bold px-1.5 py-0.5">
                    Admin
                  </span>
                )}
                <span className="truncate max-w-[140px] text-slate-400">{admin.email}</span>
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
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-200">
            <Phone className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">{admin.phone || "No phone listed"}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Mail className="w-3 h-3 text-slate-500 shrink-0" />
            <a
              href={`mailto:${admin.email}`}
              className="text-amber-400/90 hover:underline truncate max-w-[140px]"
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
                <Shield className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span className={isSuper ? "text-amber-400 font-black" : "text-slate-200 font-bold"}>
                {isSuper ? "Super Administrator" : "Platform Administrator"}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
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
      accessor: (admin) => (
        <div className="flex items-center gap-1 text-[11px] text-slate-300">
          <Calendar className="w-3 h-3 text-slate-500" />
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
            className="btn btn-ghost btn-xs font-bold text-amber-400 gap-1 hover:bg-amber-400/10 border border-amber-400/20 hover:border-amber-400/40 rounded-lg cursor-pointer transition-all"
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
            className="btn btn-ghost btn-xs font-bold text-sky-400 gap-1 hover:bg-sky-400/10 border border-sky-400/20 hover:border-sky-400/40 rounded-lg cursor-pointer transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            title="Suspend Administrator"
            onClick={() => handleDeleteAdmin(admin._id, admin.name)}
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

      {/* Main Admins Directory Table Container */}
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
            title="Administrative Staff Directory"
            subtitle="Operational personnel, platform authorities, and verified administrative user credentials."
            badgeText={meta?.total ?? admins.length}
            icon={<UserCheck className="w-5 h-5 text-amber-400" />}
            className="!bg-transparent !shadow-none !border-none text-slate-100"
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
            emptyIcon={<UserCheck className="w-6 h-6 text-amber-400" />}
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
        </div>
      </div>

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
