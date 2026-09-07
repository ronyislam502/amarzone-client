export type TPaginationProps = {
    page: number;
    total: number;
    limit: number;
    onPageChange: (newPage: number) => void;
    onLimitChange?: (newLimit: number) => void;
    limitOptions?: number[];
    className?: string;
}