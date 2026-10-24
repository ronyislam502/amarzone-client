
import DataTableHead from "./TableHead";
import TableBody from "./TableBody";
import { TColumn } from "@/types/table";


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
      <table className="table w-full text-xs text-slate-200 border-collapse">
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
