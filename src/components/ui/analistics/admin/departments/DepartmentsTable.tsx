import { Suspense } from "react";
import { TableSkeleton } from "@/src/components/ui/skeleton";
import DepartmentsData from "./DepartmentsData";

const DepartmentsTable = () => {
  return (
    <Suspense fallback={<TableSkeleton columns={4} rows={5} showAvatar={false} title="Business Departments" />}>
      <DepartmentsData />
    </Suspense>
  );
};

export default DepartmentsTable;
