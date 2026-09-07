"use client";

import { TTableProps } from "@/src/types/table";
import TableSkeleton from "./skeleton/TableSkeleton";
import TableContent from "./table/TableContent";
import TableEmpty from "./table/TableEmpty";
import TableError from "./table/TableError";
import TablePagination from "./table/TablePagination";
import TableToolbar from "./table/TableToolbar";



const AZTable = <T,>({
    columns,
    data,
    keyExtractor,
    title,
    subtitle,
    badgeText,
    icon,
    searchValue,
    onSearchChange,
    searchPlaceholder = "Search records...",
    onRefresh,
    isRefreshing = false,
    headerActions,
    isLoading = false,
    isError = false,
    errorMessage = "Failed to load data from server.",
    onRetry,
    emptyTitle = "No Records Found",
    emptyMessage = "There are no records to display at this time.",
    emptyIcon,
    emptyAction,
    pagination,
    className = "",
}: TTableProps<T>) => {
    // 1. Loading State
    if (isLoading) {
        return (
            <TableSkeleton
                columns={columns.length}
                rows={pagination?.limit || 5}
                title={title}
                className={className}
            />
        );
    }

    // 2. Error State
    if (isError) {
        return (
            <TableError
                errorMessage={errorMessage}
                onRetry={onRetry}
                className={className}
            />
        );
    }

    return (
        <div className={`card bg-base-100 shadow-xl border border-base-200 ${className}`}>
            <div className="card-body">
                {/* Header Toolbar */}
                <TableToolbar
                    title={title}
                    subtitle={subtitle}
                    badgeText={badgeText}
                    icon={icon}
                    searchValue={searchValue}
                    onSearchChange={onSearchChange}
                    searchPlaceholder={searchPlaceholder}
                    onRefresh={onRefresh}
                    isRefreshing={isRefreshing}
                    headerActions={headerActions}
                />

                {/* Empty State vs Table Content */}
                {data.length === 0 ? (
                    <TableEmpty
                        emptyTitle={emptyTitle}
                        emptyMessage={emptyMessage}
                        emptyIcon={emptyIcon}
                        emptyAction={emptyAction}
                        searchValue={searchValue}
                        onSearchChange={onSearchChange}
                    />
                ) : (
                    <TableContent
                        columns={columns}
                        data={data}
                        keyExtractor={keyExtractor}
                    />
                )}

                {/* Pagination */}
                <TablePagination
                    pagination={pagination}
                    hasData={data.length > 0}
                />
            </div>
        </div>
    );
};

export default AZTable;
