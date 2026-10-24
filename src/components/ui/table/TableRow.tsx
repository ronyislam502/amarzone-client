

import { TColumn } from "@/types/table";
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
    <tr className="border-b border-white/5 hover:bg-white/[0.03] transition-colors duration-150">
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
          <td
            key={cIdx}
            className={`py-3.5 px-4 text-slate-200 border-none ${alignClass} ${col.className || ""}`}
          >
            {content}
          </td>
        );
      })}
    </tr>
  );
}

export default TableRow;