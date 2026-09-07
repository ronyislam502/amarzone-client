import { TColumn } from "@/src/types/table";


export type TTableHeadProps<T> = {
  columns: TColumn<T>[];
}

const TableHead = <T,>({ columns }: TTableHeadProps<T>) => {
  return (
    <thead>
      <tr>
        {columns.map((col, cIdx) => {
          const alignClass =
            col.align === "center"
              ? "text-center"
              : col.align === "right"
                ? "text-right"
                : "text-left";

          return (
            <th key={cIdx} className={`${alignClass} ${col.className || ""}`}>
              {col.header}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

export default TableHead