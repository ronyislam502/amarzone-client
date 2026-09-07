import React from "react";

export type TColumn<T> = {
    header: React.ReactNode;
    accessor: keyof T | ((row: T, index: number) => React.ReactNode);
    align?: "left" | "center" | "right";
    className?: string;
}

export type TTablePaginationConfig = {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
    onLimitChange?: (limit: number) => void;
}

export type TTableProps<T> = {
    columns: TColumn<T>[];
    data: T[];
    keyExtractor: (item: T, index: number) => string | number;
    title?: string;
    subtitle?: string;
    badgeText?: string | number;
    icon?: React.ReactNode;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    onRefresh?: () => void;
    isRefreshing?: boolean;
    headerActions?: React.ReactNode;
    isLoading?: boolean;
    isError?: boolean;
    errorMessage?: string;
    onRetry?: () => void;
    emptyTitle?: string;
    emptyMessage?: string;
    emptyIcon?: React.ReactNode;
    emptyAction?: React.ReactNode;
    pagination?: TTablePaginationConfig;
    className?: string;
}
