

import { TColumn } from "@/src/types/table";
import TableRow from "./TableRow";

export type TTableBodyProps<T> = {
  data: T[];
  columns: TColumn<T>[];
  keyExtractor: (item: T, index: number) => string | number;
}

const TableBody = <T,>({
  data,
  columns,
  keyExtractor,
}: TTableBodyProps<T>) => {
  return (
    <tbody>
      {data.map((row, rIdx) => (
        <TableRow
          key={keyExtractor(row, rIdx)}
          row={row}
          rowIndex={rIdx}
          columns={columns}
        />
      ))}
    </tbody>
  );
}


export default TableBody;