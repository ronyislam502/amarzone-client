import { Suspense } from "react";
import TableSkeleton from "../../../shared/skeleton/TableSkeleton";
import AdminsPage from "@/src/app/(dashboard)/admin/admins/page";

const AdminsTable = () => {
  return (
    <Suspense fallback={<TableSkeleton columns={6} rows={5} showAvatar={true} title="System Administrators" />}>
      <AdminsPage />
    </Suspense>
  );
};

export default AdminsTable;
