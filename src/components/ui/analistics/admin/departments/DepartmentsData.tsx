"use client";

import { useState } from "react";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import {
  Building2,
  PlusCircle,
  Edit2,
  Layers,
} from "lucide-react";
import { TColumn } from "@/src/types/table";
import AZTable from "../../../shared/AZTable";
import { TABLE_CARD_CN } from "@/src/lib/tableStyles";
import {
  TableCellEntity,
  TableCellStatus,
  TableCellDate,
  TableCellActions,
  TableActionButton,
} from "../../../shared/table";
import { TDepartment } from "@/src/types/department";
import Modal from "../../../shared/Modal";
import CreateDepartmentForm from "./CreateDepartment";
import UpdateDepartmentForm from "./UpdateDepartment";

const LIMIT = 10;

const DepartmentsData: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
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
    limit: String(LIMIT),
  });

  const departments: TDepartment[] = responseData?.data || [];
  const meta = responseData?.meta;

  // Reusable Column Definitions
  const columns: TColumn<TDepartment>[] = [
    {
      header: "Department",
      accessor: (dept) => (
        <TableCellEntity
          icon={<Building2 className="w-4 h-4" />}
          title={dept.name}
          subtitle="Catalog Division"
          subtitleIcon={<Layers className="w-3 h-3 text-amber-400/80" />}
        />
      ),
    },
    {
      header: "Status",
      accessor: (dept) => <TableCellStatus status={dept.isDeleted} />,
    },
    {
      header: "Created At",
      accessor: (dept) => <TableCellDate date={dept.createdAt} />,
    },
    {
      header: "Actions",
      align: "right",
      accessor: (dept) => (
        <TableCellActions>
          <TableActionButton
            label="Edit"
            icon={<Edit2 className="w-3 h-3" />}
            onClick={() => {
              setSelectedDepartment(dept);
              setIsEditModalOpen(true);
            }}
            variant="amber"
          />
        </TableCellActions>
      ),
    },
  ];

  return (
    <>
      <div className={TABLE_CARD_CN}>
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
            errorMessage={(error as { data?: { message?: string } })?.data?.message}
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
              limit: LIMIT,
              total: meta?.total ?? departments.length,
              onPageChange: (p) => setPage(p),
            }}
          />
        </div>
      </div>

      {/* REUSABLE CREATE DEPARTMENT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
        className="!bg-dashboard-category !border-white/10 text-slate-100 shadow-2xl relative overflow-hidden rounded-3xl"
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
        className="!bg-dashboard-category !border-white/10 text-slate-100 shadow-2xl relative overflow-hidden rounded-3xl"
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
