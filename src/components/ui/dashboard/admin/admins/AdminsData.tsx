'use client';

import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import AdminsStats from "./AdminsStats";
import AdminsTable from "./AdminsTable";
import AdminsFilter, { AdminsFilterState } from "./AdminsFilter";
import { useAllAdminsQuery, useDeleteAdminMutation } from "@/redux/features/admin/adminApi";
import { useDebounce } from "@/components/shared/Debaounce";
import { TAdmin } from "@/types/admin";

const LIMIT = 10;

const AdminsData = () => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<AdminsFilterState>({
        search: "",
        status: "",
        role: "",
        sort: "",
    });

    const [deleteAdmin] = useDeleteAdminMutation();
    const debouncedSearch = useDebounce(
        filters.search || "",
        500
    );

    // Fetch admins without server-side status/sort parameters (pure client-side filtering & sorting)
    const {
        data: adminsData,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useAllAdminsQuery({
        search: debouncedSearch,
    });

    const rawAdmins = (adminsData?.data as TAdmin[]) || [];

    // Client-side filtering and sorting
    const filteredAdmins = useMemo(() => {
        let result = [...rawAdmins];

        // Search query filter
        const term = (filters.search || "").trim().toLowerCase();
        if (term) {
            result = result.filter((admin) => {
                const name = (admin.name || "").toLowerCase();
                const email = (admin.email || "").toLowerCase();
                const phone = (admin.phone || "").toLowerCase();
                return name.includes(term) || email.includes(term) || phone.includes(term);
            });
        }

        // Status filter (Active vs Inactive/Suspended)
        if (filters.status) {
            result = result.filter((admin) => {
                const isSuspended = Boolean(admin.isDeleted);
                const userObj = typeof admin.user === "object" ? admin.user : null;
                const userStatus = userObj?.status?.toLowerCase();
                const directStatus = (admin as any)?.status?.toLowerCase();

                const isInactive =
                    isSuspended ||
                    userStatus === "blocked" ||
                    userStatus === "inactive" ||
                    userStatus === "suspended" ||
                    directStatus === "blocked" ||
                    directStatus === "inactive" ||
                    directStatus === "suspended";

                if (filters.status === "active") {
                    return !isInactive;
                }
                if (filters.status === "inactive") {
                    return isInactive;
                }
                return true;
            });
        }

        // Role filter (Super Administrator vs Platform Admin)
        if (filters.role) {
            result = result.filter((admin) => {
                const userObj = typeof admin.user === "object" ? admin.user : null;
                const rawRole = (
                    userObj?.role ||
                    (admin as any)?.role ||
                    (admin as any)?.userRole ||
                    ""
                ).toLowerCase();

                const isSuper =
                    rawRole === "super_admin" ||
                    rawRole === "superadmin" ||
                    rawRole === "super";

                if (filters.role === "super_admin") {
                    return isSuper;
                }
                if (filters.role === "admin") {
                    return !isSuper;
                }
                return true;
            });
        }

        // Sorting order
        if (filters.sort === "name_asc") {
            result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        } else if (filters.sort === "name_desc") {
            result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        } else if (filters.sort === "oldest") {
            result.sort(
                (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
            );
        } else {
            // Default: Newest first
            result.sort(
                (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
            );
        }

        return result;
    }, [rawAdmins, filters.search, filters.status, filters.role, filters.sort]);

    // Client-side pagination over filtered & sorted admins
    const totalFiltered = filteredAdmins.length;
    const paginatedAdmins = useMemo(() => {
        const startIndex = (page - 1) * LIMIT;
        return filteredAdmins.slice(startIndex, startIndex + LIMIT);
    }, [filteredAdmins, page]);

    const clientMeta = useMemo(() => {
        return {
            page,
            limit: LIMIT,
            total: totalFiltered,
            totalPage: Math.ceil(totalFiltered / LIMIT) || 1,
        };
    }, [page, totalFiltered]);

    const handleFilterChange = (newFilters: Partial<AdminsFilterState>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
        setPage(1);
    };

    const handleResetFilters = () => {
        setFilters({
            search: "",
            status: "",
            role: "",
            sort: "",
        });
        setPage(1);
    };

    const handleDeleteAdmin = async (adminId: string, adminName: string) => {
        const confirmed = window.confirm(
            `Are you sure you want to revoke privileges for ${adminName || "this administrator"}?`
        );
        if (!confirmed) return;

        try {
            const res = await deleteAdmin(adminId).unwrap();
            toast.success(res?.message || "Administrator privileges revoked successfully.");
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to revoke administrator privileges.");
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <AdminsStats
                admins={rawAdmins}
                isLoading={isLoading}
                meta={adminsData?.meta}
            />

            {/* Filter and Search Bar */}
            <AdminsFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
            />

            {/* Administrators Table */}
            <AdminsTable
                admins={paginatedAdmins}
                meta={clientMeta}
                isLoading={isLoading}
                isError={isError}
                error={error}
                refetch={refetch}
                isFetching={isFetching}
                page={page}
                limit={LIMIT}
                onPageChange={setPage}
                onDeleteAdmin={handleDeleteAdmin}
            />
        </div>
    );
};

export default AdminsData;