"use client";

import { useState } from "react";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import {
  Building2,
  CheckCircle2,
  PlusCircle,
  Calendar,
  Edit2,
  Layers,
} from "lucide-react";
import { TColumn } from "@/src/types/table";
import AZTable from "../../../shared/AZTable";
import { TDepartment } from "@/src/types/department";
import Modal from "../../../shared/Modal";
import CreateDepartmentForm from "./CreateDepartment";
import UpdateDepartmentForm from "./UpdateDepartment";

const DepartmentsData: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<TDepartment | null>(null);

  // Queries & Mutations
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAllDepartmentsQuery({
    search: searchTerm,
    page: String(page),
    limit: String(limit),
  });

  const departments: TDepartment[] = responseData?.data || [];

  console.log('departments', departments)
  const meta = responseData?.meta;

  // Reusable Column Definitions
  const columns: TColumn<TDepartment>[] = [
    {
      header: "Department",
      accessor: (dept) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0 shadow-sm">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-xs text-white">
              {dept.name}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-amber-400/80 shrink-0" />
              <span>Catalog Division</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (dept) =>
        dept.isDeleted ? (
          <span className="badge badge-sm font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Inactive</span>
        ) : (
          <span className="badge badge-sm font-bold gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Active
          </span>
        ),
    },
    {
      header: "Created At",
      accessor: (dept) => {
        const dateStr = dept.createdAt
          ? new Date(dept.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
          : "N/A";

        return (
          <div className="flex items-center gap-1.5 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{dateStr}</span>
          </div>
        );
      },
    },
    {
      header: "Actions",
      align: "right",
      accessor: (dept) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => {
              setSelectedDepartment(dept);
              setIsEditModalOpen(true);
            }}
            className="btn btn-ghost btn-xs font-bold text-amber-400 gap-1 hover:bg-amber-400/10 border border-amber-400/20 hover:border-amber-400/40 rounded-lg cursor-pointer transition-all"
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
            title="Department Directory"
            subtitle="Manage business units, top-level divisions, and structural catalog mapping."
            badgeText={meta?.total || departments.length}
            icon={<Building2 className="w-5 h-5 text-amber-400" />}
            className="!bg-transparent !shadow-none !border-none text-slate-100"
            data={departments}
            columns={columns}
            keyExtractor={(dept) => dept._id}
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
            searchPlaceholder="Search departments..."
            headerActions={
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="btn btn-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black border-none shadow-lg shadow-amber-500/20 rounded-xl gap-2 cursor-pointer transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Department</span>
              </button>
            }
            emptyTitle="No Departments Found"
            emptyMessage="There are currently no departments created in the system."
            emptyIcon={<Building2 className="w-6 h-6 text-amber-400" />}
            emptyAction={
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="btn btn-xs bg-amber-400 text-slate-950 font-bold mt-2 gap-1 border-none hover:bg-amber-300 rounded-lg"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Create First Department
              </button>
            }
            pagination={{
              page,
              limit,
              total: meta?.total ?? departments.length,
              onPageChange: (p) => setPage(p),
              onLimitChange: (l) => {
                setLimit(l);
                setPage(1);
              },
            }}
          />
        </div>
      </div>

      {/* REUSABLE CREATE DEPARTMENT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
        className="!bg-[#170d2f] !border-white/10 text-slate-100 shadow-2xl relative overflow-hidden rounded-3xl"
      >
        <CreateDepartmentForm
          onSuccess={() => {
            setIsModalOpen(false);
            refetch();
          }}
        />
      </Modal>

      {/* REUSABLE UPDATE DEPARTMENT MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDepartment(null);
        }}
        size="md"
        className="!bg-[#170d2f] !border-white/10 text-slate-100 shadow-2xl relative overflow-hidden rounded-3xl"
      >
        {selectedDepartment && (
          <UpdateDepartmentForm
            department={selectedDepartment}
            onSuccess={() => {
              setIsEditModalOpen(false);
              setSelectedDepartment(null);
              refetch();
            }}
          />
        )}
      </Modal>
    </>
  );
};

export default DepartmentsData;
