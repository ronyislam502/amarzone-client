"use client";

import React, { useState } from "react";
import {
  useAllCategoriesQuery,
} from "@/redux/features/category/categoryApi";
import DataTable, { Column } from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import {
  FolderTree,
  CheckCircle2,
  PlusCircle,
  Layers,
  Calendar,
  Edit2
} from "lucide-react";

import CreateCategoryForm from "./CreateCategoryForm";

export const CategoryDataSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Queries & Mutations
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAllCategoriesQuery({ search: searchTerm, page: String(page), limit: String(limit) });

  const categories: any[] = responseData?.data || [];
  const meta = responseData?.meta;

  // Reusable Column Definitions
  const columns: Column<any>[] = [
    {
      header: "Category Name",
      accessor: (cat) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <FolderTree className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-xs text-base-content">
              {cat.name}
            </div>
            <div className="text-[10px] text-base-content/60 flex items-center gap-1">
              <Layers className="w-3 h-3 text-info shrink-0" />
              <span>Department Category</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Department",
      accessor: (cat) => {
        const deptName =
          typeof cat.department === "object"
            ? cat.department?.name
            : cat.department || "General";

        return (
          <span className="badge badge-neutral badge-sm font-bold gap-1">
            {deptName}
          </span>
        );
      },
    },
    {
      header: "Status",
      accessor: (cat) =>
        cat.isDeleted ? (
          <span className="badge badge-error badge-sm font-bold">Inactive</span>
        ) : (
          <span className="badge badge-success badge-sm font-bold gap-1">
            <CheckCircle2 className="w-3 h-3" /> Active
          </span>
        ),
    },
    {
      header: "Created At",
      accessor: (cat) => {
        const dateStr = cat.createdAt
          ? new Date(cat.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A";

        return (
          <div className="flex items-center gap-1.5 text-base-content/70">
            <Calendar className="w-3.5 h-3.5 text-base-content/40" />
            <span>{dateStr}</span>
          </div>
        );
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
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        title="Category Catalog"
        subtitle="Organize product taxonomies, department mappings, and catalog structure."
        badgeText={meta?.total || categories.length}
        icon={<FolderTree className="w-5 h-5 text-primary" />}
        data={categories}
        columns={columns}
        keyExtractor={(cat) => cat._id}
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
        searchPlaceholder="Search categories..."
        headerActions={
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary btn-sm gap-2 font-bold shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        }
        emptyTitle="No Categories Found"
        emptyMessage="There are currently no product categories created in the system."
        emptyIcon={<FolderTree className="w-6 h-6" />}
        emptyAction={
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn btn-xs btn-primary font-bold mt-2 gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Create First Category
          </button>
        }
        pagination={{
          page,
          limit,
          total: meta?.total ?? categories.length,
          onPageChange: (p) => setPage(p),
          onLimitChange: (l) => {
            setLimit(l);
            setPage(1);
          },
        }}
      />

      {/* REUSABLE DAISYUI CREATE CATEGORY MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
      >
        <CreateCategoryForm
          onSuccess={() => {
            setIsModalOpen(false);
            refetch();
          }}
        />
      </Modal>
    </>
  );
};

export default CategoryDataSection;
