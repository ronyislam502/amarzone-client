import { TTablePaginationConfig } from "@/types/table";
import AZPagination from "../../shared/AZPagination";




export type DataTablePaginationProps = {
  pagination?: TTablePaginationConfig;
  hasData: boolean;
}

const TablePagination = ({
  pagination,
  hasData,
}: DataTablePaginationProps) => {
  if (!pagination || !hasData) return null;

  return (
    <AZPagination
      page={pagination.page}
      limit={pagination.limit}
      total={pagination.total}
      onPageChange={pagination.onPageChange}
      onLimitChange={pagination.onLimitChange}
    />
  );
}

export default TablePagination;