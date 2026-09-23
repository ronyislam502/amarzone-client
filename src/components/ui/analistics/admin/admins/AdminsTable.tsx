import { Suspense } from "react";
import TableSkeleton from "../../../shared/skeleton/TableSkeleton";
import AdminsData from "./AdminsData";

const AdminsTable = () => {
  return (
    <Suspense fallback={<TableSkeleton columns={6} rows={5} showAvatar={true} title="System Administrators" />}>
      <AdminsData />
    </Suspense>
  );
};

export default AdminsTable;
