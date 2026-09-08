import { Suspense } from "react";
import TableSkeleton from "../../../shared/skeleton/TableSkeleton";
import Departments from "@/src/app/(dashboard)/admin/departments/page";

const DepartmentsTable = () => {
  return (
    <Suspense fallback={<TableSkeleton columns={4} rows={5} showAvatar={false} title="Business Departments" />}>
      <Departments />
    </Suspense>
  );
};

export default DepartmentsTable;
