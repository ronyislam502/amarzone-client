"use client";

import { useState } from "react";
import {
  useAllCategoriesQuery,
} from "@/redux/features/category/categoryApi";
import {
  FolderTree,
  CheckCircle2,
  PlusCircle,
  Layers,
  Calendar,
  Edit2
} from "lucide-react";
import { TColumn } from "@/src/types/table";
import AZTable from "../../../shared/AZTable";
import { TCategory } from "@/src/types/category";
import Modal from "../../../shared/Modal";
import CreateCategoryForm from "./CreateCategory";
import UpdateCategoryForm from "./UpdateCategory";

const CategoriesData: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TCategory | null>(null);

  // Queries & Mutations
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAllCategoriesQuery({ search: searchTerm, page: String(page), limit: String(limit) });

  const categories: TCategory[] = responseData?.data || [];
  const meta = responseData?.meta;

  // Reusable Column Definitions
  const columns: TColumn<TCategory>[] = [
    {
      header: "Category Name",
      accessor: (cat) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0 shadow-sm">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-xs text-white">
              {cat.name}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
              <Layers className="w-3 h-3 text-amber-400/80 shrink-0" />
              <span>{cat.department?.name || "Unassigned"}</span>
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
          <span className="badge badge-outline border-amber-400/30 text-amber-400 bg-amber-400/5 badge-sm font-bold gap-1">
            {deptName}
          </span>
        );
      },
    },
    {
      header: "Status",
      accessor: (cat) =>
        cat.isDeleted ? (
          <span className="badge badge-error badge-outline bg-error/10 border-error/30 text-error badge-sm font-bold">
            Inactive
          </span>
        ) : (
          <span className="badge badge-success badge-outline bg-success/10 border-success/30 text-success badge-sm font-bold gap-1">
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
          <div className="flex items-center gap-1.5 text-slate-300 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{dateStr}</span>
          </div>
        );
      },
    },
    {
      header: "Actions",
      align: "right",
      accessor: (cat) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory(cat);
              setIsEditModalOpen(true);
            }}
            className="btn btn-ghost btn-xs font-bold text-amber-400 gap-1 hover:bg-amber-400/10 border border-amber-400/20 hover:border-amber-400/40 rounded-xl cursor-pointer transition-all"
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
      {/* Main Categories Directory Table Container */}
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
            title="Category Catalog"
            subtitle="Organize product taxonomies, department mappings, and catalog structure."
            badgeText={meta?.total || categories.length}
            icon={<FolderTree className="w-5 h-5 text-amber-400" />}
            className="!bg-transparent !shadow-none !border-none text-slate-100"
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
                className="btn btn-sm gap-2 font-black shadow-lg shadow-amber-500/20 cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border-0 transition-all rounded-xl"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            }
            emptyTitle="No Categories Found"
            emptyMessage="There are currently no product categories created in the system."
            emptyIcon={<FolderTree className="w-6 h-6 text-amber-400" />}
            emptyAction={
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="btn btn-sm font-black mt-2 gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-xl"
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
        </div>
      </div>

      {/* REUSABLE CREATE CATEGORY MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
        className="!bg-[#170d2f] !border-white/10 text-slate-100 shadow-2xl relative overflow-hidden rounded-3xl"
      >
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />
        <CreateCategoryForm
          onSuccess={() => {
            setIsModalOpen(false);
            refetch();
          }}
        />
      </Modal>

      {/* REUSABLE UPDATE CATEGORY MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        }}
        size="md"
        className="!bg-[#170d2f] !border-white/10 text-slate-100 shadow-2xl relative overflow-hidden rounded-3xl"
      >
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />
        {selectedCategory && (
          <UpdateCategoryForm
            category={selectedCategory}
            onSuccess={() => {
              setIsEditModalOpen(false);
              setSelectedCategory(null);
              refetch();
            }}
          />
        )}
      </Modal>
    </>
  );
};

export default CategoriesData;
