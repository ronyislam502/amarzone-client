'use client';

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import CategoriesStats from "./CategoriesStats";
import CategoriesTable from "./CategoriesTable";
import CategoriesFilter, { CategoriesFilterState } from "./CategoriesFilter";
import { useAllCategoriesQuery, useDeleteCategoryMutation } from "@/redux/features/category/categoryApi";
import { useDebounce } from "@/components/shared/Debaounce";
import { TCategory } from "@/types/category";

const LIMIT = 10;

const CategoriesData = () => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<CategoriesFilterState>({
        search: "",
        status: "",
        department: "",
        sort: "",
    });

    const [deleteCategory] = useDeleteCategoryMutation();
    const debouncedSearch = useDebounce(
        filters.search || "",
        500
    );

    // Query server with debounced search, sort, page, limit, department, status
    const {
        data: categoriesData,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useAllCategoriesQuery({
        search: debouncedSearch,
        sort: filters.sort,
        page: String(page),
        limit: String(LIMIT),
        department: filters.department || undefined,
        status: filters.status,
    });

    const rawCategories = categoriesData?.data as TCategory[] || [];
    const meta = categoriesData?.meta;

    // Client-side fallback filtering/sorting
    const filteredCategories = useMemo(() => {
        let result = [...rawCategories];

        // Search filter
        const term = (filters.search || "").trim().toLowerCase();
        if (term) {
            result = result.filter((category) => {
                const name = (category.name || "").toLowerCase();
                const deptName = typeof category.department === "object"
                    ? (category.department?.name || "").toLowerCase()
                    : "";
                return name.includes(term) || deptName.includes(term);
            });
        }

        // Status filter
        if (filters.status) {
            result = result.filter((category) => {
                const isSuspended = category.isDeleted;
                if (filters.status === "active") {
                    return !isSuspended;
                }
                if (filters.status === "inactive") {
                    return isSuspended;
                }
                return true;
            });
        }

        // Department filter
        if (filters.department) {
            result = result.filter((category) => {
                const deptId = typeof category.department === "object"
                    ? category.department?._id
                    : category.department;
                return deptId === filters.department;
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
    }, [rawCategories, filters.search, filters.status, filters.department, filters.sort]);

    const handleFilterChange = (newFilters: Partial<CategoriesFilterState>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
        setPage(1);
    };

    const handleResetFilters = () => {
        setFilters({
            search: "",
            status: "",
            department: "",
            sort: "",
        });
        setPage(1);
    };

    const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete the category "${categoryName || "this category"}"?`
        );
        if (!confirmed) return;

        try {
            const res = await deleteCategory(categoryId).unwrap();
            toast.success(res?.message || "Category deleted successfully.");
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to delete category.");
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <CategoriesStats
                categories={rawCategories}
                isLoading={isLoading}
                meta={meta}
            />

            {/* Filter and Search Bar */}
            <CategoriesFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
            />

            {/* Categories Table */}
            <CategoriesTable
                categories={filteredCategories}
                meta={meta}
                isLoading={isLoading}
                isError={isError}
                error={error}
                refetch={refetch}
                isFetching={isFetching}
                page={page}
                limit={LIMIT}
                onPageChange={setPage}
                onDeleteCategory={handleDeleteCategory}
            />
        </div>
    );
};

export default CategoriesData;