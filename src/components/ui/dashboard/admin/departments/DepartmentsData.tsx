'use client';

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import DepartmentsStats from "./DepartmentsStats";
import DepartmentsTable from "./DepartmentsTable";
import DepartmentsFilter, { DepartmentsFilterState } from "./DepartmentsFilter";
import { useDebounce } from "@/components/shared/Debaounce";
import { TDepartment } from "@/types/department";
import { useAllDepartmentsQuery, useDeleteDepartmentMutation } from "@/redux/features/department/departmentApi";


const LIMIT = 10;

const DepartmentsData = () => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<DepartmentsFilterState>({
        search: "",
        status: "",
        sort: "",
    });

    const [deleteDepartment] = useDeleteDepartmentMutation();
    const debouncedSearch = useDebounce(
        filters.search || "",
        500
    );

    // Query server with debounced search, sort, page, limit, status
    const {
        data: departmentsData,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useAllDepartmentsQuery({
        search: debouncedSearch,
        sort: filters.sort,
        page: String(page),
        limit: String(LIMIT),
        status: filters.status,
    });

    const rawDepartments = departmentsData?.data as TDepartment[] || [];
    const meta = departmentsData?.meta;

    console.log("departmentdata", rawDepartments)


    // Client-side fallback filtering and sorting
    const filteredDepartments = useMemo(() => {
        let result = [...rawDepartments];

        console.log("result", result)

        // Search filter by department name
        const term = (filters.search || "").trim().toLowerCase();
        if (term) {
            result = result.filter((dept) => {
                const name = (dept.name || "").toLowerCase();
                return name.includes(term);
            });
        }

        // Status filter
        if (filters.status) {
            result = result.filter((dept) => {
                const isSuspended = Boolean(
                    dept.isDeleted ||
                    (dept as any).status === "inactive" ||
                    (dept as any).status === "archived" ||
                    (dept as any).status === "disabled"
                );
                if (filters.status === "active") {
                    return !isSuspended;
                }
                if (filters.status === "inactive") {
                    return isSuspended;
                }
                return true;
            });
        }

        // Sort order
        if (filters.sort === "name_asc") {
            result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        } else if (filters.sort === "name_desc") {
            result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        } else if (filters.sort === "oldest") {
            result.sort(
                (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
            );
        }

        return result;
    }, [rawDepartments, filters.search, filters.status, filters.sort]);

    const handleFilterChange = (newFilters: Partial<DepartmentsFilterState>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
        setPage(1);
    };

    const handleResetFilters = () => {
        setFilters({
            search: "",
            status: "",
            sort: "",
        });
        setPage(1);
    };

    const handleDeleteDepartment = async (departmentId: string, departmentName: string) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete the department "${departmentName || "this department"}"?`
        );
        if (!confirmed) return;

        try {
            const res = await deleteDepartment(departmentId).unwrap();
            toast.success(res?.message || "Department deleted successfully.");
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to delete department.");
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <DepartmentsStats
                departments={rawDepartments}
                isLoading={isLoading}
                meta={meta}
            />

            {/* Filter and Search Bar */}
            <DepartmentsFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
            />

            {/* Departments Table */}
            <DepartmentsTable
                departments={filteredDepartments}
                meta={meta}
                isLoading={isLoading}
                isError={isError}
                error={error}
                refetch={refetch}
                isFetching={isFetching}
                page={page}
                limit={LIMIT}
                onPageChange={setPage}
                onDeleteDepartment={handleDeleteDepartment}
            />
        </div>
    );
};

export default DepartmentsData;