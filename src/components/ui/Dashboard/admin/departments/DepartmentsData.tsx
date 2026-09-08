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
  const meta = responseData?.meta;

  // Reusable Column Definitions
  const columns: TColumn<TDepartment>[] = [
    {
      header: "Department",
      accessor: (dept) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-xs text-base-content">
              {dept.name}
            </div>
            <div className="text-[10px] text-base-content/60 flex items-center gap-1">
              <Layers className="w-3 h-3 text-info shrink-0" />
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
          <span className="badge badge-error badge-sm font-bold">Inactive</span>
        ) : (
          <span className="badge badge-success badge-sm font-bold gap-1">
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
      accessor: (dept) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => {
              setSelectedDepartment(dept);
              setIsEditModalOpen(true);
            }}
            className="btn btn-ghost btn-xs font-bold text-primary gap-1 hover:bg-primary/10"
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
      <AZTable
        title="Department Directory"
        subtitle="Manage business units, top-level divisions, and structural catalog mapping."
        badgeText={meta?.total || departments.length}
        icon={<Building2 className="w-5 h-5 text-primary" />}
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
            className="btn btn-primary btn-sm gap-2 font-bold shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Department</span>
          </button>
        }
        emptyTitle="No Departments Found"
        emptyMessage="There are currently no departments created in the system."
        emptyIcon={<Building2 className="w-6 h-6" />}
        emptyAction={
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn btn-xs btn-primary font-bold mt-2 gap-1"
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

      {/* REUSABLE DAISYUI CREATE DEPARTMENT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
      >
        <CreateDepartmentForm
          onSuccess={() => {
            setIsModalOpen(false);
            refetch();
          }}
        />
      </Modal>

      {/* REUSABLE DAISYUI UPDATE DEPARTMENT MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDepartment(null);
        }}
        size="md"
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
