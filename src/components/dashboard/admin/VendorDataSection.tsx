"use client";

import React, { useState } from "react";
import { useAllVendorsQuery } from "@/redux/features/vendor/vendorApi";
import { TVendor } from "@/types/vendor";
import DataTable, { Column } from "@/components/shared/DataTable";
import {
  Store,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Building2
} from "lucide-react";

export const VendorDataSection: React.FC = () => {
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
  } = useAllVendorsQuery({ search: searchTerm, page, limit });

  const vendors: TVendor[] = responseData?.data || [];
  const meta = responseData?.meta;

  const columns: Column<TVendor>[] = [
    {
      header: "Vendor Name",
      accessor: (vendor) => (
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black overflow-hidden">
              {vendor.logo ? (
                <img
                  src={vendor.logo}
                  alt={vendor.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span>{vendor.name ? vendor.name.substring(0, 2).toUpperCase() : "VN"}</span>
              )}
            </div>
          </div>
          <div>
            <div className="font-extrabold text-xs text-base-content">
              {vendor.name}
            </div>
            <div className="text-[10px] text-base-content/60 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-success shrink-0" />
              <span>Registered Merchant</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Email",
      accessor: (vendor) => (
        <span className="font-mono text-base-content/80">{vendor.email || "N/A"}</span>
      ),
    },
    {
      header: "Phone",
      accessor: (vendor) => (
        <span className="font-mono text-base-content/80">{vendor.phone || "N/A"}</span>
      ),
    },
    {
      header: "Status",
      accessor: (vendor) =>
        vendor.isDeleted ? (
          <span className="badge badge-error badge-sm font-bold">Inactive</span>
        ) : (
          <span className="badge badge-success badge-sm font-bold gap-1">
            <CheckCircle2 className="w-3 h-3" /> Active
          </span>
        ),
    },
    {
      header: "Created At",
      accessor: (vendor) => {
        const dateStr = vendor.createdAt
          ? new Date(vendor.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A";
        return <span className="text-base-content/70">{dateStr}</span>;
      },
    },
    {
      header: "Actions",
      align: "right",
      accessor: () => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            className="btn btn-ghost btn-xs font-bold text-primary gap-1"
          >
            <span>Details</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      title="Vendor Directory"
      subtitle="Verified merchants, store profile records, and registered contact information."
      badgeText={meta?.total || vendors.length}
      icon={<Store className="w-5 h-5 text-primary" />}
      data={vendors}
      columns={columns}
      keyExtractor={(v) => v._id}
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
      searchPlaceholder="Search vendors..."
      emptyTitle="No Vendors Found"
      emptyMessage="There are currently no registered vendor accounts in the system."
      emptyIcon={<Building2 className="w-6 h-6" />}
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
  );
};

export default VendorDataSection;
