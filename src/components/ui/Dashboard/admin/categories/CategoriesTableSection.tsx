import React, { Suspense } from "react";
import TableSkeleton from "../../../shared/skeleton/TableSkeleton";
import Categories from "@/src/app/(dashboard)/admin/categories/page";


const CategoriesTable = () => {
  return (
    <Suspense fallback={<TableSkeleton columns={5} rows={5} showAvatar={false} title="Product Categories" />}>
      <Categories />
    </Suspense>
  );
}

export default CategoriesTable;
