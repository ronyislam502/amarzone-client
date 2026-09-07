import { TTablePaginationConfig } from "@/src/types/table";
import Pagination from "../Pagination";


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
    <Pagination
      page={pagination.page}
      limit={pagination.limit}
      total={pagination.total}
      onPageChange={pagination.onPageChange}
      onLimitChange={pagination.onLimitChange}
    />
  );
}

export default TablePagination;