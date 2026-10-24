import { TColumn } from "@/types/table";




export type TTableHeadProps<T> = {
  columns: TColumn<T>[];
}

const TableHead = <T,>({ columns }: TTableHeadProps<T>) => {
  return (
    <thead>
      <tr className="border-b border-white/10 bg-white/[0.03]">
        {columns.map((col, cIdx) => {
          const alignClass =
            col.align === "center"
              ? "text-center"
              : col.align === "right"
                ? "text-right"
                : "text-left";

          return (
            <th
              key={cIdx}
              className={`py-3.5 px-4 text-[14px] font-extrabold uppercase tracking-wider text-amber-400 bg-transparent border-none ${alignClass} ${col.className || ""}`}
            >
              {col.header}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

export default TableHead;