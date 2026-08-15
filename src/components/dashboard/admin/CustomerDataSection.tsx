"use client";

import React, { useState } from "react";
import { useAllCustomersQuery, useDeleteCustomerMutation } from "@/redux/features/customer/customerApi";
import { TCustomer } from "@/types/user";
import DataTable, { Column } from "@/components/shared/DataTable";
import { toast } from "react-toastify";
import {
  Users,
  CheckCircle2,
  Trash2,
  UserCheck,
  MapPin,
  PhoneCall,
  Mail,
  Lock,
  User
} from "lucide-react";

export const CustomerDataSection: React.FC = () => {
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
  } = useAllCustomersQuery({ search: searchTerm, page, limit });

  const [deleteCustomer] = useDeleteCustomerMutation();

  const customers: TCustomer[] = responseData?.data || [];
  const meta = responseData?.meta;

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to deactivate customer account for ${name}?`)) {
      try {
        const res = await deleteCustomer(id).unwrap();
        toast.success(res?.message || "Customer account status updated successfully");
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete customer account");
      }
    }
  };

  const columns: Column<TCustomer>[] = [
    {
      header: "Customer Profile",
      accessor: (customer) => (
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 h-10 rounded-xl bg-info/10 border border-info/20 flex items-center justify-center text-info font-black overflow-hidden shadow-sm">
              {customer.avatar ? (
                <img
                  src={customer.avatar}
                  alt={customer.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span>{customer.name ? customer.name.substring(0, 2).toUpperCase() : "CU"}</span>
              )}
            </div>
          </div>
          <div>
            <div className="font-extrabold text-xs text-base-content">
              {customer.name}
            </div>
            <div className="text-[10px] text-base-content/60 flex items-center gap-1">
              <Mail className="w-3 h-3 text-base-content/40 shrink-0" />
              <span>{customer.email || "No email"}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Phone Number",
      accessor: (customer) => (
        <div className="flex items-center gap-1 text-base-content/80 font-mono text-[11px]">
          <PhoneCall className="w-3 h-3 text-base-content/40" />
          <span>{customer.phone || "N/A"}</span>
        </div>
      ),
    },
    {
      header: "Primary Location",
      accessor: (customer) => {
        const addr = customer.address;
        if (!addr || (!addr.country && !addr.street && !addr.state && !addr.postalCode)) {
          return <span className="text-base-content/50 italic text-[11px]">Not provided</span>;
        }
        const locationParts = [addr.street, addr.state, addr.country].filter(Boolean);
        return (
          <div className="flex items-center gap-1 text-base-content/80 text-[11px]">
            <MapPin className="w-3 h-3 text-primary shrink-0" />
            <span className="truncate max-w-[180px]">{locationParts.join(", ")}</span>
          </div>
        );
      },
    },
    {
      header: "Account Status",
      accessor: (customer) =>
        customer.isDeleted ? (
          <span className="badge badge-error badge-sm font-bold gap-1">
            <Lock className="w-3 h-3" /> Inactive
          </span>
        ) : (
          <span className="badge badge-success badge-sm font-bold gap-1">
            <CheckCircle2 className="w-3 h-3" /> Active Buyer
          </span>
        ),
    },
    {
      header: "Joined Date",
      accessor: (customer) => {
        const dateStr = customer.createdAt
          ? new Date(customer.createdAt).toLocaleDateString("en-US", {
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
      accessor: (customer) => (
        <div className="flex items-center justify-end gap-2">
          {!customer.isDeleted && (
            <button
              type="button"
              onClick={() => handleDelete(customer._id, customer.name)}
              className="btn btn-ghost btn-xs text-error hover:bg-error/10 font-bold gap-1"
              title="Deactivate Customer Account"
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
      title="Customer & Buyer Directory"
      subtitle="Registered platform buyers, order accounts, and verified user contacts."
      badgeText={meta?.total ?? customers.length}
      icon={<Users className="w-5 h-5 text-info" />}
      data={customers}
      columns={columns}
      keyExtractor={(c) => c._id}
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
      searchPlaceholder="Search customers by name/email..."
      emptyTitle="No Customers Found"
      emptyMessage="There are currently no registered customer accounts in the database."
      emptyIcon={<User className="w-6 h-6 text-info" />}
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
  );
};

export default CustomerDataSection;
