"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
  ShieldAlert,
} from "lucide-react";
import {
  useAllAdminsQuery,
  useDeleteAdminMutation,
} from "@/redux/features/admin/adminApi";
import { TAdmin } from "@/types/admin";
import { TColumn } from "@/src/types/table";
import AZTable from "../../../shared/AZTable";
import { TABLE_CARD_CN } from "@/src/lib/tableStyles";
import AdminsFilterBar, { AdminsFilterState } from "./AdminsFilterBar";
import AdminDetailsModal from "./AdminDetailsModal";
import UpdateAdminModal from "./UpdateAdminModal";
import CreateAdminModal from "./CreateAdminModal";
import { toast } from "react-toastify";
import { useDebounce } from "@/src/components/utilities/Debaounce";

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

const LIMIT = 10;

const AdminsData = ({
  registerExportHandler,
  registerCreateHandler,
}: AdminsDataProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL-driven query state
  const page = Number(searchParams.get("page")) || 1;
  const statusParam = searchParams.get("status") || "";
  const roleParam = searchParams.get("role") || "";
  const sortParam = searchParams.get("sort") || "";
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
  const [selectedViewAdmin, setSelectedViewAdmin] = useState<TAdmin | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedEditAdmin, setSelectedEditAdmin] = useState<TAdmin | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
  } = useAllAdminsQuery({
    search: urlSearch || undefined,
    page: String(page),
    limit: String(LIMIT),
    role: roleParam || undefined,
    status: statusParam || undefined,
    sort: apiSort,
  });

  const [deleteAdmin] = useDeleteAdminMutation();

  const admins: TAdmin[] = responseData?.data || [];
  const meta = responseData?.meta;

  // Expose create modal handler to parent
  useEffect(() => {
    registerCreateHandler?.(() => setIsCreateModalOpen(true));
  }, [registerCreateHandler]);

  // CSV Export logic
  const handleExportCsv = useCallback(() => {
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
  }, [admins]);

  useEffect(() => {
    registerExportHandler?.(handleExportCsv);
  }, [registerExportHandler, handleExportCsv]);

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

  const handleFilterChange = (newFilters: Partial<AdminsFilterState>) => {
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
            <div className="space-y-0.5">
              <div className="font-extrabold text-xs text-white flex items-center gap-1.5">
                <span>{admin.name}</span>
                {isSuper && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[9px] font-black uppercase tracking-wider">
                    Super
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Mail className="w-3 h-3 text-amber-400/80 shrink-0" />
                <span className="truncate max-w-[150px]">{admin.email}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Authorization & Role",
      accessor: (admin) => {
        const roleStr =
          typeof admin.user === "object"
            ? admin.user?.role || "ADMIN"
            : "ADMIN";
        const isSuper =
          roleStr === "super_admin" || roleStr === "SUPER_ADMIN";

        return (
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg border shadow-sm ${
                isSuper
                  ? "bg-amber-400/10 border-amber-400/20 text-amber-400"
                  : "bg-blue-500/10 border-blue-500/20 text-blue-400"
              }`}
            >
              {isSuper ? (
                <ShieldAlert className="w-4 h-4" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
            </div>
            <div>
              <div className="text-xs font-black text-white">
                {isSuper ? "Super Administrator" : "Platform Admin"}
              </div>
              <div className="text-[10px] text-slate-400">
                {isSuper ? "Full Root Privileges" : "Standard Operations"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Phone Contact",
      accessor: (admin) => (
        <div className="text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
          <Phone className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
          <span>{admin.phone || "No phone linked"}</span>
        </div>
      ),
    },
    {
      header: "Security Status",
      accessor: (admin) => {
        const isSuspended = admin.isDeleted;
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
                Active Staff
              </>
            ) : (
              <>
                <AlertTriangle className="w-3 h-3" />
                Revoked / Off
              </>
            )}
          </span>
        );
      },
    },
    {
      header: "Onboarded Date",
      accessor: (admin) => {
        const dateStr = admin.createdAt
          ? new Date(admin.createdAt).toLocaleDateString("en-US", {
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
      accessor: (admin) => (
        <div className="flex items-center gap-2">
          {/* Quick View Details */}
          <button
            onClick={() => {
              setSelectedViewAdmin(admin);
              setIsViewModalOpen(true);
            }}
            title="View Details"
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-slate-300 hover:text-amber-400 transition-all duration-200"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Quick Edit Admin */}
          <button
            onClick={() => {
              setSelectedEditAdmin(admin);
              setIsEditModalOpen(true);
            }}
            title="Edit Administrator"
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-slate-300 hover:text-amber-400 transition-all duration-200"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {/* Suspend / Delete Admin */}
          <button
            onClick={() => handleDeleteAdmin(admin._id, admin.name)}
            title="Revoke Privileges"
            className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:border-rose-400/50 hover:bg-rose-500/20 text-rose-400 transition-all duration-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const currentFilters: AdminsFilterState = {
    status: statusParam,
    role: roleParam,
    sort: sortParam,
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <AdminsFilterBar
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
            title="Administrator Roster"
            subtitle="Platform security operators, system maintainers, and super administrators."
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
            onSearchChange={(val: string) => setSearchTerm(val)}
            searchPlaceholder="Search admins by name, email, phone..."
            emptyTitle="No Administrators Found"
            emptyMessage="No administrative accounts match your active filters or search query."
            emptyIcon={<UserCheck className="w-6 h-6 text-amber-400" />}
            pagination={{
              page,
              limit: LIMIT,
              total: meta?.total ?? admins.length,
              onPageChange: (p) => updateUrl({ page: p }),
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
