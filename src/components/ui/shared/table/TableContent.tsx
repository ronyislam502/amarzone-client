
import DataTableHead from "./TableHead";
import TableBody from "./TableBody";
import { TColumn } from "@/src/types/table";

export type TTableContentProps<T> = {
  columns: TColumn<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string | number;
}

const TableContent = <T,>({
  columns,
  data,
  keyExtractor,
}: TTableContentProps<T>) => {
  return (
    <div className="overflow-x-auto pt-2">
      <table className="table table-zebra w-full text-xs">
        <DataTableHead columns={columns} />
        <TableBody
          data={data}
          columns={columns}
          keyExtractor={keyExtractor}
        />
      </table>
    </div>
  );
}

export default TableContent;
