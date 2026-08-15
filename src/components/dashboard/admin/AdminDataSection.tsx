"use client";

import React, { useState } from "react";
import { useAllAdminsQuery, useDeleteAdminMutation } from "@/redux/features/admin/adminApi";
import { TAdmin } from "@/types/user";
import DataTable, { Column } from "@/components/shared/DataTable";
import { toast } from "react-toastify";
import {
  ShieldCheck,
  CheckCircle2,
  Trash2,
  UserCheck,
  Shield,
  PhoneCall,
  Mail,
  Lock
} from "lucide-react";

export const AdminDataSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAllAdminsQuery({ search: searchTerm, page, limit });

  const [deleteAdmin] = useDeleteAdminMutation();

  const admins: TAdmin[] = responseData?.data || [];
  const meta = responseData?.meta;

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to deactivate administrative access for ${name}?`)) {
      try {
        const res = await deleteAdmin(id).unwrap();
        toast.success(res?.message || "Admin account status updated successfully");
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete admin account");
      }
    }
  };

  const columns: Column<TAdmin>[] = [
    {
      header: "Administrator Profile",
      accessor: (admin) => {
        const roleStr = admin?.user?.role || "ADMIN";
        const isSuperAdmin = roleStr === "SUPER_ADMIN";
        return (
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary font-black overflow-hidden shadow-sm">
                {admin.avatar ? (
                  <img
                    src={admin.avatar}
                    alt={admin.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span>{admin.name ? admin.name.substring(0, 2).toUpperCase() : "AD"}</span>
                )}
              </div>
            </div>
            <div>
              <div className="font-extrabold text-xs text-base-content flex items-center gap-1.5">
                <span>{admin.name}</span>
                {isSuperAdmin && (
                  <ShieldCheck className="w-3.5 h-3.5 text-secondary shrink-0" />
                )}
              </div>
              <div className="text-[10px] text-base-content/60 flex items-center gap-1">
                <Mail className="w-3 h-3 text-base-content/40 shrink-0" />
                <span>{admin.email || "No email"}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Governance Role",
      accessor: (admin) => {
        const role = admin?.user?.role || "ADMIN";
        return role === "SUPER_ADMIN" ? (
          <span className="badge badge-secondary badge-sm font-black gap-1 shadow-sm">
            <ShieldCheck className="w-3 h-3" /> SUPER ADMIN
          </span>
        ) : (
          <span className="badge badge-primary badge-outline badge-sm font-bold gap-1">
            <Shield className="w-3 h-3" /> ADMIN
          </span>
        );
      },
    },
    {
      header: "Contact Phone",
      accessor: (admin) => (
        <div className="flex items-center gap-1 text-base-content/80 font-mono text-[11px]">
          <PhoneCall className="w-3 h-3 text-base-content/40" />
          <span>{admin.phone || "N/A"}</span>
        </div>
      ),
    },
    {
      header: "Account Status",
      accessor: (admin) =>
        admin.isDeleted ? (
          <span className="badge badge-error badge-sm font-bold gap-1">
            <Lock className="w-3 h-3" /> Inactive
          </span>
        ) : (
          <span className="badge badge-success badge-sm font-bold gap-1">
            <CheckCircle2 className="w-3 h-3" /> Active
          </span>
        ),
    },
    {
      header: "Registered Date",
      accessor: (admin) => {
        const dateStr = admin.createdAt
          ? new Date(admin.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A";
        return <span className="text-base-content/70 text-xs font-medium">{dateStr}</span>;
      },
    },
    {
      header: "Actions",
      align: "right",
      accessor: (admin) => (
        <div className="flex items-center justify-end gap-2">
          {!admin.isDeleted && (
            <button
              type="button"
              onClick={() => handleDelete(admin._id, admin.name)}
              className="btn btn-ghost btn-xs text-error hover:bg-error/10 font-bold gap-1"
              title="Deactivate Admin"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Deactivate</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      title="Administrator & Staff Directory"
      subtitle="Authorized system administrators with root access and governance permissions."
      badgeText={meta?.total ?? admins.length}
      icon={<UserCheck className="w-5 h-5 text-secondary" />}
      data={admins}
      columns={columns}
      keyExtractor={(a) => a._id}
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
      searchPlaceholder="Search admins by name/email..."
      emptyTitle="No Administrators Found"
      emptyMessage="There are currently no matching administrator profiles registered."
      emptyIcon={<ShieldCheck className="w-6 h-6 text-secondary" />}
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
  );
};

export default AdminDataSection;
