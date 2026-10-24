
import TableToolbar from "../ui/table/TableToolbar";

import TableError from "../ui/table/TableError";
import TableEmpty from "../ui/table/TableEmpty";
import TableContent from "../ui/table/TableContent";
import TablePagination from "../ui/table/TablePagination";
import { TTableProps } from "@/types/table";
import TableSkeleton from "./skeleton/TableSkeleton";


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


    return (
        <div
            className={`card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl my-4 p-5 sm:p-6 ${className}`}
        >
            {/* Top glowing accent border line */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />

            {/* Ambient background glow orbs */}
            <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-amber-500/15 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="absolute -bottom-16 right-1/4 w-56 h-56 bg-gradient-to-tl from-indigo-600/20 via-purple-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* High-tech dot matrix overlay */}
            <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

            {/* Table content */}
            <div className="relative z-10">
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

                {isLoading ? (
                    <TableSkeleton columns={columns.length} />
                ) : isError ? (
                    <TableError
                        errorMessage={errorMessage}
                        onRetry={onRetry}
                        className={className}
                    />
                ) : data.length === 0 ? (
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

                {pagination && (
                    <TablePagination pagination={pagination}
                        hasData={data.length > 0} />
                )}
            </div>
        </div>
    );
};

export default AZTable;
