import { TColumn } from "@/src/types/table";
import React from "react";

export type TDataTableRowProps<T> = {
  row: T;
  rowIndex: number;
  columns: TColumn<T>[];
}

const TableRow = <T,>({
  row,
  rowIndex,
  columns,
}: TDataTableRowProps<T>) => {
  return (
    <tr className="hover">
      {columns.map((col, cIdx) => {
        const alignClass =
          col.align === "center"
            ? "text-center"
            : col.align === "right"
              ? "text-right"
              : "text-left";

        let content: React.ReactNode = null;
        if (typeof col.accessor === "function") {
          content = col.accessor(row, rowIndex);
        } else if (col.accessor) {
          content = (row as any)[col.accessor];
        }

        return (
          <td key={cIdx} className={`${alignClass} ${col.className || ""}`}>
            {content}
          </td>
        );
      })}
    </tr>
  );
}

export default TableRow;